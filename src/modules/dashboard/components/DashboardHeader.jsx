/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardHeader.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Renderiza el encabezado principal del Dashboard.
//////////////////////////////////////////////////////////
*/

import { View } from "react-native";

import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/DashboardStyle";

export default function DashboardHeader() {
  return (
    <View style={styles.headerCard}>
      <View style={styles.headerIconBox}>
        <Icon icon={ICONS.dashboard} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.headerTextBox}>
        <Title level={5} style={styles.headerTitle}>
          Dashboard general
        </Title>

        <CustomText size={12} color={COLORS.white} style={styles.headerSubtitle} numberOfLines={1}>
          Resumen operativo, sanitario y alertas
        </CustomText>
      </View>
    </View>
  );
}