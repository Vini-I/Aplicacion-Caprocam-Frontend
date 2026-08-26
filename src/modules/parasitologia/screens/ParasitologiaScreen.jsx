/**
 * ============================================================
 * SCREEN: PARASITOLOGIA
 * ============================================================
 *
 * Renderiza el formulario para registrar parasitologias.
 * Toda la logica se encuentra en useParasitologiaScreen.
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
import Spinner from "../../../shared/components/Spinner.jsx";
import CustomText from "../../../shared/components/Text.jsx";

import ParasitologiaSectionTitle from "../components/ParasitologiaSectionTitle.jsx";
import useParasitologiaScreen from "../hooks/useParasitologiaScreen.js";

import { styles } from "../styles/ParasitologiaStyle.js";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { STYLE } from "../../../theme/style.js";

export default function ParasitologiaScreen() {
  const pantalla = useParasitologiaScreen();
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
        Titulo="Parasitologia"
        Subtitulo="Registro por grados de infeccion"
        Icono="parasite"
        RutaVolver="/registros"
      />

      <ScrollView
        ref={scrollRef}
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={[STYLE.contentWrapper, styles.content]}>
          {pantalla.loading && (
            <Spinner text="Cargando datos de parasitologia..." />
          )}

          <Card>
            <ParasitologiaSectionTitle
              title="Ubicacion del muestreo"
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
                  onChange={pantalla.setEstanque}
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
                  onChangeText={pantalla.setFechaReporte}
                  disabled={pantalla.loading}
                  labelStyle={styles.label}
                  inputStyle={
                    pantalla.errorFechaReporte && styles.campoConError
                  }
                />
              </View>
            </View>
          </Card>

          <Card>
            <ParasitologiaSectionTitle
              title="Registro parasitologico"
              icon={ICONS.microscope}
            />

            <View style={pantalla.gridStyle}>
              <View style={pantalla.itemStyle}>
                <Select
                  label="Parasito *"
                  options={pantalla.opcionesParasitos}
                  value={pantalla.parasito}
                  onChange={pantalla.setParasito}
                  placeholder={pantalla.placeholderParasito}
                  disabled={pantalla.loading}
                  labelStyle={styles.label}
                  selectStyle={pantalla.errorParasito && styles.campoConError}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <Select
                  label="Grado de infeccion *"
                  options={pantalla.opcionesGrados}
                  value={pantalla.gradoInfeccion}
                  onChange={pantalla.setGradoInfeccion}
                  placeholder={pantalla.placeholderGrado}
                  disabled={pantalla.loading}
                  labelStyle={styles.label}
                  selectStyle={pantalla.errorGrado && styles.campoConError}
                />
              </View>

              <View style={pantalla.itemFullStyle}>
                <Input
                  label="Observaciones"
                  value={pantalla.observaciones}
                  onChangeText={pantalla.setObservaciones}
                  placeholder="Describa observaciones del muestreo"
                  multiline={true}
                  editable={!pantalla.loading}
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
            onPress={pantalla.registrarParasitologia}
            style={styles.outlinePrimaryButton}
            disabled={pantalla.loading}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.primary} />

              <CustomText size={16} color={COLORS.primary}>
                Registrar parasitologia
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}