/**
 * ============================================================
 * SISTEMA DE ICONOS CENTRALIZADO
 * ============================================================
 *
 * Define todos los iconos utilizados en la aplicación (incluyendo acciones como add y minus).
 * Permite mantener la consistencia visual y facilita los cambios globales en los proveedores de iconos.
 *
 * USO:
 * import { ICONS } from "../../../theme/icons";
 * import Icon from "../../../shared/components/Icons";
 *
 * <Icon icon={ICONS.add} size={15} />
 * <Icon icon={ICONS.minus} size={15} />
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
    provider: "MaterialCommunityIcons",
    name: "calendar-month-outline",
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
  menu: {
    provider: "AntDesign",
    name: "menu",
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
  search: {
    provider: "FontAwesome",
    name: "search",
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
  minus: {
    provider: "FontAwesome6",
    name: "minus",
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
  close: {
    provider: "MaterialIcons",
    name: "close",
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
  email: {
    provider: "MaterialIcons",
    name: "email",
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

  // Raleo
  raleo: {
    provider: "MaterialCommunityIcons",
    name: "bucket-outline",
  },

  //Trazabilidad
  transfer: {
    provider: "MaterialCommunityIcons",
    name: "transfer-right",
  },
  trazabilidad: {
    provider: "MaterialCommunityIcons",
    name: "map-marker-path",
  },
  arrowLongRight: {
    provider: "MaterialCommunityIcons",
    name: "arrow-right-bold",
  },

  // Inventarios
  box: {
    provider: "MaterialCommunityIcons",
    name: "package-variant-closed",
  },

  // Otros
  money: {
    provider: "MaterialIcons",
    name: "attach-money",
  },
  gear: {
    provider: "FontAwesome",
    name: "gear",
  },
  dropbox: {
    provider: "AntDesign",
    name: "dropbox",
  },
  truck: {
    provider: "FontAwesome6",
    name: "truck-arrow-right",
  },
  people: {
    provider: "MaterialIcons",
    name: "people",
  },
  tools: {
    provider: "MaterialCommunityIcons",
    name: "tools",
  },
  aerator: {
    provider: "MaterialCommunityIcons",
    name: "pinwheel",
  },
  engine: {
    provider: "MaterialCommunityIcons",
    name: "engine",
  },
  link: {
    provider: "Entypo",
    name: "link",
  },

  //WhatsApp
  whatsApp: {
    provider: "FontAwesome5",
    name: "whatsapp",
  },
};
