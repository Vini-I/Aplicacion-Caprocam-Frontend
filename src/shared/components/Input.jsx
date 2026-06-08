/**
 * ============================================================
 * COMPONENTE INPUT
 * ============================================================
 *
 * Este componente se utiliza para mostrar un campo de texto
 * reutilizable dentro de la aplicacion.
 *
 * Permite:
 * - Mostrar una etiqueta opcional encima del campo
 * - Recibir y mostrar un valor de texto
 * - Detectar cambios realizados por el usuario
 * - Mostrar un texto de ayuda cuando esta vacio
 *
 * ---
 * PARAMETROS
 * ---
 *
 * label
 * Texto que se mostrara como etiqueta del campo.
 *
 * Es opcional, si no se envia no se mostrara.
 *
 * Ejemplo:
 * <Input label="Nombre" />
 *
 * ---
 *
 * value
 * Valor actual que tiene el campo de texto.
 *
 * Permite controlar el contenido del input.
 *
 * Ejemplo:
 * <Input value={nombre} />
 *
 * ---
 *
 * onChangeText
 * Funcion que se ejecuta cada vez que el usuario escribe
 * o modifica el contenido del campo.
 *
 * Ejemplo:
 * <Input onChangeText={cambiarNombre} />
 *
 * ---
 *
 * placeholder
 * Texto de ayuda que aparece cuando el campo esta vacio.
 *
 * Ejemplo:
 * <Input placeholder="Ingrese su nombre" />
 *
 * ============================================================
 * EJEMPLOS RAPIDOS
 * ============================================================
 *
 * <Input
 *     label="Correo"
 *     value={correo}
 *     onChangeText={setCorreo}
 *     placeholder="correo@email.com"
 * />
 *
 * <Input
 *     label="Contrasena"
 *     placeholder="Ingrese contrasena"
 * />
 */

import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

/**
 * Componente reutilizable para crear campos de entrada
 */
export default function Input({
    label = "",
    value = "",
    onChangeText,
    placeholder = ""
}) {
    return (
        <View style={styles.container}>
            {/* Muestra la etiqueta solamente si existe un valor en label */}
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}

            {/* Campo donde el usuario escribe informacion */}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#adb5bd"
            />
        </View>
    );
}

/**
 * Estilos locales del componente Input
 *
 * Nota:
 * Estos estilos quedan locales de forma temporal.
 * Cuando exista el theme global, los colores y fuentes pueden importarse desde ahi.
 */
const styles = StyleSheet.create({
    container: {
        marginBottom: 12
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#212529",
        marginBottom: 6
    },

    input: {
        borderWidth: 1,
        borderColor: "#ced4da",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#212529",
        backgroundColor: "#ffffff"
    }
});