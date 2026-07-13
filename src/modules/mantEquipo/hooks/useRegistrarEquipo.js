/**
 * ============================================================
 * HOOK: useRegistrarEquipo
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Encapsula el estado del formulario de registro de equipo,
 * la validación por intento de guardado y el armado del payload.
 *
 * Funcionalidad:
 * - Mantiene el estado del formulario y los errores.
 * - Valida campos obligatorios al intentar guardar.
 * - Lanza un error con mensajes específicos por campo para que
 *   la pantalla muestre una alerta detallada.
 * - Si la validación es exitosa, envía el payload al servicio.
 *
 * Datos:
 * - formulario: objeto con todos los campos del equipo.
 * - errores: objeto con mensajes de error por campo.
 * - submitted: booleano que indica si ya se intentó guardar.
 * - guardando: booleano de estado de carga.
 *
 * Validaciones:
 * - Todos los campos excepto estanqueId y horasMantenimiento son
 *   obligatorios.
 * - La fecha debe tener formato dd/mm/aaaa válido.
 *
 * Dependencias:
 * - registrarEquipoService (crearEquipoPayload, agregarEquipo)
 * - TIPOS_EQUIPO, ESTADOS_EQUIPO desde el servicio
 * ============================================================
 */

import { useState } from "react";
import {
  agregarEquipo,
  crearEquipoPayload,
  ESTADOS_EQUIPO,
  TIPOS_EQUIPO,
} from "../services/registrarEquipoService";

// Obtener fecha actual en formato dd/mm/aaaa
function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

const formularioInicial = {
  codigoInterno: "",
  nombre: "",
  descripcion: "",
  tipo: "",
  modelo: "",
  fechaInstalacion: obtenerFechaActual(),
  funcionEquipo: "",
  estanqueId: "",
  horasMantenimiento: "500",
  estado: "",
};

const MENSAJES_REQUERIDOS = {
  codigoInterno: "El número de serie/identificador es obligatorio.",
  nombre: "El nombre del equipo es obligatorio.",
  descripcion: "La descripción es obligatoria.",
  tipo: "Debe seleccionar el tipo de equipo.",
  modelo: "El modelo es obligatorio.",
  fechaInstalacion: "La fecha de instalación es obligatoria.",
  fechaInstalacionFormato: "La fecha debe tener formato dd/mm/aaaa.",
  funcionEquipo: "La función del equipo es obligatoria.",
  estado: "Debe seleccionar el estado del equipo.",
};

function esFechaValidaDDMMAAAA(valor) {
  const partes = valor.split("/");
  if (partes.length !== 3) return false;
  const [diaTexto, mesTexto, anioTexto] = partes;
  if (!diaTexto || !mesTexto || !anioTexto) return false;
  const dia = Number(diaTexto);
  const mes = Number(mesTexto);
  const anio = Number(anioTexto);
  if (!Number.isInteger(dia) || !Number.isInteger(mes) || !Number.isInteger(anio)) return false;
  if (anioTexto.length !== 4 || dia < 1 || mes < 1 || mes > 12) return false;
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
}

function validarFormulario(formulario) {
  const nuevosErrores = {
    codigoInterno: "",
    nombre: "",
    descripcion: "",
    tipo: "",
    modelo: "",
    fechaInstalacion: "",
    funcionEquipo: "",
    estado: "",
  };

  if (!formulario.codigoInterno.trim()) {
    nuevosErrores.codigoInterno = MENSAJES_REQUERIDOS.codigoInterno;
  }
  if (!formulario.nombre.trim()) {
    nuevosErrores.nombre = MENSAJES_REQUERIDOS.nombre;
  }
  if (!formulario.descripcion.trim()) {
    nuevosErrores.descripcion = MENSAJES_REQUERIDOS.descripcion;
  }
  if (!formulario.tipo) {
    nuevosErrores.tipo = MENSAJES_REQUERIDOS.tipo;
  }
  if (!formulario.modelo.trim()) {
    nuevosErrores.modelo = MENSAJES_REQUERIDOS.modelo;
  }
  if (!formulario.fechaInstalacion.trim()) {
    nuevosErrores.fechaInstalacion = MENSAJES_REQUERIDOS.fechaInstalacion;
  } else if (!esFechaValidaDDMMAAAA(formulario.fechaInstalacion.trim())) {
    nuevosErrores.fechaInstalacion = MENSAJES_REQUERIDOS.fechaInstalacionFormato;
  }
  if (!formulario.funcionEquipo.trim()) {
    nuevosErrores.funcionEquipo = MENSAJES_REQUERIDOS.funcionEquipo;
  }
  if (!formulario.estado) {
    nuevosErrores.estado = MENSAJES_REQUERIDOS.estado;
  }

  return nuevosErrores;
}

export function useRegistrarEquipo() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [guardando, setGuardando] = useState(false);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    if (submitted && errores[campo]) {
      setErrores((actual) => {
        const siguientesErrores = { ...actual };
        delete siguientesErrores[campo];
        return siguientesErrores;
      });
    }
  }

  function resetFormulario() {
    setFormulario(formularioInicial);
    setErrores({});
    setSubmitted(false);
    setGuardando(false);
  }

  async function guardarEquipo() {
    setSubmitted(true);

    const nuevosErrores = validarFormulario(formulario);
    const mensajes = Object.values(nuevosErrores).filter((msg) => msg !== "");

    if (mensajes.length > 0) {
      setErrores(nuevosErrores);
      // Construir mensaje detallado como en Colaboradores
      const mensajeError =
        "Revisa los campos obligatorios marcados con *:\n" +
        mensajes.map((m) => `- ${m}`).join("\n");
      throw new Error(mensajeError);
    }

    setGuardando(true);

    try {
      const payload = crearEquipoPayload(formulario);
      await agregarEquipo(payload);
      // Éxito: reseteamos el formulario
      resetFormulario();
      // No lanzamos error; la pantalla mostrará alerta de éxito
    } catch (error) {
      // Si el servicio falla, lanzamos error para que la pantalla lo maneje
      throw new Error("No se pudo guardar el equipo. Intente nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  return {
    formulario,
    errores,
    submitted,
    guardando,
    tiposEquipo: TIPOS_EQUIPO,
    estadosEquipo: ESTADOS_EQUIPO,
    actualizarCampo,
    guardarEquipo,
    resetFormulario,
  };
}