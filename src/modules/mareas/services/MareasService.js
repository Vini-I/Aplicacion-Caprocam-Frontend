/**
 * ============================================================
 * SERVICIO MAREAS
 * ============================================================
 *
 * Servicio para cargar informacion de mareas desde Tablademareas.
 *
 * Fuente principal:
 * https://tablademareas.com/cr/costa-oceano-pacifico/puntarenas/prevision/mareas
 *
 * Importante:
 * - En Expo Web puede fallar el fetch por CORS.
 * - Si la pagina bloquea la lectura directa, se usa un respaldo local
 *   con la misma estructura para que la pantalla siempre funcione.
 * - En produccion lo ideal es mover esta consulta a un backend.
 */

export const ZONAS_MAREAS_PACIFICO_CR = [
  {
    id: "puntarenas",
    nombre: "Puntarenas",
    subtitulo: "Puerto Base",
    url: "https://tablademareas.com/cr/costa-oceano-pacifico/puntarenas/prevision/mareas",
  },
  {
    id: "caldera",
    nombre: "Caldera",
    subtitulo: "Pacífico Central",
    url: "https://tablademareas.com/cr/costa-oceano-pacifico/caldera/prevision/mareas",
  },
  {
    id: "jaco",
    nombre: "Jacó",
    subtitulo: "Pacífico Central",
    url: "https://tablademareas.com/cr/costa-oceano-pacifico/jaco/prevision/mareas",
  },
  {
    id: "playa-hermosa-puntarenas",
    nombre: "Playa Hermosa",
    subtitulo: "Puntarenas",
    url: "https://tablademareas.com/cr/costa-oceano-pacifico/playa-hermosa-puntarenas/prevision/mareas",
  },
];

const TABLA_RESPALDO_PUNTARENAS = [
  {
    dia: 3,
    mes: "Jul",
    diaSemana: "Vie",
    amanecer: "5:21 am",
    atardecer: "6:05 pm",
    coeficiente: 69,
    actividad: "Medio",
    mareas: [
      {
        tipo: "P",
        hora: "5:05 am",
        alturaM: 2.6,
        coeficiente: 69,
      },
      {
        tipo: "B",
        hora: "11:02 am",
        alturaM: 0.4,
        coeficiente: 69,
      },
      {
        tipo: "P",
        hora: "5:12 pm",
        alturaM: 2.6,
        coeficiente: 68,
      },
      {
        tipo: "B",
        hora: "11:20 pm",
        alturaM: 0.2,
        coeficiente: 68,
      },
    ],
  },
  {
    dia: 4,
    mes: "Jul",
    diaSemana: "Sáb",
    amanecer: "5:22 am",
    atardecer: "6:05 pm",
    coeficiente: 66,
    actividad: "Medio",
    mareas: [
      {
        tipo: "P",
        hora: "5:42 am",
        alturaM: 2.6,
        coeficiente: 66,
      },
      {
        tipo: "B",
        hora: "11:41 am",
        alturaM: 0.4,
        coeficiente: 66,
      },
      {
        tipo: "P",
        hora: "5:51 pm",
        alturaM: 2.5,
        coeficiente: 65,
      },
      {
        tipo: "B",
        hora: "11:57 pm",
        alturaM: 0.2,
        coeficiente: 65,
      },
    ],
  },
  {
    dia: 5,
    mes: "Jul",
    diaSemana: "Dom",
    amanecer: "5:22 am",
    atardecer: "6:05 pm",
    coeficiente: 63,
    actividad: "Medio",
    mareas: [
      {
        tipo: "P",
        hora: "6:20 am",
        alturaM: 2.6,
        coeficiente: 63,
      },
      {
        tipo: "B",
        hora: "12:22 pm",
        alturaM: 0.4,
        coeficiente: 62,
      },
      {
        tipo: "P",
        hora: "6:31 pm",
        alturaM: 2.5,
        coeficiente: 62,
      },
    ],
  },
  {
    dia: 6,
    mes: "Jul",
    diaSemana: "Lun",
    amanecer: "5:22 am",
    atardecer: "6:05 pm",
    coeficiente: 60,
    actividad: "Medio",
    mareas: [
      {
        tipo: "B",
        hora: "12:34 am",
        alturaM: 0.3,
        coeficiente: 60,
      },
      {
        tipo: "P",
        hora: "6:59 am",
        alturaM: 2.6,
        coeficiente: 60,
      },
      {
        tipo: "B",
        hora: "1:05 pm",
        alturaM: 0.4,
        coeficiente: 58,
      },
      {
        tipo: "P",
        hora: "7:14 pm",
        alturaM: 2.4,
        coeficiente: 58,
      },
    ],
  },
  {
    dia: 7,
    mes: "Jul",
    diaSemana: "Mar",
    amanecer: "5:22 am",
    atardecer: "6:06 pm",
    coeficiente: 57,
    actividad: "Medio",
    mareas: [
      {
        tipo: "B",
        hora: "1:14 am",
        alturaM: 0.3,
        coeficiente: 57,
      },
      {
        tipo: "P",
        hora: "7:41 am",
        alturaM: 2.6,
        coeficiente: 57,
      },
      {
        tipo: "B",
        hora: "1:52 pm",
        alturaM: 0.4,
        coeficiente: 56,
      },
      {
        tipo: "P",
        hora: "8:01 pm",
        alturaM: 2.3,
        coeficiente: 56,
      },
    ],
  },
  {
    dia: 8,
    mes: "Jul",
    diaSemana: "Mié",
    amanecer: "5:22 am",
    atardecer: "6:06 pm",
    coeficiente: 55,
    actividad: "Medio",
    mareas: [
      {
        tipo: "B",
        hora: "1:59 am",
        alturaM: 0.4,
        coeficiente: 55,
      },
      {
        tipo: "P",
        hora: "8:28 am",
        alturaM: 2.6,
        coeficiente: 55,
      },
      {
        tipo: "B",
        hora: "2:43 pm",
        alturaM: 0.4,
        coeficiente: 55,
      },
      {
        tipo: "P",
        hora: "8:54 pm",
        alturaM: 2.3,
        coeficiente: 55,
      },
    ],
  },
  {
    dia: 9,
    mes: "Jul",
    diaSemana: "Jue",
    amanecer: "5:22 am",
    atardecer: "6:06 pm",
    coeficiente: 56,
    actividad: "Medio",
    mareas: [
      {
        tipo: "B",
        hora: "2:50 am",
        alturaM: 0.4,
        coeficiente: 56,
      },
      {
        tipo: "P",
        hora: "9:21 am",
        alturaM: 2.6,
        coeficiente: 56,
      },
      {
        tipo: "B",
        hora: "3:41 pm",
        alturaM: 0.4,
        coeficiente: 58,
      },
      {
        tipo: "P",
        hora: "9:54 pm",
        alturaM: 2.2,
        coeficiente: 58,
      },
    ],
  },
];

function obtenerZonaPorId(zonaId) {
  let zonaEncontrada = ZONAS_MAREAS_PACIFICO_CR[0];

  ZONAS_MAREAS_PACIFICO_CR.forEach(function (zona) {
    if (zona.id === zonaId) {
      zonaEncontrada = zona;
    }
  });

  return zonaEncontrada;
}

function limpiarTextoHtml(html) {
  let texto = html;

  texto = texto.replace(/<script[\s\S]*?<\/script>/gi, " ");
  texto = texto.replace(/<style[\s\S]*?<\/style>/gi, " ");
  texto = texto.replace(/<[^>]+>/g, "\n");
  texto = texto.replace(/&nbsp;/g, " ");
  texto = texto.replace(/&amp;/g, "&");
  texto = texto.replace(/&#x2F;/g, "/");
  texto = texto.replace(/\r/g, "\n");
  texto = texto.replace(/\n+/g, "\n");

  return texto;
}

function convertirDecimal(textoNumero) {
  let numero = 0;

  if (textoNumero !== undefined && textoNumero !== null) {
    const texto = String(textoNumero).replace(",", ".");
    const convertido = Number(texto);

    if (Number.isNaN(convertido) === false) {
      numero = convertido;
    }
  }

  return numero;
}

function obtenerTipoPorAltura(alturaM) {
  let tipo = "B";

  if (alturaM >= 1.5) {
    tipo = "P";
  }

  return tipo;
}

function parsearTablaSemanal(html) {
  const textoPlano = limpiarTextoHtml(html);
  const lineasOriginales = textoPlano.split("\n");
  const lineas = [];

  lineasOriginales.forEach(function (linea) {
    const limpia = linea.trim();

    if (limpia !== "") {
      lineas.push(limpia);
    }
  });

  const resultado = [];

  lineas.forEach(function (linea, index) {
    const esFecha = /^\d{2}\s+[A-ZÁÉÍÓÚ]{3}$/i.test(linea);

    if (esFecha === true) {
      const partesFecha = linea.split(" ");
      const dia = Number(partesFecha[0]);
      const mes = partesFecha[1];
      let diaSemana = "Día";

      if (lineas[index + 1] !== undefined) {
        const partesDia = lineas[index + 1].split(" ");
        diaSemana = partesDia[0];
      }

      const mareas = [];
      let coeficiente = 0;

      let contador = index;
      const limite = index + 30;

      while (contador < lineas.length && contador < limite) {
        const lineaMarea = lineas[contador];
        const matchMarea = lineaMarea.match(
          /(\d{1,2}:\d{2}\s*(am|pm))\s+(-?\d+(,\d+)?)\s*m\s+(\d+)/i,
        );

        if (matchMarea !== null) {
          const hora = matchMarea[1];
          const alturaM = convertirDecimal(matchMarea[3]);
          const coef = Number(matchMarea[5]);
          const tipo = obtenerTipoPorAltura(alturaM);

          if (coeficiente === 0) {
            coeficiente = coef;
          }

          mareas.push({
            tipo: tipo,
            hora: hora,
            alturaM: alturaM,
            coeficiente: coef,
          });
        }

        contador = contador + 1;
      }

      if (mareas.length > 0) {
        resultado.push({
          dia: dia,
          mes: mes,
          diaSemana: diaSemana,
          amanecer: "5:20 am",
          atardecer: "6:05 pm",
          coeficiente: coeficiente,
          actividad: obtenerActividadCoeficiente(coeficiente),
          mareas: mareas,
        });
      }
    }
  });

  return resultado;
}

function obtenerActividadCoeficiente(coeficiente) {
  let actividad = "Bajo";

  if (coeficiente >= 50) {
    actividad = "Medio";
  }

  if (coeficiente >= 80) {
    actividad = "Alto";
  }

  return actividad;
}

function convertirHoraAMinutos(horaTexto) {
  let minutosTotales = 0;
  const texto = String(horaTexto).toLowerCase().trim();
  const partes = texto.split(" ");
  const horaPartes = partes[0].split(":");

  let horas = Number(horaPartes[0]);
  let minutos = Number(horaPartes[1]);

  if (Number.isNaN(horas) === true) {
    horas = 0;
  }

  if (Number.isNaN(minutos) === true) {
    minutos = 0;
  }

  if (texto.includes("pm") === true && horas < 12) {
    horas = horas + 12;
  }

  if (texto.includes("am") === true && horas === 12) {
    horas = 0;
  }

  minutosTotales = horas * 60 + minutos;

  return minutosTotales;
}

function formatearDuracion(minutos) {
  let texto = "Ahora";

  if (minutos > 0) {
    const horas = Math.floor(minutos / 60);
    const restantes = minutos % 60;

    if (horas > 0) {
      texto = `En ${horas}h ${restantes}m`;
    }

    if (horas === 0) {
      texto = `En ${restantes}m`;
    }
  }

  return texto;
}

function obtenerEstadoActual(tabla) {
  const hoy = tabla[0];
  const mareas = hoy.mareas;
  const fecha = new Date();
  const minutosActuales = fecha.getHours() * 60 + fecha.getMinutes();

  let anterior = mareas[0];
  let siguiente = mareas[0];
  let diferenciaMenor = 1440;

  mareas.forEach(function (marea) {
    const minutosMarea = convertirHoraAMinutos(marea.hora);
    let diferencia = minutosMarea - minutosActuales;

    if (diferencia < 0) {
      diferencia = diferencia + 1440;
    }

    if (diferencia < diferenciaMenor) {
      diferenciaMenor = diferencia;
      siguiente = marea;
    }

    if (minutosMarea <= minutosActuales) {
      anterior = marea;
    }
  });

  let tendencia = "bajando";
  let etiquetaTendencia = "Vaciante";

  if (siguiente.tipo === "P") {
    tendencia = "subiendo";
    etiquetaTendencia = "Creciente";
  }

  let nivelEstimadoM = siguiente.alturaM;

  if (anterior !== undefined && anterior !== null) {
    nivelEstimadoM = (anterior.alturaM + siguiente.alturaM) / 2;
  }

  return {
    nivelM: nivelEstimadoM,
    tendencia: tendencia,
    etiquetaTendencia: etiquetaTendencia,
    siguienteTipo: siguiente.tipo,
    siguienteHora: siguiente.hora,
    siguienteAlturaM: siguiente.alturaM,
    tiempoRestante: formatearDuracion(diferenciaMenor),
  };
}

function obtenerIndicadores(tabla) {
  const hoy = tabla[0];
  const coeficiente = hoy.coeficiente;
  let categoria = "Mareas bajas";

  if (coeficiente >= 50) {
    categoria = "Mareas medias";
  }

  if (coeficiente >= 80) {
    categoria = "Mareas altas";
  }

  return {
    coeficiente: coeficiente,
    categoria: categoria,
    descripcion: "Condiciones de recambio y operación para estanques.",
    amanecer: hoy.amanecer,
    atardecer: hoy.atardecer,
  };
}

function obtenerFaseLunar() {
  return {
    nombre: "Luna Llena",
    porcentaje: 100,
    descripcion: "Fase usada como referencia operativa.",
    fecha: "29 de junio de 2026 a las 5:57 pm",
    proximas: [
      {
        nombre: "Llena",
        fecha: "29 Jun",
        porcentaje: 100,
      },
      {
        nombre: "Menguante",
        fecha: "07 Jul",
        porcentaje: 50,
      },
      {
        nombre: "Nueva",
        fecha: "14 Jul",
        porcentaje: 0,
      },
      {
        nombre: "Creciente",
        fecha: "21 Jul",
        porcentaje: 50,
      },
    ],
  };
}

function construirCurvaDiaria(tabla) {
  const hoy = tabla[0];
  const puntos = [];

  hoy.mareas.forEach(function (marea) {
    puntos.push({
      hora: marea.hora,
      alturaM: marea.alturaM,
      tipo: marea.tipo,
    });
  });

  if (puntos.length === 0) {
    puntos.push({
      hora: "12:00 am",
      alturaM: 1.4,
      tipo: "N",
    });
  }

  return puntos;
}

function restarMinutosAHora(hora, minutosRestar) {
  const minutosBase = convertirHoraAMinutos(hora);
  let total = minutosBase - minutosRestar;

  if (total < 0) {
    total = total + 1440;
  }

  return formatearMinutosAHora(total);
}

function sumarMinutosAHora(hora, minutosSumar) {
  const minutosBase = convertirHoraAMinutos(hora);
  let total = minutosBase + minutosSumar;

  if (total >= 1440) {
    total = total - 1440;
  }

  return formatearMinutosAHora(total);
}

function formatearMinutosAHora(minutosTotales) {
  let horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;
  let periodo = "am";

  if (horas >= 12) {
    periodo = "pm";
  }

  if (horas === 0) {
    horas = 12;
  }

  if (horas > 12) {
    horas = horas - 12;
  }

  return `${horas}:${String(minutos).padStart(2, "0")} ${periodo}`;
}

function construirVentanasOperativas(tabla) {
  const hoy = tabla[0];
  const llenado = [];
  const cosecha = [];

  hoy.mareas.forEach(function (marea) {
    if (marea.tipo === "P") {
      llenado.push({
        id: `llenado-${marea.hora}`,
        inicio: restarMinutosAHora(marea.hora, 90),
        fin: sumarMinutosAHora(marea.hora, 30),
        detalle: "Llenado por gravedad",
        nivel: marea.alturaM,
      });
    }

    if (marea.tipo === "B") {
      cosecha.push({
        id: `cosecha-${marea.hora}`,
        inicio: restarMinutosAHora(marea.hora, 45),
        fin: sumarMinutosAHora(marea.hora, 45),
        detalle: "Cosecha/Drenaje rápido",
        nivel: marea.alturaM,
      });
    }
  });

  return {
    llenado: llenado,
    cosecha: cosecha,
    navegacion: {
      estado: "Canal navegable",
      descripcion: "Profundidad segura para transporte de insumos y cosechas.",
    },
  };
}

function construirDatosMareas(zona, tabla, modoRespaldo) {
  return {
    zona: zona,
    fuente: "Tablademareas.com",
    modoRespaldo: modoRespaldo,
    actualizado: new Date().toISOString(),
    estadoActual: obtenerEstadoActual(tabla),
    indicadores: obtenerIndicadores(tabla),
    faseLunar: obtenerFaseLunar(),
    curvaDiaria: construirCurvaDiaria(tabla),
    tablaMensual: tabla,
    ventanas: construirVentanasOperativas(tabla),
  };
}

export async function obtenerDatosMareas(zonaId) {
  const zona = obtenerZonaPorId(zonaId);
  let datos = null;

  try {
    const respuesta = await fetch(zona.url);
    const html = await respuesta.text();

    if (respuesta.ok === true) {
      const tabla = parsearTablaSemanal(html);

      if (tabla.length > 0) {
        datos = construirDatosMareas(zona, tabla, false);
      }
    }
  } catch (error) {
    datos = null;
  }

  if (datos === null) {
    datos = construirDatosMareas(zona, TABLA_RESPALDO_PUNTARENAS, true);
  }

  return datos;
}
