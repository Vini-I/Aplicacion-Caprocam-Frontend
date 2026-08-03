/**
 * ============================================================
 * ESTILOS DE LA PÁGINA PRINCIPAL
 * ============================================================
 *
 * Define la apariencia visual y la distribución de todos los
 * componentes que conforman la página principal de CAPROCAM,
 * considerando su visualización en web, tabletas y móviles.
 *
 * Contenido:
 * - Establece los estilos generales de la pantalla y el desplazamiento.
 * - Define la apariencia del encabezado y el menú de navegación.
 * - Controla el diseño del menú desplegable para dispositivos móviles.
 * - Configura el carrusel principal, degradados, textos y estadísticas.
 * - Define la distribución de las secciones informativas.
 * - Estiliza las tarjetas de beneficios, servicios y productores.
 * - Configura la apariencia de las preguntas frecuentes.
 * - Define el diseño del llamado a la acción y el botón de WhatsApp.
 * - Estiliza la información de contacto y el pie de página.
 * - Incluye variantes responsivas para escritorio, tabletas y móviles.
 * - Aplica sombras compatibles con plataformas web y dispositivos nativos.
 * - Utiliza los colores y tipografías definidos en el tema del proyecto.
 */
import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

const cardShadow = Platform.select({
  web: {
    boxShadow: "0 4px 18px rgba(31, 41, 55, 0.10)",
  },

  default: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
});

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 36,
  },
  /*
  ============================================================
  HEADER
  ============================================================
  */

  header: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    zIndex: 20,
  },

  headerInner: {
    width: "92%",
    maxWidth: 1180,
    minHeight: 72,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    paddingVertical: 10,
  },

  headerInnerMobile: {
    position: "relative",
    paddingVertical: 12,
  },

  menuButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
  },

  brandText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 20,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },

  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 4,
  },

  navMobile: {
    display: "none",
    position: "absolute",
    top: 60,
    left: 0,
    width: "62%",
    minWidth: 210,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "stretch",
    flexDirection: "column",
    ...cardShadow,
  },

  navMobileOpen: {
    display: "flex",
  },

  navItem: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 9,
  },

  navItemHover: {
    backgroundColor: COLORS.primaryLight,
  },

  navItemPressed: {
    backgroundColor: COLORS.secondary,
    opacity: 0.8,
  },

  navItemText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  loginButton: {
    minHeight: 42,
    marginTop: 0,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  loginButtonMobile: {
    order: 2,
    marginLeft: "auto",
  },

  loginButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 14,
    color: COLORS.white,
  },

  /*
  ============================================================
  HERO
  ============================================================
  */

  hero: {
    position: "relative",
    width: "100%",
    minHeight: 640,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: COLORS.textSecondary,
  },

  heroMobile: {
    minHeight: 790,
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  heroDarkLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    opacity: 0.08,
    zIndex: 2,
  },

  heroContent: {
    width: "92%",
    maxWidth: 930,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 55,
    paddingBottom: 100,
    zIndex: 3,
  },

  heroContentMobile: {
    width: "90%",
    paddingTop: 45,
    paddingBottom: 115,
  },

  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    marginBottom: 24,
  },

  heroBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
  },

  heroTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 48,
    lineHeight: 56,
    color: COLORS.white,
    textAlign: "center",
  },

  heroTitleTablet: {
    fontSize: 42,
    lineHeight: 50,
  },

  heroTitleMobile: {
    fontSize: 34,
    lineHeight: 41,
  },

  heroTitleRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  heroAccent: {
    color: COLORS.primary,
  },

  heroDescription: {
    width: "100%",
    maxWidth: 690,
    marginTop: 20,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 17,
    lineHeight: 28,
    color: COLORS.white,
    textAlign: "center",
  },

  heroSubtitle: {
    width: "100%",
    maxWidth: 690,
    marginTop: 20,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 17,
    lineHeight: 28,
    color: COLORS.white,
    textAlign: "center",
  },

  heroButton: {
    minHeight: 53,
    marginTop: 30,
    paddingHorizontal: 29,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 14,
    backgroundColor: "transparent",
  },

  heroButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 15,
    color: COLORS.white,
  },

  statsPanel: {
    width: "100%",
    maxWidth: 720,
    minHeight: 100,
    marginTop: 48,
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.38)",
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  statsPanelMobile: {
    width: "100%",
    maxWidth: 340,
    flexDirection: "column",
    gap: 13,
    paddingVertical: 20,
  },

  statGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.white,
    opacity: 0.35,
  },

  statDividerMobile: {
    display: "none",
  },

  statNumber: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 4,
    textAlign: "center",
  },

  statLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
  },

  carouselIndicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  carouselIndicatorButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  carouselDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.textQuaternary,
    opacity: 0.85,
  },

  carouselDotActive: {
    width: 27,
    backgroundColor: COLORS.white,
    opacity: 1,
  },

  heroPhotoCaption: {
    position: "absolute",
    right: 18,
    bottom: 75,
    zIndex: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "rgba(31, 41, 55, 0.62)",
  },

  heroPhotoCaptionText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 11,
    color: COLORS.white,
  },

  heroBottomCurve: {
    position: "absolute",
    left: "-8%",
    bottom: -72,
    width: "116%",
    height: 120,
    borderRadius: 9999,
    backgroundColor: COLORS.white,
    transform: [
      {
        rotate: "-0.7deg",
      },
    ],
    zIndex: 5,
  },

  /*
  ============================================================
  SECCIONES
  ============================================================
  */

  section: {
    width: "100%",
    paddingVertical: 82,
    backgroundColor: COLORS.white,
  },

  sectionAlt: {
    backgroundColor: COLORS.surface,
  },

  sectionMobile: {
    paddingVertical: 55,
  },

  sectionInner: {
    width: "92%",
    maxWidth: 1120,
    alignSelf: "center",
  },

  sectionInnerMobile: {
    width: "90%",
  },

  sectionBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 14,
  },

  sectionBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 12,
    color: COLORS.primary,
    letterSpacing: 1,
  },

  sectionTitle: {
    maxWidth: 800,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 32,
    lineHeight: 39,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  sectionTitleMobile: {
    fontSize: 27,
    lineHeight: 34,
  },

  sectionSubtitle: {
    maxWidth: 780,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 15,
    lineHeight: 25,
    color: COLORS.textTertiary,
    marginBottom: 36,
  },

  /*
  ============================================================
  QUIENES SOMOS
  ============================================================
  */

  aboutGrid: {
    flexDirection: "row",
    alignItems: "center",
    gap: 46,
  },

  aboutGridMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 34,
  },

  aboutTextColumn: {
    flex: 1,
    minWidth: 290,
  },

  paragraph: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 15,
    lineHeight: 26,
    color: COLORS.textTertiary,
    marginTop: 14,
  },

  benefitsGrid: {
    flex: 1,
    minWidth: 290,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  benefitsGridMobile: {
    minWidth: 0,
    width: "100%",
  },

  benefitCard: {
    flexGrow: 1,
    flexBasis: "46%",
    minHeight: 132,
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
  },

  cardFullWidth: {
    width: "100%",
    flexBasis: "100%",
    minHeight: 120,
  },

  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    ...cardShadow,
  },

  benefitTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  /*
  ============================================================
  SERVICIOS
  ============================================================
  */

  servicesGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  serviceCard: {
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 195,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
    ...cardShadow,
  },

  serviceCardFullWidth: {
    width: "100%",
    flexBasis: "100%",
  },

  serviceIcon: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceContent: {
    flex: 1,
  },

  serviceTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 17,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  serviceDescription: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.textTertiary,
  },

  /*
  ============================================================
  PREGUNTAS FRECUENTES
  ============================================================
  */

  faqList: {
    width: "100%",
    marginTop: 34,
    gap: 14,
  },

  faqItem: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },

  faqHeader: {
    minHeight: 60,
    paddingHorizontal: 22,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  faqQuestion: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  faqAnswerContainer: {
    paddingHorizontal: 22,
    paddingTop: 2,
    paddingBottom: 20,
  },

  faqAnswer: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    lineHeight: 23,
    color: COLORS.textTertiary,
  },

  /*
  ============================================================
  AGREMIADOS
  ============================================================
  */

  producersGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  producerCard: {
    flexGrow: 1,
    flexBasis: "30%",
    minHeight: 175,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
  },

  producerCardTablet: {
    flexBasis: "47%",
  },

  producerCardMobile: {
    width: "100%",
    flexBasis: "100%",
  },

  producerIcon: {
    width: 46,
    height: 46,
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  producerName: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  producerLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },

  producerLocationText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    color: COLORS.primary,
  },

  producerProduction: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    color: COLORS.textQuaternary,
  },

  /*
  ============================================================
  WHATSAPP
  ============================================================
  */

  cta: {
    width: "100%",
    marginTop: 38,
    paddingHorizontal: 30,
    paddingVertical: 34,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },

  ctaMobile: {
    paddingHorizontal: 20,
  },

  ctaTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 8,
  },

  ctaSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 20,
  },

  whatsappButton: {
    minHeight: 48,
    marginTop: 0,
    paddingHorizontal: 25,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },

  whatsappButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 14,
    color: COLORS.white,
  },

  /*
  ============================================================
  FOOTER
  ============================================================
  */

  footer: {
    width: "100%",
    paddingVertical: 55,
    backgroundColor: COLORS.textSecondary,
  },

  footerInner: {
    width: "92%",
    maxWidth: 1120,
    alignSelf: "center",
  },

  footerColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 42,
  },

  footerColumnsMobile: {
    flexDirection: "column",
    gap: 35,
  },

  footerColumn: {
    flex: 1,
    minWidth: 220,
  },

  footerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 13,
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 18,
  },

  footerContactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 17,
  },

  footerContactIcon: {
    width: 25,
    alignItems: "center",
    paddingTop: 2,
  },

  footerTextContainer: {
    flex: 1,
  },

  footerPrimary: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 3,
  },

  footerSecondary: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.textQuaternary,
  },

  scheduleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 15,
  },

  scheduleRowInactive: {
    opacity: 0.62,
  },

  scheduleTextContent: {
    flex: 1,
  },

  scheduleDay: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 4,
  },

  scheduleDayInactive: {
    color: COLORS.textQuaternary,
  },

  scheduleHours: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 13,
    color: COLORS.textQuaternary,
  },

  scheduleBadge: {
    width: "100%",
    minHeight: 38,
    marginTop: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    backgroundColor: "hsla(199, 89%, 48%, 0.12)",
  },

  scheduleBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 12,
    color: COLORS.primary,
  },

  footerFarmRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },

  footerBullet: {
    width: 6,
    height: 6,
    marginTop: 7,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  footerFarmText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.white,
  },

  footerDivider: {
    width: "100%",
    height: 1,
    marginTop: 42,
    marginBottom: 28,
    backgroundColor: COLORS.textTertiary,
    opacity: 0.35,
  },

  footerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },

  footerBottomMobile: {
    flexDirection: "column",
  },

  copyright: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.textQuaternary,
    textAlign: "center",
  },

  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },

  footerLink: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 13,
    color: COLORS.textQuaternary,
  },
});