/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardUtils.js
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Contiene funciones auxiliares y calculos utilizados
por el Dashboard.
//////////////////////////////////////////////////////////
*/

const NOMBRES_DIAS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export function obtenerTextoSeguro(valor, respaldo = "") {
  return valor !== undefined && valor !== null && String(valor).trim() !== "" ? String(valor).trim() : respaldo;
}

export function obtenerNumeroSeguro(valor) {
  const numero = Number(String(valor ?? "").replace(",", "."));
  return Number.isFinite(numero) ? numero : 0;
}

export function formatearNumero(valor) {
  return obtenerNumeroSeguro(valor).toLocaleString("es-CR");
}

export function convertirFecha(valor) {
  if (!valor) {
    return null;
  }

  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : new Date(valor);
  }

  const texto = String(valor).trim();
  const textoCorto = texto.slice(0, 10);
  let fecha = null;

  if (textoCorto.includes("-")) {
    const partes = textoCorto.split("-");

    if (partes.length === 3) {
      fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    }
  } else if (textoCorto.includes("/")) {
    const partes = textoCorto.split("/");

    if (partes.length === 3) {
      fecha = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    }
  } else {
    fecha = new Date(texto);
  }

  return fecha && !Number.isNaN(fecha.getTime()) ? fecha : null;
}

export function formatearFechaCorta(valor) {
  const fecha = convertirFecha(valor);

  if (!fecha) {
    return "Sin fecha";
  }

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

export function obtenerDiaSemana(valor) {
  const fecha = convertirFecha(valor);
  return fecha ? NOMBRES_DIAS[fecha.getDay()] : "";
}

function obtenerTiempo(valor) {
  const fecha = convertirFecha(valor);
  return fecha ? fecha.getTime() : 0;
}

function estaDentroUltimosSieteDias(valor) {
  const fecha = convertirFecha(valor);

  if (!fecha) {
    return false;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  const dias = Math.floor((hoy.getTime() - fecha.getTime()) / 86400000);
  return dias >= 0 && dias <= 6;
}

export function obtenerResumenEnfermedadesVacio() {
  return {
    totalCasos: 0,
    totalRegistros: 0,
    totalMortalidad: 0,
    totalMortalidadRegistrada: 0,
    enfermedadesFrecuentes: [],
    severidadesFrecuentes: [],
  };
}

export function obtenerResumenParasitologiasVacio() {
  return {
    totalRegistros: 0,
    totalMuestreados: 0,
    totalCamaronesMuestreados: 0,
    totalInfectados: 0,
    totalCamaronesInfectados: 0,
    porcentajePromedio: 0,
    promedioInfeccion: 0,
    parasitosFrecuentes: [],
    gradosFrecuentes: [],
  };
}

export function construirFincasDashboard(fincas, estanques) {
  const fincasSeguras = Array.isArray(fincas) ? fincas : [];
  const estanquesSeguros = Array.isArray(estanques) ? estanques : [];

  const resultado = fincasSeguras.map(function (finca) {
    return {
      id: finca.id ?? finca.codigoInterno,
      nombre: obtenerTextoSeguro(finca.nombre, "Finca sin nombre"),
      ubicacion: obtenerTextoSeguro(finca.ubicacion, "Sin ubicacion"),
      area: obtenerNumeroSeguro(finca.areaTotal ?? finca.area),
      estanques: obtenerNumeroSeguro(finca.estanques),
    };
  });

  estanquesSeguros.forEach(function (estanque) {
    const fincaNombre = obtenerTextoSeguro(estanque.fincaNombre, estanque.finca);
    const existe = resultado.some(function (finca) {
      return finca.nombre === fincaNombre;
    });

    if (!existe && fincaNombre !== "") {
      resultado.push({
        id: `finca-${estanque.fincaId ?? fincaNombre}`,
        nombre: fincaNombre,
        ubicacion: "Registrada en estanques",
        area: 0,
        estanques: 0,
      });
    }
  });

  return resultado;
}

export function contarEstanquesPorFinca(finca, estanques) {
  const estanquesSeguros = Array.isArray(estanques) ? estanques : [];
  const fincaEsObjeto = finca && typeof finca === "object";
  const fincaId = fincaEsObjeto ? Number(finca.id ?? finca.fincaId ?? finca.idFinca) : 0;
  const fincaNombre = fincaEsObjeto ? obtenerTextoSeguro(finca.nombre) : obtenerTextoSeguro(finca);

  return estanquesSeguros.filter(function (estanque) {
    const estanqueFincaId = Number(estanque.fincaId ?? estanque.idFinca);
    const estanqueFincaNombre = obtenerTextoSeguro(estanque.fincaNombre, estanque.finca);
    return fincaId > 0 && estanqueFincaId > 0 ? fincaId === estanqueFincaId : fincaNombre === estanqueFincaNombre;
  }).length;
}

export function obtenerTotalEstanquesFinca(finca, estanques) {
  const totalReal = contarEstanquesPorFinca(finca, estanques);
  return totalReal > 0 ? totalReal : obtenerNumeroSeguro(finca?.estanques);
}

export function obtenerMayorEstanquesFinca(fincas, estanques) {
  const lista = Array.isArray(fincas) ? fincas : [];

  return lista.reduce(function (mayor, finca) {
    return Math.max(mayor, obtenerTotalEstanquesFinca(finca, estanques));
  }, 1);
}

export function obtenerPorcentaje(valor, mayor) {
  const valorSeguro = obtenerNumeroSeguro(valor);
  const mayorSeguro = obtenerNumeroSeguro(mayor);
  const porcentaje = mayorSeguro > 0 ? (valorSeguro / mayorSeguro) * 100 : 0;

  return Math.min(Math.max(porcentaje, 0), 100);
}

export function obtenerEstanquesActivos(estanques) {
  const lista = Array.isArray(estanques) ? estanques : [];

  return lista.filter(function (estanque) {
    return obtenerTextoSeguro(estanque.estado).toLowerCase() === "activo";
  }).length;
}

export function obtenerEstanquesCosechados(estanques) {
  const lista = Array.isArray(estanques) ? estanques : [];

  return lista.filter(function (estanque) {
    return obtenerTextoSeguro(estanque.estado).toLowerCase() === "cosechado";
  }).length;
}

export function obtenerAlimentacionSemanal(alimentaciones) {
  const dias = [
    { id: 1, dia: "Lun", kg: 0 },
    { id: 2, dia: "Mar", kg: 0 },
    { id: 3, dia: "Mie", kg: 0 },
    { id: 4, dia: "Jue", kg: 0 },
    { id: 5, dia: "Vie", kg: 0 },
    { id: 6, dia: "Sab", kg: 0 },
    { id: 7, dia: "Dom", kg: 0 },
  ];

  const lista = Array.isArray(alimentaciones) ? alimentaciones : [];

  lista.forEach(function (registro) {
    if (!estaDentroUltimosSieteDias(registro.fecha)) {
      return;
    }

    const diaRegistro = obtenerDiaSemana(registro.fecha);
    const dia = dias.find(function (item) {
      return item.dia === diaRegistro;
    });

    if (dia) {
      dia.kg += obtenerNumeroSeguro(registro.cantidadKg);
    }
  });

  return dias.map(function (dia) {
    return {
      ...dia,
      kg: Number(dia.kg.toFixed(2)),
    };
  });
}

export function obtenerMayorKgSemanal(alimentacionSemanal) {
  const lista = Array.isArray(alimentacionSemanal) ? alimentacionSemanal : [];

  return lista.reduce(function (mayor, item) {
    return Math.max(mayor, obtenerNumeroSeguro(item.kg));
  }, 1);
}

export function obtenerTotalCasosSanitarios(resumenEnfermedades, resumenParasitologias) {
  const totalEnfermedades = obtenerNumeroSeguro(resumenEnfermedades?.totalCasos ?? resumenEnfermedades?.totalRegistros);
  const totalParasitologias = obtenerNumeroSeguro(resumenParasitologias?.totalRegistros);

  return totalEnfermedades + totalParasitologias;
}

export function obtenerMortalidadTotal(resumenEnfermedades) {
  return obtenerNumeroSeguro(resumenEnfermedades?.totalMortalidad ?? resumenEnfermedades?.totalMortalidadRegistrada);
}

export function obtenerCasosSanitarios(registrosEnfermedades, registrosParasitologias) {
  const enfermedades = Array.isArray(registrosEnfermedades) ? registrosEnfermedades : [];
  const parasitologias = Array.isArray(registrosParasitologias) ? registrosParasitologias : [];

  const casosEnfermedades = enfermedades.map(function (registro) {
    const fecha = obtenerTextoSeguro(registro.fechaReporte, registro.timestamp);

    return {
      id: `enfermedad-${registro.id}`,
      tipo: "enfermedad",
      nombre: obtenerTextoSeguro(registro.enfermedadNombre, registro.enfermedad),
      finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
      estanque: obtenerTextoSeguro(registro.estanqueCodigo, registro.estanque),
      fecha,
      severidad: obtenerTextoSeguro(registro.severidad),
      severidadNombre: obtenerTextoSeguro(registro.severidadNombre, registro.severidad),
      fechaOrden: obtenerTiempo(registro.timestamp ?? fecha),
    };
  });

  const casosParasitologias = parasitologias.map(function (registro) {
    const fecha = obtenerTextoSeguro(registro.fechaReporte, registro.timestamp);
    const grado = obtenerTextoSeguro(registro.gradoInfeccion);

    return {
      id: `parasitologia-${registro.id}`,
      tipo: "parasitologia",
      nombre: obtenerTextoSeguro(registro.parasitoNombre, registro.parasito),
      finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
      estanque: obtenerTextoSeguro(registro.estanqueCodigo, registro.estanque),
      fecha,
      severidad: grado,
      severidadNombre: obtenerTextoSeguro(registro.nombreGrado, grado),
      fechaOrden: obtenerTiempo(registro.timestamp ?? fecha),
    };
  });

  return [...casosEnfermedades, ...casosParasitologias].sort(function (a, b) {
    return b.fechaOrden - a.fechaOrden;
  }).slice(0, 6);
}

export function obtenerRegistrosMortalidad(registrosEnfermedades) {
  const lista = Array.isArray(registrosEnfermedades) ? registrosEnfermedades : [];

  return lista.map(function (registro) {
    const fecha = obtenerTextoSeguro(registro.fechaReporte, registro.timestamp);

    return {
      id: registro.id,
      nombre: obtenerTextoSeguro(registro.enfermedadNombre, registro.enfermedad),
      finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
      estanque: obtenerTextoSeguro(registro.estanqueCodigo, registro.estanque),
      fecha,
      mortalidad: obtenerNumeroSeguro(registro.mortalidadRegistrada ?? registro.mortalidad),
      fechaOrden: obtenerTiempo(registro.timestamp ?? fecha),
    };
  }).filter(function (registro) {
    return registro.mortalidad > 0;
  }).sort(function (a, b) {
    return b.fechaOrden - a.fechaOrden;
  }).slice(0, 6);
}

function crearUltimoRegistro(id, modulo, detalle, fecha, fechaVisible) {
  return {
    id,
    modulo,
    detalle,
    fechaVisible: fechaVisible || formatearFechaCorta(fecha),
    fechaOrden: obtenerTiempo(fecha),
  };
}

export function obtenerUltimosRegistros(alimentaciones, siembras, enfermedades, parasitologias, fisicoQuimicos) {
  const registros = [];
  const alimentacionesSeguras = Array.isArray(alimentaciones) ? alimentaciones : [];
  const siembrasSeguras = Array.isArray(siembras) ? siembras : [];
  const enfermedadesSeguras = Array.isArray(enfermedades) ? enfermedades : [];
  const parasitologiasSeguras = Array.isArray(parasitologias) ? parasitologias : [];
  const fisicoQuimicosSeguros = Array.isArray(fisicoQuimicos) ? fisicoQuimicos : [];

  alimentacionesSeguras.forEach(function (registro) {
    const fecha = obtenerTextoSeguro(registro.timestamp, registro.fecha);
    const detalle = `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(registro.finca, "Sin finca")}`;
    registros.push(crearUltimoRegistro(`alimentacion-${registro.id}`, "Alimentacion", detalle, fecha, registro.hora));
  });

  siembrasSeguras.forEach(function (registro) {
    const fecha = obtenerTextoSeguro(registro.fechaSiembra, registro.timestamp);
    const detalle = `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(registro.finca, "Sin finca")}`;
    registros.push(crearUltimoRegistro(`siembra-${registro.id}`, "Siembra", detalle, fecha));
  });

  enfermedadesSeguras.forEach(function (registro) {
    const fecha = obtenerTextoSeguro(registro.timestamp, registro.fechaReporte);
    const detalle = `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}`;
    registros.push(crearUltimoRegistro(`enfermedad-${registro.id}`, "Enfermedades", detalle, fecha));
  });

  parasitologiasSeguras.forEach(function (registro) {
    const fecha = obtenerTextoSeguro(registro.timestamp, registro.fechaReporte);
    const detalle = `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}`;
    registros.push(crearUltimoRegistro(`parasitologia-${registro.id}`, "Parasitologia", detalle, fecha));
  });

  fisicoQuimicosSeguros.forEach(function (registro) {
    const fecha = obtenerTextoSeguro(registro.timestamp, registro.fecha);
    const detalle = `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}`;
    registros.push(crearUltimoRegistro(`fisico-quimica-${registro.id}`, "Fisico Quimica", detalle, fecha));
  });

  return registros.sort(function (a, b) {
    return b.fechaOrden - a.fechaOrden;
  }).slice(0, 5);
}

export function obtenerCategoriasAlertas(alertas) {
  const lista = Array.isArray(alertas) ? alertas : [];

  return lista.reduce(function (categorias, alerta) {
    const categoria = obtenerTextoSeguro(alerta.categoria, alerta.tipo);

    if (!categorias[categoria]) {
      categorias[categoria] = [];
    }

    categorias[categoria].push(alerta);
    return categorias;
  }, {});
}

export function obtenerResumenAlertas(alertas) {
  const lista = Array.isArray(alertas) ? alertas : [];

  return [
    {
      tipo: "critica",
      titulo: "Criticas",
      alertas: lista.filter(function (alerta) {
        return alerta.tipo === "critica";
      }),
    },
    {
      tipo: "advertencia",
      titulo: "Advertencias",
      alertas: lista.filter(function (alerta) {
        return alerta.tipo === "advertencia";
      }),
    },
    {
      tipo: "info",
      titulo: "Informativas",
      alertas: lista.filter(function (alerta) {
        return alerta.tipo === "info";
      }),
    },
  ];
}