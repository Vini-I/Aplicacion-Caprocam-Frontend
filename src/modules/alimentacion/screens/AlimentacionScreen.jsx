import React, { useEffect } from "react";
import { View, Platform, Alert } from "react-native";
import useAlimentacion from "../hooks/useAlimentacion";
import useAlimentacionForm from "../hooks/useAlimentacionForm";
import alimentacionService from "../services/alimentacion.service";
import Spinner from "../../../shared/components/Spinner";
import Text from "../../../shared/components/Text";
import GestionAlimentacion from "./GestionAlimentacion";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/alimentacionStyles";

const showAlert = (title, message, buttons) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    buttons?.[0]?.onPress?.();
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function AlimentacionScreen({ navigation, onBack }) {
  const { alimentaciones, loading, error, recargar } = useAlimentacion();
  const { form, updateField, resetForm, validarForm } = useAlimentacionForm();

  useEffect(() => {
    const unsub = navigation?.addListener("focus", recargar);
    return unsub;
  }, [navigation, recargar]);

  const handleGuardar = async () => {
    const { valido, errores } = validarForm();

    if (!valido) {
      const lista = Object.values(errores)
        .map((e) => `• ${e}`)
        .join("\n");
      showAlert("Campos incompletos", `Por favor complete:\n${lista}`);
      return;
    }

    try {
      await alimentacionService.create(form);
      showAlert("Éxito", "Alimentación registrada correctamente", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            recargar();
          },
        },
      ]);
    } catch {
      showAlert("Error", "No se pudo guardar el registro");
    }
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <Text color={COLORS.error} alineacion="center">
        {error}
      </Text>
    );

  return (
    <View style={styles.screen}>
      <GestionAlimentacion
        alimentaciones={alimentaciones}
        form={form}
        updateField={updateField}
        handleGuardar={handleGuardar}
        onBack={onBack}
      />
    </View>
  );
}