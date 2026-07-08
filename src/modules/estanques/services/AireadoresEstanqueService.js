/**
 * ============================================================
 * SERVICIO AIREADORES ESTANQUE
 * ============================================================
 *
 * Responsabilidad:
 * - Centraliza las opciones de aireadores existentes.
 * - Permite obtener el codigo default de aireador.
 * - Permite construir la relacion visual entre aireador y estanque.
 *
 * Reglas:
 * - Si el estanque no tiene aireadores, no se asigna codigo.
 * - Si tiene aireadores, se debe seleccionar un codigo existente.
 */

export const AIREADORES_EXISTENTES = [
  {
    id: "air-001",
    codigo: "AIR-001",
    nombre: "Aireador AIR-001",
    estado: "Disponible",
  },
  {
    id: "air-002",
    codigo: "AIR-002",
    nombre: "Aireador AIR-002",
    estado: "Disponible",
  },
  {
    id: "air-003",
    codigo: "AIR-003",
    nombre: "Aireador AIR-003",
    estado: "Disponible",
  },
];

export function obtenerOpcionesAireadores() {
  const opciones = [];

  AIREADORES_EXISTENTES.forEach(function (aireador) {
    opciones.push({
      label: `${aireador.codigo} - ${aireador.estado}`,
      value: aireador.codigo,
    });
  });

  return opciones;
}

export function obtenerCodigoAireadorDefault() {
  let codigo = "";

  if (AIREADORES_EXISTENTES.length > 0) {
    codigo = AIREADORES_EXISTENTES[0].codigo;
  }

  return codigo;
}

export function obtenerOpcionesEstanqueSeleccionado(
  codigoEstanque,
  fincaNombre,
) {
  const opciones = [];

  if (codigoEstanque !== "") {
    opciones.push({
      label: `${codigoEstanque} - ${fincaNombre}`,
      value: codigoEstanque,
    });
  }

  return opciones;
}

export function obtenerEstanqueAireador(
  tieneAireadores,
  codigoEstanque,
  fincaNombre,
) {
  let texto = "";

  if (tieneAireadores === "si") {
    texto = `${codigoEstanque} - ${fincaNombre}`;
  }

  return texto;
}
