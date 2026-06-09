/**
 * ============================================================
 * COMPONENTE BUTTON
 * ============================================================
 *
 * Este componente se utiliza para mostrar un boton reutilizable
 * dentro de la aplicacion.
 *
 * Permite:
 * - Mostrar un texto dentro del boton
 * - Ejecutar una funcion al presionarlo
 * - Cambiar el estilo del boton segun el tipo seleccionado
 *
 * ---
 * PARAMETROS
 * ---
 *
 * title
 * Texto que se mostrara dentro del boton.
 *
 * Ejemplo:
 * <Button title="Guardar" />
 *
 * ---
 *
 * onPress
 * Funcion que se ejecuta cuando el usuario presiona el boton.
 *
 * Ejemplo:
 * <Button title="Guardar" onPress={guardarDatos} />
 *
 * ---
 *
 * type
 * Define el estilo visual del boton.
 *
 * Valores posibles:
 * "primary"
 * "secondary"
 *
 * Valor por defecto: "primary"
 *
 * Ejemplo:
 * <Button title="Cancelar" type="secondary" />
 *
 * ============================================================
 * EJEMPLOS RAPIDOS
 * ============================================================
 *
 * <Button title="Guardar" onPress={guardarDatos} />
 *
 * <Button title="Cancelar" type="secondary" onPress={cancelar} />
 */

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

/**
 * Componente reutilizable para mostrar botones dentro de la aplicacion
 */
export default function Button({
    title,
    onPress,
    type = "primary"
}) {
    return (
        <TouchableOpacity
            style={[
                styles.button,

                // Si el tipo del boton es secondary, se aplica el estilo secundario
                type === "secondary" && styles.secondary
            ]}
            onPress={onPress}
        >
            {/* Texto visible dentro del boton */}
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

/**
 * Estilos locales del componente Button
 *
 * Nota:
 * Estos estilos quedan locales de forma temporal.
 * Cuando exista el theme global, los colores y fuentes pueden importarse desde ahi.
 */
const styles = StyleSheet.create({
    button: {
        backgroundColor: "#0d6efd",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8
    },

    secondary: {
        backgroundColor: "#6c757d"
    },

    text: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600"
    }
});