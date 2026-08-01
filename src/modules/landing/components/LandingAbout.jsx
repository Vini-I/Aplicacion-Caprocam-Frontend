/**
 * ============================================================
 * COMPONENTE DE INFORMACIÓN SOBRE CAPROCAM
 * ============================================================
 *
 * Presenta la sección “Quiénes somos” de la página principal,
 * incluyendo información general sobre CAPROCAM y los beneficios
 * que ofrece a los productores del sector camaronero.
 *
 * Funcionalidad:
 * - Muestra la descripción y los objetivos de la asociación.
 * - Genera las tarjetas de beneficios desde los datos configurados.
 * - Presenta cada beneficio con su respectivo ícono y color.
 * - Registra la posición de la sección para permitir la navegación.
 * - Adapta la distribución del contenido para dispositivos móviles.
 */

import { Text, View } from "react-native";
import Icon from "../../../shared/components/Icons";
import { BENEFICIOS } from "../data/landing.data";
import { styles } from "../styles/LandingStyle";
import SectionBadge from "./SectionBadge";

function BenefitCard({ item, esMovil }) {
  return (
    <View
      style={[
        styles.benefitCard,
        { backgroundColor: item.fondo },
        esMovil && styles.cardFullWidth,
      ]}
    >
      <View style={styles.benefitIcon}>
        <Icon
          icon={item.icono}
          size={23}
          color={item.colorIcono}
        />
      </View>
      <Text style={styles.benefitTitle}>{item.titulo}</Text>
    </View>
  );
}

export default function LandingAbout({
  esMovil,
  guardarPosicion,
}) {
  return (
    <View
      style={[
        styles.section,
        esMovil && styles.sectionMobile,
      ]}
      onLayout={(event) =>
        guardarPosicion("quienes", event)
      }
    >
      <View
        style={[
          styles.sectionInner,
          esMovil && styles.sectionInnerMobile,
        ]}
      >
        <View
          style={[
            styles.aboutGrid,
            esMovil && styles.aboutGridMobile,
          ]}
        >
          <View style={styles.aboutTextColumn}>
            <SectionBadge texto="QUIÉNES SOMOS" />
            <Text
              style={[
                styles.sectionTitle,
                esMovil && styles.sectionTitleMobile,
              ]}
            >
              Una asociación comprometida con el sector
              camaronero
            </Text>
            <Text style={styles.paragraph}>
              CAPROCAM representa y acompaña a los
              productores de camarón de Costa Rica,
              impulsando una acuicultura competitiva,
              responsable y sostenible.
            </Text>
            <Text style={styles.paragraph}>
              Trabajamos para fortalecer el desarrollo
              técnico, productivo y comercial de nuestros
              agremiados.
            </Text>
          </View>
          <View
            style={[
              styles.benefitsGrid,
              esMovil && styles.benefitsGridMobile,
            ]}
          >
            {BENEFICIOS.map((item) => (
              <BenefitCard
                key={item.id}
                item={item}
                esMovil={esMovil}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
