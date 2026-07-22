/**
 * ============================================================
 * SERVICE: ENFERMEDADES
 * ============================================================
 *
 * Servicio centralizado del modulo Enfermedades.
 *
 * Funcionalidad:
 * - Guarda enfermedades en AsyncStorage.
 * - Obtiene registros guardados.
 * - Elimina registros por id.
 * - Genera resumen para dashboard.
 *
 * Importante:
 * - Este modulo NO maneja parasitos.
 * - Gregarinas, epicomensales y parasitos van en Parasitologia.
 * - NHP se mantiene aqui porque es enfermedad bacteriana asociada a Hepatobacter penaei.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { colaboradorService } from "../../colaboradores/services/colaborador.service";
import { colaboradoresService } from "../../colaboradores/services/colaboradoresService";

const CLAVE_ENFERMEDADES = "caprocam_enfermedades_v1";

export const ENFERMEDADES_CATALOGO = [
  {
    label: "WSSV - Mancha Blanca",
    value: "wssv",
    tipo: "viral",
  },
  {
    label: "AHPND - Necrosis hepatopancreatica aguda",
    value: "ahpnd",
    tipo: "bacteriana",
  },
  {
    label: "Vibriosis",
    value: "vibriosis",
    tipo: "bacteriana",
  },
  {
    label: "IHHNV",
    value: "ihhnv",
    tipo: "viral",
  },
  {
    label: "NHP - Hepatobacter penaei",
    value: "nhp",
    tipo: "bacteriana",
  },
  {
    label: "Otro",
    value: "otro",
    tipo: "otro",
  },
];

export const SEVERIDADES_ENFERMEDAD = [
  {
    label: "Baja",
    value: "baja",
  },
  {
    label: "Media",
    value: "media",
  },
  {
    label: "Alta",
    value: "alta",
  },
  {
    label: "Critica",
    value: "critica",
  },
];

export function obtenerNombreEnfermedad(valor) {
  let nombre = valor;

  ENFERMEDADES_CATALOGO.forEach(function (item) {
    if (item.value === valor) {
      nombre = item.label;
    }
  });

  return nombre;
}

export function obtenerNombreSeveridad(valor) {
  let nombre = valor;

  SEVERIDADES_ENFERMEDAD.forEach(function (item) {
    if (item.value === valor) {
      nombre = item.label;
    }
  });

  return nombre;
}

export async function obtenerResponsableBackend() {
  let responsable = "Responsable no disponible";

  try {
    const colaboradores = await colaboradorService.getColaboradores();

    if (Array.isArray(colaboradores) === true && colaboradores.length > 0) {
      responsable = colaboradores[0].nombre;
    }
  } catch {
    try {
      const colaboradoresMock = await colaboradoresService.getColaboradores({
        activo: true,
      });

      if (
        Array.isArray(colaboradoresMock) === true &&
        colaboradoresMock.length > 0
      ) {
        responsable = colaboradoresMock[0].nombre;
      }
    } catch {
      responsable = "Responsable no disponible";
    }
  }

  return responsable;
}

function obtenerListaEnfermedadesRegistro(registro) {
  let lista = [];

  if (registro.enfermedades !== undefined) {
    if (Array.isArray(registro.enfermedades) === true) {
      lista = registro.enfermedades;
    }
  }

  return lista;
}

export function construirResumenEnfermedades(registros) {
  const resumen = {
    totalCasos: registros.length,
    totalMortalidad: 0,
    enfermedadesFrecuentes: [],
    severidadesFrecuentes: [],
  };

  const contadorEnfermedades = {};
  const contadorSeveridades = {};

  registros.forEach(function (registro) {
    const mortalidad = Number(registro.mortalidad);

    if (Number.isNaN(mortalidad) === false) {
      resumen.totalMortalidad = resumen.totalMortalidad + mortalidad;
    }

    const enfermedadesRegistro = obtenerListaEnfermedadesRegistro(registro);

    enfermedadesRegistro.forEach(function (enfermedad) {
      if (contadorEnfermedades[enfermedad] === undefined) {
        contadorEnfermedades[enfermedad] = 0;
      }

      contadorEnfermedades[enfermedad] = contadorEnfermedades[enfermedad] + 1;
    });

    if (registro.severidad !== undefined && registro.severidad !== "") {
      if (contadorSeveridades[registro.severidad] === undefined) {
        contadorSeveridades[registro.severidad] = 0;
      }

      contadorSeveridades[registro.severidad] =
        contadorSeveridades[registro.severidad] + 1;
    }
  });

  Object.keys(contadorEnfermedades).forEach(function (clave) {
    resumen.enfermedadesFrecuentes.push({
      enfermedad: clave,
      nombre: obtenerNombreEnfermedad(clave),
      casos: contadorEnfermedades[clave],
    });
  });

  Object.keys(contadorSeveridades).forEach(function (clave) {
    resumen.severidadesFrecuentes.push({
      severidad: clave,
      nombre: obtenerNombreSeveridad(clave),
      casos: contadorSeveridades[clave],
    });
  });

  resumen.enfermedadesFrecuentes.sort(function (a, b) {
    return b.casos - a.casos;
  });

  resumen.severidadesFrecuentes.sort(function (a, b) {
    return b.casos - a.casos;
  });

  return resumen;
}

const enfermedadesService = {
  getAll: async function () {
    try {
      const datos = await AsyncStorage.getItem(CLAVE_ENFERMEDADES);
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
    await AsyncStorage.setItem(CLAVE_ENFERMEDADES, JSON.stringify(registros));
  },

  create: async function (registro) {
    const lista = await enfermedadesService.getAll();

    const nuevoRegistro = {
      id: Date.now().toString(),
      tipoRegistro: "enfermedad",
      finca: registro.finca,
      fincaNombre: registro.fincaNombre,
      estanque: registro.estanque,
      fechaReporte: registro.fechaReporte,
      responsable: registro.responsable,
      enfermedades: registro.enfermedades,
      severidad: registro.severidad,
      severidadNombre: obtenerNombreSeveridad(registro.severidad),
      mortalidad: Number(registro.mortalidad),
      reporte: registro.reporte,
      timestamp: new Date().toISOString(),
    };

    lista.push(nuevoRegistro);

    await enfermedadesService.saveAll(lista);

    return nuevoRegistro;
  },

  deleteById: async function (id) {
    const lista = await enfermedadesService.getAll();
    const nuevaLista = [];

    lista.forEach(function (registro) {
      if (registro.id !== id) {
        nuevaLista.push(registro);
      }
    });

    await enfermedadesService.saveAll(nuevaLista);

    return nuevaLista;
  },

  clearAll: async function () {
    await AsyncStorage.removeItem(CLAVE_ENFERMEDADES);
  },

  getResumenDashboard: async function () {
    const registros = await enfermedadesService.getAll();
    const resumen = construirResumenEnfermedades(registros);

    return resumen;
  },
};

export default enfermedadesService;
