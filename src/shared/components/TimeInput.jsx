/**
 * ============================================================
 * COMPONENTE TIMEINPUT
 * ============================================================
 *
 * Campo reutilizable para seleccionar hora en formato 12 horas (AM/PM).
 *
 * Funcionalidad:
 * - Al tocar el input o icono se despliega el selector de hora.
 * - En web despliega un modal interactivo 12h (Horas, Minutos, AM/PM).
 * - En Android/iOS usa DateTimePicker mode="time" (is24Hour=false).
 * - Mantiene formato visible hh:mm AM/PM.
 */

import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Icon from "./Icons";
import Button from "./Button";
import Modal from "./Modal";
import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";
import { ICONS } from "../../theme/icons";

import { formatTime12, getCurrentTime12, toMysqlTime } from "../utils/dateUtils";

function parsear12h(val12) {
  const match = String(val12 || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/i);
  if (match) {
    const h = String(Number(match[1])).padStart(2, "0");
    const m = match[2];
    const ampm = (match[3] || "AM").toUpperCase();
    return { h, m, ampm };
  }
  const ahora = getCurrentTime12();
  const matchAhora = ahora.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (matchAhora) {
    return {
      h: String(Number(matchAhora[1])).padStart(2, "0"),
      m: matchAhora[2],
      ampm: matchAhora[3] || "AM",
    };
  }
  return { h: "12", m: "00", ampm: "AM" };
}

function obtenerDateDesdeHora(value) {
  const date = new Date();
  if (!value || typeof value !== "string") return date;
  const time24 = toMysqlTime(value);
  if (time24) {
    const partes = time24.split(":");
    if (partes.length >= 2) {
      const h = Number(partes[0]);
      const m = Number(partes[1]);
      if (!isNaN(h) && !isNaN(m)) {
        date.setHours(h, m, 0, 0);
        return date;
      }
    }
  }
  return date;
}

function dateA12h(dateObj) {
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return getCurrentTime12();
  }
  let horas = dateObj.getHours();
  const minutos = String(dateObj.getMinutes()).padStart(2, "0");
  const ampm = horas >= 12 ? "PM" : "AM";
  horas = horas % 12;
  if (horas === 0) horas = 12;
  const horasStr = String(horas).padStart(2, "0");
  return `${horasStr}:${minutos} ${ampm}`;
}

export default function TimeInput({
  label = "",
  value = "",
  onChangeText,
  placeholder = "12:00 AM",
  disabled = false,
  required = false,
  submitted = false,
  error = "",
  containerStyle,
  inputStyle,
  labelStyle,
  textStyle,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [showWebModal, setShowWebModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => obtenerDateDesdeHora(value));

  const [webH, setWebH] = useState("12");
  const [webM, setWebM] = useState("00");
  const [webAmpm, setWebAmpm] = useState("AM");

  useEffect(() => {
    setSelectedDate(obtenerDateDesdeHora(value));
  }, [value]);

  let displayedValue = value ? (value.includes("AM") || value.includes("PM") ? value : formatTime12(value)) : getCurrentTime12();

  let showError = false;
  if (error !== "") showError = true;
  if (submitted === true && required === true && String(value).trim() === "") showError = true;

  function openPicker() {
    if (disabled === true) return;

    if (Platform.OS === "web") {
      const parsed = parsear12h(displayedValue);
      setWebH(parsed.h);
      setWebM(parsed.m);
      setWebAmpm(parsed.ampm);
      setShowWebModal(true);
      return;
    }

    setShowPicker(true);
  }

  function handleNativeChange(event, date) {
    if (event && event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (date) {
      setSelectedDate(date);
      const val12 = dateA12h(date);
      if (onChangeText) {
        onChangeText(val12);
      }
    }
  }

  function confirmWebTime() {
    const val12 = `${webH}:${webM} ${webAmpm}`;
    const dateObj = obtenerDateDesdeHora(val12);
    setSelectedDate(dateObj);
    if (onChangeText) {
      onChangeText(val12);
    }
    setShowWebModal(false);
  }

  const inputStyles = [styles.input];
  if (disabled === true) inputStyles.push(styles.disabledInput);
  if (showError === true) inputStyles.push(styles.inputError);
  if (inputStyle) inputStyles.push(inputStyle);

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
        onPress={openPicker}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Text style={[styles.inputText, textStyle]} numberOfLines={1}>
          {displayedValue || placeholder}
        </Text>

        <View style={styles.iconBox}>
          <Icon icon={ICONS.clock} size={16} color={COLORS.primary} />
        </View>
      </Pressable>

      {showPicker === true && Platform.OS !== "web" && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleNativeChange}
        />
      )}

      {showWebModal === true && Platform.OS === "web" && (
        <Modal
          visible={showWebModal}
          onClose={() => setShowWebModal(false)}
          showCloseButton={false}
          containerStyle={styles.webModalContainer}
        >
          <Text style={styles.webTitle}>Seleccionar hora</Text>

          <View style={styles.webRow}>
            <View style={styles.webCol}>
              <Text style={styles.webLabel}>Hora</Text>
              <select
                value={webH}
                onChange={(e) => setWebH(e.target.value)}
                style={webSelectStyle}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const v = String(i + 1).padStart(2, "0");
                  return <option key={v} value={v}>{v}</option>;
                })}
              </select>
            </View>

            <Text style={styles.webColon}>:</Text>

            <View style={styles.webCol}>
              <Text style={styles.webLabel}>Minutos</Text>
              <select
                value={webM}
                onChange={(e) => setWebM(e.target.value)}
                style={webSelectStyle}
              >
                {Array.from({ length: 60 }, (_, i) => {
                  const v = String(i).padStart(2, "0");
                  return <option key={v} value={v}>{v}</option>;
                })}
              </select>
            </View>

            <View style={styles.webCol}>
              <Text style={styles.webLabel}>Período</Text>
              <View style={styles.ampmWrap}>
                <Pressable
                  style={[styles.ampmBtn, webAmpm === "AM" && styles.ampmBtnActive]}
                  onPress={() => setWebAmpm("AM")}
                >
                  <Text style={[styles.ampmBtnText, webAmpm === "AM" && styles.ampmBtnTextActive]}>AM</Text>
                </Pressable>
                <Pressable
                  style={[styles.ampmBtn, webAmpm === "PM" && styles.ampmBtnActive]}
                  onPress={() => setWebAmpm("PM")}
                >
                  <Text style={[styles.ampmBtnText, webAmpm === "PM" && styles.ampmBtnTextActive]}>PM</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.webFooter}>
            <Button variant="ghost" onPress={() => setShowWebModal(false)} style={styles.cancelBtn}>
              Cancelar
            </Button>
            <Button variant="primary" onPress={confirmWebTime} style={styles.confirmBtn}>
              Aceptar
            </Button>
          </View>
        </Modal>
      )}
    </View>
  );
}

const webSelectStyle = {
  fontSize: 14,
  height: 36,
  paddingLeft: 10,
  paddingRight: 6,
  borderRadius: 8,
  border: `1px solid ${COLORS.secondary}`,
  backgroundColor: COLORS.white,
  color: COLORS.textPrimary,
  outline: "none",
  cursor: "pointer",
  boxSizing: "border-box",
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },

  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  requiredMark: {
    color: COLORS.black,
  },

  input: {
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "flex-start",
  },

  inputError: {
    borderColor: COLORS.error,
  },

  inputText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },

  disabledInput: {
    backgroundColor: COLORS.surface,
    opacity: 0.7,
  },

  webModalContainer: {
    maxWidth: 340,
    width: "90%",
    borderRadius: 16,
    padding: 20,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  webTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },

  webRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },

  webCol: {
    alignItems: "center",
  },

  webLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  webColon: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    paddingBottom: 6,
  },

  ampmWrap: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    overflow: "hidden",
    height: 36,
    boxSizing: "border-box",
  },

  ampmBtn: {
    height: 34,
    paddingHorizontal: 11,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  ampmBtnActive: {
    backgroundColor: COLORS.primary,
  },

  ampmBtnText: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
  },

  ampmBtnTextActive: {
    color: COLORS.white,
  },

  webFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },

  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },

  confirmBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});
