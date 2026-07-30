/**
 * ============================================================
 * HOOK DE DETALLE DE SIEMBRA
 * ============================================================
 *
 * Centraliza la lógica de consulta y edición de una siembra existente.
 *
 * FUNCIONALIDAD:
 * - Carga la información de la siembra seleccionada, junto con su
 *   Lote de Larva asociado (proveedor/laboratorio/procedencia/código
 *   viven en esa tabla, no en Siembra/Pre-Cría) y, si la Siembra
 *   proviene de una Pre-Cría, también la Pre-Cría de origen (para
 *   mostrar sus datos heredados en modo lectura).
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
import { useRouter, useLocalSearchParams } from "expo-router";

import {
  useFieldValidation,
  validarCamposObligatorios,
} from "./useFieldValidation";
import { obtenerCamposObligatorios as obtenerCamposObligatoriosPorTipo } from "./siembraValidationRules";
import {
  calcularCantidadSembrada,
  calcularProgresoCiclo,
} from "./siembraCalculos";
import { obtenerFechaHoy, formatearFechaDesdeISO } from "./dateUtils";
import {
  obtenerEstanquePorCodigo,
  obtenerEstanquesPorFinca,
  obtenerFincas,
} from "./fincaEstanqueLocal";

import { getSiembraById, updateSiembra } from "../services/siembra.service";
import {
  getPrecriaById,
  updatePrecria,
  finalizarPrecria,
} from "../services/precria.service";
import { getLoteById } from "../services/lote.service";
import {
  getProveedoresLarva,
  createProveedorLarva,
  updateProveedorLarva,
  eliminarProveedorLarva,
} from "../services/proveedorLarva.service";
import {
  getLaboratorios,
  createLaboratorio,
  updateLaboratorio,
  eliminarLaboratorio,
} from "../services/laboratorio.service";
import {
  getProcedencias,
  createProcedencia,
  updateProcedencia,
  eliminarProcedencia,
} from "../services/procedencia.service";
import {
  SiembraDTO,
  PrecriaDTO,
  FinalizarPrecriaDTO,
} from "../dtos/siembra.dto";

function mapCatalogo(items) {
  return (items || []).map((item) => ({ label: item.nombre, value: item.id }));
}

// El backend guarda proveedor/laboratorio/procedencia/código en la
// tabla del Lote de Larva, no en Siembra ni Pre-Cría - por eso el
// detalle necesita esta segunda petición y este mapeo aparte.
function mapLoteAFormData(lote) {
  if (!lote) return {};
  return {
    codigoLoteLarva: lote.codigo_lote || "",
    proveedorLarva: lote.proveedor_larva_id || "",
    laboratorioLarva: lote.laboratorio_id || "",
    procedenciaLarva: lote.procedencia_id || "",
    certificadoLarva: lote.certificado_larva || "",
  };
}

function mapSiembraAFormData(siembra, lote, precriaOrigen) {
  return {
    tipoRegistro: "siembra",
    loteId: siembra.lote_larva_id,
    pasoPorPrecria: siembra.precria_id ? "si" : "no",
    precriaId: siembra.precria_id ? String(siembra.precria_id) : "",
    finca: siembra.finca_id || "",
    estanque: siembra.estanque_id || "",
    estado: siembra.estado === "FINALIZADA" ? "Finalizada" : "Activa",
    fechaSiembra: formatearFechaDesdeISO(siembra.fecha_siembra),
    tecnicaCultivo: siembra.tecnica_cultivo || "",
    densidadPoblacional:
      siembra.densidad_poblacional != null
        ? String(siembra.densidad_poblacional)
        : "",
    cantidadSembrada:
      siembra.cantidad_sembrada != null
        ? String(siembra.cantidad_sembrada)
        : "",
    plSiembra: siembra.pl_siembra != null ? `PL${siembra.pl_siembra}` : "",
    // Heredado de la Pre-Cría de origen - antes nunca se llenaba.
    duracionPrecria: precriaOrigen?.duracion_dias ?? "",
    fechaSalidaPrecria: precriaOrigen
      ? formatearFechaDesdeISO(precriaOrigen.fecha_fin)
      : "",
    cantidadSobrevivientePrecria: precriaOrigen?.cantidad_final ?? "",
    ...mapLoteAFormData(lote),
  };
}

function mapPrecriaAFormData(precria, lote) {
  return {
    tipoRegistro: "precria",
    loteId: precria.lote_larva_id,
    finca: precria.finca_id || "",
    estanque: precria.estanque_id || "",
    estado: precria.estado || "Activa",
    fechaInicio: formatearFechaDesdeISO(precria.fecha_inicio),
    fechaFin: formatearFechaDesdeISO(precria.fecha_fin),
    duracionDias:
      precria.duracion_dias != null ? String(precria.duracion_dias) : "",
    cantidadInicial:
      precria.cantidad_inicial != null ? String(precria.cantidad_inicial) : "",
    cantidadFinal:
      precria.cantidad_final != null ? String(precria.cantidad_final) : "",
    plInicial: precria.pl_inicial != null ? `PL${precria.pl_inicial}` : "",
    plFinal: precria.pl_final != null ? `PL${precria.pl_final}` : "",
    ...mapLoteAFormData(lote),
  };
}

function obtenerNumeroPL(pl) {
  if (!pl) return NaN;
  const coincidencia = String(pl).match(/\d+/);
  return coincidencia ? parseInt(coincidencia[0], 10) : NaN;
}

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
  const { tipoRegistro: tipoRegistroParam } = useLocalSearchParams();

  const [siembra, setSiembra] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

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

  const cargarDetalle = useCallback(async () => {
    try {
      setCargando(true);
      let registro;
      if (tipoRegistroParam === "precria") {
        registro = await getPrecriaById(id);
      } else {
        registro = await getSiembraById(id);
      }

      const lote = registro?.lote_larva_id
        ? await getLoteById(registro.lote_larva_id)
        : null;

      // Si esta Siembra vino de una Pre-Cría, hay que traerla también
      // para poder mostrar sus datos heredados en modo lectura.
      const precriaOrigen =
        tipoRegistroParam !== "precria" && registro?.precria_id
          ? await getPrecriaById(registro.precria_id)
          : null;

      const mapeado =
        tipoRegistroParam === "precria"
          ? mapPrecriaAFormData(registro, lote)
          : mapSiembraAFormData(registro, lote, precriaOrigen);

      setSiembra(mapeado);
      setFormData(mapeado);
    } catch (err) {
      setMensaje("No fue posible cargar el registro.");
      setMensajeVariant("danger");
    } finally {
      setCargando(false);
    }
  }, [id, tipoRegistroParam]);

  useEffect(() => {
    cargarDetalle();
  }, [cargarDetalle]);

  useEffect(() => {
    if (!isEditing || !formData || formData.tipoRegistro !== "precria") return;
    if (formData.fechaFin && formData.fechaFin.trim() !== "") return;

    const formattedToday = obtenerFechaHoy();
    setFormData((prev) => ({ ...prev, fechaFin: formattedToday }));
  }, [formData, isEditing]);

  const handleChange = useCallback(
    (field, value) => {
      setFormData((previousData) => {
        const updatedData = { ...previousData, [field]: value };

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
              if (erroresActualizados[k]) filtrados[k] = erroresActualizados[k];
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
  const tecnicasCultivo = useMemo(
    () => [
      { label: "Extensiva", value: "extensiva" },
      { label: "Semi-intensiva", value: "semi" },
      { label: "Intensiva", value: "intensiva" },
    ],
    [],
  );
  const plLarva = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        label: `PL${i + 1}`,
        value: `PL${i + 1}`,
      })),
    [],
  );

  const [proveedoresLarva, setProveedoresLarva] = useState([]);
  const [laboratoriosLarva, setLaboratoriosLarva] = useState([]);
  const [procedenciasLarva, setProcedenciasLarva] = useState([]);

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const [proveedores, laboratorios, procedencias] = await Promise.all([
          getProveedoresLarva(),
          getLaboratorios(),
          getProcedencias(),
        ]);
        setProveedoresLarva(mapCatalogo(proveedores));
        setLaboratoriosLarva(mapCatalogo(laboratorios));
        setProcedenciasLarva(mapCatalogo(procedencias));
      } catch (err) {
        // no bloquea el detalle si esto falla
      }
    }
    cargarCatalogos();
  }, []);

  const handleAgregarProveedorLarva = useCallback(
    async (nombre) => {
      const nuevo = await createProveedorLarva(nombre);
      setProveedoresLarva((previo) => [
        ...previo,
        { label: nuevo.nombre, value: nuevo.id },
      ]);
      handleChange("proveedorLarva", nuevo.id);
    },
    [handleChange],
  );

  const handleAgregarLaboratorioLarva = useCallback(
    async (nombre) => {
      const nuevo = await createLaboratorio(nombre);
      setLaboratoriosLarva((previo) => [
        ...previo,
        { label: nuevo.nombre, value: nuevo.id },
      ]);
      handleChange("laboratorioLarva", nuevo.id);
    },
    [handleChange],
  );

  const handleAgregarProcedenciaLarva = useCallback(
    async (nombre) => {
      const nuevo = await createProcedencia(nombre);
      setProcedenciasLarva((previo) => [
        ...previo,
        { label: nuevo.nombre, value: nuevo.id },
      ]);
      handleChange("procedenciaLarva", nuevo.id);
    },
    [handleChange],
  );

  const handleEditarProveedorLarva = useCallback(async (value, nombre) => {
    const actualizado = await updateProveedorLarva(value, nombre);
    setProveedoresLarva((previo) =>
      previo.map((item) =>
        item.value === value
          ? { label: actualizado.nombre, value: actualizado.id }
          : item,
      ),
    );
  }, []);

  const handleEditarLaboratorioLarva = useCallback(async (value, nombre) => {
    const actualizado = await updateLaboratorio(value, nombre);
    setLaboratoriosLarva((previo) =>
      previo.map((item) =>
        item.value === value
          ? { label: actualizado.nombre, value: actualizado.id }
          : item,
      ),
    );
  }, []);

  const handleEditarProcedenciaLarva = useCallback(async (value, nombre) => {
    const actualizado = await updateProcedencia(value, nombre);
    setProcedenciasLarva((previo) =>
      previo.map((item) =>
        item.value === value
          ? { label: actualizado.nombre, value: actualizado.id }
          : item,
      ),
    );
  }, []);

  const handleEliminarProveedorLarva = useCallback(async (value) => {
    await eliminarProveedorLarva(value);
    setProveedoresLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo && previo.proveedorLarva === value
        ? { ...previo, proveedorLarva: "" }
        : previo,
    );
  }, []);

  const handleEliminarLaboratorioLarva = useCallback(async (value) => {
    await eliminarLaboratorio(value);
    setLaboratoriosLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo && previo.laboratorioLarva === value
        ? { ...previo, laboratorioLarva: "" }
        : previo,
    );
  }, []);

  const handleEliminarProcedenciaLarva = useCallback(async (value) => {
    await eliminarProcedencia(value);
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
      return JSON.stringify(siembra) !== JSON.stringify(formData);
    } catch (e) {
      return true;
    }
  }, [siembra, formData]);

  const guardar = useCallback(async () => {
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
    setGuardando(true);
    try {
      let actualizado;
      if (formData.tipoRegistro === "precria") {
        actualizado = await updatePrecria(
          id,
          new PrecriaDTO(formData, formData.loteId),
        );
        actualizado = mapPrecriaAFormData(actualizado, null);
      } else {
        actualizado = await updateSiembra(
          id,
          new SiembraDTO(formData, formData.loteId),
        );
        actualizado = mapSiembraAFormData(actualizado, null);
      }

      // El lote no cambia al actualizar siembra/pre-cría, así que se
      // conservan sus datos (proveedor/laboratorio/etc.) del formData actual.
      const conLote = {
        ...actualizado,
        ...(formData.pasoPorPrecria === "si"
          ? {
              duracionPrecria: formData.duracionPrecria,
              fechaSalidaPrecria: formData.fechaSalidaPrecria,
              cantidadSobrevivientePrecria:
                formData.cantidadSobrevivientePrecria,
            }
          : {}),
        ...mapLoteAFormData({
          codigo_lote: formData.codigoLoteLarva,
          proveedor_id: formData.proveedorLarva,
          laboratorio: formData.laboratorioLarva,
          procedencia: formData.procedenciaLarva,
          certificado_larva: formData.certificadoLarva,
        }),
      };

      setSiembra(conLote);
      setFormData(conLote);
      setIsEditing(false);
      setSubmitted(false);
      setMensaje("Registro actualizado correctamente.");
      setMensajeVariant("success");
    } catch (err) {
      const mensajeBackend = err.response?.data?.message;
      setMensaje(mensajeBackend || "No fue posible guardar los cambios.");
      setMensajeVariant("danger");
    } finally {
      setGuardando(false);
    }
  }, [
    formData,
    id,
    obtenerCamposObligatorios,
    setSubmitted,
    setErrors,
    huboCambios,
  ]);

  const finalizarPreCria = useCallback(async () => {
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
    setGuardando(true);
    try {
      const registro = await finalizarPrecria(
        id,
        new FinalizarPrecriaDTO(formData),
      );
      const mapeado = mapPrecriaAFormData(registro, null);
      const conLote = {
        ...mapeado,
        ...mapLoteAFormData({
          codigo_lote: formData.codigoLoteLarva,
          proveedor_id: formData.proveedorLarva,
          laboratorio: formData.laboratorioLarva,
          procedencia: formData.procedenciaLarva,
          certificado_larva: formData.certificadoLarva,
        }),
      };

      setSiembra(conLote);
      setFormData(conLote);
      setIsEditing(false);
      setSubmitted(false);
      setMensaje("Pre-Cría finalizada correctamente.");
      setMensajeVariant("success");
      return conLote;
    } catch (err) {
      const mensajeBackend = err.response?.data?.message;
      setMensaje(mensajeBackend || "No fue posible finalizar la Pre-Cría.");
      setMensajeVariant("danger");
      return null;
    } finally {
      setGuardando(false);
    }
  }, [formData, id, setSubmitted, setErrors]);

  const { totalDias, diaActual, progreso } = calcularProgresoCiclo(
    formData || {},
  );
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

  const handleFinalizarPreCria = useCallback(async () => {
    const registroFinalizado = await finalizarPreCria();
    if (!registroFinalizado) return;

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
    cargando,
    guardando,
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
    fieldHelpers: { hasError, requiredLabel },
  };
}
