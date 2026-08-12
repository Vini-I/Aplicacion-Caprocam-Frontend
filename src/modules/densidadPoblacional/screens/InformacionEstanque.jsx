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
 *   screen (a traves de useDensidadPoblacional). Ambos valores son
 *   de solo lectura y provienen del estanque seleccionado.
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
  cargandoDatosBase = false,
  submitted = false,
  errores = {},
}) {
  /*
    Un solo mensaje para los dos campos que el sistema carga
    automaticamente al seleccionar el estanque.
  */
  const ayudaAutocompletado = cargandoDatosBase
    ? "Cargando los datos del estanque..."
    : estanque
      ? "✓ Datos cargados automáticamente desde el estanque."
      : "";

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

      {/*
        Este campo y el del área se completan solos al elegir el
        estanque (ver hooks/useDatosBaseEstanque.js): la siembra por
        m² sale de una siembra real registrada para el estanque y el
        área sale de su largo × ancho. Ambos quedan bloqueados para
        evitar que el usuario reemplace los datos reales del estanque.
      */}
      <Input
        label="Cantidad de siembra por m² "
        placeholder="Se completa al elegir el estanque"
        editable={false}
        value={siembraPorM2}
        keyboardType="numeric"
        maxLength={6}
        required
        submitted={submitted}
        error={submitted ? (errores.siembraPorM2 || "") : ""}
      />

      {/*
        La unidad ahora va explicita en la etiqueta. La formula del
        documento multiplica esta area por 10 000, o sea espera
        HECTAREAS; antes el campo no declaraba unidad y su
        placeholder ("Ej: 500") sugeria metros cuadrados, lo que
        daba una poblacion total 10 000 veces mas grande.
      */}
      <Input
        label="Área del estanque (hectáreas)"
        placeholder="Se completa al elegir el estanque"
        editable={false}
        value={areaEstanque}
        keyboardType="numeric"
        maxLength={6}
        required
        submitted={submitted}
        error={submitted ? (errores.areaEstanque || "") : ""}
      />

      {ayudaAutocompletado ? (
        <Text
          size={13}
          color={COLORS.textTertiary}
          style={styles.ayudaAutocompletado}
        >
          {ayudaAutocompletado}
        </Text>
      ) : null}
    </Card>
    </View>
  );
}



