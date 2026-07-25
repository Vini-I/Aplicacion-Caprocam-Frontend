/**
 * ============================================================
 * HOOK: useAgregarMantenimiento
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Encapsula toda la lógica de estado, validación y submit del
 * formulario de creación de un ticket de mantenimiento.
 * Sigue el patrón del módulo finca (useFincaEditar).
 */

import { useState, useEffect } from 'react';
import { getProductosInventario } from '../../inventarios/services/InventarioService.js';
import * as MantService from '../services/mantEquipoService.js';
import { generarNuevoId, obtenerFechaHoraActual, validarCostoManoObra, formatearNombreHerramienta } from '../utils/mantEquipoUtils.js';
import { parseDate } from '../../../shared/utils/dateUtils.js';
import { USUARIO_SESION } from '../constants/mantEquipoMensajes.js';

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
  const [costoManoObra, setCostoManoObra]                 = useState('0');
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
    const list = (getProductosInventario() || []).map(p => ({
      ...p,
      stockMaximo: p.cantidad !== undefined ? p.cantidad : 999,
    }));
    setProductosList(list);
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

    const nuevo = {
      id:              generarNuevoId(MantService.TICKETS_MOCK),
      equipoId,
      herramienta:     formatearNombreHerramienta(equipoSeleccionado),
      titulo:          titulo.trim(),
      descripcion:     descripcion.trim(),
      tareas:          tareasSeleccionadas,
      estado:          estadoTicket,
      creadoPor:       USUARIO_SESION,
      fechaCreacion:   parseDate(fecha) || new Date(),
      horasUsoIngreso: equipoSeleccionado ? equipoSeleccionado.horasUso : 0,
      tipoPersonal,
      costoMiscelaneo: 0,
      costoManoObra:   parseFloat(costoManoObra) || 0,
      costoTotal,
      productos:       productosSeleccionados.map(p => {
        const cant = parseInt(p.cantidad || 1, 10);
        const pu = parseFloat(p.precioUnidad || p.precio || 0);
        return {
          id: p.id,
          nombre: p.nombre,
          precio: pu,
          precioUnidad: pu,
          cantidad: cant,
          subtotal: cant * pu,
        };
      }),
    };

    await MantService.agregarTicket(nuevo);
    if (estadoEquipo) MantService.actualizarEstadoEquipo(equipoId, estadoEquipo);
    if (estadoTicket === 'Terminado') MantService.reiniciarHorasEquipo(equipoId);

    onNavigateToMain({ alertaTipo: 'success', alertaMensaje: `Ticket ${nuevo.id} creado con éxito.` });
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
