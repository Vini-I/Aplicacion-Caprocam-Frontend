import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import useEditarAlimentacionScreen from "../hooks/useEditarAlimentacion";
import AlimentacionForm from "../components/AlimentacionForm";

import Text from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

import { styles } from "../styles/AlimentacionStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function EditarAlimentacionScreen({ registroId }) {
  const router = useRouter();

  const {
    form,
    updateField,
    cargando,
    submitted,
    errores,
    alerta,
    guardando,
    handleGuardar,
  } = useEditarAlimentacionScreen(registroId, () => {
    router.replace({
        pathname: "/registros/Reporteria",
        params: { alert: "edited" },
    });
    });

  if (!registroId) {
    return (
      <View style={styles.screen}>
        <NavbarRegistro Titulo="Alimentación" Subtitulo="Editar registro" Icono="food" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            No se encontró el registro a editar.
          </Text>
        </View>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={styles.screen}>
        <NavbarRegistro Titulo="Alimentación" Subtitulo="Editar registro" Icono="food" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            Cargando registro...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <NavbarRegistro Titulo="Alimentación" Subtitulo="Editar registro" Icono="food" />
      <View style={STYLE.container}>
        <ScrollView
          style={STYLE.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={STYLE.contentWrapper}>
            <AlimentacionForm
              form={form}
              updateField={updateField}
              submitted={submitted}
              errores={errores}
            />
            
            <Button
              variant="outline"
              onPress={handleGuardar}
              disabled={guardando}
              style={styles.submitButton}
            >
              <View style={styles.buttonContent}>
                <Icon icon={ICONS.save} size={24} color={COLORS.primary} />
                <Text style={styles.buttonText}>
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </Text>
              </View>
            </Button>

            <View style={styles.spacer} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}