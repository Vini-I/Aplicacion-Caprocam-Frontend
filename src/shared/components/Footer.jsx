/**
 * IMPORTANTE:
 * Importar el componente con:
 * * import Footer from "../../../shared/components/Footer.jsx";
 * * ============================================================
 * COMPONENTE FOOTER
 * ============================================================
 * * Este componente muestra una barra en la parte inferior
 * de la pantalla.
 * * Puede utilizarse de dos formas:
 * * 1. Como menú de navegación inferior (tabs).
 * 2. Como contenedor de información personalizada.
 * * ---
 * MODO 1: MENÚ DE NAVEGACIÓN
 * ---
 * * Para este modo se utiliza el parámetro "items".
 * Cada elemento representa una opción del menú.
 * * ---
 * * items
 * Lista de opciones que aparecerán en el Footer.
 * * Cada opción debe contener:
 * * key:
 * Identificador único.
 * * label:
 * Texto que se mostrará.
 * * onPress:
 * Función que se ejecutará al presionar la opción.
 * * icon (opcional):
 * Icono mostrado encima del texto.
 * * badge (opcional):
 * Número o texto para mostrar notificaciones.
 * * Ejemplo:
 * * items={[
 * {
 * key: "inicio",
 * label: "Inicio",
 * onPress: () => {}
 * },
 * {
 * key: "usuarios",
 * label: "Usuarios",
 * onPress: () => {},
 * badge: 5
 * }
 * ]}
 * * ---
 * * activeKey
 * Indica cuál opción está seleccionada actualmente.
 * Debe coincidir con uno de los valores "key" definidos dentro de items.
 * * Ejemplo:
 * activeKey="inicio"
 * * ---
 * * showLabels
 * Define si se mostrarán los nombres debajo de los iconos.
 * * Valores:
 * true  = Mostrar nombres
 * false = Ocultar nombres
 * * Valor por defecto:
 * true
 * * ---
 * MODO 2: CONTENIDO PERSONALIZADO
 * ---
 * * En lugar de utilizar items, se pueden utilizar las siguientes posiciones:
 * - left
 * - center
 * - right
 * * Esto permite mostrar cualquier contenido personalizado.
 * * Ejemplo:
 * <Footer
 * left={<Text>CAPROCAM</Text>}
 * right={<Text>v1.0</Text>}
 * />
 * * ---
 * * left
 * Contenido que aparecerá a la izquierda.
 * * ---
 * * center
 * Contenido que aparecerá en el centro.
 * * ---
 * * right
 * Contenido que aparecerá a la derecha.
 * * ---
 * * variant
 * Cambia la apariencia general del Footer.
 * * Valores posibles:
 * "light" = Fondo claro
 * "dark"  = Fondo oscuro
 * * Valor por defecto:
 * "light"
 * * ---
 * * backgroundColor
 * Permite personalizar el color de fondo.
 * * Ejemplo:
 * backgroundColor="#198754"
 * * ---
 * * accentColor
 * Color utilizado para resaltar la opción seleccionada.
 * * Ejemplo:
 * accentColor="#0d6efd"
 * * ---
 * * showTopBorder
 * Muestra una línea divisoria en la parte superior del Footer.
 * * Valores:
 * true
 * false
 * * Valor por defecto:
 * true
 * * ---
 * * style
 * Permite agregar estilos personalizados al Footer.
 * * ---
 * * itemStyle
 * Permite agregar estilos personalizados a cada elemento del menú.
 * * ============================================================
 * EJEMPLO 1: FOOTER DE NAVEGACIÓN
 * ============================================================
 * * <Footer
 * activeKey="inicio"
 * items={[
 * {
 * key: "inicio",
 * label: "Inicio",
 * onPress: () => {}
 * },
 * {
 * key: "usuarios",
 * label: "Usuarios",
 * onPress: () => {},
 * badge: 2
 * }
 * ]}
 * />
 * * ============================================================
 * EJEMPLO 2: FOOTER PERSONALIZADO
 * ============================================================
 * * <Footer
 * left={<Text>CAPROCAM</Text>}
 * center={<Text>Sistema de Gestión</Text>}
 * right={<Text>v1.0</Text>}
 * />
 * * ============================================================
 * NOTAS
 * ============================================================
 * * * activeKey debe coincidir con uno de los key definidos dentro de items.
 * * badge es opcional y sirve para mostrar cantidades o notificaciones.
 * * Todos los elementos de items deben tener un key diferente.
 * * Si se utilizan left, center o right, el Footer cambia automáticamente al modo personalizado.
 * * Se recomienda utilizar:
 * - items -> Para navegación.
 * - left/center/right -> Para mostrar información.
 */


import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Design tokens ────────────────────────────────────────────
const TOKENS = {
  light: {
    background: '#ffffff',
    border: '#dee2e6',
    labelColor: '#6c757d',
    activeColor: '#0d6efd',
    badgeBg: '#dc3545',
    badgeText: '#ffffff',
  },
  dark: {
    background: '#212529',
    border: '#343a40',
    labelColor: '#adb5bd',
    activeColor: '#6ea8fe',
    badgeBg: '#dc3545',
    badgeText: '#ffffff',
  },
};

const FOOTER_HEIGHT = 56;

// ─── Component ────────────────────────────────────────────────
export default function Footer({
  items = [],
  activeKey,
  variant = 'light',
  backgroundColor,
  accentColor,
  showLabels = true,
  showTopBorder = true,
  left,
  center,
  right,
  style,
  itemStyle,
}) {
  // Safe-area bottom padding (home indicator / gesture bar)
  // Falls back to 0 if react-native-safe-area-context is not installed
  let bottomInset = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const insets = useSafeAreaInsets();
    bottomInset = insets.bottom;
  } catch (_) {
    bottomInset = Platform.OS === 'ios' ? 20 : 0;
  }

  const t = TOKENS[variant] ?? TOKENS.light;
  const bg = backgroundColor ?? t.background;
  const accent = accentColor ?? t.activeColor;

  // ── Custom slot layout (left / center / right) ──────────────
  const hasCustomSlots = left || center || right;

  if (hasCustomSlots) {
    return (
      <View
        style={[
          styles.bar,
          { backgroundColor: bg, paddingBottom: bottomInset },
          showTopBorder && { borderTopWidth: 1, borderTopColor: t.border },
          style,
        ]}
      >
        <View style={styles.slotLeft}>{left ?? null}</View>
        <View style={styles.slotCenter}>{center ?? null}</View>
        <View style={styles.slotRight}>{right ?? null}</View>
      </View>
    );
  }

  // ── Tab-bar layout ──────────────────────────────────────────
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: bg, paddingBottom: bottomInset },
        showTopBorder && { borderTopWidth: 1, borderTopColor: t.border },
        style,
      ]}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const color = isActive ? accent : t.labelColor;

        return (
          <TouchableOpacity
            key={item.key}
            onPress={item.onPress}
            style={[styles.tabItem, itemStyle]}
            activeOpacity={0.7}
          >
            {/* Icon + badge */}
            {item.icon && (
              <View style={styles.iconWrapper}>
                {item.icon}
                {item.badge !== undefined && (
                  <View style={[styles.badge, { backgroundColor: t.badgeBg }]}>
                    <Text style={[styles.badgeText, { color: t.badgeText }]}>
                      {item.badge}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Label */}
            {showLabels && (
              <Text
                style={[styles.tabLabel, { color }, isActive && styles.tabLabelActive]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            )}

            {/* Active dot */}
            {isActive && (
              <View style={[styles.activeDot, { backgroundColor: accent }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: FOOTER_HEIGHT,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  // Tab items
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 3,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    top: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Custom slot layout
  slotLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  slotCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 4,
  },
});
