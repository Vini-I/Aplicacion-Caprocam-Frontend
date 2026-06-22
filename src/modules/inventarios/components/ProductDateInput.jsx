/**
 * ============================================================
 * COMPONENTE: PRODUCTDATEINPUT
 * ============================================================
 * Módulo: Inventarios
 *
 * Este componente permite seleccionar una fecha mediante un
 * calendario personalizado en español.
 *
 * Se creó específicamente para el formulario de productos porque:
 * - El calendario nativo del navegador puede aparecer en inglés.
 * - Los usuarios finales pueden tener poco o ningún conocimiento de inglés.
 * - Se necesita una interfaz clara, sencilla y en español.
 *
 * FUNCIONALIDADES:
 * 1. Muestra un campo con la fecha seleccionada.
 * 2. Al tocar el campo, despliega un calendario.
 * 3. Muestra los meses en español.
 * 4. Permite navegar entre meses anteriores y siguientes.
 * 5. Permite seleccionar un día del calendario.
 * 6. Devuelve la fecha en formato dd/mm/aaaa.
 * 7. Puede bloquear fechas futuras si allowFutureDates es false.
 *
 * PROPS:
 * - label: texto que aparece encima del campo.
 * - value: fecha seleccionada actualmente.
 * - onChangeText: función que recibe la fecha seleccionada.
 * - allowFutureDates: permite o bloquea fechas futuras.
 * - containerStyle: estilos extra para el contenedor.
 * - labelStyle: estilos extra para la etiqueta.
 *
 * EJEMPLO DE USO:
 *
 * <ProductDateInput
 *   label="Fecha de ingreso"
 *   value={form.entryDate}
 *   onChangeText={(val) => handleField("entryDate", val)}
 * />
 *
 * ============================================================
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";

/**
 * Lista de meses en español.
 *
 * Se usa para mostrar el encabezado del calendario.
 */
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Días de la semana.
 *
 * Se usan abreviaturas claras para evitar confusión entre
 * martes y miércoles.
 */
const WEEK_DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

/**
 * Convierte una fecha de JavaScript a formato dd/mm/aaaa.
 *
 * Ejemplo:
 * new Date(2026, 5, 13) -> "13/06/2026"
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Convierte un texto con formato dd/mm/aaaa a un objeto Date.
 *
 * Si el valor viene vacío o inválido, devuelve la fecha actual.
 */
function textToDate(value) {
  if (!value) return new Date();

  const parts = value.split("/");

  if (parts.length !== 3) return new Date();

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);

  return new Date(year, month, day);
}

/**
 * Obtiene la cantidad de días que tiene un mes.
 *
 * month usa el formato de JavaScript:
 * enero = 0
 * febrero = 1
 * marzo = 2
 */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Obtiene en qué día de la semana inicia el mes.
 *
 * JavaScript usa:
 * domingo = 0
 * lunes = 1
 *
 * Aquí se ajusta para que el calendario empiece en lunes:
 * lunes = 0
 * martes = 1
 * miércoles = 2
 */
function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();

  return day === 0 ? 6 : day - 1;
}

export default function ProductDateInput({
  label = "",
  value = "",
  onChangeText,
  allowFutureDates = false,
  containerStyle,
  labelStyle,
}) {
  /**
   * Fecha base del calendario.
   *
   * Si ya existe una fecha seleccionada, el calendario abre en ese mes.
   * Si no existe, abre en el mes actual.
   */
  const initialDate = textToDate(value);

  /**
   * showCalendar:
   * Controla si el calendario se muestra o se oculta.
   */
  const [showCalendar, setShowCalendar] = useState(false);

  /**
   * currentMonth y currentYear:
   * Controlan el mes y año que se están mostrando.
   */
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  /**
   * today:
   * Se usa para validar fechas futuras.
   */
  const today = new Date();

  /**
   * selectedDate:
   * Guarda la fecha seleccionada actualmente.
   */
  const selectedDate = value ? textToDate(value) : null;

  /**
   * daysInMonth:
   * Cantidad de días del mes actual.
   *
   * firstDay:
   * Posición donde debe iniciar el día 1 del mes.
   */
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  /**
   * Abre o cierra el calendario.
   */
  function openCalendar() {
    setShowCalendar(!showCalendar);
  }

  /**
   * Cambia al mes anterior.
   *
   * Si está en enero, pasa a diciembre del año anterior.
   */
  function previousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  /**
   * Cambia al mes siguiente.
   *
   * Si está en diciembre, pasa a enero del año siguiente.
   */
  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  /**
   * Selecciona un día del calendario.
   *
   * Si allowFutureDates es false, no permite seleccionar
   * fechas posteriores a hoy.
   */
  function selectDay(day) {
    const newDate = new Date(currentYear, currentMonth, day);

    if (!allowFutureDates && newDate > today) {
      return;
    }

    if (onChangeText) {
      onChangeText(formatDate(newDate));
    }

    setShowCalendar(false);
  }

  /**
   * Verifica si un día es el día seleccionado.
   *
   * Esto permite pintarlo con otro color.
   */
  function isSelectedDay(day) {
    if (!selectedDate) return false;

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  }

  /**
   * Verifica si un día es una fecha futura.
   *
   * Sirve para deshabilitar fechas futuras cuando
   * allowFutureDates es false.
   */
  function isFutureDay(day) {
    const date = new Date(currentYear, currentMonth, day);

    return !allowFutureDates && date > today;
  }

  /**
   * emptyDays:
   * Espacios vacíos antes del día 1 del mes.
   *
   * monthDays:
   * Lista de días reales del mes.
   */
  const emptyDays = Array.from({ length: firstDay });
  const monthDays = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label !== "" && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}

      <Pressable style={styles.input} onPress={openCalendar}>
        <Text style={value ? styles.inputText : styles.placeholderText}>
          {value || "Seleccione una fecha"}
        </Text>
      </Pressable>

      {showCalendar && (
        <View style={styles.calendar}>
          <View style={styles.calendarHeader}>
            <Pressable onPress={previousMonth} style={styles.arrowButton}>
              <Text style={styles.arrowText}>‹</Text>
            </Pressable>

            <Text style={styles.monthText}>
              {MONTHS[currentMonth]} {currentYear}
            </Text>

            <Pressable onPress={nextMonth} style={styles.arrowButton}>
              <Text style={styles.arrowText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEK_DAYS.map((day, index) => (
              <Text key={index} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {emptyDays.map((_, index) => (
              <View key={`empty-${index}`} style={styles.dayBox} />
            ))}

            {monthDays.map((day) => {
              const selected = isSelectedDay(day);
              const future = isFutureDay(day);

              return (
                <Pressable
                  key={day}
                  onPress={() => selectDay(day)}
                  disabled={future}
                  style={[
                    styles.dayBox,
                    selected && styles.selectedDay,
                    future && styles.disabledDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected && styles.selectedDayText,
                      future && styles.disabledDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

/**
 * Estilos visuales del calendario.
 *
 * Se mantienen en este mismo archivo porque el componente es pequeño
 * y así es más fácil de mantener dentro del módulo de inventarios.
 */
const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 6,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  inputText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  placeholderText: {
    fontSize: 15,
    color: COLORS.textTertiary,
  },

  calendar: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    padding: 12,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },

  arrowText: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },

  monthText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  weekDay: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textTertiary,
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayBox: {
    width: `${100 / 7}%`,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 2,
  },

  dayText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  selectedDay: {
    backgroundColor: COLORS.primary,
  },

  selectedDayText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  disabledDay: {
    opacity: 0.3,
  },

  disabledDayText: {
    color: COLORS.textTertiary,
  },
});