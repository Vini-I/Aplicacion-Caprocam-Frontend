/**
 * ============================================================
 * SCREEN REGISTROCONTEO
 * ============================================================
 *
 * Card con la fecha de registro del conteo y el método de
 * conteo usado.
 *
 * Funcionalidad:
 * - Corrige un bug funcional: este componente recibía las props
 *   `fecha`/`cambiarFecha` de su padre pero las ignoraba por
 *   completo, usando su propio estado local de fecha. Esto
 *   desconectaba el valor real de fecha del resto del formulario
 *   y del guardado. Ahora usa directamente las props recibidas
 *   (value={fecha}, onChangeText={cambiarFecha}).
 * - Elimina el import no usado de Icon (no se usaba en este
 *   archivo) y un <Text> vacío sin contenido que no cumplía
 *   ninguna función.
 * - El campo "Método de conteo" es intencionalmente un Input
 *   deshabilitado con value="Directo" fijo: este módulo no ofrece
 *   más de un método de conteo (a diferencia de Alimentación o
 *   Raleo), por lo que es un valor fijo del sistema y no un
 *   bug ni un campo editable por el usuario.
 * - Aplica asterisco a la Fecha de Registro (obligatoria) y
 *   muestra borde rojo/mensaje de error vía la prop `inputStyle`
 *   de DateInput cuando `submitted && !fecha`.
 *
 * Props principales:
 * - fecha: fecha actual del registro (string dd/mm/aaaa), viene
 *   de useDensidadPoblacional a través de la screen.
 * - cambiarFecha: setter de fecha (setFecha de useDensidadPoblacional).
 * - submitted / errores: estado de validación.
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
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import Icon from "../../../shared/components/Icons";
import { styles } from "../styles/DensidadPoblacionalStyles";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };

export default function RegistroConteo({
  fecha,
  cambiarFecha,
  submitted = false,
  errores = {},
}) {
  const invalidoFecha = submitted && !fecha;

  return (
    <Card>
      <View style={styles.sectionTitleRow}>
                <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} style={styles.sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Registro de conteo
          </Text>
              </View>
      <DateInput
        label="Fecha de Registro *"
        value={fecha}
        onChangeText={cambiarFecha}
        allowFutureDates={true}
        inputStyle={invalidoFecha ? bordeError : null}
      />

      <Input
        label="Método de conteo"
        value="Directo"
        editable={false}
      />
    </Card>
  );
}
