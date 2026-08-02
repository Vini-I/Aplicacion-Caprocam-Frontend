/**
 * ============================================================
 * COMPONENTE: EquipoFechaInput
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Descripción:
 * Adaptador local para la fecha de instalación del equipo.
 * Delega completamente al componente compartido DateInput, que
 * ya maneja web (input type="date") y móvil (DateTimePicker)
 * de forma interna, sin necesidad de bifurcación por Platform.
 *
 * @dependencies - DateInput (shared/components/DateInput)
 * @validations  - Ninguna propia; el componente DateInput
 *                 gestiona el estado de error vía props `error`,
 *                 `required` y `submitted`.
 * @navigation   - No navega a ninguna pantalla.
 * ============================================================
 */

import React from 'react';
import DateInput from '../../../shared/components/DateInput.jsx';

export default function EquipoFechaInput({
  label = '',
  value = '',
  onChangeText,
  placeholder = 'Seleccione la fecha de instalación',
  disabled = false,
  required = false,
  submitted = false,
  error = '',
  inputStyle,
  labelStyle,
}) {
  return (
    <DateInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      submitted={submitted}
      error={error}
      inputStyle={inputStyle}
      labelStyle={labelStyle}
    />
  );
}