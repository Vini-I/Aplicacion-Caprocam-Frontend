/**
 * ============================================================
 * SCREEN: PARASITOLOGIA
 * ============================================================
 *
 * Modulo para registrar parasitos por finca y estanque.
 *
 * Funcionalidad:
 * - Permite seleccionar finca y estanque.
 * - Permite seleccionar el parasito encontrado.
 * - Usa DateInput con calendario e icono.
 * - Usa required/submitted estandarizado.
 * - Calcula porcentaje de infeccion.
 * - Calcula grado de infeccion.
 * - Usa botones outline.
 * - Guarda registros usando useParasitologia.
 *
 * Importante:
 * - No se mide con si/no.
 * - Se mide con camarones muestreados e infectados.
 * - Gregarinas y epicomensales van aqui, no en Enfermedades.
 */

import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

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

import useParasitologia from "../hooks/useParasitologia";
import {
  PARASITOS_CATALOGO,
  calcularGradoInfeccion,
  obtenerNombreParasito,
} from "../services/ParasitologiaService";

import { styles } from "../styles/ParasitologiaStyle";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";
import { getCurrentDate } from "../../../shared/utils/dateUtils";
import {
  construirRegistroParasitologia,
  obtenerColorGrado,
  obtenerOpcionesEstanques,
  obtenerOpcionesFincas,
  validarFormularioParasitologia,
} from "../services/ParasitologiaScreenService";

export default function ParasitologiaScreen({ onBack, navigation }) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { loading, error, guardarRegistro } = useParasitologia();

  let esTablet = false;
  let esDesktop = false;

  if (width >= 768) {
    esTablet = true;
  }

  if (width >= 1024) {
    esDesktop = true;
  }

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(getCurrentDate());
  const [responsable, setResponsable] = useState("");
  const [parasito, setParasito] = useState("");
  const [camaronesMuestreados, setCamaronesMuestreados] = useState("0");
  const [camaronesInfectados, setCamaronesInfectados] = useState("0");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [submitted, setSubmitted] = useState(false);

  let contentStyle = [styles.content];
  let gridStyle = [styles.grid];
  let itemStyle = [styles.gridItem];
  let itemFullStyle = [styles.gridItem];

  if (esTablet === true) {
    contentStyle.push(styles.contentTablet);
    gridStyle.push(styles.gridTablet);
    itemStyle.push(styles.gridItemTablet);
    itemFullStyle.push(styles.gridItemFull);
  }

  if (esDesktop === true) {
    contentStyle.push(styles.contentDesktop);
    gridStyle.push(styles.gridDesktop);
    itemStyle.push(styles.gridItemDesktop);
    itemFullStyle.push(styles.gridItemFull);
  }

  const opcionesFincas = obtenerOpcionesFincas();
  const opcionesEstanques = obtenerOpcionesEstanques(finca);

  const gradoCalculado = calcularGradoInfeccion(
    camaronesMuestreados,
    camaronesInfectados,
  );

  const colorGrado = obtenerColorGrado(gradoCalculado.grado);

  function volver() {
    if (onBack) {
      onBack();
      return;
    }

    if (navigation) {
      navigation.goBack();
      return;
    }

    router.back();
  }

  function cambiarFinca(valor) {
    setFinca(valor);
    setEstanque("");
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(getCurrentDate());
    setResponsable("");
    setParasito("");
    setCamaronesMuestreados("0");
    setCamaronesInfectados("0");
    setObservaciones("");
    setSubmitted(false);
  }

  function validarFormulario() {
    setSubmitted(true);

    const resultado = validarFormularioParasitologia({
      finca: finca,
      estanque: estanque,
      fechaReporte: fechaReporte,
      parasito: parasito,
      camaronesMuestreados: camaronesMuestreados,
      camaronesInfectados: camaronesInfectados,
    });

    if (resultado.valido === false) {
      setTipoMensaje(resultado.tipoMensaje);
      setMensaje(resultado.mensaje);
    }

    return resultado.valido;
  }

  async function registrarParasitologia() {
    if (validarFormulario() === false) {
      return;
    }

    const nuevoRegistro = construirRegistroParasitologia({
      finca: finca,
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      parasito: parasito,
      camaronesMuestreados: camaronesMuestreados,
      camaronesInfectados: camaronesInfectados,
      observaciones: observaciones,
    });

    const guardado = await guardarRegistro(nuevoRegistro);

    if (guardado === null) {
      setTipoMensaje("danger");
      setMensaje("No se pudo guardar el registro de parasitologia.");
      return;
    }

    setTipoMensaje("success");
    setMensaje("Registro de parasitologia guardado correctamente.");

    limpiarFormulario();
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Parasitologia"
        Subtitulo="Registro por grados de infeccion"
        Icono="parasite"
      />

      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={contentStyle}>
          {error !== "" && (
            <Alert
              variant="danger"
              message={error}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          <Card>
            <SectionTitle
              title="Ubicacion del muestreo"
              icon={ICONS.document}
            />

            <View style={gridStyle}>
              <View style={itemStyle}>
                <Select
                  label="Finca"
                  required={true}
                  submitted={submitted}
                  options={opcionesFincas}
                  value={finca}
                  onChange={cambiarFinca}
                  placeholder="Seleccione la finca"
                  labelStyle={styles.label}
                />
              </View>

              <View style={itemStyle}>
                <Select
                  label="Estanque"
                  required={true}
                  submitted={submitted}
                  options={opcionesEstanques}
                  value={estanque}
                  onChange={setEstanque}
                  placeholder="Seleccione el estanque"
                  labelStyle={styles.label}
                />
              </View>

              <View style={itemStyle}>
                <DateInput
                  label="Fecha del reporte"
                  required={true}
                  submitted={submitted}
                  value={fechaReporte}
                  onChangeText={setFechaReporte}
                  labelStyle={styles.label}
                />
              </View>

              <View style={itemStyle}>
                <Input
                  label="Responsable"
                  value={responsable}
                  onChangeText={setResponsable}
                  placeholder="Nombre del responsable"
                  labelStyle={styles.label}
                />
              </View>
            </View>
          </Card>

          <Card>
            <SectionTitle
              title="Conteo parasitologico"
              icon={ICONS.microscope}
            />

            <View style={gridStyle}>
              <View style={itemStyle}>
                <Select
                  label="Parasito"
                  required={true}
                  submitted={submitted}
                  options={PARASITOS_CATALOGO}
                  value={parasito}
                  onChange={setParasito}
                  placeholder="Seleccione el parasito"
                  labelStyle={styles.label}
                />
              </View>

              <View style={itemStyle}>
                <NumberInput
                  label="Camarones muestreados"
                  required={true}
                  submitted={submitted}
                  value={camaronesMuestreados}
                  onChangeText={setCamaronesMuestreados}
                  min={0}
                  max={999999}
                  step={1}
                  labelStyle={styles.label}
                />
              </View>

              <View style={itemStyle}>
                <NumberInput
                  label="Camarones infectados"
                  required={true}
                  submitted={submitted}
                  value={camaronesInfectados}
                  onChangeText={setCamaronesInfectados}
                  min={0}
                  max={999999}
                  step={1}
                  labelStyle={styles.label}
                />
              </View>

              <View style={itemFullStyle}>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Icon
                      icon={ICONS.report}
                      size={20}
                      color={COLORS.primary}
                    />

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
                        {camaronesMuestreados}
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
                        {camaronesInfectados}
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
                        {gradoCalculado.porcentaje}%
                      </CustomText>
                    </View>
                  </View>

                  <View style={styles.gradeBox}>
                    <View style={styles.gradeHeader}>
                      <CustomText size={14} color={COLORS.textSecondary}>
                        Grado de infeccion
                      </CustomText>

                      <View style={styles.gradeBadge}>
                        <CustomText size={13} color={colorGrado} weight="800">
                          {gradoCalculado.nombre}
                        </CustomText>
                      </View>
                    </View>

                    <CustomText
                      size={13}
                      color={COLORS.textTertiary}
                      style={styles.gradeDescription}
                    >
                      {gradoCalculado.descripcion}
                    </CustomText>
                  </View>
                </View>
              </View>

              <View style={itemFullStyle}>
                <Input
                  label="Observaciones"
                  value={observaciones}
                  onChangeText={setObservaciones}
                  placeholder="Describa observaciones del muestreo"
                  multiline={true}
                  labelStyle={styles.label}
                  style={styles.textArea}
                />
              </View>
            </View>
          </Card>

          {mensaje !== "" && (
            <Alert
              variant={tipoMensaje}
              message={mensaje}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          <Button
            variant="outline"
            onPress={registrarParasitologia}
            style={styles.outlinePrimaryButton}
            disabled={loading}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.primary} />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                Registrar parasitologia
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
