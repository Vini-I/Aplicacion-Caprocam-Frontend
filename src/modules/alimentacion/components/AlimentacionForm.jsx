import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import DateInput from "../../../shared/components/DateInput";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

const HORAS = ["7:00 AM", "3:00 PM"];

const ESTANQUES = [
  { label: "Estanque A", value: "Estanque A" },
  { label: "Estanque B", value: "Estanque B" },
  { label: "Estanque C", value: "Estanque C" },
  { label: "Estanque D", value: "Estanque D" },
];
const FINCAS = [
  { label: "Finca Norte", value: "Finca Norte" },
  { label: "Finca Sur", value: "Finca Sur" },
];

const METODOS = [
  { label: "Plato", value: "Plato" },
  { label: "Boleo", value: "Boleo" },
];

const PRESENTACION = [
  { label: "En polvo", value: "Polvo" },
  { label: "Granulado", value: "Granulado" },
];

const PROVEEDORES = [
  { label: "Biomar", value: "Biomar" },
  { label: "Otro", value: "Otro" },
];

const TIPOS = [
  { label: "Balanceado iniciador 35%", value: "Balanceado iniciador 35%" },
  { label: "Balanceado engorde 38%", value: "Balanceado engorde 38%" },
  { label: "Balanceado premium 40%", value: "Balanceado premium 40%" },
  { label: "Antibiótico", value: "Antibiótico" },
];

export default function AlimentacionForm({
  form = {},
  updateField = () => {},
}) {
  return (
    <View>
      <Card title="Información General">
        <DateInput
          label="Fecha de Registro"
          value={form.fecha ?? ""}
          onChangeText={(v) => updateField("fecha", v)}
          labelStyle={{
            fontFamily: TYPOGRAPHY.fontFamily.medium,
          }}
        />
        <View style={styles.horasContainer}>
          {HORAS.map((h) => {
            const selected = form.hora === h;

            return (
              <Pressable
                key={h}
                onPress={() => updateField("hora", h)}
                style={[
                  styles.horaButton,
                  selected && styles.horaButtonSelected,
                ]}
              >
                <Text
                  size={14}
                  color={selected ? COLORS.primary : COLORS.textTertiary}
                  weight="500"
                >
                  {h}
                </Text>
              </Pressable>
            );
          })}
        </View>

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

      <Card title="Tipo de Alimentación">
        <Select
          label="Tipo"
          value={form.tipoAlimento}
          onChange={(v) => updateField("tipoAlimento", v)}
          options={TIPOS}
          placeholder="Seleccionar tipo"
        />

        <Select
          label="Presentación"
          value={form.presentacion}
          onChange={(v) => updateField("presentacion", v)}
          options={PRESENTACION}
          placeholder="Seleccionar presentación"
        />

        <Select
          label="Método"
          value={form.metodo}
          onChange={(v) => updateField("metodo", v)}
          options={METODOS}
          placeholder="Seleccionar método"
        />
      </Card>

      <Card title="Consumo">
        <Input
          label="Cantidad (Kg)"
          placeholder="0"
          value={String(form.cantidadKg ?? "")}
          keyboardType="numeric"
          onChangeText={(v) => {
            const soloNumeros = v.replace(/[^0-9]/g, "");
            updateField("cantidadKg", soloNumeros);
          }}
        />

        <Select
          label="Proveedor"
          value={form.proveedor}
          onChange={(v) => updateField("proveedor", v)}
          options={PROVEEDORES}
          placeholder="Seleccionar proveedor"
        />
      </Card>

      <Card title="Observaciones">
        <Input
          label="Notas"
          placeholder="Ingrese observaciones"
          value={form.observaciones ?? ""}
          onChangeText={(v) => updateField("observaciones", v)}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  horasContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  horaButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },

  horaButtonSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
});
