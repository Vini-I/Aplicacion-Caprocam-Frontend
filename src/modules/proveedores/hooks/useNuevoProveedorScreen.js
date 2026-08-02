/**
 * ============================================================
 * HOOK NUEVO PROVEEDOR
 * ============================================================
 *
 * Logica de la pantalla de registro de un nuevo proveedor.
 *
 * FUNCIONALIDAD:
 * 1. Maneja el estado del formulario: nombre, tipoProducto, telefono,
 *    correo, direccion, notas.
 * 
 * 2. Nombre, tipo de producto, telefono, correo y direccion son
 *    obligatorios (asterisco visible desde el primer render). Notas es
 *    el unico campo opcional.
 * 
 * 3. El correo debe tener formato valido ademas de ser obligatorio.
 * 
 * 4. Los errores solo se calculan dentro de handleSubmit (al presionar
 *    Guardar proveedor), nunca mientras el usuario escribe.
 * 
 * 5. mensajeError expone el mensaje general que se muestra arriba
 *    del boton "Guardar proveedor". Puede venir de la validacion local
 *    o del backend (ej. nombre duplicado, telefono con formato
 *    invalido segun el backend).
 * 
 * 6. Al guardar correctamente, el proveedor se crea contra el backend
 *    (createProveedor), para que el listado (ProveedorScreen) lo vea
 *    reflejado al volver a esa pantalla.
 * 
 * 7. guardadoExitoso habilita la alerta de confirmacion tras un
 *    guardado correcto.
 * 
 * 8. La validacion de telefono/correo reutiliza el validador comun del
 *    modulo (utils/contactValidators), sin regex propio duplicado.
 *
 * 9. guardando expone si la peticion de creacion esta en curso, para
 *    poder deshabilitar el boton de Guardar desde la screen.
 */
import { useState } from "react";
import { validarTelefono, validarCorreo } from "../utils/contactValidators";
import { createProveedor } from "../services/proveedor.service";
import { ProveedorDTO } from "../dtos/proveedor.dto";

export const TELEFONO_MAX_LENGTH = 14;

const MENSAJE_CAMPOS_OBLIGATORIOS =
  "Revisa los campos obligatorios marcados con * antes de guardar.";

function obtenerMensajeError(nuevosErrores) {
  if (
    nuevosErrores.nombre ||
    nuevosErrores.tipoProducto ||
    nuevosErrores.telefono ||
    nuevosErrores.direccion ||
    nuevosErrores.correoObligatorio
  ) {
    return MENSAJE_CAMPOS_OBLIGATORIOS;
  }
  if (nuevosErrores.correo) return nuevosErrores.correo;
  return "";
}

export function useNuevoProveedorScreen() {
  const [nombre, setNombre] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [guardando, setGuardando] = useState(false);

  function handleTelefonoChange(valor) {
    setTelefono(valor.replace(/[^\d\s\-+]/g, ""));
  }

  function limpiarFormulario() {
    setNombre("");
    setTipoProducto("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
    setNotas("");
  }

  async function handleSubmit() {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre de la empresa es obligatorio.";
    }
    if (!tipoProducto) {
      nuevosErrores.tipoProducto = "Seleccione un tipo de producto.";
    }

    const errorTel = validarTelefono(telefono, {
      mensajeObligatorio: "El telefono es obligatorio.",
      mensajeInvalido: "Ingrese un telefono valido. Ej: +506 7689-9087",
    });
    if (errorTel) nuevosErrores.telefono = errorTel;

    const errorCorr = validarCorreo(correo, {
      mensajeObligatorio: "El correo electronico es obligatorio.",
      mensajeInvalido: "Ingrese un correo electronico valido.",
    });
    if (errorCorr) {
      nuevosErrores.correo = errorCorr;
      if (!correo.trim()) nuevosErrores.correoObligatorio = true;
    }

    if (!direccion.trim()) {
      nuevosErrores.direccion = "La direccion es obligatoria.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeError(obtenerMensajeError(nuevosErrores));
      setGuardadoExitoso(false);
      return;
    }

    setErrores({});
    setMensajeError("");
    setGuardando(true);

    const proveedorDTO = new ProveedorDTO({
      nombre,
      tipoProducto,
      telefono,
      correo,
      direccion,
      notas,
    });

    try {
      await createProveedor(proveedorDTO);

      setGuardadoExitoso(true);
      limpiarFormulario();
    } catch (error) {
      setGuardadoExitoso(false);

      const mensajeBackend = error.response?.data?.message;
      setMensajeError(
        mensajeBackend || "No fue posible guardar el proveedor.",
      );
    } finally {
      setGuardando(false);
    }
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
    guardando,
    handleTelefonoChange,
    handleSubmit,
  };
}