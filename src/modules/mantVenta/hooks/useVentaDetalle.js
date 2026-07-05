/**
 * ============================================================
 * HOOK DE FILTRADO DE DETALLE DE VENTAS
 * ============================================================
 *
 * Aplica los filtros de finca y estanque para mostrar los
 * registros de ventas correspondientes.
 */

import { useMemo } from "react";

export function useVentaDetalle({ ventas = [], fincaSeleccionada = "", estanqueSeleccionado = "" }) {
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

  return {
    ventasFiltradas,
    hayFiltro,
    mensajeDetalle,
  };
}
