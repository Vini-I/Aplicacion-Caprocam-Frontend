/**
 * ============================================================
 * COMPONENTE RALEOFORM
 * ============================================================
 *
 * Formulario de registro de raleo. Agrupa los campos de
 * finca/estanque, parámetros del raleo y método de extracción, y
 * aplica el contrato visual de campos obligatorios: asterisco
 * visible desde el primer render, y borde rojo + mensaje de
 * error solo después de que la screen marque `submitted = true`
 * y el campo resulte inválido.
 *
 * Funcionalidad:
 * - Todos los colores usados vienen de COLORS (COLORS.textPrimary,
 *   COLORS.textTertiary, COLORS.primary, COLORS.white,
 *   COLORS.secondary), sin valores hardcodeados.
 *
 * Props principales:
 * - form: objeto con los valores actuales del formulario.
 * - updateField: función (campo, valor) para actualizar el form.
 * - submitted: boolean, true cuando el usuario ya intentó guardar.
 * - errores: objeto { campo: mensaje } devuelto por validarForm().
 *
 * Ejemplo:
 * <RaleoForm
 *   form={form}
 *   updateField={updateField}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */

import React from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Select from "../../../shared/components/Select";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

const FINCAS = [
  { label: "Finca La Reina", value: 1 },
  { label: "Finca La Esperanza", value: 2 },
  { label: "Finca La Villa", value: 3 },
  { label: "Finca El Paraíso", value: 4 },
];
const ESTANQUES = [
  { label: "A01", value: 1 },
  { label: "A02", value: 2 },
  { label: "B01", value: 3 },
  { label: "B02", value: 4 },
  { label: "B03", value: 5 },
  { label: "E01", value: 6 },
  { label: "E02", value: 7 },
  { label: "V01", value: 8 },
  { label: "V02", value: 9 },
];
const OBJETIVOS = [
  { label: "Comercialización", value: "Comercializacion" },
  { label: "Reducción de densidad", value: "Reduccion_densidad" },
  { label: "Resiembra en otro estanque", value: "Resiembra" },
];
const METODOS = [
  { label: "Atarraya", value: "Atarraya" },
  { label: "Red de arrastre", value: "Red de arrastre" },
  { label: "Boleo", value: "Boleo" },
  { label: "Trampa selectiva", value: "Trampa selectiva" },
];

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };
const sectionTitleRow = { flexDirection: "row", alignItems: "center", marginBottom: 10 };
const sectionIcon = { marginRight: 8 };

export default function RaleoForm({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
  biomasaCalculada= "",
}) {
  const invalidoFinca = submitted && !!errores.finca;
  const invalidoEstanque = submitted && !!errores.estanque;
  const invalidoFecha = submitted && !!errores.fecha;
  const invalidoPorcentaje = submitted && !!errores.porcentajeRaleo;
  const invalidoPesoPromedio = submitted && !!errores.pesoPromedio;
  const invalidoBiomasaTotal = submitted && !!errores.biomasaActual;
  const invalidoObjetivo = submitted && !!errores.objetivo;
  const invalidoMetodo = submitted && !!errores.metodo;
  const invalidoResponsable = submitted && !!errores.responsable;
  const invalidoObservaciones = submitted && !!errores.observaciones;

  return (
    <View>
      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Información General
          </Text>
        </View>

        <DateInput
          label="Fecha del Raleo *"
          value={form.fecha ?? ""}
          onChangeText={(v) => updateField("fecha", v)}
          labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          inputStyle={invalidoFecha ? bordeError : null}
        />

        <Select
          label="Finca *"
          value={form.finca}
          onChange={(v) => updateField("finca", v)}
          options={FINCAS}
          placeholder="Seleccionar finca"
          selectStyle={invalidoFinca ? bordeError : null}
        />

        <Select
          label="Estanque *"
          value={form.estanque}
          onChange={(v) => updateField("estanque", v)}
          options={ESTANQUES}
          placeholder="Seleccionar estanque"
          selectStyle={invalidoEstanque ? bordeError : null}
        />
      </Card>

      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.raleo} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Parámetros del Raleo
          </Text>
        </View>

        <Input
          label="Porcentaje de raleo (%) *"
          placeholder="Ej: 30"
          value={String(form.porcentajeRaleo ?? "")}
          keyboardType="numeric"
          onChangeText={(v) => updateField("porcentajeRaleo", v.replace(/[^0-9]/g, ""))}
          style={invalidoPorcentaje ? bordeError : null}
        />

        <Input
          label="Peso promedio estimado (g) *"
          placeholder="Ej: 10.5"
          value={String(form.pesoPromedio ?? "")}
          keyboardType="decimal-pad"
          onChangeText={(v) => updateField("pesoPromedio", v.replace(/[^0-9.]/g, ""))}
          style={invalidoPesoPromedio ? bordeError : null}
        />
        <Input
          label="Biomasa actual del estanque (kg) *"
          placeholder="Ej: 800"
          value={String(form.biomasaActual ?? "")}
          keyboardType="decimal-pad"
          onChangeText={(v) => updateField("biomasaActual", v.replace(/[^0-9.]/g, ""))}
          style={invalidoBiomasaTotal ? bordeError : null}
        />
        <Input
          label="Biomasa restante estimada (kg)"
          value={
            biomasaCalculada !== ""
              ? biomasaCalculada.toFixed(2)
              : ""
          }
          editable={false}
        />
        <Select
          label="Objetivo del raleo *"
          value={form.objetivo}
          onChange={(v) => updateField("objetivo", v)}
          options={OBJETIVOS}
          placeholder="Seleccionar objetivo"
          selectStyle={invalidoObjetivo ? bordeError : null}
        />
      </Card>

      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.tools} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Método de Extracción
          </Text>
        </View>

        <Select
          label="Método *"
          value={form.metodo}
          onChange={(v) => updateField("metodo", v)}
          options={METODOS}
          placeholder="Seleccionar método"
          selectStyle={invalidoMetodo ? bordeError : null}
        />

        <Input
          label="Responsable del raleo *"
          placeholder="Nombre del responsable"
          value={form.responsable ?? ""}
          onChangeText={(v) => updateField("responsable", v)}
          style={invalidoResponsable ? bordeError : null}
        />
      </Card>

      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.clipboard} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Observaciones
          </Text>
        </View>

        <Input
          label="Notas adicionales *"
          placeholder="Ingrese observaciones del raleo"
          value={form.observaciones ?? ""}
          onChangeText={(v) => updateField("observaciones", v)}
          style={invalidoObservaciones ? bordeError : null}
        />
      </Card>
    </View>
  );
}
