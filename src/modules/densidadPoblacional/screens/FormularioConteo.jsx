/**
 * ============================================================
 * SCREEN FORMULARIOCONTEO
 * ============================================================
 *
 * Formulario de datos de conteo (camarones, tiros de atarraya,
 * area de la atarraya, promedio por tiro, supervivencia y notas)
 * dentro del modulo de Densidad Poblacional.
 *
 * Funcionalidad:
 * - Recibe todo su estado como props (desde useDensidadPoblacional,
 *   via densidadPoblacionalScreen -> DatosConteo) en vez de crear
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
 *   en espanol); ahora es "Supervivencia".
 *
 * Props principales:
 * - numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro,
 *   supervivencia, notasConteo: valores actuales.
 * - setNumeroCamarones, setTirosAtarraya, setAreaAtarraya,
 *   setPromedioPorTiro, setSupervivencia, setNotasConteo: setters.
 * - submitted / errores: estado de validacion.
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
import NumberInput from "../../../shared/components/NumberInput";

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
  return (
    <>
      <Input
        label="Total de camarones contados"
        placeholder="Ej: 150"
        value={numeroCamarones}
        onChangeText={(v) => setNumeroCamarones(v.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        maxLength={6}
        required
        submitted={submitted}
        error={submitted ? (errores.numeroCamarones || "") : ""}
      />

      <NumberInput
        label="Tiros de atarraya"
        value={tirosAtarraya}
        min={1}
        max={20}
        onChangeText={setTirosAtarraya}
        required
        submitted={submitted}
        error={submitted ? (errores.tirosAtarraya || "") : ""}
      />

      <Select
        label="Área de la atarraya"
        value={areaAtarraya}
        onChange={setAreaAtarraya}
        placeholder="Seleccionar área"
        options={[
          { label: "2.5 m²", value: "2.5" },
          { label: "3.5 m²", value: "3.5" },
          { label: "4.5 m²", value: "4.5" },
          { label: "5.5 m²", value: "5.5" },
        ]}
        required
        submitted={submitted}
        error={submitted ? (errores.areaAtarraya || "") : ""}
      />

      <Input
        label="Promedio por tiro"
        placeholder="Ej: 12"
        value={promedioPorTiro}
        onChangeText={(v) => setPromedioPorTiro(v.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
        maxLength={6}
        required
        submitted={submitted}
        error={submitted ? (errores.promedioPorTiro || "") : ""}
      />

      <Input
        label="Supervivencia (%)"
        placeholder="Ej: 85"
        value={supervivencia}
        onChangeText={(v) => {
          // Solo valores enteros de 0 a 100
          let valor = v.replace(/[^0-9]/g, "");
          // Evitar ceros infinitos al inicio
          valor = valor.replace(/^0+(?=\d)/, "");
          // Limitar máximo a 100
          if (Number(valor) > 100) {valor = "100";}
          setSupervivencia(valor);
        }}
        keyboardType="number-pad"
        maxLength={3}
        required
        submitted={submitted}
        error={submitted ? (errores.supervivencia || "") : ""}
      />

      <Input
        label="Notas o comentarios del conteo"
        placeholder="Ej: Agua turbia, buena visibilidad de red"
        value={notasConteo}
        onChangeText={setNotasConteo}
        multiline
      />
    </>
  );
}
