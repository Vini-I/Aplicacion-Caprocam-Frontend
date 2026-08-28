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
 * 4. Al guardar con éxito, navega a CompradorScreen (la lista) y le
 *    pasa el parámetro "guardado" para que esa pantalla muestre ahí
 *    el alert de éxito por 3 segundos. Este formulario ya no
 *    muestra ni el alert ni limpia campos: al navegar, la pantalla
 *    se desmonta.
 *
 * IMPORTANTE:
 * - Los errores solo se calculan dentro de handleSubmit: nunca
 *   antes de presionar "Guardar comprador".
 * - Mismo regex y misma regla de teléfono/correo que
 *   useEditarCompradorScreen.js, para que ambas pantallas validen
 *   igual.
 * - La cédula se valida como obligatoria y con una longitud de entre
 *   CEDULA_MIN_LENGTH (8) y CEDULA_MAX_LENGTH (15) dígitos (no se le
 *   exige un formato exacto por tipo de cédula): una vez guardado el
 *   comprador, la cédula ya no se puede modificar (en EditarComprador
 *   se muestra deshabilitada).
 * - El campo "Tipo de producto" se eliminó: no tenía sentido en
 *   este flujo (antibióticos, fertilizantes, equipos, etc. no
 *   aplican a un comprador).
 * ============================================================
 */



import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { compradorService } from "../services/comprador.service";
import { useError } from "../../../shared/context/ErrorContext";

// Exige exactamente 8 dígitos
const TELEFONO_REGEX = /^\d{8}$/;

export const TELEFONO_MAX_LENGTH = 8;
export const CEDULA_MIN_LENGTH = 8;
export const CEDULA_MAX_LENGTH = 15;

const CORREO_REGEX = /^[^\s@]+@[^\s@]+$/;
// Mínimo de caracteres exigido en la parte ANTES del @ (no en el
// correo completo).
const CORREO_LARGO_MINIMO = 3;

function esTelefonoValido(valor) {
  return valor.trim() !== "" && TELEFONO_REGEX.test(valor.trim());
}

function esCedulaValida(valor) {
  const limpio = valor.trim();
  return limpio.length >= CEDULA_MIN_LENGTH && limpio.length <= CEDULA_MAX_LENGTH;
}

// Igual que en useEditarCompradorScreen.js: opcional, pero si se
// llena exige formato @ y un largo mínimo en la parte ANTES del @.
function esCorreoValido(valor) {
  const limpio = valor.trim();
  if (limpio === "") return true; // correo no es obligatorio
  if (!CORREO_REGEX.test(limpio)) return false;
  const parteLocal = limpio.split("@")[0];
  return parteLocal.length >= CORREO_LARGO_MINIMO;
}

const MENSAJE_ERROR_GENERAL = "Revisa los campos obligatorios marcados con * antes de guardar.";
const MENSAJE_ERROR_TELEFONO = "No se está cumpliendo con el teléfono permitido. Ej: 22223344";
const MENSAJE_ERROR_CORREO = "No se está cumpliendo con el correo permitido. Ej: gallardo@gmail.com";
const MENSAJE_ERROR_GUARDADO = "No se pudo guardar el comprador. Intenta de nuevo.";

export function useNuevoCompradorScreen() {
  const router = useRouter();
  const { mostrarError } = useError();

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
    const errCedula = !esCedulaValida(cedula);
    const telefonoVacio = telefono.trim() === "";
    const errTel = !esTelefonoValido(telefono);
    const errCorreo = !esCorreoValido(correo);

    setErrorNombre(errNombre);
    setErrorCedula(errCedula);
    setErrorTelefono(errTel);
    setErrorCorreo(errCorreo);

    // Prioridad de mensaje
    if (errNombre || errCedula || telefonoVacio) {
      setMensajeError(MENSAJE_ERROR_GENERAL);
      return;
    }

    if (errTel) {
      setMensajeError(MENSAJE_ERROR_TELEFONO);
      return;
    }

    if (errCorreo) {
      setMensajeError(MENSAJE_ERROR_CORREO);
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
      setGuardando(false);
      mostrarError(error);
      return;
    }
    setGuardando(false);
    setMensajeError("");

    // Navega a la lista de compradores; ahí se muestra el alert de
    // "guardado" por 3 segundos (ver useCompradorScreen).
    router.replace({
      pathname: "/(drawer)/compradores/compradorScreen",
      params: { guardado: "1" },
    });
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
    guardando,
    handleCedulaChange,
    handleTelefonoChange,
    handleSubmit,
    handleVolver,
  };
}
