/**
 * ============================================================
 * SCREEN EDITAR DENSIDAD POBLACIONAL
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
import useEditarDensidad from "../hooks/useEditarDensidad";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function EditarDensidadScreen({ registroId }) {
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
  } = useEditarDensidad(registroId, () => {
    router.replace({
      pathname: "/registros/Reporteria",
      params: { alert: "edited" },
    });
  });

  if (!registroId) {
    return (
      <View>
        <NavbarRegistro Titulo="Densidad" Subtitulo="Editar registro" Icono="document" />
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
        <NavbarRegistro Titulo="Densidad" Subtitulo="Editar registro" Icono="document" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>Cargando registro...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <NavbarRegistro Titulo="Densidad" Subtitulo="Editar registro" Icono="document" />
      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper} keyboardShouldPersistTaps="handled">
        <Card>
          <DateInput label="Fecha *" value={form.fecha} onChangeText={(v) => updateField("fecha", v)} />
          <NumberInput label="Camarones estimados" value={form.numeroCamarones} onChangeText={(v) => updateField("numeroCamarones", v)} />
          <NumberInput label="Tiros atarraya" value={form.tirosAtarraya} onChangeText={(v) => updateField("tirosAtarraya", v)} />
          <NumberInput label="Área atarraya" value={form.areaAtarraya} onChangeText={(v) => updateField("areaAtarraya", v)} />
          <NumberInput label="Promedio por tiro" value={form.promedioPorTiro} onChangeText={(v) => updateField("promedioPorTiro", v)} />
          <NumberInput label="Sobrevivencia (%)" value={form.sobrevivencia} onChangeText={(v) => updateField("sobrevivencia", v)} />
          <NumberInput label="Siembra / m²" value={form.cantidadSiembra} onChangeText={(v) => updateField("cantidadSiembra", v)} />
          <NumberInput label="Área estanque" value={form.areaEstanque} onChangeText={(v) => updateField("areaEstanque", v)} />
          <Input label="Notas" value={form.notasConteo} onChangeText={(v) => updateField("notasConteo", v)} />
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
