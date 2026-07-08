import { useState } from "react";
import { proveedoresMock } from "../services/ProveedorData";

const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TELEFONO_MAX_LENGTH = 14;

function validarTelefono(valor) {
  if (!valor) return "El teléfono es obligatorio.";
  if (!TELEFONO_REGEX.test(valor))
    return "Ingrese un teléfono válido. Ej: +506 2222-3344";
  return "";
}

function validarCorreo(valor) {
  if (!valor) return "El correo es obligatorio.";
  if (!CORREO_REGEX.test(valor))
    return "Ingrese un correo válido. Ej: ventas@empresa.com";
  return "";
}

export function useEditarProveedorScreen() {
  const base = proveedoresMock[0];

  const [nombre] = useState(base.nombre);
  const [tipoProducto, setTipoProducto] = useState(base.tipoProducto);
  const [telefono, setTelefono] = useState(base.telefono);
  const [correo, setCorreo] = useState(base.correo);
  const [direccion, setDireccion] = useState(base.direccion);
  const [notas, setNotas] = useState(base.notas);
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [alerta, setAlerta] = useState(null);

  function handleTelefonoChange(valor) {
    setTelefono(valor);
    setErrorTelefono(validarTelefono(valor));
  }

  function handleCorreoChange(valor) {
    setCorreo(valor);
    setErrorCorreo(validarCorreo(valor));
  }

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
      message: "Proveedor actualizado correctamente.",
    });
  }

  return {
    base,
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
    guardar,
  };
}
