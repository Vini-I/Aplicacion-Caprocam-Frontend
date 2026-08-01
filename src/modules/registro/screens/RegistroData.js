import iconSet from "@expo/vector-icons/build/Fontisto";
import { COLORS } from "../../../theme/colors";

/**
 * Datos estaticos del modulo Registro: fincas, estanques por
 * finca, y modulos disponibles en la grilla.
 *
 * ---
 * FINCAS - { id, nombre }
 * ESTANQUES - objeto indexado por fincaId: { [fincaId]: [{ id, especie }] }
 *
 * ---
 * MODULOS - forma de cada item
 * ---
 * id           string - debe coincidir con la accion que maneja
 *                        RegistroScreen
 * label        string - texto visible en la tarjeta
 * descripcion  string - subtitulo de la tarjeta
 * icono        string - clave de theme/icons.js
 * color        string - color de fondo del icono, tomado de COLORS
 *
 * ---
 * PARA AGREGAR UN MODULO NUEVO A LA GRILLA
 * ---
 * 1. Agregar el objeto en MODULOS
 * 2. Agregar el icono a theme/icons.js si no existe
 * 3. Agregar la funcion de navegacion en registros/index.jsx
 * 4. Conectar el callback en RegistroScreen.jsx
 */

export const FINCAS = [
  { id: 1, nombre: "Finca El Pacifico" },
  { id: 2, nombre: "Finca Santa Rosa" },
];

export const ESTANQUES = {
  1: [
    { id: "E-01", especie: "Litopenaeus vannamei" },
    { id: "E-02", especie: "Litopenaeus vannamei" },
  ],
  2: [{ id: "E-01", especie: "Litopenaeus stylirostris" }],
};

export const MODULOS = [
  {
    id: "alimentacion",
    label: "Alimentacion",
    descripcion: "Raciones, alimento y comederos",
    icono: "food",
    color: COLORS.Alimentacion,
  },
  {
    id: "crecimiento",
    label: "Crecimiento",
    descripcion: "Peso, incremento y biomasa",
    icono: "growth",
    color: COLORS.Crecimiento,
  },
  {
    id: "fisicoquimica",
    label: "Fisico-Quimica",
    descripcion: "Temp, O2, pH y nutrientes",
    icono: "chemicalContainer",
    color: COLORS.FisicoQuimica,
  },
  {
    id: "densidadPoblacional",
    label: "Densidad Poblacional",
    descripcion: "Conteo y sobrevivencia de camarones",
    icono: "report",
    color: COLORS.Densidad,
  },
  {
    id: "enfermedades",
    label: "Enfermedades",
    descripcion: "Casos sanitarios y severidad",
    icono: "shieldAlert",
    color: COLORS.Enfermedades,
  },
  {
    id: "parasitologia",
    label: "Parasitologia",
    descripcion: "Parasitos, infeccion y grado",
    icono: "parasite",
    color: COLORS.Parasitologia,
  },
  {
    id: "raleo",
    label: "Raleo",
    descripcion: "Cosecha parcial y densidad",
    icono: "raleo",
    color: COLORS.Raleo,
  },
  {
    id: "reporteria",
    label: "Reportería",
    descripcion: "Reporte, Historico",
    icono: "document",
    color: COLORS.DetalleRegistro
  },
];
