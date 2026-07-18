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
  // Campo sobre el que se está trabajando ("proveedorLarva",
  // "laboratorioLarva" o "procedenciaLarva"), o null si todo está cerrado.
  const [campoActivo, setCampoActivo] = useState(null);
  // "lista" | "formulario" | "eliminar" | null (null = modal cerrado)
  const [vistaModal, setVistaModal] = useState(null);

  const [itemEnEdicionValue, setItemEnEdicionValue] = useState(null);
  const [nombreForm, setNombreForm] = useState("");
  const [errorForm, setErrorForm] = useState("");

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
    setErrorForm("");
    setItemAEliminar(null);
  }

  function abrirAgregar(campo) {
    setCampoActivo(campo);
    setItemEnEdicionValue(null);
    setNombreForm("");
    setErrorForm("");
    setVistaModal("formulario");
  }

  function abrirLista(campo) {
    setCampoActivo(campo);
    setVistaModal("lista");
  }

  function abrirEditar(item) {
    setItemEnEdicionValue(item.value);
    setNombreForm(item.label);
    setErrorForm("");
    setVistaModal("formulario");
  }

  function volverALista() {
    setItemEnEdicionValue(null);
    setNombreForm("");
    setErrorForm("");
    setItemAEliminar(null);
    setVistaModal("lista");
  }

  function guardarFormulario() {
    if (!nombreForm.trim()) {
      setErrorForm("Ingresa un nombre.");
      return;
    }

    if (itemEnEdicionValue) {
      const handler = handlersEditar[campoActivo];
      if (handler) {
        handler(itemEnEdicionValue, nombreForm);
      }
      volverALista();
    } else {
      const handler = handlersAgregar[campoActivo];
      if (handler) {
        handler(nombreForm);
      }
      cerrarTodo();
    }
  }

  function pedirConfirmacionEliminar(item) {
    setItemAEliminar(item);
    setVistaModal("eliminar");
  }

  function confirmarEliminar() {
    const handler = handlersEliminar[campoActivo];
    if (handler && itemAEliminar) {
      handler(itemAEliminar.value);
    }
    volverALista();
  }

  return {
    campoActivo,
    vistaModal,
    itemEnEdicionValue,
    nombreForm,
    setNombreForm,
    errorForm,
    itemAEliminar,

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
