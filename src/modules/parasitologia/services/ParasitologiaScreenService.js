/**
 * ============================================================
 * SERVICE: PARASITOLOGIA SCREEN
 * ============================================================
 *
 * Funciones auxiliares del formulario de Parasitologia.
 * Mantiene opciones, validaciones, mapeos y colores fuera del screen.
 */

import { COLORS } from "../../../theme/colors";
import { FINCAS, ESTANQUES } from "../../registro/screens/RegistroData";

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

export function obtenerColorGrado(grado) {
  let color = COLORS.success;

  if (Number(grado) === 2) {
    color = COLORS.warning;
  }

  if (Number(grado) === 3) {
    color = COLORS.error;
  }

  if (Number(grado) === 4) {
    color = COLORS.error;
  }

  return color;
}

export function validarFormularioParasitologia(datos) {
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

  if (resultado.valido === true && datos.fechaReporte === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.parasito === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && Number(datos.camaronesMuestreados) <= 0) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && Number(datos.camaronesInfectados) < 0) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (
    resultado.valido === true &&
    Number(datos.camaronesInfectados) > Number(datos.camaronesMuestreados)
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  return resultado;
}

export function construirRegistroParasitologia(datos) {
  return {
    finca: datos.finca,
    fincaNombre: obtenerNombreFinca(datos.finca),
    estanque: datos.estanque,
    fechaReporte: datos.fechaReporte,
    responsable: datos.responsable,
    parasito: datos.parasito,
    camaronesMuestreados: datos.camaronesMuestreados,
    camaronesInfectados: datos.camaronesInfectados,
    observaciones: datos.observaciones.trim(),
  };
}
