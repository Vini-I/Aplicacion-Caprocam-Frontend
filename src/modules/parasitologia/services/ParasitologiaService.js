/**
 * ============================================================
 * SERVICE: PARASITOLOGIA
 * ============================================================
 *
 * Centraliza las peticiones HTTP del modulo Parasitologia.
 *
 * Rutas:
 * - GET    /parasitologias
 * - GET    /parasitologias/:id
 * - POST   /parasitologias
 * - PUT    /parasitologias/:id
 * - DELETE /parasitologias/:id
 * - GET    /parasitologias/resumen
 * - GET    /parasitologias/catalogos/parasitos
 *
 * El JWT es agregado automaticamente por api.js.
 */

import api from "../../../api/api";

export const PARASITOS_CATALOGO = [
  {
    label: "Gregarina",
    value: "gregarina",
  },
  {
    label: "Nematodo",
    value: "nematodo",
  },
  {
    label: "Epicomensal",
    value: "epicomensal",
  },
  {
    label: "Protozoario",
    value: "protozoario",
  },
  {
    label: "Otro",
    value: "otro",
  },
];

function obtenerDataRespuesta(response, respaldo) {
  if (
    response === undefined ||
    response === null
  ) {
    return respaldo;
  }

  if (
    response.data === undefined ||
    response.data === null
  ) {
    return respaldo;
  }

  if (
    response.data.data === undefined ||
    response.data.data === null
  ) {
    return respaldo;
  }

  return response.data.data;
}

function convertirCatalogoOpciones(catalogo) {
  const opciones = [];

  if (Array.isArray(catalogo) === false) {
    return opciones;
  }

  for (
    let i = 0;
    i < catalogo.length;
    i++
  ) {
    const item = catalogo[i];

    if (typeof item === "string") {
      opciones.push({
        label: obtenerNombreParasito(item),
        value: item,
      });
    }

    if (
      item !== null &&
      typeof item === "object"
    ) {
      let value = "";
      let label = "";

      if (
        item.value !== undefined &&
        item.value !== null
      ) {
        value = String(item.value);
      }

      if (
        value === "" &&
        item.parasito !== undefined &&
        item.parasito !== null
      ) {
        value = String(item.parasito);
      }

      if (
        item.label !== undefined &&
        item.label !== null
      ) {
        label = String(item.label);
      }

      if (
        label === "" &&
        item.nombre !== undefined &&
        item.nombre !== null
      ) {
        label = String(item.nombre);
      }

      if (label === "") {
        label = obtenerNombreParasito(value);
      }

      if (value !== "") {
        opciones.push({
          label: label,
          value: value,
        });
      }
    }
  }

  return opciones;
}

export function obtenerNombreParasito(valor) {
  const texto = String(
    valor || "",
  ).trim().toLowerCase();

  if (texto === "gregarina") {
    return "Gregarina";
  }

  if (texto === "nematodo") {
    return "Nematodo";
  }

  if (texto === "epicomensal") {
    return "Epicomensal";
  }

  if (texto === "protozoario") {
    return "Protozoario";
  }

  if (texto === "otro") {
    return "Otro";
  }

  return texto;
}

export function obtenerNombreGrado(grado) {
  const texto = String(
    grado || "",
  ).trim().toLowerCase();

  if (
    texto === "alto" ||
    Number(grado) === 3 ||
    Number(grado) === 4
  ) {
    return "Alto";
  }

  if (
    texto === "medio" ||
    Number(grado) === 2
  ) {
    return "Medio";
  }

  return "Bajo";
}

export function calcularGradoInfeccion(
  camaronesMuestreados,
  camaronesInfectados,
) {
  let muestreados = Number(
    camaronesMuestreados,
  );

  let infectados = Number(
    camaronesInfectados,
  );

  if (Number.isNaN(muestreados)) {
    muestreados = 0;
  }

  if (Number.isNaN(infectados)) {
    infectados = 0;
  }

  if (muestreados <= 0) {
    return {
      grado: "bajo",
      nombre: "Bajo",
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

  const porcentaje =
    (infectados / muestreados) * 100;

  let grado = "bajo";
  let nombre = "Bajo";
  let descripcion =
    "Infeccion baja.";

  if (porcentaje === 0) {
    descripcion =
      "Sin camarones infectados.";
  }

  if (porcentaje >= 30) {
    grado = "medio";
    nombre = "Medio";
    descripcion =
      "Infeccion media.";
  }

  if (porcentaje >= 60) {
    grado = "alto";
    nombre = "Alto";
    descripcion =
      "Infeccion alta.";
  }

  return {
    grado: grado,
    nombre: nombre,
    porcentaje: Number(
      porcentaje.toFixed(2),
    ),
    descripcion: descripcion,
  };
}

function obtenerValorNumericoGrado(grado) {
  const texto = String(
    grado || "",
  ).trim().toLowerCase();

  if (texto === "alto") {
    return 3;
  }

  if (texto === "medio") {
    return 2;
  }

  return 1;
}

export function construirResumenParasitologia(
  registros,
) {
  let lista = [];

  if (Array.isArray(registros)) {
    lista = registros;
  }

  const resumen = {
    totalRegistros: lista.length,
    totalMuestreados: 0,
    totalInfectados: 0,
    totalCamaronesMuestreados: 0,
    totalCamaronesInfectados: 0,
    porcentajePromedio: 0,
    promedioInfeccion: 0,
    gradoPromedio: 0,
    parasitosFrecuentes: [],
    gradosFrecuentes: [],
  };

  const contadorParasitos = {};
  const contadorGrados = {};

  let sumaPorcentajes = 0;
  let sumaGrados = 0;

  for (
    let i = 0;
    i < lista.length;
    i++
  ) {
    const registro = lista[i];

    const muestreados = Number(
      registro.camaronesMuestreados,
    );

    const infectados = Number(
      registro.camaronesInfectados,
    );

    const porcentaje = Number(
      registro.porcentajeInfeccion,
    );

    if (Number.isNaN(muestreados) === false) {
      resumen.totalMuestreados =
        resumen.totalMuestreados +
        muestreados;
    }

    if (Number.isNaN(infectados) === false) {
      resumen.totalInfectados =
        resumen.totalInfectados +
        infectados;
    }

    if (Number.isNaN(porcentaje) === false) {
      sumaPorcentajes =
        sumaPorcentajes +
        porcentaje;
    }

    sumaGrados =
      sumaGrados +
      obtenerValorNumericoGrado(
        registro.gradoInfeccion,
      );

    const parasito = String(
      registro.parasito || "otro",
    );

    const grado = String(
      registro.gradoInfeccion || "bajo",
    );

    if (
      contadorParasitos[parasito] ===
      undefined
    ) {
      contadorParasitos[parasito] = 0;
    }

    contadorParasitos[parasito] =
      contadorParasitos[parasito] + 1;

    if (
      contadorGrados[grado] ===
      undefined
    ) {
      contadorGrados[grado] = 0;
    }

    contadorGrados[grado] =
      contadorGrados[grado] + 1;
  }

  resumen.totalCamaronesMuestreados =
    resumen.totalMuestreados;

  resumen.totalCamaronesInfectados =
    resumen.totalInfectados;

  if (lista.length > 0) {
    resumen.porcentajePromedio = Number(
      (
        sumaPorcentajes /
        lista.length
      ).toFixed(2),
    );

    resumen.promedioInfeccion =
      resumen.porcentajePromedio;

    resumen.gradoPromedio = Number(
      (
        sumaGrados /
        lista.length
      ).toFixed(2),
    );
  }

  const parasitos =
    Object.keys(contadorParasitos);

  for (
    let i = 0;
    i < parasitos.length;
    i++
  ) {
    const clave = parasitos[i];

    resumen.parasitosFrecuentes.push({
      parasito: clave,
      valor: clave,
      nombre:
        obtenerNombreParasito(clave),
      casos:
        contadorParasitos[clave],
      cantidad:
        contadorParasitos[clave],
    });
  }

  const grados =
    Object.keys(contadorGrados);

  for (
    let i = 0;
    i < grados.length;
    i++
  ) {
    const clave = grados[i];

    resumen.gradosFrecuentes.push({
      grado: clave,
      valor: clave,
      nombre:
        obtenerNombreGrado(clave),
      casos:
        contadorGrados[clave],
      cantidad:
        contadorGrados[clave],
    });
  }

  resumen.parasitosFrecuentes.sort(
    function (a, b) {
      return b.casos - a.casos;
    },
  );

  resumen.gradosFrecuentes.sort(
    function (a, b) {
      return b.casos - a.casos;
    },
  );

  return resumen;
}

export function obtenerMensajeError(
  error,
  mensajeRespaldo,
) {
  let mensaje = mensajeRespaldo;

  if (
    error === undefined ||
    error === null
  ) {
    return mensaje;
  }

  if (
    error.response !== undefined &&
    error.response !== null &&
    error.response.data !== undefined &&
    error.response.data !== null
  ) {
    const data = error.response.data;

    if (
      data.message !== undefined &&
      data.message !== null &&
      String(data.message).trim() !== ""
    ) {
      mensaje = String(data.message);
    }

    if (
      Array.isArray(data.error) &&
      data.error.length > 0
    ) {
      mensaje =
        mensaje +
        " " +
        data.error.join(" ");
    }
  }

  return mensaje;
}

export function obtenerResponsableSesion() {
  let responsable =
    "Asignado automaticamente por el backend";

  if (
    typeof localStorage === "undefined"
  ) {
    return responsable;
  }

  const usuarioTexto =
    localStorage.getItem(
      "caprocam_usuario",
    );

  if (
    usuarioTexto === null ||
    usuarioTexto === ""
  ) {
    return responsable;
  }

  try {
    const usuario = JSON.parse(
      usuarioTexto,
    );

    let nombre = "";
    let apellidos = "";

    if (
      usuario.nombre !== undefined &&
      usuario.nombre !== null
    ) {
      nombre = String(
        usuario.nombre,
      ).trim();
    }

    if (
      usuario.apellidos !== undefined &&
      usuario.apellidos !== null
    ) {
      apellidos = String(
        usuario.apellidos,
      ).trim();
    }

    const nombreCompleto =
      (nombre + " " + apellidos).trim();

    if (nombreCompleto !== "") {
      responsable = nombreCompleto;
    }
  } catch {
    responsable =
      "Asignado automaticamente por el backend";
  }

  return responsable;
}

const parasitologiaService = {
  getAll: async function () {
    const response = await api.get(
      "/parasitologias",
    );

    return obtenerDataRespuesta(
      response,
      [],
    );
  },

  getById: async function (id) {
    const response = await api.get(
      `/parasitologias/${id}`,
    );

    return obtenerDataRespuesta(
      response,
      null,
    );
  },

  create: async function (registro) {
    const response = await api.post(
      "/parasitologias",
      registro,
    );

    return obtenerDataRespuesta(
      response,
      null,
    );
  },

  update: async function (
    id,
    registro,
  ) {
    const response = await api.put(
      `/parasitologias/${id}`,
      registro,
    );

    return obtenerDataRespuesta(
      response,
      null,
    );
  },

  deleteById: async function (id) {
    const response = await api.delete(
      `/parasitologias/${id}`,
    );

    return obtenerDataRespuesta(
      response,
      null,
    );
  },

  getResumenDashboard: async function () {
    const response = await api.get(
      "/parasitologias/resumen",
    );

    return obtenerDataRespuesta(
      response,
      construirResumenParasitologia([]),
    );
  },

  getCatalogo: async function () {
    const response = await api.get(
      "/parasitologias/catalogos/parasitos",
    );

    const catalogo =
      obtenerDataRespuesta(
        response,
        [],
      );

    const opciones =
      convertirCatalogoOpciones(
        catalogo,
      );

    if (opciones.length === 0) {
      return PARASITOS_CATALOGO;
    }

    return opciones;
  },
};

export default parasitologiaService;