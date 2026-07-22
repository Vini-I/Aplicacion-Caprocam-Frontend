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
 * - Maneja el flujo "Siembra a partir de Pre-Cría": si el usuario NO
 *   llegó automáticamente desde "Finalizar Pre-Cría", puede elegir
 *   manualmente el origen (Directa / A partir de Pre-Cría) y, en ese
 *   caso, seleccionar una Pre-Cría finalizada y disponible de un
 *   Select (handleSeleccionarPreCria) — esto autocompleta y deja
 *   bloqueados los campos heredados (ver mode="view" en la screen).
 *
 * La pantalla únicamente consume este hook para renderizar
 * la interfaz y ejecutar acciones.
 */

import { useState, useEffect, useMemo } from "react";
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
  obtenerFincas,
  obtenerTecnicasCultivo,
  obtenerProveedoresLarva,
  obtenerLaboratoriosLarva,
  obtenerProcedenciasLarva,
  obtenerPLLarva,
  agregarProveedorLarva,
  agregarLaboratorioLarva,
  agregarProcedenciaLarva,
  actualizarProveedorLarva,
  actualizarLaboratorioLarva,
  actualizarProcedenciaLarva,
  eliminarProveedorLarva,
  eliminarLaboratorioLarva,
  eliminarProcedenciaLarva,
  obtenerSiembraPorId,
  obtenerPreCriasFinalizadasDisponibles,
  mapearPreCriaASiembra,
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

    handleSeleccionarPreCria(params.provieneDePrecriaId);
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

  const fincas = useMemo(() => obtenerFincas(), []);
  const tecnicasCultivo = useMemo(() => obtenerTecnicasCultivo(), []);
  const [proveedoresLarva, setProveedoresLarva] = useState(() =>
    obtenerProveedoresLarva(),
  );
  const [laboratoriosLarva, setLaboratoriosLarva] = useState(() =>
    obtenerLaboratoriosLarva(),
  );
  const [procedenciasLarva, setProcedenciasLarva] = useState(() =>
    obtenerProcedenciasLarva(),
  );
  const plLarva = useMemo(() => obtenerPLLarva(), []);

  const vinoAutomaticoDePrecria = Boolean(params.provieneDePrecriaId);

  const [preCriasDisponibles] = useState(() =>
    obtenerPreCriasFinalizadasDisponibles(),
  );

  const [origenSiembra, setOrigenSiembra] = useState("directa");

  const camposHeredadosDePrecria = [
    "duracionPrecria",
    "fechaSalidaPrecria",
    "cantidadSobrevivientePrecria",
    "proveedorLarva",
    "laboratorioLarva",
    "procedenciaLarva",
    "codigoLoteLarva",
    "certificadoLarva",
    "plSiembra",
  ];

  function handleSeleccionarPreCria(precriaId) {
    if (!precriaId) {
      setFormData((previo) => {
        const limpio = { ...previo, pasoPorPrecria: "no", precriaId: "" };
        camposHeredadosDePrecria.forEach((campo) => {
          limpio[campo] = "";
        });
        return limpio;
      });
      return;
    }

    const precria = obtenerSiembraPorId(precriaId);
    if (!precria) {
      return;
    }

    const datosMapeados = mapearPreCriaASiembra(precria);
    const estanqueInfo = obtenerEstanquePorCodigo(
      datosMapeados.finca,
      datosMapeados.estanque,
    );
    const area = estanqueInfo?.areaHectareas ?? "";

    setFormData((previo) => {
      const densidad = previo.densidadPoblacional || "8";

      return {
        ...previo,
        ...datosMapeados,
        pasoPorPrecria: "si",
        precriaId: String(precriaId),
        densidadPoblacional: densidad,
        areaHectareas: area,
        cantidadSembrada: calcularCantidadSembrada(area, densidad),
      };
    });
  }

  function handleCambiarOrigenSiembra(nuevoOrigen) {
    setOrigenSiembra(nuevoOrigen);

    if (nuevoOrigen === "directa") {
      handleSeleccionarPreCria("");
    }
  }

  /**
   * Agrega un ítem nuevo al catálogo correspondiente (proveedor,
   * laboratorio o procedencia de larva) y lo deja seleccionado de
   * una vez en el formulario, sin salir de esta pantalla.
   */
  function handleAgregarProveedorLarva(nombre) {
    const nuevo = agregarProveedorLarva(nombre);
    setProveedoresLarva((previo) => [...previo, nuevo]);
    handleChange("proveedorLarva", nuevo.value);
  }

  function handleAgregarLaboratorioLarva(nombre) {
    const nuevo = agregarLaboratorioLarva(nombre);
    setLaboratoriosLarva((previo) => [...previo, nuevo]);
    handleChange("laboratorioLarva", nuevo.value);
  }

  function handleAgregarProcedenciaLarva(nombre) {
    const nuevo = agregarProcedenciaLarva(nombre);
    setProcedenciasLarva((previo) => [...previo, nuevo]);
    handleChange("procedenciaLarva", nuevo.value);
  }

  function handleEditarProveedorLarva(value, nombre) {
    const actualizado = actualizarProveedorLarva(value, nombre);
    if (!actualizado) return;
    setProveedoresLarva((previo) =>
      previo.map((item) => (item.value === value ? actualizado : item)),
    );
  }

  function handleEditarLaboratorioLarva(value, nombre) {
    const actualizado = actualizarLaboratorioLarva(value, nombre);
    if (!actualizado) return;
    setLaboratoriosLarva((previo) =>
      previo.map((item) => (item.value === value ? actualizado : item)),
    );
  }

  function handleEditarProcedenciaLarva(value, nombre) {
    const actualizado = actualizarProcedenciaLarva(value, nombre);
    if (!actualizado) return;
    setProcedenciasLarva((previo) =>
      previo.map((item) => (item.value === value ? actualizado : item)),
    );
  }

  function handleEliminarProveedorLarva(value) {
    eliminarProveedorLarva(value);
    setProveedoresLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo.proveedorLarva === value
        ? { ...previo, proveedorLarva: "" }
        : previo,
    );
  }

  function handleEliminarLaboratorioLarva(value) {
    eliminarLaboratorioLarva(value);
    setLaboratoriosLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo.laboratorioLarva === value
        ? { ...previo, laboratorioLarva: "" }
        : previo,
    );
  }

  function handleEliminarProcedenciaLarva(value) {
    eliminarProcedenciaLarva(value);
    setProcedenciasLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo.procedenciaLarva === value
        ? { ...previo, procedenciaLarva: "" }
        : previo,
    );
  }

  function obtenerCamposObligatorios() {
    if (!formData.tipoRegistro) {
      return ["tipoRegistro"];
    }

    const campos = [
      "tipoRegistro",
      ...obtenerCamposObligatoriosPorTipo(formData),
    ];

    if (
      formData.tipoRegistro === "siembra" &&
      !vinoAutomaticoDePrecria &&
      origenSiembra === "precria"
    ) {
      campos.push("precriaId");
    }

    return campos;
  }

  function handleCrearSiembra() {
    setSubmitted(true);
    const camposAValidar = obtenerCamposObligatorios();

    const nuevosErrores = validarCamposObligatorios(formData, camposAValidar);
    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      const tipo = formData.tipoRegistro === "precria" ? "Pre-Cría" : "Siembra";
      setMensaje(
        `Debe completar todos los campos obligatorios para registrar esta ${tipo}.`,
      );
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

    fincas,

    tecnicasCultivo,

    proveedoresLarva,

    laboratoriosLarva,

    procedenciasLarva,

    plLarva,

    vinoAutomaticoDePrecria,

    preCriasDisponibles,

    origenSiembra,

    handleCambiarOrigenSiembra,

    handleSeleccionarPreCria,

    mensaje,

    mensajeVariant,

    handleChange,

    handleChangeFinca,

    handleChangeEstanque,

    handleCrearSiembra,

    handleAgregarProveedorLarva,

    handleAgregarLaboratorioLarva,

    handleAgregarProcedenciaLarva,

    handleEditarProveedorLarva,

    handleEditarLaboratorioLarva,

    handleEditarProcedenciaLarva,

    handleEliminarProveedorLarva,

    handleEliminarLaboratorioLarva,

    handleEliminarProcedenciaLarva,

    fieldHelpers: {
      hasError,
      requiredLabel,
    },
  };
}
