/**
 * ============================================================
 * SCREEN: PARASITOLOGIA
 * ============================================================
 *
 * Renderiza el formulario para registrar parasitologias.
 * Toda la logica se encuentra en useParasitologiaScreen.
 */

import React from "react";
import { ScrollView, View } from "react-native";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import DateInput from "../../../shared/components/DateInput";
import Icon from "../../../shared/components/Icons";
import Input from "../../../shared/components/Input";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import CustomText from "../../../shared/components/Text";

import ParasitologiaSectionTitle from "../components/ParasitologiaSectionTitle";
import useParasitologiaScreen from "../hooks/useParasitologiaScreen";

import { styles } from "../styles/ParasitologiaStyle";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function ParasitologiaScreen() {
  const pantalla = useParasitologiaScreen();

  return (
    <>
      <NavbarRegistro
        Titulo="Parasitologia"
        Subtitulo="Registro por grados de infeccion"
        Icono="parasite"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
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
                  selectStyle={
                    pantalla.errorFinca && styles.campoConError
                  }
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
                  selectStyle={
                    pantalla.errorEstanque && styles.campoConError
                  }
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

              <View style={pantalla.itemStyle} pointerEvents="none">
                <Input
                  label="Responsable"
                  value={pantalla.responsable}
                  editable={false}
                  readOnly={true}
                  selectTextOnFocus={false}
                  labelStyle={styles.label}
                />
              </View>
            </View>
          </Card>

          <Card>
            <ParasitologiaSectionTitle
              title="Conteo parasitologico"
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
                  selectStyle={
                    pantalla.errorParasito && styles.campoConError
                  }
                />
              </View>

              <View style={pantalla.itemStyle}>
                <NumberInput
                  label="Camarones muestreados *"
                  value={pantalla.camaronesMuestreados}
                  onChangeText={pantalla.setCamaronesMuestreados}
                  min={0}
                  max={999999}
                  step={1}
                  editable={!pantalla.loading}
                  labelStyle={styles.label}
                  style={
                    pantalla.errorMuestreados && styles.campoConError
                  }
                />
              </View>

              <View style={pantalla.itemStyle}>
                <NumberInput
                  label="Camarones infectados *"
                  value={pantalla.camaronesInfectados}
                  onChangeText={pantalla.setCamaronesInfectados}
                  min={0}
                  max={999999}
                  step={1}
                  editable={!pantalla.loading}
                  labelStyle={styles.label}
                  style={
                    pantalla.errorInfectados && styles.campoConError
                  }
                />
              </View>

              <View style={pantalla.itemFullStyle}>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Icon icon={ICONS.report} size={20} color={COLORS.primary} />

                    <CustomText
                      size={15}
                      color={COLORS.textPrimary}
                      style={styles.previewTitle}
                    >
                      Resultado calculado
                    </CustomText>
                  </View>

                  <View style={styles.previewGrid}>
                    <View style={styles.previewBox}>
                      <CustomText
                        size={12}
                        color={COLORS.textTertiary}
                        style={styles.previewLabel}
                      >
                        Muestreados
                      </CustomText>

                      <CustomText
                        size={20}
                        color={COLORS.textSecondary}
                        style={styles.previewValue}
                      >
                        {pantalla.camaronesMuestreados || 0}
                      </CustomText>
                    </View>

                    <View style={styles.previewBox}>
                      <CustomText
                        size={12}
                        color={COLORS.textTertiary}
                        style={styles.previewLabel}
                      >
                        Infectados
                      </CustomText>

                      <CustomText
                        size={20}
                        color={COLORS.textSecondary}
                        style={styles.previewValue}
                      >
                        {pantalla.camaronesInfectados || 0}
                      </CustomText>
                    </View>

                    <View style={styles.previewBox}>
                      <CustomText
                        size={12}
                        color={COLORS.textTertiary}
                        style={styles.previewLabel}
                      >
                        Porcentaje
                      </CustomText>

                      <CustomText
                        size={20}
                        color={COLORS.textSecondary}
                        style={styles.previewValue}
                      >
                        {pantalla.gradoCalculado.porcentaje}%
                      </CustomText>
                    </View>
                  </View>

                  <View style={styles.gradeBox}>
                    <View style={styles.gradeHeader}>
                      <CustomText size={14} color={COLORS.textSecondary}>
                        Grado de infeccion
                      </CustomText>

                      <View style={styles.gradeBadge}>
                        <CustomText
                          size={13}
                          color={pantalla.colorGrado}
                          weight="800"
                        >
                          {pantalla.gradoCalculado.nombre}
                        </CustomText>
                      </View>
                    </View>

                    <CustomText
                      size={13}
                      color={COLORS.textTertiary}
                      style={styles.gradeDescription}
                    >
                      {pantalla.gradoCalculado.descripcion}
                    </CustomText>
                  </View>
                </View>
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
                Guardar
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}