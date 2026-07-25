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

  // ── Validación ───────────────────────────────────────────────
  const [errores, setErrores]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Carga inicial de productos ────────────────────────────────
  useEffect(() => {
    setProductosList(getProductosInventario() || []);
  }, []);

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
  const handleCrear = () => {
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
      productos:       productosSeleccionados.map(p => ({ id: p.id, precio: p.precioUnidad })),
    };

    MantService.agregarTicket(nuevo);
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
    costoTotal,
    errores, setErrores,
    submitted,
    seleccionarEquipoById,
    quitarEquipo,
    seleccionarProducto,
    quitarProducto,
    handleCrear,
  };
}
