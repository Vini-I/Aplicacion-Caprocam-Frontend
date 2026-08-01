/**
 * ============================================================
 * HOOK EDITAR PROVEEDOR
 * ============================================================
 *
 * Logica de la pantalla de edicion de un proveedor existente.
 *
 * FUNCIONALIDAD:
 * 1. Carga el proveedor desde el backend (getProveedorById) y expone
 *    su estado editable: tipoProducto, telefono, correo, direccion,
 *    notas (nombre es de solo lectura, no se valida ni se marca en
 *    rojo).
 * 
 * 2. Tipo de producto, telefono, correo y direccion son obligatorios
 *    (asterisco visible desde el primer render).
 * 
 * 3. La validacion se ejecuta unicamente dentro de guardar() (al
 *    presionar Guardar proveedor); handleTelefonoChange y
 *    handleCorreoChange (y el resto de los setters) solo actualizan el
 *    valor, nunca disparan el error mientras el usuario escribe. Como
 *    los datos llegan precargados y validos, no hay errores ni bordes
 *    rojos al abrir el formulario.
 * 
 * 4. alerta expone el mensaje general (variant + message) que la
 *    screen muestra arriba del boton Guardar proveedor.
 * 
 * 6. El usuario puede modificar uno, varios o todos los campos; no es
 *    obligatorio tocarlos todos. Al presionar guardar():
 *    - Si ningun campo cambio respecto al proveedor original, no se
 *      guarda y se muestra unicamente la alerta
 *      "No hay cambios para guardar."
 * 
 *    - Si hay cambios pero algun campo obligatorio quedo vacio o
 *      invalido, no se guarda: se marcan en rojo solo esos campos y se
 *      muestra unicamente la alerta "Revisa los campos obligatorios
 *      marcados con * antes de guardar."
 * 
 *    - Si hay cambios y todos los campos obligatorios son validos, se
 *      guarda contra el backend (updateProveedor) y se muestra la
 *      alerta de exito.
 *
 * 7. cargando expone si el proveedor original aun se esta trayendo del
 *    backend.
 *
 * IMPORTANTE:
 * - No navega; expone alerta para que la screen decida donde mostrarla.
 */
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { getProveedorById, updateProveedor } from "../services/proveedor.service";
import { validarTelefono, validarCorreo } from "../utils/contactValidators";
import { ProveedorDTO } from "../dtos/proveedor.dto";

export const TELEFONO_MAX_LENGTH = 14;

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

  const cargarProveedor = useCallback(async () => {
    try {
      setCargando(true);

      const data = await getProveedorById(id);

      setBase(data);
      setNombreState(data.nombre);
      setTipoProducto(data.tipoProducto);
      setTelefono(data.telefono);
      setCorreo(data.correo);
      setDireccion(data.direccion);
      setNotas(data.notas || "");
    } catch (err) {
      setAlerta({
        variant: "danger",
        message: "No fue posible cargar el proveedor.",
      });
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarProveedor();
  }, [cargarProveedor]);

  function handleTelefonoChange(valor) {
    setTelefono(valor);
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
      return;
    }

    const nuevosErrores = {};

    const errorTipo = validarTipoProducto(tipoProducto);
    if (errorTipo) nuevosErrores.tipoProducto = errorTipo;

    const errorTel = validarTelefono(telefono, {
      mensajeObligatorio: "El teléfono es obligatorio.",
      mensajeInvalido: "Ingrese un teléfono válido. Ej: +506 2222-3344",
    });
    if (errorTel) nuevosErrores.telefono = errorTel;

    const errorCorr = validarCorreo(correo, {
      mensajeObligatorio: "El correo es obligatorio.",
      mensajeInvalido: "Ingrese un correo válido. Ej: ventas@empresa.com",
    });
    if (errorCorr) nuevosErrores.correo = errorCorr;

    const errorDir = validarDireccion(direccion);
    if (errorDir) nuevosErrores.direccion = errorDir;

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setAlerta({
        variant: "danger",
        message: "Revisa los campos obligatorios marcados con * antes de guardar.",
      });
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

      const actualizado = await updateProveedor(base.id, proveedorDTO);

      setBase(actualizado);
      setAlerta({
        variant: "success",
        message: "Proveedor actualizado correctamente.",
      });
    } catch (error) {
      const mensajeBackend = error.response?.data?.message;
      setAlerta({
        variant: "danger",
        message: mensajeBackend || "No fue posible actualizar el proveedor.",
      });
    } finally {
      setGuardando(false);
    }
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
    errores,
    alerta,
    cargando,
    guardando,
    handleTelefonoChange,
    handleCorreoChange,
    guardar,
  };
}