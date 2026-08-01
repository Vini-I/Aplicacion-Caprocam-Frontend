/**
 * ============================================================
 * COMPONENTE ALIMENTACIONLIST       IMPORTANTE!:Componente actualmente sin uso, ya que se decidío comentar esta sección del modulo, para pasarlo a otra parte.
 * ============================================================
 *
 * Lista de tarjetas con los registros de alimentación ya
 * guardados. Cada tarjeta muestra qué es (estanque), cuándo
 * (fecha/hora), cuánto (cantidad en kg), el método usado y el
 * proveedor, cuando estén disponibles.
 *
 * Funcionalidad:
 * - fmtFecha es la única función de formato de fecha en este
 *   archivo: normaliza a dd/mm/aaaa strings ya formateados,
 *   fechas ISO (aaaa-mm-dd) y fechas parseables por Date.
 * - Muestra un EmptyState cuando no hay registros.
 *
 * Props principales:
 * - alimentaciones: arreglo de registros a listar.
 *
 * Ejemplo:
 * <AlimentacionList alimentaciones={alimentaciones} />
 */
 
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import Text from '../../../shared/components/Text';
import EmptyState from '../../../shared/components/EmptyState';
import Icon from '../../../shared/components/Icons';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';

const fmtFecha = (f) => {
    if (!f) return null;

    if (/^\d{2}\//.test(f)) {
        return f;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(f)) {
        const [y, m, d] = f.split('-');
        return `${d}/${m}/${y}`;
    }
    try {
        const d = new Date(f);

        return `${String(d.getUTCDate()).padStart(2, '0')}/${String(
            d.getUTCMonth() + 1
        ).padStart(2, '0')}/${d.getUTCFullYear()}`;
    } catch {
        return f;
    }
};

const Badge = ({ icono, texto }) => (
    <View style={styles.badge}>
        <Icon
            icon={icono}
            size={13}
            color={COLORS.textTertiary}
        />

        <Text
            size={14}
            color={COLORS.textTertiary}
            weight="500"
            style={styles.tabNum}
        >
            {texto}
        </Text>
    </View>
);

const ItemAlimentacion = ({ item }) => (
    <View style={styles.item}>
        <View style={styles.fila}>
            <Icon
                icon={ICONS.water}
                size={16}
                color={COLORS.primary}
            />

            <Text
                size={16}
                color={COLORS.textSecondary}
                weight="500"
                style={styles.flex}
            >
                {item.estanque}
            </Text>

            <Text
                size={14}
                color={COLORS.textTertiary}
                weight="500"
            >
                {item.hora ?? '—'}
            </Text>
        </View>

        <View style={styles.badges}>
            <Badge
                icono={ICONS.weight}
                texto={`${item.cantidadKg} kg`}
            />

            {item.presentacion ? (
                <Badge
                    icono={ICONS.gift}
                    texto={item.presentacion}
                />
            ) : null}

            <Badge
                icono={ICONS.food}
                texto={item.metodo ?? '—'}
            />

            {item.proveedor ? (
                <Badge
                    icono={ICONS.info}
                    texto={item.proveedor}
                />
            ) : null}
        </View>

        {(item.fecha || item.tipoAlimento) ? (
            <View style={styles.badges}>
                {item.fecha ? (
                    <Badge
                        icono={ICONS.calendar}
                        texto={fmtFecha(item.fecha)}
                    />
                ) : null}

                {item.tipoAlimento ? (
                    <Badge
                        icono={ICONS.food}
                        texto={item.tipoAlimento}
                    />
                ) : null}
            </View>
        ) : null}

        {item.observaciones ? (
            <Text
                size={14}
                color={COLORS.textTertiary}
                weight="500"
                style={styles.obs}
            >
                {item.observaciones}
            </Text>
        ) : null}
    </View>
);

export default function AlimentacionList({
    alimentaciones = [],
}) {
    if (!alimentaciones.length) {
        return (
            <EmptyState
                title="Sin registros"
                description="No hay alimentaciones registradas aún."
            />
        );
    }

    return (
        <FlatList
            data={alimentaciones}
            renderItem={({ item }) => (
                <ItemAlimentacion item={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.lista}
            scrollEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    lista: {
        gap: 8,
    },

    item: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 14,
        gap: 8,
    },

    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    flex: {
        flex: 1,
    },

    badges: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },

    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    tabNum: {
        fontVariant: ['tabular-nums'],
    },

    obs: {
        fontStyle: 'italic',
    },
});