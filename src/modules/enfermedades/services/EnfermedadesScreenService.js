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
    mensaje: "Rellene los datos requeridos.",
  };

  if (datos.finca === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.estanque === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (
    resultado.valido === true &&
    datos.enfermedadesSeleccionadas.length === 0
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.severidad === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.reporte.trim() === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && Number(datos.mortalidad) < 0) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  return resultado;
}

export function obtenerErroresFormularioEnfermedad(datos, submitted) {
  const errores = {
    finca: "",
    estanque: "",
    enfermedades: "",
    severidad: "",
    mortalidad: "",
    reporte: "",
  };

  if (submitted !== true) {
    return errores;
  }

  if (datos.finca === "") {
    errores.finca = "Este campo es obligatorio.";
  }

  if (datos.estanque === "") {
    errores.estanque = "Este campo es obligatorio.";
  }

  if (datos.enfermedadesSeleccionadas.length === 0) {
    errores.enfermedades = "Seleccione al menos una enfermedad.";
  }

  if (datos.severidad === "") {
    errores.severidad = "Este campo es obligatorio.";
  }

  if (datos.reporte.trim() === "") {
    errores.reporte = "Este campo es obligatorio.";
  }

  if (Number(datos.mortalidad) < 0) {
    errores.mortalidad = "La mortalidad no puede ser negativa.";
  }

  return errores;
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
