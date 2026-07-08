/**
 * ============================================================
 * SCREEN FORMULARIOCONTEO
 * ============================================================
 *
 * Formulario de datos de conteo (camarones, tiros de atarraya,
 * área de la atarraya, promedio por tiro, sobrevivencia y notas)
 * dentro del módulo de Densidad Poblacional.
 *
 * Funcionalidad:
 * - Recibe todo su estado como props (desde useDensidadPoblacional,
 *   vía densidadPoblacionalScreen -> DatosConteo) en vez de crear
 *   su propia instancia de useDatosConteo. Antes existía un
 *   estado local duplicado `tiros` que se usaba en el NumberInput
 *   en vez de tirosAtarraya/setTirosAtarraya del hook, por lo que
 *   el valor real nunca se actualizaba; ahora el NumberInput usa
 *   directamente la prop tirosAtarraya/setTirosAtarraya.
 * - Usa la prop nativa `label` de Input/Select/NumberInput en vez
 *   de <Text> manuales, lo que permite agregar el asterisco de
 *   forma consistente. El label de NumberInput recibe un string
 *   simple (antes recibía un elemento <Text>, que NumberInput no
 *   soporta).
 * - Aplica el contrato de campos obligatorios (asterisco + borde
 *   rojo + mensaje de error tras submitted) a: numeroCamarones,
 *   tirosAtarraya y areaAtarraya. promedioPorTiro, sobrevivencia
 *   y notasConteo quedan opcionales.
 *
 * Props principales:
 * - numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro,
 *   sobrevivencia, notasConteo: valores actuales.
 * - setNumeroCamarones, setTirosAtarraya, setAreaAtarraya,
 *   setPromedioPorTiro, setSobrevivencia, setNotasConteo: setters.
 * - submitted / errores: estado de validación.
 *
 * Ejemplo:
 * <FormularioConteo
 *   numeroCamarones={numeroCamarones}
 *   setNumeroCamarones={setNumeroCamarones}
 *   tirosAtarraya={tirosAtarraya}
 *   setTirosAtarraya={setTirosAtarraya}
 *   areaAtarraya={areaAtarraya}
 *   setAreaAtarraya={setAreaAtarraya}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */

import React from "react";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import NumberInput from "../../../shared/components/NumberInput";
import { COLORS } from "../../../theme/colors";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };
const errorTextStyle = { marginTop: -6, marginBottom: 8, marginLeft: 2 };

export default function FormularioConteo({
  numeroCamarones,
  setNumeroCamarones,
  tirosAtarraya,
  setTirosAtarraya,
  areaAtarraya,
  setAreaAtarraya,
  promedioPorTiro,
  setPromedioPorTiro,
  sobrevivencia,
  setSobrevivencia,
  notasConteo,
  setNotasConteo,
  submitted = false,
  errores = {},
}) {
  const invalidoNumeroCamarones = submitted && !!errores.numeroCamarones;
  const invalidoTirosAtarraya = submitted && !!errores.tirosAtarraya;
  const invalidoAreaAtarraya = submitted && !!errores.areaAtarraya;

  return (
    <>
      <Input
        label="Total de camarones contados *"
        placeholder="Total de camarones contados"
        value={numeroCamarones}
        onChangeText={setNumeroCamarones}
        keyboardType="numeric"
        style={invalidoNumeroCamarones ? bordeError : null}
      />
      {invalidoNumeroCamarones && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.numeroCamarones}
        </Text>
      )}

      <NumberInput
        label="Tiros de atarraya *"
        value={tirosAtarraya}
        min={1}
        max={20}
        onChangeText={setTirosAtarraya}
        style={invalidoTirosAtarraya ? bordeError : null}
      />
      {invalidoTirosAtarraya && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.tirosAtarraya}
        </Text>
      )}

      <Select
        label="Área de la atarraya *"
        value={areaAtarraya}
        onChange={setAreaAtarraya}
        options={[
          { label: "2.5 m²", value: "2.5" },
          { label: "3.5 m²", value: "3.5" },
          { label: "4.5 m²", value: "4.5" },
          { label: "5.5 m²", value: "5.5" },
        ]}
        selectStyle={invalidoAreaAtarraya ? bordeError : null}
      />
      {invalidoAreaAtarraya && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.areaAtarraya}
        </Text>
      )}

      <Input
        label="Promedio por tiro"
        placeholder="Promedio por tiro"
        value={promedioPorTiro}
        onChangeText={setPromedioPorTiro}
      />

      <Input
        label="Sobrevivencia"
        placeholder="Sobrevivencia"
        value={sobrevivencia}
        onChangeText={setSobrevivencia}
      />

      <Input
        label="Notas o comentarios del conteo"
        placeholder="Notas o comentarios del conteo"
        value={notasConteo}
        onChangeText={setNotasConteo}
      />
    </>
  );
}
