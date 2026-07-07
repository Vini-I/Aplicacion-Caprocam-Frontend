/**
 * Hook: useTrazabilidad
 *
 * Concentra todo el estado del formulario de Trazabilidad, sus
 * validaciones y el handler de envio. La pantalla solo consume
 * este hook y no contiene logica propia.
 *
 * Validaciones aplicadas (segun especificacion del modulo):
 * - Finca, ambos estanques, fecha y colaborador son obligatorios.
 * - El estanque de origen no puede ser igual al de destino.
 * - Tamaño debe ser un numero mayor a 0.
 * - PL debe ser un numero mayor a 0.
 * - Dias debe ser un numero mayor a 0.
 * - La fecha no puede ser futura.
 */

import { useState } from "react";
import { useRouter } from "expo-router";

import { initialForm } from "../screens/TrazabilidadData";
import {
  obtenerEstanquesPorFinca,
  obtenerFincas,
  obtenerColaboradores,
  obtenerSiembraPorEstanque,
} from "../services/TrazabilidadServices";
import { crearRegistroTrazabilidad } from "../services/AgregarTrazabilidadService";

function fechaDesdeTexto(fechaTexto) {
  const partes = fechaTexto.split("/");

  if (partes.length !== 3) {
    return null;
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const anio = Number(partes[2]);

  return new Date(anio, mes, dia);
}

function esFechaFutura(fechaTexto) {
  const fecha = fechaDesdeTexto(fechaTexto);

  if (!fecha) {
    return false;
  }

  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);

  return fecha.getTime() > hoy.getTime();
}

export function useTrazabilidad() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialForm);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [plAutocompletado, setPlAutocompletado] = useState(false);

  const fincas = obtenerFincas();
  const colaboradores = obtenerColaboradores();
  const estanquesOrigen = obtenerEstanquesPorFinca(formData.fincaId);
  const estanquesDestino = obtenerEstanquesPorFinca(formData.fincaId);

  function manejarCambio(field, value) {
    if (field === "estanqueOrigenId") {
      const siembra = obtenerSiembraPorEstanque(value);

      setFormData((previousData) => ({
        ...previousData,
        [field]: value,
        pl: siembra ? String(siembra.cantidadSembrada ?? "") : "",
      }));

      setPlAutocompletado(Boolean(siembra));
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  }

  function manejarCambioFinca(value) {
    setFormData((previousData) => ({
      ...previousData,
      fincaId: value,
      estanqueOrigenId: "",
      estanqueDestinoId: "",
      pl: "",
    }));

    setPlAutocompletado(false);
  }

  function obtenerCamposVacios() {
    const camposObligatorios = [
      "fincaId",
      "estanqueOrigenId",
      "estanqueDestinoId",
      "fecha",
      "colaboradorId",
      "tamaño",
      "dias",
      "pl",
    ];

    return camposObligatorios.filter(
      (campo) => String(formData[campo] ?? "").trim() === "",
    );
  }

  function validarFormulario() {
    if (obtenerCamposVacios().length > 0) {
      setMensajeError("Debe completar todos los campos para registrar el movimiento.");
      return false;
    }

    if (formData.estanqueOrigenId === formData.estanqueDestinoId) {
      setMensajeError("El estanque de origen no puede ser igual al estanque de destino.");
      return false;
    }

    if (Number(formData.tamaño) <= 0) {
      setMensajeError("El tamaño debe ser un número mayor a 0.");
      return false;
    }

    if (Number(formData.pl) <= 0) {
      setMensajeError("El campo PL debe ser un número mayor a 0.");
      return false;
    }

    if (Number(formData.dias) <= 0) {
      setMensajeError("Los días deben ser un número mayor a 0.");
      return false;
    }

    if (esFechaFutura(formData.fecha)) {
      setMensajeError("La fecha no puede ser futura.");
      return false;
    }

    return true;
  }

  function manejarEnvio() {
    const esValido = validarFormulario();

    if (!esValido) {
      setModalVisible(true);
      return;
    }

    crearRegistroTrazabilidad(formData);
    setFormData(initialForm);
    router.back();
  }

  function cerrarModal() {
    setModalVisible(false);
  }

  function cerrarFormulario() {
    router.back();
  }

  return {
    formData,
    fincas,
    colaboradores,
    estanquesOrigen,
    estanquesDestino,
    plAutocompletado,
    modalVisible,
    mensajeError,
    manejarCambio,
    manejarCambioFinca,
    manejarEnvio,
    cerrarModal,
    cerrarFormulario,
  };
}
