/**
 * ============================================================
 * COMPONENTE: EquipoFechaInput
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Adaptador local para la selección de fecha de instalación del equipo.
 *
 * @dependencies - DateInput.jsx (shared/components)
 * @validations  - Delega la gestión de estado de error vía props error, required y submitted a DateInput.
 * @navigation   - Ninguna
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