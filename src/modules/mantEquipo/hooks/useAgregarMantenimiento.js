/**
 * ============================================================
 * HOOK: useAgregarMantenimiento
 * ============================================================
 *
 * Encapsula toda la lógica de estado, validación y submit del
 * formulario de creación de un ticket de mantenimiento. Sigue
 * el patrón del módulo finca (useFincaEditar).
 *
 * @dependencies - MantService (mantEquipoService) para crear y actualizar tickets
 *               - getProductosInventario (InventarioService)
 *               - mantEquipoUtils, dateUtils (shared)
 * @validations  - Campos obligatorios: titulo, equipoId, descripcion, tareas.
 *               - No existe límite de tickets por equipo; esa validación
 *                 fue descartada y no debe reintroducirse.
 * @navigation   - onNavigateToMain → pantalla principal de mantenimiento.
 */

import { useState, useEffect } from 'react';
import { getProductosInventario } from '../../inventarios/services/InventarioService.js';
import * as MantService from '../services/mantEquipoService.js';
import { obtenerFechaHoraActual, validarCostoManoObra, formatearNombreHerramienta } from '../utils/mantEquipoUtils.js';
import { parseDate } from '../../../shared/utils/dateUtils.js';


export function useAgregarMantenimiento({ onNavigateToMain }) {

  // ── Campos del formulario ─────────────────────────────────────
  const [titulo, setTitulo]                               = useState('');
  const [descripcion, setDescripcion]                     = useState('');
  const [equipoId, setEquipoId]                           = useState('');
  const [estadoEquipo, setEstadoEquipo]                   = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado]       = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas]     = useState([]);
  const [fecha, setFecha]                                 = useState(obtenerFechaHoraActual());

  const [tipoPersonal, setTipoPersonal]                   = useState('interno');
  const [costoManoObra, setCostoManoObra]                 = useState('');
  const [estadoTicket, setEstadoTicket]                   = useState('en_espera');

  // ── Productos / insumos ──────────────────────────────────────
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productosList, setProductosList]                   = useState([]);
  const [alertaStock, setAlertaStock]                       = useState('');

  // ── Validación ───────────────────────────────────────────────
  const [errores, setErrores]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Carga inicial de productos ────────────────────────────────
  useEffect(() => {
    async function cargarProductos() {
      try {
        const data = await getProductosInventario();
        const raw = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        const list = raw.map(p => ({
          ...p,
          id: p.id || p.producto_id || p.productoId,
          nombre: p.nombre || p.nombreProducto || p.producto?.nombre || `Producto ${p.id}`,
          precioUnidad: p.precioUnidad || p.precio_unidad || p.precio || 0,
          stockMaximo: p.cantidad !== undefined ? p.cantidad : (p.stock !== undefined ? p.stock : 999),
        }));
        setProductosList(list);
      } catch (err) {
        console.error('Error al cargar productos del inventario:', err);
        setProductosList([]);
      }
    }
    cargarProductos();
  }, []);

  // ── Cálculo reactivo del costo total ─────────────────────────
  const numManoObra   = parseFloat(costoManoObra) || 0;
  const precioInsumos = productosSeleccionados.reduce(
    (sum, p) => sum + ((parseInt(p.cantidad || 1, 10)) * (parseFloat(p.precioUnidad) || 0)), 0
  );
  const costoTotal = numManoObra + precioInsumos;

  // ── Handlers de equipo ────────────────────────────────────────
  const seleccionarEquipoById = (eq) => {
    if (!eq) return;
    setEquipoSeleccionado(eq);
    setEquipoId(eq.id);
    setEstadoEquipo(eq.estado || '');
    if (errores.equipoId) setErrores((prev) => { const s = { ...prev }; delete s.equipoId; return s; });
  };

  const quitarEquipo = () => {
    setEquipoSeleccionado(null);
    setEquipoId('');
    setEstadoEquipo('');

  };

  // ── Handlers de productos ─────────────────────────────────────
  const agregarProducto = (prodConCantidad) => {
    if (!prodConCantidad) return;
    setAlertaStock('');
    setProductosSeleccionados(prev => {
      const existe = prev.some(x => x.id === prodConCantidad.id);
      if (existe) {
        return prev.map(x => x.id === prodConCantidad.id ? { ...x, cantidad: x.cantidad + prodConCantidad.cantidad } : x);
      }
      return [...prev, prodConCantidad];
    });
  };

  const cambiarCantidadProducto = (prodId, nuevaCantidad) => {
    setAlertaStock('');
    const prod = productosSeleccionados.find(x => String(x.id) === String(prodId));
    const stockMax = prod?.stockMaximo !== undefined ? prod.stockMaximo : 999;

    const val = String(nuevaCantidad).replace(/[^0-9]/g, '');
    let qty = val === '' ? 1 : parseInt(val, 10) || 1;

    if (qty > stockMax) {
      qty = stockMax;
      setAlertaStock(`No hay más stock disponible para "${prod?.nombre}". (Stock máximo en inventario: ${stockMax})`);
    }

    qty = Math.max(1, qty);

    setProductosSeleccionados(prev =>
      prev.map(p => (String(p.id) === String(prodId) ? { ...p, cantidad: qty } : p))
    );
  };

  const quitarProducto = (prodId) => {
    setAlertaStock('');
    setProductosSeleccionados(prev => prev.filter(p => p.id !== prodId));
  };

  // ── Validación ────────────────────────────────────────────────
  const validar = () => {
    const err = {};
    if (!titulo.trim())      err.titulo      = true;
    if (!equipoId)           err.equipoId    = true;
    if (!descripcion.trim()) err.descripcion = true;
    if (tareasSeleccionadas.length === 0) err.tareas = true;
    if (!validarCostoManoObra(costoManoObra)) {
      err.costoManoObra = true;
    }
    if (estadoTicket === 'Terminado' && tareasSeleccionadas.some(t => !t.realizada)) {
      err.tareasPendientes = true;
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleCrear = async () => {
    setSubmitted(true);
    if (!validar()) return;

    const payload = {
      equipoId,
      titulo:          titulo.trim(),
      descripcion:     descripcion.trim(),
      tareas:          tareasSeleccionadas,
      productos:       productosSeleccionados,
      estado:          estadoTicket,
      estadoEquipo,
      fechaCreacion:   parseDate(fecha) || new Date(),
      tipoPersonal,
      costoManoObra:   parseFloat(costoManoObra) || 0,
      costoTotal,
      costoProductos:  productosSeleccionados.reduce((s, p) => {
        const cant = parseInt(p.cantidad || 1, 10);
        const pu   = parseFloat(p.precioUnidad || p.precio || 0);
        return s + cant * pu;
      }, 0),
    };

    try {
      const creado = await MantService.agregarTicket(payload);
      if (estadoEquipo) MantService.actualizarEstadoEquipo(equipoId, estadoEquipo);
      if (estadoTicket === 'Terminado') MantService.reiniciarHorasEquipo(equipoId);
      const idFinal = creado?.id || '';
      onNavigateToMain({ alertaTipo: 'success', alertaMensaje: `Ticket ${idFinal} creado con éxito.` });
    } catch (e) {
      console.error("Error al crear ticket de mantenimiento:", e?.response?.data || e?.message || e);
      const mensajeError = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'No se pudo guardar el ticket. Verifica la conexión.';
      onNavigateToMain({ alertaTipo: 'danger', alertaMensaje: mensajeError });
    }
  };

  return {
    titulo, setTitulo,
    descripcion, setDescripcion,
    equipoId,
    estadoEquipo, setEstadoEquipo,
    equipoSeleccionado,
    tareasSeleccionadas, setTareasSeleccionadas,
    fecha, setFecha,
    tipoPersonal, setTipoPersonal,
    costoManoObra, setCostoManoObra,
    estadoTicket, setEstadoTicket,
    productosList,
    productosSeleccionados,
    alertaStock, setAlertaStock,
    costoTotal,
    errores, setErrores,
    submitted,
    seleccionarEquipoById,
    quitarEquipo,
    agregarProducto,
    quitarProducto,
    cambiarCantidadProducto,
    handleCrear,
  };
}
