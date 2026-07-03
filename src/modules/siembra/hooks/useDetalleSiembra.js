import { useEffect, useMemo, useState } from "react";
import { obtenerSiembraPorId } from "../services/SiembraService";

function calcularCantidadSembrada(areaHectareas, densidadPoblacional) {
  const area = Number(areaHectareas);
  const densidad = Number(densidadPoblacional);

  if (!area || !densidad) {
    return "";
  }

  return String(Math.round(area * 10000 * densidad));
}

function calcularEtapa(dia, diasTotales) {
  if (dia > 60) return 3;
  if (dia > 30) return 2;
  return 1;
}

function construirFormData(siembra) {
  if (!siembra) return null;

  return {
    fechaSiembra: siembra.fechaSiembra ?? "",
    horaIngreso: siembra.horaIngreso ?? "",
    finca: siembra.finca ?? "",
    fincaId: siembra.fincaId ?? "",
    estanque: siembra.estanque ?? "",
    tecnicaCultivo: siembra.tecnicaCultivo ?? "",
    diasCultivo: String(siembra.diasCultivo ?? "0"),
    diasMaduracion: String(siembra.diasMaduracion ?? "90"),

    proveedorLarva: siembra.proveedorLarva ?? "",
    laboratorioLarva: siembra.laboratorioLarva ?? "",
    procedenciaLarva: siembra.procedenciaLarva ?? "",
    codigoLoteLarva: siembra.codigoLoteLarva ?? "",
    plLarva: siembra.plLarva ?? "",
    certificadoLarva: siembra.certificadoLarva ?? "",

    pasoPorPrecria: siembra.pasoPorPrecria ?? "no",
    duracionPrecria: siembra.duracionPrecria ?? "",
    fechaSalidaPrecria: siembra.fechaSalidaPrecria ?? "",
    cantidadSobrevivientePrecria:
      siembra.cantidadSobrevivientePrecria ?? "",

    areaHectareas: String(siembra.areaHectareas ?? ""),
    densidadPoblacional: String(siembra.densidadPoblacional ?? ""),
    cantidadSembrada: String(siembra.cantidadSembrada ?? ""),
  };
}

export default function useDetalleSiembra(siembraId) {
  const siembra = useMemo(
    () => obtenerSiembraPorId(Number(siembraId)),
    [siembraId],
  );

  const [formData, setFormData] = useState(() => construirFormData(siembra));
  const [valoresGuardados, setValoresGuardados] = useState(() =>
    construirFormData(siembra),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");

  useEffect(() => {
    const datosIniciales = construirFormData(siembra);

    setFormData(datosIniciales);
    setValoresGuardados(datosIniciales);
    setIsEditing(false);
    setMensaje("");
  }, [siembra]);

  function handleChange(field, value) {
    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        [field]: value,
      };

      if (field === "densidadPoblacional" || field === "areaHectareas") {
        updatedData.cantidadSembrada = calcularCantidadSembrada(
          updatedData.areaHectareas,
          updatedData.densidadPoblacional,
        );
      }

      if (field === "pasoPorPrecria" && value === "no") {
        updatedData.duracionPrecria = "";
        updatedData.fechaSalidaPrecria = "";
        updatedData.cantidadSobrevivientePrecria = "";
      }

      return updatedData;
    });
  }

  function validarCamposObligatorios() {
    const camposObligatorios = [
      "fechaSiembra",
      "horaIngreso",
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

    if (formData.pasoPorPrecria === "si") {
      camposObligatorios.push("duracionPrecria", "fechaSalidaPrecria");
    }

    return camposObligatorios.every(
      (campo) => String(formData[campo]).trim() !== "",
    );
  }

  function iniciarEdicion() {
    setMensaje("");
    setIsEditing(true);
  }

  function cancelarEdicion() {
    setFormData(valoresGuardados);
    setMensaje("");
    setIsEditing(false);
  }

  function guardar() {
    if (!validarCamposObligatorios()) {
      setMensaje("Debe completar todos los campos obligatorios.");
      setMensajeVariant("danger");
      return;
    }

    setValoresGuardados(formData);
    setMensaje("Siembra guardada correctamente.");
    setMensajeVariant("success");
    setIsEditing(false);

    console.log("Detalle de siembra actualizado:", formData);
  }

  const diaActual = Number(formData?.diasCultivo ?? 0);
  const totalDias = Number(formData?.diasMaduracion ?? 90);
  const etapa = calcularEtapa(diaActual, totalDias);
  const progreso = Math.round((diaActual / totalDias) * 100);

  return {
    siembra,
    formData,
    isEditing,
    mensaje,
    mensajeVariant,
    diaActual,
    totalDias,
    etapa,
    progreso,
    handleChange,
    iniciarEdicion,
    cancelarEdicion,
    guardar,
  };
}