/**
 * useEditarProveedorScreen.js
 * Hook para la lógica de la pantalla de edición de proveedores.
 *
 * FUNCIONALIDAD:
 * - Carga el proveedor existente mediante su ID.
 * - Maneja el estado de edición permitiendo modificar campos excepto el nombre.
 *
 * REGLAS IMPORTANTES:
 * - Los errores solo se muestran al intentar guardar.
 * - Si no hay cambios, previene la petición al backend.
 * - No maneja routing: expone guardadoExitoso y es el screen quien
 *   decide navegar al verlo en true (useRouter vive solo en screens).
 *
 * @dependencies - React, expo-router, ProveedorContext, contactValidators, ProveedorDTO
 * @validations - Teléfono de 8 dígitos, Correo válido, Campos requeridos
 * @navigation - N/A (delegado al screen vía guardadoExitoso)
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { useProveedor } from "../context/ProveedorContext";
import { validarTelefono, validarCorreo } from "../utils/contactValidators";
import { ProveedorDTO } from "../dtos/proveedor.dto";

export const telefonoMaxLength = 8;

function validarDireccion(valor) {
  if (!valor || !valor.trim()) return "La dirección es obligatoria.";
  return "";
}

function validarTipoProducto(valor) {
  if (!valor || !valor.trim()) return "El tipo de producto es obligatorio.";
  return "";
}

export function useEditarProveedorScreen() {
  const { id } = useLocalSearchParams();
  const { buscarProveedor, editarProveedor } = useProveedor();

  const scrollViewRef = useRef(null);
  const [base, setBase] = useState(null);
  const [nombre, setNombreState] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const errorTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, []);

  const cargarProveedor = useCallback(async () => {
    try {
      setCargando(true);

      const data = await buscarProveedor(id);

      setBase(data);
      setNombreState(data.nombre);
      setTipoProducto(data.tipoProducto);
      setTelefono(data.telefono);
      setCorreo(data.correo);
      setDireccion(data.direccion);
      setNotas(data.notas || "");
    } catch (err) {
      setBase(null);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarProveedor();
  }, [cargarProveedor]);

  useEffect(() => {
    if (alerta?.variant === "danger") {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [alerta]);

  function handleTelefonoChange(valor) {
    setTelefono(valor.replace(/[^0-9]/g, ""));
  }

  function handleCorreoChange(valor) {
    setCorreo(valor);
  }

  function huboCambios() {
    if (!base) return false;
    return (
      tipoProducto !== base.tipoProducto ||
      telefono !== base.telefono ||
      correo !== base.correo ||
      direccion !== base.direccion ||
      notas !== (base.notas || "")
    );
  }

  async function guardar() {
    if (!base) return;

    if (!huboCambios()) {
      setErrores({});
      setAlerta({
        variant: "danger",
        message: "No hay cambios para guardar.",
      });
      
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        setErrores({});
        setAlerta(null);
      }, 6000);
      return;
    }

    const nuevosErrores = {};

    const errorTipo = validarTipoProducto(tipoProducto);
    if (errorTipo) nuevosErrores.tipoProducto = errorTipo;

    const errorTel = validarTelefono(telefono, {
      mensajeObligatorio: "El teléfono es obligatorio.",
      mensajeInvalido: "Ingrese un teléfono válido de 8 dígitos. Ej: 12345678",
    });
    if (errorTel) {
      nuevosErrores.telefono = errorTel;
      if (telefono.trim() !== "") nuevosErrores.telefonoInvalido = true;
    }

    const errorCorr = validarCorreo(correo, {
      mensajeObligatorio: "El correo es obligatorio.",
      mensajeInvalido: "Ingrese un correo válido. Ej: ventas@empresa.com",
    });
    if (errorCorr) {
      nuevosErrores.correo = errorCorr;
      if (correo.trim() !== "") nuevosErrores.correoInvalido = true;
    }

    const errorDir = validarDireccion(direccion);
    if (errorDir) nuevosErrores.direccion = errorDir;

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      let mensajeAlerta = "Revisa los campos obligatorios marcados con * antes de guardar.";
      if (nuevosErrores.telefonoInvalido) mensajeAlerta = nuevosErrores.telefono;
      else if (nuevosErrores.correoInvalido) mensajeAlerta = nuevosErrores.correo;

      setAlerta({
        variant: "danger",
        message: mensajeAlerta,
      });
      
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        setErrores({});
        setAlerta(null);
      }, 6000);
      return;
    }

    setGuardando(true);

    try {
      const proveedorDTO = new ProveedorDTO({
        nombre,
        tipoProducto,
        telefono,
        correo,
        direccion,
        notas,
      });

      await editarProveedor(base.id, proveedorDTO);
      const actualizado = await buscarProveedor(base.id);

      setBase(actualizado);
      setGuardadoExitoso(true);
    } catch (error) {
      const mensajeBackend = error.message;
      setAlerta({
        variant: "danger",
        message: mensajeBackend || "No fue posible actualizar el proveedor.",
      });
      
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        setErrores({});
        setAlerta(null);
      }, 6000);
    } finally {
      setGuardando(false);
    }
  }

  return {
    scrollViewRef,
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
    errores,
    alerta,
    cargando,
    guardando,
    guardadoExitoso,
    handleTelefonoChange,
    handleCorreoChange,
    guardar,
  };
}