/**
 * ============================================================
 * PANTALLA EDITAR ESTANQUE
 * ============================================================
 *
 * Edita la informacion de un estanque existente.
 *
 * Cambios aplicados segun estandar:
 * - Fechas centralizadas con dateUtils.
 * - DateInput con calendario e icono global.
 * - Campos requeridos usando required y submitted.
 * - Boton principal en variante outline.
 * - Select de aireador requerido solo si tiene aireadores.
 */

import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import DateInput from "../../../shared/components/DateInput";
import Icon from "../../../shared/components/Icons";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

import { styles } from "../styles/EstanqueStyle";
import { STYLE } from "../../../theme/style";

import { useEstanque } from "../context/EstanqueContext";
import { useFinca } from "../../finca/context/FincaContext";

import useEditarEstanque from "../hooks/useEditarEstanque";
import { SectionTitle, OptionButton } from "../components/componentsEstanque";
import {
  ESTADOS_ESTANQUE,
  FUENTES_AGUA,
  OPCIONES_PRECRIA,
  TIPOS_ESTANQUE,
  validarFormularioEstanque,
} from "../hooks/useEstanque";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function EditarEstanqueScreen({ codigoCBO, id }) {
  const {
    finca,
    loading,
    estanqueOriginal,

    codigo,    setCodigo,
    estado,    setEstado,
    tipoEstanque,    setTipoEstanque,
    largo,    setLargoState,
    ancho,    setAnchoState,
    profundidad,    setProfundidadState,
    fuenteAgua,    setFuenteAgua,

      fechaMantenimiento,    setFechaMantenimiento,
    precria,    setPrecria,

      mensaje,
      tipoMensaje,
      submitted,
      errores,
      displayErrorMessage,
      displayErrorVariant,

    guardarCambios,
  } = useEditarEstanque(codigoCBO, id);

  if (loading) {
    return <CustomText>Cargando...</CustomText>;
  }

  if (!estanqueOriginal) {
    return (
      <>{mensaje !== "" && <Alert variant={tipoMensaje} message={mensaje} />}</>
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Editar Estanque"
        Subtitulo={`${codigo}`}
        Icono="water"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          <Card>
            <SectionTitle title="Identificacion" icon={ICONS.document} />

            <Input
              label="Codigo del estanque"
              required={true}
              submitted={submitted}
              value={codigo}
              onChangeText={setCodigo}
              placeholder="Ej: EST-01"
              labelStyle={styles.label}
              error={errores?.codigo || ""}
            />

            <Select
              label="Tipo de estanque"
              required={true}
              submitted={submitted}
              options={TIPOS_ESTANQUE}
              value={tipoEstanque}
              onChange={setTipoEstanque}
              placeholder="Seleccione el tipo"
              labelStyle={styles.label}
              error={errores?.tipoEstanque || ""}
            />

            <CustomText
              size={14}
              color={COLORS.textPrimary}
              style={styles.labelText}
            >
              Estado del estanque
            </CustomText>

            <View style={styles.optionsGrid}>
              {ESTADOS_ESTANQUE.map(function (item) {
                return (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    selectedValue={estado}
                    onPress={setEstado}
                  />
                );
              })}
            </View>
          </Card>

          <Card>
            <SectionTitle title="Dimensiones" icon={ICONS.ruler} />

            <View style={styles.twoColumns}>
              <View style={styles.column}>
                <Input
                  label="Largo (m)"
                  required={true}
                  submitted={submitted}
                  value={largo}
                  onChangeText={setLargoState}
                  placeholder="Ej: 100"
                  keyboardType="numeric"
                  numericOnly
                  labelStyle={styles.label}
                  error={errores?.largo || ""}
                />
              </View>

              <View style={styles.column}>
                <Input
                  label="Ancho (m)"
                  required={true}
                  submitted={submitted}
                  value={ancho}
                  onChangeText={setAnchoState}
                  placeholder="Ej: 80"
                  keyboardType="numeric"
                  numericOnly
                  labelStyle={styles.label}
                  error={errores?.ancho || ""}
                />
              </View>
            </View>

            <Input
              label="Profundidad (m)"
              required={true}
              submitted={submitted}
              value={profundidad}
              onChangeText={setProfundidadState}
              placeholder="Ej: 0.80"
              keyboardType="numeric"
              numericOnly
              labelStyle={styles.label}
              error={errores?.profundidad || ""}
            />

            <Select
              label="Fuente de agua"
              required={true}
              submitted={submitted}
              options={FUENTES_AGUA}
              value={fuenteAgua}
              onChange={setFuenteAgua}
              placeholder="Seleccione la fuente"
              labelStyle={styles.label}
              error={errores?.fuenteAgua || ""}
            />
          </Card>

          <Card>
            <SectionTitle title="Siembra y fechas" icon={ICONS.calendar} />

            <DateInput
              label="Fecha último mantenimiento"
              required={true}
              value={fechaMantenimiento}
              onChangeText={setFechaMantenimiento}
              labelStyle={styles.label}
              error={errores?.fechaMantenimiento || ""}
            />

            <Select
              label="Se usa precria"
              required={true}
              submitted={submitted}
              options={OPCIONES_PRECRIA}
              value={precria}
              onChange={setPrecria}
              placeholder="Seleccione si usa precria"
              labelStyle={styles.label}
              error={errores?.precria || ""}
            />
          </Card>

          {displayErrorMessage && (
            <Alert
              variant={displayErrorVariant}
              message={displayErrorMessage}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          <Button
            variant="outline"
            onPress={guardarCambios}
            style={styles.outlinePrimaryButton}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.primary} />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                Guardar cambios
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
