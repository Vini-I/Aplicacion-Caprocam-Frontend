/**
 * ============================================================
 * SCREEN INFORMACIONESTANQUE
 * ============================================================
 *
 * Formulario de finca, estanque y datos base del estanque
 * (siembra por m² y área) usados para calcular la densidad
 * poblacional.
 *
 * Funcionalidad:
 * - Corrige un bug funcional: los campos "Cantidad de siembra
 *   por m²" y "Tamaño del área del estanque" eran <Input> sin
 *   value ni onChangeText (no capturaban nada). Ahora usan el
 *   estado siembraPorM2/areaEstanque agregado a
 *   hooks/useDatosConteo.js y recibido aquí como props desde la
 *   screen (a través de useDensidadPoblacional).
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
 * - submitted / errores: estado de validación.
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

import React from "react";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };
const errorTextStyle = { marginTop: -6, marginBottom: 8, marginLeft: 2 };

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
  const invalidoFinca = submitted && !!errores.finca;
  const invalidoEstanque = submitted && !!errores.estanque;
  const invalidoSiembraPorM2 = submitted && !!errores.siembraPorM2;
  const invalidoAreaEstanque = submitted && !!errores.areaEstanque;

  return (
    <Card>
      <Select
        label="Finca *"
        placeholder="Seleccione una finca"
        options={fincas}
        value={finca}
        onChange={setFinca}
        selectStyle={invalidoFinca ? bordeError : null}
      />
      {invalidoFinca && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.finca}
        </Text>
      )}

      <Select
        label="Estanque *"
        placeholder="Seleccione un estanque"
        options={estanques}
        value={estanque}
        onChange={setEstanque}
        selectStyle={invalidoEstanque ? bordeError : null}
      />
      {invalidoEstanque && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.estanque}
        </Text>
      )}

      <Input
        label="Cantidad de siembra por m² *"
        placeholder="Siembra"
        value={siembraPorM2}
        onChangeText={setSiembraPorM2}
        keyboardType="numeric"
        style={invalidoSiembraPorM2 ? bordeError : null}
      />
      {invalidoSiembraPorM2 && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.siembraPorM2}
        </Text>
      )}

      <Input
        label="Tamaño del área del estanque *"
        placeholder="Área"
        value={areaEstanque}
        onChangeText={setAreaEstanque}
        keyboardType="numeric"
        style={invalidoAreaEstanque ? bordeError : null}
      />
      {invalidoAreaEstanque && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.areaEstanque}
        </Text>
      )}
    </Card>
  );
}
