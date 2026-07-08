/**
 * ============================================================
 * HOOK DE DETALLE DE SIEMBRA
 * ============================================================
 *
 * Centraliza la lógica de consulta y edición de una siembra existente.
 *
 * FUNCIONALIDAD:
 * - Carga la información de la siembra seleccionada.
 * - Administra modo consulta y edición.
 * - Maneja cambios de campos.
 * - Calcula progreso y etapa del cultivo.
 * - Valida y guarda modificaciones.
 *
 * La pantalla utiliza este hook para controlar el formulario
 * de detalle sin manejar lógica de negocio.
 */

import { useCallback, useEffect, useState } from "react";

import {
  useSiembraFieldValidation,
  validarCamposObligatorios,
} from "./useSiembraFieldValidation";

import { calcularCantidadSembrada } from "./siembraCalculos";

import {
  obtenerSiembraPorId,
  obtenerEstanquePorCodigo,
  obtenerEstanquesPorFinca,
} from "../services/SiembraService";

const CAMPOS_BASE_OBLIGATORIOS = [
  "fechaSiembra",
  "horaIngreso",
  "finca",
  "estanque",
  "tecnicaCultivo",
  "diasMaduracion",
  "proveedorLarva",
  "laboratorioLarva",
  "procedenciaLarva",
  "codigoLoteLarva",
  "plLarva",
  "certificadoLarva",
  "areaHectareas",
  "densidadPoblacional",
  "cantidadSembrada",
];

function calcularEtapa(diaActual) {
  if (diaActual > 60) return 3;
  if (diaActual > 30) return 2;

  return 1;
}

export default function useDetalleSiembra(id) {
  const [siembra, setSiembra] = useState(null);
  const [formData, setFormData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");

  const {
    submitted,
    setSubmitted,
    errors,
    setErrors,
    hasError,
    requiredLabel,
  } = useSiembraFieldValidation();

  useEffect(() => {
    const siembraEncontrada = obtenerSiembraPorId(id);

    setSiembra(siembraEncontrada);
    setFormData(siembraEncontrada ?? null);
  }, [id]);

  /**
   * ==========================================
   * Cambios genéricos
   * ==========================================
   */

  const handleChange = useCallback((field, value) => {
    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        [field]: value,
      };

      if (
        field === "areaHectareas" ||
        field === "densidadPoblacional"
      ) {
        updatedData.cantidadSembrada = calcularCantidadSembrada(
          updatedData.areaHectareas,
          updatedData.densidadPoblacional,
        );
      }

      return updatedData;
    });
  }, []);

  /**
   * ==========================================
   * Cambio de finca
   * ==========================================
   */

  const handleChangeFinca = useCallback((value) => {
    setFormData((previousData) => ({
      ...previousData,

      finca: value,

      estanque: "",

      areaHectareas: "",

      cantidadSembrada: "",
    }));
  }, []);

  /**
   * ==========================================
   * Cambio de estanque
   * ==========================================
   */

  const handleChangeEstanque = useCallback(
    (value) => {
      const estanque = obtenerEstanquePorCodigo(
        formData.finca,
        value,
      );

      const area = estanque?.areaHectareas ?? "";

      setFormData((previousData) => ({
        ...previousData,

        estanque: value,

        areaHectareas: area,

        cantidadSembrada: calcularCantidadSembrada(
          area,
          previousData.densidadPoblacional,
        ),
      }));
    },
    [formData],
  );

  /**
   * ==========================================
   * Estanques disponibles
   * ==========================================
   */

  const estanques = formData
    ? obtenerEstanquesPorFinca(formData.finca)
    : [];

  /**
   * ==========================================
   * Campos obligatorios
   * ==========================================
   */

  const obtenerCamposObligatorios = useCallback(() => {
    if (!formData) {
      return CAMPOS_BASE_OBLIGATORIOS;
    }

    const campos = [...CAMPOS_BASE_OBLIGATORIOS];

    if (formData.pasoPorPrecria === "si") {
      campos.push(
        "duracionPrecria",
        "fechaSalidaPrecria",
      );
    }

    return campos;
  }, [formData]);

  /**
   * ==========================================
   * Acciones
   * ==========================================
   */

  const iniciarEdicion = useCallback(() => {
    setIsEditing(true);
    setMensaje("");
  }, []);

  const cancelarEdicion = useCallback(() => {
    setFormData(siembra);

    setSubmitted(false);

    setErrors({});

    setIsEditing(false);

    setMensaje("");
  }, [siembra, setSubmitted, setErrors]);

  const guardar = useCallback(() => {
    setSubmitted(true);

    const nuevosErrores = validarCamposObligatorios(
      formData,
      obtenerCamposObligatorios(),
    );

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje("Debe completar todos los campos obligatorios.");
      setMensajeVariant("error");
      return;
    }

    console.log("Siembra actualizada:", formData);

    setSiembra(formData);

    setIsEditing(false);

    setMensaje("Siembra actualizada correctamente.");

    setMensajeVariant("success");
  }, [
    formData,
    obtenerCamposObligatorios,
    setSubmitted,
    setErrors,
  ]);

  const totalDias = formData
  ? Number(formData.diasMaduracion) || 0
  : 0;

const diaActual = formData
  ? Number(formData.diasCultivo) || 0
  : 0;

  const etapa = calcularEtapa(diaActual);

 const progreso =
  totalDias > 0
    ? Math.round((diaActual / totalDias) * 100)
    : 0;

  return {
    siembra,

    formData,

    estanques,

    isEditing,

    mensaje,

    mensajeVariant,

    diaActual,

    totalDias,

    etapa,

    progreso,

    handleChange,

    handleChangeFinca,

    handleChangeEstanque,

    iniciarEdicion,

    cancelarEdicion,

    guardar,

    fieldHelpers: {
      hasError,
      requiredLabel,
    },
  };
}