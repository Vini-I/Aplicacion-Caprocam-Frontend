/**
 * ============================================================
 * HOOK DE DETALLE DE VENTAS
 * ============================================================
 *
 * Centraliza la lógica de carga de parámetros, filtros y
 * opciones de selección para la pantalla de detalle de ventas.
 */

import { useMemo } from "react";

import { fincas } from "../../finca/screens/FincaData.js";
import { estanques } from "../../mantCrecimiento/services/EstanqueData.js";
import { obtenerIdNumericoFinca } from "./useVenta.js";

export function useDetalleVenta() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const ventas = useMemo(() => {
    if (typeof params.ventas === "string") {
      try {
        return JSON.parse(params.ventas);
      } catch {
        return [];
      }
    }

    return [];
  }, [params.ventas]);

  const fincaInicial = typeof params.fincaSeleccionada === "string" ? params.fincaSeleccionada : "";
  const estanqueInicial = typeof params.estanqueSeleccionado === "string" ? params.estanqueSeleccionado : "";

  const [fincaFiltro, setFincaFiltro] = useState(fincaInicial);
  const [estanqueFiltro, setEstanqueFiltro] = useState(estanqueInicial);

  const opcionesFincas = useMemo(
    () =>
      fincas.map((finca) => ({
        label: finca.nombre,
        value: finca.codigoInterno,
      })),
    [],
  );

  const opcionesEstanques = useMemo(() => {
    const finca = fincas.find((item) => item.codigoInterno === fincaFiltro);

    if (!finca) return [];

    const fincaId = obtenerIdNumericoFinca(finca.codigoInterno);

    return estanques
      .filter(
        (estanque) => estanque.fincaNombre === finca.nombre || estanque.fincaId === fincaId,
      )
      .map((estanque) => ({
        label: `${estanque.codigo} - ${estanque.nombre}`,
        value: String(estanque.id),
      }));
  }, [fincaFiltro]);

  const ventasFiltradas = useMemo(() => {
    return (ventas || []).filter((venta) => {
      const coincideFinca = !fincaSeleccionada || venta.fincaId === fincaSeleccionada;
      const coincideEstanque = !estanqueSeleccionado || venta.estanqueId === estanqueSeleccionado;

      return coincideFinca && coincideEstanque;
    });
  }, [ventas, fincaSeleccionada, estanqueSeleccionado]);

  const hayFiltro = Boolean(fincaSeleccionada && estanqueSeleccionado);

  const mensajeDetalle = hayFiltro
    ? "Mostrando solo las ventas de la finca y estanque seleccionados."
    : "Seleccione una finca y un estanque para ver su historial de ventas.";

  const handleFincaChange = useCallback((value) => {
    setFincaFiltro(value);
    setEstanqueFiltro("");
  }, []);

  const handleEstanqueChange = useCallback((value) => {
    setEstanqueFiltro(value);
  }, []);

  return {
    ventas,
    fincaFiltro,
    estanqueFiltro,
    opcionesFincas,
    opcionesEstanques,
    ventasFiltradas,
    mensajeDetalle,
    hayFiltro,
    isWide,
    handleFincaChange,
    handleEstanqueChange,
  };
}
