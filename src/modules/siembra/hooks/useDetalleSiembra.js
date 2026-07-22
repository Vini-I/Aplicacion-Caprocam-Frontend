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
 * - Al finalizar una Pre-Cría, además de los campos obligatorios de
 *   cierre, valida coherencia: la cantidad final no puede ser mayor
 *   a la inicial, y el PL final no puede ser un estadio menor al
 *   PL inicial.
 * - Al finalizar y navegar a crear la Siembra, usa router.replace
 *   (no push) para no dejar la Pre-Cría ya finalizada en la pila de
 *   navegación (evita que el botón "Volver" salte a una pantalla
 *   vieja/incorrecta).
 *
 * La pantalla utiliza este hook para controlar el formulario
 * de detalle sin manejar lógica de negocio.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import {
  useFieldValidation,
  validarCamposObligatorios,
} from "./useFieldValidation";

import { obtenerCamposObligatorios as obtenerCamposObligatoriosPorTipo } from "./siembraValidationRules";

import {
  calcularCantidadSembrada,
  calcularProgresoCiclo,
} from "./siembraCalculos";

import { obtenerFechaHoy } from "./dateUtils";

import {
  obtenerSiembraPorId,
  obtenerEstanquePorCodigo,
  obtenerEstanquesPorFinca,
  actualizarSiembra,
  finalizarPreCria as finalizarPreCriaEnServicio,
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
} from "../services/SiembraService";

function obtenerNumeroPL(pl) {
  if (!pl) return NaN;
  const coincidencia = String(pl).match(/\d+/);
  return coincidencia ? parseInt(coincidencia[0], 10) : NaN;
}
/**
 * Valida que los datos de cierre de una Pre-Cría sean coherentes con
 * los datos iniciales: la cantidad final no puede ser mayor a la
 * inicial, y el PL final no puede ser un estadio menor al inicial.
 * Se usa tanto al "Guardar" (por si se editan estos campos sin pasar
 * por "Finalizar") como al "Finalizar Pre-Cría".
 */
function validarCoherenciaCierrePrecria(formData) {
  const errores = {};

  const cantidadInicial = Number(formData.cantidadInicial);
  const cantidadFinal = Number(formData.cantidadFinal);

  if (
    !Number.isNaN(cantidadInicial) &&
    !Number.isNaN(cantidadFinal) &&
    cantidadFinal > cantidadInicial
  ) {
    errores.cantidadFinal = "No puede ser mayor a la cantidad inicial.";
  }

  const plInicialNumero = obtenerNumeroPL(formData.plInicial);
  const plFinalNumero = obtenerNumeroPL(formData.plFinal);

  if (
    !Number.isNaN(plInicialNumero) &&
    !Number.isNaN(plFinalNumero) &&
    plFinalNumero < plInicialNumero
  ) {
    errores.plFinal = "No puede ser un estadio menor al PL inicial.";
  }

  return errores;
}
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

  const handleChange = useCallback(
    (field, value) => {
      setFormData((previousData) => {
        const updatedData = {
          ...previousData,
          [field]: value,
        };

        if (field === "areaHectareas" || field === "densidadPoblacional") {
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
    },
    [submitted, setErrors],
  );

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
      const estanque = obtenerEstanquePorCodigo(formData.finca, value);

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

  const estanques = formData ? obtenerEstanquesPorFinca(formData.finca) : [];

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

  /**
   * Agrega un ítem nuevo al catálogo correspondiente (proveedor,
   * laboratorio o procedencia de larva) y lo deja seleccionado de
   * una vez en el formulario, sin salir de esta pantalla.
   */
  const handleAgregarProveedorLarva = useCallback(
    (nombre) => {
      const nuevo = agregarProveedorLarva(nombre);
      setProveedoresLarva((previo) => [...previo, nuevo]);
      handleChange("proveedorLarva", nuevo.value);
    },
    [handleChange],
  );

  const handleAgregarLaboratorioLarva = useCallback(
    (nombre) => {
      const nuevo = agregarLaboratorioLarva(nombre);
      setLaboratoriosLarva((previo) => [...previo, nuevo]);
      handleChange("laboratorioLarva", nuevo.value);
    },
    [handleChange],
  );

  const handleAgregarProcedenciaLarva = useCallback(
    (nombre) => {
      const nuevo = agregarProcedenciaLarva(nombre);
      setProcedenciasLarva((previo) => [...previo, nuevo]);
      handleChange("procedenciaLarva", nuevo.value);
    },
    [handleChange],
  );

  const handleEditarProveedorLarva = useCallback((value, nombre) => {
    const actualizado = actualizarProveedorLarva(value, nombre);
    if (!actualizado) return;
    setProveedoresLarva((previo) =>
      previo.map((item) => (item.value === value ? actualizado : item)),
    );
  }, []);

  const handleEditarLaboratorioLarva = useCallback((value, nombre) => {
    const actualizado = actualizarLaboratorioLarva(value, nombre);
    if (!actualizado) return;
    setLaboratoriosLarva((previo) =>
      previo.map((item) => (item.value === value ? actualizado : item)),
    );
  }, []);

  const handleEditarProcedenciaLarva = useCallback((value, nombre) => {
    const actualizado = actualizarProcedenciaLarva(value, nombre);
    if (!actualizado) return;
    setProcedenciasLarva((previo) =>
      previo.map((item) => (item.value === value ? actualizado : item)),
    );
  }, []);

  const handleEliminarProveedorLarva = useCallback((value) => {
    eliminarProveedorLarva(value);
    setProveedoresLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo && previo.proveedorLarva === value
        ? { ...previo, proveedorLarva: "" }
        : previo,
    );
  }, []);

  const handleEliminarLaboratorioLarva = useCallback((value) => {
    eliminarLaboratorioLarva(value);
    setLaboratoriosLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo && previo.laboratorioLarva === value
        ? { ...previo, laboratorioLarva: "" }
        : previo,
    );
  }, []);

  const handleEliminarProcedenciaLarva = useCallback((value) => {
    eliminarProcedenciaLarva(value);
    setProcedenciasLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo && previo.procedenciaLarva === value
        ? { ...previo, procedenciaLarva: "" }
        : previo,
    );
  }, []);

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
          if (
            (siembraNorm[f] === undefined ||
              siembraNorm[f] === "" ||
              siembraNorm[f] === null) &&
            formNorm[f] === hoy
          ) {
            formNorm[f] = siembraNorm[f];
          }
        });
      } catch (e) {}

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

    const erroresObligatorios = validarCamposObligatorios(
      formData,
      obtenerCamposObligatorios(),
    );

    if (Object.keys(erroresObligatorios).length > 0) {
      setErrors(erroresObligatorios);
      setMensaje(
        "Revisa los campos obligatorios marcados con * antes de guardar.",
      );
      setMensajeVariant("danger");
      return;
    }

    if (formData.tipoRegistro === "precria") {
      const erroresCoherencia = validarCoherenciaCierrePrecria(formData);

      if (Object.keys(erroresCoherencia).length > 0) {
        setErrors(erroresCoherencia);
        setMensaje(
          "Revisa los datos de cierre: la cantidad final o el PL final no son coherentes con los datos iniciales de la Pre-Cría.",
        );
        setMensajeVariant("danger");
        return;
      }
    }

    setErrors({});

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
   * cantidad final y PL final), valida que sean coherentes con
   * los datos iniciales, guarda esos cambios y marca la Pre-Cría
   * como "Finalizada".
   *
   * Devuelve el registro actualizado si todo salió bien, o
   * `null` si faltan campos obligatorios o hay una incoherencia
   * (en cuyo caso la pantalla no debe navegar a crear la siembra).
   */
  const finalizarPreCria = useCallback(() => {
    setSubmitted(true);

    const camposCierre = ["fechaFin", "cantidadFinal", "plFinal"];

    const erroresCampos = validarCamposObligatorios(formData, camposCierre);

    if (Object.keys(erroresCampos).length > 0) {
      setErrors(erroresCampos);
      setIsEditing(true);

      setMensaje(
        "Debes llenar los tres datos finales de Pre-Cría para poder finalizar.",
      );
      setMensajeVariant("danger");
      return null;
    }

    const erroresCoherencia = validarCoherenciaCierrePrecria(formData);

    if (Object.keys(erroresCoherencia).length > 0) {
      setErrors(erroresCoherencia);
      setIsEditing(true);

      setMensaje(
        "Revisa los datos de cierre: la cantidad final o el PL final no son coherentes con los datos iniciales de la Pre-Cría.",
      );
      setMensajeVariant("danger");
      return null;
    }

    setErrors({});

    const registroFinalizado = finalizarPreCriaEnServicio(id, formData);

    setSiembra(registroFinalizado);
    setFormData(registroFinalizado);

    setIsEditing(false);

    setSubmitted(false);
    setErrors({});

    setMensaje("Pre-Cría finalizada correctamente.");
    setMensajeVariant("success");

    return registroFinalizado;
  }, [formData, id, setSubmitted, setErrors]);

  const { totalDias, diaActual, progreso } = calcularProgresoCiclo(formData);

  const etapa = calcularEtapa(progreso);

  const tieneValor = (valor) =>
    valor !== undefined && valor !== null && valor !== "";

  const datosCierrePreCriaCompletos = Boolean(
    siembra &&
    siembra.tipoRegistro === "precria" &&
    tieneValor(siembra.fechaFin) &&
    tieneValor(siembra.plFinal) &&
    tieneValor(siembra.cantidadFinal),
  );

  const construirParamsSiembraDesdePrecria = useCallback(
    () => ({ provieneDePrecriaId: id }),
    [id],
  );

  const handleFinalizarPreCria = useCallback(() => {
    const registroFinalizado = finalizarPreCria();

    if (!registroFinalizado) {
      return;
    }

    router.replace({
      pathname: "/(drawer)/siembra/nueva",
      params: construirParamsSiembraDesdePrecria(),
    });
  }, [finalizarPreCria, construirParamsSiembraDesdePrecria, router]);

  const handleCrearSiembraDesdePrecria = useCallback(() => {
    router.push({
      pathname: "/(drawer)/siembra/nueva",
      params: construirParamsSiembraDesdePrecria(),
    });
  }, [construirParamsSiembraDesdePrecria, router]);

  return {
    siembra,

    formData,

    estanques,

    fincas,

    tecnicasCultivo,

    proveedoresLarva,

    laboratoriosLarva,

    procedenciasLarva,

    plLarva,

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
