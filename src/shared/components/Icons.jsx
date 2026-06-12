/**
 * ============================================================
 * COMPONENTE ICONS
 * ============================================================
 *
 * Este componente se utiliza para mostrar iconos
 * reutilizable dentro de la aplicacion.
 *
 * Permite:
 * - Utilizar los iconos estandarizados en incons.js
 * - Cambiar tamaño, color y estilo del icono
 * - Mostrar un texto de librería no encontrada si se digita de forma erronea el nombre
 * ---
 * PARAMETROS
 * ---
 *
 * icon
 * -Es el nombre del icono, se puede buscar en icons.js.
 *
 * size
 * -Es el tamaño del icono
 * 
 * color
 * -Son los colores, en la mayoría de casos se utiliza en black.
 * 
 * style
 * -Permite modificar la hoja de estilos del componente
 *
 * Ejemplo:
 * 
 * import Icon from "./src/shared/components/Icons";
 * import { ICONS } from "./src/theme/icons";
 * 
 *  <Icon
 *      icon={ICONS.morningSun}
 *      size={40}
 *      color="black"
 *  />   
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from "../../theme/colors";

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
  Feather
};

export default function Icon({
  icon,
  size = 24,
  color = COLORS.black,
  style
}) {
  const IconComponent = libraries[icon.provider];

    if (!IconComponent) {
    console.error(
      "Librería de iconos no encontrada: ${icon.provider}"
    );
    return null;
  }

  return (
    <IconComponent
      name={icon.name}
      size={size}
      color={color}
      style={style}
    />
  );
}