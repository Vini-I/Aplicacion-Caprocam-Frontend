/**
 * ============================================================
 * COMPONENTE DATEINPUT
 * ============================================================
 *
 * Campo reutilizable para seleccionar fechas en React Native.
 *
 * Funcionalidad:
 * - Muestra la fecha actual por defecto.
 * - Abre un calendario al presionar el campo.
 * - Permite seleccionar fechas anteriores.
 * - Por defecto no permite seleccionar fechas futuras.
 * - Devuelve la fecha en formato dd/mm/aaaa.
 *
 * Props principales:
 * - label: texto opcional mostrado arriba del campo.
 * - value: fecha recibida desde el formulario.
 * - onChangeText: funcion que recibe la fecha en formato dd/mm/aaaa.
 * - placeholder: texto cuando no hay fecha.
 * - disabled: bloquea el campo.
 * - allowFutureDates: permite seleccionar fechas futuras si se envia true.
 * - containerStyle: estilos extra para el contenedor.
 * - inputStyle: estilos extra para el campo.
 * - labelStyle: estilos extra para el label.
 *
 * Ejemplo:
 * <DateInput
 *     label="Fecha"
 *     value={fecha}
 *     onChangeText={setFecha}
 * />
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { COLORS } from "../../theme/colors";

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getCurrentDate() {
  const today = new Date();

  return formatDate(today);
}

function convertTextToDate(textDate) {
  const parts = textDate.split("/");

  if (parts.length !== 3) {
    return new Date();
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);

  const date = new Date(year, month, day);

  if (Number.isNaN(date.getTime())) {
    return new Date();
  }

  return date;
}

export default function DateInput({
  label = "",
  value = "",
  onChangeText,
  placeholder = "Seleccione una fecha",
  disabled = false,
  allowFutureDates = false,
  containerStyle,
  inputStyle,
  labelStyle,
  textStyle,
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  let initialDate = new Date();

  if (value !== "") {
    initialDate = convertTextToDate(value);
  }

  const [selectedDate, setSelectedDate] = useState(initialDate);

  let displayedValue = getCurrentDate();

  if (value !== "") {
    displayedValue = value;
  }

  function openCalendar() {
    if (disabled === false) {
      setShowCalendar(true);
    }
  }

  function handleChange(event, date) {
    if (Platform.OS === "android") {
      setShowCalendar(false);
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

  if (inputStyle) {
    inputStyles.push(inputStyle);
  }

  let maximumDate = new Date();

  if (allowFutureDates === true) {
    maximumDate = undefined;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label !== "" && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <Pressable
        style={inputStyles}
        onPress={openCalendar}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Text style={[styles.inputText, textStyle]}>
          {displayedValue || placeholder}
        </Text>
      </Pressable>

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
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  disabledInput: {
    backgroundColor: COLORS.secondary,
    opacity: 0.7,
  },
});
