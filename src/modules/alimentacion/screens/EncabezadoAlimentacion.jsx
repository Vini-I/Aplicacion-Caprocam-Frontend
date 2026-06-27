import React from "react";
import { View, TouchableOpacity } from "react-native";

import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/alimentacionStyles";

export default function EncabezadoAlimentacionScreen({ onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        activeOpacity={0.7}
      >
        <Icon icon={ICONS.exit} size={20} color={COLORS.white} />
        <Text tamano="sm" color={COLORS.white}>
          Módulos
        </Text>
      </TouchableOpacity>

      <View style={styles.headerTitle}>
        <Icon icon={ICONS.shrimp} size={20} color={COLORS.white} />
        <Title level={4} color={COLORS.white}>
          Alimentación
        </Title>
      </View>
    </View>
  );
}