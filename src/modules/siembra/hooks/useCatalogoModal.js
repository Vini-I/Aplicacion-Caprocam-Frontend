/**
 * ============================================================
 * HOOK: MODAL DE CATÁLOGO (proveedor/laboratorio/procedencia)
 * ============================================================
 *
 * Toda la lógica del modal de "Agregar nuevo" / "Ver todos" que
 * usa DatosLarvaSection para gestionar los 3 catálogos de larva,
 * separada del componente (que solo dibuja).
 *
 * Recibe los 3 catálogos y los 9 handlers (onAgregarX/onEditarX/
 * onEliminarX) que ya le llegan a DatosLarvaSection por props, y
 * devuelve el estado del modal + las funciones para manejarlo.
 *
 * CONTRATO IMPORTANTE:
 * abrirEditar(item) no recibe ni establece "campoActivo" - asume
 * que ya se llamó antes a abrirLista(campo) para ese mismo
 * catálogo (el flujo normal es: abrir lista -> elegir "editar" de
 * un ítem dentro de ella). Llamar abrirEditar sin haber abierto
 * antes la lista deja campoActivo en null y guardarFormulario
 * falla silenciosamente.
 */
import { useState } from "react";

export function useCatalogoModal({
  proveedoresLarva,
  laboratoriosLarva,
  procedenciasLarva,
  onAgregarProveedor,
  onAgregarLaboratorio,
  onAgregarProcedencia,
  onEditarProveedor,
  onEditarLaboratorio,
  onEditarProcedencia,
  onEliminarProveedor,
  onEliminarLaboratorio,
  onEliminarProcedencia,
}) {
  const [campoActivo, setCampoActivo] = useState(null);
  const [vistaModal, setVistaModal] = useState(null);

  const [itemEnEdicionValue, setItemEnEdicionValue] = useState(null);
  const [nombreForm, setNombreForm] = useState("");
  const [nombreConError, setNombreConError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");
  const [guardando, setGuardando] = useState(false);

  const [itemAEliminar, setItemAEliminar] = useState(null);

  const opcionesPorCampo = {
    proveedorLarva: proveedoresLarva,
    laboratorioLarva: laboratoriosLarva,
    procedenciaLarva: procedenciasLarva,
  };

  const handlersAgregar = {
    proveedorLarva: onAgregarProveedor,
    laboratorioLarva: onAgregarLaboratorio,
    procedenciaLarva: onAgregarProcedencia,
  };

  const handlersEditar = {
    proveedorLarva: onEditarProveedor,
    laboratorioLarva: onEditarLaboratorio,
    procedenciaLarva: onEditarProcedencia,
  };

  const handlersEliminar = {
    proveedorLarva: onEliminarProveedor,
    laboratorioLarva: onEliminarLaboratorio,
    procedenciaLarva: onEliminarProcedencia,
  };

  function cerrarTodo() {
    setCampoActivo(null);
    setVistaModal(null);
    setItemEnEdicionValue(null);
    setNombreForm("");
    setNombreConError(false);
    setMensaje("");
    setItemAEliminar(null);
  }

  function abrirAgregar(campo) {
    setCampoActivo(campo);
    setItemEnEdicionValue(null);
    setNombreForm("");
    setNombreConError(false);
    setMensaje("");
    setVistaModal("formulario");
  }

  function abrirLista(campo) {
    setCampoActivo(campo);
    setVistaModal("lista");
  }

  function abrirEditar(item) {
    setItemEnEdicionValue(item.value);
    setNombreForm(item.label);
    setNombreConError(false);
    setMensaje("");
    setVistaModal("formulario");
  }

  function volverALista() {
    setItemEnEdicionValue(null);
    setNombreForm("");
    setNombreConError(false);
    setMensaje("");
    setItemAEliminar(null);
    setVistaModal("lista");
  }

  async function guardarFormulario() {
    if (!nombreForm.trim()) {
      setNombreConError(true);
      setMensaje("Debes completar los campos obligatorios.");
      setMensajeVariant("danger");
      return;
    }

    setNombreConError(false);

    if (itemEnEdicionValue) {
      const itemOriginal = (opcionesPorCampo[campoActivo] || []).find(
        (item) => item.value === itemEnEdicionValue,
      );

      if (itemOriginal && itemOriginal.label === nombreForm.trim()) {
        setMensaje("No hay cambios para guardar.");
        setMensajeVariant("danger");
        return;
      }
    }

    setGuardando(true);
    try {
      if (itemEnEdicionValue) {
        const handler = handlersEditar[campoActivo];
        if (handler) await handler(itemEnEdicionValue, nombreForm);
      } else {
        const handler = handlersAgregar[campoActivo];
        if (handler) await handler(nombreForm);
      }

      setItemEnEdicionValue(null);
      setNombreForm("");
      setVistaModal("lista");
      setMensaje("Registrado correctamente.");
      setMensajeVariant("success");
    } catch (err) {
      const mensajeBackend = err.response?.data?.message;
      setMensaje(mensajeBackend || "No fue posible guardar el registro.");
      setMensajeVariant("danger");
    } finally {
      setGuardando(false);
    }
  }

  function pedirConfirmacionEliminar(item) {
    setItemAEliminar(item);
    setVistaModal("eliminar");
  }

  async function confirmarEliminar() {
    const handler = handlersEliminar[campoActivo];
    if (!handler || !itemAEliminar) {
      volverALista();
      return;
    }

    setGuardando(true);
    try {
      await handler(itemAEliminar.value);
      volverALista();
    } catch (err) {
      const mensajeBackend = err.response?.data?.message;
      setMensaje(mensajeBackend || "No fue posible eliminar el registro.");
      setMensajeVariant("danger");
      setVistaModal("lista");
    } finally {
      setGuardando(false);
    }
  }

  return {
    campoActivo,
    vistaModal,
    itemEnEdicionValue,
    nombreForm,
    setNombreForm,
    nombreConError,
    mensaje,
    mensajeVariant,
    itemAEliminar,
    guardando,

    opcionesPorCampo,
    handlersAgregar,

    cerrarTodo,
    abrirAgregar,
    abrirLista,
    abrirEditar,
    volverALista,
    guardarFormulario,
    pedirConfirmacionEliminar,
    confirmarEliminar,
  };
}
