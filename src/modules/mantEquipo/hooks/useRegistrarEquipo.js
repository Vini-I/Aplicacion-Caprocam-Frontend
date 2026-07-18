/**
 * ============================================================
 * HOOK: useRegistrarEquipo
 * ============================================================
 *
 * Encapsula el estado del formulario de registro de equipo,
 * la validación por intento de guardado y el armado del payload.
 */

import { useState } from "react";
import { Alert } from "react-native";

import {
  agregarEquipo,
  crearEquipoPayload,
  ESTADOS_EQUIPO,
  TIPOS_EQUIPO,
} from "../services/registrarEquipoService.js";

const formularioInicial = {
  codigoInterno: "",
  descripcion: "",
  fechaInstalacion: "",
  tipo: "",
  estado: "",
  funcionEquipo: "",
};

const MENSAJES_REQUERIDOS = {
  codigoInterno: "El identificador es obligatorio.",
  descripcion: "La descripción es obligatoria.",
  fechaInstalacion: "La fecha de instalación es obligatoria.",
  fechaInstalacionFormato: "La fecha debe tener formato dd/mm/aaaa.",
  tipo: "Debe seleccionar el tipo de equipo.",
  estado: "Debe seleccionar el estado del equipo.",
  funcionEquipo: "La función del equipo es obligatoria.",
};

function esFechaValidaDDMMAAAA(valor) {
  const partes = valor.split("/");

  if (partes.length !== 3) {
    return false;
  }

  const [diaTexto, mesTexto, anioTexto] = partes;

  if (!diaTexto || !mesTexto || !anioTexto) {
    return false;
  }

  const dia = Number(diaTexto);
  const mes = Number(mesTexto);
  const anio = Number(anioTexto);

  if (!Number.isInteger(dia) || !Number.isInteger(mes) || !Number.isInteger(anio)) {
    return false;
  }

  if (anioTexto.length !== 4 || dia < 1 || mes < 1 || mes > 12) {
    return false;
  }

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
    descripcion: "",
    fechaInstalacion: "",
    tipo: "",
    estado: "",
    funcionEquipo: "",
  };

  if (!formulario.codigoInterno.trim()) {
    nuevosErrores.codigoInterno = MENSAJES_REQUERIDOS.codigoInterno;
  }

  if (!formulario.descripcion.trim()) {
    nuevosErrores.descripcion = MENSAJES_REQUERIDOS.descripcion;
  }

  if (!formulario.fechaInstalacion.trim()) {
    nuevosErrores.fechaInstalacion = MENSAJES_REQUERIDOS.fechaInstalacion;
  } else if (!esFechaValidaDDMMAAAA(formulario.fechaInstalacion.trim())) {
    nuevosErrores.fechaInstalacion = MENSAJES_REQUERIDOS.fechaInstalacionFormato;
  }

  if (!formulario.tipo) {
    nuevosErrores.tipo = MENSAJES_REQUERIDOS.tipo;
  }

  if (!formulario.estado) {
    nuevosErrores.estado = MENSAJES_REQUERIDOS.estado;
  }

  if (!formulario.funcionEquipo.trim()) {
    nuevosErrores.funcionEquipo = MENSAJES_REQUERIDOS.funcionEquipo;
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

  async function guardarEquipo() {
    setSubmitted(true);

    const nuevosErrores = validarFormulario(formulario);

    const tieneErrores = Object.values(nuevosErrores).some((valor) => valor !== "");

    if (tieneErrores) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);

    try {
      const payload = crearEquipoPayload(formulario);

      await agregarEquipo(payload);

      Alert.alert(
        "Equipo listo",
        "La vista ya deja preparado el payload para conectarlo con el backend."
      );

      // TODO backend: si la API responde con id o confirma el registro,
      // aquí se puede limpiar el formulario o navegar al detalle/listado.
      setFormulario(formularioInicial);
      setErrores({});
      setSubmitted(false);
    } catch (error) {
      Alert.alert(
        "No se pudo guardar",
        "Revisa la conexión con el backend cuando reemplaces el stub del servicio."
      );
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
  };
}