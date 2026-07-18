/**
 * ============================================================
 * SERVICE: ALERTAS
 * ============================================================
 *
 * Construye alertas operativas para dashboard y modulo Alertas.
 * Las alertas se ordenan por prioridad y se pueden descartar.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { obtenerLecturasPorEstanque } from "../../mantAgua/services/FisicoQuimicaServices";

const CLAVE_ALERTAS_DESCARTADAS = "caprocam_alertas_descartadas_v1";
const HORAS_USO_AIREADOR_DIA = 18;
const CICLO_MANTENIMIENTO_AIREADOR = 500;
const UMBRAL_MANTENIMIENTO_AIREADOR = 80;
const UMBRAL_CRITICO_AIREADOR = 20;

function obtenerTextoSeguro(valor, respaldo) {
  let texto = respaldo;

  if (valor !== undefined && valor !== null && valor !== "") {
    texto = String(valor);
  }

  return texto;
}

function obtenerNumeroSeguro(valor) {
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

function parsearFecha(value) {
  let fecha = new Date();

  if (value instanceof Date) {
    fecha = value;
  }

  if (typeof value === "string") {
    if (value.includes("/") === true) {
      const partes = value.split("/");

      if (partes.length === 3) {
        fecha = new Date(
          Number(partes[2]),
          Number(partes[1]) - 1,
          Number(partes[0]),
        );
      }
    }

    if (value.includes("-") === true) {
      const temporal = new Date(value);

      if (Number.isNaN(temporal.getTime()) === false) {
        fecha = temporal;
      }
    }
  }

  return fecha;
}

function agregarAlerta(alertas, alerta) {
  alertas.push({
    id: alerta.id,
    tipo: alerta.tipo,
    categoria: alerta.categoria,
    titulo: alerta.titulo,
    mensaje: alerta.mensaje,
    detalle: alerta.detalle || "",
    fecha: alerta.fecha || "",
    diasRestantes: alerta.diasRestantes,
    icono: alerta.icono,
    color: alerta.color,
    prioridad: alerta.prioridad,
  });
}

function obtenerUltimoValor(lista) {
  let valor = null;

  if (Array.isArray(lista) === true && lista.length > 0) {
    valor = Number(lista[lista.length - 1]);
  }

  return valor;
}

function obtenerTipoContaminacion(ph, ox, temperatura, salinidad) {
  let tipo = "advertencia";

  if (ph !== null) {
    if (ph < 7 || ph > 9) {
      tipo = "critica";
    }
  }

  if (ox !== null) {
    if (ox < 5) {
      tipo = "critica";
    }
  }

  if (temperatura !== null) {
    if (temperatura > 33 || temperatura < 22) {
      tipo = "critica";
    }
  }

  if (salinidad !== null) {
    if (salinidad < 8 || salinidad > 38) {
      tipo = "critica";
    }
  }

  return tipo;
}

function construirMensajeContaminacion(ph, ox, temperatura, salinidad) {
  const problemas = [];

  if (ph !== null) {
    if (ph < 7.5 || ph > 8.5) {
      problemas.push(`pH ${ph}`);
    }
  }

  if (ox !== null) {
    if (ox < 6) {
      problemas.push(`oxigeno ${ox}`);
    }
  }

  if (temperatura !== null) {
    if (temperatura > 31 || temperatura < 24) {
      problemas.push(`temperatura ${temperatura}`);
    }
  }

  if (salinidad !== null) {
    if (salinidad < 10 || salinidad > 35) {
      problemas.push(`salinidad ${salinidad}`);
    }
  }

  return problemas.join(", ");
}

function obtenerAlertasContaminacion(estanques) {
  const alertas = [];

  estanques.forEach(function (estanque) {
    const lecturas = obtenerLecturasPorEstanque(estanque.codigo);

    if (lecturas !== null) {
      const ph = obtenerUltimoValor(lecturas.ph);
      const ox = obtenerUltimoValor(lecturas.ox);
      const temperatura = obtenerUltimoValor(lecturas.temperatura);
      const salinidad = obtenerUltimoValor(lecturas.salinidad);
      const mensajeContaminacion = construirMensajeContaminacion(
        ph,
        ox,
        temperatura,
        salinidad,
      );

      if (mensajeContaminacion !== "") {
        const tipo = obtenerTipoContaminacion(ph, ox, temperatura, salinidad);
        let color = COLORS.warning;
        let prioridad = 2;

        if (tipo === "critica") {
          color = COLORS.error;
          prioridad = 1;
        }

        agregarAlerta(alertas, {
          id: `contaminacion-${estanque.codigo}`,
          tipo: tipo,
          categoria: "Contaminacion",
          titulo: "Alerta de contaminacion",
          mensaje: `${estanque.codigo} · ${obtenerTextoSeguro(estanque.fincaNombre, "Finca sin nombre")}: ${mensajeContaminacion}.`,
          detalle:
            "Revisar parametros fisico-quimicos antes de priorizar alimento o inventario.",
          icono: ICONS.shieldAlert,
          color: color,
          prioridad: prioridad,
        });
      }
    }
  });

  return alertas;
}

function obtenerAlertasInventario(productosInventario) {
  const alertas = [];

  productosInventario.forEach(function (producto) {
    const cantidad = obtenerNumeroSeguro(producto.cantidad);
    const stockMinimo = obtenerNumeroSeguro(producto.stockMinimo);

    if (stockMinimo > 0) {
      if (cantidad < stockMinimo) {
        agregarAlerta(alertas, {
          id: `inventario-critico-${producto.id}`,
          tipo: "critica",
          categoria: "Inventario",
          titulo: "Inventario critico",
          mensaje: `${producto.nombre}: quedan ${producto.cantidad} ${producto.unidad}. Minimo requerido: ${producto.stockMinimo} ${producto.unidad}.`,
          icono: ICONS.notification,
          color: COLORS.error,
          prioridad: 4,
        });
      }

      if (cantidad >= stockMinimo && cantidad <= stockMinimo * 1.5) {
        agregarAlerta(alertas, {
          id: `inventario-bajo-${producto.id}`,
          tipo: "advertencia",
          categoria: "Inventario",
          titulo: "Inventario por agotarse",
          mensaje: `${producto.nombre}: quedan ${producto.cantidad} ${producto.unidad}. Conviene reabastecer pronto.`,
          icono: ICONS.notification,
          color: COLORS.warning,
          prioridad: 7,
        });
      }
    }
  });

  return alertas;
}

function obtenerAlertasCosecha(siembras) {
  const alertas = [];

  siembras.forEach(function (siembra) {
    const diasCultivo = obtenerNumeroSeguro(siembra.diasCultivo);
    const diasMaduracion = obtenerNumeroSeguro(
      siembra.diasMaduracion || siembra.duracionDias,
    );
    const diasRestantes = diasMaduracion - diasCultivo;
    const estado = obtenerTextoSeguro(siembra.estado, "").toLowerCase();
    const fecha = obtenerTextoSeguro(siembra.fechaSiembra, siembra.fechaInicio);

    if (
      estado.includes("activa") === true ||
      estado.includes("activo") === true
    ) {
      if (diasRestantes <= 0) {
        agregarAlerta(alertas, {
          id: `cosecha-vencida-${siembra.siembraId}`,
          tipo: "critica",
          categoria: "Cosecha",
          titulo: "Cosecha pendiente",
          mensaje: `${siembra.estanque} · ${siembra.finca}: fecha ${fecha}, ya cumplio ${diasMaduracion} dias de maduracion.`,
          fecha: fecha,
          diasRestantes: diasRestantes,
          icono: ICONS.shrimp,
          color: COLORS.error,
          prioridad: 2,
        });
      }

      if (diasRestantes > 0 && diasRestantes <= 20) {
        agregarAlerta(alertas, {
          id: `cosecha-pronta-${siembra.siembraId}`,
          tipo: "advertencia",
          categoria: "Cosecha",
          titulo: "Cosecha proxima",
          mensaje: `${siembra.estanque} · ${siembra.finca}: fecha ${fecha}, faltan ${diasRestantes} dias para cosechar.`,
          fecha: fecha,
          diasRestantes: diasRestantes,
          icono: ICONS.shrimp,
          color: COLORS.warning,
          prioridad: 3,
        });
      }
    }
  });

  return alertas;
}

function obtenerAlertasEstanques(estanques) {
  const alertas = [];

  estanques.forEach(function (estanque) {
    const diasCultivo = obtenerNumeroSeguro(estanque.diasCultivo);
    const estado = obtenerTextoSeguro(estanque.estado, "").toLowerCase();

    if (estado === "activo" && diasCultivo >= 90) {
      agregarAlerta(alertas, {
        id: `estanque-cultivo-avanzado-${estanque.id}`,
        tipo: "advertencia",
        categoria: "Estanques",
        titulo: "Cultivo avanzado",
        mensaje: `${estanque.codigo} · ${estanque.fincaNombre}: tiene ${diasCultivo} dias de cultivo. Revisar cosecha o muestreo.`,
        icono: ICONS.waterFlow,
        color: COLORS.warning,
        prioridad: 5,
      });
    }

    if (estado.includes("prepar") === true) {
      agregarAlerta(alertas, {
        id: `estanque-preparacion-${estanque.id}`,
        tipo: "info",
        categoria: "Estanques",
        titulo: "Estanque en preparacion",
        mensaje: `${estanque.codigo} · ${estanque.fincaNombre}: pendiente de siembra o validacion operativa.`,
        icono: ICONS.waterFlow,
        color: COLORS.primary,
        prioridad: 9,
      });
    }
  });

  return alertas;
}

function obtenerHoraNumero(horaTexto) {
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

function esMismaFecha(fechaUno, fechaDos) {
  const primera = parsearFecha(fechaUno);
  const segunda = parsearFecha(fechaDos);
  let misma = false;

  if (
    primera.getDate() === segunda.getDate() &&
    primera.getMonth() === segunda.getMonth() &&
    primera.getFullYear() === segunda.getFullYear()
  ) {
    misma = true;
  }

  return misma;
}

function existeAlimentacionRegistrada(alimentaciones, horaProgramada) {
  let existe = false;
  const hoy = new Date();

  alimentaciones.forEach(function (registro) {
    const horaRegistro = obtenerHoraNumero(registro.hora);

    if (
      esMismaFecha(registro.fecha, hoy) === true &&
      horaRegistro === horaProgramada
    ) {
      existe = true;
    }
  });

  return existe;
}

function obtenerAlertasAlimentacion(alimentaciones) {
  const alertas = [];
  const ahora = new Date();
  const horaActual = ahora.getHours();
  const horarios = [
    { id: "manana", hora: 7, etiqueta: "7:00 AM" },
    { id: "tarde", hora: 15, etiqueta: "3:00 PM" },
  ];

  horarios.forEach(function (horario) {
    const yaRegistro = existeAlimentacionRegistrada(
      alimentaciones,
      horario.hora,
    );

    if (horaActual >= horario.hora && yaRegistro === false) {
      agregarAlerta(alertas, {
        id: `alimentacion-pendiente-${horario.id}`,
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
        id: `alimentacion-proxima-${horario.id}`,
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

function obtenerEquiposPorTipo(equipos, tipoBuscado) {
  const resultado = [];

  equipos.forEach(function (equipo) {
    const tipo = obtenerTextoSeguro(equipo.tipo, "").toLowerCase();

    if (tipo.includes(tipoBuscado) === true) {
      resultado.push(equipo);
    }
  });

  return resultado;
}

function obtenerNombresEquipos(equipos) {
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

function obtenerMinutosHora(horaTexto) {
  const partes = horaTexto.split(":");
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

function obtenerAlertasBombeo(equipos) {
  const alertas = [];
  const equiposBombeo = obtenerEquiposPorTipo(equipos, "bombeo");
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
  const horarios = [
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
  let horarioActivo = null;
  let siguiente = null;
  let diferenciaMenor = 1440;

  horarios.forEach(function (horario) {
    const inicio = obtenerMinutosHora(horario.inicio);
    const fin = obtenerMinutosHora(horario.fin);

    if (minutosActuales >= inicio && minutosActuales <= fin) {
      horarioActivo = horario;
    }

    let diferencia = inicio - minutosActuales;

    if (diferencia < 0) {
      diferencia = diferencia + 1440;
    }

    if (diferencia < diferenciaMenor) {
      diferenciaMenor = diferencia;
      siguiente = horario;
    }
  });

  const equiposTexto = obtenerNombresEquipos(equiposBombeo);

  if (horarioActivo !== null) {
    agregarAlerta(alertas, {
      id: `bombeo-activo-${horarioActivo.id}`,
      tipo: "info",
      categoria: "Bombeo",
      titulo: "Bombeo en curso",
      mensaje: `Horario activo: ${horarioActivo.etiqueta}. Equipos: ${equiposTexto}.`,
      icono: ICONS.waterFlow,
      color: COLORS.primary,
      prioridad: 9,
    });
  }

  if (horarioActivo === null && siguiente !== null) {
    if (diferenciaMenor <= 60) {
      agregarAlerta(alertas, {
        id: `bombeo-proximo-${siguiente.id}`,
        tipo: "advertencia",
        categoria: "Bombeo",
        titulo: "Bombeo proximo",
        mensaje: `Faltan ${diferenciaMenor} minutos para el bombeo de ${siguiente.etiqueta}. Equipos: ${equiposTexto}.`,
        icono: ICONS.waterFlow,
        color: COLORS.warning,
        prioridad: 6,
      });
    }
  }

  return alertas;
}

function calcularHorasUsoAireador(equipo) {
  const fechaInstalacion = parsearFecha(equipo.fechaInstalacion);
  const hoy = new Date();
  const diferencia = hoy.getTime() - fechaInstalacion.getTime();
  let dias = Math.floor(diferencia / 86400000);

  if (dias < 0) {
    dias = 0;
  }

  return dias * HORAS_USO_AIREADOR_DIA;
}

function obtenerHorasRestantesMantenimiento(horasUso) {
  const residuo = horasUso % CICLO_MANTENIMIENTO_AIREADOR;
  let restantes = CICLO_MANTENIMIENTO_AIREADOR - residuo;

  if (residuo === 0) {
    restantes = CICLO_MANTENIMIENTO_AIREADOR;
  }

  return restantes;
}

function obtenerAlertasAireadores(equipos) {
  const alertas = [];
  const aireadores = obtenerEquiposPorTipo(equipos, "aire");

  aireadores.forEach(function (equipo) {
    const horasUso = calcularHorasUsoAireador(equipo);
    const horasRestantes = obtenerHorasRestantesMantenimiento(horasUso);

    if (horasRestantes <= UMBRAL_CRITICO_AIREADOR) {
      agregarAlerta(alertas, {
        id: `aireador-critico-${equipo.id}`,
        tipo: "critica",
        categoria: "Aireadores",
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
        categoria: "Aireadores",
        titulo: "Mantenimiento de aireador cercano",
        mensaje: `${equipo.nombre} ${equipo.serie} · ${equipo.ubicacion}: faltan ${horasRestantes} horas para mantenimiento.`,
        icono: ICONS.wind,
        color: COLORS.warning,
        prioridad: 6,
      });
    }
  });

  return alertas;
}

function obtenerPrimerNombreEnfermedad(registro) {
  let nombre = "Enfermedad registrada";

  if (Array.isArray(registro.enfermedades) === true) {
    if (registro.enfermedades.length > 0) {
      nombre = registro.enfermedades[0];
    }
  }

  return nombre;
}

function obtenerAlertasSanitarias(
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
        categoria: "Sanitaria",
        titulo: "Peligro sanitario",
        mensaje: `${obtenerPrimerNombreEnfermedad(registro)} en ${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}.`,
        icono: ICONS.shieldAlert,
        color: COLORS.error,
        prioridad: 1,
      });
    }
  });

  registrosParasitologia.forEach(function (registro) {
    const grado = obtenerNumeroSeguro(registro.gradoInfeccion);

    if (grado >= 3) {
      agregarAlerta(alertas, {
        id: `sanitaria-parasito-${registro.id}`,
        tipo: "advertencia",
        categoria: "Sanitaria",
        titulo: "Parasitologia elevada",
        mensaje: `${obtenerTextoSeguro(registro.parasitoNombre, registro.parasito)} en ${obtenerTextoSeguro(registro.estanque, "Sin estanque")}: ${obtenerTextoSeguro(registro.nombreGrado, `Grado ${grado}`)}.`,
        icono: ICONS.parasite,
        color: COLORS.warning,
        prioridad: 2,
      });
    }
  });

  return alertas;
}

export function construirAlertasOperativas(datos) {
  let alertas = [];
  const productosInventario = datos.productosInventario || [];
  const siembras = datos.siembras || [];
  const alimentaciones = datos.alimentaciones || [];
  const estanques = datos.estanques || [];
  const equipos = datos.equipos || [];
  const registrosEnfermedades = datos.registrosEnfermedades || [];
  const registrosParasitologia = datos.registrosParasitologia || [];

  alertas = alertas.concat(obtenerAlertasContaminacion(estanques));
  alertas = alertas.concat(
    obtenerAlertasSanitarias(registrosEnfermedades, registrosParasitologia),
  );
  alertas = alertas.concat(obtenerAlertasCosecha(siembras));
  alertas = alertas.concat(obtenerAlertasAireadores(equipos));
  alertas = alertas.concat(obtenerAlertasInventario(productosInventario));
  alertas = alertas.concat(obtenerAlertasEstanques(estanques));
  alertas = alertas.concat(obtenerAlertasBombeo(equipos));
  alertas = alertas.concat(obtenerAlertasAlimentacion(alimentaciones));

  alertas.sort(function (a, b) {
    return a.prioridad - b.prioridad;
  });

  return alertas;
}

export function agruparAlertasPorTipo(alertas) {
  return {
    critica: alertas.filter(function (alerta) {
      return alerta.tipo === "critica";
    }),
    advertencia: alertas.filter(function (alerta) {
      return alerta.tipo === "advertencia";
    }),
    info: alertas.filter(function (alerta) {
      return alerta.tipo === "info";
    }),
  };
}

export async function obtenerAlertasDescartadas() {
  try {
    const datos = await AsyncStorage.getItem(CLAVE_ALERTAS_DESCARTADAS);
    let lista = [];

    if (datos !== null) {
      lista = JSON.parse(datos);
    }

    return lista;
  } catch {
    return [];
  }
}

export async function guardarAlertasDescartadas(ids) {
  await AsyncStorage.setItem(CLAVE_ALERTAS_DESCARTADAS, JSON.stringify(ids));
}

export async function descartarAlerta(id) {
  const lista = await obtenerAlertasDescartadas();
  let existe = false;

  lista.forEach(function (item) {
    if (item === id) {
      existe = true;
    }
  });

  if (existe === false) {
    lista.push(id);
  }

  await guardarAlertasDescartadas(lista);

  return lista;
}

export function filtrarAlertasDescartadas(alertas, descartadas) {
  return alertas.filter(function (alerta) {
    let descartada = false;

    descartadas.forEach(function (id) {
      if (id === alerta.id) {
        descartada = true;
      }
    });

    return descartada === false;
  });
}
