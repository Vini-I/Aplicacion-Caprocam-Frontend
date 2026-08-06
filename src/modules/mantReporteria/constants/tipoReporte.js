export const TIPOS_REGISTRO = [
  {
    label: "Alimentación",
    value: "alimentacion",
  },
  {
    label: "Crecimiento",
    value: "crecimiento",
  },
  {
    label: "Fisico-Químico",
    value: "fisico_quimico",
  },
  {
    label: "Densidad Poblacional",
    value: "densidad_poblacional",
  },
  {
    label: "Enfermedades",
    value: "enfermedades",
  },
  {
    label: "Parasitología",
    value: "parasitologia",
  },
  {
    label: "Raleo",
    value: "raleo",
  },
];

/**
 * Tipos cuya carga, listado y eliminación se gestionan
 * internamente dentro de su propio Card + hook
 * (no dependen de useDetalleReporte para los registros).
 */
export const TIPOS_AUTOGESTIONADOS = [
  "alimentacion",
  "enfermedades",
  "parasitologia",
  "crecimiento",
  "densidad_poblacional",
  "raleo",
  "fisico_quimico",
];