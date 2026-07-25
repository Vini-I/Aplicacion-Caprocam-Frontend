/**
 * ============================================================
 * SERVICE: REPORTERIA
 * ============================================================
 *
 * Centraliza la obtencion y normalizacion de registros para
 * reporteria.
 */

import enfermedadesService, {
  obtenerNombreEnfermedad,
  obtenerNombreSeveridad,
} from "../../enfermedades/services/EnfermedadesService";
import parasitologiaService, {
  obtenerNombreParasito,
} from "../../parasitologia/services/ParasitologiaService";
import { estanques } from "../../finca/screens/EstanqueData";

function obtenerTextoSeguro(valor, respaldo) {
  let texto = respaldo;

  if (valor !== undefined && valor !== null && valor !== "") {
    texto = String(valor);
  }

  return texto;
}

function coincideFiltro(valor, filtro) {
  let coincide = true;

  if (filtro !== null && filtro !== undefined && filtro !== "") {
    coincide = String(valor) === String(filtro);
  }

  return coincide;
}

function obtenerTextoEnfermedades(lista) {
  let texto = "No registrado";

  if (Array.isArray(lista) === true && lista.length > 0) {
    const nombres = [];

    lista.forEach(function (item) {
      nombres.push(obtenerNombreEnfermedad(item));
    });

    texto = nombres.join(", ");
  }

  return texto;
}

export function obtenerOpcionesFincasReporteria() {
  const nombres = [];
  const opciones = [{ label: "Todas las fincas", value: "" }];

  estanques.forEach(function (estanque) {
    if (nombres.includes(estanque.finca) === false) {
      nombres.push(estanque.finca);
      opciones.push({
        label: estanque.finca,
        value: estanque.finca,
      });
    }
  });

  return opciones;
}

export function obtenerOpcionesEstanquesReporteria(finca) {
  const opciones = [{ label: "Todos los estanques", value: "" }];

  estanques.forEach(function (estanque) {
    if (finca === "" || finca === null || finca === undefined) {
      opciones.push({
        label: estanque.codigo,
        value: estanque.codigo,
      });
    }

    if (finca !== "" && estanque.finca === finca) {
      opciones.push({
        label: estanque.codigo,
        value: estanque.codigo,
      });
    }
  });

  return opciones;
}

function normalizarEstanque(estanque) {
  return {
    id: `estanque-${estanque.codigo}`,
    tipo: "Estanque",
    titulo: estanque.codigo,
    finca: obtenerTextoSeguro(estanque.finca, "Sin finca"),
    estanque: obtenerTextoSeguro(estanque.codigo, "Sin estanque"),
    fecha: obtenerTextoSeguro(estanque.fechaSiembra, "Sin fecha"),
    detalle: `Estado: ${obtenerTextoSeguro(estanque.estado, "No registrado")} · Densidad: ${obtenerTextoSeguro(estanque.densidadSiembra, "0")} ind/m2`,
  };
}

function normalizarEnfermedad(registro) {
  return {
    id: `enfermedad-${registro.id}`,
    tipo: "Enfermedad",
    titulo: obtenerTextoEnfermedades(registro.enfermedades),
    finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
    estanque: obtenerTextoSeguro(registro.estanque, "Sin estanque"),
    fecha: obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
    detalle: `Severidad: ${obtenerNombreSeveridad(registro.severidad)} · Mortalidad: ${obtenerTextoSeguro(registro.mortalidad, "0")} U`,
  };
}

function normalizarParasitologia(registro) {
  return {
    id: `parasitologia-${registro.id}`,
    tipo: "Parasitologia",
    titulo: obtenerNombreParasito(registro.parasito),
    finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
    estanque: obtenerTextoSeguro(registro.estanque, "Sin estanque"),
    fecha: obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
    detalle: `Muestreados: ${obtenerTextoSeguro(registro.camaronesMuestreados, "0")} · Infectados: ${obtenerTextoSeguro(registro.camaronesInfectados, "0")} · Grado: ${obtenerTextoSeguro(registro.nombreGrado, registro.gradoInfeccion)}`,
  };
}

export async function obtenerDetalleRegistro({
  tipoRegistro,
  fincaId,
  estanqueId,
}) {
  let registros = [];

  if (tipoRegistro === "estanques") {
    estanques.forEach(function (estanque) {
      if (
        coincideFiltro(estanque.finca, fincaId) === true &&
        coincideFiltro(estanque.codigo, estanqueId) === true
      ) {
        registros.push(normalizarEstanque(estanque));
      }
    });
  }

  if (tipoRegistro === "enfermedades") {
    const enfermedades = await enfermedadesService.getAll();

    enfermedades.forEach(function (registro) {
      if (
        coincideFiltro(registro.fincaNombre, fincaId) === true &&
        coincideFiltro(registro.estanque, estanqueId) === true
      ) {
        registros.push(normalizarEnfermedad(registro));
      }
    });
  }

  if (tipoRegistro === "parasitologia") {
    const parasitos = await parasitologiaService.getAll();

    parasitos.forEach(function (registro) {
      if (
        coincideFiltro(registro.fincaNombre, fincaId) === true &&
        coincideFiltro(registro.estanque, estanqueId) === true
      ) {
        registros.push(normalizarParasitologia(registro));
      }
    });
  }

  return registros;
}
