/**
 * ============================================================
 * COMPONENTE CARD
 * ============================================================
 *
 * Este componente se utiliza para mostrar una tarjeta
 * reutilizable dentro de la aplicacion.
 *
 * Permite:
 * - Mostrar un titulo opcional en la tarjeta
 * - Contener cualquier tipo de contenido dentro de ella
 * - Reutilizar la misma estructura visual en diferentes pantallas
 *
 * ---
 * PARAMETROS
 * ---
 *
 * title
 * Texto que se mostrara como titulo de la tarjeta.
 *
 * Es opcional, si no se envia no se mostrara ningun titulo.
 *
 * Ejemplo:
 * <Card title="Perfil">
 *     <Text>Informacion del usuario</Text>
 * </Card>
 *
 * ---
 *
 * children
 * Contenido que se mostrara dentro de la tarjeta.
 *
 * Puede contener cualquier componente de React Native como:
 * - Text
 * - Image
 * - Button
 * - View
 *
 * Ejemplo:
 * <Card>
 *     <Text>Contenido de la tarjeta</Text>
 * </Card>
 *
 * ============================================================
 * EJEMPLOS RAPIDOS
 * ============================================================
 *
 * <Card title="Usuario">
 *     <Text>Juan Perez</Text>
 * </Card>
 *
 * <Card>
 *     <Text>Sin titulo</Text>
 * </Card>
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Componente reutilizable para crear tarjetas dentro de la aplicacion
 */
export default function Card({ title = "", children }) {
    return (
        <View style={styles.card}>
            {/* Si existe un titulo, se muestra dentro de la tarjeta */}
            {title && (
                <Text style={styles.title}>
                    {title}
                </Text>
            )}

            {/* Contenedor donde se muestra el contenido interno */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

/**
 * Estilos locales del componente Card
 *
 * Nota:
 * Estos estilos quedan locales de forma temporal.
 * Cuando exista el theme global, los colores y fuentes pueden importarse desde ahi.
 */
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#dee2e6",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#212529",
        marginBottom: 10
    },

    content: {
        gap: 10
    }
});