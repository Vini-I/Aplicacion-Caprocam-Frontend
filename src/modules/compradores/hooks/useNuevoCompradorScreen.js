/**
 * ============================================================
 * HOOK: USENUEVOCOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Maneja el estado del formulario de alta de un nuevo comprador.
 *
 * FUNCIONALIDAD:
 * 1. Obligatorios: nombre y teléfono. El teléfono además debe
 *    cumplir el formato +506 XXXX-XXXX; el correo es opcional
 *    pero, si se llena, debe tener formato válido.
 * 2. handleTelefonoChange filtra en vivo caracteres no permitidos
 *    (solo dígitos, espacios, guiones y +), pero eso NO es
 *    validación: no marca error mientras se escribe.
 * 3. handleSubmit calcula un booleano de error por campo
 *    (errorNombre, errorTelefono, errorCorreo) para pintar el
 *    borde rojo, y UN SOLO mensaje general (mensajeError) para
 *    mostrar debajo del formulario.
 *
 * IMPORTANTE:
 * - Los errores solo se calculan dentro de handleSubmit: nunca
 *   antes de presionar "Guardar comprador".
 * - Mismo regex y misma regla de teléfono/correo que
 *   useEditarCompradorScreen.js, para que ambas pantallas validen
 *   igual.
 * - El campo "Tipo de producto" se eliminó: no tenía sentido en
 *   este flujo (antibióticos, fertilizantes, equipos, etc. no
 *   aplican a un comprador).
 * ============================================================
 */



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
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  // Estado de validación y alertas
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  // Permite solo dígitos, espacios, guiones y el símbolo + en el teléfono
  const handleTelefonoChange = (valor) => {
    setTelefono(valor.replace(/[^\d\s\-+]/g, ""));
  };

  // Valida los campos y guarda el comprador si no hay errores
  function handleSubmit() {
    const errNombre = nombre.trim() === "";
    const errTel = !esTelefonoValido(telefono);
    const errCorreo = !esCorreoValido(correo);

    setErrorNombre(errNombre);
    setErrorTelefono(errTel);
    setErrorCorreo(errCorreo);

    if (errNombre || errTel || errCorreo) {
      setMensajeError(MENSAJE_ERROR_GENERAL);
      setGuardadoExitoso(false);
      return;
    }

    setMensajeError("");
    setGuardadoExitoso(true);

    const comprador = {
      nombre: nombre.trim(),
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
    telefono,
    correo,
    setCorreo,
    direccion,
    setDireccion,
    notas,
    setNotas,
    errorNombre,
    errorTelefono,
    errorCorreo,
    mensajeError, 
    guardadoExitoso,
    handleTelefonoChange,
    handleSubmit,
    handleVolver,
  };
}
