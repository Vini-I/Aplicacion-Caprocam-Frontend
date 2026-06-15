import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import useAlimentacion from '../hooks/useAlimentacion';
import AlimentacionStats from '../components/AlimentacionStats';
import AlimentacionList from '../components/AlimentacionList';
import CustomText from '../../../shared/components/Text';
import Spinner from '../../../shared/components/spinner';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { TYPOGRAPHY } from '../../../theme/typography'

const calcularStats = (alimentaciones) => ({
    registrosHoy:     alimentaciones.length,
    kgSuministrados:  alimentaciones.reduce((acc, a) => acc + Number(a.cantidadKg || 0), 0),
    estanquesActivos: new Set(alimentaciones.map((a) => a.estanque)).size,
});

export default function AlimentacionScreen({ navigation }) {
    const { alimentaciones, loading, error, recargar } = useAlimentacion();

    useEffect(() => {
        const unsub = navigation?.addListener('focus', recargar);
        return unsub;
    }, [navigation]);

    if (loading) return <Spinner />;
    if (error)   return <CustomText tamano="sm" color={COLORS.error} alineacion="center">{error}</CustomText>;

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.contenido}>
                <AlimentacionStats {...calcularStats(alimentaciones)} />
                <CustomText tamano="xs" color={COLORS.textPrimary} fuente={TYPOGRAPHY.fontFamily.regular} estilo={styles.secLabel}>
                    REGISTROS DEL DÍA
                </CustomText>
                <AlimentacionList alimentaciones={alimentaciones} />
                <View style={styles.spacer} />
            </ScrollView>
            <View style={styles.fab}>
                <Pressable
                    style={({ pressed }) => [styles.btnPrimario, pressed && styles.pressed]}
                    onPress={() => navigation?.navigate('RegistroAlimentacion')}
                >
                    <FontAwesome6 name="plus" size={16} color={COLORS.white} solid />
                    <CustomText tamano="sm" color={COLORS.white} fuente={TYPOGRAPHY.fontFamily.regular}>REGISTRAR</CustomText>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.btnSecundario, pressed && styles.pressed]}
                    onPress={() => navigation?.navigate('HistorialAlimentacion')}
                >
                    <FontAwesome6 name="clock-rotate-left" size={14} color={COLORS.primary} solid />
                    <CustomText tamano="sm" color={COLORS.primary} fuente={TYPOGRAPHY.fontFamily.regular}>HISTORIAL</CustomText>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen:       { flex: 1, backgroundColor: COLORS.surface },
    contenido:    { flexGrow: 1 ,padding: 16, gap: 12, paddingBottom: 130 },
    secLabel:     { textTransform: 'uppercase', letterSpacing: 0.5 },
    spacer:       { height: 20 },
    fab:          { position: 'absolute', bottom: 20, left: 16, right: 16, gap: 8 },
    btnPrimario:  { backgroundColor: COLORS.primary, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
    btnSecundario:{ backgroundColor: COLORS.white, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderWidth: 1.5, borderColor: COLORS.primary },
    pressed:      { opacity: 0.85, transform: [{ scale: 0.98 }] },
});