/**
 * ============================================================
 * HOOK: USEEDITARCOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Maneja el estado del formulario de edición de comprador.
 *
 * FUNCIONALIDAD:
 * 1. Carga los datos actuales del comprador (compradoresMock[0])
 *    como valores iniciales del formulario.
 * 2. Valida teléfono y correo (obligatorios, con formato) solo al
 *    presionar "Guardar" (función guardar), nunca mientras se
 *    escribe.
 * 3. Muestra una única alerta general: error si teléfono/correo
 *    son inválidos, advertencia si faltan dirección/notas, éxito
 *    si todo está correcto.
 * 4. Expone la navegación de vuelta al detalle del comprador.
 *
 * IMPORTANTE:
 * - handleTelefonoChange/handleCorreoChange solo actualizan el
 *   valor: no validan en cada tecla, para que el borde/mensaje
 *   rojo aparezca únicamente después de intentar guardar.
 * - Igual que nombre, cedula se carga desde el comprador base pero
 *   no se expone ningún setter: no se puede modificar una vez
 *   creado el comprador (en la pantalla se muestra deshabilitada).
 * ============================================================
 */


import { useState, useEffect, useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { compradorService, mapComprador } from "../services/comprador.service";
import { useError } from "../../../shared/context/ErrorContext";

// Regex para validar teléfonos con o sin código de país +506
const TELEFONO_REGEX = /^\d{8}$/;
export const TELEFONO_MAX_LENGTH = 8;

// Regex básico para validar formato de correo electrónico
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Retorna mensaje de error si el teléfono está vacío o tiene formato inválido
function validarTelefono(valor) {
  if (!valor) return "El teléfono es obligatorio.";
  if (!TELEFONO_REGEX.test(valor))
    return "Ingrese un teléfono válido. Ej: 22223344";
  return "";
}

// Retorna mensaje de error si el correo está vacío o tiene formato inválido
function validarCorreo(valor) {
  if (!valor) return "El correo es obligatorio.";
  if (!CORREO_REGEX.test(valor))
    return "Ingrese un correo válido. Ej: ventas@empresa.com";
  return "";
}

export function useEditarCompradorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { mostrarError } = useError();

  // Estado de carga inicial del comprador
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  // La cédula no se puede editar: se carga desde el comprador y no se
  // expone ningún setter hacia la pantalla.
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  // Errores por campo y alerta general del formulario
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [alerta, setAlerta] = useState(null);

  //se autolimpia a los 6 segundos
  useEffect(() => {
    if (alerta && (alerta.variant === "danger" || alerta.variant === "warning")) {
      const t = setTimeout(() => setAlerta(null), 6000);
      return () => clearTimeout(t);
    }
  }, [alerta]);

  // Carga el comprador desde la API y precarga el formulario
  const cargarComprador = useCallback(async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const data = await compradorService.getCompradorPorId(id);
      const comprador = mapComprador(data);
      setNombre(comprador.nombre);
      setCedula(comprador.cedula);
      setTelefono(comprador.telefono);
      setCorreo(comprador.correo);
      setDireccion(comprador.direccion);
      setNotas(comprador.notas);
    } catch (err) {
      setErrorCarga("No se pudo cargar el comprador.");
      mostrarError(err);
    } finally {
      setCargando(false);
    }
  }, [id, mostrarError]);

  useEffect(() => {
    if (id) cargarComprador();
  }, [id, cargarComprador]);

  // Solo actualizan el valor: no validan mientras se escribe
  function handleTelefonoChange(valor) {
    setTelefono(valor.replace(/[^\d]/g, ""));
  }

  function handleCorreoChange(valor) {
    setCorreo(valor);
  }

  function volverADetalle() {
    router.replace({
      pathname: "/(drawer)/compradores/detalleComprador",
      params: { id: id?.toString() },
    });
  }

  // Valida todos los campos y guarda en la API si no hay errores
  async function guardar() {
    const errorTel = validarTelefono(telefono);
    const errorCorr = validarCorreo(correo);
    setErrorTelefono(errorTel);
    setErrorCorreo(errorCorr);

    if (errorTel !== "" || errorCorr !== "") {
      setAlerta({
        variant: "danger",
        message: "Por favor corrige los datos antes de guardar.",
      });
      return;
    }

    if (!direccion || !notas) {
      setAlerta({
        variant: "warning",
        message: "Hay campos sin completar. Revisa la información antes de continuar.",
      });
      return;
    }

    setGuardando(true);
    try {
      await compradorService.actualizarComprador(id, {
        nombre,
        cedula,
        telefono,
        correo,
        direccion,
        notas,
      });
    } catch (err) {
      setGuardando(false);
      setAlerta({
        variant: "danger",
        message: "No se pudo actualizar el comprador. Intenta de nuevo.",
      });
      return;
    }
    setGuardando(false);

    setAlerta({
      variant: "success",
      message: "Comprador actualizado correctamente.",
    });

    setTimeout(() => {
      router.replace({
        pathname: "/(drawer)/compradores/detalleComprador",
        params: { id: id?.toString() },
      });
    }, 900);
  }

  return {
    cargando,
    errorCarga,
    guardando,
    nombre,
    cedula,
    telefono,
    correo,
    direccion,
    setDireccion,
    notas,
    setNotas,
    errorTelefono,
    errorCorreo,
    alerta,
    handleTelefonoChange,
    handleCorreoChange,
    volverADetalle,
    guardar,
  };
}
