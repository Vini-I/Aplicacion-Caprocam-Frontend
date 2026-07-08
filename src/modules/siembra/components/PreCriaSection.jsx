/**
 * ============================================================
 * COMPONENTE: SECCIÓN DE DETALLE DE PRE-CRÍA (MÓDULO SIEMBRA)
 * ============================================================
 *
 * Renderiza los campos adicionales de pre-cría cuando una siembra
 * ha pasado por esta etapa previa.
 *
 * FUNCIONALIDAD:
 * - Se integra dinámicamente en el formulario principal de siembra.
 * - Sigue estrictamente la gestión de estados de error de Caprocam.
 */
import React from "react";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import DateInput from "../../../shared/components/DateInput";
import Select from "../../../shared/components/Select";

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/SiembraSectionStyles";
import SectionTitle from "./SectionTitle";

export default function PreCriaSection({
  formData,
  onChange,
  mode = "edit",
  fieldHelpers,
  isAutonomous = false,
  plOptions = [],
}) {
  const isViewMode = mode === "view";
  const { hasError, requiredLabel } = fieldHelpers;

  return (
    <Card>
      <SectionTitle
        icon={ICONS.calendar}
        title={
          isAutonomous ? "Datos de Clico Pre-Cría" : "Información de Pre-Cría"
        }
      />
      {isAutonomous ? (
        <>
          <DateInput
            label={requiredLabel("Fecha de inicio a Pre-Cría")}
            value={formData.fechaInicio}
            onChangeText={(value) => onChange("fechaIngresoPrecria", value)}
            labelStyle={styles.requiredLabel}
            inputStyle={
              hasError("fechaIngresoPrecria") ? styles.inputError : null
            }
            disabled={isViewMode}
          />
          <DateInput
            label={requiredLabel("Fecha de salida de Pre-Cría")}
            value={formData.fechaFin}
            onChangeText={(value) => onChange("fechaSalidaPrecria", value)}
            labelStyle={styles.requiredLabel}
            inputStyle={
              hasError("fechaSalidaPrecria") ? styles.inputError : null
            }
            disabled={isViewMode}
          />

          <NumberInput
            label={requiredLabel("Duración en Pre-Cría (Días)")}
            value={formData.duracionDias}
            onChangeText={(value) => onChange("duracionPrecria", value)}
            min={1}
            max={45}
            step={1}
            labelStyle={styles.requiredLabel}
            style={hasError("duracionPrecria") ? styles.inputError : null}
            editable={!isViewMode}
          />

          <Input
            label={requiredLabel("Cantidad de inicial ingresada a Pre-Cría")}
            placeholder="Ej: 500000"
            keyboardType="numeric"
            value={formData.cantidadInicialPrecria}
            onChangeText={(value) => onChange("cantidadInicialPrecria", value)}
            labelStyle={styles.requiredLabel}
            style={
              hasError("cantidadInicialPrecria") ? styles.inputError : null
            }
          />
          <Input
            label={requiredLabel("Cantidad sobreviviente de Pre-Cría")}
            placeholder="Ej: 450000"
            keyboardType="numeric"
            value={formData.cantidadSobrevivientePrecria}
            onChangeText={(value) =>
              onChange("cantidadSobrevivientePrecria", value)
            }
            labelStyle={styles.requiredLabel}
            style={
              hasError("cantidadSobrevivientePrecria")
                ? styles.inputError
                : null
            }
            editable={!isViewMode}
          />

          <Select
            label={requiredLabel("PL Inicial de Pre-Cría")}
            placeholder="Seleccionar PL"
            options={plOptions}
            value={formData.plInicialPrecria}
            onChange={(value) => onChange("plInicialPrecria", value)}
            labelStyle={styles.requiredLabel}
            selectStyle={
              hasError("plInicialPrecria") ? styles.inputError : null
            }
            disabled={isViewMode}
          />

          <Select
            label={requiredLabel("PL Final de Pre-Cría")}
            placeholder="Seleccionar PL"
            options={plOptions}
            value={formData.plFinalPrecria}
            onChange={(value) => onChange("plFinalPrecria", value)}
            labelStyle={styles.requiredLabel}
            selectStyle={hasError("plFinalPrecria") ? styles.inputError : null}
            disabled={isViewMode}
          />
        </>
      ) : (
        <>
          <NumberInput
            label={requiredLabel("Duración en Pre-Cría (Días)")}
            value={formData.duracionPrecria}
            onChangeText={(value) => onChange("duracionPrecria", value)}
            min={1}
            max={45}
            step={1}
            labelStyle={styles.requiredLabel}
            style={hasError("duracionPrecria") ? styles.inputError : null}
            editable={!isViewMode}
          />

          <DateInput
            label={requiredLabel("Fecha de salida de Pre-Cría")}
            value={formData.fechaSalidaPrecria}
            onChangeText={(value) => onChange("fechaSalidaPrecria", value)}
            labelStyle={styles.requiredLabel}
            inputStyle={
              hasError("fechaSalidaPrecria") ? styles.inputError : null
            }
            disabled={isViewMode}
          />

          <Input
            label={requiredLabel("Cantidad sobreviviente de Pre-Cría")}
            placeholder="Ej: 450000"
            keyboardType="numeric"
            value={formData.cantidadSobrevivientePrecria}
            onChangeText={(value) =>
              onChange("cantidadSobrevivientePrecria", value)
            }
            labelStyle={styles.requiredLabel}
            style={
              hasError("cantidadSobrevivientePrecria")
                ? styles.inputError
                : null
            }
            editable={!isViewMode}
          />
        </>
      )}
    </Card>
  );
}
