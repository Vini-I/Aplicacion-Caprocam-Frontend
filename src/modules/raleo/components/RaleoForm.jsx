import React from "react";
import { View, Pressable } from "react-native";
import Card from "../../../shared/components/Card";
import Select from "../../../shared/components/Select";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { styles } from "../styles/raleoStyles";

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
const PORCENTAJES = ["30%", "35%", "40%"];
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

export default function RaleoForm({ form = {}, updateField = () => {} }) {
  return (
    <View>
      <Card title="Información General">
        <DateInput
          label="Fecha del Raleo"
          value={form.fecha ?? ""}
          onChangeText={(v) => updateField("fecha", v)}
          labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
        />
        <Select
          label="Finca"
          value={form.finca}
          onChange={(v) => updateField("finca", v)}
          options={FINCAS}
          placeholder="Seleccionar finca"
        />
        <Select
          label="Estanque"
          value={form.estanque}
          onChange={(v) => updateField("estanque", v)}
          options={ESTANQUES}
          placeholder="Seleccionar estanque"
        />
      </Card>

      <Card title="Parámetros del Raleo">
        <Text size={14} weight="600" color={COLORS.textPrimary} style={{ marginBottom: 6 }}>
          Porcentaje de raleo
        </Text>
        <View style={styles.horasContainer}>
          {PORCENTAJES.map((p) => {
            const sel = form.porcentajeRaleo === p;
            return (
              <Pressable
                key={p}
                onPress={() => updateField("porcentajeRaleo", p)}
                style={[styles.pctBtn, sel && styles.pctBtnSelected]}
              >
                <Text size={14} color={sel ? COLORS.primary : COLORS.textTertiary} weight="500">
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Input
          label="Peso promedio estimado (g)"
          placeholder="Ej: 10.5"
          value={String(form.pesoPromedio ?? "")}
          keyboardType="decimal-pad"
          onChangeText={(v) => updateField("pesoPromedio", v)}
        />
        <Input
          label="Biomasa total estimada (kg)"
          placeholder="Ej: 800"
          value={String(form.biomasaTotal ?? "")}
          keyboardType="decimal-pad"
          onChangeText={(v) => updateField("biomasaTotal", v)}
        />
        <Select
          label="Objetivo del raleo"
          value={form.objetivo}
          onChange={(v) => updateField("objetivo", v)}
          options={OBJETIVOS}
          placeholder="Seleccionar objetivo"
        />
      </Card>

      <Card title="Método de Extracción">
        <Select
          label="Método"
          value={form.metodo}
          onChange={(v) => updateField("metodo", v)}
          options={METODOS}
          placeholder="Seleccionar método"
        />
        <Input
          label="Responsable del raleo"
          placeholder="Nombre del responsable"
          value={form.responsable ?? ""}
          onChangeText={(v) => updateField("responsable", v)}
        />
      </Card>

      <Card title="Observaciones">
        <Input
          label="Notas adicionales"
          placeholder="Ingrese observaciones del raleo"
          value={form.observaciones ?? ""}
          onChangeText={(v) => updateField("observaciones", v)}
        />
      </Card>
    </View>
  );
}
