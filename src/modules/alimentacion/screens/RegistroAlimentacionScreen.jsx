import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import useAlimentacionForm from '../hooks/useAlimentacionForm';
import AlimentacionForm from '../components/AlimentacionForm';
import alimentacionService from '../services/alimentacion.service';
import Text from '../../../shared/components/Text';
import { COLORS } from '../../../theme/colors';

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
            <ScrollView contentContainerStyle={styles.contenido}>
                <AlimentacionForm form={form} updateField={updateField} />
                <View style={styles.spacer} />
            </ScrollView>
            <Pressable
                style={({ pressed }) => [styles.btnGuardar, pressed && styles.btnPressed]}
                onPress={handleGuardar}
            >
                <FontAwesome6 name="floppy-disk" size={18} color={COLORS.white} solid />
                <Text tamano="md" color={COLORS.white} fuente="Roboto_500Medium">Guardar módulo</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screen:    { flex: 1, backgroundColor: COLORS.surface },
    contenido: { padding: 16, gap: 12, paddingBottom: 110 },
    spacer:    { height: 20 },
    btnGuardar: {
        position: 'absolute', bottom: 20, left: 16, right: 16,
        backgroundColor: COLORS.primary, borderRadius: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10, paddingVertical: 16,
    },
    btnPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});