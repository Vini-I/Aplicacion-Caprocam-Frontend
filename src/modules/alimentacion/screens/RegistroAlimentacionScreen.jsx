/**
 * ============================================================
 * SCREEN REGISTROALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla alterna de registro de alimentación (sin listado ni
 * estadísticas): valida el formulario y lo persiste mediante
 * Alimentacion.service.js.
 *
 * Funcionalidad:
 * - Corrige el import de estilos para apuntar al archivo real
 *   AlimentacionStyles.js.
 * - Corrige un ReferenceError en tiempo de ejecución: showAlert()
 *   usa Platform y Alert pero el archivo nunca los importaba de
 *   'react-native'; ahora se importan junto con View/ScrollView/
 *   Pressable.
 *
 * Nota: esta pantalla no está enrutada actualmente desde
 * src/app/ (ninguna ruta la importa), por lo que no se le aplicó
 * el contrato completo de submitted/asterisco/borde rojo de
 * AlimentacionForm (queda con sus valores por defecto
 * submitted=false); ver resumen final para más detalle.
 *
 * Props principales:
 * - navigation: objeto de navegación (usa navigation.goBack()).
 *
 * Ejemplo:
 * <RegistroAlimentacionScreen navigation={navigation} />
 */

import React from "react";
import { View, ScrollView, Pressable, Platform, Alert } from "react-native";
import useAlimentacionForm from "../hooks/useAlimentacionForm";
import AlimentacionForm from "../components/AlimentacionForm";
import alimentacionService from "../services/Alimentacion.service";
import Text from "../../../shared/components/Text";
import { styles } from "../styles/AlimentacionStyles";
const showAlert = (title, message, buttons) => {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${message}`);
        buttons?.[0]?.onPress?.();
    } else {
        Alert.alert(title, message, buttons);
    }
};

export default function RegistroAlimentacionScreen({ navigation }) {
    const { form, updateField, resetForm, validarForm } = useAlimentacionForm();

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
                { text: 'OK', onPress: () => { resetForm(); navigation?.goBack(); } },
            ]);
        } catch {
            showAlert('Error', 'No se pudo guardar el registro');
        }
    };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <AlimentacionForm form={form} updateField={updateField} />
      </ScrollView>

      <Pressable onPress={handleGuardar} style={styles.btnGuardar}>
        <Text color="white">Guardar módulo</Text>
      </Pressable>
    </View>
  );
}