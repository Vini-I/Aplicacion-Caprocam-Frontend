/**
 * ============================================================
 * HOOK: USENUEVOCOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Maneja el estado del formulario de alta de un nuevo comprador.
 *
 * FUNCIONALIDAD:
 * 1. Obligatorios: nombre, cédula y teléfono. El teléfono además
 *    debe cumplir el formato +506 XXXX-XXXX; el correo es opcional
 *    pero, si se llena, debe tener formato válido.
 * 2. handleTelefonoChange filtra en vivo caracteres no permitidos
 *    (solo dígitos, espacios, guiones y +), pero eso NO es
 *    validación: no marca error mientras se escribe. handleCedulaChange
 *    hace lo mismo para la cédula (solo dígitos y guiones).
 * 3. handleSubmit calcula un booleano de error por campo
 *    (errorNombre, errorCedula, errorTelefono, errorCorreo) para
 *    pintar el borde rojo, y UN SOLO mensaje general (mensajeError)
 *    para mostrar debajo del formulario.
 * 4. Al guardar con éxito, YA NO navega a la lista: muestra el
 *    alert de "guardado" por 3 segundos y luego limpia todo el
 *    formulario (campos y errores) para que se pueda cargar otro
 *    comprador sin salir de la pantalla.
 *
 * IMPORTANTE:
 * - Los errores solo se calculan dentro de handleSubmit: nunca
 *   antes de presionar "Guardar comprador".
 * - Mismo regex y misma regla de teléfono/correo que
 *   useEditarCompradorScreen.js, para que ambas pantallas validen
 *   igual.
 * - La cédula solo se valida como obligatoria (no se le exige un
 *   formato exacto): una vez guardado el comprador, la cédula ya no
 *   se puede modificar (en EditarComprador se muestra deshabilitada).
 * - El campo "Tipo de producto" se eliminó: no tenía sentido en
 *   este flujo (antibióticos, fertilizantes, equipos, etc. no
 *   aplican a un comprador).
 * ============================================================
 */



import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { compradorService } from "../services/comprador.service";

// Regex para validar teléfonos con o sin código de país +506
const TELEFONO_REGEX = /^\d{8}$/;

export const TELEFONO_MAX_LENGTH = 8;
export const CEDULA_MAX_LENGTH = 10;

// Regex básico para validar formato de correo electrónico
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esTelefonoValido(valor) {
  return valor.trim() !== "" && TELEFONO_REGEX.test(valor.trim());
}

function esCorreoValido(valor) {
  return valor.trim() === "" || CORREO_REGEX.test(valor.trim()); // correo no es obligatorio
}

const MENSAJE_ERROR_GENERAL = "Revisa los campos obligatorios marcados con * antes de guardar.";
const MENSAJE_ERROR_GUARDADO = "No se pudo guardar el comprador. Intenta de nuevo.";

export function useNuevoCompradorScreen() {
  const router = useRouter();

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  // Estado de validación y alertas
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorCedula, setErrorCedula] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // el alert de error se autolimpia a los 6 segundos
  useEffect(() => {
    if (mensajeError) {
      const t = setTimeout(() => setMensajeError(""), 6000);
      return () => clearTimeout(t);
    }
  }, [mensajeError]);

    // Permite solo dígitos en el teléfono
  const handleTelefonoChange = (valor) => {
    setTelefono(valor.replace(/[^\d]/g, ""));
  };

  // Permite solo dígitos en la cédula
  const handleCedulaChange = (valor) => {
    setCedula(valor.replace(/[^\d]/g, ""));
  };

  // Valida los campos y guarda el comprador si no hay errores
  async function handleSubmit() {
    const errNombre = nombre.trim() === "";
    const errCedula = cedula.trim() === "";
    const errTel = !esTelefonoValido(telefono);
    const errCorreo = !esCorreoValido(correo);

    setErrorNombre(errNombre);
    setErrorCedula(errCedula);
    setErrorTelefono(errTel);
    setErrorCorreo(errCorreo);

    if (errNombre || errCedula || errTel || errCorreo) {
      setMensajeError(MENSAJE_ERROR_GENERAL);
      setGuardadoExitoso(false);
      return;
    }

    const comprador = {
      nombre: nombre.trim(),
      cedula: cedula.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
      direccion: direccion.trim(),
      notas: notas.trim(),
    };

    setGuardando(true);
    try {
      await compradorService.crearComprador(comprador);
    } catch (error) {
      setMensajeError(MENSAJE_ERROR_GUARDADO);
      setGuardadoExitoso(false);
      setGuardando(false);
      return;
    }
    setGuardando(false);

    setMensajeError("");
    setGuardadoExitoso(true);

    // Ya no navegamos fuera de la pantalla: mostramos el alert de
    // éxito por 3 segundos y luego limpiamos el formulario para que
    // el usuario pueda registrar otro comprador sin salir de acá.
    setTimeout(() => {
      setGuardadoExitoso(false);
      setNombre("");
      setCedula("");
      setTelefono("");
      setCorreo("");
      setDireccion("");
      setNotas("");
      setErrorNombre(false);
      setErrorCedula(false);
      setErrorTelefono(false);
      setErrorCorreo(false);
    }, 3000);
  }

  function handleVolver() {
    router.replace("/(drawer)/compradores/compradorScreen");
  }

  return {
    nombre,
    setNombre,
    cedula,
    telefono,
    correo,
    setCorreo,
    direccion,
    setDireccion,
    notas,
    setNotas,
    errorNombre,
    errorCedula,
    errorTelefono,
    errorCorreo,
    mensajeError, 
    guardadoExitoso,
    guardando,
    handleCedulaChange,
    handleTelefonoChange,
    handleSubmit,
    handleVolver,
  };
}
