/**
 * ============================================================
 * COMPONENTE DATEINPUT
 * ============================================================
 *
 * Campo reutilizable para seleccionar fechas.
 *
 * Funcionalidad:
 * - Al tocar el input se despliega el calendario.
 * - Al tocar el icono se despliega el calendario.
 * - En web usa input type="date".
 * - En Android/iOS usa DateTimePicker.
 * - Permite seleccionar fechas futuras por defecto.
 * - Mantiene formato visible dd/mm/aaaa.
 */

import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Icon from "./Icons";

import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";
import { ICONS } from "../../theme/icons";

import { formatDate, getCurrentDate, parseDate } from "../utils/dateUtils";

function obtenerFechaWeb(value) {
  const fecha = parseDate(value);
  let fechaFinal = fecha;

  if (fechaFinal === null || fechaFinal === undefined) {
    fechaFinal = new Date();
  }

  if (Number.isNaN(fechaFinal.getTime()) === true) {
    fechaFinal = new Date();
  }

  const year = fechaFinal.getFullYear();
  const month = String(fechaFinal.getMonth() + 1).padStart(2, "0");
  const day = String(fechaFinal.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function convertirFechaWeb(value) {
  const partes = value.split("-");
  let fecha = new Date();

  if (partes.length === 3) {
    const year = Number(partes[0]);
    const month = Number(partes[1]) - 1;
    const day = Number(partes[2]);

    fecha = new Date(year, month, day);
  }

  return fecha;
}

function obtenerFechaSegura(value) {
  let fecha = new Date();

  if (value !== "" && value !== undefined && value !== null) {
    fecha = parseDate(value);
  }

  if (fecha === null || fecha === undefined) {
    fecha = new Date();
  }

  if (Number.isNaN(fecha.getTime()) === true) {
    fecha = new Date();
  }

  return fecha;
}

export default function DateInput({
  label = "",
  value = "",
  onChangeText,
  placeholder = "Seleccione una fecha",
  disabled = false,
  allowFutureDates = true,
  required = false,
  submitted = false,
  error = "",
  helperText = "",
  containerStyle,
  inputStyle,
  labelStyle,
  textStyle,
}) {
  const webInputRef = useRef(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(obtenerFechaSegura(value));

  useEffect(
    function () {
      setSelectedDate(obtenerFechaSegura(value));
    },
    [value],
  );

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

  function abrirCalendarioWeb() {
    if (webInputRef.current) {
      webInputRef.current.focus();

      try {
        if (webInputRef.current.showPicker) {
          webInputRef.current.showPicker();
        }
      } catch (errorPicker) {
        console.log("No se pudo abrir showPicker:", errorPicker);
      }
    }
  }

  function openCalendar() {
    if (disabled === true) {
      return;
    }

    if (Platform.OS === "web") {
      abrirCalendarioWeb();
      return;
    }

    setShowCalendar(true);
  }

  function closeCalendar() {
    setShowCalendar(false);
  }

  function handleNativeChange(event, date) {
    if (event && event.type === "dismissed") {
      closeCalendar();
      return;
    }

    if (Platform.OS === "android") {
      closeCalendar();
    }

    if (date) {
      setSelectedDate(date);

      if (onChangeText) {
        onChangeText(formatDate(date));
      }
    }
  }

  function handleWebChange(event) {
    const valueWeb = event.target.value;

    if (valueWeb !== "") {
      const fecha = convertirFechaWeb(valueWeb);

      setSelectedDate(fecha);

      if (onChangeText) {
        onChangeText(formatDate(fecha));
      }
    }
  }

  function handleWebClick(event) {
    event.currentTarget.focus();

    try {
      if (event.currentTarget.showPicker) {
        event.currentTarget.showPicker();
      }
    } catch (errorPicker) {
      console.log("No se pudo abrir el calendario:", errorPicker);
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

  let maximumDate = undefined;
  let webMaxDate = undefined;

  if (allowFutureDates === false) {
    maximumDate = new Date();
    webMaxDate = obtenerFechaWeb(getCurrentDate());
  }

  const webInputStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.01,
    cursor: "pointer",
    zIndex: 999,
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    color: "transparent",
  };

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
        <Text style={[styles.inputText, textStyle]} numberOfLines={1}>
          {displayedValue || placeholder}
        </Text>

        <View style={styles.iconBox}>
          <Icon icon={ICONS.calendar} size={22} color={COLORS.primary} />
        </View>

        {Platform.OS === "web" && (
          <input
            ref={webInputRef}
            type="date"
            value={obtenerFechaWeb(displayedValue)}
            max={webMaxDate}
            disabled={disabled}
            onChange={handleWebChange}
            onClick={handleWebClick}
            style={webInputStyle}
          />
        )}
      </Pressable>

      {finalHelperText !== "" && (
        <Text
          style={[styles.helperText, showError === true && styles.errorText]}
        >
          {finalHelperText}
        </Text>
      )}

      {showCalendar === true && Platform.OS !== "web" && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          onChange={handleNativeChange}
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
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  inputError: {
    borderColor: COLORS.error,
  },

  inputText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textSecondary,
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
