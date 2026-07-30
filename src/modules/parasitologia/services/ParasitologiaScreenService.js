/**
 * ============================================================
 * SERVICE: PARASITOLOGIA SCREEN
 * ============================================================
 *
 * Funciones auxiliares del formulario de Parasitologia.
 *
 * No utiliza mocks ni almacenamiento local.
 */

import { COLORS } from "../../../theme/colors";

function obtenerTexto(valor) {
  if (
    valor === undefined ||
    valor === null
  ) {
    return "";
  }

  return String(valor).trim();
}

function obtenerNombreFinca(finca) {
  let nombre =
    "Finca sin nombre";

  if (
    finca.nombreFinca !== undefined &&
    finca.nombreFinca !== null &&
    obtenerTexto(finca.nombreFinca) !== ""
  ) {
    nombre = obtenerTexto(
      finca.nombreFinca,
    );
  }

  if (
    nombre === "Finca sin nombre" &&
    finca.nombre !== undefined &&
    finca.nombre !== null &&
    obtenerTexto(finca.nombre) !== ""
  ) {
    nombre = obtenerTexto(
      finca.nombre,
    );
  }

  return nombre;
}

export function obtenerOpcionesFincas(
  fincas,
) {
  const opciones = [];

  if (Array.isArray(fincas) === false) {
    return opciones;
  }

  for (
    let i = 0;
    i < fincas.length;
    i++
  ) {
    const finca = fincas[i];

    opciones.push({
      label:
        obtenerNombreFinca(finca),
      value:
        String(finca.id),
    });
  }

  return opciones;
}

export function obtenerOpcionesEstanques(
  estanques,
  fincaId,
) {
  const opciones = [];

  if (
    Array.isArray(estanques) === false ||
    fincaId === ""
  ) {
    return opciones;
  }

  for (
    let i = 0;
    i < estanques.length;
    i++
  ) {
    const estanque = estanques[i];

    if (
      Number(estanque.idFinca) ===
      Number(fincaId)
    ) {
      let etiqueta =
        obtenerTexto(
          estanque.codigo,
        );

      if (etiqueta === "") {
        etiqueta =
          "Estanque " +
          String(estanque.id);
      }

      const especie =
        obtenerTexto(
          estanque.especie,
        );

      if (especie !== "") {
        etiqueta =
          etiqueta +
          " - " +
          especie;
      }

      opciones.push({
        label: etiqueta,
        value: String(
          estanque.id,
        ),
      });
    }
  }

  return opciones;
}

export function obtenerColorGrado(
  grado,
) {
  let color = COLORS.success;

  const texto = String(
    grado || "",
  ).trim().toLowerCase();

  if (texto === "medio") {
    color = COLORS.warning;
  }

  if (texto === "alto") {
    color = COLORS.error;
  }

  return color;
}

export function validarFormularioParasitologia(
  datos,
) {
  let resultado = {
    valido: true,
    tipoMensaje: "info",
    mensaje:
      "Rellene los datos requeridos.",
  };

  if (datos.finca === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje:
        "Rellene los datos requeridos.",
    };
  }

  if (
    resultado.valido === true &&
    datos.estanque === ""
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje:
        "Rellene los datos requeridos.",
    };
  }

  if (
    resultado.valido === true &&
    datos.fechaReporte === ""
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje:
        "Rellene los datos requeridos.",
    };
  }

  if (
    resultado.valido === true &&
    datos.parasito === ""
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje:
        "Rellene los datos requeridos.",
    };
  }

  if (
    resultado.valido === true &&
    Number(
      datos.camaronesMuestreados,
    ) <= 0
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje:
        "Los camarones muestreados deben ser mayores que cero.",
    };
  }

  if (
    resultado.valido === true &&
    Number(
      datos.camaronesInfectados,
    ) < 0
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje:
        "Los camarones infectados no pueden ser negativos.",
    };
  }

  if (
    resultado.valido === true &&
    Number(
      datos.camaronesInfectados,
    ) >
    Number(
      datos.camaronesMuestreados,
    )
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje:
        "Los camarones infectados no pueden superar los muestreados.",
    };
  }

  return resultado;
}

export function obtenerErroresFormularioParasitologia(
  datos,
  submitted,
) {
  const errores = {
    finca: "",
    estanque: "",
    fechaReporte: "",
    parasito: "",
    camaronesMuestreados: "",
    camaronesInfectados: "",
  };

  if (submitted !== true) {
    return errores;
  }

  if (datos.finca === "") {
    errores.finca =
      "Este campo es obligatorio.";
  }

  if (datos.estanque === "") {
    errores.estanque =
      "Este campo es obligatorio.";
  }

  if (datos.fechaReporte === "") {
    errores.fechaReporte =
      "Este campo es obligatorio.";
  }

  if (datos.parasito === "") {
    errores.parasito =
      "Este campo es obligatorio.";
  }

  if (
    Number(
      datos.camaronesMuestreados,
    ) <= 0
  ) {
    errores.camaronesMuestreados =
      "Debe ser mayor que cero.";
  }

  if (
    Number(
      datos.camaronesInfectados,
    ) < 0
  ) {
    errores.camaronesInfectados =
      "No puede ser negativo.";
  }

  if (
    Number(
      datos.camaronesInfectados,
    ) >
    Number(
      datos.camaronesMuestreados,
    )
  ) {
    errores.camaronesInfectados =
      "No puede ser mayor que los muestreados.";
  }

  return errores;
}

function normalizarFechaBackend(
  fecha,
) {
  const texto = obtenerTexto(fecha);

  if (texto === "") {
    return "";
  }

  if (texto.includes("/")) {
    const partes =
      texto.split("/");

    if (partes.length === 3) {
      const dia =
        partes[0].padStart(2, "0");

      const mes =
        partes[1].padStart(2, "0");

      const anio =
        partes[2];

      return (
        anio +
        "-" +
        mes +
        "-" +
        dia
      );
    }
  }

  return texto.slice(0, 10);
}

export function construirRegistroParasitologia(
  datos,
) {
  let observaciones = null;

  if (
    datos.observaciones !== undefined &&
    datos.observaciones !== null &&
    String(
      datos.observaciones,
    ).trim() !== ""
  ) {
    observaciones = String(
      datos.observaciones,
    ).trim();
  }

  return {
    fincaId: Number(
      datos.finca,
    ),

    estanqueId: Number(
      datos.estanque,
    ),

    fechaReporte:
      normalizarFechaBackend(
        datos.fechaReporte,
      ),

    parasito: String(
      datos.parasito,
    ).trim(),

    camaronesMuestreados: Number(
      datos.camaronesMuestreados,
    ),

    camaronesInfectados: Number(
      datos.camaronesInfectados,
    ),

    observaciones: observaciones,
  };
}