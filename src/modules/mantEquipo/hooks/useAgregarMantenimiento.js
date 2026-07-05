/**
 * HOOK: useAgregarMantenimiento
 * Ruta: src/modules/mantEquipo/hooks/useAgregarMantenimiento.js
 *
 * Gestiona el estado y la lógica del modal para crear o editar tickets
 * de mantenimiento. Expone métodos para abrir/cerrar el modal, manejar
 * los combobox de equipo y tarea, validar el formulario y confirmar.
 */

import { useState, useCallback } from "react";
import * as MantService from "../services/mantEquipoService.js";
import { filtrarEquipos, generarNuevoId } from "../utils/mantEquipoUtils.js";
import { TAREAS_DEMO } from "../constants/mantEquipoMensajes.js";

/** Usuario de sesión temporal hasta integrar autenticación real. */
const USUARIO_SESION = "Usuario";

/** Estado vacío del formulario que se usa al abrir el modal en modo creación. */
const FORM_INICIAL = {
  titulo:      "",
  descripcion: "",
  equipoId:    "",
  tareaId:     "",
  fechaHora:   "",
  creadoPor:   USUARIO_SESION,
  estado:      "",   // solo se usa en modo edición
};

/**
 * Devuelve la fecha y hora actual formateada como "YYYY-MM-DD HH:MM".
 * @returns {string}
 */
function ahora() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * @param {Array}    tickets            - Lista actual de tickets (para generar el ID).
 * @param {Function} onTicketCreado     - Callback al confirmar un ticket nuevo.
 * @param {Function} onTicketActualizado - Callback al confirmar una edición.
 */
export function useAgregarMantenimiento(tickets = [], onTicketCreado, onTicketActualizado) {
  const [visible,            setVisible]            = useState(false);
  const [modoEdicion,        setModoEdicion]        = useState(false);
  const [ticketEditandoId,   setTicketEditandoId]   = useState(null);
  const [form,               setForm]               = useState(FORM_INICIAL);
  const [busquedaEquipo,     setBusquedaEquipo]     = useState("");
  const [busquedaTarea,      setBusquedaTarea]      = useState("");
  const [mostrarDropEquipo,  setMostrarDropEquipo]  = useState(false);
  const [mostrarDropTarea,   setMostrarDropTarea]   = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [errores,            setErrores]            = useState({});

  // Equipos filtrados según el texto de búsqueda; si no hay coincidencia muestra todos.
  const equiposSafe      = Array.isArray(MantService.EQUIPOS_MOCK) ? MantService.EQUIPOS_MOCK : [];
  const equiposFiltrados = filtrarEquipos(equiposSafe, busquedaEquipo).length > 0
    ? filtrarEquipos(equiposSafe, busquedaEquipo)
    : equiposSafe;

  // Tareas filtradas según el texto de búsqueda; si está vacío muestra todas.
  const tareasFiltradas = busquedaTarea.trim() === ""
    ? TAREAS_DEMO
    : TAREAS_DEMO.filter((t) => t.label.toLowerCase().includes(busquedaTarea.toLowerCase()));

  /** Abre el modal en modo creación con el formulario limpio. */
  const abrir = useCallback(() => {
    setModoEdicion(false);
    setTicketEditandoId(null);
    setForm({ ...FORM_INICIAL, fechaHora: ahora(), creadoPor: USUARIO_SESION });
    setBusquedaEquipo("");
    setBusquedaTarea("");
    setEquipoSeleccionado(null);
    setMostrarDropEquipo(false);
    setMostrarDropTarea(false);
    setErrores({});
    setVisible(true);
  }, []);

  /**
   * Abre el modal en modo edición con los datos del ticket existente.
   * @param {object} ticket - Ticket a editar.
   */
  const abrirEdicion = useCallback((ticket) => {
    setModoEdicion(true);
    setTicketEditandoId(ticket.id);
    setForm({
      titulo:      ticket.titulo      || "",
      descripcion: ticket.descripcion || "",
      equipoId:    ticket.equipoId    || "",
      tareaId:     ticket.tareaId     || "",
      fechaHora:   ticket.fechaHora   || ahora(),
      creadoPor:   ticket.creadoPor   || USUARIO_SESION,
      estado:      ticket.estado      || "",
    });
    setBusquedaEquipo(ticket.herramienta || "");
    setBusquedaTarea(ticket.tareaLabel   || "");
    setEquipoSeleccionado(null);
    setMostrarDropEquipo(false);
    setMostrarDropTarea(false);
    setErrores({});
    setVisible(true);
  }, []);

  /** Cierra el modal y reinicia todo el estado del formulario. */
  const cerrar = useCallback(() => {
    setVisible(false);
    setForm(FORM_INICIAL);
    setEquipoSeleccionado(null);
    setErrores({});
    setModoEdicion(false);
    setTicketEditandoId(null);
  }, []);

  /**
   * Actualiza un campo del formulario y limpia su error si lo tenía.
   * @param {string} campo - Nombre del campo.
   * @param {string} valor - Nuevo valor.
   */
  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => { const s = { ...prev }; delete s[campo]; return s; });
    }
  }

  /**
   * Confirma la selección de un equipo desde el dropdown y cierra la lista.
   * @param {object} equipo - Equipo seleccionado.
   */
  function seleccionarEquipo(equipo) {
    setEquipoSeleccionado(equipo);
    setBusquedaEquipo(`${equipo.nombre} — ${equipo.serie}`);
    setForm((prev) => ({ ...prev, equipoId: equipo.id }));
    setMostrarDropEquipo(false);
    if (errores.equipoId) {
      setErrores((prev) => { const s = { ...prev }; delete s.equipoId; return s; });
    }
  }

  /**
   * Confirma la selección de una tarea desde el dropdown y cierra la lista.
   * @param {object} tarea - Tarea seleccionada.
   */
  function seleccionarTarea(tarea) {
    setBusquedaTarea(tarea.label);
    setForm((prev) => ({ ...prev, tareaId: tarea.value }));
    setMostrarDropTarea(false);
    if (errores.tareaId) {
      setErrores((prev) => { const s = { ...prev }; delete s.tareaId; return s; });
    }
  }

  /**
   * Valida el formulario y, si es válido, llama al callback de creación o edición.
   * Solo título y descripción son campos obligatorios.
   */
  function aceptar() {
    // Si el usuario escribió texto en el combobox de equipo pero no hizo clic,
    // se toma el primer resultado filtrado como equipo implícito.
    let equipoFinal = equipoSeleccionado;
    let formFinal   = { ...form };

    if (!formFinal.equipoId && busquedaEquipo.trim() && equiposFiltrados.length > 0) {
      equipoFinal        = equiposFiltrados[0];
      formFinal.equipoId = equipoFinal.id;
    }

    // Validación: solo título y descripción son obligatorios.
    const e = {};
    if (!formFinal.titulo.trim())      e.titulo = true;
    if (!formFinal.descripcion.trim()) e.descripcion = true;
    if (Object.keys(e).length) { setErrores(e); return; }

    const herramienta = equipoFinal
      ? `${equipoFinal.nombre} ${equipoFinal.serie}`
      : busquedaEquipo || "—";

    if (modoEdicion && ticketEditandoId) {
      onTicketActualizado?.({
        id:          ticketEditandoId,
        equipoId:    formFinal.equipoId,
        herramienta,
        descripcion: formFinal.descripcion.trim(),
        titulo:      formFinal.titulo.trim(),
        estado:      formFinal.estado,   // permite cambiar el estado desde el modal
        creadoPor:   USUARIO_SESION,
        tareaId:     formFinal.tareaId,
        tareaLabel:  busquedaTarea,
      });
    } else {
      onTicketCreado({
        id:               generarNuevoId(tickets),
        equipoId:         formFinal.equipoId,
        herramienta,
        descripcion:      formFinal.descripcion.trim(),
        titulo:           formFinal.titulo.trim(),
        estado:           MantService.ESTADOS?.FUERA_DE_SERVICIO ?? "fuera_de_servicio",
        creadoPor:        USUARIO_SESION,
        fechaCreacion:    new Date(),
        fechaVencimiento: null,
        tareaId:          formFinal.tareaId,
        tareaLabel:       busquedaTarea,
      });
    }

    cerrar();
  }

  return {
    visible, modoEdicion, form, busquedaEquipo, busquedaTarea,
    mostrarDropEquipo, mostrarDropTarea, equipoSeleccionado, errores,
    equiposFiltrados, tareasFiltradas,
    abrir, abrirEdicion, cerrar, actualizarCampo,
    setBusquedaEquipo, setBusquedaTarea,
    setMostrarDropEquipo, setMostrarDropTarea,
    seleccionarEquipo, seleccionarTarea, aceptar,
  };
}
