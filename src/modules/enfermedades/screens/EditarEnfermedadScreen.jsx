/**
 * ============================================================
 * SCREEN EDITAR ENFERMEDAD
 * ============================================================
 */
import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import DateInput from "../../../shared/components/DateInput";
import Alert from "../../../shared/components/Alert";
import useEditarEnfermedad from "../hooks/useEditarEnfermedad";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function EditarEnfermedadScreen({ registroId }) {
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
  } = useEditarEnfermedad(registroId, () => {
    router.replace({
      pathname: "/registros/Reporteria",
      params: { alert: "edited" },
    });
  });

  if (!registroId) {
    return (
      <View>
        <NavbarRegistro Titulo="Enfermedades" Subtitulo="Editar registro" Icono="document" />
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
        <NavbarRegistro Titulo="Enfermedades" Subtitulo="Editar registro" Icono="document" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>Cargando registro...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <NavbarRegistro Titulo="Enfermedades" Subtitulo="Editar registro" Icono="document" />
      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper} keyboardShouldPersistTaps="handled">
        <Card>
          <DateInput
            label="Fecha reporte *"
            value={form.fechaReporte}
            onChangeText={(v) => updateField("fechaReporte", v)}
          />
          <Input
            label="Enfermedad *"
            value={form.enfermedad}
            onChangeText={(v) => updateField("enfermedad", v)}
          />
          {submitted && errores.enfermedad ? (
            <Text size={12} color={COLORS.error}>{errores.enfermedad}</Text>
          ) : null}
          <Input
            label="Severidad *"
            value={form.severidad}
            onChangeText={(v) => updateField("severidad", v)}
          />
          <NumberInput
            label="Mortalidad"
            value={form.mortalidadRegistrada}
            onChangeText={(v) => updateField("mortalidadRegistrada", v)}
          />
          <Input
            label="Reporte *"
            value={form.reporte}
            onChangeText={(v) => updateField("reporte", v)}
          />
        </Card>

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
