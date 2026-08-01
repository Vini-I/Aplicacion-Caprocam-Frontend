/**
 * ============================================================
 * COMPONENTE DE ENCABEZADO Y NAVEGACIÓN
 * ============================================================
 *
 * Presenta el encabezado principal de CAPROCAM y proporciona
 * las opciones necesarias para navegar entre las diferentes
 * secciones de la página.
 *
 * Funcionalidad:
 * - Muestra el nombre de CAPROCAM como enlace al inicio.
 * - Permite navegar a las secciones de información, servicios,
 *   agremiados y contacto.
 * - Incluye un menú desplegable para dispositivos móviles.
 * - Cierra automáticamente el menú después de seleccionar una sección.
 * - Proporciona el botón de inicio de sesión con el ícono de camarón.
 * - Adapta la distribución del encabezado según el tamaño de pantalla.
 */

import { Pressable, Text, View } from "react-native";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/LandingStyle";

function NavItem({ texto, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.navItem,
        hovered && styles.navItemHover,
        pressed && styles.navItemPressed,
      ]}
    >
      <Text style={styles.navItemText}>{texto}</Text>
    </Pressable>
  );
}

export default function LandingHeader({
  esMovil,
  menuAbierto,
  alternarMenu,
  cerrarMenu,
  irAlInicio,
  irASeccion,
  iniciarSesion,
}) {
  function navegarA(nombre) {
    irASeccion(nombre);

    if (esMovil === true) {
      cerrarMenu();
    }
  }

  return (
    <View style={styles.header}>
      <View
        style={[
          styles.headerInner,
          esMovil && styles.headerInnerMobile,
        ]}
      >
        {esMovil && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menú de navegación"
            onPress={alternarMenu}
            style={styles.menuButton}
          >
            <Icon
              icon={ICONS.menu}
              size={27}
              color={COLORS.primary}
            />
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={irAlInicio}
        >
          <Text style={styles.brandText}>CAPROCAM</Text>
        </Pressable>
        <View
          style={[
            styles.nav,
            esMovil && styles.navMobile,
            esMovil && menuAbierto && styles.navMobileOpen,
          ]}
        >
          <NavItem
            texto="Quienes somos"
            onPress={() => navegarA("quienes")}
          />
          <NavItem
            texto="Que hacemos"
            onPress={() => navegarA("servicios")}
          />
          <NavItem
            texto="Agremiados"
            onPress={() => navegarA("agremiados")}
          />
          <NavItem
            texto="Contacto"
            onPress={() => navegarA("contacto")}
          />
        </View>
        <Button
          variant="primary"
          onPress={iniciarSesion}
          style={[
            styles.loginButton,
            esMovil && styles.loginButtonMobile,
          ]}
        >
          <View style={styles.buttonContent}>
            <Icon
              icon={ICONS.shrimp}
              size={16}
              color={COLORS.white}
            />
            <Text style={styles.loginButtonText}>
              Iniciar sesión
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
