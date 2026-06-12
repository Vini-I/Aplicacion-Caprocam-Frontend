import React, { useState } from 'react';
import { Pressable, Platform, StyleSheet } from 'react-native';
import Text from '../../../shared/components/Text';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

// Cargamos solo en plataformas nativas para evitar errores en web
const DateTimePicker = Platform.OS !== 'web'
    ? require('@react-native-community/datetimepicker').default
    : null;

const fmtFecha = (f) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(f)) {
        const [y, m, d] = f.split('-');
        return `${d}/${m}/${y}`;
    }
    const d = new Date(f);
    return `${String(d.getUTCDate()).padStart(2,'0')}/${String(d.getUTCMonth()+1).padStart(2,'0')}/${d.getUTCFullYear()}`;
};

export default function CampoFecha({ valor, onChange }) {
    const [mostrar, setMostrar] = useState(false);

    // En web usamos el input HTML nativo (abre calendario del navegador)
    if (Platform.OS === 'web') {
        return (
            <input
                type="date"
                style={{
                    padding: 12, border: COLORS.secondary, borderRadius: 8,
                    fontSize: 14, minHeight: 44, width: '100%',
                    boxSizing: 'border-box', fontFamily: TYPOGRAPHY.fontFamily.regular, cursor: 'pointer',
                }}
                value={valor || ''}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => e.target.value && onChange(e.target.value)}
            />
        );
    }

    const handleChange = (evento, fecha) => {
        if (Platform.OS === 'android') setMostrar(false);
        if (evento.type !== 'dismissed' && fecha) onChange(fecha.toISOString());
    };

    return (
        <>
            <Pressable
                style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
                onPress={() => setMostrar(true)}
            >
            <Text
                size={14}
                color={valor ? COLORS.textPrimary : COLORS.textTertiary}
            >
                {valor ? fmtFecha(valor) : 'Seleccionar fecha'}
            </Text>
            </Pressable>
            {mostrar && DateTimePicker && (
                <DateTimePicker
                    value={valor ? new Date(valor) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleChange}
                    maximumDate={new Date()}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    trigger: { borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, padding: 12, minHeight: 44, justifyContent: 'center' },
    pressed: { opacity: 0.7 },
});