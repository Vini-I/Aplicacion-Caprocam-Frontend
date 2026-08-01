/**
 * ============================================================
 * COMPONENTE DE PIE DE PÁGINA
 * ============================================================
 *
 * Presenta el pie de página de la pantalla principal con la
 * información de contacto, los horarios de atención, las fincas
 * agremiadas y los datos legales de CAPROCAM.
 *
 * Funcionalidad:
 * - Muestra el teléfono, correo electrónico y dirección.
 * - Presenta los horarios de atención y los días sin servicio.
 * - Informa sobre la disponibilidad permanente del sistema de gestión.
 * - Genera la lista de fincas agremiadas desde los datos configurados.
 * - Incluye los derechos reservados y enlaces legales.
 * - Registra la posición de la sección de contacto.
 * - Adapta la distribución del pie de página para dispositivos móviles.
 */

import { Text, View } from "react-native";

import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import {
  CONTACTO,
  FINCAS_FOOTER,
} from "../data/landing.data";
import { styles } from "../styles/LandingStyle";

function FooterContact({ icono, principal, secundario }) {
  return (
    <View style={styles.footerContactRow}>
      <View style={styles.footerContactIcon}>
        <Icon
          icon={icono}
          size={17}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerPrimary}>
          {principal}
        </Text>
        {secundario && (
          <Text style={styles.footerSecondary}>
            {secundario}
          </Text>
        )}
      </View>
    </View>
  );
}

function ScheduleItem({ dia, horario, activo = true }) {
  return (
    <View
      style={[
        styles.scheduleRow,
        activo === false && styles.scheduleRowInactive,
      ]}
    >
      <Icon
        icon={ICONS.clock}
        size={22}
        color={
          activo ? COLORS.primary : COLORS.textQuaternary
        }
      />

      <View style={styles.scheduleTextContent}>
        <Text
          style={[
            styles.scheduleDay,
            activo === false && styles.scheduleDayInactive,
          ]}
        >
          {dia}
        </Text>
        <Text style={styles.scheduleHours}>{horario}</Text>
      </View>
    </View>
  );
}

export default function LandingFooter({
  esMovil,
  guardarPosicion,
}) {
  return (
    <View
      style={styles.footer}
      onLayout={(event) =>
        guardarPosicion("contacto", event)
      }
    >
      <View style={styles.footerInner}>
        <View
          style={[
            styles.footerColumns,
            esMovil && styles.footerColumnsMobile,
          ]}
        >
          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>
              CONTÁCTANOS
            </Text>
            <FooterContact
              icono={ICONS.phone}
              principal={CONTACTO.telefono}
            />
            <FooterContact
              icono={ICONS.email}
              principal={CONTACTO.correo}
            />
            <FooterContact
              icono={ICONS.location}
              principal={CONTACTO.direccion}
            />
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>
              HORARIO DE ATENCIÓN
            </Text>
            <ScheduleItem
              dia="Lunes a Viernes"
              horario="8:00 AM — 5:00 PM"
            />
            <ScheduleItem
              dia="Sábados"
              horario="8:00 AM — 12:00 PM"
              activo={false}
            />
            <ScheduleItem
              dia="Domingos"
              horario="Cerrado"
              activo={false}
            />
            <View style={styles.scheduleBadge}>
              <Text style={styles.scheduleBadgeText}>
                Sistema de gestión disponible 24/7
              </Text>
            </View>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>
              AGREMIADOS
            </Text>
            {FINCAS_FOOTER.map((finca) => (
              <View
                key={finca}
                style={styles.footerFarmRow}
              >
                <View style={styles.footerBullet} />
                <Text style={styles.footerFarmText}>
                  {finca}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footerDivider} />

        <View
          style={[
            styles.footerBottom,
            esMovil && styles.footerBottomMobile,
          ]}
        >
          <Text style={styles.copyright}>
            © 2026 CAPROCAM. Todos los derechos reservados.
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>
              Privacidad
            </Text>
            <Text style={styles.footerLink}>Términos</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
