/**
 * ============================================================
 * SCREEN: ENFERMEDADES
 * ============================================================
 *
 * Modulo para registrar enfermedades por finca y estanque.
 * La logica del formulario vive en hooks/useEnfermedadesScreen.
 */

import React from "react";
import { ScrollView, View } from "react-native";

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

import useEnfermedadesScreen from "../../enfermedades/hooks/useEnfermedadesScreen";
import {
  ENFERMEDADES_CATALOGO,
  SEVERIDADES_ENFERMEDAD,
} from "../../enfermedades/services/EnfermedadesService";

import { styles } from "../../enfermedades/styles/EnfermedadesStyle";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";
import { STYLE } from "../../../theme/style";

export default function EnfermedadesScreen({ onBack, navigation }) {
  const pantalla = useEnfermedadesScreen(onBack, navigation);

  const opcionesGridStyle = [styles.optionsGrid];

  if (pantalla.erroresFormulario.enfermedades !== "") {
    opcionesGridStyle.push(styles.optionsGridError);
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Enfermedades"
        Subtitulo="Registro sanitario"
        Icono="shieldAlert"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={pantalla.contentStyle}>
          {pantalla.error !== "" && (
            <Alert
              variant="danger"
              message={pantalla.error}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          <Card>
            <SectionTitle title="Ubicacion del caso" icon={ICONS.document} />

            <View style={pantalla.gridStyle}>
              <View style={pantalla.itemStyle}>
                <Select
                  label="Finca"
                  required={true}
                  submitted={pantalla.submitted}
                  error={pantalla.erroresFormulario.finca}
                  options={pantalla.opcionesFincas}
                  value={pantalla.finca}
                  onChange={pantalla.cambiarFinca}
                  placeholder="Seleccione la finca"
                  labelStyle={styles.label}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <Select
                  label="Estanque"
                  required={true}
                  submitted={pantalla.submitted}
                  error={pantalla.erroresFormulario.estanque}
                  options={pantalla.opcionesEstanques}
                  value={pantalla.estanque}
                  onChange={pantalla.setEstanque}
                  placeholder="Seleccione el estanque"
                  labelStyle={styles.label}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <DateInput
                  label="Fecha del reporte"
                  required={true}
                  submitted={pantalla.submitted}
                  value={pantalla.fechaReporte}
                  onChangeText={pantalla.setFechaReporte}
                  labelStyle={styles.label}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <Input
                  label="Persona encargada"
                  value={pantalla.responsable}
                  onChangeText={pantalla.setResponsable}
                  placeholder="Responsable obtenido del backend"
                  editable={false}
                  labelStyle={styles.label}
                  helperText="Este dato se obtiene desde backend."
                />
              </View>
            </View>
          </Card>

          <Card>
            <SectionTitle
              title="Enfermedades que presenta"
              icon={ICONS.report}
            />

            <View style={opcionesGridStyle}>
              {ENFERMEDADES_CATALOGO.map(function (item) {
                return (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    selectedValues={pantalla.enfermedadesSeleccionadas}
                    onPress={pantalla.cambiarEnfermedad}
                  />
                );
              })}
            </View>

            {pantalla.erroresFormulario.enfermedades !== "" && (
              <CustomText size={12} color={COLORS.error} style={styles.errorText}>
                {pantalla.erroresFormulario.enfermedades}
              </CustomText>
            )}
          </Card>

          <Card>
            <SectionTitle title="Reporte sanitario" icon={ICONS.info} />

            <View style={pantalla.gridStyle}>
              <View style={pantalla.itemStyle}>
                <Select
                  label="Severidad"
                  required={true}
                  submitted={pantalla.submitted}
                  error={pantalla.erroresFormulario.severidad}
                  options={SEVERIDADES_ENFERMEDAD}
                  value={pantalla.severidad}
                  onChange={pantalla.setSeveridad}
                  placeholder="Seleccione la severidad"
                  labelStyle={styles.label}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <NumberInput
                  label="Mortalidad registrada (U)"
                  value={pantalla.mortalidad}
                  onChangeText={pantalla.setMortalidad}
                  min={0}
                  max={999999}
                  step={1}
                  error={pantalla.erroresFormulario.mortalidad}
                  labelStyle={styles.label}
                />
              </View>

              <View style={pantalla.itemFullStyle}>
                <Input
                  label="Reporte"
                  required={true}
                  submitted={pantalla.submitted}
                  error={pantalla.erroresFormulario.reporte}
                  value={pantalla.reporte}
                  onChangeText={pantalla.setReporte}
                  placeholder="Describa sintomas, observaciones o acciones realizadas"
                  multiline={true}
                  labelStyle={styles.label}
                  style={styles.textArea}
                />
              </View>
            </View>
          </Card>

          {pantalla.mensaje !== "" && (
            <Alert
              variant={pantalla.tipoMensaje}
              message={pantalla.mensaje}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          <Button
            variant="outline"
            onPress={pantalla.registrarEnfermedad}
            style={styles.outlinePrimaryButton}
            disabled={pantalla.loading}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.primary} />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                Registrar enfermedad
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

function SectionTitle({ title, icon }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} />

      <Title
        level={5}
        color={COLORS.textSecondary}
        fuente={TYPOGRAPHY.fontFamily.bold}
        style={styles.sectionTitle}
      >
        {title}
      </Title>
    </View>
  );
}

function OptionButton({ label, value, selectedValues, onPress }) {
  let seleccionado = false;

  selectedValues.forEach(function (item) {
    if (item === value) {
      seleccionado = true;
    }
  });

  const buttonStyle = [styles.optionButton];
  let textColor = COLORS.textSecondary;
  let textFont = TYPOGRAPHY.fontFamily.medium;

  if (seleccionado === true) {
    buttonStyle.push(styles.optionButtonSelected);
    textColor = COLORS.primary;
    textFont = TYPOGRAPHY.fontFamily.bold;
  }

  function handlePress() {
    onPress(value);
  }

  return (
    <Button variant="outline" onPress={handlePress} style={buttonStyle}>
      <CustomText
        size={13}
        color={textColor}
        align="center"
        style={{ fontFamily: textFont }}
      >
        {label}
      </CustomText>
    </Button>
  );
}
