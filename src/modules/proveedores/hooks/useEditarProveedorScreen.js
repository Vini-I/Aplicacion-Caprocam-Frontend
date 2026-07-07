/**
 * ============================================================
 * HOOK EDITAR PROVEEDOR
 * ============================================================
 *
 * Logica de la pantalla de edicion de un proveedor existente.
 *
 * FUNCIONALIDAD:
 * 1. Carga un proveedor base (mock) y expone su estado editable:
 *    tipoProducto, telefono, correo, direccion, notas (nombre es de
 *    solo lectura, no se valida ni se marca en rojo).
 * 2. Tipo de producto, telefono, correo y direccion son obligatorios
 *    (asterisco visible desde el primer render). Telefono y correo
 *    ademas deben cumplir el validador comun del modulo
 *    (utils/contactValidators). Notas es el unico campo opcional.
 * 3. La validacion se ejecuta unicamente dentro de guardar() (al
 *    presionar "Guardar proveedor"); handleTelefonoChange y
 *    handleCorreoChange (y el resto de los setters) solo actualizan el
 *    valor, nunca disparan el error mientras el usuario escribe. Como
 *    los datos llegan precargados y validos, no hay errores ni bordes
 *    rojos al abrir el formulario.
 * 4. `errores` expone un mensaje de texto por campo (tipoProducto,
 *    telefono, correo, direccion) igual que en useNuevoProveedorScreen;
 *    la screen solo usa ese valor para pintar el borde en rojo, no
 *    muestra el texto debajo del campo.
 * 5. `alerta` expone el mensaje general (variant + message) que la
 *    screen muestra arriba del boton "Guardar proveedor".
 * 6. El usuario puede modificar uno, varios o todos los campos; no es
 *    obligatorio tocarlos todos. Al presionar guardar():
 *    - Si ningun campo cambio respecto al proveedor original, no se
 *      guarda y se muestra unicamente la alerta
 *      "No hay cambios para guardar."
 *    - Si hay cambios pero algun campo obligatorio quedo vacio o
 *      invalido, no se guarda: se marcan en rojo solo esos campos y se
 *      muestra unicamente la alerta "Revisa los campos obligatorios
 *      marcados con * antes de guardar."
 *    - Si hay cambios y todos los campos obligatorios son validos, se
 *      guarda y se muestra la alerta de exito.
 *
 * IMPORTANTE:
 * - No navega; expone `alerta` para que la screen decida donde
 *   mostrarla.
 */
import { useState } from "react";
import { proveedoresMock } from "../services/ProveedorData";
import { validarTelefono, validarCorreo } from "../utils/contactValidators";

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
  const base = proveedoresMock[0];

  const [nombre] = useState(base.nombre);
  const [tipoProducto, setTipoProducto] = useState(base.tipoProducto);
  const [telefono, setTelefono] = useState(base.telefono);
  const [correo, setCorreo] = useState(base.correo);
  const [direccion, setDireccion] = useState(base.direccion);
  const [notas, setNotas] = useState(base.notas);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);

  function handleTelefonoChange(valor) {
    setTelefono(valor);
  }

  function handleCorreoChange(valor) {
    setCorreo(valor);
  }

  function huboCambios() {
    return (
      tipoProducto !== base.tipoProducto ||
      telefono !== base.telefono ||
      correo !== base.correo ||
      direccion !== base.direccion ||
      notas !== base.notas
    );
  }

  function guardar() {
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
    errores,
    alerta,
    handleTelefonoChange,
    handleCorreoChange,
    guardar,
  };
}
