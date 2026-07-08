/**
 * ============================================================
 * SCREEN FORMULARIOCONTEO
 * ============================================================
 *
 * Formulario de datos de conteo (camarones, tiros de atarraya,
 * área de la atarraya, promedio por tiro, supervivencia y notas)
 * dentro del módulo de Densidad Poblacional.
 *
 * Funcionalidad:
 * - Recibe todo su estado como props (desde useDensidadPoblacional,
 *   vía densidadPoblacionalScreen -> DatosConteo) en vez de crear
 *   su propia instancia de useDatosConteo.
 * - Usa la prop nativa `label` de Input/Select/NumberInput en vez
 *   de <Text> manuales, lo que permite agregar el asterisco de
 *   forma consistente.
 * - Aplica el contrato de campos obligatorios (asterisco + borde
 *   rojo + mensaje de error tras submitted) a: numeroCamarones,
 *   tirosAtarraya, areaAtarraya, promedioPorTiro y supervivencia.
 *   notasConteo queda opcional: si el usuario no escribe nada,
 *   useDensidadPoblacional.js lo completa con "No hay notas"
 *   antes de guardar, en vez de bloquear el guardado.
 * - El campo antes se llamaba "Sobrevivencia" (palabra incorrecta
 *   en español); ahora es "Supervivencia".
 *
 * Props principales:
 * - numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro,
 *   supervivencia, notasConteo: valores actuales.
 * - setNumeroCamarones, setTirosAtarraya, setAreaAtarraya,
 *   setPromedioPorTiro, setSupervivencia, setNotasConteo: setters.
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
  supervivencia,
  setSupervivencia,
  notasConteo,
  setNotasConteo,
  submitted = false,
  errores = {},
}) {
  const invalidoNumeroCamarones = submitted && !!errores.numeroCamarones;
  const invalidoTirosAtarraya = submitted && !!errores.tirosAtarraya;
  const invalidoAreaAtarraya = submitted && !!errores.areaAtarraya;
  const invalidoPromedioPorTiro = submitted && !!errores.promedioPorTiro;
  const invalidoSupervivencia = submitted && !!errores.supervivencia;
  const invalidoNotasConteo = submitted && !!errores.notasConteo;

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
        label="Promedio por tiro *"
        placeholder="Promedio por tiro"
        value={promedioPorTiro}
        onChangeText={setPromedioPorTiro}
        style={invalidoPromedioPorTiro ? bordeError : null}
      />
      {invalidoPromedioPorTiro && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.promedioPorTiro}
        </Text>
      )}

      <Input
        label="Supervivencia *"
        placeholder="Supervivencia"
        value={supervivencia}
        onChangeText={setSupervivencia}
        style={invalidoSupervivencia ? bordeError : null}
      />
      {invalidoSupervivencia && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.supervivencia}
        </Text>
      )}

      <Input
        label="Notas o comentarios del conteo *"
        placeholder="Notas o comentarios del conteo"
        value={notasConteo}
        onChangeText={setNotasConteo}
        style={invalidoNotasConteo ? bordeError : null}
      />
      {invalidoNotasConteo && (
        <Text size={12} color={COLORS.error} style={errorTextStyle}>
          {errores.notasConteo}
        </Text>
      )}
    </>
  );
}
