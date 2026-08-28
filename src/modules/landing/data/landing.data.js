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
 * - Centraliza los datos de contacto y la configuración del correo electrónico.
 * - Utiliza los colores e íconos definidos en el tema del proyecto.
 */

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

export const HERO_SLIDES = [
  {
    id: "hero-1",
    tipo: "imagen",
    recurso: require("../../../assets/landing19.jpeg"),
    descripcion: "Rótulo Finca La Reina",
  },
  {
    id: "hero-2",
    tipo: "imagen",
    recurso: require("../../../assets/landing1.jpeg"),
    descripcion: "Estanques de cultivo",
  },
  {
    id: "hero-3",
    tipo: "imagen",
    recurso: require("../../../assets/landing3.jpeg"),
    descripcion: "Camarones cultivados",
  },
  {
    id: "hero-4",
    tipo: "imagen",
    recurso: require("../../../assets/landing4.jpeg"),
    descripcion: "Producción de camarón",
  },
  {
    id: "hero-5",
    tipo: "imagen",
    recurso: require("../../../assets/landing5.jpeg"),
    descripcion: "Colaboradores Finca La Reina",
  },
  {
    id: "hero-6",
    tipo: "imagen",
    recurso: require("../../../assets/landing6.jpeg"),
    descripcion: "Trabajadores de CAPROCAM",
  },
    {
    id: "hero-7",
    tipo: "imagen",
    recurso: require("../../../assets/landing2.jpeg"),
    descripcion: "Camarones en crecimiento",
  },
  {
    id: "hero-8",
    tipo: "imagen",
    recurso: require("../../../assets/landing7.jpeg"),
    descripcion: "Comedero automático",
  },
  {
    id: "hero-9",
    tipo: "imagen",
    recurso: require("../../../assets/landing8.jpeg"),
    descripcion: "Muestreo de camarones",
  },
  {
    id: "hero-10",
    tipo: "imagen",
    recurso: require("../../../assets/landing9.jpeg"),
    descripcion: "Estanques de cultivo",
  },
  {
    id: "hero-11",
    tipo: "imagen",
    recurso: require("../../../assets/landing10.jpeg"),
    descripcion: "Vista aérea de la finca",
  },
  {
    id: "hero-12",
    tipo: "imagen",
    recurso: require("../../../assets/landing11.jpeg"),
    descripcion: "Muestreo de camarón",
  },
  {
    id: "hero-13",
    tipo: "imagen",
    recurso: require("../../../assets/landing12.jpeg"),
    descripcion: "Aireadores para estanques",
  },
  {
    id: "hero-14",
    tipo: "imagen",
    recurso: require("../../../assets/landing13.jpeg"),
    descripcion: "Producción camaronera costarricense ",
  },
  {
    id: "hero-15",
    tipo: "imagen",
    recurso: require("../../../assets/landing14.jpeg"),
    descripcion: "Fauna en los estanques",
  },
  {
    id: "hero-16",
    tipo: "imagen",
    recurso: require("../../../assets/landing15.jpeg"),
    descripcion: "Estanques de cultivo de camarón",
  },
  {
    id: "hero-17",
    tipo: "imagen",
    recurso: require("../../../assets/landing16.jpeg"),
    descripcion: "Bodega de alimentos",
  },
  {
    id: "hero-18",
    tipo: "imagen",
    recurso: require("../../../assets/landing17.jpeg"),
    descripcion: "Biodiversidad de la finca",
  },
  {
    id: "hero-19",
    tipo: "imagen",
    recurso: require("../../../assets/landing18.jpeg"),
    descripcion: "Tecnología con paneles solares",
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
    titulo: "Organización",
    icono: ICONS.certificate,
    colorIcono: COLORS.success,
    fondo: COLORS.successLight,
  },
  {
    id: "productores",
    titulo: "Gestión",
    icono: ICONS.people,
    colorIcono: COLORS.FisicoQuimica,
    fondo: COLORS.secondary,
  },
  {
    id: "soporte",
    titulo: "Fortalecimiento",
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
      "CAPROCAM ejerce la representación legal del sector camaronero y salinero nacional y trabaja en la defensa de los intereses comunes de sus asociados.",
    icono: ICONS.shieldAlert,
  },
  {
    id: "innovacion",
    titulo: "Gestión de Recursos",
    descripcion:
      "Gestiona fondos, donaciones y partidas provenientes de entidades públicas y privadas, tanto nacionales como internacionales, para respaldar iniciativas relacionadas con sus fines.",
    icono: ICONS.growth,
  },
  {
    id: "sostenibilidad",
    titulo: "Proyectos de Interés Común",
    descripcion:
      "Promueve proyectos de interés común mediante actividades socio-organizativas dirigidas a fortalecer la participación y organización de sus asociados.",
    icono: ICONS.certificate,
  },
  {
    id: "articulacion",
    titulo: "Estudios y Organización",
    descripcion:
      "Elabora estudios y análisis relacionados con los procesos productivos y comerciales, además de organizar sesiones de estudio, congresos y certámenes vinculados con el sector camaronero y salinero.",
    icono: ICONS.earth,
  },
];

export const PREGUNTAS = [
  {
    id: "personas-asociadas",
    pregunta: "¿Qué tipos de personas asociadas existen?",
    respuesta:
      "CAPROCAM contempla dentro de su organización a fundadores, activos o contribuyentes y asociados.",
  },
  {
    id: "requisitos-miembros",
    pregunta: "¿Quiénes pueden ser miembros de CAPROCAM?",
    respuesta:
      "Pueden ser miembros las personas físicas de reconocida solvencia moral que sean productoras de camarón o sal, estén o no vinculadas directa o indirectamente con estas actividades productivas.",
  },
  {
    id: "organizacion-caprocam",
    pregunta: "¿Cómo está organizada CAPROCAM?",
    respuesta:
      "Su estructura organizativa está conformada por la Asamblea General, la Junta Directiva y la Fiscalía.",
  },
  {
    id: "info-publica",
    pregunta: "¿Cómo puedo solicitar información o apoyo?",
    respuesta:
      "Puede solicitarse mediante el correo electrónico de la Junta Directiva de CAPROCAM.",
  },
];

export const AGREMIADOS = [
  {
    id: "la-reina",
    nombre: "Camaronera La Reina",
    ubicacion: "Guanacaste",
    produccion: "ACAT",
  },
  {
    id: "cocorocas",
    nombre: "Salineras Las Cocorocas",
    ubicacion: "Puntarenas",
    produccion: "ACOPAC",
  },
  {
    id: "josefina",
    nombre: "Carnes La Josefina",
    ubicacion: "Puntarenas",
    produccion: "ACT",
  },
];

export const FINCAS_FOOTER = [
  "Productores de Camarón",
  "Productores de Sal",
];

export const CONTACTO = {
  juntaDirectiva: "Miembros de la Junta Directiva",
  correo: "caprocam.jd@gmail.com",
  mensajeCorreo: "Hola, deseo recibir más información",
};
