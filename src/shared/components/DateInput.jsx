/**
 * ============================================================
 * COMPONENTE DATEINPUT
 * ============================================================
 *
 * Responsabilidad:
 * - Campo reutilizable para seleccionar fechas.
 * - Toma la fecha de hoy por defecto desde dateUtils.
 * - Abre un calendario al presionar el campo o el icono.
 * - Usa formato oficial dd/mm/aaaa.
 * - Soporta required, submitted, error y helperText.
 *
 * Reglas:
 * - No usa regex local por modulo.
 * - El borde rojo aparece solo despues de intentar guardar o por error manual.
 */

import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import Icon from "./Icons";

import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";
import { ICONS } from "../../theme/icons";

import { formatDate, getCurrentDate, parseDate } from "../utils/dateUtils";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

function getSafeDate(value) {
  const parsed = parseDate(value);

  if (parsed !== null) {
    return parsed;
  }

  return new Date();
}

function getMonthDays(calendarDate) {
  const safeDate = getSafeDate(calendarDate);
  const year = safeDate.getFullYear();
  const month = safeDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const days = [];

  for (let index = 0; index < firstDate.getDay(); index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDate.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function isSameCalendarDay(firstDate, secondDate) {
  if (firstDate === null || secondDate === null) {
    return false;
  }

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function isFutureDate(date) {
  const today = new Date();
  const cleanToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const cleanDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return cleanDate.getTime() > cleanToday.getTime();
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
  let displayedValue = value;

  if (displayedValue === "") {
    displayedValue = getCurrentDate();
  }

  const initialDate = getSafeDate(displayedValue);

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(initialDate);

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
    if (disabled === true) {
      return;
    }

    setCalendarDate(getSafeDate(displayedValue));
    setShowCalendar(true);
  }

  function closeCalendar() {
    setShowCalendar(false);
  }

  function selectDate(date) {
    if (allowFutureDates === false && isFutureDate(date) === true) {
      return;
    }

    if (onChangeText) {
      onChangeText(formatDate(date));
    }

    closeCalendar();
  }

  function goPreviousMonth() {
    setCalendarDate(function (current) {
      const safeCurrent = getSafeDate(current);

      return new Date(safeCurrent.getFullYear(), safeCurrent.getMonth() - 1, 1);
    });
  }

  function goNextMonth() {
    setCalendarDate(function (current) {
      const safeCurrent = getSafeDate(current);

      return new Date(safeCurrent.getFullYear(), safeCurrent.getMonth() + 1, 1);
    });
  }

  function selectToday() {
    selectDate(new Date());
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

  const selectedDate = getSafeDate(displayedValue);
  const safeCalendarDate = getSafeDate(calendarDate);
  const monthDays = getMonthDays(safeCalendarDate);

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
        visible={showCalendar}
        animationType="fade"
        onRequestClose={closeCalendar}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={closeCalendar} />

          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Pressable style={styles.navButton} onPress={goPreviousMonth}>
                <Text style={styles.navButtonText}>‹</Text>
              </Pressable>

              <Text style={styles.monthTitle}>
                {MONTH_NAMES[safeCalendarDate.getMonth()]}{" "}
                {safeCalendarDate.getFullYear()}
              </Text>

              <Pressable style={styles.navButton} onPress={goNextMonth}>
                <Text style={styles.navButtonText}>›</Text>
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {DAY_NAMES.map(function (dayName) {
                return (
                  <Text key={dayName} style={styles.weekDay}>
                    {dayName}
                  </Text>
                );
              })}
            </View>

            <View style={styles.daysGrid}>
              {monthDays.map(function (date, index) {
                if (date === null) {
                  return <View key={"empty-" + index} style={styles.dayCell} />;
                }

                const dayStyles = [styles.dayButton];
                const dayTextStyles = [styles.dayText];
                let disabledDay = false;

                if (isSameCalendarDay(date, selectedDate) === true) {
                  dayStyles.push(styles.daySelected);
                  dayTextStyles.push(styles.daySelectedText);
                }

                if (allowFutureDates === false && isFutureDate(date) === true) {
                  dayStyles.push(styles.dayDisabled);
                  dayTextStyles.push(styles.dayDisabledText);
                  disabledDay = true;
                }

                return (
                  <Pressable
                    key={formatDate(date)}
                    style={styles.dayCell}
                    onPress={function () {
                      selectDate(date);
                    }}
                    disabled={disabledDay}
                  >
                    <View style={dayStyles}>
                      <Text style={dayTextStyles}>{date.getDate()}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.calendarActions}>
              <Pressable style={styles.todayButton} onPress={selectToday}>
                <Text style={styles.todayButtonText}>Hoy</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={closeCalendar}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>
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

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
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

  modalRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },

  calendarCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  navButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
  },

  navButtonText: {
    fontSize: 28,
    lineHeight: 30,
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  monthTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: "14.285%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  dayButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  daySelected: {
    backgroundColor: COLORS.primary,
  },

  dayDisabled: {
    opacity: 0.35,
  },

  dayText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  daySelectedText: {
    color: COLORS.white,
  },

  dayDisabledText: {
    color: COLORS.textQuaternary,
  },

  calendarActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },

  todayButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
  },

  todayButtonText: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  closeButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
  },

  closeButtonText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});
