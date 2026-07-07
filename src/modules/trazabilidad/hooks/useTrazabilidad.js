/**
 * ============================================================
 * HOOK useTrazabilidad
 * ============================================================
 *
 * Descripción:
 * Centraliza el estado, validaciones y envío del formulario de
 * trazabilidad. La pantalla consumidora debe delegar la lógica a
 * este hook y mantener la presentación separada.
 *
 * Validaciones principales:
 * - Campos obligatorios: finca, estanques (origen/destino), fecha, colaborador, tamaño, dias, pl.
 * - Origen y destino no pueden coincidir.
 * - Valores numéricos deben ser mayores que 0.
 * - La fecha no puede ser futura.
 *
 * Retorna:
 * - `formData`, `fincas`, `colaboradores`, `estanquesOrigen`, `estanquesDestino`,
 *   `plAutocompletado`, `mensajeError`, `submitted` y handlers como `manejarCambio`,
 *   `manejarCambioFinca`, `manejarEnvio`, `cerrarFormulario`.
 *
 * Restricciones:
 * - No realizar llamadas a la API directamente; usar los servicios del módulo.
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
  const [mensajeError, setMensajeError] = useState("");
  const [plAutocompletado, setPlAutocompletado] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setMensajeError("");
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
    setMensajeError("");
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
    setMensajeError("");
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
    setSubmitted(true);

    const esValido = validarFormulario();

    if (!esValido) {
      return;
    }

    crearRegistroTrazabilidad(formData);
    setFormData(initialForm);
    setSubmitted(false);
    setMensajeError("");
    router.back();
  }

  function cerrarFormulario() {
    router.back();
  }

  function esFormularioCompleto() {
    return obtenerCamposVacios().length === 0;
  }

  return {
    formData,
    fincas,
    colaboradores,
    estanquesOrigen,
    estanquesDestino,
    plAutocompletado,
    mensajeError,
    submitted,
    manejarCambio,
    manejarCambioFinca,
    manejarEnvio,
    cerrarFormulario,
    formularioCompleto: esFormularioCompleto(),
  };
}
