/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardEstadisticas.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Renderiza las tarjetas de resumen general del Dashboard.
//////////////////////////////////////////////////////////
*/

import { View } from "react-native";

import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { formatearNumero } from "../utils/DashboardUtils";
import { styles } from "../styles/DashboardStyle";

function StatCard({ id, selectedId, onPress, icon, value, label, cardStyle, iconStyle, iconColor, danger, isTablet }) {
  const cardStyles = [
    styles.statCard,
    cardStyle,
    isTablet ? styles.statCardTablet : null,
    selectedId === id ? styles.statCardActive : null,
  ];

  const valueStyles = [
    styles.statValue,
    danger ? styles.statValueDanger : null,
  ];

  return (
    <Button variant="ghost" style={cardStyles} onPress={() => onPress(id)}>
      <View style={styles.statTopRow}>
        <View style={[styles.statIconBox, iconStyle]}>
          <Icon icon={icon} size={22} color={iconColor} />
        </View>

        <Icon
          icon={selectedId === id ? ICONS.chevronUp : ICONS.chevronDown}
          size={18}
          color={COLORS.textTertiary}
        />
      </View>

      <View style={styles.statBottom}>
        <CustomText style={valueStyles}>
          {value}
        </CustomText>

        <CustomText size={12} color={COLORS.textTertiary} style={styles.statLabel}>
          {label}
        </CustomText>
      </View>
    </Button>
  );
}

export default function DashboardEstadisticas({
  selectedCard,
  isTablet,
  totalFincas,
  totalEstanques,
  totalCasosSanitarios,
  totalMortalidad,
  onSelect,
}) {
  return (
    <View style={[styles.statsGrid, isTablet ? styles.statsGridTablet : null]}>
      <StatCard
        id="fincas"
        selectedId={selectedCard}
        onPress={onSelect}
        icon={ICONS.home}
        value={totalFincas}
        label="Fincas registradas"
        cardStyle={styles.cardBlue}
        iconStyle={styles.iconBlue}
        iconColor={COLORS.primary}
        isTablet={isTablet}
      />

      <StatCard
        id="estanques"
        selectedId={selectedCard}
        onPress={onSelect}
        icon={ICONS.waterFlow}
        value={totalEstanques}
        label="Estanques registrados"
        cardStyle={styles.cardIndigo}
        iconStyle={styles.iconIndigo}
        iconColor={COLORS.primary}
        isTablet={isTablet}
      />

      <StatCard
        id="casos"
        selectedId={selectedCard}
        onPress={onSelect}
        icon={ICONS.shieldAlert}
        value={totalCasosSanitarios}
        label="Casos sanitarios"
        cardStyle={styles.cardYellow}
        iconStyle={styles.iconYellow}
        iconColor={COLORS.warning}
        isTablet={isTablet}
      />

      <StatCard
        id="mortalidad"
        selectedId={selectedCard}
        onPress={onSelect}
        icon={ICONS.mortality}
        value={formatearNumero(totalMortalidad)}
        label="Mortalidad total"
        cardStyle={styles.cardRed}
        iconStyle={styles.iconRed}
        iconColor={COLORS.error}
        danger={true}
        isTablet={isTablet}
      />
    </View>
  );
}