/**
 * ============================================================
 * SERVICE: PARASITOLOGIA
 * ============================================================
 *
 * Servicio centralizado del modulo Parasitologia.
 *
 * Funcionalidad:
 * - Guarda registros de parasitos en AsyncStorage.
 * - Calcula el porcentaje de infeccion.
 * - Calcula el grado de infeccion.
 * - Genera resumen para dashboard.
 *
 * Importante:
 * - Este modulo no trabaja con si/no.
 * - Se mide por camarones muestreados e infectados.
 * - Cuando entreguen la guia oficial, solo se modifican los rangos de GUIA_GRADOS_INFECCION.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const CLAVE_PARASITOLOGIA = "caprocam_parasitologia_v1";

export const PARASITOS_CATALOGO = [
  {
    label: "Gregarinas",
    value: "gregarinas",
  },
  {
    label: "Epicomensales",
    value: "epicomensales",
  },
  {
    label: "Microsporidios",
    value: "microsporidios",
  },
  {
    label: "Otros parasitos",
    value: "otros",
  },
];

export const GUIA_GRADOS_INFECCION = [
  {
    grado: 0,
    nombre: "Grado 0",
    minimo: 0,
    maximo: 0,
    descripcion: "Sin camarones infectados.",
  },
  {
    grado: 1,
    nombre: "Grado 1",
    minimo: 1,
    maximo: 25,
    descripcion: "Infeccion baja.",
  },
  {
    grado: 2,
    nombre: "Grado 2",
    minimo: 26,
    maximo: 50,
    descripcion: "Infeccion moderada.",
  },
  {
    grado: 3,
    nombre: "Grado 3",
    minimo: 51,
    maximo: 75,
    descripcion: "Infeccion alta.",
  },
  {
    grado: 4,
    nombre: "Grado 4",
    minimo: 76,
    maximo: 100,
    descripcion: "Infeccion severa.",
  },
];

export function obtenerNombreParasito(valor) {
  let nombre = valor;

  PARASITOS_CATALOGO.forEach(function (item) {
    if (item.value === valor) {
      nombre = item.label;
    }
  });

  return nombre;
}

export function obtenerNombreGrado(grado) {
  let nombre = "Grado 0";

  GUIA_GRADOS_INFECCION.forEach(function (item) {
    if (Number(item.grado) === Number(grado)) {
      nombre = item.nombre;
    }
  });

  return nombre;
}

export function calcularGradoInfeccion(
  camaronesMuestreados,
  camaronesInfectados,
) {
  let muestreados = Number(camaronesMuestreados);
  let infectados = Number(camaronesInfectados);

  if (Number.isNaN(muestreados) === true) {
    muestreados = 0;
  }

  if (Number.isNaN(infectados) === true) {
    infectados = 0;
  }

  if (muestreados <= 0) {
    return {
      grado: 0,
      nombre: "Grado 0",
      porcentaje: 0,
      descripcion: "Sin muestra valida.",
    };
  }

  if (infectados < 0) {
    infectados = 0;
  }

  if (infectados > muestreados) {
    infectados = muestreados;
  }

  const porcentaje = (infectados / muestreados) * 100;

  let resultado = GUIA_GRADOS_INFECCION[0];

  GUIA_GRADOS_INFECCION.forEach(function (item) {
    if (porcentaje >= item.minimo && porcentaje <= item.maximo) {
      resultado = item;
    }
  });

  return {
    grado: resultado.grado,
    nombre: resultado.nombre,
    porcentaje: Number(porcentaje.toFixed(2)),
    descripcion: resultado.descripcion,
  };
}

export function construirResumenParasitologia(registros) {
  const resumen = {
    totalRegistros: registros.length,
    totalMuestreados: 0,
    totalInfectados: 0,
    porcentajePromedio: 0,
    gradoPromedio: 0,
    parasitosFrecuentes: [],
    gradosFrecuentes: [],
  };

  const contadorParasitos = {};
  const contadorGrados = {};
  let sumaPorcentajes = 0;
  let sumaGrados = 0;

  registros.forEach(function (registro) {
    const muestreados = Number(registro.camaronesMuestreados);
    const infectados = Number(registro.camaronesInfectados);
    const porcentaje = Number(registro.porcentajeInfeccion);
    const grado = Number(registro.gradoInfeccion);

    if (Number.isNaN(muestreados) === false) {
      resumen.totalMuestreados = resumen.totalMuestreados + muestreados;
    }

    if (Number.isNaN(infectados) === false) {
      resumen.totalInfectados = resumen.totalInfectados + infectados;
    }

    if (Number.isNaN(porcentaje) === false) {
      sumaPorcentajes = sumaPorcentajes + porcentaje;
    }

    if (Number.isNaN(grado) === false) {
      sumaGrados = sumaGrados + grado;
    }

    if (contadorParasitos[registro.parasito] === undefined) {
      contadorParasitos[registro.parasito] = 0;
    }

    contadorParasitos[registro.parasito] =
      contadorParasitos[registro.parasito] + 1;

    if (contadorGrados[registro.gradoInfeccion] === undefined) {
      contadorGrados[registro.gradoInfeccion] = 0;
    }

    contadorGrados[registro.gradoInfeccion] =
      contadorGrados[registro.gradoInfeccion] + 1;
  });

  if (registros.length > 0) {
    resumen.porcentajePromedio = Number(
      (sumaPorcentajes / registros.length).toFixed(2),
    );

    resumen.gradoPromedio = Number((sumaGrados / registros.length).toFixed(2));
  }

  Object.keys(contadorParasitos).forEach(function (clave) {
    resumen.parasitosFrecuentes.push({
      parasito: clave,
      nombre: obtenerNombreParasito(clave),
      casos: contadorParasitos[clave],
    });
  });

  Object.keys(contadorGrados).forEach(function (clave) {
    resumen.gradosFrecuentes.push({
      grado: clave,
      nombre: obtenerNombreGrado(clave),
      casos: contadorGrados[clave],
    });
  });

  resumen.parasitosFrecuentes.sort(function (a, b) {
    return b.casos - a.casos;
  });

  resumen.gradosFrecuentes.sort(function (a, b) {
    return b.casos - a.casos;
  });

  return resumen;
}

const parasitologiaService = {
  getAll: async function () {
    try {
      const datos = await AsyncStorage.getItem(CLAVE_PARASITOLOGIA);
      let lista = [];

      if (datos !== null) {
        lista = JSON.parse(datos);
      }

      return lista;
    } catch {
      return [];
    }
  },

  saveAll: async function (registros) {
    await AsyncStorage.setItem(CLAVE_PARASITOLOGIA, JSON.stringify(registros));
  },

  create: async function (registro) {
    const lista = await parasitologiaService.getAll();

    const grado = calcularGradoInfeccion(
      registro.camaronesMuestreados,
      registro.camaronesInfectados,
    );

    const nuevoRegistro = {
      id: Date.now().toString(),
      tipoRegistro: "parasitologia",
      finca: registro.finca,
      fincaNombre: registro.fincaNombre,
      estanque: registro.estanque,
      fechaReporte: registro.fechaReporte,
      responsable: registro.responsable,
      parasito: registro.parasito,
      parasitoNombre: obtenerNombreParasito(registro.parasito),
      camaronesMuestreados: Number(registro.camaronesMuestreados),
      camaronesInfectados: Number(registro.camaronesInfectados),
      porcentajeInfeccion: grado.porcentaje,
      gradoInfeccion: grado.grado,
      nombreGrado: grado.nombre,
      descripcionGrado: grado.descripcion,
      observaciones: registro.observaciones,
      timestamp: new Date().toISOString(),
    };

    lista.push(nuevoRegistro);

    await parasitologiaService.saveAll(lista);

    return nuevoRegistro;
  },

  deleteById: async function (id) {
    const lista = await parasitologiaService.getAll();
    const nuevaLista = [];

    lista.forEach(function (registro) {
      if (registro.id !== id) {
        nuevaLista.push(registro);
      }
    });

    await parasitologiaService.saveAll(nuevaLista);

    return nuevaLista;
  },

  clearAll: async function () {
    await AsyncStorage.removeItem(CLAVE_PARASITOLOGIA);
  },

  getResumenDashboard: async function () {
    const registros = await parasitologiaService.getAll();
    const resumen = construirResumenParasitologia(registros);

    return resumen;
  },
};

export default parasitologiaService;
