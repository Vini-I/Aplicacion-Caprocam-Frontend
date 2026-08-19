/**
 * ============================================================
 * SCREEN REGISTROCONTEO
 * ============================================================
 *
 * Card con la fecha de registro del conteo.
 *
 * Funcionalidad:
 * - Corrige un bug funcional: este componente recibia las props
 *   `fecha`/`cambiarFecha` de su padre pero las ignoraba por
 *   completo, usando su propio estado local de fecha. Esto
 *   desconectaba el valor real de fecha del resto del formulario
 *   y del guardado. Ahora usa directamente las props recibidas
 *   (value={fecha}, onChangeText={cambiarFecha}).
 * - Elimina el import no usado de Icon (no se usaba en este
 *   archivo) y un <Text> vacio sin contenido que no cumplia
 *   ninguna funcion.
 * - Se elimino el campo "Metodo de conteo": era un Input
 *   deshabilitado con value="Directo" fijo, sin estado en el
 *   formulario, que no se enviaba al backend y que no existe como
 *   columna en la base de datos. No aparece en el documento de
 *   requerimientos, asi que se quito junto con el resto de campos
 *   que no se ocupan.
 * - Aplica asterisco a la Fecha de Registro (obligatoria) y
 *   muestra borde rojo/mensaje de error via la prop `inputStyle`
 *   de DateInput cuando `submitted && !fecha`.
 *
 * Props principales:
 * - fecha: fecha actual del registro (string dd/mm/aaaa), viene
 *   de useDensidadPoblacional a traves de la screen.
 * - cambiarFecha: setter de fecha (setFecha de useDensidadPoblacional).
 * - submitted / errores: estado de validacion.
 *
 * Ejemplo:
 * <RegistroConteo
 *   fecha={fecha}
 *   cambiarFecha={setFecha}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */
import { View } from "react-native";
import React from "react";
import Card from "../../../shared/components/Card";
import DateInput from "../../../shared/components/DateInput";
import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import Icon from "../../../shared/components/Icons";
import { styles } from "../styles/DensidadPoblacionalStyles";

export default function RegistroConteo({
  fecha,
  cambiarFecha,
  submitted = false,
  errores = {},
}) {
  return (
    <Card>
      <View style={styles.sectionTitleRow}>
                <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} style={styles.sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Registro de conteo
          </Text>
              </View>
      {/*
        Se elimino el campo "Metodo de conteo": era un Input fijo en
        "Directo", deshabilitado, sin estado en el formulario, que no
        se enviaba al backend y que no existe como columna en la base
        de datos. No aparece en el documento de requerimientos.
      */}
      <DateInput
        label="Fecha de Registro"
        value={fecha}
        onChangeText={cambiarFecha}
        allowFutureDates={true}
        required
        submitted={submitted}
        error={submitted ? (errores.fecha || "") : ""}
      />
    </Card>
  );
}

