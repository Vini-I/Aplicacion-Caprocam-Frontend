import { useState } from "react";

const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TELEFONO_MAX_LENGTH = 14;

function obtenerMensajeError(nuevosErrores) {
  if (nuevosErrores.nombre || nuevosErrores.tipoProducto || nuevosErrores.telefono) {
    return "Complete los campos obligatorios para guardar.";
  }
  if (nuevosErrores.correo) return "Ingrese un correo electrónico válido";
  return "";
}

export function useNuevoProveedorScreen() {
  const [nombre, setNombre] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  function handleTelefonoChange(valor) {
    setTelefono(valor.replace(/[^\d\s\-+]/g, ""));
  }

  function handleSubmit() {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = true;
    if (!tipoProducto) nuevosErrores.tipoProducto = true;
    if (!telefono.trim()) nuevosErrores.telefono = true;
    if (telefono.trim() !== "" && !TELEFONO_REGEX.test(telefono.trim())) {
      nuevosErrores.telefono = true;
    }
    if (correo.trim() !== "" && !CORREO_REGEX.test(correo.trim())) {
      nuevosErrores.correo = true;
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeError(obtenerMensajeError(nuevosErrores));
      setGuardadoExitoso(false);
      return;
    }

    setErrores({});
    setMensajeError("");
    setGuardadoExitoso(true);

    const proveedor = {
      nombre: nombre.trim(),
      tipoProducto,
      telefono: telefono.trim(),
      correo: correo.trim(),
      direccion: direccion.trim(),
      notas: notas.trim(),
    };

    console.log("Proveedor guardado:", proveedor);
  }

  return {
    nombre,
    setNombre,
    tipoProducto,
    setTipoProducto,
    telefono,
    correo,
    setCorreo,
    direccion,
    setDireccion,
    notas,
    setNotas,
    errores,
    mensajeError,
    guardadoExitoso,
    handleTelefonoChange,
    handleSubmit,
  };
}
