import { useState } from "react";
import { useRouter } from "expo-router";

// Regex para validar teléfonos con o sin código de país +506
const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
export const TELEFONO_MAX_LENGTH = 14;

// Regex básico para validar formato de correo electrónico
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esTelefonoValido(valor) {
  return valor.trim() !== "" && TELEFONO_REGEX.test(valor.trim());
}

function esCorreoValido(valor) {
  return valor.trim() === "" || CORREO_REGEX.test(valor.trim()); // correo no es obligatorio
}

const MENSAJE_ERROR_GENERAL = "Revisa los campos obligatorios marcados con * antes de guardar.";

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
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorTipoProducto, setErrorTipoProducto] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  // Permite solo dígitos, espacios, guiones y el símbolo + en el teléfono
  const handleTelefonoChange = (valor) => {
    setTelefono(valor.replace(/[^\d\s\-+]/g, ""));
  };

  // Retorna el mensaje de error según los campos inválidos
 

  // Valida los campos y guarda el comprador si no hay errores
  function handleSubmit() {
   const errNombre = nombre.trim() === "";
  const errTipo = tipoProducto === "";
  const errTel = !esTelefonoValido(telefono);
  const errCorreo = !esCorreoValido(correo);

  setErrorNombre(errNombre);
  setErrorTipoProducto(errTipo);
  setErrorTelefono(errTel);
  setErrorCorreo(errCorreo);

  if (errNombre || errTipo || errTel || errCorreo) {
    setMensajeError(MENSAJE_ERROR_GENERAL);
    setGuardadoExitoso(false);
    return;
  }

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
    errorNombre,
    errorTipoProducto,
    errorTelefono,
    errorCorreo,
    mensajeError, 
    guardadoExitoso,
    handleTelefonoChange,
    handleSubmit,
    handleVolver,
  };
}
