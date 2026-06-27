import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import RaleoForm from "../components/RaleoForm";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/raleoStyles";

const FORM_INICIAL = {
  fecha: "",
  finca: "",
  estanque: "",
  porcentajeRaleo: "",
  pesoPromedio: "",
  biomasaTotal: "",
  objetivo: "",
  metodo: "",
  responsable: "",
  observaciones: "",
};

export default function RaleoScreen() {
  const router = useRouter();
  const [form, setForm] = useState(FORM_INICIAL);

  function updateField(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="outline" onPress={() => router.back()} style={styles.backBtn}>
          <View style={styles.backBtnContent}>
            <Icon icon={ICONS.exit} size={18} color={COLORS.white} />
            <Text size={16} color={COLORS.white} style={styles.backBtnText}>Volver</Text>
          </View>
        </Button>

        <View style={styles.headerTitle}>
          <View style={styles.headerIcon}>
            <Icon icon={ICONS.raleo} size={28} color={COLORS.primary} />
          </View>
          <View>
            <Title level={3} color={COLORS.white}>Raleo</Title>
            <Text size={14} color={COLORS.white}>Cosecha parcial y densidad</Text>
          </View>
        </View>
      </View>

      <View style={styles.contenido}>
        <RaleoForm form={form} updateField={updateField} />

        <Button onPress={() => {}} style={styles.saveButton}>
          <View style={styles.saveBtnContent}>
            <Icon icon={ICONS.save} size={18} color={COLORS.white} />
            <Text size={16} color={COLORS.white} style={styles.saveBtnText}>Registrar Raleo</Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}
