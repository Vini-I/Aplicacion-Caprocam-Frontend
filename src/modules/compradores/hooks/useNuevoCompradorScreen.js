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

// Formato internacional (estilo E.164): "+" + código de país (1 a 3
// dígitos) + número local, con espacio opcional -- igual criterio
// que useEditarCompradorScreen.js. Ya no exige exactamente 8 dígitos
// "a la costarricense".
// Ejemplos válidos: +506 88888888, +1 2025550123, +52 5512345678,
// +34 612345678
const TELEFONO_FORMATO_REGEX = /^\+\d{1,3}\s?\d{4,14}$/;
const TELEFONO_DIGITOS_MIN = 8;
const TELEFONO_DIGITOS_MAX = 15;

export const TELEFONO_MAX_LENGTH = 20; // "+" + espacio + hasta 15 dígitos + margen
export const CEDULA_MIN_LENGTH = 8;
export const CEDULA_MAX_LENGTH = 15;

const CORREO_REGEX = /^[^\s@]+@[^\s@]+$/;
const CORREO_LARGO_MINIMO = 5;

function esTelefonoValido(valor) {
  const limpio = valor.trim();
  if (!TELEFONO_FORMATO_REGEX.test(limpio)) return false;
  const totalDigitos = limpio.replace(/\D/g, "").length;
  return totalDigitos >= TELEFONO_DIGITOS_MIN && totalDigitos <= TELEFONO_DIGITOS_MAX;
}

function esCedulaValida(valor) {
  const limpio = valor.trim();
  return limpio.length >= CEDULA_MIN_LENGTH && limpio.length <= CEDULA_MAX_LENGTH;
}

// Igual que en useEditarCompradorScreen.js: opcional, pero si se
// llena exige un largo mínimo además del formato.
function esCorreoValido(valor) {
  const limpio = valor.trim();
  if (limpio === "") return true; // correo no es obligatorio
  return limpio.length >= CORREO_LARGO_MINIMO && CORREO_REGEX.test(limpio);
}

const MENSAJE_ERROR_GENERAL = "Revisa los campos obligatorios marcados con * antes de guardar.";
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

    // Permite dígitos, espacios y un "+" al inicio (prefijo de país);
    // ya no se limita a dígitos puros de 8 cifras.
  const handleTelefonoChange = (valor) => {
    let limpio = valor.replace(/[^\d+\s]/g, "");
    limpio = limpio.replace(/(?!^)\+/g, "");
    setTelefono(limpio);
  };

  // Permite solo dígitos en la cédula
  const handleCedulaChange = (valor) => {
    setCedula(valor.replace(/[^\d]/g, ""));
  };

  // Valida los campos y guarda el comprador si no hay errores
  async function handleSubmit() {
    const errNombre = nombre.trim() === "";
    const errCedula = !esCedulaValida(cedula);
    const errTel = !esTelefonoValido(telefono);
    const errCorreo = !esCorreoValido(correo);

    setErrorNombre(errNombre);
    setErrorCedula(errCedula);
    setErrorTelefono(errTel);
    setErrorCorreo(errCorreo);

    if (errNombre || errCedula || errTel || errCorreo) {
      setMensajeError(MENSAJE_ERROR_GENERAL);
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
