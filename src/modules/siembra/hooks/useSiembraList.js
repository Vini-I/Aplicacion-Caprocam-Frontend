/**
 * ============================================================
 * HOOK DE LISTADO DE SIEMBRAS
 * ============================================================
 *
 * Centraliza el estado y la lógica del listado de siembras y
 * pre-crías: carga de datos, búsqueda, filtros y el ocultado
 * automático de registros ya finalizados.
 *
 * FUNCIONALIDAD:
 * - Se suscribe a los cambios del servicio de siembras.
 * - Traduce los campos crudos del backend (snake_case: finca_id,
 *   fecha_siembra, pl_siembra, etc.) al formato que espera
 *   SiembraCard (camelCase, PL como "PL8", fechas en dd/mm/aaaa)
 * - Enriquece cada registro con el nombre real de finca y estanque
 *   (fincaLabel/estanqueLabel) usando el catálogo de
 *   fincaEstanqueLocal, ya que el backend solo devuelve los ids.
 * - Administra el texto de búsqueda y los filtros aplicados.
 * - Calcula el listado final a mostrar (siembrasFiltradas).
 * - Oculta del listado principal las siembras y pre-crías que ya
 *   completaron su ciclo, para que no se acumulen tarjetas de
 *   registros finalizados en la pantalla principal:
 *     - Pre-Cría: se oculta cuando fue finalizada explícitamente
 *       (estado === "Finalizada", vía el botón "Finalizar Pre-Cría").
 *     - Siembra: se oculta al alcanzar el 100% del ciclo
 *       (día actual >= duración del ciclo), ya que este módulo no
 *       cuenta con una acción de cierre equivalente a la de Pre-Cría.
 *
 * La pantalla utiliza este hook para renderizar el listado y
 * solo conserva la navegación (useRouter).
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigation, useRouter } from "expo-router";
import { calcularProgresoCiclo } from "./siembraCalculos";
import { getSiembras } from "../services/siembra.service";
import { getPrecrias } from "../services/precria.service";
import { obtenerFincas, obtenerEstanquesPorFinca } from "./fincaEstanqueLocal";
import { formatearFechaDesdeISO } from "./dateUtils";

function haFinalizado(registro) {
  if (registro.tipoRegistro === "precria")
    return registro.estado === "Finalizada";
  return calcularProgresoCiclo(registro).progreso >= 100;
}

export default function useSiembraList() {
  const router = useRouter();
  const navigation = useNavigation();

  const [registros, setRegistros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ categories: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const tiposRegistro = [
    { label: "Siembra", value: "siembra" },
    { label: "Pre-Cría", value: "precria" },
  ];

  const fincas = useMemo(() => obtenerFincas(), []);

  function obtenerNombresFincaEstanque(registro) {
    const finca = fincas.find((f) => f.value === registro.finca_id);
    // Los estanques están indexados por finca en el mock - buscamos
    // dentro de los del finca_id correspondiente.
    const estanque = obtenerEstanquesPorFinca(registro.finca_id).find(
      (e) => e.value === registro.estanque_id,
    );
    return {
      fincaLabel: finca?.label || "Sin finca",
      estanqueLabel: estanque?.label || "Sin estanque",
    };
  }

  function mapSiembraParaCard(s) {
    const base = {
      ...s,
      tipoRegistro: "siembra",
      siembraId: s.id,
      estanque: s.estanque_id,
      fechaSiembra: formatearFechaDesdeISO(s.fecha_siembra),
      cantidadSembrada: s.cantidad_sembrada,
      plSiembra: s.pl_siembra != null ? `PL${s.pl_siembra}` : "",
      diasMaduracion: s.duracion_dias ?? 90, // no hay columna real en "siembras"; se usa el default del formulario
    };
    const { diaActual, totalDias } = calcularProgresoCiclo(base);
    return { ...base, diasCultivo: diaActual, duracionDias: totalDias };
  }

  function mapPrecriaParaCard(p) {
    const base = {
      ...p,
      tipoRegistro: "precria",
      siembraId: p.id,
      estanque: p.estanque_id,
      fechaInicio: formatearFechaDesdeISO(p.fecha_inicio),
      cantidadInicial: p.cantidad_inicial,
      cantidadFinal: p.cantidad_final,
      plInicial: p.pl_inicial != null ? `PL${p.pl_inicial}` : "",
      plFinal: p.pl_final != null ? `PL${p.pl_final}` : "",
      duracionDias: p.duracion_dias,
    };
    const { diaActual, totalDias } = calcularProgresoCiclo(base);
    return { ...base, diasCultivo: diaActual, duracionDias: totalDias };
  }

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const [siembras, precrias] = await Promise.all([
        getSiembras(),
        getPrecrias(),
      ]);
      setRegistros([
        ...siembras.map(mapSiembraParaCard),
        ...precrias.map(mapPrecriaParaCard),
      ]);
    } catch (err) {
      setError("No fue posible cargar las siembras.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const unsubscribe = navigation.addListener("focus", cargar);
    return unsubscribe;
  }, [navigation, cargar]);

  const siembrasFiltradas = useMemo(() => {
    return registros
      .filter((r) => !haFinalizado(r))
      .map((r) => ({ ...r, ...obtenerNombresFincaEstanque(r) }))
      .filter((r) => {
        const texto = busqueda.toLowerCase();
        const coincideTexto =
          !texto ||
          r.estanqueLabel.toLowerCase().includes(texto) ||
          r.fincaLabel.toLowerCase().includes(texto);

        const registroTipo = r.tipoRegistro || "siembra";
        const coincideTipo =
          filtros.categories.length === 0 ||
          filtros.categories.includes(registroTipo);

        return coincideTexto && coincideTipo;
      });
  }, [busqueda, filtros, registros, fincas]);

  const handleNuevaSiembra = useCallback(
    () => router.push("/siembra/nueva"),
    [router],
  );
  const handleDetalleSiembra = useCallback(
    (registro) =>
      router.push({
        pathname: "/siembra/detalle",
        params: { id: registro.id, tipoRegistro: registro.tipoRegistro },
      }),
    [router],
  );

  return {
    siembrasFiltradas,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    tiposRegistro,
    cargando,
    error,
    handleNuevaSiembra,
    handleDetalleSiembra,
    recargar: cargar,
  };
}
