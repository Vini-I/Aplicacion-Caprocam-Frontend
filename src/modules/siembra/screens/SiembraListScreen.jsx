/**
 * =========================================================================
 * PANTALLA LISTADO DE SIEMBRAS
 * =========================================================================
 *
 * Pantalla encargada de mostrar el listado de siembras activas registradas
 * dentro del módulo de Siembra.
 *
 * FUNCIONALIDAD:
 *
 * 1. Obtiene y muestra las siembras registradas mediante el servicio:
 *      - obtenerSiembras.
 *
 * 2. Renderiza cada siembra mediante una tarjeta informativa con:
 *      - Estanque asociado.
 *      - Finca correspondiente.
 *      - Estado actual.
 *      - Identificador de siembra.
 *      - Fecha de siembra.
 *      - Día actual del cultivo.
 *      - Cantidad sembrada.
 *      - Código de lote.
 *      - PL de larva.
 *
 * 3. Permite navegar hacia:
 *      - Registro de una nueva siembra.
 *      - Detalle y edición de una siembra existente.
 *
 * 4. Muestra la cantidad total de siembras activas disponibles.
 *
 * 5. Utiliza componentes visuales reutilizables para mantener la
 *    consistencia del diseño:
 *      - Cards.
 *      - Badges.
 *      - Botones.
 *      - Iconos.
 *
 * COMPONENTES UTILIZADOS:
 *
 * - NavbarRegistro: encabezado de la pantalla.
 * - Card: contenedor visual de cada siembra.
 * - Badge: indicador del estado de la siembra.
 * - Button: acciones de navegación.
 * - Icon: representación visual de acciones.
 *
 * NAVEGACIÓN:
 * - /siembra/nueva
 *      Registro de una nueva siembra.
 *
 * - /siembra/detalle
 *      Visualización y edición de una siembra existente.
 *
 * IMPORTANTE:
 *
 * - No modifica los datos de una siembra directamente.
 * - No contiene lógica de cálculo del ciclo productivo.
 * - Mantiene la responsabilidad de presentación y navegación.
 *
 * =========================================================================
 */
import { View, Text, ScrollView } from "react-native";
import { styles } from "../styles/SiembraListStyles";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Icon from "../../../shared/components/Icons";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import { obtenerSiembras } from "../services/SiembraService";
import { useRouter } from "expo-router";

export default function SiembraListScreen() {
  const siembras = obtenerSiembras();
  const router = useRouter();

  const handleNuevaSiembra = () => {
    router.push("/siembra/nueva");
  };

  const handleDetalleSiembra = (siembraId) => {
    router.push({
      pathname: "/siembra/detalle",
      params: { id: siembraId },
    });
  };

  function renderSiembra(siembra) {
    return (
      <Card key={siembra.siembraId} style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Estanque {siembra.estanque}</Text>
            <Text style={styles.cardSubtitle}>{siembra.finca}</Text>
          </View>

          <Badge
            label={siembra.estado}
            variant="success"
            style={styles.statusBadge}
            textStyle={styles.statusText}
          />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Siembra:</Text>
            <Text style={styles.infoValue}>#{siembra.siembraId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>{siembra.fechaSiembra}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Día de cultivo:</Text>
            <Text style={styles.infoValue}>
              {siembra.diasCultivo} de {siembra.diasMaduracion}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cantidad sembrada:</Text>
            <Text style={styles.infoValue}>
              {Number(siembra.cantidadSembrada ?? 0).toLocaleString()} camarones
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lote:</Text>
            <Text style={styles.infoValue}>{siembra.codigoLoteLarva}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PL:</Text>
            <Text style={styles.infoValue}>{siembra.plLarva}</Text>
          </View>
        </View>

        <Button
          variant="outline"
          onPress={() => handleDetalleSiembra(siembra.siembraId)}
          style={styles.detailButton}
          textStyle={styles.detailButtonText}
        >
          <View style={styles.detailButtonContent}>
            <Icon icon={ICONS.edit} size={20} color={COLORS.primary} />
            <Text style={styles.detailButtonText}>Ver detalles / Editar</Text>
          </View>
        </Button>
      </Card>
    );
  }

  return (
    <View style={STYLE.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={STYLE.contentWrapper}>
          <View style={styles.contentHeader}>
            <Text style={styles.sectionTitle}>
              Siembras activas ({siembras.length})
            </Text>

            <Button
              variant="outline"
              onPress={handleNuevaSiembra}
              style={styles.newButton}
            >
              <View style={styles.newButtonContent}>
                <Icon icon={ICONS.add} size={20} color={COLORS.primary} />
                <Text style={styles.newButtonText}>Nueva Siembra</Text>
              </View>
            </Button>
          </View>

          {siembras.map(renderSiembra)}
        </View>
      </ScrollView>
    </View>
  );
}
