/**
 * ============================================================
 * COMPONENTE DE COMUNIDAD DE AGREMIADOS
 * ============================================================
 *
 * Presenta la sección de productores afiliados a CAPROCAM,
 * mostrando información sobre su ubicación y producción, además
 * de una invitación para formar parte de la asociación.
 *
 * Funcionalidad:
 * - Genera las tarjetas de productores desde los datos configurados.
 * - Muestra el nombre, la ubicación y la producción de cada agremiado.
 * - Incluye íconos representativos en las tarjetas.
 * - Permite contactar a CAPROCAM mediante correo electrónico.
 * - Registra la posición de la sección para permitir la navegación.
 * - Adapta las tarjetas y el contenido para móviles y tabletas.
 */

import { Text, View } from "react-native";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { AGREMIADOS } from "../data/landing.data";
import { styles } from "../styles/LandingStyle";
import SectionBadge from "./SectionBadge";

function ProducerCard({ item, esMovil, esTablet }) {
  return (
    <View
      style={[
        styles.producerCard,
        esTablet && styles.producerCardTablet,
        esMovil && styles.producerCardMobile,
      ]}
    >
      <View style={styles.producerIcon}>
        <Icon
          icon={ICONS.document}
          size={23}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.producerName}>{item.nombre}</Text>
      <View style={styles.producerLocation}>
        <Icon
          icon={ICONS.location}
          size={13}
          color={COLORS.primary}
        />
        <Text style={styles.producerLocationText}>
          {item.ubicacion}
        </Text>
      </View>
      <Text style={styles.producerProduction}>
        {item.produccion}
      </Text>
    </View>
  );
}

export default function LandingCommunity({
  esMovil,
  esTablet,
  guardarPosicion,
  abrirCorreo,
}) {
  return (
    <View
      style={[
        styles.section,
        esMovil && styles.sectionMobile,
      ]}
      onLayout={(event) =>
        guardarPosicion("agremiados", event)
      }
    >
      <View
        style={[
          styles.sectionInner,
          esMovil && styles.sectionInnerMobile,
        ]}
      >
        <SectionBadge texto="NUESTRA COMUNIDAD" />
        <Text
          style={[
            styles.sectionTitle,
            esMovil && styles.sectionTitleMobile,
          ]}
        >
          Una comunidad unida por el sector productivo
        </Text>
        <Text style={styles.sectionSubtitle}>
          CAPROCAM reúne a personas productoras 
          vinculadas con la producción de camarón 
          y sal.
        </Text>
        <View style={styles.producersGrid}>
          {AGREMIADOS.map((item) => (
            <ProducerCard
              key={item.id}
              item={item}
              esMovil={esMovil}
              esTablet={esTablet}
            />
          ))}
        </View>
        <View
          style={[styles.cta, esMovil && styles.ctaMobile]}
        >
          <Text style={styles.ctaTitle}>
            ¿Quieres saber de CAPROCAM?
          </Text>
          <Text style={styles.ctaSubtitle}>
            Contáctanos y conoce cómo podemos acompañarte.
          </Text>
          <Button
            style={styles.emailButton}
            onPress={abrirCorreo}
          >
            <View style={styles.buttonContent}>
              <Icon
                icon={ICONS.email}
                size={18}
                color={COLORS.white}
              />
              <Text style={styles.emailButtonText}>
                Escríbenos por correo
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  );
}
