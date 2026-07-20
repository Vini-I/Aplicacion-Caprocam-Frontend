/**
 * ============================================================
 * HOOK: useEditarMantenimiento
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Encapsula toda la lógica de carga, edición, validación y
 * guardado de un ticket de mantenimiento existente.
 * Sigue el patrón del módulo finca (useFincaEditar).
 */

import { useState, useEffect } from 'react';
import { getProductosInventario } from '../../inventarios/services/InventarioService.js';
import * as MantService from '../services/mantEquipoService.js';
import { parseDate, formatDate } from '../../../shared/utils/dateUtils.js';
import { validarCostoManoObra, formatearNombreHerramienta } from '../utils/mantEquipoUtils.js';

export function useEditarMantenimiento({ id, onNavigateToDetail, onNavigateToMain }) {

  // ── Ticket original (solo lectura) ────────────────────────────
  const ticketOriginal = MantService.TICKETS_MOCK.find(t => t.id === id);

  // ── Campos del formulario ─────────────────────────────────────
  const [titulo, setTitulo]                               = useState('');
  const [descripcion, setDescripcion]                     = useState('');
  const [equipoId, setEquipoId]                           = useState('');
  const [estadoEquipo, setEstadoEquipo]                   = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado]       = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas]     = useState([]);
  const [fecha, setFecha]                                 = useState('');

  const [tipoPersonal, setTipoPersonal]                   = useState('interno');
  const [costoManoObra, setCostoManoObra]                 = useState('');
  const [estadoTicket, setEstadoTicket]                   = useState('en_espera');

  // ── Productos / insumos ──────────────────────────────────────
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productosList, setProductosList]                   = useState([]);

  // ── Validación ───────────────────────────────────────────────
  const [errores, setErrores]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Carga inicial de productos ────────────────────────────────
  useEffect(() => {
    setProductosList(getProductosInventario() || []);
  }, []);

  // ── Precarga de datos del ticket ──────────────────────────────
  useEffect(() => {
    if (!ticketOriginal) return;

    setTitulo(ticketOriginal.titulo || '');
    setDescripcion(ticketOriginal.descripcion || '');
    setEquipoId(ticketOriginal.equipoId || '');
    setEstadoTicket(ticketOriginal.estado || 'en_espera');
    setTareasSeleccionadas(ticketOriginal.tareas || []);
    setFecha(ticketOriginal.fechaCreacion ? formatDate(new Date(ticketOriginal.fechaCreacion)) : '');
    setTipoPersonal(ticketOriginal.tipoPersonal || 'interno');
    setCostoManoObra(ticketOriginal.costoManoObra !== undefined ? String(ticketOriginal.costoManoObra) : '0');


    const eq = MantService.EQUIPOS_MOCK.find(e => e.id === ticketOriginal.equipoId);
    if (eq) {
      setEquipoSeleccionado(eq);
      setEstadoEquipo(eq.estado || '');
    }

    // Precarga de productos
    const prodList = getProductosInventario() || [];
    if (ticketOriginal.productos) {
      const mapped = ticketOriginal.productos
        .map(tp => prodList.find(p => String(p.id) === String(tp.id)))
        .filter(Boolean);
      setProductosSeleccionados(mapped);
    } else if (ticketOriginal.productoId) {
      const prod = prodList.find(p => String(p.id) === String(ticketOriginal.productoId));
      if (prod) setProductosSeleccionados([prod]);
    }
  }, [id]);

  // ── Cálculo reactivo del costo total ─────────────────────────
  const numManoObra   = parseFloat(costoManoObra) || 0;
  const precioInsumos = productosSeleccionados.reduce(
    (sum, p) => sum + (parseFloat(p.precioUnidad) || 0), 0
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
  const seleccionarProducto = (prodId) => {
    if (!prodId) return;
    const prod = productosList.find(p => String(p.id) === String(prodId));
    if (prod && !productosSeleccionados.some(x => x.id === prod.id)) {
      setProductosSeleccionados(prev => [...prev, prod]);
    }
  };

  const quitarProducto = (prodId) => {
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
  const handleGuardar = () => {
    setSubmitted(true);
    if (!validar()) return;

    const ticketActualizado = {
      ...ticketOriginal,
      equipoId,
      herramienta:     equipoSeleccionado ? formatearNombreHerramienta(equipoSeleccionado) : ticketOriginal.herramienta,
      titulo:          titulo.trim(),
      descripcion:     descripcion.trim(),
      tareas:          tareasSeleccionadas,
      estado:          estadoTicket,
      fechaCreacion:   parseDate(fecha) || ticketOriginal.fechaCreacion,
      horasUsoIngreso: equipoSeleccionado ? equipoSeleccionado.horasUso : ticketOriginal.horasUsoIngreso,
      tipoPersonal,
      costoMiscelaneo: 0,
      costoManoObra:   parseFloat(costoManoObra) || 0,
      costoTotal,
      productos:       productosSeleccionados.map(p => ({ id: p.id, precio: p.precioUnidad })),
    };

    MantService.actualizarTicket(ticketActualizado);
    if (estadoEquipo) MantService.actualizarEstadoEquipo(equipoId, estadoEquipo);
    if (estadoTicket === 'Terminado') MantService.reiniciarHorasEquipo(equipoId);

    onNavigateToDetail(ticketOriginal.id, {
      alertaTipo: 'success',
      alertaMensaje: `Ticket ${ticketOriginal.id} modificado correctamente.`,
    });
  };

  return {
    ticketOriginal,
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
    costoTotal,
    errores, setErrores,
    submitted,
    seleccionarEquipoById,
    quitarEquipo,
    seleccionarProducto,
    quitarProducto,
    handleGuardar,
  };
}
