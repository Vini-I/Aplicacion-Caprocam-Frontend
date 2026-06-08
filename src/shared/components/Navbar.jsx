/**
 * IMPORTANTE:
 * Importar el componente con:
 * * import Navbar from "../../../shared/components/Navbar.jsx";
 * * ============================================================
 * COMPONENTE NAVBAR
 * ============================================================
 * * Este componente muestra una barra de navegación en la parte
 * superior de la pantalla.
 * * Permite:
 * - Mostrar el nombre de la aplicación
 * - Mostrar opciones de navegación
 * - Resaltar la sección actual
 * - Mostrar iconos, notificaciones o botones adicionales
 * * ---
 * PARÁMETROS
 * ---
 * * brand
 * Nombre de la aplicación o contenido que se mostrará a la izquierda del Navbar.
 * * Ejemplo:
 * <Navbar brand="CAPROCAM" />
 * * ---
 * * brandOnPress
 * Función que se ejecuta cuando el usuario presiona el nombre de la aplicación.
 * * Ejemplo:
 * brandOnPress={() => navigation.navigate("Home")}
 * * ---
 * * items
 * Lista de opciones que aparecerán en el menú.
 * * Cada elemento debe contener:
 * * key:
 * Identificador único.
 * * label:
 * Texto que se mostrará.
 * * onPress:
 * Función que se ejecutará al presionar la opción.
 * * icon (opcional):
 * Icono que se mostrará junto al texto.
 * * badge (opcional):
 * Número o texto pequeño para mostrar notificaciones.
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
 * onPress: () => {}
 * }
 * ]}
 * * ---
 * * activeKey
 * Indica cuál opción del menú está seleccionada actualmente.
 * Debe coincidir con el "key" de uno de los elementos del arreglo items.
 * * Ejemplo:
 * activeKey="inicio"
 * * ---
 * * right
 * Permite agregar contenido al lado derecho del Navbar.
 * * Puede utilizarse para:
 * - Avatar del usuario
 * - Botón de perfil
 * - Notificaciones
 * - Configuración
 * * Ejemplo:
 * right={<Avatar />}
 * * ---
 * * variant
 * Cambia la apariencia general del Navbar.
 * * Valores posibles:
 * "light" = Fondo claro
 * "dark"  = Fondo oscuro
 * * Valor por defecto:
 * "light"
 * * ---
 * * backgroundColor
 * Permite personalizar el color de fondo del Navbar.
 * * Ejemplo:
 * backgroundColor="#198754"
 * * ---
 * * accentColor
 * Color utilizado para resaltar la opción seleccionada.
 * * Ejemplo:
 * accentColor="#0d6efd"
 * * ---
 * * style
 * Permite agregar estilos personalizados al contenedor principal del Navbar.
 * * ---
 * * itemStyle
 * Permite agregar estilos personalizados al texto de las opciones del menú.
 * * ============================================================
 * EJEMPLO COMPLETO
 * ============================================================
 * * <Navbar
 * brand="CAPROCAM"
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
 * NOTAS
 * ============================================================
 * * * activeKey debe coincidir con uno de los key definidos dentro de items.
 * * badge es opcional y sirve para mostrar cantidades o notificaciones.
 * * Si hay muchas opciones en items, el Navbar permite desplazarse horizontalmente automáticamente.
 * * Todos los elementos de items deben tener un key diferente.
 */


import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

// ─── Default design tokens (override via props) ───────────────
const TOKENS = {
  light: {
    background: '#ffffff',
    border: '#dee2e6',
    brandColor: '#212529',
    labelColor: '#495057',
    activeColor: '#0d6efd',      // Bootstrap primary
    badgeBg: '#dc3545',      // Bootstrap danger
    badgeText: '#ffffff',
  },
  dark: {
    background: '#212529',
    border: '#343a40',
    brandColor: '#f8f9fa',
    labelColor: '#adb5bd',
    activeColor: '#6ea8fe',
    badgeBg: '#dc3545',
    badgeText: '#ffffff',
  },
};

const NAVBAR_HEIGHT = 56;
const ANDROID_STATUS = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

// ─── Component ────────────────────────────────────────────────
export default function Navbar({
  brand = 'App',
  brandOnPress,
  items = [],
  activeKey,
  right,
  variant = 'light',
  backgroundColor,
  accentColor,
  style,
  itemStyle,
}) {
  const t = TOKENS[variant] ?? TOKENS.light;
  const bg = backgroundColor ?? t.background;
  const accent = accentColor ?? t.activeColor;

  return (
    <View style={[styles.wrapper, { paddingTop: ANDROID_STATUS }, style]}>
      <View style={[styles.bar, { backgroundColor: bg, borderBottomColor: t.border }]}>

        {/* Brand */}
        <TouchableOpacity
          onPress={brandOnPress}
          disabled={!brandOnPress}
          style={styles.brandContainer}
          activeOpacity={brandOnPress ? 0.7 : 1}
        >
          {typeof brand === 'string' ? (
            <Text style={[styles.brandText, { color: t.brandColor }]} numberOfLines={1}>
              {brand}
            </Text>
          ) : (
            brand
          )}
        </TouchableOpacity>

        {/* Nav items — scrollable so it handles many items gracefully */}
        {items.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsContainer}
          >
            {items.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={item.onPress}
                  style={styles.item}
                  activeOpacity={0.7}
                >
                  {/* Icon with optional badge */}
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
                  <Text
                    style={[
                      styles.itemLabel,
                      { color: isActive ? accent : t.labelColor },
                      isActive && styles.itemLabelActive,
                      itemStyle,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>

                  {/* Active underline */}
                  {isActive && (
                    <View style={[styles.activeBar, { backgroundColor: accent }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Right slot */}
        {right && <View style={styles.rightSlot}>{right}</View>}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
  },
  bar: {
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    elevation: 4,          // Android shadow
    shadowColor: '#000',     // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  // Brand
  brandContainer: {
    marginRight: 12,
    flexShrink: 0,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Items
  itemsContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    height: NAVBAR_HEIGHT,
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemLabelActive: {
    fontWeight: '700',
  },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 3,
    borderRadius: 2,
  },

  // Right slot
  rightSlot: {
    marginLeft: 'auto',
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
