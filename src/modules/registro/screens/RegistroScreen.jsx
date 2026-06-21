import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomText from '../../../shared/components/Text';
import { COLORS } from '../../../theme/colors';

import FisicoQuimicaScreen from '../../mantAgua/screens/FisicoQuimicaScreen';
import MortalidadScreen from '../../mortalidad/screens/MortalidadScreen';
import AlimentacionScreen from '../../alimentacion/screens/AlimentacionScreen';

import Chip from '../components/Chip';
import ModuloCard from '../components/ModuloCard';
import useRegistro from '../hooks/useRegistro';
import { MODULOS, FINCAS } from './RegistroData';
import { styles } from '../styles/RegistroStyles';

/**
 * ============================================================
 * PANTALLA REGISTRO
 * ============================================================
 *
 * Punto de entrada del flujo de registro: el usuario elige
 * finca + estanque y luego un módulo (alimentación, crecimiento,
 * físico-química, mortalidad) para registrar mediciones.
 *
 * El estado de selección y módulo activo vive en useRegistro().
 * Los datos estáticos (FINCAS, ESTANQUES, MODULOS) vienen de
 * RegistroData.js.
 *
 * ---
 * FLUJO
 * ---
 * 1. Usuario selecciona finca → se actualiza el estanque por
 *    defecto de esa finca automáticamente
 * 2. Usuario selecciona estanque
 * 3. Usuario toca un ModuloCard disponible → se renderiza la
 *    pantalla de ese módulo en lugar de la grilla
 * 4. Cada pantalla de módulo recibe onBack para volver a la grilla
 *
 * ---
 * USO
 * ---
 * Se renderiza directo desde app/(drawer)/(tabs)/registros/index.jsx
 *
 * <RegistroScreen />  (sin props)
 */

export default function RegistroScreen() {
    const {
        fincaSeleccionada,
        estanqueSeleccionado, setEstanqueSeleccionado,
        moduloActivo,
        estanques, finca, estanque,
        handleFinca,
        abrirModulo,
        cerrarModulo,
    } = useRegistro();

    if (moduloActivo === 'fisicoquimica') {
        return <FisicoQuimicaScreen onBack={cerrarModulo} />;
    }
    if (moduloActivo === 'mortalidad') {
        return <MortalidadScreen onBack={cerrarModulo} />;
    }
    if (moduloActivo === 'alimentacion') {
        return <AlimentacionScreen onBack={cerrarModulo} />;
    }

    return (
        <SafeAreaView style={styles.contenedor}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Selección ── */}
                <View style={styles.seccion}>
                    <CustomText size={11} weight="600" color={COLORS.textTertiary} style={styles.seccionLabel}>
                        SELECCIÓN
                    </CustomText>

                    <CustomText size={13} color={COLORS.textSecondary} style={styles.subLabel}>Finca</CustomText>
                    <View style={styles.chips}>
                        {FINCAS.map((f) => (
                            <Chip key={f.id} label={f.nombre} selected={fincaSeleccionada === f.id} onPress={() => handleFinca(f.id)} />
                        ))}
                    </View>

                    <CustomText size={13} color={COLORS.textSecondary} style={styles.subLabel}>Estanque</CustomText>
                    <View style={styles.chips}>
                        {estanques.map((e) => (
                            <Chip key={e.id} label={e.id} selected={estanqueSeleccionado === e.id} onPress={() => setEstanqueSeleccionado(e.id)} />
                        ))}
                    </View>

                    {finca && estanque && (
                        <CustomText size={12} color={COLORS.textTertiary}>
                            {finca.nombre} → {estanque.id} · {estanque.especie}
                        </CustomText>
                    )}
                </View>

                {/* ── Módulos ── */}
                <CustomText size={11} weight="600" color={COLORS.textTertiary} style={styles.seccionLabel}>
                    MÓDULOS DEL REGISTRO
                </CustomText>

                <View style={styles.grilla}>
                    {MODULOS.map((m) => (
                        <ModuloCard
                            key={m.id}
                            modulo={m}
                            onPress={
                                m.id === 'fisicoquimica' || m.id === 'mortalidad' || m.id === 'alimentacion'
                                    ? () => abrirModulo(m.id)
                                    : null
                            }
                        />
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}