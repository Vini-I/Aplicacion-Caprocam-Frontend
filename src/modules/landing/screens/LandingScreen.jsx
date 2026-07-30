/**
 * ============================================================
 * PANTALLA: LANDING
 * ============================================================
 *
 * Modulo: Landing
 *
 * Descripcion:
 * Pagina informativa estatica de CAPROCAM.
 * Incluye carrusel, informacion institucional, servicios,
 * agremiados, preguntas frecuentes, WhatsApp y contacto.
 */

import React, {useCallback,useEffect,useRef,useState,} from "react";

import {Alert,Animated,Linking,Pressable,ScrollView,Text,View,useWindowDimensions,} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import { styles } from "../styles/LandingStyle";


const HERO_SLIDES = [
  {
    id: "hero-1",
    imagen: require("../../../assets/landing-hero-1.jpeg"),
    descripcion: "Estanques de cultivo - vista aerea",
  },
  {
    id: "hero-2",
    imagen: require("../../../assets/landing-hero-2.jpeg"),
    descripcion: "Camorones en produccion",
  },
  {
    id: "hero-3",
    imagen: require("../../../assets/landing-hero-3.jpeg"),
    descripcion: "Alimentadores automaticos de camaron",
  },
  {
    id: "hero-4",
    imagen: require("../../../assets/landing-hero-4.jpeg"),
    descripcion:"Camarones en produccion",
  },
];

const BENEFICIOS = [
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
    titulo: "Soporte tecnico",
    icono: ICONS.shrimp,
    colorIcono: COLORS.primary,
    fondo: COLORS.primaryLight,
  },
];

const SERVICIOS = [
  {
    id: "representacion-gremial",
    titulo: "Representacion Gremial",
    descripcion:
      "Actuamos como interlocutores ante el MAG, INCOPESCA y otros organismos reguladores, participando en mesas de trabajo para fortalecer el marco legal del sector, incluyendo la Ley 9814 y los planes de manejo conjunto.",
    icono: ICONS.shieldAlert,
  },
  {
    id: "innovacion",
    titulo: "Innovacion y Tecnificacion",
    descripcion:
      "Lideramos proyectos de modernizacion productiva junto al Sistema de Banca para el Desarrollo, la UCR y la UTN, validando tecnologias como aireadores y alimentadores automaticos que mejoran la eficiencia del cultivo.",
    icono: ICONS.growth,
  },
  {
    id: "sostenibilidad",
    titulo: "Desarrollo Sostenible",
    descripcion:
      "Fomentamos practicas acuicolas responsables que equilibran productividad y conservacion ambiental, en coordinacion con el SINAC Y el MINAE en áreas como el ACAT.",
    icono: ICONS.certificate,
  },
  {
    id: "articulacion",
    titulo: "Articulacion Interinstitucional",
    descripcion:
      "Coordinamos entre productores, academia, sector bancario y gobierno para impulsar la investigacion, el desarollo tecnologico y el acceso a financiamiento que fortalezca la competitividad internacional del camaron costarricense.",
    icono: ICONS.earth,
  },
];

const PREGUNTAS = [
  {
    id: "acuicultura-sostenible",
    pregunta: "¿Que es la acuicultura sostenible?",
    respuesta:
      "Es una forma responsable de producir especies acuaticas utilizando practicas que protegen el ambiente, aprovechan eficientemente los recursos y favorecen el bienestar de las comunidades productoras.",
  },
  {
    id: "requisitos-sanitarios",
    pregunta: "¿Que requisitos sanitarios exige el sector?",
    respuesta:
      "El sector de cultivo de camaron exige el Certificado Veterinario de Operación (CVO), buenas prácticas de manejo y estrictos controles de bioseguridad. Estas medidas protegen la salud de los animales y aseguran un producto seguro para comer.",
  },
];
 /* se deben camabiar a los datos reales de cada finca una vez obtengamos la informacion*/
const AGREMIADOS = [
  {
    id: "san-miguel",
    nombre: "Camaronera San Miguel",
    ubicacion: "Puntarenas",
    produccion: "45 ha en produccion",
  },
  {
    id: "pacifico",
    nombre: "Acuicola El Pacifico",
    ubicacion: "Guanacaste",
    produccion: "32 ha en produccion",
  },
  {
    id: "reina",
    nombre: "Finca La Reina",
    ubicacion: "Guanacaste",
    produccion: "28 ha en produccion",
  },
  {
    id: "sur",
    nombre: "Estanques del Sur",
    ubicacion: "Limon",
    produccion: "55 ha en produccion",
  },
  {
    id: "esperanza",
    nombre: "Camaronera La Esperanza",
    ubicacion: "Puntarenas",
    produccion: "38 ha en produccion",
  },
  {
    id: "cinco-estrellas",
    nombre: "Acuicultura Cinco Estrellas",
    ubicacion: "Quepos",
    produccion: "22 ha en produccion",
  },
];

const FINCAS_FOOTER = [
  "Finca El Pacifico - Puntarenas",
  "Finca La Reina - Guanacaste",
  "Camaronera La Union - Limon",
  "Estanques del Pacifico - Quepos",
  "Finca Mar Adentro - Nicoya",
];

const CONTACTO = {
  telefono: "+506 8888-8888",
  correo: "info@caprocam.com",
  direccion: "Colorado de Abangares, Guanacaste, Costa Rica",
  numeroWhatsapp: "50688015053",
  mensajeWhatsapp:
    "Hola, deseo recibir mas informacion.",
};

function convertirColorRgba(
  colorHexadecimal,
  opacidad,
) {
  const colorLimpio = colorHexadecimal.replace(
    "#",
    "",
  );
   const rojo = parseInt(
    colorLimpio.substring(0, 2),
    16,
  );

  const verde = parseInt(
    colorLimpio.substring(2, 4),
    16,
  );

  const azul = parseInt(
    colorLimpio.substring(4, 6),
    16,
  );

  return (
    "rgba(" +
    rojo +
    ", " +
    verde +
    ", " +
    azul +
    ", " +
    opacidad +
    ")"
  );
}

const COLORES_DEGRADADO = [
  convertirColorRgba(
    COLORS.textSecondary,
    0.97,
  ),
  convertirColorRgba(
    COLORS.primary,
    0.8,
  ),
  convertirColorRgba(
    COLORS.primary,
    0.52,
  ),
];

function SectionBadge({
  texto,
}) {
  return (
    <View style={styles.sectionBadge}>
      <Icon
        icon={ICONS.shrimp}
        size={13}
        color={COLORS.primary}
      />

      <Text style={styles.sectionBadgeText}>
        {texto}
      </Text>
    </View>
  );
}

function NavItem({
  texto,
  onPress,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={function ({
        hovered,
        pressed,
      }) {
        const itemStyles = [
          styles.navItem,
        ];

        if (hovered === true) {
          itemStyles.push(
            styles.navItemHover,
          );
        }

        if (pressed === true) {
          itemStyles.push(
            styles.navItemPressed,
          );
        }

        return itemStyles;
      }}
    >
      <Text style={styles.navItemText}>
        {texto}
      </Text>
    </Pressable>
  );
}

function BenefitCard({
  item,
  esMovil,
}) {
  const cardStyles = [
    styles.benefitCard,
    {
      backgroundColor: item.fondo,
    },
  ];

  if (esMovil === true) {
    cardStyles.push(
      styles.cardFullWidth,
    );
  }
    return (
    <View style={cardStyles}>
      <View style={styles.benefitIcon}>
        <Icon
          icon={item.icono}
          size={23}
          color={item.colorIcono}
        />
      </View>

      <Text style={styles.benefitTitle}>
        {item.titulo}
      </Text>
    </View>
  );
}

function ServiceCard({
  item,
  esMovil,
}) {
  const cardStyles = [
    styles.serviceCard,
  ];

  if (esMovil === true) {
    cardStyles.push(
      styles.serviceCardFullWidth,
    );
  }

  return (
    <View style={cardStyles}>
      <View style={styles.serviceIcon}>
        <Icon
          icon={item.icono}
          size={26}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>
          {item.titulo}
        </Text>

        <Text
          style={styles.serviceDescription}
        >
          {item.descripcion}
        </Text>
      </View>
    </View>
  );
}

function FaqItem({
  item,
  abierto,
  onPress,
}) {
  let icono = ICONS.chevronDown;

  if (abierto === true) {
    icono = ICONS.chevronUp;
  }

  return (
    <View style={styles.faqItem}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={styles.faqHeader}
      >
        <Text style={styles.faqQuestion}>
          {item.pregunta}
        </Text>

        <Icon
          icon={icono}
          size={21}
          color={COLORS.textTertiary}
        />
      </Pressable>

      {abierto && (
        <View
          style={
            styles.faqAnswerContainer
          }
        >
          <Text style={styles.faqAnswer}>
            {item.respuesta}
          </Text>
        </View>
      )}
    </View>
  );
}

function ProducerCard({
  item,
  esMovil,
  esTablet,
}) {
  const cardStyles = [
    styles.producerCard,
  ];

  if (esTablet === true) {
    cardStyles.push(
      styles.producerCardTablet,
    );
  }

  if (esMovil === true) {
    cardStyles.push(
      styles.producerCardMobile,
    );
  }

  return (
    <View style={cardStyles}>
      <View style={styles.producerIcon}>
        <Icon
          icon={ICONS.document}
          size={23}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.producerName}>
        {item.nombre}
      </Text>

      <View style={styles.producerLocation}>
        <Icon
          icon={ICONS.location}
          size={13}
          color={COLORS.primary}
        />

        <Text
          style={
            styles.producerLocationText
          }
        >
          {item.ubicacion}
        </Text>
      </View>

      <Text
        style={
          styles.producerProduction
        }
      >
        {item.produccion}
      </Text>
    </View>
  );
}

function FooterContact({
  icono,
  principal,
  secundario,
}) {
  return (
    <View
      style={styles.footerContactRow}
    >
      <View
        style={styles.footerContactIcon}
      >
        <Icon
          icon={icono}
          size={17}
          color={COLORS.primary}
        />
      </View>

      <View
        style={
          styles.footerTextContainer
        }
      >
        <Text
          style={styles.footerPrimary}
        >
          {principal}
        </Text>

        <Text
          style={styles.footerSecondary}
        >
          {secundario}
        </Text>
      </View>
    </View>
  );
}

export default function LandingScreen() {
  const scrollRef = useRef(null);
  const posicionesRef = useRef({});

  const opacidadHero = useRef(
    new Animated.Value(1),
  ).current;

  const {
    width,
  } = useWindowDimensions();

  const [
    indiceHero,
    setIndiceHero,
  ] = useState(0);

  const [
    preguntaAbierta,
    setPreguntaAbierta,
  ] = useState("");

  const esMovil = width < 760;

  const esTablet =
    width >= 760 &&
    width < 1100;

  const slideActual =
    HERO_SLIDES[indiceHero];

  const cambiarSlide = useCallback(
    function (nuevoIndice) {
      if (nuevoIndice === indiceHero) {
        return;
      }

      Animated.timing(opacidadHero, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(function () {
        setIndiceHero(nuevoIndice);

        Animated.timing(opacidadHero, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }).start();
      });
    },
    [
      indiceHero,
      opacidadHero,
    ],
  );

  useEffect(
    function () {
      const temporizador = setTimeout(
        function () {
          let siguienteIndice =
            indiceHero + 1;

          if (
            siguienteIndice >=
            HERO_SLIDES.length
          ) {
            siguienteIndice = 0;
          }

          cambiarSlide(
            siguienteIndice,
          );
        },
        5000,
      );

      return function () {
        clearTimeout(temporizador);
      };
    },
    [
      cambiarSlide,
      indiceHero,
    ],
  );

  function guardarPosicion(
    nombre,
    event,
  ) {
    posicionesRef.current[nombre] =
      event.nativeEvent.layout.y;
  }

  function irASeccion(nombre) {
    const posicion =
      posicionesRef.current[nombre];

    if (
      typeof posicion === "number" &&
      scrollRef.current
    ) {
      scrollRef.current.scrollTo({
        y: posicion,
        animated: true,
      });
    }
  }

  function irAlInicio() {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }

  

  function alternarPregunta(id) {
    setPreguntaAbierta(
      function (preguntaActual) {
        if (preguntaActual === id) {
          return "";
        }

        return id;
      },
    );
  }

  async function abrirWhatsapp() {
    const mensaje = encodeURIComponent(
      CONTACTO.mensajeWhatsapp,
    );

    const enlace =
      "https://wa.me/" +
      CONTACTO.numeroWhatsapp +
      "?text=" +
      mensaje;

    try {
      const disponible =
        await Linking.canOpenURL(enlace);

      if (disponible === false) {
        Alert.alert(
          "WhatsApp",
          "No fue posible abrir WhatsApp.",
        );

        return;
      }

      await Linking.openURL(enlace);
    } catch (error) {
      console.error(
        "Error abriendo WhatsApp:",
        error,
      );

      Alert.alert(
        "WhatsApp",
        "Ocurrio un error al abrir WhatsApp.",
      );
    }
  }

  const headerStyles = [
    styles.headerInner,
  ];

  const navStyles = [
    styles.nav,
  ];

  const loginButtonStyles = [
    styles.loginButton,
  ];

  const heroStyles = [
    styles.hero,
  ];

  const heroContentStyles = [
    styles.heroContent,
  ];

  const heroTitleStyles = [
    styles.heroTitle,
  ];

  const statsPanelStyles = [
    styles.statsPanel,
  ];

  const sectionInnerStyles = [
    styles.sectionInner,
  ];

  const aboutGridStyles = [
    styles.aboutGrid,
  ];

  const footerColumnsStyles = [
    styles.footerColumns,
  ];

  const footerBottomStyles = [
    styles.footerBottom,
  ];

  if (esTablet === true) {
    heroTitleStyles.push(
      styles.heroTitleTablet,
    );
  }

  if (esMovil === true) {
    headerStyles.push(
      styles.headerInnerMobile,
    );

    navStyles.push(
      styles.navMobile,
    );

    loginButtonStyles.push(
      styles.loginButtonMobile,
    );

    heroStyles.push(
      styles.heroMobile,
    );

    heroContentStyles.push(
      styles.heroContentMobile,
    );

    heroTitleStyles.push(
      styles.heroTitleMobile,
    );

    statsPanelStyles.push(
      styles.statsPanelMobile,
    );

    sectionInnerStyles.push(
      styles.sectionInnerMobile,
    );

    aboutGridStyles.push(
      styles.aboutGridMobile,
    );

    footerColumnsStyles.push(
      styles.footerColumnsMobile,
    );

    footerBottomStyles.push(
      styles.footerBottomMobile,
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={headerStyles}>
            <Pressable
              accessibilityRole="button"
              onPress={irAlInicio}
            >
              <Text style={styles.brandText}>
                CAPROCAM
              </Text>
            </Pressable>

            <View style={navStyles}>
              <NavItem
                texto="Quienes somos"
                onPress={function () {
                  irASeccion("quienes");
                }}
              />

              <NavItem
                texto="Que hacemos"
                onPress={function () {
                  irASeccion("servicios");
                }}
              />

              <NavItem
                texto="Agremiados"
                onPress={function () {
                  irASeccion("agremiados");
                }}
              />

              <NavItem
                texto="Contacto"
                onPress={function () {
                  irASeccion("contacto");
                }}
              />
            </View>

            <Button
              variant="primary"
              style={loginButtonStyles}
            >
              <View
                style={styles.buttonContent}
              >
                <Icon
                  icon={ICONS.shrimp}
                  size={16}
                  color={COLORS.white}
                />

                <Text
                  style={
                    styles.loginButtonText
                  }
                >
                  Iniciar sesion
                </Text>
              </View>
            </Button>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={heroStyles}>
            <Animated.Image
              source={slideActual.imagen}
              resizeMode="cover"
              style={[
                styles.heroImage,
                {
                  opacity: opacidadHero,
                },
              ]}
            />

            <LinearGradient
              pointerEvents="none"
              colors={COLORES_DEGRADADO}
              locations={[
                0,
                0.55,
                1,
              ]}
              start={{
                x: 0,
                y: 0.5,
              }}
              end={{
                x: 1,
                y: 0.5,
              }}
              style={styles.heroGradient}
            />

            <View
              pointerEvents="none"
              style={styles.heroDarkLayer}
            />

            <View style={heroContentStyles}>
              <View style={styles.heroBadge}>
                <Icon
                  icon={ICONS.shrimp}
                  size={14}
                  color={COLORS.white}
                />

                <Text
                  style={styles.heroBadgeText}
                >
                  Camara Nacional de
                  Productores de Camaron
                </Text>
              </View>

              <Text style={heroTitleStyles}>
                Impulsando la
              </Text>

              <View
                style={styles.heroTitleRow}
              >
                <Text
                  style={[
                    ...heroTitleStyles,
                    styles.heroAccent,
                  ]}
                >
                  acuicultura
                </Text>

                <Text
                  style={heroTitleStyles}
                >
                  {" costarricense"}
                </Text>
              </View>

              <Text
                style={styles.heroDescription}
              >
                CAPROCAM representa y fortalece
                al sector camaronero de Costa
                Rica, promoviendo la produccion
                sostenible, el bienestar de los
                agremiados y la excelencia
                exportadora.
              </Text>

              <Button
                variant="outline"
                onPress={function () {
                  irASeccion("quienes");
                }}
                style={styles.heroButton}
              >
                <Text
                  style={
                    styles.heroButtonText
                  }
                >
                  Conocer mas
                </Text>
              </Button>

              <View style={statsPanelStyles}>
                <View style={styles.statItem}>
                  <Text
                    style={styles.statNumber}
                  >
                    200+
                  </Text>

                  <Text
                    style={styles.statLabel}
                  >
                    Productores agremiados
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    esMovil &&
                      styles.statDividerMobile,
                  ]}
                />

                <View style={styles.statItem}>
                  <Text
                    style={styles.statNumber}
                  >
                    15 000+
                  </Text>

                  <Text
                    style={styles.statLabel}
                  >
                    Hectareas en produccion
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    esMovil &&
                      styles.statDividerMobile,
                  ]}
                />

                <View style={styles.statItem}>
                  <Text
                    style={styles.statNumber}
                  >
                    30+
                  </Text>

                  <Text
                    style={styles.statLabel}
                  >
                    Años de experiencia
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.carouselIndicators
                }
              >
                {HERO_SLIDES.map(
                  function (
                    slide,
                    index,
                  ) {
                    const dotStyles = [
                      styles.carouselDot,
                    ];

                    if (
                      index === indiceHero
                    ) {
                      dotStyles.push(
                        styles.carouselDotActive,
                      );
                    }

                    return (
                      <Pressable
                        key={slide.id}
                        accessibilityRole="button"
                        accessibilityLabel={
                          "Mostrar imagen " +
                          (index + 1)
                        }
                        onPress={function () {
                          cambiarSlide(index);
                        }}
                        style={
                          styles
                            .carouselIndicatorButton
                        }
                      >
                        <View
                          style={dotStyles}
                        />
                      </Pressable>
                    );
                  },
                )}
              </View>
            </View>

            <View
              style={styles.heroPhotoCaption}
            >
              <Text
                style={
                  styles.heroPhotoCaptionText
                }
              >
                {slideActual.descripcion}
              </Text>
            </View>

            <View
              style={styles.heroBottomCurve}
            />
          </View>

          <View
            onLayout={function (event) {
              guardarPosicion(
                "quienes",
                event,
              );
            }}
            style={[
              styles.section,
              esMovil &&
                styles.sectionMobile,
            ]}
          >
            <View style={sectionInnerStyles}>
              <View style={aboutGridStyles}>
                <View
                  style={
                    styles.aboutTextColumn
                  }
                >
                  <SectionBadge
                    texto="QUIENES SOMOS"
                  />

                  <Text
                    style={[
                      styles.sectionTitle,
                      esMovil &&
                        styles
                          .sectionTitleMobile,
                    ]}
                  >
                    La voz del camaron
                    costarricense
                  </Text>

                  <Text
                    style={styles.paragraph}
                  >
                    CAPROCAM es la organizacion
                    gremial que agrupa y
                    representa a los productores
                    y exportadores de camaron de
                    cultivo en Costa Rica. Somos
                    la voz unificada del sector
                    camaronero nacional,
                    comprometidos con el
                    desarrollo sostenible de la
                    acuicultura en las regiones
                    costeras del pais.
                  </Text>

                  <Text
                    style={styles.paragraph}
                  >
                    Nuestra camara congrega a
                    empresas productoras
                    dedicadas al cultivo del
                    camaron blanco del Pacifico,
                    una actividad que constituye
                    un pilar economico para las
                    comunidades costeras,
                    generando empleo y
                    dinamizando las economias
                    locales.
                  </Text>
                </View>

                <View
                  style={styles.benefitsGrid}
                >
                  {BENEFICIOS.map(
                    function (item) {
                      return (
                        <BenefitCard
                          key={item.id}
                          item={item}
                          esMovil={esMovil}
                        />
                      );
                    },
                  )}
                </View>
              </View>
            </View>
          </View>

          <View
            onLayout={function (event) {
              guardarPosicion(
                "servicios",
                event,
              );
            }}
            style={[
              styles.section,
              styles.sectionAlt,
              esMovil &&
                styles.sectionMobile,
            ]}
          >
            <View style={sectionInnerStyles}>
              <SectionBadge
                texto="QUE HACEMOS"
              />

              <Text
                style={[
                  styles.sectionTitle,
                  esMovil &&
                    styles.sectionTitleMobile,
                ]}
              >
                Servicios para el sector
                acuicola
              </Text>

              <Text
                style={styles.sectionSubtitle}
              >
                Nuestra mision principal es
                promover el crecimiento, la
                competitividad y la
                sostenibilidad del sector
                camaronero de cultivo.
              </Text>

              <View
                style={styles.servicesGrid}
              >
                {SERVICIOS.map(
                  function (item) {
                    return (
                      <ServiceCard
                        key={item.id}
                        item={item}
                        esMovil={esMovil}
                      />
                    );
                  },
                )}
              </View>

              <View style={styles.faqList}>
                {PREGUNTAS.map(
                  function (item) {
                    const abierto =
                      preguntaAbierta ===
                      item.id;

                    return (
                      <FaqItem
                        key={item.id}
                        item={item}
                        abierto={abierto}
                        onPress={function () {
                          alternarPregunta(
                            item.id,
                          );
                        }}
                      />
                    );
                  },
                )}
              </View>
            </View>
          </View>

          <View
            onLayout={function (event) {
              guardarPosicion(
                "agremiados",
                event,
              );
            }}
            style={[
              styles.section,
              esMovil &&
                styles.sectionMobile,
            ]}
          >
            <View style={sectionInnerStyles}>
              <SectionBadge
                texto="AGREMIADOS"
              />

              <Text
                style={[
                  styles.sectionTitle,
                  esMovil &&
                    styles.sectionTitleMobile,
                ]}
              >
                Productores que confian en
                CAPROCAM
              </Text>

              <Text
                style={styles.sectionSubtitle}
              >
                Nuestra red de agremiados abarca
                las principales provincias
                productoras de camaron de Costa
                Rica. Juntos somos el motor del
                sector acuicola nacional.
              </Text>

              <View
                style={styles.producersGrid}
              >
                {AGREMIADOS.map(
                  function (item) {
                    return (
                      <ProducerCard
                        key={item.id}
                        item={item}
                        esMovil={esMovil}
                        esTablet={esTablet}
                      />
                    );
                  },
                )}
              </View>

              <View
                style={[
                  styles.cta,
                  esMovil &&
                    styles.ctaMobile,
                ]}
              >
                <Text style={styles.ctaTitle}>
                  ¿Estas interesado en comprar
                  camarones?
                </Text>

                <Text
                  style={styles.ctaSubtitle}
                >
                  Ingresa al siguiente enlace
                </Text>

                <Button
                  variant="primary"
                  onPress={abrirWhatsapp}
                  style={styles.whatsappButton}
                >
                  <View
                    style={
                      styles.buttonContent
                    }
                  >
                    <Icon
                      icon={ICONS.whatsApp}
                      size={20}
                      color={COLORS.white}
                    />

                    <Text
                      style={
                        styles
                          .whatsappButtonText
                      }
                    >
                      Contactar por WhatsApp
                    </Text>
                  </View>
                </Button>
              </View>
            </View>
          </View>

          <View
            onLayout={function (event) {
              guardarPosicion(
                "contacto",
                event,
              );
            }}
            style={styles.footer}
          >
            <View style={styles.footerInner}>
              <View
                style={footerColumnsStyles}
              >
                <View
                  style={styles.footerColumn}
                >
                  <Text
                    style={styles.footerTitle}
                  >
                    CONTACTENOS
                  </Text>

                  <FooterContact
                    icono={ICONS.phone}
                    principal={
                      CONTACTO.telefono
                    }
                    secundario="Linea principal"
                  />

                  <FooterContact
                    icono={ICONS.document}
                    principal={
                      CONTACTO.correo
                    }
                    secundario="Correo institucional"
                  />

                  <FooterContact
                    icono={ICONS.location}
                    principal={
                      CONTACTO.direccion
                    }
                    secundario="Costa Rica"
                  />
                </View>

                <View
                  style={styles.footerColumn}
                >
                  <Text
                    style={styles.footerTitle}
                  >
                    HORARIO DE ATENCION
                  </Text>

                  <FooterContact
                    icono={ICONS.clock}
                    principal="Lunes a Viernes"
                    secundario="8:00 AM - 5:00 PM"
                  />

                  <FooterContact
                    icono={ICONS.clock}
                    principal="Sabados"
                    secundario="8:00 AM - 12:00 PM"
                  />

                  <FooterContact
                    icono={ICONS.clock}
                    principal="Domingos"
                    secundario="Cerrado"
                  />

                  <View
                    style={
                      styles.scheduleBadge
                    }
                  >
                    <Text
                      style={
                        styles
                          .scheduleBadgeText
                      }
                    >
                      Sistema de gestion
                      disponible 24/7
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.footerColumn}
                >
                  <Text
                    style={styles.footerTitle}
                  >
                    FINCAS PRODUCTORAS
                  </Text>

                  {FINCAS_FOOTER.map(
                    function (finca) {
                      return (
                        <View
                          key={finca}
                          style={
                            styles.footerFarmRow
                          }
                        >
                          <View
                            style={
                              styles.footerBullet
                            }
                          />

                          <Text
                            style={
                              styles.footerFarmText
                            }
                          >
                            {finca}
                          </Text>
                        </View>
                      );
                    },
                  )}
                </View>
              </View>

              <View
                style={styles.footerDivider}
              />

              <View style={footerBottomStyles}>
                <Text
                  style={styles.copyright}
                >
                  © 2026 CAPROCAM - Camara
                  Nacional de Productores de
                  Camaron de Costa Rica. Todos
                  los derechos reservados.
                </Text>

                <View
                  style={styles.footerLinks}
                >
                  <Text
                    style={styles.footerLink}
                  >
                    Terminos de uso
                  </Text>

                  <Text
                    style={styles.footerLink}
                  >
                    Privacidad
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}














