/**
 * ============================================================
 * COMPONENTE TITLE
 * ============================================================
 * * Este componente se utiliza para mostrar títulos y subtítulos dentro de la aplicación.
 * * Permite cambiar:
 * - Tamaño del título
 * - Color
 * - Alineación
 * - Línea decorativa debajo del texto
 * - Cantidad máxima de líneas
 * * ---
 * PARÁMETROS
 * ---
 * * children
 * Texto o contenido que se mostrará.
 * * Ejemplo:
 * <Title>Bienvenido</Title>
 * * ---
 * * level
 * Define el tamaño del título.
 * * Valores posibles:
 * 1 = Muy grande
 * 2 = Grande
 * 3 = Mediano
 * 4 = Normal
 * 5 = Pequeño
 * 6 = Muy pequeño
 * * Valor por defecto: 1
 * * Ejemplo:
 * <Title level={3}>Usuarios</Title>
 * * ---
 * * color
 * Color del texto.
 * * Ejemplo:
 * <Title color="#198754">
 * Activo
 * </Title>
 * * ---
 * * align
 * Alineación del texto.
 * * Valores posibles:
 * "left"
 * "center"
 * "right"
 * * Valor por defecto: "left"
 * * Ejemplo:
 * <Title align="center">
 * Menú Principal
 * </Title>
 * * ---
 * * underline
 * Muestra una línea debajo del título.
 * * Valor por defecto: false
 * * Ejemplo:
 * <Title underline>
 * Inventario
 * </Title>
 * * ---
 * * underlineColor
 * Color de la línea decorativa.
 * * ---
 * * underlineWidth
 * Ancho de la línea decorativa.
 * * ---
 * * muted
 * Muestra el texto en color gris.
 * * Valor por defecto: false
 * * Ejemplo:
 * <Title muted>
 * Información adicional
 * </Title>
 * * ---
 * * truncate
 * Si el texto es muy largo, lo corta y agrega "...".
 * * Valor por defecto: false
 * * ---
 * * numberOfLines
 * Cantidad máxima de líneas permitidas antes de cortar el texto.
 * * Ejemplo:
 * <Title numberOfLines={2}>
 * Texto muy largo...
 * </Title>
 * * ---
 * * style
 * Permite agregar estilos personalizados al texto.
 * * ---
 * * containerStyle
 * Permite agregar estilos personalizados al contenedor.
 * * ============================================================
 * EJEMPLOS RÁPIDOS
 * ============================================================
 * * <Title level={1}>
 * Bienvenido
 * </Title>
 * * <Title level={3} underline align="center">
 * Gestión de Usuarios
 * </Title>
 * * <Title level={5} muted>
 * Información adicional
 * </Title>
 */


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─── Type scale (mirrors Bootstrap's heading sizes) ───────────
const SCALE = {
  1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  5: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  6: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
};

const MUTED_COLOR    = '#6c757d';
const DEFAULT_COLOR  = '#212529';
const ACCENT_COLOR   = '#0d6efd';

// ─── Component ────────────────────────────────────────────────
export default function Title({
  children,
  level          = 1,
  color,
  align          = 'left',
  underline      = false,
  underlineColor = ACCENT_COLOR,
  underlineWidth = 40,
  muted          = false,
  truncate       = false,
  numberOfLines,
  style,
  containerStyle,
}) {
  const scale     = SCALE[level] ?? SCALE[1];
  const textColor = muted ? MUTED_COLOR : (color ?? DEFAULT_COLOR);

  const resolvedLines = truncate
    ? 1
    : (numberOfLines ?? undefined);

  // Align the underline bar to match text alignment
  const underlineAlign =
    align === 'center' ? 'center'
    : align === 'right' ? 'flex-end'
    : 'flex-start';

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          scale,
          { color: textColor, textAlign: align },
          style,
        ]}
        numberOfLines={resolvedLines}
        ellipsizeMode={resolvedLines ? 'tail' : undefined}
      >
        {children}
      </Text>

      {underline && (
        <View style={[styles.underlineWrapper, { justifyContent: underlineAlign }]}>
          <View
            style={[
              styles.underlineLine,
              { width: underlineWidth, backgroundColor: underlineColor },
            ]}
          />
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    // No default margin — let the consumer control spacing
  },
  underlineWrapper: {
    flexDirection: 'row',
    marginTop:     6,
  },
  underlineLine: {
    height:       3,
    borderRadius: 2,
  },
});
