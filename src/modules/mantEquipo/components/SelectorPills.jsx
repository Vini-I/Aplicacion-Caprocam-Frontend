/**
 * ============================================================
 * COMPONENTE: SelectorPills
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Renderizar un selector interactivo horizontal con diseño tipo pills.
 *
 * @dependencies - Text.jsx, Button.jsx (shared/components), mantEquipoStyles.js (styles)
 * @validations  - Ninguna
 * @navigation   - Ninguna
 */

import React from "react";
import { View } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";

export default function SelectorPills({ value, onChange, label, opciones }) {
  const listaOpciones = Array.isArray(opciones) ? opciones : [];
  return (
    <View style={styles.comboContainer}>
      <CustomText style={styles.comboLabel}>{label}</CustomText>
      <View style={styles.pillsRow}>
        {listaOpciones.map((op) => {
          const isActive = value === op.value;
          return (
            <Button
              key={op.value}
              variant="outline"
              onPress={() => onChange(op.value)}
              style={[
                styles.pillButton,
                isActive && styles.pillButtonActive,
              ]}
              textStyle={{ fontSize: 11, color: COLORS.primary, fontWeight: isActive ? "700" : "600" }}
            >
              {op.label}
            </Button>
          );
        })}
      </View>
    </View>
  );
}
