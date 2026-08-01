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

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

const CLAVE_ALERTAS_DESCARTADAS =
  "caprocam_alertas_descartadas_v1";

const UMBRAL_MANTENIMIENTO_AIREADOR = 80;
const UMBRAL_CRITICO_AIREADOR = 20;

/*
============================================================
FUNCIONES GENERALES
============================================================
*/

function obtenerTextoSeguro(valor, respaldo) {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return respaldo;
  }

  return String(valor).trim();
}

function obtenerNumeroSeguro(valor) {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return 0;
  }

  const numero = Number(
    String(valor).replace(",", "."),
  );

  if (Number.isNaN(numero) === true) {
    return 0;
  }

  return numero;
}

function parsearFecha(valor) {
  if (valor instanceof Date) {
    return valor;
  }

  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return null;
  }

  const texto = String(valor).slice(0, 10);

  if (texto.includes("-") === true) {
    const partes = texto.split("-");

    if (partes.length === 3) {
      const fecha = new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2]),
      );

      if (Number.isNaN(fecha.getTime()) === false) {
        return fecha;
      }
    }
  }

  if (texto.includes("/") === true) {
    const partes = texto.split("/");

    if (partes.length === 3) {
      const fecha = new Date(
        Number(partes[2]),
        Number(partes[1]) - 1,
        Number(partes[0]),
      );

      if (Number.isNaN(fecha.getTime()) === false) {
        return fecha;
      }
    }
  }

  return null;
}

function agregarAlerta(alertas, alerta) {
  alertas.push({
    id: alerta.id,
    tipo: alerta.tipo,
    categoria: alerta.categoria,
    titulo: alerta.titulo,
    mensaje: alerta.mensaje,
    detalle: obtenerTextoSeguro(
      alerta.detalle,
      "",
    ),
    fecha: obtenerTextoSeguro(
      alerta.fecha,
      "",
    ),
    diasRestantes:
      alerta.diasRestantes,
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

function obtenerAlertasInventario(
  productosInventario,
) {
  const alertas = [];

  productosInventario.forEach(
    function (producto) {
      const cantidad =
        obtenerNumeroSeguro(
          producto.cantidad,
        );

      const stockMinimo =
        obtenerNumeroSeguro(
          producto.stockMinimo,
        );

      const nombre =
        obtenerTextoSeguro(
          producto.nombre,
          "Producto sin nombre",
        );

      const unidad =
        obtenerTextoSeguro(
          producto.unidad,
          "unidades",
        );

      if (
        stockMinimo > 0 &&
        cantidad < stockMinimo
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "inventario-critico-" +
              producto.id,
            tipo: "critica",
            categoria: "Inventario",
            titulo:
              "Inventario critico",
            mensaje:
              nombre +
              ": quedan " +
              cantidad +
              " " +
              unidad +
              ". Minimo requerido: " +
              stockMinimo +
              " " +
              unidad +
              ".",
            icono:
              ICONS.notification,
            color:
              COLORS.error,
            prioridad: 3,
          },
        );
      }

      if (
        stockMinimo > 0 &&
        cantidad >= stockMinimo &&
        cantidad <= stockMinimo * 1.5
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "inventario-bajo-" +
              producto.id,
            tipo:
              "advertencia",
            categoria: "Inventario",
            titulo:
              "Inventario por agotarse",
            mensaje:
              nombre +
              ": quedan " +
              cantidad +
              " " +
              unidad +
              ". Conviene reabastecer pronto.",
            icono:
              ICONS.notification,
            color:
              COLORS.warning,
            prioridad: 7,
          },
        );
      }
    },
  );

  return alertas;
}

/*
============================================================
COSECHA
============================================================
*/

function obtenerAlertasCosecha(siembras) {
  const alertas = [];

  siembras.forEach(
    function (siembra) {
      const diasCultivo =
        obtenerNumeroSeguro(
          siembra.diasCultivo,
        );

      let diasMaduracion =
        obtenerNumeroSeguro(
          siembra.diasMaduracion,
        );

      if (diasMaduracion === 0) {
        diasMaduracion =
          obtenerNumeroSeguro(
            siembra.duracionCiclo,
          );
      }

      const diasRestantes =
        diasMaduracion -
        diasCultivo;

      const estado =
        obtenerTextoSeguro(
          siembra.estado,
          "",
        ).toLowerCase();

      const finca =
        obtenerTextoSeguro(
          siembra.finca,
          "Sin finca",
        );

      const estanque =
        obtenerTextoSeguro(
          siembra.estanque,
          "Sin estanque",
        );

      const fecha =
        obtenerTextoSeguro(
          siembra.fechaSiembra,
          "",
        );

      if (
        estado.includes("activa") === true ||
        estado.includes("activo") === true
      ) {
        if (
          diasMaduracion > 0 &&
          diasRestantes <= 0
        ) {
          agregarAlerta(
            alertas,
            {
              id:
                "cosecha-vencida-" +
                siembra.siembraId,
              tipo: "critica",
              categoria: "Cosecha",
              titulo:
                "Cosecha pendiente",
              mensaje:
                estanque +
                " · " +
                finca +
                ": ya cumplio " +
                diasMaduracion +
                " dias de maduracion.",
              detalle:
                "Fecha de siembra: " +
                fecha +
                ".",
              fecha: fecha,
              diasRestantes:
                diasRestantes,
              icono: ICONS.shrimp,
              color: COLORS.error,
              prioridad: 2,
            },
          );
        }

        if (
          diasMaduracion > 0 &&
          diasRestantes > 0 &&
          diasRestantes <= 20
        ) {
          agregarAlerta(
            alertas,
            {
              id:
                "cosecha-pronta-" +
                siembra.siembraId,
              tipo:
                "advertencia",
              categoria: "Cosecha",
              titulo:
                "Cosecha proxima",
              mensaje:
                estanque +
                " · " +
                finca +
                ": faltan " +
                diasRestantes +
                " dias para cosechar.",
              detalle:
                "Fecha de siembra: " +
                fecha +
                ".",
              fecha: fecha,
              diasRestantes:
                diasRestantes,
              icono: ICONS.shrimp,
              color: COLORS.warning,
              prioridad: 3,
            },
          );
        }
      }
    },
  );

  return alertas;
}

/*
============================================================
ESTANQUES
============================================================
*/

function obtenerAlertasEstanques(estanques) {
  const alertas = [];

  estanques.forEach(
    function (estanque) {
      const diasCultivo =
        obtenerNumeroSeguro(
          estanque.diasCultivo,
        );

      const estado =
        obtenerTextoSeguro(
          estanque.estado,
          "",
        ).toLowerCase();

      const finca =
        obtenerTextoSeguro(
          estanque.fincaNombre,
          estanque.finca,
        );

      if (
        estado === "activo" &&
        diasCultivo >= 90
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "estanque-cultivo-avanzado-" +
              estanque.id,
            tipo:
              "advertencia",
            categoria: "Estanques",
            titulo:
              "Cultivo avanzado",
            mensaje:
              estanque.codigo +
              " · " +
              finca +
              ": tiene " +
              diasCultivo +
              " dias de cultivo.",
            detalle:
              "Revisar cosecha o muestreo.",
            icono:
              ICONS.waterFlow,
            color:
              COLORS.warning,
            prioridad: 5,
          },
        );
      }

      if (
        estado.includes("prepar") === true
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "estanque-preparacion-" +
              estanque.id,
            tipo: "info",
            categoria: "Estanques",
            titulo:
              "Estanque en preparacion",
            mensaje:
              estanque.codigo +
              " · " +
              finca +
              ": pendiente de siembra o validacion operativa.",
            icono:
              ICONS.waterFlow,
            color:
              COLORS.primary,
            prioridad: 9,
          },
        );
      }
    },
  );

  return alertas;
}

/*
============================================================
ALIMENTACION
============================================================
*/

function obtenerHoraNumero(horaTexto) {
  let hora = -1;

  const texto =
    obtenerTextoSeguro(
      horaTexto,
      "",
    ).toLowerCase();

  if (texto !== "") {
    const partes = texto.split(":");
    const posibleHora = Number(
      partes[0],
    );

    if (Number.isNaN(posibleHora) === false) {
      hora = posibleHora;
    }

    if (
      texto.includes("pm") === true &&
      hora < 12
    ) {
      hora = hora + 12;
    }

    if (
      texto.includes("am") === true &&
      hora === 12
    ) {
      hora = 0;
    }
  }

  return hora;
}

function esMismaFecha(fechaUno, fechaDos) {
  const primera = parsearFecha(fechaUno);
  const segunda = parsearFecha(fechaDos);

  if (primera === null || segunda === null) {
    return false;
  }

  if (
    primera.getDate() === segunda.getDate() &&
    primera.getMonth() === segunda.getMonth() &&
    primera.getFullYear() === segunda.getFullYear()
  ) {
    return true;
  }

  return false;
}

function existeAlimentacionRegistrada(
  alimentaciones,
  horaProgramada,
) {
  let existe = false;
  const hoy = new Date();

  alimentaciones.forEach(
    function (registro) {
      const horaRegistro =
        obtenerHoraNumero(
          registro.hora,
        );

      if (
        esMismaFecha(
          registro.fecha,
          hoy,
        ) === true &&
        horaRegistro === horaProgramada
      ) {
        existe = true;
      }
    },
  );

  return existe;
}

function obtenerAlertasAlimentacion(
  alimentaciones,
) {
  const alertas = [];
  const ahora = new Date();
  const horaActual = ahora.getHours();

  const horarios = [
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

  horarios.forEach(
    function (horario) {
      const yaRegistro =
        existeAlimentacionRegistrada(
          alimentaciones,
          horario.hora,
        );

      if (
        horaActual >= horario.hora &&
        yaRegistro === false
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "alimentacion-pendiente-" +
              horario.id,
            tipo:
              "advertencia",
            categoria:
              "Alimentacion",
            titulo:
              "Alimentacion pendiente",
            mensaje:
              "No se encontro registro de alimentacion de las " +
              horario.etiqueta +
              " para hoy.",
            icono: ICONS.food,
            color: COLORS.warning,
            prioridad: 8,
          },
        );
      }

      if (
        horaActual < horario.hora &&
        horario.hora - horaActual <= 1
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "alimentacion-proxima-" +
              horario.id,
            tipo: "info",
            categoria:
              "Alimentacion",
            titulo:
              "Alimentacion proxima",
            mensaje:
              "Se aproxima la alimentacion programada de las " +
              horario.etiqueta +
              ".",
            icono: ICONS.clock,
            color: COLORS.primary,
            prioridad: 10,
          },
        );
      }
    },
  );

  return alertas;
}

/*
============================================================
EQUIPOS
============================================================
*/

function obtenerEquiposPorTipo(
  equipos,
  tipoBuscado,
) {
  const resultado = [];

  equipos.forEach(
    function (equipo) {
      const tipo =
        obtenerTextoSeguro(
          equipo.tipoEquipo,
          equipo.tipo,
        ).toLowerCase();

      if (
        tipo.includes(
          tipoBuscado,
        ) === true
      ) {
        resultado.push(equipo);
      }
    },
  );

  return resultado;
}

function obtenerNombreEquipo(equipo) {
  return obtenerTextoSeguro(
    equipo.nombreEquipo,
    obtenerTextoSeguro(
      equipo.nombre,
      "Equipo",
    ),
  );
}

function obtenerSerieEquipo(equipo) {
  return obtenerTextoSeguro(
    equipo.identificador,
    obtenerTextoSeguro(
      equipo.serie,
      "",
    ),
  );
}

function obtenerNombresEquipos(equipos) {
  if (equipos.length === 0) {
    return "equipos registrados";
  }

  const nombres = [];

  equipos.forEach(
    function (equipo) {
      nombres.push(
        (
          obtenerNombreEquipo(equipo) +
          " " +
          obtenerSerieEquipo(equipo)
        ).trim(),
      );
    },
  );

  return nombres.join(", ");
}

/*
============================================================
BOMBEO
============================================================
*/

function obtenerMinutosHora(horaTexto) {
  const partes = String(
    horaTexto,
  ).split(":");

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

  const equiposBombeo =
    obtenerEquiposPorTipo(
      equipos,
      "bombeo",
    );

  const ahora = new Date();

  const minutosActuales =
    ahora.getHours() * 60 +
    ahora.getMinutes();

  const horarios = [
    {
      id: "bombeo-manana",
      inicio: "06:00",
      fin: "08:00",
      etiqueta:
        "6:00 AM - 8:00 AM",
    },
    {
      id: "bombeo-mediodia",
      inicio: "12:00",
      fin: "13:00",
      etiqueta:
        "12:00 PM - 1:00 PM",
    },
    {
      id: "bombeo-tarde",
      inicio: "17:00",
      fin: "19:00",
      etiqueta:
        "5:00 PM - 7:00 PM",
    },
  ];

  let horarioActivo = null;
  let siguiente = null;
  let diferenciaMenor = 1440;

  horarios.forEach(
    function (horario) {
      const inicio =
        obtenerMinutosHora(
          horario.inicio,
        );

      const fin =
        obtenerMinutosHora(
          horario.fin,
        );

      if (
        minutosActuales >= inicio &&
        minutosActuales <= fin
      ) {
        horarioActivo = horario;
      }

      let diferencia =
        inicio - minutosActuales;

      if (diferencia < 0) {
        diferencia =
          diferencia + 1440;
      }

      if (
        diferencia <
        diferenciaMenor
      ) {
        diferenciaMenor =
          diferencia;

        siguiente = horario;
      }
    },
  );

  const equiposTexto =
    obtenerNombresEquipos(
      equiposBombeo,
    );

  if (
    horarioActivo !== null &&
    equiposBombeo.length > 0
  ) {
    agregarAlerta(
      alertas,
      {
        id:
          "bombeo-activo-" +
          horarioActivo.id,
        tipo: "info",
        categoria: "Bombeo",
        titulo:
          "Bombeo en curso",
        mensaje:
          "Horario activo: " +
          horarioActivo.etiqueta +
          ". Equipos: " +
          equiposTexto +
          ".",
        icono:
          ICONS.waterFlow,
        color:
          COLORS.primary,
        prioridad: 9,
      },
    );
  }

  if (
    horarioActivo === null &&
    siguiente !== null &&
    diferenciaMenor <= 60 &&
    equiposBombeo.length > 0
  ) {
    agregarAlerta(
      alertas,
      {
        id:
          "bombeo-proximo-" +
          siguiente.id,
        tipo:
          "advertencia",
        categoria: "Bombeo",
        titulo:
          "Bombeo proximo",
        mensaje:
          "Faltan " +
          diferenciaMenor +
          " minutos para el bombeo de " +
          siguiente.etiqueta +
          ". Equipos: " +
          equiposTexto +
          ".",
        icono:
          ICONS.waterFlow,
        color:
          COLORS.warning,
        prioridad: 6,
      },
    );
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

  const aireadores =
    obtenerEquiposPorTipo(
      equipos,
      "aire",
    );

  aireadores.forEach(
    function (equipo) {
      const horasMantenimiento =
        obtenerNumeroSeguro(
          equipo.horasMantenimiento,
        );

      const horasActuales =
        obtenerNumeroSeguro(
          equipo.horasActuales,
        );

      let horasRestantes =
        horasMantenimiento -
        horasActuales;

      if (horasRestantes < 0) {
        horasRestantes = 0;
      }

      if (horasMantenimiento <= 0) {
        return;
      }

      const nombre =
        obtenerNombreEquipo(equipo);

      const serie =
        obtenerSerieEquipo(equipo);

      const ubicacion =
        obtenerTextoSeguro(
          equipo.estanqueCodigo,
          obtenerTextoSeguro(
            equipo.ubicacion,
            "Sin estanque",
          ),
        );

      if (
        horasRestantes <=
        UMBRAL_CRITICO_AIREADOR
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "aireador-critico-" +
              equipo.id,
            tipo: "critica",
            categoria: "Aireadores",
            titulo:
              "Aireador casi en mantenimiento",
            mensaje:
              nombre +
              " " +
              serie +
              " · " +
              ubicacion +
              ": faltan " +
              horasRestantes +
              " horas para mantenimiento preventivo.",
            icono: ICONS.wind,
            color: COLORS.error,
            prioridad: 3,
          },
        );
      }

      if (
        horasRestantes >
          UMBRAL_CRITICO_AIREADOR &&
        horasRestantes <=
          UMBRAL_MANTENIMIENTO_AIREADOR
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "aireador-cercano-" +
              equipo.id,
            tipo:
              "advertencia",
            categoria: "Aireadores",
            titulo:
              "Mantenimiento de aireador cercano",
            mensaje:
              nombre +
              " " +
              serie +
              " · " +
              ubicacion +
              ": faltan " +
              horasRestantes +
              " horas para mantenimiento.",
            icono: ICONS.wind,
            color: COLORS.warning,
            prioridad: 6,
          },
        );
      }
    },
  );

  return alertas;
}

/*
============================================================
SANIDAD
============================================================
*/

function obtenerAlertasSanitarias(
  registrosEnfermedades,
  registrosParasitologia,
) {
  const alertas = [];

  registrosEnfermedades.forEach(
    function (registro) {
      const severidad =
        obtenerTextoSeguro(
          registro.severidad,
          "",
        ).toLowerCase();

      if (
        severidad === "alto" ||
        severidad === "alta" ||
        severidad === "critica"
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "sanitaria-enfermedad-" +
              registro.id,
            tipo: "critica",
            categoria: "Sanitaria",
            titulo:
              "Peligro sanitario",
            mensaje:
              obtenerTextoSeguro(
                registro.enfermedadNombre,
                registro.enfermedad,
              ) +
              " en " +
              obtenerTextoSeguro(
                registro.estanque,
                "Sin estanque",
              ) +
              " · " +
              obtenerTextoSeguro(
                registro.fincaNombre,
                registro.finca,
              ) +
              ".",
            icono:
              ICONS.shieldAlert,
            color:
              COLORS.error,
            prioridad: 1,
          },
        );
      }
    },
  );

  registrosParasitologia.forEach(
    function (registro) {
      const grado =
        obtenerTextoSeguro(
          registro.gradoInfeccion,
          "",
        ).toLowerCase();

      if (
        grado === "alto" ||
        grado === "alta"
      ) {
        agregarAlerta(
          alertas,
          {
            id:
              "sanitaria-parasito-" +
              registro.id,
            tipo:
              "advertencia",
            categoria: "Sanitaria",
            titulo:
              "Parasitologia elevada",
            mensaje:
              obtenerTextoSeguro(
                registro.parasitoNombre,
                registro.parasito,
              ) +
              " en " +
              obtenerTextoSeguro(
                registro.estanque,
                "Sin estanque",
              ) +
              ": " +
              obtenerTextoSeguro(
                registro.nombreGrado,
                grado,
              ) +
              ".",
            icono:
              ICONS.parasite,
            color:
              COLORS.warning,
            prioridad: 2,
          },
        );
      }
    },
  );

  return alertas;
}

/*
============================================================
CONSTRUCCION PRINCIPAL
============================================================
*/

export function construirAlertasOperativas(
  datos,
) {
  let alertas = [];

  const productosInventario =
    Array.isArray(
      datos.productosInventario,
    )
      ? datos.productosInventario
      : [];

  const siembras =
    Array.isArray(datos.siembras)
      ? datos.siembras
      : [];

  const alimentaciones =
    Array.isArray(
      datos.alimentaciones,
    )
      ? datos.alimentaciones
      : [];

  const estanques =
    Array.isArray(datos.estanques)
      ? datos.estanques
      : [];

  const equipos =
    Array.isArray(datos.equipos)
      ? datos.equipos
      : [];

  const registrosEnfermedades =
    Array.isArray(
      datos.registrosEnfermedades,
    )
      ? datos.registrosEnfermedades
      : [];

  const registrosParasitologia =
    Array.isArray(
      datos.registrosParasitologia,
    )
      ? datos.registrosParasitologia
      : [];

  alertas = alertas.concat(
    obtenerAlertasSanitarias(
      registrosEnfermedades,
      registrosParasitologia,
    ),
  );

  alertas = alertas.concat(
    obtenerAlertasCosecha(
      siembras,
    ),
  );

  alertas = alertas.concat(
    obtenerAlertasAireadores(
      equipos,
    ),
  );

  alertas = alertas.concat(
    obtenerAlertasInventario(
      productosInventario,
    ),
  );

  alertas = alertas.concat(
    obtenerAlertasEstanques(
      estanques,
    ),
  );

  alertas = alertas.concat(
    obtenerAlertasBombeo(
      equipos,
    ),
  );

  alertas = alertas.concat(
    obtenerAlertasAlimentacion(
      alimentaciones,
    ),
  );

  alertas.sort(
    function (a, b) {
      return (
        a.prioridad -
        b.prioridad
      );
    },
  );

  return alertas;
}

/*
============================================================
AGRUPACION
============================================================
*/

export function agruparAlertasPorTipo(
  alertas,
) {
  return {
    critica: alertas.filter(
      function (alerta) {
        return (
          alerta.tipo ===
          "critica"
        );
      },
    ),

    advertencia: alertas.filter(
      function (alerta) {
        return (
          alerta.tipo ===
          "advertencia"
        );
      },
    ),

    info: alertas.filter(
      function (alerta) {
        return (
          alerta.tipo ===
          "info"
        );
      },
    ),
  };
}

/*
============================================================
ALERTAS DESCARTADAS
============================================================
*/

export async function obtenerAlertasDescartadas() {
  try {
    const datos =
      await AsyncStorage.getItem(
        CLAVE_ALERTAS_DESCARTADAS,
      );

    if (datos === null) {
      return [];
    }

    const lista = JSON.parse(datos);

    if (Array.isArray(lista) === true) {
      return lista;
    }

    return [];
  } catch (error) {
    console.error(
      "Error leyendo alertas descartadas:",
      error,
    );

    return [];
  }
}

export async function guardarAlertasDescartadas(
  ids,
) {
  await AsyncStorage.setItem(
    CLAVE_ALERTAS_DESCARTADAS,
    JSON.stringify(ids),
  );
}

export async function descartarAlerta(id) {
  const lista =
    await obtenerAlertasDescartadas();

  let existe = false;

  lista.forEach(
    function (item) {
      if (item === id) {
        existe = true;
      }
    },
  );

  if (existe === false) {
    lista.push(id);
  }

  await guardarAlertasDescartadas(
    lista,
  );

  return lista;
}

export function filtrarAlertasDescartadas(
  alertas,
  descartadas,
) {
  return alertas.filter(
    function (alerta) {
      let descartada = false;

      descartadas.forEach(
        function (id) {
          if (id === alerta.id) {
            descartada = true;
          }
        },
      );

      return descartada === false;
    },
  );
}