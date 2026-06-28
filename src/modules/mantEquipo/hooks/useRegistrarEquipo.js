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

function validarFormulario(formulario) {
  const nuevosErrores = {};

  if (!formulario.codigoInterno.trim()) {
    nuevosErrores.codigoInterno = true;
  }

  if (!formulario.descripcion.trim()) {
    nuevosErrores.descripcion = true;
  }

  if (!formulario.fechaInstalacion.trim()) {
    nuevosErrores.fechaInstalacion = true;
  }

  if (!formulario.tipo) {
    nuevosErrores.tipo = true;
  }

  if (!formulario.estado) {
    nuevosErrores.estado = true;
  }

  if (!formulario.funcionEquipo.trim()) {
    nuevosErrores.funcionEquipo = true;
  }

  return nuevosErrores;
}

export function useRegistrarEquipo() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    if (errores[campo]) {
      setErrores((actual) => {
        const siguientesErrores = { ...actual };

        delete siguientesErrores[campo];

        return siguientesErrores;
      });
    }
  }

  async function guardarEquipo() {
    const nuevosErrores = validarFormulario(formulario);

    if (Object.keys(nuevosErrores).length > 0) {
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
    guardando,
    tiposEquipo: TIPOS_EQUIPO,
    estadosEquipo: ESTADOS_EQUIPO,
    actualizarCampo,
    guardarEquipo,
  };
}