import { useState } from "react";

function getTodayTextDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

function calcularCantidadSembrada(areaHectareas, densidadPoblacional) {
  const area = Number(areaHectareas);
  const densidad = Number(densidadPoblacional);

  if (!area || !densidad) {
    return "";
  }

  return String(Math.round(area * 10000 * densidad));
}

const initialFormData = {
  fechaSiembra: getTodayTextDate(),
  horaIngreso: "",
  finca: "",
  estanque: "",
  tecnicaCultivo: "",
  diasMaduracion: "90",

  proveedorLarva: "",
  laboratorioLarva: "",
  procedenciaLarva: "",
  codigoLoteLarva: "",
  plLarva: "",
  certificadoLarva: "",

  pasoPorPrecria: "no",
  duracionPrecria: "15",
  fechaSalidaPrecria: "",
  cantidadSobrevivientePrecria: "",

  areaHectareas: "",
  densidadPoblacional: "8",
  cantidadSembrada: "",
};

export default function useNuevaSiembra() {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  function handleChange(field, value) {
    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        [field]: value,
      };

      const debeRecalcular =
        field === "areaHectareas" || field === "densidadPoblacional";

      if (debeRecalcular) {
        updatedData.cantidadSembrada = calcularCantidadSembrada(
          updatedData.areaHectareas,
          updatedData.densidadPoblacional,
        );
      }

      return updatedData;
    });
  }

  function validarCamposObligatorios() {
    const camposObligatorios = [
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

    if (formData.pasoPorPrecria === "si") {
      camposObligatorios.push("duracionPrecria", "fechaSalidaPrecria");
    }

    return camposObligatorios.every(
      (campo) => String(formData[campo]).trim() !== "",
    );
  }

  function handleCrearSiembra() {
    const formularioValido = validarCamposObligatorios();

    if (!formularioValido) {
      setModalVisible(true);
      return;
    }

    console.log("Siembra registrada:", formData);
  }

  return {
    formData,
    modalVisible,
    setModalVisible,
    handleChange,
    handleCrearSiembra,
  };
}