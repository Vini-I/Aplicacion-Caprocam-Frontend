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
 *
 * La pantalla únicamente consume este hook para renderizar
 * la interfaz y ejecutar acciones.
 */

import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import {
  useSiembraFieldValidation,
  validarCamposObligatorios,
} from "./useSiembraFieldValidation";

import { calcularCantidadSembrada } from "./siembraCalculos";

import {
  obtenerEstanquePorCodigo,
  obtenerEstanquesPorFinca,
} from "../services/SiembraService";

const CAMPOS_SIEMBRA_OBLIGATORIOS = [
  "tipoRegistro",
  "fechaSiembra",
  "finca",
  "estanque",
  "tecnicaCultivo",
  "diasMaduracion",
  "proveedorLarva",
  "laboratorioLarva",
  "procedenciaLarva",
  "codigoLoteLarva",
  "plSiembra",
  "certificadoLarva",
  "areaHectareas",
  "densidadPoblacional",
  "cantidadSembrada",
];

const CAMPOS_PRECRIA_INDEPENDIENTE_OBLIGATORIOS = [
  "tipoRegistro",
  "finca",
  "estanque",
  "fechaInicio",
  "duracionDias",
  "cantidadInicial",
  "plInicial",
  "proveedorLarva",
  "laboratorioLarva",
  "procedenciaLarva",
  "codigoLoteLarva",
  "certificadoLarva",
];

const initialFormData = {
  tipoRegistro: "siembra",
  pasoPorPrecria: "no",

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
  laboratoriosLarva: "",
  procedenciaLarva: "",
  certificadoLarva: "",

  duracionPrecria: "",
  fechaSalidaPrecria: "",
  cantidadSobrevivientePrecria: "",
};

export default function useNuevaSiembra() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.provieneDePrecriaId) {
      const estanqueInfo = obtenerEstanquePorCodigo(params.finca, params.estanque);
      const area = estanqueInfo?.areaHectareas ?? "";
      const densidadDefault = "8";
      const cantidadCalculada = calcularCantidadSembrada(area, densidadDefault);
      setFormData((prev) => ({
        ...prev,
        tipoRegistro: "siembra",
        pasoPorPrecria: "si",
        finca: params.finca || "",
        estanque: params.estanque || "",
        cantidadSobrevivientePrecria: params.cantidadFinal || "",
        duracionPrecria: params.duracionDias || "",
        fechaSalidaPrecria: params.fechaFin || "",

        areaHectareas: area,
        densidadPoblacional: densidadDefault,
        cantidadSembrada: cantidadCalculada,

        proveedorLarva: params.proveedorLarva || "",
        laboratorioLarva: params.laboratorioLarva || "", 
        laboratoriosLarva: params.laboratorioLarva || "", 
        procedenciaLarva: params.procedenciaLarva || "",
        codigoLoteLarva: params.codigoLoteLarva || "",
        certificadoLarva: params.certificadoLarva || "",
        plSiembra: params.plLarva || "",
      }));
    }
     
  }, [params]);

  const {
    submitted,
    setSubmitted,
    errors,
    setErrors,
    hasError,
    requiredLabel,
  } = useSiembraFieldValidation();

  /**
   * ==========================================
   * Cambios genéricos
   * ==========================================
   */

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

  /**
   * ==========================================
   * Cambio de finca
   * ==========================================
   */

  function handleChangeFinca(value) {
    setFormData((previousData) => ({
      ...previousData,

      finca: value,

      estanque: "",

      areaHectareas: "",

      cantidadSembrada: "",
    }));
  }

  /**
   * ==========================================
   * Cambio de estanque
   * ==========================================
   */

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

  /**
   * ==========================================
   * Estanques disponibles
   * ==========================================
   */

  const estanques = obtenerEstanquesPorFinca(formData.finca);

  /**
   * ==========================================
   * Campos obligatorios
   * ==========================================
   */

  function obtenerCamposObligatorios() {
    if (formData.tipoRegistro === "precria") {
      return CAMPOS_PRECRIA_INDEPENDIENTE_OBLIGATORIOS;
    }
    let campos = [...CAMPOS_SIEMBRA_OBLIGATORIOS];
    if (formData.pasoPorPrecria === "si") {
      campos.push(
        "duracionPrecria",
        "fechaSalidaPrecria",
        "cantidadSobrevivientePrecria",
      );
    }
    return campos;
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
      setModalVisible(true);
      return;
    }

    console.log("Siembra registrada:", formData);
    setSubmitted(false);
    setFormData(initialFormData);
    router.back();
  }

  return {
    formData,

    estanques,

    modalVisible,

    setModalVisible,

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
