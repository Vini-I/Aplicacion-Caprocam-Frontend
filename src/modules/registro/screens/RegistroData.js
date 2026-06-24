import { COLORS } from '../../../theme/colors';


/**
 * Datos estáticos del módulo Registro: fincas, estanques por
 * finca, y módulos disponibles en la grilla.
 *
 * ---
 * FINCAS — { id, nombre }
 * ESTANQUES — objeto indexado por fincaId: { [fincaId]: [{ id, especie }] }
 *
 * ---
 * MODULOS — forma de cada item
 * ---
 * id           string — debe coincidir con el case que maneja
 *                        RegistroScreen (moduloActivo === id)
 * label        string — texto visible en la tarjeta
 * descripcion  string — subtítulo de la tarjeta
 * icono        string — clave de theme/icons.js (debe existir en ICONS)
 * color        string — color de fondo del ícono, tomado de COLORS
 *
 * ---
 * PARA AGREGAR UN MÓDULO NUEVO A LA GRILLA
 * ---
 * 1. Agregar el objeto en MODULOS
 * 2. Agregar el ícono a theme/icons.js si no existe
 * 3. Agregar el case en RegistroScreen.jsx (moduloActivo === 'tuId')
 * 4. Conectar el onPress en el .map() de MODULOS
 */

export const FINCAS = [
  { id: 1, nombre: 'Finca El Pacífico' },
  { id: 2, nombre: 'Finca Santa Rosa' },
];

export const ESTANQUES = {
  1: [
    { id: 'E-01', especie: 'Litopenaeus vannamei' },
    { id: 'E-02', especie: 'Litopenaeus vannamei' },
  ],
  2: [
    { id: 'E-01', especie: 'Litopenaeus stylirostris' },
  ],
};

export const MODULOS = [
  {
    id: 'alimentacion',
    label: 'Alimentación',
    descripcion: 'Raciones, alimento y comederos',
    icono: 'food',
    color: COLORS.primary,
  },
  {
    id: 'crecimiento',
    label: 'Crecimiento',
    descripcion: 'Peso, incremento y biomasa',
    icono: 'growth',
    color: COLORS.success,
  },
  {
    id: 'fisicoquimica',
    label: 'Físico-Química',
    descripcion: 'Temp, O₂, pH y nutrientes',
    icono: 'chemicalContainer',
    color: COLORS.violet,
  },
  {
    id: 'mortalidad',
    label: 'Mortalidad',
    descripcion: 'Conteo y sobrevivencia de camarones',
    icono: 'report',            // ICONS.report → bar-graph (no hay "calculator" en tu theme)
    color: COLORS.warning,
  },
];