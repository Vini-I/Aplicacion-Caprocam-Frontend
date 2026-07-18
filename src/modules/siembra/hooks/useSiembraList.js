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

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { calcularProgresoCiclo } from "./siembraCalculos";

import {
  obtenerFincas,
  obtenerProveedoresLarva,
  obtenerSiembras,
  subscribeToSiembras,
} from "../services/SiembraService";

function haFinalizado(registro) {
  if (registro.tipoRegistro === "precria") {
    return registro.estado === "Finalizada";
  }

  return calcularProgresoCiclo(registro).progreso >= 100;
}

export default function useSiembraList() {
  const router = useRouter();

  const [siembras, setSiembras] = useState(() => obtenerSiembras());
  const [fincaLabels, setFincaLabels] = useState({});

  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  useEffect(() => {
    const unsubscribe = subscribeToSiembras(setSiembras);

    setSiembras(obtenerSiembras());

    const fincas = obtenerFincas();
    setFincaLabels(
      fincas.reduce((acc, finca) => {
        acc[finca.value] = finca.label;
        return acc;
      }, {}),
    );

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSiembras(obtenerSiembras());
    }, []),
  );

  const tiposRegistro = useMemo(
    () => [
      { label: "Siembra", value: "siembra" },
      { label: "Pre-Cría", value: "precria" },
    ],
    [],
  );

  const proveedoresRegistro = useMemo(() => obtenerProveedoresLarva(), []);

  const siembrasFiltradas = useMemo(() => {
    return siembras
      .filter((registro) => !haFinalizado(registro))
      .filter((registro) => {
        const texto = busqueda.toLowerCase();
        const coincideTexto =
          registro.finca.toLowerCase().includes(texto) ||
          registro.estanque.toLowerCase().includes(texto) ||
          registro.codigoLoteLarva.toLowerCase().includes(texto) ||
          (registro.proveedorLarva || "").toLowerCase().includes(texto);

        const registroTipo = registro.tipoRegistro || "siembra";
        const coincideTipo =
          filtros.categories.length === 0 ||
          filtros.categories.includes(registroTipo);

        const coincideProveedor =
          filtros.suppliers.length === 0 ||
          filtros.suppliers.includes(registro.proveedorLarva || "");

        return coincideTexto && coincideTipo && coincideProveedor;
      });
  }, [busqueda, filtros, siembras]);

  const handleNuevaSiembra = useCallback(() => {
    router.push("/siembra/nueva");
  }, [router]);

  const handleDetalleSiembra = useCallback(
    (siembraId) => {
      router.push({
        pathname: "/siembra/detalle",
        params: { id: siembraId },
      });
    },
    [router],
  );

  return {
    fincaLabels,

    busqueda,
    setBusqueda,

    filtros,
    setFiltros,

    tiposRegistro,
    proveedoresRegistro,

    siembrasFiltradas,

    handleNuevaSiembra,

    handleDetalleSiembra,
  };
}
