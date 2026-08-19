/**
 * ============================================================
 * COMPONENTE ALIMENTACIONSTATS
 * ============================================================
 *
 * Fila de tarjetas con estadísticas rápidas del día para el
 * módulo de Alimentación (registros de hoy, kg suministrados y
 * estanques activos).
 *
 * Funcionalidad:
 * - Todos los colores usados provienen de COLORS (COLORS.textPrimary,
 *   COLORS.textSecondary, COLORS.textTertiary, COLORS.black), sin
 *   valores de color hardcodeados.
 *
 * Props principales:
 * - registrosHoy: cantidad de registros del día.
 * - kgSuministrados: total de kg suministrados.
 * - estanquesActivos: cantidad de estanques distintos con registro.
 *
 * Ejemplo:
 * <AlimentacionStats
 *   registrosHoy={3}
 *   kgSuministrados={120}
 *   estanquesActivos={2}
 * />
 */
 
import React from "react";
import { View, StyleSheet } from "react-native";
import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

const StatItem = ({ icono, valor, etiqueta }) => (
    <Card>
        <View style={styles.contenido}>
            <Icon
                icon={icono}
                size={20}
                color={COLORS.black}
            />

            <Text
                size={20}
                color={COLORS.textPrimary}
                weight="700"
                align="center"
            >
                {String(valor)}
            </Text>

            <Text
                size={17}
                color={COLORS.textTertiary}
                align="center"
                style={styles.etiqueta}
            >
                {etiqueta}
            </Text>
        </View>
    </Card>
);

export default function AlimentacionStats({
    registrosHoy = 0,
    kgSuministrados = 0,
    estanquesActivos = 0,
}) {
    return (
        <View style={styles.container}>
            <View style={styles.stat}>
                <StatItem
                    icono={ICONS.certificate}
                    valor={registrosHoy}
                    etiqueta="REGISTROS HOY"
                />
            </View>

            <View style={styles.stat}>
                <StatItem
                    icono={ICONS.weight}
                    valor={`${kgSuministrados} Kg`}
                    etiqueta="KG SUMINISTRADOS"
                />
            </View>

            <View style={styles.stat}>
                <StatItem
                    icono={ICONS.water}
                    valor={estanquesActivos}
                    etiqueta="ESTANQUES"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },

    stat: {
        flex: 1,
    },

    contenido: {
        alignItems: "center",
        gap: 6,
    },

    etiqueta: {
        textTransform: "uppercase",
        color: COLORS.textSecondary
    },
});