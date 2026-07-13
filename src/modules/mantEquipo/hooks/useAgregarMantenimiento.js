/**
 * ============================================================
 * HOOK: useAgregarMantenimiento
 * ============================================================
 * 
 * Responsabilidad: Gestiona el estado y la lógica de negocio del
 * formulario de creación y modificación de tickets de mantenimiento.
 * 
 * Datos:
 * - form: Estado de los campos (título, descripción, equipoId, estado, etc.).
 * - equipoSeleccionado: Detalles del equipo elegido.
 * - tareasSeleccionadas: Array de tareas asignadas al ticket.
 * - errores: Estado de las validaciones de campos requeridos.
 * 
 * Validaciones:
 * - Título, descripción, equipo y tareas son campos obligatorios (*).
 * 
 * Navegación:
 * - Controla el cierre automático del modal al guardar o eliminar.
 * 
 * Dependencias:
 * - EQUIPOS_MOCK, ESTADOS de mantEquipoService.js.
 * - TAREAS_DEMO de mantEquipoMensajes.js.
 * - generarNuevoId de mantEquipoUtils.js.
 */

import { useState, useCallback } from "react";
import * as MantService from "../services/mantEquipoService.js";
import { generarNuevoId, obtenerFechaHoraActual } from "../utils/mantEquipoUtils.js";
import { TAREAS_DEMO, USUARIO_SESION } from "../constants/mantEquipoMensajes.js";

const FORM_INICIAL = { titulo: "", descripcion: "", equipoId: "", fechaHora: "", creadoPor: USUARIO_SESION, estado: "", estadoEquipo: "" };

export function useAgregarMantenimiento(tickets = [], onTicketCreado, onTicketActualizado, onActualizarEstadoEquipo, onTicketEliminado) {
  const [visible, setVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ticketEditandoId, setTicketEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [errores, setErrores] = useState({});

  const equiposSafe = Array.isArray(MantService.EQUIPOS_MOCK) ? MantService.EQUIPOS_MOCK : [];

  const opcionesEquipos = equiposSafe.map((e) => ({
    label: `${e.nombre} — ${e.serie}`,
    value: e.id,
  }));

  const tareasDisponibles = TAREAS_DEMO.filter(
    (t) => !tareasSeleccionadas.some((sel) => sel.value === t.value)
  );

  const opcionesTareas = tareasDisponibles.map((t) => ({
    label: t.nombre || t.label,
    value: t.value,
  }));

  const abrir = useCallback(() => {
    setModoEdicion(false); setTicketEditandoId(null);
    setForm({ ...FORM_INICIAL, fechaHora: obtenerFechaHoraActual() });
    setTareasSeleccionadas([]); setEquipoSeleccionado(null);
    setErrores({}); setVisible(true);
  }, []);

  const abrirEdicion = useCallback((ticket) => {
    const equipo = equiposSafe.find((e) => e.id === ticket.equipoId) ?? null;
    setModoEdicion(true); setTicketEditandoId(ticket.id);
    setForm({
      titulo: ticket.titulo || "",
      descripcion: ticket.descripcion || "",
      equipoId: ticket.equipoId || "",
      fechaHora: obtenerFechaHoraActual(),
      creadoPor: ticket.creadoPor || USUARIO_SESION,
      estado: ticket.estado || "",
      estadoEquipo: equipo?.estadoEquipo || ""
    });
    setTareasSeleccionadas(Array.isArray(ticket.tareas) ? ticket.tareas : []);
    setEquipoSeleccionado(equipo);
    setErrores({}); setVisible(true);
  }, [equiposSafe]);

  const cerrar = useCallback(() => {
    setVisible(false); setForm(FORM_INICIAL); setEquipoSeleccionado(null);
    setTareasSeleccionadas([]); setErrores({}); setModoEdicion(false); setTicketEditandoId(null);
  }, []);

  const eliminar = useCallback((id) => {
    const targetId = typeof id === "string" ? id : ticketEditandoId;
    if (targetId) {
      onTicketEliminado?.(targetId);
      cerrar();
    }
  }, [ticketEditandoId, onTicketEliminado, cerrar]);

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => { const s = { ...prev }; delete s[campo]; return s; });
  }

  const seleccionarEquipoById = useCallback((id) => {
    const eq = equiposSafe.find(e => e.id === id);
    if (eq) {
      setEquipoSeleccionado(eq);
      setForm((prev) => ({ ...prev, equipoId: eq.id, estadoEquipo: eq.estadoEquipo || "" }));
      if (errores.equipoId) setErrores((prev) => { const s = { ...prev }; delete s.equipoId; return s; });
    }
  }, [equiposSafe, errores.equipoId]);

  const seleccionarTareaById = useCallback((id) => {
    const t = TAREAS_DEMO.find(td => td.value === id);
    if (t) {
      setTareasSeleccionadas((prev) => {
        const existe = prev.some((x) => x.value === t.value);
        return existe ? prev.filter((x) => x.value !== t.value) : [...prev, t];
      });
      if (errores.tareas) setErrores((prev) => { const s = { ...prev }; delete s.tareas; return s; });
    }
  }, [errores.tareas]);

  function quitarEquipo() {
    setEquipoSeleccionado(null);
    setForm((prev) => ({ ...prev, equipoId: "", estadoEquipo: "" }));
  }

  function aceptar() {
    let equipoFinal = equipoSeleccionado;
    let formFinal = { ...form };
    const e = {};
    if (!formFinal.titulo.trim()) e.titulo = true;
    if (!formFinal.descripcion.trim()) e.descripcion = true;
    if (!formFinal.equipoId) e.equipoId = true;
    if (!tareasSeleccionadas || tareasSeleccionadas.length === 0) e.tareas = true;
    if (Object.keys(e).length) { setErrores(e); return; }

    const herramienta = equipoFinal ? `${equipoFinal.nombre} ${equipoFinal.serie}` : "—";

    if (formFinal.equipoId && formFinal.estadoEquipo) {
      onActualizarEstadoEquipo?.(formFinal.equipoId, formFinal.estadoEquipo);
    }

    if (modoEdicion && ticketEditandoId) {
      onTicketActualizado?.({
        id: ticketEditandoId,
        equipoId: formFinal.equipoId,
        herramienta,
        descripcion: formFinal.descripcion.trim(),
        titulo: formFinal.titulo.trim(),
        estado: formFinal.estado,
        creadoPor: formFinal.creadoPor || USUARIO_SESION,
        tareas: tareasSeleccionadas
      });
    } else {
      onTicketCreado({
        id: generarNuevoId(tickets),
        equipoId: formFinal.equipoId,
        herramienta,
        descripcion: formFinal.descripcion.trim(),
        titulo: formFinal.titulo.trim(),
        estado: MantService.ESTADOS?.EN_ESPERA ?? "en_espera",
        creadoPor: USUARIO_SESION,
        fechaCreacion: new Date(),
        tareas: tareasSeleccionadas
      });
    }
    cerrar();
  }

  return {
    visible, modoEdicion, ticketEditandoId, form,
    equipoSeleccionado, tareasSeleccionadas, errores,
    opcionesEquipos, opcionesTareas,
    abrir, abrirEdicion, cerrar, eliminar, actualizarCampo,
    seleccionarEquipoById, seleccionarTareaById, quitarEquipo, aceptar,
  };
}
