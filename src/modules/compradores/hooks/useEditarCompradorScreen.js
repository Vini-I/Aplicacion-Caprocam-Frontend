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
 *    como valores iniciales del formulario, y guarda una copia
 *    (original) para poder comparar contra lo que el usuario edite.
 * 2. Valida teléfono (obligatorio, con formato) y correo (opcional,
 *    pero si se llena debe tener formato válido -- igual que en
 *    useNuevoCompradorScreen.js) solo al presionar "Guardar" (función
 *    guardar), nunca mientras se escribe. Dirección y notas son
 *    opcionales y no se validan.
 * 3. Exige que haya al menos un cambio real respecto a los valores
 *    originales antes de guardar (si no hay cambios, muestra una
 *    advertencia en vez de llamar a la API).
 * 4. Muestra una única alerta general: error si teléfono/correo son
 *    inválidos, advertencia si no hay cambios, éxito si se guardó.
 * 5. Expone la navegación de vuelta al detalle del comprador.
 *
 * IMPORTANTE:
 * - handleTelefonoChange/handleCorreoChange solo actualizan el
 *   valor: no validan en cada tecla, para que el borde/mensaje
 *   rojo aparezca únicamente después de intentar guardar.
 * - sinCambios: se activa al presionar "Guardar" sin haber tocado
 *   ningún campo editable (teléfono, correo, dirección, notas), y
 *   pone en rojo el borde de los 4 para indicar que hay que
 *   modificar alguno. Se limpia automáticamente en cuanto el
 *   usuario edita cualquiera de esos campos, o al intentar guardar
 *   de nuevo.
 * - Igual que nombre, cedula se carga desde el comprador base pero
 *   no se expone ningún setter: no se puede modificar una vez
 *   creado el comprador (en la pantalla se muestra deshabilitada).
 * ============================================================
 */


import { useState, useEffect, useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { compradorService, mapComprador } from "../services/comprador.service";
import { useError } from "../../../shared/context/ErrorContext";

// Formato internacional (estilo E.164): "+" seguido del código de
// país (1 a 3 dígitos) y el número local, con un espacio opcional
// entre ambos -- ya NO asume que todo teléfono es de Costa Rica.
// Ejemplos válidos: +506 88888888, +1 2025550123, +52 5512345678,
// +34 612345678
const TELEFONO_FORMATO_REGEX = /^\+\d{1,3}\s?\d{4,14}$/;
// Mínimo de dígitos totales (sin contar el "+"), para filtrar
// números claramente incompletos como "5" o "55555" -- no un
// mínimo pensado para un solo país.
const TELEFONO_DIGITOS_MIN = 8;
// Máximo de dígitos totales, siguiendo el estándar internacional E.164.
const TELEFONO_DIGITOS_MAX = 15;
export const TELEFONO_MAX_LENGTH = 20; // "+" + espacio + hasta 15 dígitos + margen

const CORREO_REGEX = /^[^\s@]+@[^\s@]+$/;
const CORREO_LARGO_MINIMO = 5;

// Retorna mensaje de error si el teléfono está vacío o tiene formato inválido.
// Exige código de país (+506, +1, +34, +52, etc.) y un total de
// dígitos dentro de un rango internacional razonable -- ya no exige
// exactamente 8 dígitos "a la costarricense".
function validarTelefono(valor) {
  if (!valor) return "El teléfono es obligatorio.";
  const limpio = valor.trim();
  if (!TELEFONO_FORMATO_REGEX.test(limpio)) {
    return "Ingrese un teléfono con código de país. Ej: +506 88888888";
  }
  const totalDigitos = limpio.replace(/\D/g, "").length;
  if (totalDigitos < TELEFONO_DIGITOS_MIN || totalDigitos > TELEFONO_DIGITOS_MAX) {
    return "Ingrese un teléfono con código de país. Ej: +506 88888888";
  }
  return "";
}

// Retorna mensaje de error si el correo tiene formato inválido (es opcional,
// igual que en useNuevoCompradorScreen.js: solo se valida si el usuario
// escribió algo, nunca se exige). Igual que en Proveedores, exige un
// largo mínimo de caracteres además del formato.
function validarCorreo(valor) {
  if (!valor) return "";
  const limpio = valor.trim();
  if (limpio.length < CORREO_LARGO_MINIMO)
    return `El correo debe tener al menos ${CORREO_LARGO_MINIMO} caracteres.`;
  if (!CORREO_REGEX.test(limpio))
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

  // Valores tal como llegaron del back, para poder comparar y saber si
  // el usuario realmente cambió algo antes de guardar (solo los campos
  // editables: teléfono, correo, dirección y notas -- nombre y cédula
  // están deshabilitados en esta pantalla y nunca cambian).
  const [original, setOriginal] = useState({
    telefono: "",
    correo: "",
    direccion: "",
    notas: "",
  });

  // Errores por campo y alerta general del formulario
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [alerta, setAlerta] = useState(null);

  // Se activa cuando el usuario presiona "Guardar" sin haber modificado
  // ningún campo: pone en rojo los 4 campos editables (teléfono, correo,
  // dirección, notas) para que quede claro qué se puede/debe cambiar.
  // Se limpia apenas el usuario toca cualquiera de esos campos.
  const [sinCambios, setSinCambios] = useState(false);

  useEffect(() => {
    setSinCambios(false);
  }, [telefono, correo, direccion, notas]);

  // Disponible para que la pantalla deshabilite el botón "Guardar"
  // mientras no haya ningún cambio real -- así se evita mostrar la
  // alerta de "Realiza algún cambio antes de guardar" al presionar
  // un botón que de entrada no debería poder presionarse.
  const hayCambios =
    telefono !== original.telefono ||
    correo !== original.correo ||
    direccion !== original.direccion ||
    notas !== original.notas;

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
      // Se conserva el teléfono TAL CUAL vino guardado (con su
      // prefijo de país completo, sea +506, +1, +34, +52, etc.). Ya
      // no se recorta a 8 dígitos asumiendo Costa Rica -- eso era lo
      // que hacía perder el prefijo al guardar.
      setNombre(comprador.nombre);
      setCedula(comprador.cedula);
      setTelefono(comprador.telefono);
      setCorreo(comprador.correo);
      setDireccion(comprador.direccion);
      setNotas(comprador.notas);
      setOriginal({
        telefono: comprador.telefono,
        correo: comprador.correo,
        direccion: comprador.direccion,
        notas: comprador.notas,
      });
    } catch (err) {
      setErrorCarga("No se pudo cargar el comprador.");
      mostrarError(err);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) cargarComprador();
  }, [id, cargarComprador]);

  // Solo actualizan el valor: no validan mientras se escribe
  function handleTelefonoChange(valor) {
    // Permite dígitos, espacios y un "+" -- pero el "+" solo se
    // conserva si aparece al inicio (prefijo de país). Ya no se
    // recortan los caracteres a 8 dígitos: se acepta el número
    // internacional completo tal como lo escribe el usuario.
    let limpio = valor.replace(/[^\d+\s]/g, "");
    limpio = limpio.replace(/(?!^)\+/g, "");
    setTelefono(limpio);
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
    setSinCambios(false);

    if (errorTel !== "" || errorCorr !== "") {
      setAlerta({
        variant: "danger",
        message: "Por favor corrige los datos antes de guardar.",
      });
      return;
    }

    const hayCambiosAlGuardar =
      telefono !== original.telefono ||
      correo !== original.correo ||
      direccion !== original.direccion ||
      notas !== original.notas;

    // Respaldo defensivo: con hayCambios ya deshabilitando el botón
    // en la pantalla, este caso no debería alcanzarse desde la UI,
    // pero se deja por si guardar() se llama desde otro lado.
    if (!hayCambiosAlGuardar) {
      setSinCambios(true);
      setAlerta({
        variant: "warning",
        message: "Realiza algún cambio antes de guardar.",
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
      mostrarError(err);
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
    sinCambios,
    hayCambios,
    alerta,
    handleTelefonoChange,
    handleCorreoChange,
    volverADetalle,
    guardar,
  };
}
