/**
 * ============================================================
 * HOOK: useDetalleMantenimiento
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Encapsula la carga del ticket, equipo, tareas, productos y
 * la lógica de alerta/eliminación para la pantalla de detalle.
 * Sigue el patrón del módulo finca (useFincaDetalle).
 */

import { useState, useEffect } from 'react';
import { getProductoById, getProductosInventario } from '../../inventarios/services/InventarioService.js';
import * as MantService from '../services/mantEquipoService.js';
import { obtenerTareas } from '../services/tareasService.js';

export function useDetalleMantenimiento({ id, alertaTipo, alertaMensaje, onNavigateToMain }) {

  const [ticket, setTicket]                               = useState(null);
  const [equipo, setEquipo]                               = useState(null);
  const [alerta, setAlerta]                               = useState(null);
  const [showConfirmModal, setShowConfirmModal]           = useState(false);
  const [tareasCatalog, setTareasCatalog]                 = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // ── Carga del catálogo de tareas ──────────────────────────────
  useEffect(() => {
    obtenerTareas().then(data => setTareasCatalog(data || []));
  }, []);

  // ── Carga del ticket, equipo y productos ──────────────────────
  useEffect(() => {
    const t = MantService.TICKETS_MOCK.find(x => x.id === id);
    if (!t) return;

    setTicket(t);
    const eq = MantService.EQUIPOS_MOCK.find(e => e.id === t.equipoId);
    setEquipo(eq);

    const list = getProductosInventario() || [];
    if (t.productos) {
      const mapped = t.productos
        .map(tp => list.find(p => String(p.id) === String(tp.id)))
        .filter(Boolean);
      setProductosSeleccionados(mapped);
    } else if (t.productoId) {
      const prod = getProductoById(t.productoId);
      setProductosSeleccionados(prod ? [prod] : []);
    } else {
      setProductosSeleccionados([]);
    }
  }, [id, MantService.TICKETS_MOCK]);

  // ── Alerta por props (éxito de edición anterior) ─────────────
  useEffect(() => {
    if (!alertaTipo || !alertaMensaje) return;
    setAlerta({ tipo: alertaTipo, mensaje: alertaMensaje });
    const timer = setTimeout(() => setAlerta(null), 4000);
    return () => clearTimeout(timer);
  }, [alertaTipo, alertaMensaje]);

  // ── Eliminación ──────────────────────────────────────────────
  const abrirModalEliminar = () => setShowConfirmModal(true);
  const cerrarModalEliminar = () => setShowConfirmModal(false);

  const confirmDelete = () => {
    setShowConfirmModal(false);
    MantService.eliminarTicket(id);
    onNavigateToMain({
      alertaTipo: 'danger',
      alertaMensaje: `El ticket ${id} ha sido eliminado correctamente del sistema.`,
    });
  };

  return {
    ticket,
    equipo,
    alerta,
    showConfirmModal,
    tareasCatalog,
    productosSeleccionados,
    abrirModalEliminar,
    cerrarModalEliminar,
    confirmDelete,
  };
}
