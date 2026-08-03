/**
 * ============================================================
 * SERVICE: ALERTAS
 * ============================================================
 *
 * Descripcion:
 * Construye alertas operativas usando los datos reales
 * recibidos desde el backend.
 *
 * Fisico quimica queda temporalmente fuera.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

const CLAVE_ALERTAS_DESCARTADAS = "caprocam_alertas_descartadas_v1";
const UMBRAL_MANTENIMIENTO_AIREADOR = 80;
const UMBRAL_CRITICO_AIREADOR = 20;

/*
============================================================
FUNCIONES GENERALES
============================================================
*/

function obtenerTextoSeguro(valor, respaldo = "") {
  return valor !== undefined && valor !== null && String(valor).trim() !== "" ? String(valor).trim() : respaldo;
}

function obtenerNumeroSeguro(valor) {
  if (valor === undefined || valor === null || String(valor).trim() === "") return 0;

  const numero = Number(String(valor).replace(",", "."));
  return Number.isNaN(numero) ? 0 : numero;
}

function normalizarLista(valor) {
  return Array.isArray(valor) ? valor : [];
}

function parsearFecha(valor) {
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : new Date(valor);
  if (valor === undefined || valor === null || String(valor).trim() === "") return null;

  const texto = String(valor).slice(0, 10);
  const partes = texto.includes("-") ? texto.split("-") : texto.includes("/") ? texto.split("/") : [];

  if (partes.length !== 3) return null;

  const fecha = texto.includes("-")
    ? new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
    : new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));

  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function formatearFechaCorta(valor) {
  const fecha = parsearFecha(valor);

  if (fecha === null) return "Sin fecha";

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

function agregarAlerta(alertas, alerta) {
  alertas.push({
    id: alerta.id,
    tipo: alerta.tipo,
    categoria: alerta.categoria,
    titulo: alerta.titulo,
    mensaje: alerta.mensaje,
    detalle: obtenerTextoSeguro(alerta.detalle),
    fecha: obtenerTextoSeguro(alerta.fecha),
    diasRestantes: alerta.diasRestantes,
    icono: alerta.icono,
    color: alerta.color,
    prioridad: alerta.prioridad,
  });
}

/*
============================================================
INVENTARIO
============================================================
*/

function obtenerAlertasInventario(productosInventario) {
  const alertas = [];

  normalizarLista(productosInventario).forEach(function (producto) {
    const cantidad = obtenerNumeroSeguro(producto.cantidad);
    const stockMinimo = obtenerNumeroSeguro(producto.stockMinimo);
    const nombre = obtenerTextoSeguro(producto.nombre, "Producto sin nombre");
    const unidad = obtenerTextoSeguro(producto.unidad, "unidades");

    if (stockMinimo > 0 && cantidad < stockMinimo) {
      agregarAlerta(alertas, {
        id: "inventario-critico-" + producto.id,
        tipo: "critica",
        categoria: "Inventario",
        titulo: "Inventario critico",
        mensaje: `${nombre}: quedan ${cantidad} ${unidad}. Minimo requerido: ${stockMinimo} ${unidad}.`,
        icono: ICONS.notification,
        color: COLORS.error,
        prioridad: 3,
      });
    }

    if (stockMinimo > 0 && cantidad >= stockMinimo && cantidad <= stockMinimo * 1.5) {
      agregarAlerta(alertas, {
        id: "inventario-bajo-" + producto.id,
        tipo: "advertencia",
        categoria: "Inventario",
        titulo: "Inventario por agotarse",
        mensaje: `${nombre}: quedan ${cantidad} ${unidad}. Conviene reabastecer pronto.`,
        icono: ICONS.notification,
        color: COLORS.warning,
        prioridad: 7,
      });
    }
  });

  return alertas;
}

/*
============================================================
COSECHA
============================================================
*/

function obtenerAlertasCosecha(siembras) {
  const alertas = [];

  normalizarLista(siembras).forEach(function (siembra) {
    const diasCultivo = obtenerNumeroSeguro(siembra.diasCultivo);
    let diasMaduracion = obtenerNumeroSeguro(siembra.diasMaduracion);

    if (diasMaduracion === 0) diasMaduracion = obtenerNumeroSeguro(siembra.duracionCiclo);

    const diasRestantes = diasMaduracion - diasCultivo;
    const estado = obtenerTextoSeguro(siembra.estado).toLowerCase();
    const finca = obtenerTextoSeguro(siembra.finca, "Sin finca");
    const estanque = obtenerTextoSeguro(siembra.estanque, "Sin estanque");
    const fecha = obtenerTextoSeguro(siembra.fechaSiembra);
    const fechaVisible = formatearFechaCorta(fecha);
    const activa = estado.includes("activa") || estado.includes("activo");

    if (!activa) return;

    if (diasMaduracion > 0 && diasRestantes <= 0) {
      agregarAlerta(alertas, {
        id: "cosecha-vencida-" + siembra.siembraId,
        tipo: "critica",
        categoria: "Cosecha",
        titulo: "Cosecha pendiente",
        mensaje: `${estanque} · ${finca}: ya cumplio ${diasMaduracion} dias de maduracion.`,
        detalle: `Fecha de siembra: ${fechaVisible}.`,
        fecha,
        diasRestantes,
        icono: ICONS.shrimp,
        color: COLORS.error,
        prioridad: 2,
      });
    }

    if (diasMaduracion > 0 && diasRestantes > 0 && diasRestantes <= 20) {
      agregarAlerta(alertas, {
        id: "cosecha-pronta-" + siembra.siembraId,
        tipo: "advertencia",
        categoria: "Cosecha",
        titulo: "Cosecha proxima",
        mensaje: `${estanque} · ${finca}: faltan ${diasRestantes} dias para cosechar.`,
        detalle: `Fecha de siembra: ${fechaVisible}.`,
        fecha,
        diasRestantes,
        icono: ICONS.shrimp,
        color: COLORS.warning,
        prioridad: 3,
      });
    }
  });

  return alertas;
}

/*
============================================================
ESTANQUES
============================================================
*/

function obtenerAlertasEstanques(estanques) {
  const alertas = [];

  normalizarLista(estanques).forEach(function (estanque) {
    const diasCultivo = obtenerNumeroSeguro(estanque.diasCultivo);
    const estado = obtenerTextoSeguro(estanque.estado).toLowerCase();
    const finca = obtenerTextoSeguro(estanque.fincaNombre, estanque.finca);

    if (estado === "activo" && diasCultivo >= 90) {
      agregarAlerta(alertas, {
        id: "estanque-cultivo-avanzado-" + estanque.id,
        tipo: "advertencia",
        categoria: "Estanques",
        titulo: "Cultivo avanzado",
        mensaje: `${estanque.codigo} · ${finca}: tiene ${diasCultivo} dias de cultivo.`,
        detalle: "Revisar cosecha o muestreo.",
        icono: ICONS.waterFlow,
        color: COLORS.warning,
        prioridad: 5,
      });
    }

    if (estado.includes("prepar")) {
      agregarAlerta(alertas, {
        id: "estanque-preparacion-" + estanque.id,
        tipo: "info",
        categoria: "Estanques",
        titulo: "Estanque en preparacion",
        mensaje: `${estanque.codigo} · ${finca}: pendiente de siembra o validacion operativa.`,
        icono: ICONS.waterFlow,
        color: COLORS.primary,
        prioridad: 9,
      });
    }
  });

  return alertas;
}

/*
============================================================
ALIMENTACION
============================================================
*/

function obtenerHoraNumero(horaTexto) {
  const texto = obtenerTextoSeguro(horaTexto).toLowerCase();

  if (texto === "") return -1;

  const partes = texto.split(":");
  let hora = Number(partes[0]);

  if (Number.isNaN(hora)) return -1;
  if (texto.includes("pm") && hora < 12) hora += 12;
  if (texto.includes("am") && hora === 12) hora = 0;

  return hora;
}

function esMismaFecha(fechaUno, fechaDos) {
  const primera = parsearFecha(fechaUno);
  const segunda = parsearFecha(fechaDos);

  return primera !== null &&
    segunda !== null &&
    primera.getDate() === segunda.getDate() &&
    primera.getMonth() === segunda.getMonth() &&
    primera.getFullYear() === segunda.getFullYear();
}

function existeAlimentacionRegistrada(alimentaciones, horaProgramada) {
  const hoy = new Date();

  return normalizarLista(alimentaciones).some(function (registro) {
    return esMismaFecha(registro.fecha, hoy) && obtenerHoraNumero(registro.hora) === horaProgramada;
  });
}

function obtenerAlertasAlimentacion(alimentaciones) {
  const alertas = [];
  const horaActual = new Date().getHours();

  const horarios = [
    { id: "manana", hora: 7, etiqueta: "7:00 AM" },
    { id: "tarde", hora: 15, etiqueta: "3:00 PM" },
  ];

  horarios.forEach(function (horario) {
    const yaRegistro = existeAlimentacionRegistrada(alimentaciones, horario.hora);

    if (horaActual >= horario.hora && !yaRegistro) {
      agregarAlerta(alertas, {
        id: "alimentacion-pendiente-" + horario.id,
        tipo: "advertencia",
        categoria: "Alimentacion",
        titulo: "Alimentacion pendiente",
        mensaje: `No se encontro registro de alimentacion de las ${horario.etiqueta} para hoy.`,
        icono: ICONS.food,
        color: COLORS.warning,
        prioridad: 8,
      });
    }

    if (horaActual < horario.hora && horario.hora - horaActual <= 1) {
      agregarAlerta(alertas, {
        id: "alimentacion-proxima-" + horario.id,
        tipo: "info",
        categoria: "Alimentacion",
        titulo: "Alimentacion proxima",
        mensaje: `Se aproxima la alimentacion programada de las ${horario.etiqueta}.`,
        icono: ICONS.clock,
        color: COLORS.primary,
        prioridad: 10,
      });
    }
  });

  return alertas;
}

/*
============================================================
EQUIPOS
============================================================
*/

function obtenerEquiposPorTipo(equipos, tipoBuscado) {
  return normalizarLista(equipos).filter(function (equipo) {
    return obtenerTextoSeguro(equipo.tipoEquipo, equipo.tipo).toLowerCase().includes(tipoBuscado);
  });
}

function obtenerNombreEquipo(equipo) {
  return obtenerTextoSeguro(equipo.nombreEquipo, obtenerTextoSeguro(equipo.nombre, "Equipo"));
}

function obtenerSerieEquipo(equipo) {
  return obtenerTextoSeguro(equipo.identificador, obtenerTextoSeguro(equipo.serie));
}

function obtenerNombresEquipos(equipos) {
  const equiposSeguros = normalizarLista(equipos);

  return equiposSeguros.length === 0
    ? "equipos registrados"
    : equiposSeguros.map(function (equipo) {
        return `${obtenerNombreEquipo(equipo)} ${obtenerSerieEquipo(equipo)}`.trim();
      }).join(", ");
}

/*
============================================================
BOMBEO
============================================================
*/

function obtenerMinutosHora(horaTexto) {
  const partes = String(horaTexto).split(":");
  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);

  return (Number.isNaN(horas) ? 0 : horas) * 60 + (Number.isNaN(minutos) ? 0 : minutos);
}

function obtenerAlertasBombeo(equipos) {
  const alertas = [];
  const equiposBombeo = obtenerEquiposPorTipo(equipos, "bombeo");
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  const horarios = [
    { id: "bombeo-manana", inicio: "06:00", fin: "08:00", etiqueta: "6:00 AM - 8:00 AM" },
    { id: "bombeo-mediodia", inicio: "12:00", fin: "13:00", etiqueta: "12:00 PM - 1:00 PM" },
    { id: "bombeo-tarde", inicio: "17:00", fin: "19:00", etiqueta: "5:00 PM - 7:00 PM" },
  ];

  let horarioActivo = null;
  let siguiente = null;
  let diferenciaMenor = 1440;

  horarios.forEach(function (horario) {
    const inicio = obtenerMinutosHora(horario.inicio);
    const fin = obtenerMinutosHora(horario.fin);

    if (minutosActuales >= inicio && minutosActuales <= fin) horarioActivo = horario;

    let diferencia = inicio - minutosActuales;

    if (diferencia < 0) diferencia += 1440;

    if (diferencia < diferenciaMenor) {
      diferenciaMenor = diferencia;
      siguiente = horario;
    }
  });

  const equiposTexto = obtenerNombresEquipos(equiposBombeo);

  if (horarioActivo !== null && equiposBombeo.length > 0) {
    agregarAlerta(alertas, {
      id: "bombeo-activo-" + horarioActivo.id,
      tipo: "info",
      categoria: "Bombeo",
      titulo: "Bombeo en curso",
      mensaje: `Horario activo: ${horarioActivo.etiqueta}. Equipos: ${equiposTexto}.`,
      icono: ICONS.waterFlow,
      color: COLORS.primary,
      prioridad: 9,
    });
  }

  if (horarioActivo === null && siguiente !== null && diferenciaMenor <= 60 && equiposBombeo.length > 0) {
    agregarAlerta(alertas, {
      id: "bombeo-proximo-" + siguiente.id,
      tipo: "advertencia",
      categoria: "Bombeo",
      titulo: "Bombeo proximo",
      mensaje: `Faltan ${diferenciaMenor} minutos para el bombeo de ${siguiente.etiqueta}. Equipos: ${equiposTexto}.`,
      icono: ICONS.waterFlow,
      color: COLORS.warning,
      prioridad: 6,
    });
  }

  return alertas;
}

/*
============================================================
AIREADORES
============================================================
*/

function obtenerAlertasAireadores(equipos) {
  const alertas = [];

  obtenerEquiposPorTipo(equipos, "aire").forEach(function (equipo) {
    const horasMantenimiento = obtenerNumeroSeguro(equipo.horasMantenimiento);
    const horasActuales = obtenerNumeroSeguro(equipo.horasActuales);

    if (horasMantenimiento <= 0) return;

    const horasRestantes = Math.max(horasMantenimiento - horasActuales, 0);
    const nombre = obtenerNombreEquipo(equipo);
    const serie = obtenerSerieEquipo(equipo);
    const ubicacion = obtenerTextoSeguro(equipo.estanqueCodigo, obtenerTextoSeguro(equipo.ubicacion, "Sin estanque"));

    if (horasRestantes <= UMBRAL_CRITICO_AIREADOR) {
      agregarAlerta(alertas, {
        id: "aireador-critico-" + equipo.id,
        tipo: "critica",
        categoria: "Aireadores",
        titulo: "Aireador casi en mantenimiento",
        mensaje: `${nombre} ${serie} · ${ubicacion}: faltan ${horasRestantes} horas para mantenimiento preventivo.`,
        icono: ICONS.wind,
        color: COLORS.error,
        prioridad: 3,
      });
    }

    if (horasRestantes > UMBRAL_CRITICO_AIREADOR && horasRestantes <= UMBRAL_MANTENIMIENTO_AIREADOR) {
      agregarAlerta(alertas, {
        id: "aireador-cercano-" + equipo.id,
        tipo: "advertencia",
        categoria: "Aireadores",
        titulo: "Mantenimiento de aireador cercano",
        mensaje: `${nombre} ${serie} · ${ubicacion}: faltan ${horasRestantes} horas para mantenimiento.`,
        icono: ICONS.wind,
        color: COLORS.warning,
        prioridad: 6,
      });
    }
  });

  return alertas;
}

/*
============================================================
SANIDAD
============================================================
*/

function obtenerAlertasSanitarias(registrosEnfermedades, registrosParasitologia) {
  const alertas = [];

  normalizarLista(registrosEnfermedades).forEach(function (registro) {
    const severidad = obtenerTextoSeguro(registro.severidad).toLowerCase();

    if (severidad === "alto" || severidad === "alta" || severidad === "critica") {
      agregarAlerta(alertas, {
        id: "sanitaria-enfermedad-" + registro.id,
        tipo: "critica",
        categoria: "Sanitaria",
        titulo: "Peligro sanitario",
        mensaje: `${obtenerTextoSeguro(registro.enfermedadNombre, registro.enfermedad)} en ${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}.`,
        icono: ICONS.shieldAlert,
        color: COLORS.error,
        prioridad: 1,
      });
    }
  });

  normalizarLista(registrosParasitologia).forEach(function (registro) {
    const grado = obtenerTextoSeguro(registro.gradoInfeccion).toLowerCase();

    if (grado === "alto" || grado === "alta") {
      agregarAlerta(alertas, {
        id: "sanitaria-parasito-" + registro.id,
        tipo: "advertencia",
        categoria: "Sanitaria",
        titulo: "Parasitologia elevada",
        mensaje: `${obtenerTextoSeguro(registro.parasitoNombre, registro.parasito)} en ${obtenerTextoSeguro(registro.estanque, "Sin estanque")}: ${obtenerTextoSeguro(registro.nombreGrado, grado)}.`,
        icono: ICONS.parasite,
        color: COLORS.warning,
        prioridad: 2,
      });
    }
  });

  return alertas;
}

/*
============================================================
CONSTRUCCION PRINCIPAL
============================================================
*/

export function construirAlertasOperativas(datos = {}) {
  const datosFinales = datos && typeof datos === "object" ? datos : {};

  const alertas = [
    ...obtenerAlertasSanitarias(datosFinales.registrosEnfermedades, datosFinales.registrosParasitologia),
    ...obtenerAlertasCosecha(datosFinales.siembras),
    ...obtenerAlertasAireadores(datosFinales.equipos),
    ...obtenerAlertasInventario(datosFinales.productosInventario),
    ...obtenerAlertasEstanques(datosFinales.estanques),
    ...obtenerAlertasBombeo(datosFinales.equipos),
    ...obtenerAlertasAlimentacion(datosFinales.alimentaciones),
  ];

  return alertas.sort(function (a, b) {
    return a.prioridad - b.prioridad;
  });
}

/*
============================================================
AGRUPACION
============================================================
*/

export function agruparAlertasPorTipo(alertas) {
  const alertasSeguras = normalizarLista(alertas);

  return {
    critica: alertasSeguras.filter(function (alerta) {
      return alerta.tipo === "critica";
    }),
    advertencia: alertasSeguras.filter(function (alerta) {
      return alerta.tipo === "advertencia";
    }),
    info: alertasSeguras.filter(function (alerta) {
      return alerta.tipo === "info";
    }),
  };
}

/*
============================================================
ALERTAS DESCARTADAS
============================================================
*/

export async function obtenerAlertasDescartadas() {
  try {
    const datos = await AsyncStorage.getItem(CLAVE_ALERTAS_DESCARTADAS);

    if (datos === null) return [];

    const lista = JSON.parse(datos);
    return normalizarLista(lista);
  } catch (error) {
    console.error("Error leyendo alertas descartadas:", error);
    return [];
  }
}

export async function guardarAlertasDescartadas(ids) {
  await AsyncStorage.setItem(CLAVE_ALERTAS_DESCARTADAS, JSON.stringify(normalizarLista(ids)));
}

export async function descartarAlerta(id) {
  const lista = normalizarLista(await obtenerAlertasDescartadas());

  if (!lista.includes(id)) lista.push(id);

  await guardarAlertasDescartadas(lista);
  return lista;
}

export function filtrarAlertasDescartadas(alertas, descartadas) {
  const descartadasSeguras = normalizarLista(descartadas);

  return normalizarLista(alertas).filter(function (alerta) {
    return !descartadasSeguras.includes(alerta.id);
  });
}