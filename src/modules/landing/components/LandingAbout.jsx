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
  esTablet,
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
            (esMovil || esTablet) && styles.aboutGridMobile,
          ]}
        >
          <View
            style={[
              styles.aboutTextColumn,
              (esMovil || esTablet) &&
                styles.aboutTextColumnStacked,
            ]}
          >
            <SectionBadge texto="QUIÉNES SOMOS" />
            <Text
              style={[
                styles.sectionTitle,
                esMovil && styles.sectionTitleMobile,
              ]}
            >
              Una organización creada por y para sus 
              productores
            </Text>
            <Text style={styles.paragraph}>
              CAPROCAM es la Cámara Nacional de 
              Productores de Camarón y Sal, creada 
              por iniciativa de personas productoras 
              de ambos sectores.
            </Text>
            <Text style={styles.paragraph}>
              Desde su creación el 28 de mayo de 2014, 
              reúne a sus asociados bajo una estructura 
              organizativa orientada a atender sus intereses 
              y necesidades.
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
