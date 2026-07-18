/**
 * ============================================================
 * SERVICE: ENFERMEDADES SCREEN
 * ============================================================
 *
 * Funciones auxiliares del formulario de enfermedades.
 * Mantiene opciones, validaciones y mapeos fuera del screen.
 */

import { FINCAS, ESTANQUES } from "../../registro/screens/RegistroData";
import { obtenerNombreEnfermedad } from "./EnfermedadesService";

export function obtenerOpcionesFincas() {
  const opciones = [];

  FINCAS.forEach(function (finca) {
    opciones.push({
      label: finca.nombre,
      value: finca.id,
    });
  });

  return opciones;
}

export function obtenerOpcionesEstanques(fincaId) {
  let opciones = [];

  if (fincaId !== "") {
    const estanquesFinca = ESTANQUES[fincaId];

    if (estanquesFinca !== undefined) {
      estanquesFinca.forEach(function (estanque) {
        opciones.push({
          label: `${estanque.id} - ${estanque.especie}`,
          value: estanque.id,
        });
      });
    }
  }

  return opciones;
}

export function obtenerNombreFinca(fincaId) {
  let nombre = "";

  FINCAS.forEach(function (finca) {
    if (finca.id === fincaId) {
      nombre = finca.nombre;
    }
  });

  return nombre;
}

export function obtenerTextoEnfermedades(enfermedades) {
  let texto = "";

  enfermedades.forEach(function (item, index) {
    const nombre = obtenerNombreEnfermedad(item);

    if (index === 0) {
      texto = nombre;
    }

    if (index > 0) {
      texto = `${texto}, ${nombre}`;
    }
  });

  return texto;
}

export function actualizarSeleccionEnfermedad(valor, seleccionadas) {
  let nuevasEnfermedades = [];
  let yaExiste = false;

  seleccionadas.forEach(function (item) {
    if (item === valor) {
      yaExiste = true;
    }
  });

  if (yaExiste === true) {
    seleccionadas.forEach(function (item) {
      if (item !== valor) {
        nuevasEnfermedades.push(item);
      }
    });
  }

  if (yaExiste === false) {
    seleccionadas.forEach(function (item) {
      nuevasEnfermedades.push(item);
    });

    nuevasEnfermedades.push(valor);
  }

  return nuevasEnfermedades;
}

export function validarFormularioEnfermedad(datos) {
  let resultado = {
    valido: true,
    tipoMensaje: "info",
    mensaje: "",
  };

  if (datos.finca === "") {
    resultado = {
      valido: false,
      tipoMensaje: "warning",
      mensaje: "Debe seleccionar una finca.",
    };
  }

  if (resultado.valido === true && datos.estanque === "") {
    resultado = {
      valido: false,
      tipoMensaje: "warning",
      mensaje: "Debe seleccionar un estanque.",
    };
  }

  if (
    resultado.valido === true &&
    datos.enfermedadesSeleccionadas.length === 0
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "warning",
      mensaje: "Debe seleccionar al menos una enfermedad.",
    };
  }

  if (resultado.valido === true && datos.severidad === "") {
    resultado = {
      valido: false,
      tipoMensaje: "warning",
      mensaje: "Debe seleccionar la severidad del caso.",
    };
  }

  if (resultado.valido === true && datos.reporte.trim() === "") {
    resultado = {
      valido: false,
      tipoMensaje: "warning",
      mensaje: "Debe escribir un reporte del caso.",
    };
  }

  if (resultado.valido === true && Number(datos.mortalidad) < 0) {
    resultado = {
      valido: false,
      tipoMensaje: "warning",
      mensaje: "La mortalidad no puede ser negativa.",
    };
  }

  return resultado;
}

export function construirCasoEnfermedad(datos) {
  return {
    finca: datos.finca,
    fincaNombre: obtenerNombreFinca(datos.finca),
    estanque: datos.estanque,
    fechaReporte: datos.fechaReporte,
    responsable: datos.responsable,
    enfermedades: datos.enfermedadesSeleccionadas,
    severidad: datos.severidad,
    mortalidad: datos.mortalidad,
    reporte: datos.reporte.trim(),
  };
}
