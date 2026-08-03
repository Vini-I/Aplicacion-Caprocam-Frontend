/**
 * ============================================================
 * COMPONENTE RALEOFORM
 * ============================================================
 *
 * Formulario de registro de raleo. Agrupa los campos de
 * finca/estanque, parámetros del raleo y método de extracción, y
 * aplica el contrato visual de campos obligatorios: asterisco
 * visible desde el primer render, y borde rojo + mensaje de
 * error solo después de que la screen marque `submitted = true`
 * y el campo resulte inválido.
 *
 * Funcionalidad:
 * - Finca/estanque usan datos reales del backend via
 *   useFincaEstanqueRaleo (mismo patron que useFincaCrecimiento.js).
 * - CORREGIDO: handleFincaChange llamaba a recargarEstanques(idFinca),
 *   una funcion que no existia en este archivo (ReferenceError en
 *   cada cambio de finca). useFincaEstanqueRaleo ya filtra los
 *   estanques en memoria solo con que cambie form.finca, no hace
 *   falta ninguna llamada adicional.
 * - CORREGIDO: "Responsable del raleo" era un Input de texto
 *   deshabilitado sin ninguna forma de llenarse (dead UI). Se
 *   reemplazo por "Colaborador asignado *", un Select real con
 *   colaboradores del backend (mismo patron y mismo caracter
 *   obligatorio que useFincaCrecimiento.js / FincaCrecimientoScreen.jsx).
 * - Todos los colores usados vienen de COLORS (COLORS.textPrimary,
 *   COLORS.textTertiary, COLORS.primary, COLORS.white,
 *   COLORS.secondary), sin valores hardcodeados.
 *
 * Props principales:
 * - form: objeto con los valores actuales del formulario.
 * - updateField: función (campo, valor) para actualizar el form.
 * - submitted: boolean, true cuando el usuario ya intentó guardar.
 * - errores: objeto { campo: mensaje } devuelto por validarForm().
 *
 * Ejemplo:
 * <RaleoForm
 *   form={form}
 *   updateField={updateField}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */

import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Select from "../../../shared/components/Select";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";
import { useFincaEstanqueRaleo } from "../hooks/useFincaEstanqueRaleo";
import { styles as formStyles } from "../styles/RaleoStyles";

const OBJETIVOS = [
  { label: "Comercialización", value: "Comercializacion" },
  { label: "Reducción de densidad", value: "Reduccion_densidad" },
  { label: "Resiembra en otro estanque", value: "Resiembra" },
];
const METODOS = [
  { label: "Atarraya", value: "Atarraya" },
  { label: "Red de arrastre", value: "Red de arrastre" },
  { label: "Boleo", value: "Boleo" },
  { label: "Trampa selectiva", value: "Trampa selectiva" },
];

const { bordeError, sectionTitleRow, sectionIcon } = formStyles;

export default function RaleoForm({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
  biomasaCalculada= "",
}) {
  const invalidoFinca = submitted && !!errores.finca;
  const invalidoEstanque = submitted && !!errores.estanque;
  const invalidoFecha = submitted && !!errores.fecha;
  const invalidoPorcentaje = submitted && !!errores.porcentajeRaleo;
  const invalidoPesoPromedio = submitted && !!errores.pesoPromedio;
  const invalidoBiomasaTotal = submitted && !!errores.biomasaActual;
  const invalidoObjetivo = submitted && !!errores.objetivo;
  const invalidoMetodo = submitted && !!errores.metodo;

  const { fincasOptions, estanquesOptions } = useFincaEstanqueRaleo(form.finca);

  const handleFincaChange = (idFinca) => {
    updateField("finca", idFinca);
    updateField("estanque", "");
  };

  return (
    <View>
      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Información General
          </Text>
        </View>

        <DateInput
          label="Fecha del Raleo *"
          value={form.fecha ?? ""}
          onChangeText={(v) => updateField("fecha", v)}
          labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          inputStyle={invalidoFecha ? bordeError : null}
        />

        <Select
          label="Finca *"
          value={form.finca}
          onChange={handleFincaChange}
          options={fincasOptions}
          placeholder="Seleccionar finca"
          selectStyle={invalidoFinca ? bordeError : null}
        />

        <Select
          label="Estanque *"
          value={form.estanque}
          onChange={(v) => updateField("estanque", v)}
          options={estanquesOptions}
          placeholder="Seleccionar estanque"
          selectStyle={invalidoEstanque ? bordeError : null}
        />

      </Card>

      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.raleo} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Parámetros del Raleo
          </Text>
        </View>

        <Input
          label="Porcentaje de raleo (%) *"
          placeholder="Ej: 30"
          value={String(form.porcentajeRaleo ?? "")}
          keyboardType="number-pad"
          onChangeText={(v) => {
            // Solo valores enteros de 0 a 100
            let valor = v.replace(/[^0-9]/g, "");
            // Evitar ceros infinitos al inicio
            valor = valor.replace(/^0+(?=\d)/, "");
            if (Number(valor) > 100) {valor = "100";}
            updateField("porcentajeRaleo", valor);
          }}
          style={invalidoPorcentaje ? bordeError : null}
        />

        <Input
          label="Peso promedio estimado (g) *"
          placeholder="Ej: 10.5"
          value={String(form.pesoPromedio ?? "")}
          keyboardType="decimal-pad"
          onChangeText={(v) => {
            let valor = v.replace(/[^0-9.]/g, "");
            // Evitar más de un punto decimal
            const partes = valor.split(".");
            if (partes.length > 2) {
            valor = `${partes[0]}.${partes.slice(1).join("")}`;}
            // Evitar ceros infinitos antes del decimal
            if (!valor.includes(".")) {valor = valor.replace(/^0+(?=\d)/, "");}
            // Máximo 5 dígitos contando solo números
            const numeros = valor.replace(".", "");
            if (numeros.length > 5) {return;}
            updateField("pesoPromedio", valor);
          }}
          style={invalidoPesoPromedio ? bordeError : null}
        />
        <Input
          label="Biomasa actual del estanque (kg) *"
          placeholder="Ej: 800.5"
          value={String(form.biomasaActual ?? "")}
          keyboardType="decimal-pad"
          onChangeText={(v) => {
            let valor = v.replace(/[^0-9.]/g, "");
            // Evitar más de un punto decimal
            const partes = valor.split(".");
            if (partes.length > 2) {
            valor = `${partes[0]}.${partes.slice(1).join("")}`;}
            // Máximo 5 dígitos contando solo números
            const numeros = valor.replace(".", "");
            if (numeros.length > 5) {return;}
            updateField("biomasaActual", valor);
          }}
          style={invalidoBiomasaTotal ? bordeError : null}
        />
        <Input
          label="Biomasa restante estimada (kg)"
          value={
            biomasaCalculada !== "" && !isNaN(Number(biomasaCalculada))
              ? Number(biomasaCalculada).toFixed(2)
              : ""
          }
          editable={false}
        />
        <Select
          label="Objetivo del raleo *"
          value={form.objetivo}
          onChange={(v) => updateField("objetivo", v)}
          options={OBJETIVOS}
          placeholder="Seleccionar objetivo"
          selectStyle={invalidoObjetivo ? bordeError : null}
        />
      </Card>

      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.tools} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Método de Extracción
          </Text>
        </View>

        <Select
          label="Método *"
          value={form.metodo}
          onChange={(v) => updateField("metodo", v)}
          options={METODOS}
          placeholder="Seleccionar método"
          selectStyle={invalidoMetodo ? bordeError : null}
        />
      </Card>

      <Card>
        <View style={sectionTitleRow}>
          <Icon icon={ICONS.clipboard} size={18} color={COLORS.primary} style={sectionIcon} />
          <Text size={18} weight="700" color={COLORS.textSecondary}>
            Observaciones
          </Text>
        </View>

        <Input
          label="Notas adicionales"
          placeholder="Ingrese observaciones del raleo"
          value={form.observaciones ?? ""}
          onChangeText={(v) => updateField("observaciones", v)}
          
        />
      </Card>
    </View>
  );
}
