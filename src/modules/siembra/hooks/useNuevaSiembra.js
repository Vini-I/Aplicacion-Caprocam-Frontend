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
 *   En este caso, se reutiliza el mismo Lote de Larva de la
 *   Pre-Cría de origen (formData.loteId) en vez de crear uno nuevo -
 *   crear uno nuevo con el mismo código de lote falla en el backend
 *   ("Ya existe un lote con ese codigo").
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
import { obtenerFechaHoy, formatearFechaDesdeISO } from "./dateUtils";
import {
  obtenerEstanquePorCodigo,
  obtenerEstanquesPorFinca,
  obtenerFincas,
} from "./fincaEstanqueLocal";

import {
  getPrecrias,
  getPrecriaById,
  createPrecria,
} from "../services/precria.service";
import { createSiembra } from "../services/siembra.service";
import { getLoteById, createLote } from "../services/lote.service";
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
import { LoteLarvaDTO, PrecriaDTO, SiembraDTO } from "../dtos/siembra.dto";

// El backend devuelve {id, nombre}; los Select del proyecto esperan
// {label, value} - este mapeo se repite igual en useDetalleSiembra.
function mapCatalogo(items) {
  return (items || []).map((item) => ({ label: item.nombre, value: item.id }));
}

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
  const [guardando, setGuardando] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const params = useLocalSearchParams();

  const {
    submitted,
    setSubmitted,
    errors,
    setErrors,
    hasError,
    requiredLabel,
  } = useFieldValidation();

  useEffect(() => {
    const formatted = obtenerFechaHoy();
    setFormData((prev) => ({
      ...prev,
      fechaSiembra: prev.fechaSiembra || formatted,
      fechaInicio: prev.fechaInicio || formatted,
      fechaSalidaPrecria: prev.fechaSalidaPrecria || formatted,
    }));
  }, []);

  const estanques = obtenerEstanquesPorFinca(formData.finca);
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

  // Catálogos de larva reales - se cargan del backend, ya no son
  // arrays en memoria.
  const [proveedoresLarva, setProveedoresLarva] = useState([]);
  const [laboratoriosLarva, setLaboratoriosLarva] = useState([]);
  const [procedenciasLarva, setProcedenciasLarva] = useState([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        setCargandoCatalogos(true);
        const [proveedores, laboratorios, procedencias] = await Promise.all([
          getProveedoresLarva(),
          getLaboratorios(),
          getProcedencias(),
        ]);
        setProveedoresLarva(mapCatalogo(proveedores));
        setLaboratoriosLarva(mapCatalogo(laboratorios));
        setProcedenciasLarva(mapCatalogo(procedencias));
      } catch (err) {
        setMensaje("No fue posible cargar los catálogos de larva.");
        setMensajeVariant("danger");
      } finally {
        setCargandoCatalogos(false);
      }
    }
    cargarCatalogos();
  }, []);

  const vinoAutomaticoDePrecria = Boolean(params.provieneDePrecriaId);
  const [origenSiembra, setOrigenSiembra] = useState("directa");

  // Pre-crías finalizadas disponibles para armar una Siembra a
  // partir de ellas.
  const [preCriasDisponibles, setPreCriasDisponibles] = useState([]);

  useEffect(() => {
    async function cargarPrecriasDisponibles() {
      try {
        const precrias = await getPrecrias();
        setPreCriasDisponibles(
          precrias
            .filter((p) => p.estado === "Finalizada")
            .map((p) => ({ label: `Pre-Cría #${p.id}`, value: String(p.id) })),
        );
      } catch (err) {
        // No bloquea el formulario si esto falla - la siembra directa
        // sigue funcionando igual.
      }
    }
    cargarPrecriasDisponibles();
  }, []);

  useEffect(() => {
    if (!params.provieneDePrecriaId) return;
    handleSeleccionarPreCria(params.provieneDePrecriaId);
  }, [params.provieneDePrecriaId]);

  function handleChange(field, value) {
    setFormData((previousData) => {
      const updatedData = { ...previousData, [field]: value };
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
      const updatedData = { ...previousData, estanque: value };
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

  async function handleSeleccionarPreCria(precriaId) {
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

    try {
      const precria = await getPrecriaById(precriaId);
      if (!precria) return;

      const lote = precria.lote_larva_id
        ? await getLoteById(precria.lote_larva_id)
        : null;

      setFormData((previo) => {
        const densidad = previo.densidadPoblacional || "8";
        const area = previo.areaHectareas || "";
        const actualizado = {
          ...previo,
          finca: precria.finca_id || previo.finca,
          estanque: precria.estanque_id || previo.estanque,
          cantidadSobrevivientePrecria: precria.cantidad_final || "",
          duracionPrecria: precria.duracion_dias || "",
          fechaSalidaPrecria: formatearFechaDesdeISO(precria.fecha_fin),
          pasoPorPrecria: "si",
          precriaId: String(precriaId),
          densidadPoblacional: densidad,
          areaHectareas: area,
          cantidadSembrada: calcularCantidadSembrada(area, densidad),
          loteId: precria.lote_larva_id,
          codigoLoteLarva: lote?.codigo_lote || "",
          proveedorLarva: lote?.proveedor_larva_id || "",
          laboratorioLarva: lote?.laboratorio_id || "",
          procedenciaLarva: lote?.procedencia_id || "",
          certificadoLarva: lote?.certificado_larva || "",
          plSiembra: precria.pl_final != null ? `PL${precria.pl_final}` : "",
        };
        return actualizado;
      });
    } catch (err) {
      setMensaje("No fue posible cargar la Pre-Cría seleccionada.");
      setMensajeVariant("danger");
    }
  }

  function handleCambiarOrigenSiembra(nuevoOrigen) {
    setOrigenSiembra(nuevoOrigen);
    if (nuevoOrigen === "directa") {
      handleSeleccionarPreCria("");
    }
  }

  async function handleAgregarProveedorLarva(nombre) {
    const nuevo = await createProveedorLarva(nombre);
    setProveedoresLarva((previo) => [
      ...previo,
      { label: nuevo.nombre, value: nuevo.id },
    ]);
    handleChange("proveedorLarva", nuevo.id);
  }

  async function handleAgregarLaboratorioLarva(nombre) {
    const nuevo = await createLaboratorio(nombre);
    setLaboratoriosLarva((previo) => [
      ...previo,
      { label: nuevo.nombre, value: nuevo.id },
    ]);
    handleChange("laboratorioLarva", nuevo.id);
  }

  async function handleAgregarProcedenciaLarva(nombre) {
    const nuevo = await createProcedencia(nombre);
    setProcedenciasLarva((previo) => [
      ...previo,
      { label: nuevo.nombre, value: nuevo.id },
    ]);
    handleChange("procedenciaLarva", nuevo.id);
  }

  async function handleEditarProveedorLarva(value, nombre) {
    const actualizado = await updateProveedorLarva(value, nombre);
    setProveedoresLarva((previo) =>
      previo.map((item) =>
        item.value === value
          ? { label: actualizado.nombre, value: actualizado.id }
          : item,
      ),
    );
  }

  async function handleEditarLaboratorioLarva(value, nombre) {
    const actualizado = await updateLaboratorio(value, nombre);
    setLaboratoriosLarva((previo) =>
      previo.map((item) =>
        item.value === value
          ? { label: actualizado.nombre, value: actualizado.id }
          : item,
      ),
    );
  }

  async function handleEditarProcedenciaLarva(value, nombre) {
    const actualizado = await updateProcedencia(value, nombre);
    setProcedenciasLarva((previo) =>
      previo.map((item) =>
        item.value === value
          ? { label: actualizado.nombre, value: actualizado.id }
          : item,
      ),
    );
  }

  async function handleEliminarProveedorLarva(value) {
    await eliminarProveedorLarva(value);
    setProveedoresLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo.proveedorLarva === value
        ? { ...previo, proveedorLarva: "" }
        : previo,
    );
  }

  async function handleEliminarLaboratorioLarva(value) {
    await eliminarLaboratorio(value);
    setLaboratoriosLarva((previo) =>
      previo.filter((item) => item.value !== value),
    );
    setFormData((previo) =>
      previo.laboratorioLarva === value
        ? { ...previo, laboratorioLarva: "" }
        : previo,
    );
  }

  async function handleEliminarProcedenciaLarva(value) {
    await eliminarProcedencia(value);
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
    if (!formData.tipoRegistro) return ["tipoRegistro"];
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

  async function handleCrearSiembra() {
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

    setGuardando(true);
    try {
      let loteId;
      if (formData.pasoPorPrecria === "si" && formData.loteId) {
        loteId = formData.loteId;
      } else {
        const lote = await createLote(new LoteLarvaDTO(formData));
        loteId = lote.id;
      }

      if (formData.tipoRegistro === "precria") {
        await createPrecria(new PrecriaDTO(formData, loteId));
      } else {
        await createSiembra(new SiembraDTO(formData, loteId));
      }

      setMensaje(
        formData.tipoRegistro === "precria"
          ? "Pre-Cría registrada correctamente."
          : "Siembra registrada correctamente.",
      );
      setMensajeVariant("success");
      setSubmitted(false);
    } catch (err) {
      const mensajeBackend = err.response?.data?.message;
      setMensaje(mensajeBackend || "No fue posible registrar el ciclo.");
      setMensajeVariant("danger");
    } finally {
      setGuardando(false);
    }
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
    cargandoCatalogos,
    guardando,
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
    fieldHelpers: { hasError, requiredLabel },
  };
}
