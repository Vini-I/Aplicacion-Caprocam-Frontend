/**
 * ============================================================
 * COMPONENTE DATEINPUT
 * ============================================================
 *
 * Campo reutilizable para seleccionar fechas.
 *
 * Responsabilidad:
 * - Despliega un calendario al presionar el campo.
 * - Usa el formato oficial dd/mm/aaaa.
 * - Muestra icono de calendario desde theme/icons.js.
 * - Usa el componente Icon compartido del proyecto.
 * - Soporta required, submitted, error y helperText.
 * - Muestra borde rojo cuando el campo requerido esta vacio despues de intentar guardar.
 *
 * Uso recomendado:
 *
 * <DateInput
 *   label="Fecha de siembra"
 *   required={true}
 *   submitted={submitted}
 *   value={fechaSiembra}
 *   onChangeText={setFechaSiembra}
 * />
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Icon from "./Icons";

import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";
import { ICONS } from "../../theme/icons";

import { formatDate, getCurrentDate, parseDate } from "../utils/dateUtils";

export default function DateInput({
  label = "",
  value = "",
  onChangeText,
  placeholder = "Seleccione una fecha",
  disabled = false,
  allowFutureDates = false,
  required = false,
  submitted = false,
  error = "",
  helperText = "",
  containerStyle,
  inputStyle,
  labelStyle,
  textStyle,
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  let initialDate = new Date();

  if (value !== "") {
    initialDate = parseDate(value);
  }

  const [selectedDate, setSelectedDate] = useState(initialDate);

  let displayedValue = getCurrentDate();

  if (value !== "") {
    displayedValue = value;
  }

  let showError = false;
  let finalHelperText = helperText;

  if (error !== "") {
    showError = true;
    finalHelperText = error;
  }

  if (submitted === true && required === true && String(value).trim() === "") {
    showError = true;
    finalHelperText = "Este campo es obligatorio.";
  }

  function openCalendar() {
    if (disabled === false) {
      setShowCalendar(true);
    }
  }

  function closeCalendar() {
    setShowCalendar(false);
  }

  function handleChange(event, date) {
    if (Platform.OS === "android") {
      closeCalendar();
    }

    if (date) {
      setSelectedDate(date);

      const formattedDate = formatDate(date);

      if (onChangeText) {
        onChangeText(formattedDate);
      }
    }
  }

  const inputStyles = [styles.input];

  if (disabled === true) {
    inputStyles.push(styles.disabledInput);
  }

  if (showError === true) {
    inputStyles.push(styles.inputError);
  }

  if (inputStyle) {
    inputStyles.push(inputStyle);
  }

  let maximumDate = new Date();

  if (allowFutureDates === true) {
    maximumDate = undefined;
  }

  let textColor = COLORS.textSecondary;

  if (displayedValue === "" && placeholder !== "") {
    textColor = COLORS.textQuaternary;
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
        style={inputStyles}
        onPress={openCalendar}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.inputText,
            {
              color: textColor,
            },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {displayedValue || placeholder}
        </Text>

        <View style={styles.iconBox}>
          <Icon icon={ICONS.calendar} size={22} color={COLORS.primary} />
        </View>
      </Pressable>

      {finalHelperText !== "" && (
        <Text
          style={[styles.helperText, showError === true && styles.errorText]}
        >
          {finalHelperText}
        </Text>
      )}

      {showCalendar === true && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}
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

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
  },

  inputError: {
    borderColor: COLORS.error,
  },

  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  disabledInput: {
    backgroundColor: COLORS.surface,
    opacity: 0.7,
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
});
