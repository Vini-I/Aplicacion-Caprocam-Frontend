/**
 * ============================================================
 * DATOS DE LA PÁGINA PRINCIPAL
 * ============================================================
 *
 * Centraliza la información utilizada por los componentes de la
 * página principal de CAPROCAM, facilitando su reutilización y
 * mantenimiento desde un único archivo.
 *
 * Contenido:
 * - Define las imágenes y descripciones del carrusel principal.
 * - Almacena los beneficios ofrecidos por la asociación.
 * - Contiene la información de los servicios disponibles.
 * - Define las preguntas frecuentes y sus respectivas respuestas.
 * - Almacena la información de los productores agremiados.
 * - Incluye la lista de fincas mostrada en el pie de página.
 * - Centraliza los datos de contacto y la configuración de WhatsApp.
 * - Utiliza los colores e íconos definidos en el tema del proyecto.
 */

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

export const HERO_SLIDES = [
  {
    id: "hero-1",
    imagen: require("../../../assets/landing-hero-1.jpeg"),
    descripcion: "Estanques de cultivo - vista aérea",
  },
  {
    id: "hero-2",
    imagen: require("../../../assets/landing-hero-2.jpeg"),
    descripcion: "Camarones en producción",
  },
  {
    id: "hero-3",
    imagen: require("../../../assets/landing-hero-3.jpeg"),
    descripcion: "Alimentadores automáticos de camarón",
  },
  {
    id: "hero-4",
    imagen: require("../../../assets/landing-hero-4.jpeg"),
    descripcion: "Camarones en producción",
  },
];

export const BENEFICIOS = [
  {
    id: "representacion",
    titulo: "Representación",
    icono: ICONS.shieldAlert,
    colorIcono: COLORS.primary,
    fondo: COLORS.primaryLight,
  },
  {
    id: "certificacion",
    titulo: "Certificaciones",
    icono: ICONS.certificate,
    colorIcono: COLORS.success,
    fondo: COLORS.successLight,
  },
  {
    id: "productores",
    titulo: "Red de productores",
    icono: ICONS.people,
    colorIcono: COLORS.FisicoQuimica,
    fondo: COLORS.secondary,
  },
  {
    id: "soporte",
    titulo: "Soporte técnico",
    icono: ICONS.shrimp,
    colorIcono: COLORS.primary,
    fondo: COLORS.primaryLight,
  },
];

export const SERVICIOS = [
  {
    id: "representacion-gremial",
    titulo: "Representación Gremial",
    descripcion:
      "Actuamos como interlocutores ante el MAG, INCOPESCA y otros organismos reguladores, participando en mesas de trabajo para fortalecer el marco legal del sector.",
    icono: ICONS.shieldAlert,
  },
  {
    id: "innovacion",
    titulo: "Innovación y Tecnificación",
    descripcion:
      "Lideramos proyectos de modernización productiva junto al Sistema de Banca para el Desarrollo, la UCR y la UTN.",
    icono: ICONS.growth,
  },
  {
    id: "sostenibilidad",
    titulo: "Desarrollo Sostenible",
    descripcion:
      "Fomentamos prácticas acuícolas responsables que equilibran productividad y conservación ambiental.",
    icono: ICONS.certificate,
  },
  {
    id: "articulacion",
    titulo: "Articulación Interinstitucional",
    descripcion:
      "Coordinamos entre productores, academia, sector bancario y gobierno para fortalecer la competitividad internacional.",
    icono: ICONS.earth,
  },
];

export const PREGUNTAS = [
  {
    id: "acuicultura-sostenible",
    pregunta: "¿Qué es la acuicultura sostenible?",
    respuesta:
      "Es una forma responsable de producir especies acuáticas utilizando prácticas que protegen el ambiente y favorecen a las comunidades productoras.",
  },
  {
    id: "requisitos-sanitarios",
    pregunta: "¿Qué requisitos sanitarios exige el sector?",
    respuesta:
      "El sector exige el Certificado Veterinario de Operación, buenas prácticas de manejo y estrictos controles de bioseguridad.",
  },
];

export const AGREMIADOS = [
  {
    id: "san-miguel",
    nombre: "Camaronera San Miguel",
    ubicacion: "Puntarenas",
    produccion: "45 ha en producción",
  },
  {
    id: "pacifico",
    nombre: "Acuícola El Pacífico",
    ubicacion: "Guanacaste",
    produccion: "32 ha en producción",
  },
  {
    id: "reina",
    nombre: "Finca La Reina",
    ubicacion: "Guanacaste",
    produccion: "28 ha en producción",
  },
  {
    id: "sur",
    nombre: "Estanques del Sur",
    ubicacion: "Limón",
    produccion: "55 ha en producción",
  },
  {
    id: "esperanza",
    nombre: "Camaronera La Esperanza",
    ubicacion: "Puntarenas",
    produccion: "38 ha en producción",
  },
  {
    id: "cinco-estrellas",
    nombre: "Acuicultura Cinco Estrellas",
    ubicacion: "Quepos",
    produccion: "22 ha en producción",
  },
];

export const FINCAS_FOOTER = [
  "Finca El Pacífico - Puntarenas",
  "Finca La Reina - Guanacaste",
  "Camaronera La Unión - Limón",
  "Estanques del Pacífico - Quepos",
  "Finca Mar Adentro - Nicoya",
];

export const CONTACTO = {
  telefono: "+506 8888-8888",
  correo: "info@caprocam.com",
  direccion:
    "Colorado de Abangares, Guanacaste, Costa Rica",
  numeroWhatsapp: "50688015053",
  mensajeWhatsapp: "Hola, deseo recibir más información.",
};
