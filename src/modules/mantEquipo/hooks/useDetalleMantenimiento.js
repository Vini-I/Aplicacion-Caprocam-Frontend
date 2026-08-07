/**
 * HOOK: useDetalleMantenimiento
 * Encapsula la carga del ticket desde el backend, equipo asociado,
 * tareas, productos y lógica de eliminación para DetalleMantenimiento.
 *
 * @dependencies - InventarioService, mantEquipoService, tareasService, equiposService
 * @validations  - Expone errorCarga (fallo al cargar el ticket) y alerta
 *                 (éxito de edición previa o fallo al eliminar) para
 *                 notificación en UI.
 * @navigation   - Callback onNavigateToMain tras eliminación exitosa.
 */

import { useState, useEffect } from 'react';
import { getProductoById, getProductosInventario } from '../../inventarios/services/InventarioService.js';
import * as MantService from '../services/mantEquipoService.js';
import { obtenerTareas } from '../services/tareasService.js';
import { equiposService } from '../services/equiposService.js';
import { ALERTAS_NOTIFICACIONES, MENSAJES_ERROR_CARGA, TEXTOS_DETALLE } from '../constants/mantEquipoMensajes.js';

export function useDetalleMantenimiento({ id, alertaTipo, alertaMensaje, onNavigateToMain }) {

  const [ticket, setTicket] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tareasCatalog, setTareasCatalog] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // ── Carga del catálogo de tareas ──────────────────────────────
  useEffect(() => {
    obtenerTareas()
      .then(data => setTareasCatalog(data || []))
      .catch(err => console.warn('useDetalleMantenimiento.obtenerTareas:', err?.message || err));
  }, []);

  // ── Carga del ticket, equipo y productos desde el backend ─────
  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setErrorCarga(null);
      try {
        const t = await MantService.obtenerTicketPorId(id);
        setTicket(t);

        // Cargar equipo asociado al ticket
        if (t.equipoId) {
          try {
            const eq = await equiposService.getEquipoById(t.equipoId);
            setEquipo(eq);
          } catch (errEquipo) {
            console.warn('useDetalleMantenimiento: no se pudo cargar el equipo:', errEquipo?.message || errEquipo);
            setEquipo(null);
          }
        }

        // Mapear productos del ticket contra el inventario local
        let list = [];
        try {
          const resProd = await getProductosInventario();
          const raw = Array.isArray(resProd) ? resProd : (Array.isArray(resProd?.data) ? resProd.data : []);
          list = raw.map(p => ({
            ...p,
            id: p.id || p.producto_id || p.productoId,
            nombre: p.nombre || p.nombreProducto || p.producto?.nombre || TEXTOS_DETALLE.labelProductoFallback(p.id),
            precioUnidad: p.precioUnidad || p.precio_unidad || p.precio || 0,
          }));
        } catch (errProd) {
          console.warn('useDetalleMantenimiento: no se pudo obtener inventario:', errProd?.message || errProd);
        }

        if (t.productos && t.productos.length > 0) {
          const mapped = t.productos
            .map(tp => {
              const prodId = String(tp.productoId || tp.producto_id || tp.id || '');
              const enInventario = list.find(p =>
                String(p.productoId || p.producto_id || p.id) === prodId ||
                String(p.id) === prodId
              );
              return {
                ...(enInventario || {}),
                id:            tp.id || prodId,
                productoId:    prodId,
                nombre:        tp.nombre || enInventario?.nombre || TEXTOS_DETALLE.labelProductoFallback(prodId),
                precioUnidad:  Number(tp.costoUnitario || tp.costo_unitario || enInventario?.precioUnidad) || 0,
                costoUnitario: Number(tp.costoUnitario || tp.costo_unitario || enInventario?.precioUnidad) || 0,
                cantidad:      Number(tp.cantidad) || 1,
                subtotal:      tp.subtotal !== undefined ? Number(tp.subtotal) : ((Number(tp.cantidad) || 1) * (Number(tp.costoUnitario || tp.costo_unitario || enInventario?.precioUnidad) || 0)),
              };
            })
            .filter(Boolean);
          setProductosSeleccionados(mapped);
        } else if (t.productoId) {
          try {
            const prod = await getProductoById(t.productoId);
            setProductosSeleccionados(prod ? [prod] : []);
          } catch (errProd) {
            console.warn('useDetalleMantenimiento: no se pudo obtener producto por ID:', errProd?.message || errProd);
            setProductosSeleccionados([]);
          }
        } else {
          setProductosSeleccionados([]);
        }
      } catch (err) {
        setErrorCarga(MENSAJES_ERROR_CARGA.errorCargarTicket);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  // ── Alerta por props (éxito de edición anterior) ─────────────
  useEffect(() => {
    if (!alertaTipo || !alertaMensaje) return;
    setAlerta({ tipo: alertaTipo, mensaje: alertaMensaje });
  }, [alertaTipo, alertaMensaje]);

  useEffect(() => {
    if (!alerta) return;
    const timer = setTimeout(() => setAlerta(null), 4000);
    return () => clearTimeout(timer);
  }, [alerta]);

  // ── Eliminación ──────────────────────────────────────────────
  const abrirModalEliminar  = () => setShowConfirmModal(true);
  const cerrarModalEliminar = () => setShowConfirmModal(false);

  const cambiarEstadoTarea = async (tarea) => {
    if (!tarea?.id) return;

    const nuevoEstado = tarea.realizada ? 'Pendiente' : 'Realizado';

    try {
      await MantService.actualizarEstadoTareaEnTicket(tarea.id, nuevoEstado);
      setTicket(prev => prev ? {
        ...prev,
        tareas: (prev.tareas || []).map(item => item.id === tarea.id
          ? { ...item, estado: nuevoEstado, realizada: nuevoEstado === 'Realizado' }
          : item),
      } : prev);
      setAlerta({
        tipo: 'success',
        mensaje: nuevoEstado === 'Realizado'
          ? 'Tarea finalizada correctamente.'
          : 'Tarea marcada como pendiente.',
      });
    } catch (err) {
      setAlerta({
        tipo: 'danger',
        mensaje: 'No se pudo actualizar el estado de la tarea.',
      });
    }
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      await MantService.eliminarTicket(id);
      onNavigateToMain({
        alertaTipo:    'success',
        alertaMensaje: ALERTAS_NOTIFICACIONES.exitoEliminarTicket(id),
      });
    } catch (err) {
      setAlerta({
        tipo:    'danger',
        mensaje: MENSAJES_ERROR_CARGA.errorEliminarTicket,
      });
    }
  };

  return {
    ticket,
    equipo,
    alerta,
    cargando,
    errorCarga,
    showConfirmModal,
    tareasCatalog,
    productosSeleccionados,
    abrirModalEliminar,
    cerrarModalEliminar,
    cambiarEstadoTarea,
    confirmDelete,
  };
}