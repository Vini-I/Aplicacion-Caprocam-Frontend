/**
 * =============================================================
 * SCREEN: ENFERMEDADES
 * =============================================================
 *
 * Renderiza el formulario para registrar enfermedades.
 * Toda la logica se encuentra en useEnfermedadesScreen.
 */

import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";

import Alert from "../../../shared/components/Alert.jsx";
import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Input from "../../../shared/components/Input.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import Select from "../../../shared/components/Select.jsx";
import CustomText from "../../../shared/components/Text.jsx";

import EnfermedadesSectionTitle from "../components/EnfermedadesSectionTitle.jsx";
import useEnfermedadesScreen from "../hooks/useEnfermedadesScreen.js";

import { styles } from "../styles/EnfermedadesStyle.js";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { STYLE } from "../../../theme/style.js";

export default function EnfermedadesScreen() {
  const pantalla = useEnfermedadesScreen();
  const scrollRef = useRef(null);

  //Hook aquí para que haga el scrollToEnd en caso de que haya algún error de cargar
  useEffect(() => {
    if (pantalla.mensaje && pantalla.tipoMensaje === "danger") {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [pantalla.mensaje, pantalla.tipoMensaje]);

  return (
    <>
      <NavbarRegistro
        Titulo="Enfermedades"
        Subtitulo="Registro de enfermedades"
        Icono="shieldAlert"
        RutaVolver="/registros"
      />

      <ScrollView
        ref={scrollRef}
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={[STYLE.contentWrapper, styles.content]}>
          <Card style={styles.card}>
            <EnfermedadesSectionTitle
              title="Ubicacion del caso"
              icon={ICONS.document}
            />

            <View style={pantalla.gridStyle}>
              <View style={pantalla.itemStyle}>
                <Select
                  label="Finca *"
                  options={pantalla.opcionesFincas}
                  value={pantalla.finca}
                  onChange={pantalla.cambiarFinca}
                  placeholder={pantalla.placeholderFinca}
                  disabled={pantalla.loading}
                  labelStyle={styles.label}
                  selectStyle={pantalla.errorFinca && styles.campoConError}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <Select
                  label="Estanque *"
                  options={pantalla.opcionesEstanques}
                  value={pantalla.estanque}
                  onChange={pantalla.cambiarEstanque}
                  placeholder={pantalla.placeholderEstanque}
                  disabled={pantalla.loading || pantalla.finca === ""}
                  labelStyle={styles.label}
                  selectStyle={pantalla.errorEstanque && styles.campoConError}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <DateInput
                  label="Fecha del reporte *"
                  value={pantalla.fechaReporte}
                  onChangeText={pantalla.cambiarFechaReporte}
                  labelStyle={styles.label}
                  inputStyle={pantalla.errorFechaReporte && styles.campoConError}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <Input
                  label="Responsable"
                  value={pantalla.responsable}
                  editable={false}
                  labelStyle={styles.label}
                  style={styles.disabledInput}
                />
              </View>
            </View>
          </Card>

          <Card style={styles.card}>
            <EnfermedadesSectionTitle
              title="Enfermedad detectada"
              icon={ICONS.shieldAlert}
            />

            <Select
              label="Enfermedad *"
              options={pantalla.opcionesEnfermedades}
              value={pantalla.enfermedad}
              onChange={pantalla.cambiarEnfermedad}
              placeholder={pantalla.placeholderEnfermedad}
              disabled={pantalla.loading}
              labelStyle={styles.label}
              selectStyle={pantalla.errorEnfermedad && styles.campoConError}
            />
          </Card>

          <Card style={styles.card}>
            <EnfermedadesSectionTitle
              title="Reporte sanitario"
              icon={ICONS.info}
            />

            <View style={pantalla.gridStyle}>
              <View style={pantalla.itemStyle}>
                <Select
                  label="Severidad *"
                  options={pantalla.opcionesSeveridades}
                  value={pantalla.severidad}
                  onChange={pantalla.cambiarSeveridad}
                  placeholder={pantalla.placeholderSeveridad}
                  disabled={pantalla.loading}
                  labelStyle={styles.label}
                  selectStyle={pantalla.errorSeveridad && styles.campoConError}
                />
              </View>

              <View style={pantalla.itemFullStyle}>
                <Input
                  label="Reporte"
                  value={pantalla.reporte}
                  onChangeText={pantalla.cambiarReporte}
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
            onPress={pantalla.guardarEnfermedad}
            disabled={pantalla.loading}
            style={styles.outlinePrimaryButton}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
              <CustomText size={16} color={COLORS.primary} style={styles.saveText}>
                Guardar
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}