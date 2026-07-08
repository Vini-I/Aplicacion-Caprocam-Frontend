/**
 * ============================================================
 * SERVICIOS - FÍSICO-QUÍMICA
 * ============================================================
 *
 * Descripción:
 * Funciones de persistencia y consulta para el módulo Físico-Química.
 * Actualmente son implementaciones locales/placeholder hasta que
 * exista un backend o almacenamiento definido.
 *
 * Funcionalidad / reglas importantes:
 * - `guardarLectura(datos)`: guarda una lectura (pendiente implementar
 *   almacenamiento real).
 * - `obtenerLecturasPorEstanque(estanqueId)`: devuelve lecturas por estanque.
 *
 * Restricciones del proyecto:
 * - No realizar llamadas a APIs externas desde aquí sin control de
 *   errores y pruebas. Reemplazar por la capa de integración cuando
 *   exista el backend.
 */

const historialLecturasPorEstanque = {
  A01: {
    ph: [7.8, 7.6],
    salinidad: [18.2, 17.9],
    temperatura: [28.5, 28.8],
    ox: [6.1, 5.9],
  },
  A02: {
    ph: [7.7, 7.6],
    salinidad: [17.5, 17.2],
    temperatura: [28.8, 29.0],
    ox: [6.0, 5.8],
  },
  'P-03': {
    ph: [7.6],
    salinidad: [16.0],
    temperatura: [29.0],
    ox: [6.2],
  },
};

const opcionesFincas = [
  { label: 'Finca Camarón de Occidente', value: 'laReina' },
  { label: 'Finca Camarón del Sur', value: 'laEsperanza' },
  { label: 'Finca Camarón del Norte', value: 'laVilla' },
];

const estanquesPorFinca = {
  laReina: [
    { label: 'Estanque P-01 (Pre-cría)', value: 'A01' },
    { label: 'Estanque P-02 (Pre-cría)', value: 'A02' },
    { label: 'Estanque E-08 (Engorde)', value: 'B01' },
    { label: 'Estanque E-09 (Engorde)', value: 'B02' },
  ],
  laEsperanza: [
    { label: 'Estanque P-03 (Pre-cría)', value: 'P-03' },
    { label: 'Estanque E-02 (Engorde)', value: 'E-02' },
    { label: 'Estanque E-03 (Engorde)', value: 'E-03' },
  ],
  laVilla: [
    { label: 'Estanque P-04 (Pre-cría)', value: 'P-04' },
    { label: 'Estanque E-05 (Engorde)', value: 'E-05' },
  ],
};

export const guardarLectura = async (datos) => {
  // TODO: AsyncStorage, API call, etc.
  console.log('guardarLectura - pendiente de implementar', datos);
};

export function obtenerLecturasPorEstanque(estanqueId) {
  return historialLecturasPorEstanque[estanqueId] ?? null;
}

export function obtenerOpcionesFincas() {
  return opcionesFincas;
}

export function obtenerEstanquesPorFinca(fincaSeleccionada) {
  return estanquesPorFinca[fincaSeleccionada] || [];
}

export function obtenerEstadoLecturasLocal(medicionesPorEstanque = {}) {
  return {
    lecturasPhLocal: medicionesPorEstanque.ph ?? [],
    lecturasSalinidadLocal: medicionesPorEstanque.salinidad ?? [],
    lecturasTempLocal: medicionesPorEstanque.temperatura ?? [],
    lecturasOxLocal: medicionesPorEstanque.ox ?? [],
  };
}

export function sincronizarLecturasLocales({ medicionesPorEstanque = {}, setters = {} }) {
  const siguienteEstado = obtenerEstadoLecturasLocal(medicionesPorEstanque);
  setters.ph?.(siguienteEstado.lecturasPhLocal);
  setters.salinidad?.(siguienteEstado.lecturasSalinidadLocal);
  setters.temperatura?.(siguienteEstado.lecturasTempLocal);
  setters.ox?.(siguienteEstado.lecturasOxLocal);
}

export function hayMedicionesRegistradas(lecturasPorTipo = []) {
  return lecturasPorTipo.some((lecturas) => Array.isArray(lecturas) && lecturas.length > 0);
}

export function validarFormularioFisicoQuimica({ fincaSeleccionada, estanqueSeleccionado, tieneAlgunaMedicion }) {
  if (!fincaSeleccionada || !estanqueSeleccionado) {
    return 'Selecciona la finca y el estanque antes de guardar.';
  }

  if (!tieneAlgunaMedicion) {
    return 'Agrega al menos una medición antes de guardar.';
  }

  return '';
}

export function manejarCambioFinca({ value, setters }) {
  setters?.finca?.(value);
  setters?.estanque?.("");
  setters?.mediciones?.({ ph: [], salinidad: [], temperatura: [], ox: [] });
  setters?.error?.("");
}

export function manejarCambioEstanque({ value, setters, obtenerLecturas }) {
  setters?.estanque?.(value);
  setters?.error?.("");

  const lecturas = obtenerLecturas?.(value);
  setters?.mediciones?.(lecturas ?? { ph: [], salinidad: [], temperatura: [], ox: [] });
}

export function manejarCambioLecturas({ values, setters, localSetters }) {
  const valores = values ?? [];
  if (localSetters?.ph) localSetters.ph(valores);
  if (setters?.ph) setters.ph(valores);
}

export function manejarCambioPh({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.ph?.(valores);
  setters?.ph?.(valores);
}

export function manejarCambioSalinidad({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.salinidad?.(valores);
  setters?.salinidad?.(valores);
}

export function manejarCambioTemperatura({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.temperatura?.(valores);
  setters?.temperatura?.(valores);
}

export function manejarCambioOxigeno({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.ox?.(valores);
  setters?.ox?.(valores);
}