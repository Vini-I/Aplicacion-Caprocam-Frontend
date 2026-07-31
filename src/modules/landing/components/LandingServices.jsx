/**
 * ============================================================
 * COMPONENTE DE SERVICIOS Y PREGUNTAS FRECUENTES
 * ============================================================
 *
 * Presenta los servicios ofrecidos por CAPROCAM para apoyar el
 * desarrollo del sector camaronero e incluye una sección de
 * preguntas frecuentes con respuestas desplegables.
 *
 * Funcionalidad:
 * - Genera las tarjetas de servicios desde los datos configurados.
 * - Muestra el ícono, título y descripción de cada servicio.
 * - Presenta una lista interactiva de preguntas frecuentes.
 * - Permite abrir y cerrar individualmente las respuestas.
 * - Cambia el ícono según el estado de cada pregunta.
 * - Registra la posición de la sección para permitir la navegación.
 * - Adapta la distribución del contenido para dispositivos móviles.
 */

import { Pressable, Text, View } from "react-native";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { PREGUNTAS, SERVICIOS } from "../data/landing.data";
import { styles } from "../styles/LandingStyle";
import SectionBadge from "./SectionBadge";

function ServiceCard({ item, esMovil }) {
  return (
    <View
      style={[
        styles.serviceCard,
        esMovil && styles.serviceCardFullWidth,
      ]}
    >
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
        <Text style={styles.serviceDescription}>
          {item.descripcion}
        </Text>
      </View>
    </View>
  );
}

export default function LandingServices({
  esMovil,
  guardarPosicion,
  preguntaAbierta,
  alternarPregunta,
}) {
  return (
    <View
      style={[
        styles.section,
        styles.sectionAlt,
        esMovil && styles.sectionMobile,
      ]}
      onLayout={(event) =>
        guardarPosicion("servicios", event)
      }
    >
      <View
        style={[
          styles.sectionInner,
          esMovil && styles.sectionInnerMobile,
        ]}
      >
        <SectionBadge texto="NUESTRO TRABAJO" />
        <Text
          style={[
            styles.sectionTitle,
            esMovil && styles.sectionTitleMobile,
          ]}
        >
          Servicios para el desarrollo del sector
        </Text>
        <Text style={styles.sectionSubtitle}>
          Acompañamos a nuestros agremiados para impulsar
          una producción eficiente y sostenible.
        </Text>
        <View style={styles.servicesGrid}>
          {SERVICIOS.map((item) => (
            <ServiceCard
              key={item.id}
              item={item}
              esMovil={esMovil}
            />
          ))}
        </View>
        <View style={styles.faqList}>
          {PREGUNTAS.map((item) => {
            const abierto = preguntaAbierta === item.id;
            return (
              <View
                key={item.id}
                style={styles.faqItem}
              >
                <Pressable
                  onPress={() => alternarPregunta(item.id)}
                  style={styles.faqHeader}
                >
                  <Text style={styles.faqQuestion}>
                    {item.pregunta}
                  </Text>
                  <Icon
                    icon={
                      abierto
                        ? ICONS.chevronUp
                        : ICONS.chevronDown
                    }
                    size={21}
                    color={COLORS.textTertiary}
                  />
                </Pressable>
                {abierto && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>
                      {item.respuesta}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
