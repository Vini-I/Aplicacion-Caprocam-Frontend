import { useState } from "react";
import { useRouter } from "expo-router";
import { compradoresMock } from "../services/CompradorData";

// Regex para validar teléfonos con o sin código de país +506
const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
export const TELEFONO_MAX_LENGTH = 14;

// Regex básico para validar formato de correo electrónico
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Retorna mensaje de error si el teléfono está vacío o tiene formato inválido
function validarTelefono(valor) {
  if (!valor) return "El teléfono es obligatorio.";
  if (!TELEFONO_REGEX.test(valor))
    return "Ingrese un teléfono válido. Ej: +506 2222-3344";
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

  // Carga los datos actuales del comprador como valores iniciales del formulario
  const base = compradoresMock[0];

  // Campos del formulario
  const [nombre, setNombre] = useState(base.nombre);
  const [tipoProducto, setTipoProducto] = useState(base.tipoProducto);
  const [telefono, setTelefono] = useState(base.telefono);
  const [correo, setCorreo] = useState(base.correo);
  const [direccion, setDireccion] = useState(base.direccion);
  const [notas, setNotas] = useState(base.notas);

  // Errores por campo y alerta general del formulario
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [alerta, setAlerta] = useState(null);

  // Valida el teléfono en tiempo real mientras el usuario escribe
  function handleTelefonoChange(valor) {
    setTelefono(valor);
    setErrorTelefono(validarTelefono(valor));
  }

  // Valida el correo en tiempo real mientras el usuario escribe
  function handleCorreoChange(valor) {
    setCorreo(valor);
    setErrorCorreo(validarCorreo(valor));
  }

  function volverADetalle() {
    router.replace({
      pathname: "/(drawer)/compradores/detalleComprador",
      params: { id: base.id.toString() },
    });
  }

  // Valida todos los campos y guarda si no hay errores
  function guardar() {
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

    setAlerta({
      variant: "success",
      message: "Comprador actualizado correctamente.",
    });
  }

  return {
    nombre,
    tipoProducto,
    setTipoProducto,
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
