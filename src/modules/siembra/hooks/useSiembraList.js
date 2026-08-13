/**
 * ============================================================
 * HOOK DE LISTADO DE SIEMBRAS
 * ============================================================
 *
 * Centraliza el estado y la lógica del listado de siembras y
 * pre-crías: carga de datos, búsqueda, filtros y el toggle entre
 * registros activos y finalizados.
 *
 * FUNCIONALIDAD:
 * - Se suscribe a los cambios del servicio de siembras.
 * - Traduce los campos crudos del backend (snake_case: finca_id,
 *   fecha_siembra, pl_siembra, etc.) al formato que espera
 *   SiembraCard (camelCase, PL como "PL8", fechas en dd/mm/aaaa)
 * - Enriquece cada registro con el nombre real de finca, estanque,
 *   lote y proveedor de larva (fincaLabel/estanqueLabel/loteLabel/
 *   proveedorLabel), consultando los services reales del backend,
 *   ya que el backend solo devuelve los ids.
 * - Administra el texto de búsqueda (por finca, estanque, lote y
 *   proveedor de larva) y los filtros aplicados.
 * - Calcula el listado final a mostrar (siembrasFiltradas), según
 *   la vista activa:
 *     - "activas" (default): oculta las siembras/pre-crías ya
 *       finalizadas, para que no se acumulen en la pantalla
 *       principal.
 *     - "finalizadas": muestra únicamente las que ya completaron
 *       su ciclo.
 *
 * La pantalla utiliza este hook para renderizar el listado y
 * solo conserva la navegación (useRouter).
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { calcularProgresoCiclo } from "./siembraCalculos";
import { getSiembras } from "../services/siembra.service";
import { getPrecrias } from "../services/precria.service";
import { fincaService } from "../../finca/services/finca.service";
import { estanqueService } from "../../estanques/services/estanque.service";
import { useError } from "../../../shared/context/ErrorContext";
import { getLotes } from "../services/lote.service";
import { formatearFechaDesdeISO } from "./dateUtils";

function haFinalizado(registro) {
  return registro.estado === "Finalizada";
}

export default function useSiembraList() {
  const navigation = useNavigation();

  const [registros, setRegistros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ categories: [] });
  const [vista, setVista] = useState("activas");
  const [cargando, setCargando] = useState(true);
  const { mostrarError } = useError();
  const { mensajeExito } = useLocalSearchParams();
  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");
  const mensajeTimeoutRef = useRef(null);

  function mostrarMensaje(texto, variant) {
    if (mensajeTimeoutRef.current) {
      clearTimeout(mensajeTimeoutRef.current);
    }
    setMensaje(texto);
    setMensajeVariant(variant);

    const duracion = variant === "success" ? 3000 : 6000;
    mensajeTimeoutRef.current = setTimeout(() => {
      setMensaje("");
    }, duracion);
  }

  useEffect(() => {
    return () => {
      if (mensajeTimeoutRef.current) clearTimeout(mensajeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (mensajeExito) {
      mostrarMensaje(mensajeExito, "success");
    }
  }, [mensajeExito]);
  const tiposRegistro = [
    { label: "Siembra", value: "siembra" },
    { label: "Pre-Cría", value: "precria" },
  ];

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);

  useEffect(() => {
    fincaService
      .getFincas()
      .then((data) =>
        setFincas(data.map((f) => ({ label: f.nombreFinca, value: f.id }))),
      )
      .catch(() => setFincas([]));
  }, []);

  useEffect(() => {
    estanqueService
      .getEstanques()
      .then((todos) => {
        const mapeados = todos.map((estanque) => ({
          label: estanque.codigo,
          value: estanque.id,
        }));
        setEstanques(mapeados);
      })
      .catch(() => setEstanques([]));
  }, []);
  function obtenerNombresFincaEstanque(registro) {
    const finca = fincas.find((f) => f.value === registro.finca_id);
    const estanque = estanques.find((e) => e.value === registro.estanque_id);
    const lote = lotes.find((l) => l.id === registro.lote_larva_id);
    return {
      fincaLabel: finca?.label || "Sin finca",
      estanqueLabel: estanque?.label || "Sin estanque",
      loteLabel: lote?.codigo_lote || "",
      proveedorLabel: lote?.nombre_proveedor || "",
      codigoLoteLarva: lote?.codigo_lote || "",
    };
  }
  const [lotes, setLotes] = useState([]);
  useEffect(() => {
    getLotes()
      .then(setLotes)
      .catch(() => setLotes([]));
  }, []);

  function mapSiembraParaCard(s) {
    const base = {
      ...s,
      tipoRegistro: "siembra",
      siembraId: s.id,
      estanque: s.estanque_id,
      fechaSiembra: formatearFechaDesdeISO(s.fecha_siembra),
      cantidadSembrada: s.cantidad_sembrada,
      plSiembra: s.pl_siembra != null ? `PL${s.pl_siembra}` : "",
      duracionCiclo: s.duracion_ciclo ?? 90, // columna real en "siembras" una vez que el backend la agregue
      produccionKg: Number(s.produccion_kg ?? 0),
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
      const [siembras, precrias] = await Promise.all([
        getSiembras(),
        getPrecrias(),
      ]);
      setRegistros([
        ...siembras.map(mapSiembraParaCard),
        ...precrias.map(mapPrecriaParaCard),
      ]);
    } catch (err) {
      mostrarError(err);
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
      .filter((r) => (vista === "activas" ? !haFinalizado(r) : haFinalizado(r)))
      .map((r) => ({ ...r, ...obtenerNombresFincaEstanque(r) }))
      .filter((r) => {
        const texto = busqueda.trim().toLowerCase();
        const coincideTexto =
          !texto ||
          r.estanqueLabel.toLowerCase().includes(texto) ||
          r.fincaLabel.toLowerCase().includes(texto) ||
          r.loteLabel.toLowerCase().includes(texto) ||
          r.proveedorLabel.toLowerCase().includes(texto);

        const registroTipo = r.tipoRegistro || "siembra";
        const coincideTipo =
          filtros.categories.length === 0 ||
          filtros.categories.includes(registroTipo);

        return coincideTexto && coincideTipo;
      });
  }, [busqueda, filtros, registros, fincas, estanques, lotes, vista]);



  return {
    siembrasFiltradas,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    vista,
    setVista,
    tiposRegistro,
    cargando,
    mensaje,
    mensajeVariant,
    recargar: cargar,
  };
}
