/**
 * ============================================================
 * SERVICE: DASHBOARD
 * ============================================================
 *
 * Funciones auxiliares del DashboardScreen.
 */

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import {
  formatDate,
  getCurrentDate,
  getDayName,
  isSameDate,
  parseDate,
} from "../../../shared/utils/dateUtils";

import {
  obtenerNombreEnfermedad,
} from "../../enfermedades/services/EnfermedadesService";

import {
  obtenerNombreParasito,
} from "../../parasitologia/services/ParasitologiaService";

import { styles } from "../styles/DashboardStyle";

const HORARIOS_ALIMENTACION = [
  {
    id: "manana",
    hora: 7,
    etiqueta: "7:00 AM",
  },
  {
    id: "tarde",
    hora: 15,
    etiqueta: "3:00 PM",
  },
];

const HORARIOS_BOMBEO = [
  {
    id: "bombeo-manana",
    inicio: "06:00",
    fin: "08:00",
    etiqueta: "6:00 AM - 8:00 AM",
  },
  {
    id: "bombeo-mediodia",
    inicio: "12:00",
    fin: "13:00",
    etiqueta: "12:00 PM - 1:00 PM",
  },
  {
    id: "bombeo-tarde",
    inicio: "17:00",
    fin: "19:00",
    etiqueta: "5:00 PM - 7:00 PM",
  },
];

const HORAS_USO_AIREADOR_DIA = 18;
const CICLO_MANTENIMIENTO_AIREADOR = 500;
const UMBRAL_MANTENIMIENTO_AIREADOR = 80;
const UMBRAL_CRITICO_AIREADOR = 20;

export function obtenerTextoSeguro(valor, respaldo) {
  let texto = respaldo;

  if (valor !== undefined && valor !== null && valor !== "") {
    texto = String(valor);
  }

  return texto;
}

export function obtenerNumeroSeguro(valor) {
  let numero = 0;

  if (valor !== undefined && valor !== null && valor !== "") {
    const texto = String(valor).replace(",", ".");
    const convertido = Number(texto);

    if (Number.isNaN(convertido) === false) {
      numero = convertido;
    }
  }

  return numero;
}

export function formatearNumero(valor) {
  const numero = obtenerNumeroSeguro(valor);

  return numero.toLocaleString("es-CR");
}

export function convertirFecha(fechaTexto) {
  let fecha = new Date();

  if (fechaTexto !== undefined && fechaTexto !== null && fechaTexto !== "") {
    fecha = parseDate(fechaTexto);
  }

  if (fecha === null || fecha === undefined) {
    fecha = new Date();
  }

  if (Number.isNaN(fecha.getTime()) === true) {
    fecha = new Date();
  }

  return fecha;
}

export function formatearFechaCorta(fechaTexto) {
  return formatDate(convertirFecha(fechaTexto));
}

export function obtenerDiaSemana(fechaTexto) {
  return getDayName(convertirFecha(fechaTexto));
}

export function esMismaFecha(fechaUno, fechaDos) {
  return isSameDate(convertirFecha(fechaUno), convertirFecha(fechaDos));
}

export function obtenerMinutosHora(horaTexto) {
  const texto = obtenerTextoSeguro(horaTexto, "00:00");
  const partes = texto.split(":");

  let horas = 0;
  let minutos = 0;

  if (partes.length >= 1) {
    horas = Number(partes[0]);
  }

  if (partes.length >= 2) {
    minutos = Number(partes[1]);
  }

  if (Number.isNaN(horas) === true) {
    horas = 0;
  }

  if (Number.isNaN(minutos) === true) {
    minutos = 0;
  }

  return horas * 60 + minutos;
}

export function obtenerHoraNumero(horaTexto) {
  let hora = -1;
  const texto = obtenerTextoSeguro(horaTexto, "").toLowerCase();

  if (texto !== "") {
    const partes = texto.split(":");
    const posibleHora = Number(partes[0]);

    if (Number.isNaN(posibleHora) === false) {
      hora = posibleHora;
    }

    if (texto.includes("pm") === true && hora < 12) {
      hora = hora + 12;
    }

    if (texto.includes("am") === true && hora === 12) {
      hora = 0;
    }
  }

  return hora;
}

export function obtenerResumenEnfermedadesVacio() {
  return {
    totalCasos: 0,
    totalMortalidad: 0,
    enfermedadesFrecuentes: [],
    severidadesFrecuentes: [],
  };
}

export function obtenerResumenParasitologiaVacio() {
  return {
    totalRegistros: 0,
    totalMuestreados: 0,
    totalInfectados: 0,
    porcentajePromedio: 0,
    gradoPromedio: 0,
    parasitosFrecuentes: [],
    gradosFrecuentes: [],
  };
}

export function agregarAlerta(alertas, alerta) {
  alertas.push({
    id: alerta.id,
    tipo: alerta.tipo,
    categoria: alerta.categoria || alerta.tipo,
    titulo: alerta.titulo,
    mensaje: alerta.mensaje,
    detalle: alerta.detalle || "",
    icono: alerta.icono,
    color: alerta.color,
    prioridad: alerta.prioridad,
  });
}

export function construirFincasDashboard(fincas, estanques) {
  const resultado = [];

  fincas.forEach(function (finca) {
    resultado.push({
      id: finca.codigoInterno,
      nombre: finca.nombre,
      ubicacion: `${finca.canton}, ${finca.provincia}`,
      area: finca.areaTotal,
      estanques: finca.estanques,
    });
  });

  estanques.forEach(function (estanque) {
    const fincaNombre = obtenerTextoSeguro(estanque.fincaNombre, estanque.finca);
    let existe = false;

    resultado.forEach(function (finca) {
      if (finca.nombre === fincaNombre) {
        existe = true;
      }
    });

    if (existe === false) {
      resultado.push({
        id: `finca-${obtenerTextoSeguro(estanque.fincaId, fincaNombre)}`,
        nombre: fincaNombre,
        ubicacion: "Registrada en estanques",
        area: 0,
        estanques: 0,
      });
    }
  });

  return resultado;
}

export function contarEstanquesPorFinca(nombreFinca, estanques) {
  let total = 0;

  estanques.forEach(function (estanque) {
    const fincaNombre = obtenerTextoSeguro(estanque.fincaNombre, estanque.finca);

    if (fincaNombre === nombreFinca) {
      total = total + 1;
    }
  });

  return total;
}

export function obtenerTotalEstanquesFinca(finca, estanques) {
  let total = contarEstanquesPorFinca(finca.nombre, estanques);

  if (total === 0) {
    total = obtenerNumeroSeguro(finca.estanques);
  }

  return total;
}

export function obtenerMayorEstanquesFinca(fincas, estanques) {
  let mayor = 1;

  fincas.forEach(function (finca) {
    const total = obtenerTotalEstanquesFinca(finca, estanques);

    if (total > mayor) {
      mayor = total;
    }
  });

  return mayor;
}

export function obtenerPorcentaje(valor, mayor) {
  let porcentaje = 0;

  if (mayor > 0) {
    porcentaje =
      (obtenerNumeroSeguro(valor) / obtenerNumeroSeguro(mayor)) * 100;
  }

  if (porcentaje > 100) {
    porcentaje = 100;
  }

  return porcentaje;
}

export function obtenerEstanquesActivos(estanques) {
  let total = 0;

  estanques.forEach(function (estanque) {
    const estado = obtenerTextoSeguro(estanque.estado, "").toLowerCase();

    if (estado === "activo") {
      total = total + 1;
    }
  });

  return total;
}

export function obtenerEstanquesCosechados(estanques) {
  let total = 0;

  estanques.forEach(function (estanque) {
    const estado = obtenerTextoSeguro(estanque.estado, "").toLowerCase();

    if (estado === "cosechado") {
      total = total + 1;
    }
  });

  return total;
}

export function obtenerAlimentacionSemanal(alimentaciones) {
  const registros = [];

  if (Array.isArray(alimentaciones) === true) {
    alimentaciones.forEach(function (registro) {
      registros.push(registro);
    });
  }

  const dias = [
    { id: 1, dia: "Lun", kg: 0 },
    { id: 2, dia: "Mar", kg: 0 },
    { id: 3, dia: "Mie", kg: 0 },
    { id: 4, dia: "Jue", kg: 0 },
    { id: 5, dia: "Vie", kg: 0 },
    { id: 6, dia: "Sab", kg: 0 },
    { id: 7, dia: "Dom", kg: 0 },
  ];

  registros.forEach(function (registro) {
    const diaRegistro = obtenerDiaSemana(registro.fecha);

    dias.forEach(function (dia) {
      if (dia.dia === diaRegistro) {
        dia.kg = dia.kg + obtenerNumeroSeguro(registro.cantidadKg);
      }
    });
  });

  return dias;
}

export function obtenerMayorKgSemanal(alimentacionSemanal) {
  let mayor = 1;

  alimentacionSemanal.forEach(function (item) {
    if (obtenerNumeroSeguro(item.kg) > mayor) {
      mayor = obtenerNumeroSeguro(item.kg);
    }
  });

  return mayor;
}

export function obtenerTotalCasosSanitarios(
  resumenEnfermedades,
  resumenParasitologia,
) {
  const enfermedades = obtenerNumeroSeguro(resumenEnfermedades.totalCasos);
  const parasitos = obtenerNumeroSeguro(resumenParasitologia.totalRegistros);

  return enfermedades + parasitos;
}

export function obtenerMortalidadTotal(resumenEnfermedades) {
  return obtenerNumeroSeguro(resumenEnfermedades.totalMortalidad);
}

export function obtenerColorEstado(estado) {
  let color = COLORS.textTertiary;
  const texto = obtenerTextoSeguro(estado, "").toLowerCase();

  if (texto === "activo") {
    color = COLORS.primary;
  }

  if (texto === "cosechado") {
    color = COLORS.textTertiary;
  }

  if (texto.includes("prepar") === true) {
    color = COLORS.warning;
  }

  return color;
}

export function obtenerEstiloSeveridad(severidad) {
  const estilos = [styles.badge];
  const texto = obtenerTextoSeguro(severidad, "").toLowerCase();

  if (texto === "alta" || texto === "critica" || texto === "alto") {
    estilos.push(styles.badgeAlta);
  }

  if (texto === "media" || texto === "medio") {
    estilos.push(styles.badgeMedia);
  }

  if (texto === "baja" || texto === "bajo") {
    estilos.push(styles.badgeBaja);
  }

  return estilos;
}

export function obtenerColorSeveridad(severidad) {
  let color = COLORS.textTertiary;
  const texto = obtenerTextoSeguro(severidad, "").toLowerCase();

  if (texto === "alta" || texto === "critica" || texto === "alto") {
    color = COLORS.error;
  }

  if (texto === "media" || texto === "medio") {
    color = COLORS.warning;
  }

  if (texto === "baja" || texto === "bajo") {
    color = COLORS.success;
  }

  return color;
}

export function obtenerPrimerNombreEnfermedad(registro) {
  let nombre = "Enfermedad registrada";

  if (Array.isArray(registro.enfermedades) === true) {
    if (registro.enfermedades.length > 0) {
      nombre = obtenerNombreEnfermedad(registro.enfermedades[0]);
    }
  }

  if (
    Array.isArray(registro.enfermedades) === false &&
    registro.enfermedad !== undefined
  ) {
    nombre = obtenerNombreEnfermedad(registro.enfermedad);
  }

  return nombre;
}

export function obtenerCasosSanitarios(
  registrosEnfermedades,
  registrosParasitologia,
) {
  const casos = [];

  registrosEnfermedades.forEach(function (registro) {
    casos.push({
      id: `enfermedad-${registro.id}`,
      nombre: obtenerPrimerNombreEnfermedad(registro),
      finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
      estanque: obtenerTextoSeguro(registro.estanque, "Sin estanque"),
      fecha: obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
      severidad: obtenerTextoSeguro(registro.severidad, ""),
      severidadNombre: obtenerTextoSeguro(
        registro.severidadNombre,
        registro.severidad,
      ),
      timestamp: obtenerTextoSeguro(registro.timestamp, registro.fechaReporte),
    });
  });

  registrosParasitologia.forEach(function (registro) {
    casos.push({
      id: `parasitologia-${registro.id}`,
      nombre: obtenerNombreParasito(registro.parasito),
      finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
      estanque: obtenerTextoSeguro(registro.estanque, "Sin estanque"),
      fecha: obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
      severidad: "media",
      severidadNombre: obtenerTextoSeguro(
        registro.nombreGrado,
        `Grado ${registro.gradoInfeccion}`,
      ),
      timestamp: obtenerTextoSeguro(registro.timestamp, registro.fechaReporte),
    });
  });

  casos.sort(function (a, b) {
    return convertirFecha(b.timestamp).getTime() -
      convertirFecha(a.timestamp).getTime();
  });

  return casos.slice(0, 6);
}

export function obtenerRegistrosMortalidad(registrosEnfermedades) {
  const registros = [];

  registrosEnfermedades.forEach(function (registro) {
    const mortalidad = obtenerNumeroSeguro(registro.mortalidad);

    if (mortalidad > 0) {
      registros.push({
        id: registro.id,
        nombre: obtenerPrimerNombreEnfermedad(registro),
        finca: obtenerTextoSeguro(registro.fincaNombre, registro.finca),
        estanque: obtenerTextoSeguro(registro.estanque, "Sin estanque"),
        fecha: obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
        mortalidad: mortalidad,
        timestamp: obtenerTextoSeguro(registro.timestamp, registro.fechaReporte),
      });
    }
  });

  registros.sort(function (a, b) {
    return convertirFecha(b.timestamp).getTime() -
      convertirFecha(a.timestamp).getTime();
  });

  return registros.slice(0, 6);
}

export function obtenerAlertasInventario(productosInventario) {
  const alertas = [];

  productosInventario.forEach(function (producto) {
    const cantidad = obtenerNumeroSeguro(producto.cantidad);
    const stockMinimo = obtenerNumeroSeguro(producto.stockMinimo);

    if (stockMinimo > 0 && cantidad < stockMinimo) {
      agregarAlerta(alertas, {
        id: `inventario-critico-${producto.id}`,
        tipo: "critica",
        categoria: "inventario",
        titulo: "Inventario critico",
        mensaje: `${producto.nombre}: quedan ${producto.cantidad} ${producto.unidad}. Minimo requerido: ${producto.stockMinimo} ${producto.unidad}.`,
        icono: ICONS.notification,
        color: COLORS.error,
        prioridad: 3,
      });
    }

    if (stockMinimo > 0 && cantidad >= stockMinimo && cantidad <= stockMinimo * 1.5) {
      agregarAlerta(alertas, {
        id: `inventario-bajo-${producto.id}`,
        tipo: "advertencia",
        categoria: "inventario",
        titulo: "Inventario por agotarse",
        mensaje: `${producto.nombre}: quedan ${producto.cantidad} ${producto.unidad}. Conviene reabastecer pronto.`,
        icono: ICONS.notification,
        color: COLORS.warning,
        prioridad: 5,
      });
    }
  });

  return alertas;
}

export function obtenerAlertasCosecha(siembras) {
  const alertas = [];

  siembras.forEach(function (siembra) {
    const diasCultivo = obtenerNumeroSeguro(siembra.diasCultivo);
    const diasMaduracion = obtenerNumeroSeguro(siembra.diasMaduracion);
    const diasRestantes = diasMaduracion - diasCultivo;
    const estado = obtenerTextoSeguro(siembra.estado, "").toLowerCase();

    if (estado.includes("activa") === true || estado.includes("activo") === true) {
      if (diasRestantes <= 0) {
        agregarAlerta(alertas, {
          id: `cosecha-vencida-${obtenerTextoSeguro(siembra.siembraId, siembra.id)}`,
          tipo: "critica",
          categoria: "cosecha",
          titulo: "Cosecha pendiente",
          mensaje: `${siembra.estanque} · ${siembra.finca}: ya cumplio los ${diasMaduracion} dias de maduracion.`,
          detalle: `Fecha estimada: ${obtenerFechaSiembraSegura(siembra)}.`,
          icono: ICONS.shrimp,
          color: COLORS.error,
          prioridad: 2,
        });
      }

      if (diasRestantes > 0 && diasRestantes <= 15) {
        agregarAlerta(alertas, {
          id: `cosecha-pronta-${obtenerTextoSeguro(siembra.siembraId, siembra.id)}`,
          tipo: "advertencia",
          categoria: "cosecha",
          titulo: "Cosecha proxima",
          mensaje: `${siembra.estanque} · ${siembra.finca}: faltan ${diasRestantes} dias para cosechar.`,
          detalle: `Fecha de siembra: ${obtenerFechaSiembraSegura(siembra)}.`,
          icono: ICONS.shrimp,
          color: COLORS.warning,
          prioridad: 4,
        });
      }
    }
  });

  return alertas;
}

export function obtenerAlertasEstanques(estanques) {
  const alertas = [];

  estanques.forEach(function (estanque) {
    const diasCultivo = obtenerNumeroSeguro(estanque.diasCultivo);
    const estado = obtenerTextoSeguro(estanque.estado, "").toLowerCase();
    const contaminacion = obtenerTextoSeguro(estanque.contaminacion, "").toLowerCase();

    if (contaminacion === "si" || contaminacion === "alta") {
      agregarAlerta(alertas, {
        id: `contaminacion-${estanque.id}`,
        tipo: "critica",
        categoria: "contaminacion",
        titulo: "Alerta de contaminacion",
        mensaje: `${estanque.codigo} · ${obtenerTextoSeguro(estanque.fincaNombre, estanque.finca)}: revisar posible contaminacion.`,
        icono: ICONS.shieldAlert,
        color: COLORS.error,
        prioridad: 1,
      });
    }

    if (estado === "activo" && diasCultivo >= 90) {
      agregarAlerta(alertas, {
        id: `estanque-cultivo-avanzado-${estanque.id}`,
        tipo: "advertencia",
        categoria: "cosecha",
        titulo: "Cultivo avanzado",
        mensaje: `${estanque.codigo} · ${obtenerTextoSeguro(estanque.fincaNombre, estanque.finca)}: tiene ${diasCultivo} dias de cultivo.`,
        detalle: "Revisar cosecha o muestreo.",
        icono: ICONS.waterFlow,
        color: COLORS.warning,
        prioridad: 4,
      });
    }

    if (estado.includes("prepar") === true) {
      agregarAlerta(alertas, {
        id: `estanque-preparacion-${estanque.id}`,
        tipo: "info",
        categoria: "estanques",
        titulo: "Estanque en preparacion",
        mensaje: `${estanque.codigo} · ${obtenerTextoSeguro(estanque.fincaNombre, estanque.finca)}: pendiente de siembra o validacion operativa.`,
        icono: ICONS.waterFlow,
        color: COLORS.primary,
        prioridad: 7,
      });
    }
  });

  return alertas;
}

export function existeAlimentacionRegistrada(alimentaciones, horaProgramada) {
  let existe = false;
  const hoy = new Date();

  alimentaciones.forEach(function (registro) {
    const horaRegistro = obtenerHoraNumero(registro.hora);

    if (esMismaFecha(registro.fecha, hoy) === true && horaRegistro === horaProgramada) {
      existe = true;
    }
  });

  return existe;
}

export function obtenerAlertasAlimentacion(alimentaciones) {
  const alertas = [];
  const ahora = new Date();
  const horaActual = ahora.getHours();

  HORARIOS_ALIMENTACION.forEach(function (horario) {
    const yaRegistro = existeAlimentacionRegistrada(
      alimentaciones,
      horario.hora,
    );

    if (horaActual >= horario.hora && yaRegistro === false) {
      agregarAlerta(alertas, {
        id: `alimentacion-pendiente-${horario.id}`,
        tipo: "advertencia",
        categoria: "alimentacion",
        titulo: "Alimentacion pendiente",
        mensaje: `No se encontro registro de alimentacion de las ${horario.etiqueta} para hoy.`,
        icono: ICONS.food,
        color: COLORS.warning,
        prioridad: 6,
      });
    }

    if (horaActual < horario.hora && horario.hora - horaActual <= 1) {
      agregarAlerta(alertas, {
        id: `alimentacion-proxima-${horario.id}`,
        tipo: "info",
        categoria: "alimentacion",
        titulo: "Alimentacion proxima",
        mensaje: `Se aproxima la alimentacion programada de las ${horario.etiqueta}.`,
        icono: ICONS.clock,
        color: COLORS.primary,
        prioridad: 8,
      });
    }
  });

  return alertas;
}

export function obtenerEquiposPorTipo(equipos, tipoBuscado) {
  const resultado = [];

  equipos.forEach(function (equipo) {
    const tipo = obtenerTextoSeguro(equipo.tipo, "").toLowerCase();

    if (tipo.includes(tipoBuscado) === true) {
      resultado.push(equipo);
    }
  });

  return resultado;
}

export function obtenerNombresEquipos(equipos) {
  let texto = "equipos registrados";

  if (equipos.length > 0) {
    const nombres = [];

    equipos.forEach(function (equipo) {
      nombres.push(`${equipo.nombre} ${equipo.serie}`);
    });

    texto = nombres.join(", ");
  }

  return texto;
}

export function obtenerHorarioBombeoActivo(minutosActuales) {
  let activo = null;

  HORARIOS_BOMBEO.forEach(function (horario) {
    const inicio = obtenerMinutosHora(horario.inicio);
    const fin = obtenerMinutosHora(horario.fin);

    if (minutosActuales >= inicio && minutosActuales <= fin) {
      activo = horario;
    }
  });

  return activo;
}

export function obtenerSiguienteHorarioBombeo(minutosActuales) {
  let siguiente = null;
  let diferenciaMenor = 1440;

  HORARIOS_BOMBEO.forEach(function (horario) {
    const inicio = obtenerMinutosHora(horario.inicio);
    let diferencia = inicio - minutosActuales;

    if (diferencia < 0) {
      diferencia = diferencia + 1440;
    }

    if (diferencia < diferenciaMenor) {
      diferenciaMenor = diferencia;
      siguiente = horario;
    }
  });

  return {
    horario: siguiente,
    minutosRestantes: diferenciaMenor,
  };
}

export function obtenerAlertasBombeo(equipos) {
  const alertas = [];
  const equiposBombeo = obtenerEquiposPorTipo(equipos, "bombeo");
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  const horarioActivo = obtenerHorarioBombeoActivo(minutosActuales);
  const siguienteHorario = obtenerSiguienteHorarioBombeo(minutosActuales);
  const equiposTexto = obtenerNombresEquipos(equiposBombeo);

  if (horarioActivo !== null) {
    agregarAlerta(alertas, {
      id: `bombeo-activo-${horarioActivo.id}`,
      tipo: "info",
      categoria: "bombeo",
      titulo: "Bombeo en curso",
      mensaje: `Horario activo: ${horarioActivo.etiqueta}. Equipos: ${equiposTexto}.`,
      icono: ICONS.waterFlow,
      color: COLORS.primary,
      prioridad: 7,
    });
  }

  if (horarioActivo === null && siguienteHorario.horario !== null) {
    if (siguienteHorario.minutosRestantes <= 60) {
      agregarAlerta(alertas, {
        id: `bombeo-proximo-${siguienteHorario.horario.id}`,
        tipo: "advertencia",
        categoria: "bombeo",
        titulo: "Bombeo proximo",
        mensaje: `Faltan ${siguienteHorario.minutosRestantes} minutos para el bombeo de ${siguienteHorario.horario.etiqueta}. Equipos: ${equiposTexto}.`,
        icono: ICONS.waterFlow,
        color: COLORS.warning,
        prioridad: 6,
      });
    }

    if (siguienteHorario.minutosRestantes > 60) {
      agregarAlerta(alertas, {
        id: `bombeo-siguiente-${siguienteHorario.horario.id}`,
        tipo: "info",
        categoria: "bombeo",
        titulo: "Proxima hora de bombeo",
        mensaje: `Siguiente bombeo programado: ${siguienteHorario.horario.etiqueta}. Equipos: ${equiposTexto}.`,
        icono: ICONS.clock,
        color: COLORS.primary,
        prioridad: 8,
      });
    }
  }

  return alertas;
}

export function calcularHorasUsoAireador(equipo) {
  const fechaInstalacion = convertirFecha(equipo.fechaInstalacion);
  const hoy = new Date();
  const diferencia = hoy.getTime() - fechaInstalacion.getTime();

  let dias = Math.floor(diferencia / 86400000);

  if (dias < 0) {
    dias = 0;
  }

  return dias * HORAS_USO_AIREADOR_DIA;
}

export function obtenerHorasRestantesMantenimiento(horasUso) {
  const residuo = horasUso % CICLO_MANTENIMIENTO_AIREADOR;
  let restantes = CICLO_MANTENIMIENTO_AIREADOR - residuo;

  if (residuo === 0) {
    restantes = CICLO_MANTENIMIENTO_AIREADOR;
  }

  return restantes;
}

export function obtenerAlertasAireadores(equipos) {
  const alertas = [];
  const aireadores = obtenerEquiposPorTipo(equipos, "aire");

  let aireadorMasCercano = null;
  let horasMasCercanas = CICLO_MANTENIMIENTO_AIREADOR + 1;

  aireadores.forEach(function (equipo) {
    const horasUso = calcularHorasUsoAireador(equipo);
    const horasRestantes = obtenerHorasRestantesMantenimiento(horasUso);

    if (horasRestantes < horasMasCercanas) {
      horasMasCercanas = horasRestantes;
      aireadorMasCercano = equipo;
    }

    if (horasRestantes <= UMBRAL_CRITICO_AIREADOR) {
      agregarAlerta(alertas, {
        id: `aireador-critico-${equipo.id}`,
        tipo: "critica",
        categoria: "aireadores",
        titulo: "Aireador casi en mantenimiento",
        mensaje: `${equipo.nombre} ${equipo.serie} · ${equipo.ubicacion}: faltan ${horasRestantes} horas para mantenimiento preventivo.`,
        icono: ICONS.wind,
        color: COLORS.error,
        prioridad: 3,
      });
    }

    if (
      horasRestantes > UMBRAL_CRITICO_AIREADOR &&
      horasRestantes <= UMBRAL_MANTENIMIENTO_AIREADOR
    ) {
      agregarAlerta(alertas, {
        id: `aireador-cercano-${equipo.id}`,
        tipo: "advertencia",
        categoria: "aireadores",
        titulo: "Mantenimiento de aireador cercano",
        mensaje: `${equipo.nombre} ${equipo.serie} · ${equipo.ubicacion}: faltan ${horasRestantes} horas para mantenimiento.`,
        icono: ICONS.wind,
        color: COLORS.warning,
        prioridad: 5,
      });
    }
  });

  if (alertas.length === 0 && aireadorMasCercano !== null) {
    agregarAlerta(alertas, {
      id: `aireador-proximo-${aireadorMasCercano.id}`,
      tipo: "info",
      categoria: "aireadores",
      titulo: "Proximo mantenimiento de aireador",
      mensaje: `${aireadorMasCercano.nombre} ${aireadorMasCercano.serie}: faltan ${horasMasCercanas} horas para mantenimiento preventivo.`,
      icono: ICONS.wind,
      color: COLORS.primary,
      prioridad: 8,
    });
  }

  return alertas;
}

export function obtenerAlertasSanitarias(
  registrosEnfermedades,
  registrosParasitologia,
) {
  const alertas = [];

  registrosEnfermedades.forEach(function (registro) {
    const severidad = obtenerTextoSeguro(registro.severidad, "").toLowerCase();

    if (severidad === "alta" || severidad === "critica") {
      agregarAlerta(alertas, {
        id: `sanitaria-enfermedad-${registro.id}`,
        tipo: "critica",
        categoria: "sanidad",
        titulo: "Peligro sanitario",
        mensaje: `${obtenerPrimerNombreEnfermedad(registro)} en ${obtenerTextoSeguro(
          registro.estanque,
          "Sin estanque",
        )} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}.`,
        icono: ICONS.shieldAlert,
        color: COLORS.error,
        prioridad: 2,
      });
    }
  });

  registrosParasitologia.forEach(function (registro) {
    const grado = obtenerNumeroSeguro(registro.gradoInfeccion);

    if (grado >= 3) {
      agregarAlerta(alertas, {
        id: `sanitaria-parasito-${registro.id}`,
        tipo: "advertencia",
        categoria: "sanidad",
        titulo: "Parasitologia elevada",
        mensaje: `${obtenerNombreParasito(registro.parasito)} en ${obtenerTextoSeguro(
          registro.estanque,
          "Sin estanque",
        )}: ${obtenerTextoSeguro(registro.nombreGrado, `Grado ${grado}`)}.`,
        icono: ICONS.parasite,
        color: COLORS.warning,
        prioridad: 4,
      });
    }
  });

  return alertas;
}

export function obtenerAlertasDashboard(
  productosInventario,
  siembras,
  alimentaciones,
  estanques,
  equipos,
  registrosEnfermedades,
  registrosParasitologia,
) {
  let alertas = [];

  alertas = alertas.concat(obtenerAlertasEstanques(estanques));
  alertas = alertas.concat(
    obtenerAlertasSanitarias(registrosEnfermedades, registrosParasitologia),
  );
  alertas = alertas.concat(obtenerAlertasInventario(productosInventario));
  alertas = alertas.concat(obtenerAlertasCosecha(siembras));
  alertas = alertas.concat(obtenerAlertasAlimentacion(alimentaciones));
  alertas = alertas.concat(obtenerAlertasBombeo(equipos));
  alertas = alertas.concat(obtenerAlertasAireadores(equipos));

  alertas.sort(function (a, b) {
    return a.prioridad - b.prioridad;
  });

  return alertas.slice(0, 10);
}

export function obtenerEstiloAlerta(tipo) {
  const estilos = [styles.alertItem];

  if (tipo === "critica") {
    estilos.push(styles.alertCritical);
  }

  if (tipo === "advertencia") {
    estilos.push(styles.alertWarning);
  }

  if (tipo === "info") {
    estilos.push(styles.alertInfo);
  }

  return estilos;
}

export function obtenerTextoTipoAlerta(tipo) {
  let texto = "Info";

  if (tipo === "critica") {
    texto = "Critica";
  }

  if (tipo === "advertencia") {
    texto = "Advertencia";
  }

  return texto;
}

export function obtenerFechaSiembraSegura(siembra) {
  let fecha = "";

  if (siembra.fechaSiembra !== undefined && siembra.fechaSiembra !== null) {
    fecha = siembra.fechaSiembra;
  }

  if (fecha === "" && siembra.fecha !== undefined && siembra.fecha !== null) {
    fecha = siembra.fecha;
  }

  if (
    fecha === "" &&
    siembra.fechaRegistro !== undefined &&
    siembra.fechaRegistro !== null
  ) {
    fecha = siembra.fechaRegistro;
  }

  if (fecha === "") {
    fecha = getCurrentDate();
  }

  return fecha;
}

export function obtenerUltimosRegistros(
  alimentaciones,
  siembras,
  registrosEnfermedades,
  registrosParasitologia,
) {
  const registros = [];

  alimentaciones.forEach(function (registro) {
    const fechaAlimentacion = obtenerTextoSeguro(
      registro.timestamp,
      registro.fecha,
    );

    registros.push({
      id: `alimentacion-${registro.id}`,
      modulo: "Alimentacion",
      detalle: `${obtenerTextoSeguro(
        registro.estanque,
        "Sin estanque",
      )} · ${obtenerTextoSeguro(registro.finca, "Sin finca")}`,
      fechaVisible: obtenerTextoSeguro(
        registro.hora,
        formatearFechaCorta(registro.fecha),
      ),
      fechaOrden: convertirFecha(fechaAlimentacion).getTime(),
    });
  });

  siembras.forEach(function (siembra) {
    const fechaSiembra = obtenerFechaSiembraSegura(siembra);

    registros.push({
      id: `siembra-${obtenerTextoSeguro(siembra.siembraId, siembra.id)}`,
      modulo: "Siembra",
      detalle: `${obtenerTextoSeguro(
        siembra.estanque,
        "Sin estanque",
      )} · ${obtenerTextoSeguro(siembra.finca, "Sin finca")}`,
      fechaVisible: fechaSiembra,
      fechaOrden: convertirFecha(fechaSiembra).getTime(),
    });
  });

  registrosEnfermedades.forEach(function (registro) {
    const fechaEnfermedad = obtenerTextoSeguro(
      registro.timestamp,
      registro.fechaReporte,
    );

    registros.push({
      id: `enfermedad-${registro.id}`,
      modulo: "Enfermedades",
      detalle: `${obtenerTextoSeguro(
        registro.estanque,
        "Sin estanque",
      )} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}`,
      fechaVisible: formatearFechaCorta(
        obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
      ),
      fechaOrden: convertirFecha(fechaEnfermedad).getTime(),
    });
  });

  registrosParasitologia.forEach(function (registro) {
    const fechaParasitologia = obtenerTextoSeguro(
      registro.timestamp,
      registro.fechaReporte,
    );

    registros.push({
      id: `parasitologia-${registro.id}`,
      modulo: "Parasitologia",
      detalle: `${obtenerTextoSeguro(
        registro.estanque,
        "Sin estanque",
      )} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}`,
      fechaVisible: formatearFechaCorta(
        obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
      ),
      fechaOrden: convertirFecha(fechaParasitologia).getTime(),
    });
  });

  registros.sort(function (a, b) {
    return b.fechaOrden - a.fechaOrden;
  });

  return registros.slice(0, 5);
}

export function obtenerResumenAlertas(alertas) {
  const criticas = [];
  const advertencias = [];
  const informativas = [];

  alertas.forEach(function (alerta) {
    if (alerta.tipo === "critica") {
      criticas.push(alerta);
    }

    if (alerta.tipo === "advertencia") {
      advertencias.push(alerta);
    }

    if (alerta.tipo === "info") {
      informativas.push(alerta);
    }
  });

  return [
    {
      tipo: "critica",
      titulo: "Criticas",
      color: COLORS.error,
      icono: ICONS.shieldAlert,
      alertas: criticas,
    },
    {
      tipo: "advertencia",
      titulo: "Advertencias",
      color: COLORS.warning,
      icono: ICONS.alertTriangle,
      alertas: advertencias,
    },
    {
      tipo: "info",
      titulo: "Informativas",
      color: COLORS.primary,
      icono: ICONS.info,
      alertas: informativas,
    },
  ];
}

export function obtenerCategoriasAlertas(alertas) {
  const categorias = {};

  alertas.forEach(function (alerta) {
    const categoria = obtenerTextoSeguro(alerta.categoria, alerta.tipo);

    if (categorias[categoria] === undefined) {
      categorias[categoria] = [];
    }

    categorias[categoria].push(alerta);
  });

  return categorias;
}