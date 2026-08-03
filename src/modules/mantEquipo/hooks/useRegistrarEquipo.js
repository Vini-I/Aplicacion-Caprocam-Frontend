/**
 * HOOK: useRegistrarEquipo
 * Gestiona el estado, validación por intento de guardado y armado del payload para crear o editar equipos.
 *
 * @dependencies - registrarEquipoService.js (services/registrarEquipoService.js)
 * @validations  - Valida campos obligatorios y formato de fecha (dd/mm/aaaa) al intentar guardar.
 * @navigation   - Ninguna
 */

import { useState, useEffect } from 'react';
import {
  agregarEquipo,
  actualizarEquipo,
  crearEquipoPayload,
  ESTADOS_OPERATIVOS_EQUIPO,
  TIPOS_EQUIPO,
} from '../services/registrarEquipoService';

// Obtener fecha actual en formato dd/mm/aaaa
function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

const formularioInicial = {
  codigoInterno: '',
  nombre: '',
  descripcion: '',
  tipo: '',
  fechaInstalacion: obtenerFechaActual(),
  funcionEquipo: '',
  estanqueId: '',
  horasMantenimiento: '500',
  estadoOperativo: '',
};

const MENSAJES_REQUERIDOS = {
  codigoInterno: 'El número de serie/identificador es obligatorio.',
  nombre: 'El nombre del equipo es obligatorio.',
  descripcion: 'La descripción es obligatoria.',
  tipo: 'Debe seleccionar el tipo de equipo.',
  fechaInstalacion: 'La fecha de instalación es obligatoria.',
  fechaInstalacionFormato: 'La fecha debe tener formato dd/mm/aaaa.',
  funcionEquipo: 'La función del equipo es obligatoria.',
  estadoOperativo: 'Debe seleccionar el estado operativo del equipo.',
};

function esFechaValidaDDMMAAAA(valor) {
  const partes = valor.split('/');
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
    codigoInterno: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    fechaInstalacion: '',
    funcionEquipo: '',
    estadoOperativo: '',
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
  if (!formulario.fechaInstalacion.trim()) {
    nuevosErrores.fechaInstalacion = MENSAJES_REQUERIDOS.fechaInstalacion;
  } else if (!esFechaValidaDDMMAAAA(formulario.fechaInstalacion.trim())) {
    nuevosErrores.fechaInstalacion = MENSAJES_REQUERIDOS.fechaInstalacionFormato;
  }
  if (!formulario.funcionEquipo.trim()) {
    nuevosErrores.funcionEquipo = MENSAJES_REQUERIDOS.funcionEquipo;
  }
  if (!formulario.estadoOperativo) {
    nuevosErrores.estadoOperativo = MENSAJES_REQUERIDOS.estadoOperativo;
  }

  return nuevosErrores;
}

function capitalizarPrimeraLetra(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function useRegistrarEquipo(initialData = null) {
  const isEditing = !!initialData;

  // Estado inicial: si hay datos, usarlos; si no, formulario vacío
  const [formulario, setFormulario] = useState(() => {
    if (initialData) {
      return {
        codigoInterno: initialData.serie || initialData.codigoInterno || '',
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        tipo: capitalizarPrimeraLetra(initialData.tipo) || '',
        fechaInstalacion: initialData.fechaInstalacion || obtenerFechaActual(),
        funcionEquipo: initialData.funcionEquipo || '',
        estanqueId: initialData.estanqueId || '',
        horasMantenimiento: String(initialData.horasMantenimiento || '500'),
        estadoOperativo: capitalizarPrimeraLetra(initialData.estado) || '',
      };
    }
    return { ...formularioInicial };
  });

  // Sincronizar cuando initialData cambie (cuando se cargue el equipo en edición)
  useEffect(() => {
    if (initialData) {
      setFormulario({
        codigoInterno: initialData.serie || initialData.codigoInterno || '',
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        tipo: capitalizarPrimeraLetra(initialData.tipo) || '',
        fechaInstalacion: initialData.fechaInstalacion || obtenerFechaActual(),
        funcionEquipo: initialData.funcionEquipo || '',
        estanqueId: initialData.estanqueId || '',
        horasMantenimiento: String(initialData.horasMantenimiento || '500'),
        estadoOperativo: capitalizarPrimeraLetra(initialData.estado) || '',
      });
    } else {
      setFormulario({ ...formularioInicial });
    }
  }, [initialData]);

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
    setFormulario({ ...formularioInicial });
    setErrores({});
    setSubmitted(false);
    setGuardando(false);
  }

  async function guardarEquipo() {
    setSubmitted(true);

    const nuevosErrores = validarFormulario(formulario);
    const mensajes = Object.values(nuevosErrores).filter((msg) => msg !== '');

    if (mensajes.length > 0) {
      setErrores(nuevosErrores);
      // Mensaje genérico sin lista de errores específicos
      throw new Error('Revisa los campos obligatorios marcados con *');
    }

    setGuardando(true);

    try {
      const payload = crearEquipoPayload(formulario, {
        isEditing,
        estadoActual: initialData?.encendido ? 'Encendido' : 'Apagado',
        horasActualesActual: initialData?.horasUso,
      });

      if (isEditing) {
        await actualizarEquipo(initialData.id, payload);
      } else {
        await agregarEquipo(payload);
      }

      // Solo limpiar si es creación, no en edición
      if (!isEditing) {
        resetFormulario();
      }
    } catch (error) {
      throw new Error(error.message || 'No se pudo guardar el equipo. Intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  }

  return {
    formulario,
    errores,
    submitted,
    guardando,
    isEditing,
    tiposEquipo: TIPOS_EQUIPO,
    estadosOperativos: ESTADOS_OPERATIVOS_EQUIPO,
    actualizarCampo,
    guardarEquipo,
    resetFormulario,
  };
}