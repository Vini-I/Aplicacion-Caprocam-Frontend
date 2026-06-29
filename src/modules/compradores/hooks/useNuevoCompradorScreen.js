import { useState } from "react";
import { useRouter } from "expo-router";

// Regex para validar teléfonos con o sin código de país +506
const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
export const TELEFONO_MAX_LENGTH = 14;

// Regex básico para validar formato de correo electrónico
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useNuevoCompradorScreen() {
  const router = useRouter();

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  // Estado de validación y alertas
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  // Permite solo dígitos, espacios, guiones y el símbolo + en el teléfono
  const handleTelefonoChange = (valor) => {
    setTelefono(valor.replace(/[^\d\s\-+]/g, ""));
  };

  // Retorna el mensaje de error según los campos inválidos
  function obtenerMensajeError(nuevosErrores) {
    if (nuevosErrores.nombre || nuevosErrores.tipoProducto || nuevosErrores.telefono) {
      return "Complete los campos obligatorios para guardar.";
    }
    if (nuevosErrores.telefono) return "El teléfono debe tener 8 dígitos";
    if (nuevosErrores.correo) return "Ingrese un correo electrónico válido";
    return "";
  }

  // Valida los campos y guarda el comprador si no hay errores
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

    const comprador = {
      nombre: nombre.trim(),
      tipoProducto,
      telefono: telefono.trim(),
      correo: correo.trim(),
      direccion: direccion.trim(),
      notas: notas.trim(),
    };

    console.log("Comprador guardado:", comprador);
  }

  function handleVolver() {
    router.replace("/(drawer)/compradores/compradorScreen");
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
    handleVolver,
  };
}
