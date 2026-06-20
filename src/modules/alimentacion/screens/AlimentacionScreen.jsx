import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";

import useAlimentacion from "../hooks/useAlimentacion";
import useAlimentacionForm from "../hooks/useAlimentacionForm";
import alimentacionService from "../services/alimentacion.service";
import AlimentacionStats from "../components/AlimentacionStats";
import AlimentacionList from "../components/AlimentacionList";
import AlimentacionForm from "../components/AlimentacionForm";

import Text from "../../../shared/components/Text";
import Spinner from "../../../shared/components/Spinner";
import Icon from "../../../shared/components/Icons";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    buttons?.[0]?.onPress?.();
  } else {
    Alert.alert(title, message, buttons);
  }
};

const calcularStats = (alimentaciones) => ({
  registrosHoy: alimentaciones.length,
  kgSuministrados: alimentaciones.reduce(
    (acc, a) => acc + Number(a.cantidadKg || 0),
    0
  ),
  estanquesActivos: new Set(
    alimentaciones.map((a) => a.estanque)
  ).size,
});

export default function AlimentacionScreen({
  navigation,
  onBack,
}) {
  const {
    alimentaciones,
    loading,
    error,
    recargar,
  } = useAlimentacion();

  const { form, updateField, resetForm, validarForm } = useAlimentacionForm();

  useEffect(() => {
    const unsub = navigation?.addListener("focus", recargar);
    return unsub;
  }, [navigation, recargar]);

  const handleGuardar = async () => {
    const { valido, errores } = validarForm();
    if (!valido) {
      const lista = Object.values(errores).map(e => `• ${e}`).join('\n');
      showAlert('Campos incompletos', `Por favor complete:\n${lista}`);
      return;
    }
    try {
      console.log('Guardando:', form);
      await alimentacionService.create(form);
      showAlert('Éxito', 'Alimentación registrada correctamente', [
        { text: 'OK', onPress: () => { resetForm(); recargar(); } },
      ]);
    } catch {
      showAlert('Error', 'No se pudo guardar el registro');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Text
        tamano="sm"
        color={COLORS.error}
        alineacion="center"
      >
        {error}
      </Text>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Icon
            icon={ICONS.exit}
            size={20}
            color={COLORS.white}
          />

          <Text
            size={14}
            color={COLORS.white}
          >
            Módulos
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Icon
            icon={ICONS.shrimp}
            size={20}
            color={COLORS.white}
          />

          <Title
            level={4}
            color={COLORS.white}
            style={styles.headerTitleText}
          >
            Alimentación
          </Title>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <AlimentacionStats
          {...calcularStats(alimentaciones)}
        />

        <AlimentacionForm form={form} updateField={updateField} />

        <Text
          tamano="xs"
          color={COLORS.textPrimary}
          fuente={TYPOGRAPHY.fontFamily.regular}
          estilo={styles.secLabel}
        >
          REGISTROS DEL DÍA
        </Text>

        <AlimentacionList
          alimentaciones={alimentaciones}
        />

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.fab}>
        <Pressable
          style={({ pressed }) => [
            styles.btnPrimario,
            pressed && styles.pressed,
          ]}
          onPress={handleGuardar}
        >
          <Text
            style={{
              color: COLORS.white,
              fontFamily:
                TYPOGRAPHY.fontFamily.regular,
            }}
          >
            GUARDAR REGISTRO
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  contenido: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },

  secLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  spacer: {
    height: 20,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },

  btnPrimario: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + 8
        : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitleText: {
    fontSize: 22,
    fontWeight: "700",
  },
});