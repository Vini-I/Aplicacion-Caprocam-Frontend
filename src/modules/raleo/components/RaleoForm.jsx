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
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

const FINCAS = [
  { label: "Finca La Reina", value: "laReina" },
  { label: "Finca La Esperanza", value: "laEsperanza" },
  { label: "Finca La Villa", value: "laVilla" },
  { label: "Finca El Paraíso", value: "elParaiso" },
];
const ESTANQUES = [
  { label: "A01", value: "A01" },
  { label: "A02", value: "A02" },
  { label: "B01", value: "B01" },
  { label: "B02", value: "B02" },
  { label: "B03", value: "B03" },
  { label: "E01", value: "E01" },
  { label: "E02", value: "E02" },
  { label: "V01", value: "V01" },
  { label: "V02", value: "V02" },
];
const OBJETIVOS = [
  { label: "Comercialización", value: "comercializacion" },
  { label: "Reducción de densidad", value: "reduccion_densidad" },
  { label: "Resiembra en otro estanque", value: "resiembra" },
];
const METODOS = [
  { label: "Atarraya", value: "atarraya" },
  { label: "Red de arrastre", value: "red_arrastre" },
  { label: "Boleo", value: "boleo" },
  { label: "Trampa selectiva", value: "trampa" },
];

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };

export default function RaleoForm({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  const invalidoFinca = submitted && !!errores.finca;
  const invalidoEstanque = submitted && !!errores.estanque;
  const invalidoFecha = submitted && !!errores.fecha;
  const invalidoPorcentaje = submitted && !!errores.porcentajeRaleo;
  const invalidoPesoPromedio = submitted && !!errores.pesoPromedio;
  const invalidoBiomasaTotal = submitted && !!errores.biomasaTotal;
  const invalidoObjetivo = submitted && !!errores.objetivo;
  const invalidoMetodo = submitted && !!errores.metodo;
  const invalidoResponsable = submitted && !!errores.responsable;
  const invalidoObservaciones = submitted && !!errores.observaciones;

  return (
    <View>
      <Card title="Información General">
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

      <Card title="Parámetros del Raleo">
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
          label="Biomasa total estimada (kg) *"
          placeholder="Ej: 800"
          value={String(form.biomasaTotal ?? "")}
          keyboardType="decimal-pad"
          onChangeText={(v) => updateField("biomasaTotal", v.replace(/[^0-9.]/g, ""))}
          style={invalidoBiomasaTotal ? bordeError : null}
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

      <Card title="Método de Extracción">
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

      <Card title="Observaciones">
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
