/**
 * HOOK: useDetalleMantenimiento
 * Encapsula la carga del ticket desde el backend, equipo asociado,
 * tareas, productos y lógica de eliminación para DetalleMantenimiento.
 *
 * @dependencies - InventarioService, mantEquipoService, tareasService, equiposService
 * @validations  - Expone errorCarga y errorEliminar para notificación en UI.
 * @navigation   - Callback onNavigateToMain tras eliminación exitosa.
 */

import { useState, useEffect } from 'react';
import { getProductoById, getProductosInventario } from '../../inventarios/services/InventarioService.js';
import * as MantService from '../services/mantEquipoService.js';
import { obtenerTareas } from '../services/tareasService.js';
import { equiposService } from '../services/equiposService.js';

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
            nombre: p.nombre || p.nombreProducto || p.producto?.nombre || `Producto ${p.id}`,
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
                nombre:        tp.nombre || enInventario?.nombre || `Producto ${prodId}`,
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
        console.error('useDetalleMantenimiento.cargar:', err?.message || err);
        setErrorCarga('No se pudo cargar el ticket. Verifica la conexión e intenta de nuevo.');
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
    const timer = setTimeout(() => setAlerta(null), 4000);
    return () => clearTimeout(timer);
  }, [alertaTipo, alertaMensaje]);

  // ── Eliminación ──────────────────────────────────────────────
  const abrirModalEliminar  = () => setShowConfirmModal(true);
  const cerrarModalEliminar = () => setShowConfirmModal(false);

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      await MantService.eliminarTicket(id);
      onNavigateToMain({
        alertaTipo:    'danger',
        alertaMensaje: `El ticket ${id} ha sido eliminado correctamente del sistema.`,
      });
    } catch (err) {
      console.error('useDetalleMantenimiento.confirmDelete:', err?.message || err);
      setAlerta({
        tipo:    'danger',
        mensaje: 'No se pudo eliminar el ticket. Verifica la conexión e intenta de nuevo.',
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
    confirmDelete,
  };
}