/**
 * ============================================================
 * SISTEMA DE ICONOS CENTRALIZADO
 * ============================================================
 *
 * Define todos los iconos utilizados en la aplicacion.
 * Esto permite mantener consistencia visual y facilita cambios globales.
 *
 * USO:
 * import { ICONS } from "../../../theme/icons";
 * import Icon from "../../../shared/components/Icons";
 *
 * <Icon icon={ICONS.add} size={15} />
 *
 */

export const ICONS = {
  // Tiempo
  morningSun: {
    provider: "MaterialIcons",
    name: "sunny",
  },
  afternoonSun: {
    provider: "MaterialIcons",
    name: "sunny-snowing",
  },
  nightSun: {
    provider: "Ionicons",
    name: "moon",
  },
  calendar: {
    provider: "FontAwesome5",
    name: "calendar-week",
  },
  clock: {
    provider: "MaterialCommunityIcons",
    name: "clock",
  },

  // Navegación
  enter: {
    provider: "AntDesign",
    name: "arrow-right",
  },
  exit: {
    provider: "AntDesign",
    name: "arrow-left",
  },
  home: {
    provider: "MaterialIcons",
    name: "home-filled",
  },

  // Ubicación
  location: {
    provider: "FontAwesome6",
    name: "location-dot",
  },

  // Registros y documentos
  document: {
    provider: "MaterialCommunityIcons",
    name: "file-document",
  },
  certificate: {
    provider: "MaterialCommunityIcons",
    name: "file-document-check",
  },
  report: {
    provider: "Entypo",
    name: "bar-graph",
  },
  id: {
    provider: "FontAwesome",
    name: "id-card",
  },
  earth: {
    provider: "FontAwesome6",
    name: "earth-americas",
  },

  // Reportes y estadísticas
  chart: {
    provider: "MaterialIcons",
    name: "show-chart",
  },
  filter: {
    provider: "FontAwesome",
    name: "filter",
  },

  // Estanques
  water: {
    provider: "Ionicons",
    name: "water",
  },
  waterFlow: {
    provider: "FontAwesome5",
    name: "water",
  },

  // Acciones
  add: {
    provider: "FontAwesome6",
    name: "add",
  },
  save: {
    provider: "Ionicons",
    name: "save",
  },
  check: {
    provider: "Entypo",
    name: "check",
  },
  delete: {
    provider: "Entypo",
    name: "trash",
  },
  edit: {
    provider: "MaterialIcons",
    name: "edit",
  },
  update: {
    provider: "MaterialIcons",
    name: "update",
  },
  export: {
    provider: "MaterialCommunityIcons",
    name: "arrow-collapse-up",
  },
  import: {
    provider: "MaterialCommunityIcons",
    name: "arrow-collapse-down",
  },
  info: {
    provider: "MaterialCommunityIcons",
    name: "information",
  },
  favorite: {
    provider: "MaterialCommunityIcons",
    name: "star",
  },

  // Usuario
  user: {
    provider: "FontAwesome",
    name: "user",
  },
  addUser: {
    provider: "FontAwesome",
    name: "user-plus",
  },
  phone: {
    provider: "FontAwesome",
    name: "phone",
  },

  // Medidas
  ruler: {
    provider: "FontAwesome5",
    name: "ruler",
  },
  weight: {
    provider: "FontAwesome6",
    name: "weight-hanging",
  },

  // Alimentación
  food: {
    provider: "MaterialCommunityIcons",
    name: "silverware-fork-knife",
  },
  chemicalContainer: {
    provider: "Entypo",
    name: "lab-flask",
  },
  gift: {
    provider: "FontAwesome5",
    name: "gift",
  },

  // Crecimiento
  growth: {
    provider: "Feather",
    name: "trending-up",
  },
  shrimp: {
    provider: "FontAwesome6",
    name: "shrimp",
  },

  // Sensores
  temperature: {
    provider: "FontAwesome6",
    name: "temperature-full",
  },
  wind: {
    provider: "MaterialCommunityIcons",
    name: "weather-windy",
  },
  frequency: {
    provider: "Octicons",
    name: "pulse",
  },

  // Alertas
  notification: {
    provider: "MaterialIcons",
    name: "notifications",
  },

  // Navegación adicional
  back: {
    provider: "AntDesign",
    name: "arrow-left",
  },

  // Dashboard
  dashboard: {
    provider: "MaterialCommunityIcons",
    name: "view-dashboard",
  },
  shieldAlert: {
    provider: "MaterialCommunityIcons",
    name: "shield-alert-outline",
  },
  mortality: {
    provider: "MaterialCommunityIcons",
    name: "skull-outline",
  },
  clipboard: {
    provider: "MaterialCommunityIcons",
    name: "clipboard-text-outline",
  },
  alertTriangle: {
    provider: "Feather",
    name: "alert-triangle",
  },
  chevronDown: {
    provider: "MaterialCommunityIcons",
    name: "chevron-down",
  },
  chevronUp: {
    provider: "MaterialCommunityIcons",
    name: "chevron-up",
  },

  // Parasitologia
    parasite: {
    provider: "MaterialCommunityIcons",
    name: "bacteria-outline",
  },
  
   microscope: {
    provider: "MaterialCommunityIcons",
    name: "microscope",
  },
};
