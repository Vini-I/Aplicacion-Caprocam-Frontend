/**
 * ============================================================
 * SCREEN EDITAR CRECIMIENTO
 * ============================================================
 * Mismo patrón que EditarAlimentacionScreen del compañero.
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
import useEditarCrecimiento from "../hooks/useEditarCrecimiento";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function EditarCrecimientoScreen({ registroId }) {
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
  } = useEditarCrecimiento(registroId, () => {
    router.replace({
      pathname: "/registros/Reporteria",
      params: { alert: "edited" },
    });
  });

  if (!registroId) {
    return (
      <View>
        <NavbarRegistro Titulo="Crecimiento" Subtitulo="Editar registro" Icono="growth" />
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
        <NavbarRegistro Titulo="Crecimiento" Subtitulo="Editar registro" Icono="growth" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>Cargando registro...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <NavbarRegistro Titulo="Crecimiento" Subtitulo="Editar registro" Icono="growth" />
      <ScrollView
        style={STYLE.container}
        contentContainerStyle={STYLE.contentWrapper}
        keyboardShouldPersistTaps="handled"
      >
        <Card>
          <DateInput
            label="Fecha de registro *"
            value={form.fechaRegistro}
            onChangeText={(v) => updateField("fechaRegistro", v)}
          />
          {submitted && errores.fecha ? (
            <Text size={12} color={COLORS.error}>{errores.fecha}</Text>
          ) : null}

          <NumberInput
            label="Peso actual (g) *"
            value={form.pesoActual}
            onChangeText={(v) => updateField("pesoActual", v)}
          />
          {submitted && errores.peso ? (
            <Text size={12} color={COLORS.error}>{errores.peso}</Text>
          ) : null}

          <Text size={12} color={COLORS.textQuaternary} style={{ marginTop: 8 }}>
            Finca / estanque / colaborador se mantienen del registro original
            (ids: {form.finca} / {form.estanque} / {form.colaborador}).
          </Text>
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
