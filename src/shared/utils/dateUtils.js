/**
 * ============================================================
 * dateUtils.js
 * ============================================================
 *
 * Descripcion:
 * Utilidades centralizadas para trabajar con fechas en formato
 * dd/mm/aaaa. Este archivo evita que cada modulo tenga su propio
 * parseo o validacion de fechas.
 *
 * Reglas:
 * - El formato oficial es dd/mm/aaaa.
 * - getCurrentDate retorna la fecha actual en formato dd/mm/aaaa.
 * - parseDate retorna Date si la fecha es valida o null si no lo es.
 * - No usar regex de fecha dentro de los modulos.
 */

const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function isDateObject(value) {
  if (value instanceof Date === false) {
    return false;
  }

  if (Number.isNaN(value.getTime()) === true) {
    return false;
  }

  return true;
}

function formatDateObject(fecha) {
  const dia = padNumber(fecha.getDate());
  const mes = padNumber(fecha.getMonth() + 1);
  const anio = fecha.getFullYear();

  return dia + "/" + mes + "/" + anio;
}

export function getCurrentDate() {
  return formatDateObject(new Date());
}

export function parseDate(fechaTexto) {
  if (fechaTexto instanceof Date) {
    if (isDateObject(fechaTexto) === true) {
      return new Date(
        fechaTexto.getFullYear(),
        fechaTexto.getMonth(),
        fechaTexto.getDate(),
      );
    }

    return null;
  }

  if (!fechaTexto) {
    return null;
  }

  const texto = String(fechaTexto).trim();

  if (texto === "") {
    return null;
  }

  if (texto.includes("/")) {
    const partes = texto.split("/");

    if (partes.length !== 3) {
      return null;
    }

    const dia = Number(partes[0]);
    const mesTexto = Number(partes[1]);
    const anio = Number(partes[2]);

    if (
      Number.isInteger(dia) === false ||
      Number.isInteger(mesTexto) === false ||
      Number.isInteger(anio) === false
    ) {
      return null;
    }

    if (mesTexto < 1 || mesTexto > 12) {
      return null;
    }

    if (dia < 1 || dia > 31) {
      return null;
    }

    const mes = mesTexto - 1;
    const fecha = new Date(anio, mes, dia);

    if (Number.isNaN(fecha.getTime()) === true) {
      return null;
    }

    if (
      fecha.getDate() !== dia ||
      fecha.getMonth() !== mes ||
      fecha.getFullYear() !== anio
    ) {
      return null;
    }

    return fecha;
  }

  if (texto.includes("-")) {
    const partes = texto.split("-");

    if (partes.length !== 3) {
      return null;
    }

    const anio = Number(partes[0]);
    const mesTexto = Number(partes[1]);
    const dia = Number(partes[2].slice(0, 2));

    if (
      Number.isInteger(dia) === false ||
      Number.isInteger(mesTexto) === false ||
      Number.isInteger(anio) === false
    ) {
      return null;
    }

    if (mesTexto < 1 || mesTexto > 12) {
      return null;
    }

    if (dia < 1 || dia > 31) {
      return null;
    }

    const fecha = new Date(anio, mesTexto - 1, dia);

    if (Number.isNaN(fecha.getTime()) === true) {
      return null;
    }

    if (
      fecha.getDate() !== dia ||
      fecha.getMonth() !== mesTexto - 1 ||
      fecha.getFullYear() !== anio
    ) {
      return null;
    }

    return fecha;
  }

  return null;
}

export function formatDate(fecha) {
  if (isDateObject(fecha) === true) {
    return formatDateObject(fecha);
  }

  const parsed = parseDate(fecha);

  if (parsed === null) {
    return "";
  }

  return formatDateObject(parsed);
}

export function formatearFechaInput(valorNuevo) {
  const soloNumeros = String(valorNuevo ?? "")
    .replace(/\D/g, "")
    .slice(0, 8);

  if (soloNumeros.length > 4) {
    return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2, 4)}/${soloNumeros.slice(4)}`;
  }

  if (soloNumeros.length > 2) {
    return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2)}`;
  }

  return soloNumeros;
}

export function esFechaValida(fechaTexto) {
  return parseDate(fechaTexto) !== null;
}

export function isValidDate(fechaTexto) {
  return esFechaValida(fechaTexto);
}

export function esFechaFutura(fechaTexto) {
  const fecha = parseDate(fechaTexto);

  if (fecha === null) {
    return false;
  }

  const hoy = new Date();
  const hoyLimpio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  return fecha.getTime() > hoyLimpio.getTime();
}

export function isSameDate(fechaUno, fechaDos) {
  const primera = parseDate(fechaUno);
  const segunda = parseDate(fechaDos);

  if (primera === null || segunda === null) {
    return false;
  }

  if (primera.getFullYear() !== segunda.getFullYear()) {
    return false;
  }

  if (primera.getMonth() !== segunda.getMonth()) {
    return false;
  }

  if (primera.getDate() !== segunda.getDate()) {
    return false;
  }

  return true;
}

export function getDayName(fechaTexto) {
  const fecha = parseDate(fechaTexto);

  if (fecha === null) {
    return "";
  }

  return DIAS_SEMANA[fecha.getDay()];
}

export function toMysqlDate(fechaTexto) {
  const fecha = parseDate(fechaTexto);

  if (fecha === null) {
    return "";
  }

  const anio = fecha.getFullYear();
  const mes = padNumber(fecha.getMonth() + 1);
  const dia = padNumber(fecha.getDate());

  return anio + "-" + mes + "-" + dia;
}
