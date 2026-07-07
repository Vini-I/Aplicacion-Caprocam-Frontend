/**
 * ============================================================
 * PANTALLA DASHBOARD GENERAL
 * ============================================================
 *
 * Dashboard principal de Caprocam.
 *
 * FUNCIONALIDAD:
 * 1. Header celeste usando COLORS.primary.
 * 2. Muestra alertas operativas:
 *    - Inventario bajo o crítico.
 *    - Cosecha cercana o vencida.
 *    - Alimentación pendiente o próxima.
 *    - Horas de bombeo activas o próximas.
 *    - Mantenimiento cercano de aireadores.
 *    - Alertas sanitarias de enfermedades y parasitología.
 *
 * 3. Muestra cards de resumen:
 *    - Fincas registradas.
 *    - Estanques registrados.
 *    - Casos sanitarios.
 *    - Mortalidad total.
 *
 * 4. Al tocar una card se despliega su información.
 * 5. Si se toca de nuevo la misma card, se cierra.
 * 6. Las gráficas se actualizan cada pocos segundos leyendo los datos.
 * 7. El gráfico de estanques muestra activos y cosechados.
 *
 * IMPORTANTE:
 * - No modifica el login.
 * - No cambia rutas.
 * - Usa la estructura existente del proyecto.
 */

import React, { useEffect, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import { fincas as fincasModulo } from "../../finca/screens/FincaData";
import { estanques as estanquesModulo } from "../../mantCrecimiento/services/EstanqueData";
import { obtenerSiembras } from "../../siembra/services/SiembraService";
import useAlimentacion from "../../alimentacion/hooks/useAlimentacion";
import { getProductosInventario } from "../../inventarios/services/InventarioService";
import { EQUIPOS_MOCK } from "../../mantEquipo/services/mantEquipoService";

import enfermedadesService, {
  obtenerNombreEnfermedad,
} from "../../enfermedades/services/EnfermedadesService";

import parasitologiaService, {
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

function formatearNumero(valor) {
  const numero = obtenerNumeroSeguro(valor);

  return numero.toLocaleString("es-CR");
}

function convertirFecha(fechaTexto) {
  let fecha = null;

  if (fechaTexto instanceof Date) {
    fecha = fechaTexto;
  }

  if (fecha === null && typeof fechaTexto === "string") {
    if (fechaTexto.includes("/") === true) {
      const partes = fechaTexto.split("/");

      if (partes.length === 3) {
        const dia = Number(partes[0]);
        const mes = Number(partes[1]) - 1;
        const anio = Number(partes[2]);

        fecha = new Date(anio, mes, dia);
      }
    }

    if (fechaTexto.includes("-") === true) {
      fecha = new Date(fechaTexto);
    }
  }

  if (fecha === null) {
    fecha = new Date();
  }

  return fecha;
}

function formatearFechaCorta(fechaTexto) {
  const fecha = convertirFecha(fechaTexto);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function obtenerDiaSemana(fechaTexto) {
  const fecha = convertirFecha(fechaTexto);
  const dias = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  return dias[fecha.getDay()];
}

function esMismaFecha(fechaUno, fechaDos) {
  const primeraFecha = convertirFecha(fechaUno);
  const segundaFecha = convertirFecha(fechaDos);
  let esIgual = false;

  if (
    primeraFecha.getDate() === segundaFecha.getDate() &&
    primeraFecha.getMonth() === segundaFecha.getMonth() &&
    primeraFecha.getFullYear() === segundaFecha.getFullYear()
  ) {
    esIgual = true;
  }

  return esIgual;
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

function obtenerResumenEnfermedadesVacio() {
  return {
    totalCasos: 0,
    totalMortalidad: 0,
    enfermedadesFrecuentes: [],
    severidadesFrecuentes: [],
  };
}

function obtenerResumenParasitologiaVacio() {
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

function agregarAlerta(alertas, alerta) {
  alertas.push({
    id: alerta.id,
    tipo: alerta.tipo,
    titulo: alerta.titulo,
    mensaje: alerta.mensaje,
    icono: alerta.icono,
    color: alerta.color,
    prioridad: alerta.prioridad,
  });
}

function construirFincasDashboard(fincas, estanques) {
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
    let existe = false;

    resultado.forEach(function (finca) {
      if (finca.nombre === estanque.fincaNombre) {
        existe = true;
      }
    });

    if (existe === false) {
      resultado.push({
        id: `finca-${estanque.fincaId}-${estanque.fincaNombre}`,
        nombre: estanque.fincaNombre,
        ubicacion: "Registrada en estanques",
        area: 0,
        estanques: 0,
      });
    }
  });

  return resultado;
}

function contarEstanquesPorFinca(nombreFinca, estanques) {
  let total = 0;

  estanques.forEach(function (estanque) {
    if (estanque.fincaNombre === nombreFinca) {
      total = total + 1;
    }
  });

  return total;
}

function obtenerTotalEstanquesFinca(finca, estanques) {
  let total = contarEstanquesPorFinca(finca.nombre, estanques);

  if (total === 0) {
    total = obtenerNumeroSeguro(finca.estanques);
  }

  return total;
}

function obtenerMayorEstanquesFinca(fincas, estanques) {
  let mayor = 1;

  fincas.forEach(function (finca) {
    const total = obtenerTotalEstanquesFinca(finca, estanques);

    if (total > mayor) {
      mayor = total;
    }
  });

  return mayor;
}

function obtenerPorcentaje(valor, mayor) {
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

function obtenerEstanquesActivos(estanques) {
  let total = 0;

  estanques.forEach(function (estanque) {
    const estado = obtenerTextoSeguro(estanque.estado, "").toLowerCase();

    if (estado === "activo") {
      total = total + 1;
    }
  });

  return total;
}

function obtenerEstanquesCosechados(estanques) {
  let total = 0;

  estanques.forEach(function (estanque) {
    const estado = obtenerTextoSeguro(estanque.estado, "").toLowerCase();

    if (estado === "cosechado") {
      total = total + 1;
    }
  });

  return total;
}

function obtenerAlimentacionSemanal(alimentaciones) {
  const dias = [
    { id: 1, dia: "Lun", kg: 0 },
    { id: 2, dia: "Mar", kg: 0 },
    { id: 3, dia: "Mie", kg: 0 },
    { id: 4, dia: "Jue", kg: 0 },
    { id: 5, dia: "Vie", kg: 0 },
    { id: 6, dia: "Sab", kg: 0 },
    { id: 7, dia: "Dom", kg: 0 },
  ];

  alimentaciones.forEach(function (registro) {
    const diaRegistro = obtenerDiaSemana(registro.fecha);

    dias.forEach(function (dia) {
      if (dia.dia === diaRegistro) {
        dia.kg = dia.kg + obtenerNumeroSeguro(registro.cantidadKg);
      }
    });
  });

  return dias;
}

function obtenerMayorKgSemanal(alimentacionSemanal) {
  let mayor = 1;

  alimentacionSemanal.forEach(function (item) {
    if (obtenerNumeroSeguro(item.kg) > mayor) {
      mayor = obtenerNumeroSeguro(item.kg);
    }
  });

  return mayor;
}

function obtenerTotalCasosSanitarios(
  resumenEnfermedades,
  resumenParasitologia,
) {
  const enfermedades = obtenerNumeroSeguro(resumenEnfermedades.totalCasos);
  const parasitos = obtenerNumeroSeguro(resumenParasitologia.totalRegistros);

  return enfermedades + parasitos;
}

function obtenerMortalidadTotal(resumenEnfermedades) {
  return obtenerNumeroSeguro(resumenEnfermedades.totalMortalidad);
}

function obtenerColorEstado(estado) {
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

function obtenerEstiloSeveridad(severidad) {
  const estilos = [styles.badge];
  const texto = obtenerTextoSeguro(severidad, "").toLowerCase();

  if (texto === "alta" || texto === "critica") {
    estilos.push(styles.badgeAlta);
  }

  if (texto === "media") {
    estilos.push(styles.badgeMedia);
  }

  if (texto === "baja") {
    estilos.push(styles.badgeBaja);
  }

  return estilos;
}

function obtenerColorSeveridad(severidad) {
  let color = COLORS.textTertiary;
  const texto = obtenerTextoSeguro(severidad, "").toLowerCase();

  if (texto === "alta" || texto === "critica") {
    color = COLORS.error;
  }

  if (texto === "media") {
    color = COLORS.warning;
  }

  if (texto === "baja") {
    color = COLORS.success;
  }

  return color;
}

function obtenerPrimerNombreEnfermedad(registro) {
  let nombre = "Enfermedad registrada";

  if (Array.isArray(registro.enfermedades) === true) {
    if (registro.enfermedades.length > 0) {
      nombre = obtenerNombreEnfermedad(registro.enfermedades[0]);
    }
  }

  return nombre;
}

function obtenerCasosSanitarios(registrosEnfermedades, registrosParasitologia) {
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
    return (
      convertirFecha(b.timestamp).getTime() -
      convertirFecha(a.timestamp).getTime()
    );
  });

  return casos.slice(0, 6);
}

function obtenerRegistrosMortalidad(registrosEnfermedades) {
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
        timestamp: obtenerTextoSeguro(
          registro.timestamp,
          registro.fechaReporte,
        ),
      });
    }
  });

  registros.sort(function (a, b) {
    return (
      convertirFecha(b.timestamp).getTime() -
      convertirFecha(a.timestamp).getTime()
    );
  });

  return registros.slice(0, 6);
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
          titulo: "Inventario crítico",
          mensaje: `${producto.nombre}: quedan ${producto.cantidad} ${producto.unidad}. Mínimo requerido: ${producto.stockMinimo} ${producto.unidad}.`,
          icono: ICONS.notification,
          color: COLORS.error,
          prioridad: 1,
        });
      }

      if (cantidad >= stockMinimo && cantidad <= stockMinimo * 1.5) {
        agregarAlerta(alertas, {
          id: `inventario-bajo-${producto.id}`,
          tipo: "advertencia",
          titulo: "Inventario por agotarse",
          mensaje: `${producto.nombre}: quedan ${producto.cantidad} ${producto.unidad}. Conviene reabastecer pronto.`,
          icono: ICONS.notification,
          color: COLORS.warning,
          prioridad: 2,
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
    const diasMaduracion = obtenerNumeroSeguro(siembra.diasMaduracion);
    const diasRestantes = diasMaduracion - diasCultivo;
    const estado = obtenerTextoSeguro(siembra.estado, "").toLowerCase();

    if (
      estado.includes("activa") === true ||
      estado.includes("activo") === true
    ) {
      if (diasRestantes <= 0) {
        agregarAlerta(alertas, {
          id: `cosecha-vencida-${siembra.siembraId}`,
          tipo: "critica",
          titulo: "Cosecha pendiente",
          mensaje: `${siembra.estanque} · ${siembra.finca}: ya cumplió los ${diasMaduracion} días de maduración.`,
          icono: ICONS.shrimp,
          color: COLORS.error,
          prioridad: 1,
        });
      }

      if (diasRestantes > 0 && diasRestantes <= 15) {
        agregarAlerta(alertas, {
          id: `cosecha-pronta-${siembra.siembraId}`,
          tipo: "advertencia",
          titulo: "Cosecha próxima",
          mensaje: `${siembra.estanque} · ${siembra.finca}: faltan ${diasRestantes} días para cosecha.`,
          icono: ICONS.shrimp,
          color: COLORS.warning,
          prioridad: 2,
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
        titulo: "Cultivo avanzado",
        mensaje: `${estanque.codigo} · ${estanque.fincaNombre}: tiene ${diasCultivo} días de cultivo. Revisar cosecha o muestreo.`,
        icono: ICONS.waterFlow,
        color: COLORS.warning,
        prioridad: 2,
      });
    }

    if (estado.includes("prepar") === true) {
      agregarAlerta(alertas, {
        id: `estanque-preparacion-${estanque.id}`,
        tipo: "info",
        titulo: "Estanque en preparación",
        mensaje: `${estanque.codigo} · ${estanque.fincaNombre}: pendiente de siembra o validación operativa.`,
        icono: ICONS.waterFlow,
        color: COLORS.primary,
        prioridad: 4,
      });
    }
  });

  return alertas;
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

  HORARIOS_ALIMENTACION.forEach(function (horario) {
    const yaRegistro = existeAlimentacionRegistrada(
      alimentaciones,
      horario.hora,
    );

    if (horaActual >= horario.hora && yaRegistro === false) {
      agregarAlerta(alertas, {
        id: `alimentacion-pendiente-${horario.id}`,
        tipo: "advertencia",
        titulo: "Alimentación pendiente",
        mensaje: `No se encontró registro de alimentación de las ${horario.etiqueta} para hoy.`,
        icono: ICONS.food,
        color: COLORS.warning,
        prioridad: 2,
      });
    }

    if (horaActual < horario.hora && horario.hora - horaActual <= 1) {
      agregarAlerta(alertas, {
        id: `alimentacion-proxima-${horario.id}`,
        tipo: "info",
        titulo: "Alimentación próxima",
        mensaje: `Se aproxima la alimentación programada de las ${horario.etiqueta}.`,
        icono: ICONS.clock,
        color: COLORS.primary,
        prioridad: 4,
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

function obtenerHorarioBombeoActivo(minutosActuales) {
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

function obtenerSiguienteHorarioBombeo(minutosActuales) {
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

function obtenerAlertasBombeo(equipos) {
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
      titulo: "Bombeo en curso",
      mensaje: `Horario activo: ${horarioActivo.etiqueta}. Equipos: ${equiposTexto}.`,
      icono: ICONS.waterFlow,
      color: COLORS.primary,
      prioridad: 3,
    });
  }

  if (horarioActivo === null && siguienteHorario.horario !== null) {
    if (siguienteHorario.minutosRestantes <= 60) {
      agregarAlerta(alertas, {
        id: `bombeo-proximo-${siguienteHorario.horario.id}`,
        tipo: "advertencia",
        titulo: "Bombeo próximo",
        mensaje: `Faltan ${siguienteHorario.minutosRestantes} minutos para el bombeo de ${siguienteHorario.horario.etiqueta}. Equipos: ${equiposTexto}.`,
        icono: ICONS.waterFlow,
        color: COLORS.warning,
        prioridad: 2,
      });
    }

    if (siguienteHorario.minutosRestantes > 60) {
      agregarAlerta(alertas, {
        id: `bombeo-siguiente-${siguienteHorario.horario.id}`,
        tipo: "info",
        titulo: "Próxima hora de bombeo",
        mensaje: `Siguiente bombeo programado: ${siguienteHorario.horario.etiqueta}. Equipos: ${equiposTexto}.`,
        icono: ICONS.clock,
        color: COLORS.primary,
        prioridad: 5,
      });
    }
  }

  return alertas;
}

function calcularHorasUsoAireador(equipo) {
  const fechaInstalacion = convertirFecha(equipo.fechaInstalacion);
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
        titulo: "Aireador casi en mantenimiento",
        mensaje: `${equipo.nombre} ${equipo.serie} · ${equipo.ubicacion}: faltan ${horasRestantes} horas para mantenimiento preventivo.`,
        icono: ICONS.wind,
        color: COLORS.error,
        prioridad: 1,
      });
    }

    if (
      horasRestantes > UMBRAL_CRITICO_AIREADOR &&
      horasRestantes <= UMBRAL_MANTENIMIENTO_AIREADOR
    ) {
      agregarAlerta(alertas, {
        id: `aireador-cercano-${equipo.id}`,
        tipo: "advertencia",
        titulo: "Mantenimiento de aireador cercano",
        mensaje: `${equipo.nombre} ${equipo.serie} · ${equipo.ubicacion}: faltan ${horasRestantes} horas para mantenimiento.`,
        icono: ICONS.wind,
        color: COLORS.warning,
        prioridad: 2,
      });
    }
  });

  if (alertas.length === 0 && aireadorMasCercano !== null) {
    agregarAlerta(alertas, {
      id: `aireador-proximo-${aireadorMasCercano.id}`,
      tipo: "info",
      titulo: "Próximo mantenimiento de aireador",
      mensaje: `${aireadorMasCercano.nombre} ${aireadorMasCercano.serie}: faltan ${horasMasCercanas} horas para mantenimiento preventivo.`,
      icono: ICONS.wind,
      color: COLORS.primary,
      prioridad: 5,
    });
  }

  return alertas;
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
        titulo: "Peligro sanitario",
        mensaje: `${obtenerPrimerNombreEnfermedad(registro)} en ${obtenerTextoSeguro(
          registro.estanque,
          "Sin estanque",
        )} · ${obtenerTextoSeguro(registro.fincaNombre, registro.finca)}.`,
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
        titulo: "Parasitología elevada",
        mensaje: `${obtenerNombreParasito(registro.parasito)} en ${obtenerTextoSeguro(
          registro.estanque,
          "Sin estanque",
        )}: ${obtenerTextoSeguro(registro.nombreGrado, `Grado ${grado}`)}.`,
        icono: ICONS.parasite,
        color: COLORS.warning,
        prioridad: 2,
      });
    }
  });

  return alertas;
}

function obtenerAlertasDashboard(
  productosInventario,
  siembras,
  alimentaciones,
  estanques,
  equipos,
  registrosEnfermedades,
  registrosParasitologia,
) {
  let alertas = [];

  alertas = alertas.concat(obtenerAlertasInventario(productosInventario));
  alertas = alertas.concat(obtenerAlertasCosecha(siembras));
  alertas = alertas.concat(obtenerAlertasEstanques(estanques));
  alertas = alertas.concat(obtenerAlertasAlimentacion(alimentaciones));
  alertas = alertas.concat(obtenerAlertasBombeo(equipos));
  alertas = alertas.concat(obtenerAlertasAireadores(equipos));
  alertas = alertas.concat(
    obtenerAlertasSanitarias(registrosEnfermedades, registrosParasitologia),
  );

  alertas.sort(function (a, b) {
    return a.prioridad - b.prioridad;
  });

  return alertas.slice(0, 10);
}

function obtenerEstiloAlerta(tipo) {
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

function obtenerTextoTipoAlerta(tipo) {
  let texto = "Info";

  if (tipo === "critica") {
    texto = "Crítica";
  }

  if (tipo === "advertencia") {
    texto = "Advertencia";
  }

  return texto;
}

function obtenerUltimosRegistros(
  alimentaciones,
  siembras,
  registrosEnfermedades,
  registrosParasitologia,
) {
  const registros = [];

  alimentaciones.forEach(function (registro) {
    registros.push({
      id: `alimentacion-${registro.id}`,
      modulo: "Alimentación",
      detalle: `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(
        registro.finca,
        "Sin finca",
      )}`,
      fechaVisible: obtenerTextoSeguro(
        registro.hora,
        formatearFechaCorta(registro.fecha),
      ),
      fechaOrden: convertirFecha(
        obtenerTextoSeguro(registro.timestamp, registro.fecha),
      ).getTime(),
    });
  });

  siembras.forEach(function (siembra) {
    registros.push({
      id: `siembra-${siembra.siembraId}`,
      modulo: "Siembra",
      detalle: `${siembra.estanque} · ${siembra.finca}`,
      fechaVisible: siembra.fechaSiembra,
      fechaOrden: convertirFecha(siembra.fechaSiembra).getTime(),
    });
  });

  registrosEnfermedades.forEach(function (registro) {
    registros.push({
      id: `enfermedad-${registro.id}`,
      modulo: "Enfermedades",
      detalle: `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(
        registro.fincaNombre,
        registro.finca,
      )}`,
      fechaVisible: formatearFechaCorta(
        obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
      ),
      fechaOrden: convertirFecha(
        obtenerTextoSeguro(registro.timestamp, registro.fechaReporte),
      ).getTime(),
    });
  });

  registrosParasitologia.forEach(function (registro) {
    registros.push({
      id: `parasitologia-${registro.id}`,
      modulo: "Parasitología",
      detalle: `${obtenerTextoSeguro(registro.estanque, "Sin estanque")} · ${obtenerTextoSeguro(
        registro.fincaNombre,
        registro.finca,
      )}`,
      fechaVisible: formatearFechaCorta(
        obtenerTextoSeguro(registro.fechaReporte, registro.timestamp),
      ),
      fechaOrden: convertirFecha(
        obtenerTextoSeguro(registro.timestamp, registro.fechaReporte),
      ).getTime(),
    });
  });

  registros.sort(function (a, b) {
    return b.fechaOrden - a.fechaOrden;
  });

  return registros.slice(0, 5);
}

function SectionHeader({ icon, title, color }) {
  return (
    <View style={styles.sectionHeader}>
      <Icon icon={icon} size={18} color={color} />

      <Title level={6} style={styles.sectionTitle}>
        {title}
      </Title>
    </View>
  );
}

function EmptyMessage({ text }) {
  return (
    <View style={styles.emptyBox}>
      <CustomText size={12} color={COLORS.textTertiary} align="center">
        {text}
      </CustomText>
    </View>
  );
}

function AlertasPanel({ alertas }) {
  return (
    <Card style={styles.alertsCard}>
      <View style={styles.alertsHeader}>
        <View style={styles.alertsTitleBox}>
          <View style={styles.alertsIconBox}>
            <Icon icon={ICONS.notification} size={20} color={COLORS.warning} />
          </View>

          <View style={styles.alertsTextBox}>
            <Title level={6} style={styles.alertsTitle}>
              Alertas operativas
            </Title>

            <CustomText size={12} color={COLORS.textTertiary} numberOfLines={1}>
              Inventario, cosecha, alimentación, bombeo y aireadores
            </CustomText>
          </View>
        </View>

        <View style={styles.alertsCounter}>
          <CustomText size={13} weight="800" color={COLORS.warning}>
            {alertas.length}
          </CustomText>
        </View>
      </View>

      {alertas.length === 0 && (
        <View style={styles.emptyAlertBox}>
          <CustomText size={12} color={COLORS.textTertiary} align="center">
            No hay alertas importantes por el momento.
          </CustomText>
        </View>
      )}

      {alertas.map(function (alerta) {
        return (
          <View key={alerta.id} style={obtenerEstiloAlerta(alerta.tipo)}>
            <View style={styles.alertIconContainer}>
              <Icon icon={alerta.icono} size={18} color={alerta.color} />
            </View>

            <View style={styles.alertContent}>
              <View style={styles.alertTitleRow}>
                <CustomText
                  size={14}
                  weight="800"
                  color={COLORS.textSecondary}
                  numberOfLines={1}
                >
                  {alerta.titulo}
                </CustomText>

                <View style={styles.alertBadge}>
                  <CustomText size={10} weight="700" color={alerta.color}>
                    {obtenerTextoTipoAlerta(alerta.tipo)}
                  </CustomText>
                </View>
              </View>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.alertMessage}
              >
                {alerta.mensaje}
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function StatCard({
  id,
  selectedId,
  onPress,
  icon,
  value,
  label,
  cardStyle,
  iconStyle,
  iconColor,
  danger,
  isTablet,
}) {
  const cardStyles = [styles.statCard, cardStyle];

  if (isTablet === true) {
    cardStyles.push(styles.statCardTablet);
  }

  if (selectedId === id) {
    cardStyles.push(styles.statCardActive);
  }

  const iconBoxStyles = [styles.statIconBox, iconStyle];
  const valueStyles = [styles.statValue];

  if (danger === true) {
    valueStyles.push(styles.statValueDanger);
  }

  let chevronIcon = ICONS.chevronDown;

  if (selectedId === id) {
    chevronIcon = ICONS.chevronUp;
  }

  return (
    <Button style={cardStyles} onPress={onPress}>
      <View style={styles.statTopRow}>
        <View style={iconBoxStyles}>
          <Icon icon={icon} size={22} color={iconColor} />
        </View>

        <Icon icon={chevronIcon} size={20} color={COLORS.textQuaternary} />
      </View>

      <View style={styles.statBottom}>
        <CustomText style={valueStyles} numberOfLines={1}>
          {value}
        </CustomText>

        <CustomText
          size={13}
          color={COLORS.textTertiary}
          style={styles.statLabel}
          numberOfLines={1}
        >
          {label}
        </CustomText>
      </View>
    </Button>
  );
}

function FincasPanel({ fincas, estanques }) {
  const mayorEstanques = obtenerMayorEstanquesFinca(fincas, estanques);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.home}
        title="Fincas registradas"
        color={COLORS.primary}
      />

      <View style={styles.divider} />

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        ESTANQUES POR FINCA
      </CustomText>

      <View style={styles.barChart}>
        <View style={styles.chartGridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>

        <View style={styles.barChartContent}>
          {fincas.map(function (finca) {
            const totalEstanques = obtenerTotalEstanquesFinca(finca, estanques);
            const porcentaje = obtenerPorcentaje(
              totalEstanques,
              mayorEstanques,
            );

            return (
              <View key={finca.id} style={styles.barItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${porcentaje}%`,
                      },
                    ]}
                  />
                </View>

                <CustomText
                  size={10}
                  color={COLORS.textTertiary}
                  align="center"
                  numberOfLines={1}
                  style={styles.barLabel}
                >
                  {finca.nombre}
                </CustomText>
              </View>
            );
          })}
        </View>
      </View>

      {fincas.map(function (finca) {
        const totalEstanques = obtenerTotalEstanquesFinca(finca, estanques);

        return (
          <View key={finca.id} style={styles.infoRowBlue}>
            <View style={styles.rowIconBoxBlue}>
              <Icon icon={ICONS.home} size={20} color={COLORS.primary} />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {finca.nombre}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                numberOfLines={1}
                style={styles.rowDescription}
              >
                {finca.ubicacion} · {finca.area} ha
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <CustomText size={18} weight="800" color={COLORS.primary}>
                {totalEstanques}
              </CustomText>

              <CustomText size={11} color={COLORS.textTertiary}>
                estanques
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function EstanquesPanel({ estanques, alimentacionSemanal }) {
  const activos = obtenerEstanquesActivos(estanques);
  const cosechados = obtenerEstanquesCosechados(estanques);
  const totalGraficado = activos + cosechados;
  const mayorKg = obtenerMayorKgSemanal(alimentacionSemanal);

  let porcentajeActivos = 50;
  let porcentajeCosechados = 50;

  if (totalGraficado > 0) {
    porcentajeActivos = (activos / totalGraficado) * 100;
    porcentajeCosechados = (cosechados / totalGraficado) * 100;
  }

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.waterFlow}
        title="Estanques registrados"
        color="#2563EB"
      />

      <View style={styles.divider} />

      <View style={styles.twoColumns}>
        <View style={styles.chartColumn}>
          <CustomText
            size={13}
            color={COLORS.textTertiary}
            align="center"
            style={styles.panelSubtitle}
          >
            ACTIVOS Y COSECHADOS
          </CustomText>

          <View style={styles.donutWrapper}>
            <View style={styles.donutChart}>
              <View
                style={[
                  styles.donutActiveSegment,
                  {
                    width: `${porcentajeActivos}%`,
                  },
                ]}
              />

              <View
                style={[
                  styles.donutHarvestSegment,
                  {
                    width: `${porcentajeCosechados}%`,
                  },
                ]}
              />

              <View style={styles.donutInner}>
                <CustomText size={18} weight="800" color={COLORS.primary}>
                  {totalGraficado}
                </CustomText>

                <CustomText size={10} color={COLORS.textTertiary}>
                  total
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendBlue} />

              <CustomText size={11} color={COLORS.textTertiary}>
                Activos: {activos}
              </CustomText>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendGray} />

              <CustomText size={11} color={COLORS.textTertiary}>
                Cosechados: {cosechados}
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.chartColumn}>
          <CustomText
            size={13}
            color={COLORS.textTertiary}
            align="center"
            style={styles.panelSubtitle}
          >
            ALIMENTACIÓN SEMANAL KG
          </CustomText>

          <View style={styles.lineChart}>
            <View style={styles.chartGridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            <View style={styles.lineBars}>
              {alimentacionSemanal.map(function (item) {
                const porcentaje = obtenerPorcentaje(item.kg, mayorKg);

                return (
                  <View key={item.id} style={styles.lineItem}>
                    <View
                      style={[
                        styles.lineBar,
                        {
                          height: `${porcentaje}%`,
                        },
                      ]}
                    />

                    <CustomText
                      size={10}
                      color={COLORS.textTertiary}
                      align="center"
                    >
                      {item.dia}
                    </CustomText>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {estanques.map(function (estanque) {
        return (
          <View key={estanque.id} style={styles.infoRowIndigo}>
            <View style={styles.rowIconBoxIndigo}>
              <Icon icon={ICONS.waterFlow} size={20} color="#2563EB" />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {estanque.codigo}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {estanque.fincaNombre} · {estanque.area} ha
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <View style={styles.estadoBadge}>
                <CustomText
                  size={11}
                  color={obtenerColorEstado(estanque.estado)}
                  weight="700"
                >
                  {estanque.estado}
                </CustomText>
              </View>

              <CustomText size={11} color={COLORS.textTertiary}>
                {estanque.diasCultivo}d
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function CasosPanel({
  resumenEnfermedades,
  resumenParasitologia,
  registrosEnfermedades,
  registrosParasitologia,
}) {
  const casos = obtenerCasosSanitarios(
    registrosEnfermedades,
    registrosParasitologia,
  );

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.shieldAlert}
        title="Casos sanitarios"
        color={COLORS.warning}
      />

      <View style={styles.divider} />

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        CASOS MÁS FRECUENTES
      </CustomText>

      {resumenEnfermedades.enfermedadesFrecuentes.length === 0 &&
        resumenParasitologia.parasitosFrecuentes.length === 0 && (
          <EmptyMessage text="No hay casos sanitarios registrados." />
        )}

      {resumenEnfermedades.enfermedadesFrecuentes.map(function (item) {
        return (
          <View key={item.enfermedad} style={styles.diseaseRow}>
            <View style={styles.diseaseDotRed} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.nombre}
              </CustomText>
            </View>

            <CustomText size={15} weight="800" color={COLORS.textSecondary}>
              {item.casos}
            </CustomText>

            <CustomText
              size={12}
              color={COLORS.textTertiary}
              style={styles.caseText}
            >
              casos
            </CustomText>
          </View>
        );
      })}

      {resumenParasitologia.parasitosFrecuentes.map(function (item) {
        return (
          <View key={item.parasito} style={styles.diseaseRow}>
            <View style={styles.diseaseDotViolet} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.nombre}
              </CustomText>
            </View>

            <CustomText size={15} weight="800" color={COLORS.textSecondary}>
              {item.casos}
            </CustomText>

            <CustomText
              size={12}
              color={COLORS.textTertiary}
              style={styles.caseText}
            >
              casos
            </CustomText>
          </View>
        );
      })}

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        ÚLTIMOS CASOS
      </CustomText>

      {casos.length === 0 && (
        <EmptyMessage text="Aún no hay registros de enfermedades o parasitología." />
      )}

      {casos.map(function (caso) {
        return (
          <View key={caso.id} style={styles.caseRow}>
            <Icon icon={ICONS.alertTriangle} size={20} color={COLORS.warning} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {caso.nombre}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {caso.estanque} · {caso.finca}
              </CustomText>

              <CustomText size={12} color={COLORS.textQuaternary}>
                {formatearFechaCorta(caso.fecha)}
              </CustomText>
            </View>

            <View style={obtenerEstiloSeveridad(caso.severidad)}>
              <CustomText
                size={12}
                weight="700"
                color={obtenerColorSeveridad(caso.severidad)}
              >
                {caso.severidadNombre}
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function MortalidadPanel({ resumenEnfermedades, registrosEnfermedades }) {
  const registrosMortalidad = obtenerRegistrosMortalidad(registrosEnfermedades);
  const totalMortalidad = obtenerMortalidadTotal(resumenEnfermedades);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.mortality}
        title="Mortalidad registrada"
        color="#FF002A"
      />

      <View style={styles.divider} />

      <View style={styles.mortalityTotalBox}>
        <Icon icon={ICONS.report} size={34} color="#FF5A6D" />

        <View style={styles.totalBoxText}>
          <CustomText size={32} weight="900" color="#FF002A">
            {formatearNumero(totalMortalidad)}
          </CustomText>

          <CustomText size={13} color="#FF5A6D">
            individuos totales registrados
          </CustomText>
        </View>
      </View>

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        POR ESTANQUE
      </CustomText>

      {registrosMortalidad.length === 0 && (
        <EmptyMessage text="No hay mortalidad registrada en enfermedades." />
      )}

      {registrosMortalidad.map(function (item) {
        return (
          <View key={item.id} style={styles.mortalityRow}>
            <Icon icon={ICONS.shrimp} size={18} color="#FF5A6D" />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.estanque} · {item.finca}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {item.nombre} · {formatearFechaCorta(item.fecha)}
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <CustomText size={17} weight="900" color="#FF002A">
                {formatearNumero(item.mortalidad)}
              </CustomText>

              <CustomText size={11} color={COLORS.textTertiary}>
                ind.
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function UltimosRegistros({ registros }) {
  return (
    <Card style={styles.detailCard}>
      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        ÚLTIMOS REGISTROS
      </CustomText>

      {registros.length === 0 && (
        <EmptyMessage text="No hay registros recientes para mostrar." />
      )}

      {registros.map(function (item) {
        return (
          <View key={item.id} style={styles.recordRow}>
            <View style={styles.recordIconBox}>
              <Icon
                icon={ICONS.clipboard}
                size={20}
                color={COLORS.textTertiary}
              />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.modulo}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {item.detalle}
              </CustomText>
            </View>

            <CustomText size={12} color={COLORS.textTertiary}>
              {item.fechaVisible}
            </CustomText>
          </View>
        );
      })}
    </Card>
  );
}

export default function DashboardScreen() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [fincasData, setFincasData] = useState([]);
  const [estanquesData, setEstanquesData] = useState([]);
  const [siembrasData, setSiembrasData] = useState([]);
  const [productosInventario, setProductosInventario] = useState([]);
  const [equiposData, setEquiposData] = useState([]);
  const [registrosEnfermedades, setRegistrosEnfermedades] = useState([]);
  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);
  const [resumenEnfermedades, setResumenEnfermedades] = useState(
    obtenerResumenEnfermedadesVacio(),
  );
  const [resumenParasitologia, setResumenParasitologia] = useState(
    obtenerResumenParasitologiaVacio(),
  );

  const { alimentaciones, recargar } = useAlimentacion();
  const dimensiones = useWindowDimensions();

  const fincasDashboard = construirFincasDashboard(fincasData, estanquesData);
  const alimentacionSemanal = obtenerAlimentacionSemanal(alimentaciones);

  const totalCasosSanitarios = obtenerTotalCasosSanitarios(
    resumenEnfermedades,
    resumenParasitologia,
  );

  const totalMortalidad = obtenerMortalidadTotal(resumenEnfermedades);

  const alertasDashboard = obtenerAlertasDashboard(
    productosInventario,
    siembrasData,
    alimentaciones,
    estanquesData,
    equiposData,
    registrosEnfermedades,
    registrosParasitologia,
  );

  const ultimosRegistros = obtenerUltimosRegistros(
    alimentaciones,
    siembrasData,
    registrosEnfermedades,
    registrosParasitologia,
  );

  let isTablet = false;

  if (dimensiones.width >= 720) {
    isTablet = true;
  }

  const gridStyles = [styles.statsGrid];

  if (isTablet === true) {
    gridStyles.push(styles.statsGridTablet);
  }

  function manejarSeleccionCard(cardId) {
    if (selectedCard === cardId) {
      setSelectedCard(null);
    }

    if (selectedCard !== cardId) {
      setSelectedCard(cardId);
    }
  }

  useEffect(function () {
    let activo = true;
    let intervalo = null;

    async function cargarDatos() {
      const enfermedades = await enfermedadesService.getAll();
      const resumenEnfermedad = await enfermedadesService.getResumenDashboard();

      const parasitos = await parasitologiaService.getAll();
      const resumenParasitos = await parasitologiaService.getResumenDashboard();

      if (activo === true) {
        setFincasData([...fincasModulo]);
        setEstanquesData([...estanquesModulo]);
        setSiembrasData(obtenerSiembras());
        setProductosInventario(getProductosInventario());
        setEquiposData([...EQUIPOS_MOCK]);
        setRegistrosEnfermedades(enfermedades);
        setResumenEnfermedades(resumenEnfermedad);
        setRegistrosParasitologia(parasitos);
        setResumenParasitologia(resumenParasitos);
      }
    }

    recargar();
    cargarDatos();

    intervalo = setInterval(function () {
      recargar();
      cargarDatos();
    }, 5000);

    return function () {
      activo = false;

      if (intervalo !== null) {
        clearInterval(intervalo);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerIconBox}>
            <Icon icon={ICONS.dashboard} size={24} color={COLORS.primary} />
          </View>

          <View style={styles.headerTextBox}>
            <Title level={5} style={styles.headerTitle}>
              Dashboard general
            </Title>

            <CustomText
              size={12}
              color={COLORS.white}
              style={styles.headerSubtitle}
              numberOfLines={1}
            >
              Resumen operativo, sanitario y alertas
            </CustomText>
          </View>
        </View>

        <AlertasPanel alertas={alertasDashboard} />

        <View style={gridStyles}>
          <StatCard
            id="fincas"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("fincas");
            }}
            icon={ICONS.home}
            value={fincasDashboard.length}
            label="Fincas registradas"
            cardStyle={styles.cardBlue}
            iconStyle={styles.iconBlue}
            iconColor={COLORS.primary}
            isTablet={isTablet}
          />

          <StatCard
            id="estanques"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("estanques");
            }}
            icon={ICONS.waterFlow}
            value={estanquesData.length}
            label="Estanques registrados"
            cardStyle={styles.cardIndigo}
            iconStyle={styles.iconIndigo}
            iconColor="#2563EB"
            isTablet={isTablet}
          />

          <StatCard
            id="casos"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("casos");
            }}
            icon={ICONS.shieldAlert}
            value={totalCasosSanitarios}
            label="Casos sanitarios"
            cardStyle={styles.cardYellow}
            iconStyle={styles.iconYellow}
            iconColor={COLORS.warning}
            isTablet={isTablet}
          />

          <StatCard
            id="mortalidad"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("mortalidad");
            }}
            icon={ICONS.mortality}
            value={formatearNumero(totalMortalidad)}
            label="Mortalidad total"
            cardStyle={styles.cardRed}
            iconStyle={styles.iconRed}
            iconColor="#FF002A"
            danger={true}
            isTablet={isTablet}
          />
        </View>

        {selectedCard === "fincas" && (
          <FincasPanel fincas={fincasDashboard} estanques={estanquesData} />
        )}

        {selectedCard === "estanques" && (
          <EstanquesPanel
            estanques={estanquesData}
            alimentacionSemanal={alimentacionSemanal}
          />
        )}

        {selectedCard === "casos" && (
          <CasosPanel
            resumenEnfermedades={resumenEnfermedades}
            resumenParasitologia={resumenParasitologia}
            registrosEnfermedades={registrosEnfermedades}
            registrosParasitologia={registrosParasitologia}
          />
        )}

        {selectedCard === "mortalidad" && (
          <MortalidadPanel
            resumenEnfermedades={resumenEnfermedades}
            registrosEnfermedades={registrosEnfermedades}
          />
        )}

        <UltimosRegistros registros={ultimosRegistros} />
      </ScrollView>
    </SafeAreaView>
  );
}