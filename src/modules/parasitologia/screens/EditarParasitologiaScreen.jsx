/**
 * ============================================================
 * SCREEN: PARASITOLOGIA
 * ============================================================
 *
 * Renderiza el formulario para editar parasitologias.
 * Toda la logica se encuentra en useEditarParasitologia.
 */

import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert.jsx";
import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Input from "../../../shared/components/Input.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import Select from "../../../shared/components/Select.jsx";
import CustomText from "../../../shared/components/Text.jsx";

import ParasitologiaSectionTitle from "../components/ParasitologiaSectionTitle.jsx";
import useEditarParasitologia from "../hooks/useEditarParasitologia.js";

import { styles } from "../styles/ParasitologiaStyle.js";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { STYLE } from "../../../theme/style.js";

export default function EditarParasitologiaScreen({ registroId }) {
  const router = useRouter();

  const pantalla = useEditarParasitologia(registroId, () => {
    router.replace({ pathname: "/registros/Reporteria", params: { alert: "edited" } });
  });

  const scrollRef = useRef(null);

  //Hook aquí para que haga el scrollToEnd en caso de que haya algún error de cargar
  useEffect(() => {
    if (pantalla.mensaje && pantalla.tipoMensaje === "danger") {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [pantalla.mensaje, pantalla.tipoMensaje]);

  if (!registroId) {
    return (
      <>
        <NavbarRegistro
          Titulo="Parasitologia"
          Subtitulo="Editar registro"
          Icono="parasite"
        />

        <CustomText style={{ textAlign: "center", marginTop: 24 }}>
          No se encontró el registro a editar.
        </CustomText>
      </>
    );
  }

  if (pantalla.cargandoRegistro) {
    return (
      <>
        <NavbarRegistro
          Titulo="Parasitologia"
          Subtitulo="Editar registro"
          Icono="parasite"
        />

        <CustomText style={{ textAlign: "center", marginTop: 24 }}>
          Cargando registro...
        </CustomText>
      </>
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Parasitologia"
        Subtitulo="Editar registro"
        Icono="parasite"
      />

      <ScrollView
        ref={scrollRef}
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={[STYLE.contentWrapper, styles.content]}>
          {pantalla.loading && (
            <Alert
              variant="info"
              message="Cargando datos de parasitologia..."
              style={styles.alert}
              textStyle={styles.alertText}
            />
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
                  inputStyle={pantalla.errorFechaReporte && styles.campoConError}
                />
              </View>

              <View style={pantalla.itemStyle}>
                <Input
                  label="Responsable"
                  value={pantalla.responsable}
                  editable={false}
                  labelStyle={styles.label}
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

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                Actualizar Registro Parasitologia
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}