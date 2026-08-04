import React from "react";
import { View } from "react-native";
import Icon from "../../../shared/components/Icons";
import Title from "../../../shared/components/Title";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/EstanqueStyle";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export function SectionTitle({ title, icon }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} />
      <Title
        level={5}
        color={COLORS.textSecondary}
        fuente={TYPOGRAPHY.fontFamily.bold}
        style={styles.sectionTitle}
      >
        {title}
      </Title>
    </View>
  );
}

export function OptionButton({ label, value, selectedValue, onPress }) {
  const isSelected = value === selectedValue;
  return (
    <Button
      variant="outline"
      onPress={() => onPress(value)}
      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
    >
      <CustomText
        size={13}
        color={isSelected ? COLORS.primary : COLORS.textSecondary}
        align="center"
        style={{
          fontFamily: isSelected
            ? TYPOGRAPHY.fontFamily.bold
            : TYPOGRAPHY.fontFamily.medium,
        }}
      >
        {label}
      </CustomText>
    </Button>
  );
}

export function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <CustomText size={13} color={COLORS.black} weight="600" style={styles.infoLabel}>
        {label}
      </CustomText>
      <CustomText size={15} color={COLORS.textSecondary} style={styles.infoValue}>
        {value || "No registrado"}
      </CustomText>
    </View>
  );
}
