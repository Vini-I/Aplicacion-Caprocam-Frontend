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
import { useRouter } from "expo-router";

import {
  useFieldValidation,
  validarCamposObligatorios,
} from "./useFieldValidation";

import { obtenerCamposObligatorios as obtenerCamposObligatoriosPorTipo } from "./siembraValidationRules";

import { calcularCantidadSembrada, calcularProgresoCiclo } from "./siembraCalculos";

import { obtenerFechaHoy } from "./dateUtils";

import { formatearHoraIngreso } from "./siembraFormatters";

import {
  obtenerSiembraPorId,
  obtenerEstanquePorCodigo,
  obtenerEstanquesPorFinca,
  actualizarSiembra,
  finalizarPreCria as finalizarPreCriaEnServicio,
} from "../services/SiembraService";

function calcularEtapa(progreso) {
  if (progreso >= 66) return 3;
  if (progreso >= 33) return 2;

  return 1;
}

export default function useDetalleSiembra(id) {
  const router = useRouter();

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
  } = useFieldValidation();

  useEffect(() => {
    const siembraEncontrada = obtenerSiembraPorId(id);

    setSiembra(siembraEncontrada);
    setFormData(siembraEncontrada ?? null);
  }, [id]);

  useEffect(() => {
    if (!isEditing || !formData || formData.tipoRegistro !== "precria") {
      return;
    }

    if (formData.fechaFin && formData.fechaFin.trim() !== "") {
      return;
    }

    const formattedToday = obtenerFechaHoy();

    setFormData((prev) => ({
      ...prev,
      fechaFin: formattedToday,
    }));
  }, [formData, isEditing]);


  const handleChange = useCallback((field, value) => {
    setFormData((previousData) => {
      const valorFinal = field === "horaIngreso" ? formatearHoraIngreso(value) : value;

      const updatedData = {
        ...previousData,
        [field]: valorFinal,
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

      if (submitted) {

        const camposAValidar = Object.keys(errors).length
          ? Array.from(
              new Set([
                ...Object.keys(errors),
                ...obtenerCamposObligatoriosPorTipo(updatedData),
              ]),
            )
          : obtenerCamposObligatoriosPorTipo(updatedData);

        const erroresActualizados = validarCamposObligatorios(
          updatedData,
          camposAValidar,
        );

        setErrors((prev) => {
          const filtrados = {};

          Object.keys(prev).forEach((k) => {
            if (erroresActualizados[k]) {
              filtrados[k] = erroresActualizados[k];
            }
          });

          return filtrados;
        });
      }

      return updatedData;
    });
  }, [submitted, setErrors]);


  const handleChangeFinca = useCallback((value) => {
    setFormData((previousData) => ({
      ...previousData,

      finca: value,

      estanque: "",

      areaHectareas: "",

      cantidadSembrada: "",
    }));
  }, []);


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

  const estanques = formData
    ? obtenerEstanquesPorFinca(formData.finca)
    : [];

  const obtenerCamposObligatorios = useCallback(
    (opciones) => obtenerCamposObligatoriosPorTipo(formData, opciones),
    [formData],
  );

  const iniciarEdicion = useCallback(() => {
    setIsEditing(true);
    setMensaje("");

    setFormData((prev) => {
      if (!prev) return prev;

      const formattedToday = obtenerFechaHoy();

      return {
        ...prev,
        fechaSiembra: prev.fechaSiembra || formattedToday,
        fechaInicio: prev.fechaInicio || formattedToday,
        fechaFin: prev.fechaFin || formattedToday,
        fechaSalidaPrecria: prev.fechaSalidaPrecria || formattedToday,
      };
    });

    setSubmitted(false);
    setErrors({});
  }, [setSubmitted, setErrors]);

  const cancelarEdicion = useCallback(() => {
    setFormData(siembra);

    setSubmitted(false);

    setErrors({});

    setIsEditing(false);

    setMensaje("");
  }, [siembra, setSubmitted, setErrors]);

  const huboCambios = useCallback(() => {
    if (!siembra || !formData) return false;

    try {
      const fechaCampos = [
        "fechaSiembra",
        "fechaInicio",
        "fechaFin",
        "fechaSalidaPrecria",
      ];

      const siembraNorm = { ...siembra };
      const formNorm = { ...formData };

      try {
        const hoy = obtenerFechaHoy();

        fechaCampos.forEach((f) => {
          if ((siembraNorm[f] === undefined || siembraNorm[f] === "" || siembraNorm[f] === null) && formNorm[f] === hoy) {
            formNorm[f] = siembraNorm[f];
          }
        });
      } catch (e) {

      }

      return JSON.stringify(siembraNorm) !== JSON.stringify(formNorm);
    } catch (e) {
      return true;
    }
  }, [siembra, formData]);

  const guardar = useCallback(() => {
    setSubmitted(true);

    if (!huboCambios()) {
      setErrors({});
      setMensaje("No hay cambios para guardar.");
      setMensajeVariant("danger");
      return;
    }

    const nuevosErrores = validarCamposObligatorios(
      formData,
      obtenerCamposObligatorios(),
    );

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje(
        "Revisa los campos obligatorios marcados con * antes de guardar.",
      );
      setMensajeVariant("danger");
      return;
    }

    const registroActualizado = actualizarSiembra(id, formData);

    setSiembra(registroActualizado);
    setFormData(registroActualizado);

    setIsEditing(false);
    setSubmitted(false);
    setErrors({});

    setMensaje(
      formData && formData.tipoRegistro === "siembra"
        ? "Proveedor actualizado correctamente."
        : "Registro actualizado correctamente.",
    );

    setMensajeVariant("success");
  }, [
    formData,
    id,
    obtenerCamposObligatorios,
    setSubmitted,
    setErrors,
    huboCambios,
  ]);

  /**
   * ==========================================
   * Finalizar Pre-Cría
   * ==========================================
   *
   * Valida los campos de cierre del ciclo (fecha de salida,
   * cantidad final y PL final), guarda esos cambios y marca
   * la Pre-Cría como "Finalizada".
   *
   * Devuelve el registro actualizado si todo salió bien, o
   * `null` si faltan campos obligatorios (en cuyo caso la
   * pantalla no debe navegar a crear la siembra).
   */
  const finalizarPreCria = useCallback(() => {
    setSubmitted(true);

    const camposCierre = ["fechaFin", "cantidadFinal", "plFinal"];

    const nuevosErrores = validarCamposObligatorios(
      formData,
      camposCierre,
    );

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setIsEditing(true);

      setMensaje(
        "Debes llenar los tres datos finales de Pre-Cría para poder finalizar.",
      );
      setMensajeVariant("danger");
      return null;
    }

    const registroFinalizado = finalizarPreCriaEnServicio(id, formData);

    setSiembra(registroFinalizado);
    setFormData(registroFinalizado);

    setIsEditing(false);

    setSubmitted(false);
    setErrors({});

    setMensaje("Pre-Cría finalizada correctamente.");
    setMensajeVariant("success");

    return registroFinalizado;
  }, [
    formData,
    id,
    obtenerCamposObligatorios,
    setSubmitted,
    setErrors,
  ]);

  const { totalDias, diaActual, progreso } = calcularProgresoCiclo(formData);

  const etapa = calcularEtapa(progreso);

  /**
   * ==========================================
   * Datos de cierre de Pre-Cría completos
   * ==========================================
   *
   * El botón "Finalizar Pre-Cría" solo debe poder presionarse
   * cuando los tres datos de cierre del ciclo ya fueron
   * ingresados Y GUARDADOS previamente (fecha de salida, PL
   * final/tamaño y cantidad final/sobreviviente). Por eso se
   * valida contra "siembra" (el último registro persistido) y
   * no contra "formData" (que puede tener cambios sin guardar).
   *
   * Se usa una comprobación explícita de "vacío" (no un simple
   * Boolean) porque "cantidadFinal" puede legítimamente ser 0
   * (ej. mortalidad total en el ciclo) y Boolean(0) daría false,
   * dejando el botón deshabilitado aunque el dato sí esté guardado.
   */
  const tieneValor = (valor) =>
    valor !== undefined && valor !== null && valor !== "";

  const datosCierrePreCriaCompletos = Boolean(
    siembra &&
      siembra.tipoRegistro === "precria" &&
      tieneValor(siembra.fechaFin) &&
      tieneValor(siembra.plFinal) &&
      tieneValor(siembra.cantidadFinal),
  );

  /**
   * ==========================================
   * Parámetros para crear Siembra desde Pre-Cría
   * ==========================================
   *
   * Construye los parámetros que se envían a "Nueva Siembra"
   * para prellenar el formulario con los datos de la Pre-Cría
   * (recién finalizada o ya finalizada previamente). Es lógica
   * pura de datos: la pantalla solo la usa junto con router.push.
   */
  const construirParamsSiembraDesdePrecria = useCallback(
    (datosPrecria) => ({
      provieneDePrecriaId: id,
      finca: datosPrecria.fincaId || datosPrecria.finca || "",
      estanque: datosPrecria.estanque || "",
      cantidadFinal:
        datosPrecria.cantidadFinal ||
        datosPrecria.cantidadSobrevivientePrecria ||
        "",
      cantidadSobrevivientePrecria:
        datosPrecria.cantidadSobrevivientePrecria ||
        datosPrecria.cantidadFinal ||
        "",
      duracionDias:
        datosPrecria.duracionDias || datosPrecria.duracionPrecria || "",
      duracionPrecria:
        datosPrecria.duracionPrecria || datosPrecria.duracionDias || "",
      fechaFin: datosPrecria.fechaFin || datosPrecria.fechaSalidaPrecria || "",
      fechaSalidaPrecria:
        datosPrecria.fechaSalidaPrecria || datosPrecria.fechaFin || "",
      proveedorLarva: datosPrecria.proveedorLarva || "",
      laboratorioLarva:
        datosPrecria.laboratorioLarva || datosPrecria.laboratoriosLarva || "",
      procedenciaLarva: datosPrecria.procedenciaLarva || "",
      codigoLoteLarva: datosPrecria.codigoLoteLarva || "",
      certificadoLarva: datosPrecria.certificadoLarva || "",
      plLarva:
        datosPrecria.plLarva ||
        datosPrecria.plFinal ||
        datosPrecria.plInicial ||
        "",
    }),
    [id],
  );

  /**
   * ==========================================
   * Finalizar Pre-Cría y continuar a Siembra
   * ==========================================
   *
   * Finaliza la Pre-Cría y, si quedó guardada correctamente,
   * navega a "Nueva Siembra" con los datos ya prellenados.
   * Si faltan campos obligatorios, finalizarPreCria() devuelve
   * null y aquí simplemente no se navega.
   */
  const handleFinalizarPreCria = useCallback(() => {
    const registroFinalizado = finalizarPreCria();

    if (!registroFinalizado) {
      return;
    }

    router.push({
      pathname: "/(drawer)/siembra/nueva",
      params: construirParamsSiembraDesdePrecria(registroFinalizado),
    });
  }, [finalizarPreCria, construirParamsSiembraDesdePrecria, router]);

  /**
   * Navega a "Nueva Siembra" con los datos de una Pre-Cría que
   * ya fue finalizada previamente (accesos directo desde el modo
   * consulta, sin volver a finalizar nada).
   */
  const handleCrearSiembraDesdePrecria = useCallback(() => {
    router.push({
      pathname: "/(drawer)/siembra/nueva",
      params: construirParamsSiembraDesdePrecria(formData),
    });
  }, [construirParamsSiembraDesdePrecria, formData, router]);

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

    handleFinalizarPreCria,

    handleCrearSiembraDesdePrecria,

    datosCierrePreCriaCompletos,

    fieldHelpers: {
      hasError,
      requiredLabel,
    },
  };
}