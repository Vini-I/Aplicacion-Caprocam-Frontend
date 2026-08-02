/**
 * ============================================================
 * SCREEN EDITAR RALEO
 * ============================================================
 * Reutiliza RaleoForm como Alimentación reutiliza AlimentacionForm.
 */
import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";
import RaleoForm from "../components/RaleoForm";
import useEditarRaleo from "../hooks/useEditarRaleo";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function EditarRaleoScreen({ registroId }) {
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
  } = useEditarRaleo(registroId, () => {
    router.replace({
      pathname: "/registros/Reporteria",
      params: { alert: "edited" },
    });
  });

  if (!registroId) {
    return (
      <View>
        <NavbarRegistro Titulo="Raleo" Subtitulo="Editar registro" Icono="raleo" />
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
      <View>
        <NavbarRegistro Titulo="Raleo" Subtitulo="Editar registro" Icono="raleo" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>Cargando registro...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <NavbarRegistro Titulo="Raleo" Subtitulo="Editar registro" Icono="raleo" />
      <ScrollView
        style={STYLE.container}
        contentContainerStyle={STYLE.contentWrapper}
        keyboardShouldPersistTaps="handled"
      >
        <RaleoForm
          form={form}
          updateField={updateField}
          submitted={submitted}
          errores={errores}
        />

        {alerta.visible && (
          <Alert
            variant={alerta.variant === "error" ? "danger" : alerta.variant}
            message={alerta.mensaje}
            style={{ marginVertical: 12 }}
          />
        )}

        <Button variant="outline" onPress={handleGuardar} disabled={guardando}>
          <Icon icon={ICONS.save} size={22} color={COLORS.primary} />
          <Text color={COLORS.primary}>
            {guardando ? " Guardando..." : " Guardar cambios"}
          </Text>
        </Button>
      </ScrollView>
    </>
  );
}
