import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import RaleoForm from "../components/RaleoForm";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/raleoStyles";
import useRaleo from "../hooks/useRaleo";

export default function RaleoScreen() {
  const { form, updateField } = useRaleo();

  return (
    <>
    <NavbarRegistro
        Titulo="Raleo"
        Subtitulo="Cosecha parcial y densidad"
        Icono="raleo"
      />
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
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
    </>
  );
}
