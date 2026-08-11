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
import { validarCostoManoObra, LIMITE_TITULO, LIMITE_DESCRIPCION, formatearNombreHerramienta } from '../utils/mantEquipoUtils.js';
import { equiposService } from '../services/equiposService.js';
import { ESTADOS_TICKET, TEXTOS_MODAL_AGREGAR, ALERTAS_NOTIFICACIONES, MENSAJES_ERROR_CARGA } from '../constants/mantEquipoMensajes.js';

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
  const [alertaServidor, setAlertaServidor] = useState('');

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

        // 4. Catálogo de productos para el select
        let prodList = [];
        try {
          const resProd = await MantService.getProductosCatalogo();
          if (!activo) return;
          const raw = Array.isArray(resProd) ? resProd : (Array.isArray(resProd?.data) ? resProd.data : []);
          prodList = raw.map(p => {
            const prodId = String(p.id || p.producto_id || p.productoId || '');
            const price = Number(p.precioUnidad || p.precio_unidad || p.precio) || 0;
            return {
              ...p,
              id:           prodId,
              productoId:    prodId,
              nombre:       p.nombre || p.nombreProducto || p.producto?.nombre || `Producto ${prodId}`,
              precioUnidad: price,
              costoUnitario: price,
              stockMaximo:  p.cantidad !== undefined ? Number(p.cantidad) : (p.stock !== undefined ? Number(p.stock) : 999),
            };
          });
        } catch (errProd) {
          console.warn('useEditarMantenimiento: no se pudieron cargar productos:', errProd?.message);
        }
        setProductosList(prodList);

        // 5. Productos del ticket — enriquecer con catálogo o fallback
        if (Array.isArray(t.productos) && t.productos.length > 0) {
          const mapped = t.productos.map(tp => {
            const prodId = String(tp.productoId || tp.producto_id || tp.id || '');
            const enInventario = prodList.find(p => String(p.id) === prodId || String(p.productoId) === prodId);
            const unitCost = Number(tp.costoUnitario || tp.costo_unitario || enInventario?.precioUnidad || 0);
            if (enInventario) {
              return {
                ...enInventario,
                id:            prodId,
                productoId:    prodId,
                cantidad:      Number(tp.cantidad) || 1,
                precioUnidad:  unitCost,
                costoUnitario: unitCost,
              };
            }
            // Producto no está en catálogo visual → usar datos del ticket
            return {
              id:            prodId,
              productoId:    prodId,
              nombre:        tp.nombre || `Producto ${prodId}`,
              precioUnidad:  unitCost,
              costoUnitario: unitCost,
              cantidad:      Number(tp.cantidad) || 1,
              stockMaximo:   999,
            };
          });
          setProductosSeleccionados(mapped);
        }

      } catch (err) {
        if (activo) setErrorCarga(MENSAJES_ERROR_CARGA.errorCargarTicket);
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
    (sum, p) => sum + (parseFloat(p.precioUnidad || p.costoUnitario || p.precio) || 0) * (Number(p.cantidad) || 1), 0
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
    const targetId = String(prodConCantidad.productoId || prodConCantidad.id);
    setProductosSeleccionados(prev => {
      const existe = prev.some(x => String(x.productoId || x.id) === targetId);
      if (existe) {
        return prev.map(x => String(x.productoId || x.id) === targetId
          ? { ...x, cantidad: (Number(x.cantidad) || 1) + (Number(prodConCantidad.cantidad) || 1) }
          : x
        );
      }
      return [...prev, { ...prodConCantidad, id: targetId, productoId: targetId }];
    });
  };

  const cambiarCantidadProducto = (prodId, nuevaCantidad) => {
    setAlertaStock('');
    const targetId = String(prodId);
    const prod = productosSeleccionados.find(x => String(x.productoId || x.id) === targetId);
    const stockMax = prod?.stockMaximo !== undefined ? prod.stockMaximo : 999;

    const val = String(nuevaCantidad).replace(/[^0-9]/g, '');
    let qty = val === '' ? 1 : parseInt(val, 10) || 1;

    if (qty > stockMax) {
      qty = stockMax;
      setAlertaStock(ALERTAS_NOTIFICACIONES.alertaStockInsumo(prod?.nombre, stockMax));
    }
    qty = Math.max(1, qty);
    setProductosSeleccionados(prev =>
      prev.map(p => (String(p.productoId || p.id) === targetId ? { ...p, cantidad: qty } : p))
    );
  };

  const quitarProducto = (prodId) => {
    setAlertaStock('');
    const targetId = String(prodId);
    setProductosSeleccionados(prev => prev.filter(p => String(p.productoId || p.id) !== targetId));
  };

  // ── Validación ────────────────────────────────────────────────
  // Misma cascada de dos prioridades que useAgregarMantenimiento.js:
  //   1) Campos vacíos primero (mensaje genérico).
  //   2) Reglas específicas una a la vez, en orden del formulario,
  //      solo cuando ya no falta ningún campo por llenar.
  const validar = () => {
    const err = {};

    const tituloVacio      = !titulo.trim();
    const descripcionVacia = !descripcion.trim();
    const equipoVacio      = !equipoId;
    const tareasVacias     = tareasSeleccionadas.length === 0;
    const costoVacio       = !String(costoManoObra).trim();

    if (tituloVacio)      err.titulo        = true;
    if (descripcionVacia) err.descripcion   = true;
    if (equipoVacio)      err.equipoId      = true;
    if (tareasVacias)     err.tareas        = true;
    if (costoVacio)       err.costoManoObra = true;

    let mensaje = null;

    if (tituloVacio || descripcionVacia || equipoVacio || tareasVacias || costoVacio) {
      mensaje = TEXTOS_MODAL_AGREGAR.errorValidacion;
    } else {
      const tituloLimpio      = titulo.trim();
      const descripcionLimpia = descripcion.trim();

      if (tituloLimpio.length <= LIMITE_TITULO.min) {
        err.titulo = true;
        mensaje = TEXTOS_MODAL_AGREGAR.errorTituloCorto;
      } else if (tituloLimpio.length > LIMITE_TITULO.max) {
        err.titulo = true;
        mensaje = TEXTOS_MODAL_AGREGAR.errorTituloMax;
      } else if (descripcionLimpia.length <= LIMITE_DESCRIPCION.min) {
        err.descripcion = true;
        mensaje = TEXTOS_MODAL_AGREGAR.errorDescripcionCorta;
      } else if (descripcionLimpia.length > LIMITE_DESCRIPCION.max) {
        err.descripcion = true;
        mensaje = TEXTOS_MODAL_AGREGAR.errorDescripcionMax;
      } else if (!validarCostoManoObra(costoManoObra)) {
        err.costoManoObra = true;
        mensaje = TEXTOS_MODAL_AGREGAR.hintCostoManoObra;
      } else if (estadoTicket === ESTADOS_TICKET.TERMINADO &&
                 tareasSeleccionadas.some(t => !t.realizada)) {
        err.tareasPendientes = true;
        mensaje = TEXTOS_MODAL_AGREGAR.errorTareasPendientes;
      }
    }

    setErrores({ ...err, mensaje });
    return Object.keys(err).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleGuardar = async () => {
    setSubmitted(true);
    setAlertaServidor('');
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
      if (estadoTicket === ESTADOS_TICKET.TERMINADO) await MantService.reiniciarHorasEquipo(equipoId);

      onNavigateToDetail(ticketOriginal?.id, {
        alertaTipo:    'success',
        alertaMensaje: ALERTAS_NOTIFICACIONES.exitoEditarTicket(ticketOriginal?.id),
      });
    } catch (e) {
      const mensajeError = e?.response?.data?.error || e?.response?.data?.message || e?.message || TEXTOS_MODAL_AGREGAR.errorEditarTicket(ticketOriginal?.id);
      setAlertaServidor(mensajeError);
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
    alertaServidor,
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