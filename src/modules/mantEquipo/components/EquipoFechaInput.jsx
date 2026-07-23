/**
 * ============================================================
 * COMPONENTE: EquipoFechaInput
 * ============================================================
 *
 * Adaptador local para la fecha de instalación.
 * En móvil usa DateInput nativo y en web un Input editable,
 * manteniendo el mismo contrato de onChangeText.
 * Ruta: src/modules/mantEquipo/components/EquipoFechaInput.jsx
 */

import React from "react";
// Watcher trigger
import { Platform } from "react-native";

import DateInput from "../../../shared/components/DateInput.jsx";
import Input from "../../../shared/components/Input.jsx";

export default function EquipoFechaInput({
  label = "",
  value = "",
  onChangeText,
  placeholder = "Seleccione la fecha de instalacaaión",
  inputStyle,
  labelStyle,
}) {
  if (Platform.OS === "web") {
    return (
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder="dd/mm/aaaa"
        inputMode="numeric"
        maxLength={10}
        containerStyle={{ width: "100%" }}
        style={inputStyle}
        labelStyle={labelStyle}
      />
    );
  }

  return (
    <DateInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      inputStyle={inputStyle}
      labelStyle={labelStyle}
    />
  );
}