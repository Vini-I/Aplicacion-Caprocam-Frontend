/**
 * ============================================================
 * HOOK DE NUEVA SIEMBRA
 * ============================================================
 *
 * Centraliza el estado y la lógica del formulario para
 * registrar una nueva siembra.
 *
 * FUNCIONALIDAD:
 * - Administra los datos del formulario.
 * - Maneja cambios de finca y estanque.
 * - Obtiene estanques disponibles.
 * - Calcula automáticamente la cantidad sembrada.
 * - Valida campos obligatorios antes de guardar.
 * - Expone "mensaje"/"mensajeVariant" para el Alert global del estándar
 *   (ya no se usa un Modal): la screen lo muestra centrado y arriba del
 *   botón de guardar. Usa "danger" (no "error") como variant porque es
 *   el nombre que reconoce shared/components/Alert.jsx.
 *
 * La pantalla únicamente consume este hook para renderizar
 * la interfaz y ejecutar acciones.
 */

import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import {
  useFieldValidation,
  validarCamposObligatorios,
} from "./useFieldValidation";

import { obtenerCamposObligatorios as obtenerCamposObligatoriosPorTipo } from "./siembraValidationRules";

import { calcularCantidadSembrada } from "./siembraCalculos";

import { obtenerFechaHoy } from "./dateUtils";

import {
  obtenerEstanquePorCodigo,
  obtenerEstanquesPorFinca,
  crearRegistro,
} from "../services/SiembraService";

const initialFormData = {
  tipoRegistro: "siembra",
  pasoPorPrecria: "no",
  precriaId: "",

  finca: "",
  estanque: "",
  codigoLoteLarva: "",
  estado: "Activa",

  fechaSiembra: "",
  horaIngreso: "",
  tecnicaCultivo: "",
  densidadPoblacional: "8",
  cantidadSembrada: "",
  plSiembra: "",
  diasMaduracion: "90",
  areaHectareas: "",

  fechaInicio: "",
  fechaFin: "",
  duracionDias: "15",
  cantidadInicial: "",
  cantidadFinal: "",
  plInicial: "",
  plFinal: "",

  proveedorLarva: "",
  laboratorioLarva: "",
  procedenciaLarva: "",
  certificadoLarva: "",

  duracionPrecria: "",
  fechaSalidaPrecria: "",
  cantidadSobrevivientePrecria: "",
};

export default function useNuevaSiembra() {
  const router = useRouter();

  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");

  const [formData, setFormData] = useState(initialFormData);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (!params.provieneDePrecriaId) {
      return;
    }

    const estanqueInfo = obtenerEstanquePorCodigo(params.finca, params.estanque);
    const area = estanqueInfo?.areaHectareas ?? "";
    const densidadDefault = "8";
    const cantidadCalculada = calcularCantidadSembrada(area, densidadDefault);

    setFormData((prev) => ({
      ...prev,
      tipoRegistro: "siembra",
      pasoPorPrecria: "si",
      precriaId: params.provieneDePrecriaId,
      finca: params.finca || "",
      estanque: params.estanque || "",
      cantidadSobrevivientePrecria:
        params.cantidadSobrevivientePrecria || params.cantidadFinal || "",
      duracionPrecria: params.duracionPrecria || params.duracionDias || "",
      fechaSalidaPrecria:
        params.fechaSalidaPrecria || params.fechaFin || "",

      areaHectareas: area,
      densidadPoblacional: densidadDefault,
      cantidadSembrada: cantidadCalculada,

      proveedorLarva: params.proveedorLarva || "",
      laboratorioLarva: params.laboratorioLarva || "",
      procedenciaLarva: params.procedenciaLarva || "",
      codigoLoteLarva: params.codigoLoteLarva || "",
      certificadoLarva: params.certificadoLarva || "",
      plSiembra: params.plLarva || "",
    }));

  }, [params.provieneDePrecriaId]);

  useEffect(() => {
    const formatted = obtenerFechaHoy();

    setFormData((prev) => ({
      ...prev,

      fechaSiembra: prev.fechaSiembra || formatted,

      fechaInicio: prev.fechaInicio || formatted,
      fechaSalidaPrecria: prev.fechaSalidaPrecria || formatted,
    }));

  }, []);

  const {
    submitted,
    setSubmitted,
    errors,
    setErrors,
    hasError,
    requiredLabel,
  } = useFieldValidation();

  function handleChange(field, value) {
    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        [field]: value,
      };

      if (
        updatedData.tipoRegistro === "siembra" &&
        (field === "areaHectareas" || field === "densidadPoblacional")
      ) {
        updatedData.cantidadSembrada = calcularCantidadSembrada(
          updatedData.areaHectareas,
          updatedData.densidadPoblacional,
        );
      }

      return updatedData;
    });
  }

  function handleChangeFinca(value) {
    setFormData((previousData) => ({
      ...previousData,

      finca: value,

      estanque: "",

      areaHectareas: "",

      cantidadSembrada: "",
    }));
  }

  function handleChangeEstanque(value) {
    const estanque = obtenerEstanquePorCodigo(formData.finca, value);

    const area = estanque?.areaHectareas ?? "";

    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        estanque: value,
      };

      if (previousData.tipoRegistro === "siembra") {
        updatedData.areaHectareas = area;
        updatedData.cantidadSembrada = calcularCantidadSembrada(
          area,
          previousData.densidadPoblacional,
        );
      }
      return updatedData;
    });
  }

  const estanques = obtenerEstanquesPorFinca(formData.finca);

  function obtenerCamposObligatorios() {

    if (!formData.tipoRegistro) {
      return ["tipoRegistro"];
    }
    return ["tipoRegistro", ...obtenerCamposObligatoriosPorTipo(formData)];
  }

  /**
   * ==========================================
   * Crear siembra
   * ==========================================
   */

  function handleCrearSiembra() {
    setSubmitted(true);
    const camposAValidar = obtenerCamposObligatorios();

    const nuevosErrores = validarCamposObligatorios(formData, camposAValidar);
    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      const tipo = formData.tipoRegistro === "precria" ? "Pre-Cría" : "Siembra";
      setMensaje(`Debe completar todos los campos obligatorios para registrar esta ${tipo}.`);
      setMensajeVariant("danger");
      return;
    }

    crearRegistro(formData);

    setMensaje(
      formData.tipoRegistro === "precria"
        ? "Pre-Cría registrada correctamente."
        : "Siembra registrada correctamente.",
    );
    setMensajeVariant("success");

    setSubmitted(false);
  }

  return {
    formData,

    estanques,

    mensaje,

    mensajeVariant,

    handleChange,

    handleChangeFinca,

    handleChangeEstanque,

    handleCrearSiembra,

    fieldHelpers: {
      hasError,
      requiredLabel,
    },
  };
}
