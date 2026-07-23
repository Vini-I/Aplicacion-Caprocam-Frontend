/**
 * ============================================================
 * COMPONENTE SELECT
 * ============================================================
 *
 * Selector global para formularios y filtros.
 *
 * Responsabilidad:
 * - Usa Modal con ScrollView para no deformar las cards.
 * - Soporta required, submitted, error y helperText.
 * - Muestra borde rojo solo luego del intento de guardado o error manual.
 * - Mantiene maxHeight en 140 para mostrar pocas opciones.
 */

import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

function getSelectedLabel(options, value, placeholder) {
  let selectedLabel = placeholder;

  for (let index = 0; index < options.length; index++) {
    if (String(options[index].value) === String(value)) {
      selectedLabel = options[index].label;
    }
  }

  return selectedLabel;
}

function valueIsEmpty(value) {
  if (value === undefined) {
    return true;
  }

  if (value === null) {
    return true;
  }

  return String(value).trim() === "";
}

export default function Select({
  label = "",
  value = "",
  options = [],
  onChange,
  placeholder = "Seleccione una opcion",
  disabled = false,
  required = false,
  submitted = false,
  error = "",
  helperText = "",
  containerStyle,
  selectStyle,
  labelStyle,
  optionStyle,
  optionTextStyle,
  selectedTextStyle,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const selectRef = useRef(null);

  let showError = false;
  let finalHelperText = helperText;

  if (error !== "") {
    showError = true;
    finalHelperText = error;
  }

  if (submitted === true && required === true && valueIsEmpty(value) === true) {
    showError = true;
    finalHelperText = "Este campo es obligatorio.";
  }

  function openOptions() {
    if (disabled === true) {
      return;
    }

    if (selectRef.current === null) {
      setOpen(true);
      return;
    }

    selectRef.current.measure(function (x, y, width, height, pageX, pageY) {
      setPosition({
        top: pageY + height,
        left: pageX,
        width: width,
      });

      setOpen(true);
    });
  }

  function closeOptions() {
    setOpen(false);
  }

  function handleSelect(optionValue) {
    if (onChange) {
      onChange(optionValue);
    }

    closeOptions();
  }

  const selectStyles = [styles.select];
  const selectedTextStyles = [styles.selectedText];

  if (disabled === true) {
    selectStyles.push(styles.disabledSelect);
  }

  if (showError === true) {
    selectStyles.push(styles.selectError);
  }

  if (valueIsEmpty(value) === true) {
    selectedTextStyles.push(styles.placeholderText);
  }

  if (selectStyle) {
    selectStyles.push(selectStyle);
  }

  if (selectedTextStyle) {
    selectedTextStyles.push(selectedTextStyle);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label !== "" && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required === true && <Text style={styles.requiredMark}> *</Text>}
        </Text>
      )}

      <Pressable
        ref={selectRef}
        style={selectStyles}
        onPress={openOptions}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Text style={selectedTextStyles} numberOfLines={1}>
          {getSelectedLabel(options, value, placeholder)}
        </Text>

        <Text style={styles.arrow}>▾</Text>
      </Pressable>

      {finalHelperText !== "" && (
        <Text
          style={[styles.helperText, showError === true && styles.errorText]}
        >
          {finalHelperText}
        </Text>
      )}

      <Modal
        transparent={true}
        visible={open}
        animationType="none"
        onRequestClose={closeOptions}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackground} onPress={closeOptions} />

          <View
            style={[
              styles.optionsContainer,
              {
                top: position.top,
                left: position.left,
                width: position.width,
              },
            ]}
          >
            <ScrollView
              style={styles.optionsScroll}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {options.map(function (option) {
                const optionStyles = [styles.option];

                if (String(option.value) === String(value)) {
                  optionStyles.push(styles.selectedOption);
                }

                if (optionStyle) {
                  optionStyles.push(optionStyle);
                }

                return (
                  <Pressable
                    key={String(option.value)}
                    style={optionStyles}
                    onPress={function () {
                      handleSelect(option.value);
                    }}
                  >
                    <Text style={[styles.optionText, optionTextStyle]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  requiredMark: {
    color: COLORS.error,
  },

  select: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.inputBorder || COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectError: {
    borderColor: COLORS.error,
  },

  disabledSelect: {
    backgroundColor: COLORS.surface,
    opacity: 0.7,
  },

  selectedText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  placeholderText: {
    color: COLORS.textQuaternary,
  },

  arrow: {
    marginLeft: 8,
    fontSize: 18,
    color: COLORS.textTertiary,
  },

  helperText: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  errorText: {
    color: COLORS.error,
  },

  modalRoot: {
    flex: 1,
  },

  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  optionsContainer: {
    position: "absolute",
    maxHeight: 140,
    borderWidth: 1,
    borderColor: COLORS.inputBorder || COLORS.secondary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },

  optionsScroll: {
    maxHeight: 140,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || COLORS.secondary,
  },

  selectedOption: {
    backgroundColor: COLORS.primaryLight,
  },

  optionText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
