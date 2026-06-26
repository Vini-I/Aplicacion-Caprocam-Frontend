import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";

import { COLORS } from "../../theme/colors";

/**
 * ============================================================
 * COMPONENTE ICONS
 * ============================================================
 *
 * Componente reutilizable para mostrar iconos centralizados
 * desde theme/icons.js.
 *
 * Evita que la aplicacion se caiga si un icono no existe.
 */

const libraries = {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Octicons,
  AntDesign,
  Entypo,
  Feather,
};

export default function Icon({ icon, size = 24, color = COLORS.black, style }) {
  if (!icon) {
    console.error("Icono no encontrado en theme/icons.js");
    return null;
  }

  if (!icon.provider) {
    console.error("El icono no tiene provider definido");
    return null;
  }

  const IconComponent = libraries[icon.provider];

  if (!IconComponent) {
    console.error("Libreria de iconos no encontrada");
    return null;
  }

  return (
    <IconComponent name={icon.name} size={size} color={color} style={style} />
  );
}
