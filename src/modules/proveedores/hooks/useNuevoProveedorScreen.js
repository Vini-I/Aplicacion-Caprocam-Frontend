/**
 * useNuevoProveedorScreen.js
 * Hook para la lógica de la pantalla de creación de proveedores.
 *
 * FUNCIONALIDAD:
 * - Maneja el estado del formulario de creación.
 * - Solo muestra errores al presionar Guardar, nunca mientras se escribe.
 *
 * REGLAS IMPORTANTES:
 * - Teléfono debe ser estrictamente de 8 dígitos.
 * - Reutiliza validadores de utils/contactValidators.js.
 *
 * @dependencies - React, ProveedorContext, contactValidators, ProveedorDTO
 * @validations - Teléfono de 8 dígitos, Correo válido, Campos requeridos
 * @navigation - N/A
 */
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { validarTelefono, validarCorreo } from "../utils/contactValidators";
import { useProveedor } from "../context/ProveedorContext";
import { ProveedorDTO } from "../dtos/proveedor.dto";

export const telefonoMaxLength = 8;

const mensajeCamposObligatorios =
  "Revisa los campos obligatorios marcados con * antes de guardar.";

function obtenerMensajeError(nuevosErrores) {
  if (nuevosErrores.telefonoInvalido) return nuevosErrores.telefono;
  if (nuevosErrores.correoInvalido) return nuevosErrores.correo;

  if (Object.keys(nuevosErrores).length > 0) {
    return mensajeCamposObligatorios;
  }
  return "";
}

export function useNuevoProveedorScreen() {
  const router = useRouter();
  const { crearProveedor } = useProveedor();
  const scrollViewRef = useRef(null);
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
  const errorTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (mensajeError !== "") {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensajeError]);

  useEffect(() => {
    if (guardadoExitoso) {
      router.replace("/(drawer)/proveedores");
    }
  }, [guardadoExitoso, router]);

  function handleTelefonoChange(valor) {
    setTelefono(valor.replace(/[^0-9]/g, ""));
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
      mensajeObligatorio: "El teléfono es obligatorio.",
      mensajeInvalido: "Ingrese un teléfono válido de 8 dígitos. Ej: 12345678",
    });
    if (errorTel) {
      nuevosErrores.telefono = errorTel;
      if (telefono.trim() !== "") nuevosErrores.telefonoInvalido = true;
    }

    const errorCorr = validarCorreo(correo, {
      mensajeObligatorio: "El correo electronico es obligatorio.",
      mensajeInvalido: "Ingrese un correo electronico valido.",
    });
    if (errorCorr) {
      nuevosErrores.correo = errorCorr;
      if (correo.trim() !== "") nuevosErrores.correoInvalido = true;
    }

    if (!direccion.trim()) {
      nuevosErrores.direccion = "La direccion es obligatoria.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeError(obtenerMensajeError(nuevosErrores));
      setGuardadoExitoso(false);
      
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        setErrores({});
        setMensajeError("");
      }, 6000);
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
      await crearProveedor(proveedorDTO);

      setGuardadoExitoso(true);
      limpiarFormulario();
    } catch (error) {
      setGuardadoExitoso(false);
      setMensajeError(error.message || "No fue posible guardar el proveedor.");
      
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        setErrores({});
        setMensajeError("");
      }, 6000);
    } finally {
      setGuardando(false);
    }
  }

  return {
    scrollViewRef,
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