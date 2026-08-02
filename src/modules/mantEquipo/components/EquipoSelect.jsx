/**
 * ============================================================
 * COMPONENTE: EquipoSelect
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado con controles interactivos de UI.
 * - Renderizar un selector desplegable con espacio reservado para seleccionar equipos sin alterar el layout.
 *
 * @dependencies - EquipoSelectStyles.js (styles)
 * @validations  - Deshabilita interacciones si la prop disabled es true.
 * @navigation   - Ninguna
 */

import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/EquipoSelectStyles.js";

function getSelectedLabel(options, value, placeholder) {
  const selectedOption = options.find((option) => option.value === value);

  return selectedOption ? selectedOption.label : placeholder;
}

export default function EquipoSelect({
  label = "",
  value = "",
  options = [],
  onChange,
  placeholder = "Seleccione una opcion",
  disabled = false,
  containerStyle,
  selectStyle,
  labelStyle,
}) {
  const [open, setOpen] = useState(false);
  const dropdownHeight = 180;

  const selectedLabel = useMemo(
    () => getSelectedLabel(options, value, placeholder),
    [options, value, placeholder]
  );

  function handleToggle() {
    if (!disabled) {
      setOpen((actual) => !actual);
    }
  }

  function handleSelect(optionValue) {
    if (onChange) {
      onChange(optionValue);
    }

    setOpen(false);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label !== "" && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <Pressable
        style={[
          styles.select,
          disabled && styles.disabledSelect,
          selectStyle,
        ]}
        onPress={handleToggle}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Text style={styles.selectedText}>{selectedLabel}</Text>
        <Text style={styles.arrow}>▾</Text>
      </Pressable>

      <View style={[styles.dropdownShell, { height: dropdownHeight }]}>
        {open && (
          <View style={styles.optionsContainer}>
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={styles.option}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}