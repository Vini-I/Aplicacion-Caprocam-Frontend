/**
 * ============================================================
 * SCREEN INFORMACIONESTANQUE
 * ============================================================
 *
 * Formulario de finca, estanque y datos base del estanque
 * (siembra por metro cuadrado y area) usados para calcular la densidad
 * poblacional.
 *
 * Funcionalidad:
 * - Corrige un bug funcional: los campos "Cantidad de siembra
 *   por metro cuadrado" y "Tamano del area del estanque" eran <Input> sin
 *   value ni onChangeText (no capturaban nada). Ahora usan el
 *   estado siembraPorM2/areaEstanque agregado a
 *   hooks/useDatosConteo.js y recibido aqui como props desde la
 *   screen (a traves de useDensidadPoblacional).
 * - Usa la prop nativa `label` de Select/Input en vez de <Text>
 *   manuales, para poder agregar el asterisco de forma consistente.
 * - Aplica el contrato de campos obligatorios (asterisco + borde
 *   rojo + mensaje de error tras submitted) a: Finca, Estanque,
 *   siembraPorM2 y areaEstanque (obligatorios por defecto, ya que
 *   son necesarios para calcular la densidad poblacional).
 *
 * Props principales:
 * - finca, estanque, setFinca, setEstanque, fincas, estanques.
 * - siembraPorM2, setSiembraPorM2, areaEstanque, setAreaEstanque.
 * - submitted / errores: estado de validacion.
 *
 * Ejemplo:
 * <InformacionEstanque
 *   finca={finca}
 *   estanque={estanque}
 *   setFinca={setFinca}
 *   setEstanque={setEstanque}
 *   fincas={fincas}
 *   estanques={estanques}
 *   siembraPorM2={siembraPorM2}
 *   setSiembraPorM2={setSiembraPorM2}
 *   areaEstanque={areaEstanque}
 *   setAreaEstanque={setAreaEstanque}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */
import { View } from "react-native";
import React from "react";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/DensidadPoblacionalStyles";

export default function InformacionEstanque({
  finca,
  estanque,
  setFinca,
  setEstanque,
  fincas,
  estanques,
  siembraPorM2,
  setSiembraPorM2,
  areaEstanque,
  setAreaEstanque,
  submitted = false,
  errores = {},
}) {
  return (
    <View>
    <Card>
      <View style={styles.sectionTitleRow}>
        <Icon icon={ICONS.water} size={18} color={COLORS.primary} style={styles.sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
           Finca / Estanque
          </Text>
      </View>
      <Select
        label="Finca"
        placeholder="Seleccione una finca"
        options={fincas}
        value={finca}
        onChange={setFinca}
        required
        submitted={submitted}
        error={submitted ? (errores.finca || "") : ""}
      />

      <Select
        label="Estanque"
        placeholder="Seleccione un estanque"
        options={estanques}
        value={estanque}
        onChange={setEstanque}
        required
        submitted={submitted}
        error={submitted ? (errores.estanque || "") : ""}
      />

      <Input
        label="Cantidad de siembra por m² "
        placeholder="Ej: 25"
        value={siembraPorM2}
        onChangeText={(v) => setSiembraPorM2(v.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
        maxLength={6}
        required
        submitted={submitted}
        error={submitted ? (errores.siembraPorM2 || "") : ""}
      />

      <Input
        label="Tamaño del área del estanque"
        placeholder="Ej: 500"
        value={areaEstanque}
        onChangeText={(v) => setAreaEstanque(v.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
        maxLength={6}
        required
        submitted={submitted}
        error={submitted ? (errores.areaEstanque || "") : ""}
      />
    </Card>
    </View>
  );
}

