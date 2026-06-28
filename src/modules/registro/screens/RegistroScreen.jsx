import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from '../../../shared/components/Text';
import { COLORS } from '../../../theme/colors';

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
 * El estado de selección de finca/estanque vive en useRegistro().
 * Los datos estáticos (FINCAS, ESTANQUES, MODULOS) vienen de
 * RegistroData.js.
 *
 * La navegación entre módulos NO la maneja esta pantalla: cada
 * módulo es una ruta real de expo-router. RegistroScreen solo
 * dispara los callbacks de navegación que le llegan por props
 * (onFisicoQuimica, onAlimentacion, onMortalidad), definidos en
 * registros/index.jsx con router.push().
 *
 * ---
 * FLUJO
 * ---
 * 1. Usuario selecciona finca → se actualiza el estanque por
 *    defecto de esa finca automáticamente
 * 2. Usuario selecciona estanque
 * 3. Usuario toca un ModuloCard disponible → se ejecuta el
 *    callback de navegación correspondiente (router.push a la
 *    ruta del módulo)
 *
 * ---
 * PROPS
 * ---
 * onFisicoQuimica  fn  — navega a la ruta de Físico-Química
 * onAlimentacion   fn  — navega a la ruta de Alimentación
 * onMortalidad     fn  — navega a la ruta de Mortalidad
 *
 * ---
 * USO
 * ---
 * Se renderiza desde app/(drawer)/(tabs)/registros/index.jsx
 *
 * <RegistroScreen
 *   onFisicoQuimica={() => router.push('/(drawer)/(tabs)/registros/FisicoQuimica')}
 *   onAlimentacion={() => router.push('/(drawer)/(tabs)/registros/Alimentacion')}
 *   onMortalidad={() => router.push('/(drawer)/(tabs)/registros/Mortalidad')}
 * />
 */

export default function RegistroScreen({ onFisicoQuimica, onAlimentacion, onMortalidad, onCrecimiento}) {
    const {
        fincaSeleccionada,
        estanqueSeleccionado, setEstanqueSeleccionado,
        estanques, finca, estanque,
        handleFinca,
    } = useRegistro();

    return (
        <SafeAreaView style={styles.contenedor}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Selección ── */}
                <View style={styles.seccion}>
                    <Text size={11} weight="600" color={COLORS.textTertiary} style={styles.seccionLabel}>
                        SELECCIÓN
                    </Text>

                    <Text size={13} color={COLORS.textSecondary} style={styles.subLabel}>Finca</Text>
                    <View style={styles.chips}>
                        {FINCAS.map((f) => (
                            <Chip key={f.id} label={f.nombre} selected={fincaSeleccionada === f.id} onPress={() => handleFinca(f.id)} />
                        ))}
                    </View>

                    <Text size={13} color={COLORS.textSecondary} style={styles.subLabel}>Estanque</Text>
                    <View style={styles.chips}>
                        {estanques.map((e) => (
                            <Chip key={e.id} label={e.id} selected={estanqueSeleccionado === e.id} onPress={() => setEstanqueSeleccionado(e.id)} />
                        ))}
                    </View>

                    {finca && estanque && (
                        <Text size={12} color={COLORS.textTertiary}>
                            {finca.nombre} → {estanque.id} · {estanque.especie}
                        </Text>
                    )}
                </View>

                {/* ── Módulos ── */}
                <Text size={11} weight="600" color={COLORS.textTertiary} style={styles.seccionLabel}>
                    MÓDULOS DEL REGISTRO
                </Text>

                <View style={styles.grilla}>
                    {MODULOS.map((m) => (
                        <ModuloCard
                            key={m.id}
                            modulo={m}
                            onPress={
                                m.id === 'fisicoquimica' ? onFisicoQuimica :
                                m.id === 'alimentacion' ? onAlimentacion :
                                m.id === 'mortalidad' ? onMortalidad :
                                m.id === 'crecimiento' ? onCrecimiento :
                                null

                            }
                        />
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}