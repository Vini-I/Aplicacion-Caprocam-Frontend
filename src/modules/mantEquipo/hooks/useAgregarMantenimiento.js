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
import { obtenerFechaHoraActual, validarCostoManoObra, LIMITE_TITULO, LIMITE_DESCRIPCION, formatearNombreHerramienta } from '../utils/mantEquipoUtils.js';
import { TEXTOS_MODAL_AGREGAR, ALERTAS_NOTIFICACIONES } from '../constants/mantEquipoMensajes.js';
import { parseDate } from '../../../shared/utils/dateUtils.js';


export function useAgregarMantenimiento({ onNavigateToMain }) {

  // ── Campos del formulario ─────────────────────────────────────
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [equipoId, setEquipoId] = useState('');
  const [estadoEquipo, setEstadoEquipo] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [fecha, setFecha] = useState(obtenerFechaHoraActual());

  const [tipoPersonal, setTipoPersonal] = useState('interno');
  const [costoManoObra, setCostoManoObra] = useState('');
  const [estadoTicket, setEstadoTicket] = useState('en_espera');

  // ── Productos / insumos ──────────────────────────────────────
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [alertaStock, setAlertaStock] = useState('');
  const [alertaServidor, setAlertaServidor] = useState('');

  // ── Validación ───────────────────────────────────────────────
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Carga inicial de productos ────────────────────────────────
  useEffect(() => {
    async function cargarProductos() {
      try {
        const data = await MantService.getProductosCatalogo();
        const raw = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        const list = raw
          .filter((p) => {
            const cat = String(p.categoria ?? "")
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            return cat === "equipos" || cat === "equipo" || cat === "mantenimiento";
          })
          .map(p => {
            const prodId = String(p.id || p.producto_id || p.productoId || '');
            const price = Number(p.precioUnidad || p.precio_unidad || p.precio) || 0;
            return {
              ...p,
              id: prodId,
              productoId: prodId,
              nombre: p.nombre || p.nombreProducto || p.producto?.nombre || `Producto ${prodId}`,
              precioUnidad: price,
              costoUnitario: price,
              stockMaximo: p.cantidad !== undefined ? Number(p.cantidad) : (p.stock !== undefined ? Number(p.stock) : 999),
            };
          });
        setProductosList(list);
      } catch (err) {
        setProductosList([]);
      }
    }
    cargarProductos();
  }, []);

  // ── Cálculo reactivo del costo total ─────────────────────────
  const numManoObra   = parseFloat(costoManoObra) || 0;
  const precioInsumos = productosSeleccionados.reduce(
    (sum, p) => sum + ((parseInt(p.cantidad || 1, 10)) * (parseFloat(p.precioUnidad || p.costoUnitario || p.precio) || 0)), 0
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
  const validar = () => {
    const err = {};

    const tituloVacio = !titulo.trim();
    const descripcionVacia = !descripcion.trim();
    const equipoVacio = !equipoId;
    const tareasVacias = tareasSeleccionadas.length === 0;
    const costoVacio = !String(costoManoObra).trim();

    if (tituloVacio) err.titulo = true;
    if (descripcionVacia) err.descripcion = true;
    if (equipoVacio) err.equipoId = true;
    if (tareasVacias) err.tareas = true;
    if (costoVacio) err.costoManoObra = true;

    let mensaje = null;

    if (tituloVacio || descripcionVacia || equipoVacio || tareasVacias || costoVacio) {
      // Prioridad 1: todavía faltan campos por llenar.
      mensaje = TEXTOS_MODAL_AGREGAR.errorValidacion;
    } else {
      // Prioridad 2: todos los campos tienen contenido. Reglas específicas,
      // en orden del formulario, una a la vez.
      const tituloLimpio = titulo.trim();
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
      } else if (estadoTicket === 'Terminado' && tareasSeleccionadas.some(t => !t.realizada)) {
        err.tareasPendientes = true;
        mensaje = TEXTOS_MODAL_AGREGAR.errorTareasPendientes;
      }
    }

    setErrores({ ...err, mensaje });
    return Object.keys(err).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleCrear = async () => {
    setSubmitted(true);
    setAlertaServidor('');
    if (!validar()) return;

    const payload = {
      equipoId,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tareas: tareasSeleccionadas,
      productos: productosSeleccionados,
      estado: estadoTicket,
      estadoEquipo,
      fechaCreacion: parseDate(fecha) || new Date(),
      tipoPersonal,
      costoManoObra: parseFloat(costoManoObra) || 0,
      costoTotal,
      costoProductos: productosSeleccionados.reduce((s, p) => {
        const cant = parseInt(p.cantidad || 1, 10);
        const pu = parseFloat(p.precioUnidad || p.precio || 0);
        return s + cant * pu;
      }, 0),
    };

    try {
      const creado = await MantService.agregarTicket(payload);

      if (estadoEquipo) {
        await MantService.actualizarEstadoEquipo(equipoId, estadoEquipo);
      }
      if (estadoTicket === 'Terminado') {
        await MantService.reiniciarHorasEquipo(equipoId);
      }

      const idFinal = creado?.id || '';
      onNavigateToMain({ alertaTipo: 'success', alertaMensaje: ALERTAS_NOTIFICACIONES.exitoCrearTicket(idFinal) });
    } catch (e) {
      const mensajeError = e?.response?.data?.error || e?.response?.data?.message || e?.message || TEXTOS_MODAL_AGREGAR.errorCrearTicket;
      setAlertaServidor(mensajeError);
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
    alertaServidor,
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