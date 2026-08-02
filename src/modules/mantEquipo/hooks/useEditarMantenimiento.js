/**
 * HOOK: useEditarMantenimiento
 * Encapsula la lógica de carga, edición, validación y guardado
 * de un ticket de mantenimiento existente obtenido del backend.
 *
 * @dependencies - InventarioService, mantEquipoService, equiposService
 *               - dateUtils, mantEquipoUtils, mantEquipoMensajes
 * @validations  - Valida campos obligatorios y formato de costos.
 *               - Si el estado es "Terminado", exige costo de mano de obra.
 * @navigation   - callbacks onNavigateToDetail y onNavigateToMain inyectados.
 */

import { useState, useEffect } from 'react';
import { getProductosInventario } from '../../inventarios/services/InventarioService.js';
import * as MantService from '../services/mantEquipoService.js';
import { parseDate, formatDate } from '../../../shared/utils/dateUtils.js';
import { validarCostoManoObra, formatearNombreHerramienta } from '../utils/mantEquipoUtils.js';
import { equiposService } from '../services/equiposService.js';
import { ESTADOS_TICKET } from '../constants/mantEquipoMensajes.js';

export function useEditarMantenimiento({ id, onNavigateToDetail, onNavigateToMain }) {

  // ── Ticket original cargado del backend ───────────────────────
  const [ticketOriginal, setTicketOriginal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // ── Campos del formulario ─────────────────────────────────────
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [equipoId, setEquipoId] = useState('');
  const [estadoEquipo, setEstadoEquipo] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [fecha, setFecha] = useState('');

  const [tipoPersonal, setTipoPersonal] = useState('interno');
  const [costoManoObra, setCostoManoObra] = useState('0');
  const [estadoTicket, setEstadoTicket] = useState(ESTADOS_TICKET.EN_ESPERA);

  // ── Productos / insumos ─────────────────────────────────────────────────────
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [alertaStock, setAlertaStock] = useState('');

  // ── Validación ─────────────────────────────────────────────────────────────────────
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Precarga de datos del ticket desde el backend ─────────────
  useEffect(() => {
    if (!id) return;
    let activo = true;

    async function cargar() {
      setCargando(true);
      setErrorCarga(null);
      try {
        // 1. Cargar ticket con tareas y productos enriquecidos
        const t = await MantService.obtenerTicketPorId(id);
        if (!activo) return;

        setTicketOriginal(t);
        setTitulo(t.titulo || '');
        setDescripcion(t.descripcion || '');
        setEquipoId(t.equipoId || '');
        setEstadoTicket(t.estado || ESTADOS_TICKET.EN_ESPERA);
        setFecha(t.fechaCreacion ? formatDate(new Date(t.fechaCreacion)) : '');
        setTipoPersonal(t.tipoPersonal || 'interno');
        // costoManoObra viene como número desde adaptBackendTicket
        setCostoManoObra(t.costoManoObra != null ? String(t.costoManoObra) : '0');

        // 2. Tareas — ya vienen enriquecidas con nombre/categoria/duracionEstimada/descripcion
        //    desde obtenerTicketPorId (cruzadas con el catálogo de tareas)
        if (Array.isArray(t.tareas)) {
          setTareasSeleccionadas(t.tareas);
        }

        // 3. Equipo y estado del equipo
        if (t.equipoId) {
          try {
            const eq = await equiposService.getEquipoById(t.equipoId);
            if (!activo) return;
            if (eq) {
              setEquipoSeleccionado(eq);
              // eq.estado ya viene en minúsculas: 'activo'/'inactivo'/'mantenimiento'
              // (mapEquipoBackend usa ESTADO_OPERATIVO_BACKEND_A_FRONTEND)
              const estadoActual = (t.estadoEquipo || eq.estado || '').toLowerCase();
              setEstadoEquipo(estadoActual);
            }
          } catch (errEquipo) {
            console.warn('useEditarMantenimiento: no se pudo cargar el equipo:', errEquipo?.message);
          }
        }

        // 4. Catálogo de inventario para el select de productos
        let prodList = [];
        try {
          const resProd = await getProductosInventario();
          if (!activo) return;
          const raw = Array.isArray(resProd) ? resProd : (Array.isArray(resProd?.data) ? resProd.data : []);
          prodList = raw.map(p => ({
            ...p,
            id:           p.id || p.producto_id || p.productoId,
            nombre:       p.nombre || p.nombreProducto || p.producto?.nombre || `Producto ${p.id}`,
            precioUnidad: Number(p.precioUnidad || p.precio_unidad || p.precio) || 0,
            stockMaximo:  p.cantidad !== undefined ? p.cantidad : (p.stock !== undefined ? p.stock : 999),
          }));
        } catch (errProd) {
          console.warn('useEditarMantenimiento: no se pudieron cargar productos:', errProd?.message);
        }
        setProductosList(prodList);

        // 5. Productos del ticket — usar datos del ticket si el producto no está en inventario
        if (Array.isArray(t.productos) && t.productos.length > 0) {
          const mapped = t.productos.map(tp => {
            const prodId = String(tp.productoId || tp.producto_id || tp.id || '');
            const enInventario = prodList.find(p => String(p.id) === prodId);
            if (enInventario) {
              return {
                ...enInventario,
                productoId:    enInventario.id,
                cantidad:      Number(tp.cantidad) || 1,
                costoUnitario: Number(tp.costoUnitario || tp.costo_unitario || enInventario.precioUnidad) || 0,
              };
            }
            // Producto no está en inventario → usar datos del ticket
            return {
              id:            prodId,
              productoId:    prodId,
              nombre:        tp.nombre || `Producto ${prodId}`,
              precioUnidad:  Number(tp.costoUnitario || tp.costo_unitario) || 0,
              costoUnitario: Number(tp.costoUnitario || tp.costo_unitario) || 0,
              cantidad:      Number(tp.cantidad) || 1,
              stockMaximo:   999,
            };
          });
          setProductosSeleccionados(mapped);
        }

      } catch (err) {
        console.error('useEditarMantenimiento.cargar:', err?.message || err);
        if (activo) setErrorCarga('No se pudo cargar el ticket. Verifica la conexión e intenta de nuevo.');
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => { activo = false; };
  }, [id]);

  // ── Cálculo reactivo del costo total ─────────────────────────
  const numManoObra   = parseFloat(costoManoObra) || 0;
  const precioInsumos = productosSeleccionados.reduce(
    (sum, p) => sum + (parseFloat(p.precioUnidad) || 0) * (Number(p.cantidad) || 1), 0
  );
  const costoTotal = numManoObra + precioInsumos;

  // ── Handlers de equipo ────────────────────────────────────────
  const seleccionarEquipoById = (eq) => {
    if (!eq) return;
    setEquipoSeleccionado(eq);
    setEquipoId(eq.id);
    // eq.estado ya está en minúsculas por el mapper del equipo
    setEstadoEquipo((eq.estado || '').toLowerCase());
    if (errores.equipoId) setErrores((prev) => { const s = { ...prev }; delete s.equipoId; return s; });
  };

  const quitarEquipo = () => {
    setEquipoSeleccionado(null);
    setEquipoId('');
    setEstadoEquipo('');
  };

  // ── Handlers de productos ───────────────────────────────────────────────────
  const agregarProducto = (prodConCantidad) => {
    if (!prodConCantidad) return;
    setAlertaStock('');
    setProductosSeleccionados(prev => {
      const existe = prev.some(x => String(x.id) === String(prodConCantidad.id));
      if (existe) {
        return prev.map(x => String(x.id) === String(prodConCantidad.id)
          ? { ...x, cantidad: (Number(x.cantidad) || 1) + (Number(prodConCantidad.cantidad) || 1) }
          : x
        );
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
    setProductosSeleccionados(prev => prev.filter(p => String(p.id) !== String(prodId)));
  };

  // ── Validación ────────────────────────────────────────────────
  const validar = () => {
    const err = {};
    if (!titulo.trim())                     err.titulo           = true;
    if (!equipoId)                          err.equipoId         = true;
    if (!descripcion.trim())                err.descripcion      = true;
    if (tareasSeleccionadas.length === 0)   err.tareas           = true;
    if (!validarCostoManoObra(costoManoObra)) err.costoManoObra  = true;
    if (estadoTicket === ESTADOS_TICKET.TERMINADO &&
        tareasSeleccionadas.some(t => !t.realizada)) {
      err.tareasPendientes = true;
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleGuardar = async () => {
    setSubmitted(true);
    if (!validar()) return;

    const ticketActualizado = {
      ...ticketOriginal,
      equipoId,
      herramienta:   equipoSeleccionado
        ? formatearNombreHerramienta(equipoSeleccionado)
        : ticketOriginal?.herramienta,
      titulo:        titulo.trim(),
      descripcion:   descripcion.trim(),
      tareas:        tareasSeleccionadas,
      estado:        estadoTicket,
      estadoEquipo,
      fechaCreacion: parseDate(fecha) || ticketOriginal?.fechaCreacion,
      tipoPersonal,
      costoManoObra: parseFloat(costoManoObra) || 0,
      costoTotal,
      productos: productosSeleccionados.map(p => ({
        id:           p.id,
        productoId:   p.productoId || p.id,
        cantidad:     Number(p.cantidad) || 1,
        precioUnidad: Number(p.precioUnidad || p.precio || p.costoUnitario) || 0,
        costoUnitario: Number(p.costoUnitario || p.precioUnidad || p.precio) || 0,
      })),
    };

    try {
      await MantService.actualizarTicket(ticketActualizado);
      if (estadoEquipo) await MantService.actualizarEstadoEquipo(equipoId, estadoEquipo);
      if (estadoTicket === ESTADOS_TICKET.TERMINADO) MantService.reiniciarHorasEquipo(equipoId);

      onNavigateToDetail(ticketOriginal?.id, {
        alertaTipo:    'success',
        alertaMensaje: `Ticket ${ticketOriginal?.id} modificado correctamente.`,
      });
    } catch (e) {
      console.error('Error al actualizar ticket:', e?.response?.data || e?.message || e);
      const mensajeError = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'No se pudo guardar el ticket. Verifica la conexión.';
      onNavigateToDetail(ticketOriginal?.id, {
        alertaTipo:    'danger',
        alertaMensaje: mensajeError,
      });
    }
  };

  return {
    ticketOriginal,
    cargando,
    errorCarga,
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
    cambiarCantidadProducto,
    quitarProducto,
    handleGuardar,
  };
}


