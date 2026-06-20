/**
 * ============================================================
 * PANTALLA ENFERMEDADES
 * ============================================================
 *
 * Registra eventos sanitarios asociados a estanques.
 *
 * Ajustes aplicados:
 * - Usa CustomText para textos visibles.
 * - Usa Button para acciones, sin Pressable ni TouchableOpacity directo.
 * - Usa Title para encabezados y títulos de sección.
 * - Usa DateInput para fecha de reporte y proxima revision.
 * - Usa NumberInput para mortalidad y periodo de retiro.
 * - Usa styles desde la carpeta del modulo.
 */

import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

import Alert from "../../../shared/components/Alert";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import DateInput from "../../../shared/components/DateInput";
import Icon from "../../../shared/components/Icons";
import Input from "../../../shared/components/Input";
import Modal from "../../../shared/components/Modal";
import NumberInput from "../../../shared/components/NumberInput";
import ProgressBar from "../../../shared/components/ProgressBar";
import Select from "../../../shared/components/Select";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { styles } from "../styles/EnfermedadesStyles";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

const ESTANQUES = [
  { label: "EST-01 - Finca La Reina", value: "est-01" },
  { label: "EST-02 - Finca La Reina", value: "est-02" },
  { label: "EST-03 - Finca La Reina", value: "est-03" },
];

const EVENTOS = [
  { label: "Monitoreo preventivo", value: "monitoreo_preventivo" },
  { label: "Sospecha de enfermedad", value: "sospecha_enfermedad" },
  { label: "Enfermedad confirmada", value: "enfermedad_confirmada" },
  { label: "Mortalidad elevada", value: "mortalidad_elevada" },
];

const ENFERMEDADES = [
  { label: "WSSV - Mancha Blanca", value: "wssv" },
  { label: "AHPND - Necrosis Hepatopancreatica Aguda", value: "ahpnd" },
  { label: "NHP - Necrosis Hepatopancreatica", value: "nhp" },
  { label: "IHHNV", value: "ihhnv" },
  { label: "Vibriosis", value: "vibriosis" },
  { label: "Gregarinas", value: "gregarinas" },
  { label: "Epicomensales", value: "epicomensales" },
  { label: "Otro", value: "otro" },
];

const SEVERIDADES = [
  { label: "Baja", value: "baja" },
  { label: "Media", value: "media" },
  { label: "Alta", value: "alta" },
  { label: "Critica", value: "critica" },
];

const SI_NO = [
  { label: "Si", value: "si" },
  { label: "No", value: "no" },
];

const ESTADOS_CASO = [
  { label: "En observacion", value: "observacion" },
  { label: "En tratamiento", value: "tratamiento" },
  { label: "Controlado", value: "controlado" },
  { label: "Cerrado", value: "cerrado" },
];

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

export default function EnfermedadesScreen({ navigation }) {
  const { width } = useWindowDimensions();

  let esTablet = false;
  let esDesktop = false;

  if (width >= 768) {
    esTablet = true;
  }

  if (width >= 1024) {
    esDesktop = true;
  }

  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaActual());
  const [responsable, setResponsable] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [enfermedad, setEnfermedad] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [mortalidad, setMortalidad] = useState("0");
  const [sintomas, setSintomas] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [usaProbiotico, setUsaProbiotico] = useState("");
  const [productoProbiotico, setProductoProbiotico] = useState("");
  const [usaAntibiotico, setUsaAntibiotico] = useState("");
  const [productoAntibiotico, setProductoAntibiotico] = useState("");
  const [periodoRetiro, setPeriodoRetiro] = useState("0");
  const [estadoCaso, setEstadoCaso] = useState("");
  const [proximaRevision, setProximaRevision] = useState(obtenerFechaActual());
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [modalVisible, setModalVisible] = useState(false);

  let headerStyle = [styles.header];
  let contentStyle = [styles.content];
  let gridStyle = [styles.grid];
  let itemStyle = [styles.gridItem];
  let itemFullStyle = [styles.gridItem];
  let actionsStyle = [styles.actions];

  if (esTablet === true) {
    contentStyle.push(styles.contentTablet);
    gridStyle.push(styles.gridTablet);
    itemStyle.push(styles.gridItemTablet);
    itemFullStyle.push(styles.gridItemFull);
    actionsStyle.push(styles.actionsTablet);
  }

  if (esDesktop === true) {
    headerStyle.push(styles.headerDesktop);
    contentStyle.push(styles.contentDesktop);
    gridStyle.push(styles.gridDesktop);
    itemStyle.push(styles.gridItemDesktop);
    itemFullStyle.push(styles.gridItemFull);
  }

  function volver() {
    if (navigation) {
      navigation.goBack();
    }
  }

  function obtenerRiesgo() {
    let riesgo = 0;

    if (severidad === "baja") {
      riesgo = 25;
    }

    if (severidad === "media") {
      riesgo = 50;
    }

    if (severidad === "alta") {
      riesgo = 75;
    }

    if (severidad === "critica") {
      riesgo = 100;
    }

    return riesgo;
  }

  function obtenerColorRiesgo() {
    let color = COLORS.primary;

    if (severidad === "baja") {
      color = COLORS.success;
    }

    if (severidad === "media") {
      color = COLORS.warning;
    }

    if (severidad === "alta") {
      color = COLORS.warning;
    }

    if (severidad === "critica") {
      color = COLORS.error;
    }

    return color;
  }

  function obtenerTextoRiesgo() {
    let texto = "Sin clasificar";

    if (severidad === "baja") {
      texto = "Riesgo bajo";
    }

    if (severidad === "media") {
      texto = "Riesgo medio";
    }

    if (severidad === "alta") {
      texto = "Riesgo alto";
    }

    if (severidad === "critica") {
      texto = "Riesgo critico";
    }

    return texto;
  }

  function obtenerVarianteRiesgo() {
    let variante = "info";

    if (severidad === "baja") {
      variante = "success";
    }

    if (severidad === "media") {
      variante = "warning";
    }

    if (severidad === "alta") {
      variante = "warning";
    }

    if (severidad === "critica") {
      variante = "danger";
    }

    return variante;
  }

  function obtenerRecomendacion() {
    let recomendacion =
      "Complete la informacion del caso para generar una recomendacion.";

    if (severidad === "baja") {
      recomendacion =
        "Mantener observacion diaria y registrar cualquier cambio en sintomas o mortalidad.";
    }

    if (severidad === "media") {
      recomendacion =
        "Aumentar monitoreo, revisar parametros fisicoquimicos y documentar la evolucion del caso.";
    }

    if (severidad === "alta") {
      recomendacion =
        "Solicitar revision tecnica, separar evidencias y evaluar acciones sanitarias con diagnostico.";
    }

    if (severidad === "critica") {
      recomendacion =
        "Atender el evento de forma prioritaria, evitar aplicar productos sin diagnostico y registrar mortalidad.";
    }

    return recomendacion;
  }

  function validar() {
    let valido = true;

    if (estanque === "") {
      setMensaje("Debe seleccionar el estanque relacionado.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && tipoEvento === "") {
      setMensaje("Debe seleccionar el tipo de evento sanitario.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && enfermedad === "") {
      setMensaje("Debe seleccionar la enfermedad detectada.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && severidad === "") {
      setMensaje("Debe seleccionar la severidad del caso.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (
      valido === true &&
      usaAntibiotico === "si" &&
      Number(periodoRetiro) <= 0
    ) {
      setMensaje("El periodo de retiro debe ser mayor a 0 dias.");
      setTipoMensaje("warning");
      valido = false;
    }

    return valido;
  }

  function registrar() {
    if (validar() === false) {
      return;
    }

    const casoSanitario = {
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      tipoEvento: tipoEvento,
      enfermedad: enfermedad,
      severidad: severidad,
      riesgo: obtenerRiesgo(),
      mortalidad: Number(mortalidad),
      sintomas: sintomas,
      diagnosticoLaboratorio: diagnostico,
      usaProbiotico: usaProbiotico,
      productoProbiotico: productoProbiotico,
      usaAntibiotico: usaAntibiotico,
      productoAntibiotico: productoAntibiotico,
      periodoRetiroDias: Number(periodoRetiro),
      estadoCaso: estadoCaso,
      proximaRevision: proximaRevision,
      observaciones: observaciones,
    };

    console.log("Caso sanitario registrado:", casoSanitario);

    setMensaje("Caso sanitario registrado correctamente.");
    setTipoMensaje("success");
    setModalVisible(true);
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={headerStyle}>
        <Button variant="outline" onPress={volver} style={styles.cancelButton}>
          <View style={styles.inlineButtonContent}>
            <Icon icon={ICONS.exit} size={18} color={COLORS.white} />

            <CustomText
              size={16}
              color={COLORS.white}
              style={styles.cancelText}
            >
              Cancelar
            </CustomText>
          </View>
        </Button>

        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Icon
              icon={ICONS.chemicalContainer}
              size={26}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.headerTextBox}>
            <Title
              level={3}
              color={COLORS.white}
              fuente={TYPOGRAPHY.fontFamily.bold}
            >
              Enfermedades
            </Title>

            <CustomText
              size={14}
              color={COLORS.white}
              style={styles.headerSubtitle}
            >
              Registro sanitario del estanque
            </CustomText>
          </View>
        </View>
      </View>

      <View style={contentStyle}>
        {mensaje !== "" && (
          <Alert
            variant={tipoMensaje}
            message={mensaje}
            style={styles.alert}
            textStyle={styles.alertText}
          />
        )}

        <Card>
          <SectionTitle title="Resumen del riesgo" icon={ICONS.notification} />

          <View style={styles.riskRow}>
            <Icon
              icon={ICONS.notification}
              size={24}
              color={obtenerColorRiesgo()}
            />

            <View style={styles.riskTextBox}>
              <CustomText
                size={13}
                color={COLORS.textTertiary}
                style={styles.boldText}
              >
                Nivel sanitario actual
              </CustomText>

              <Badge
                label={obtenerTextoRiesgo()}
                variant={obtenerVarianteRiesgo()}
                style={styles.badge}
              />
            </View>
          </View>

          <ProgressBar
            label="Riesgo"
            value={obtenerRiesgo()}
            color={obtenerColorRiesgo()}
            backgroundColor={COLORS.secondary}
          />
        </Card>

        <Card>
          <SectionTitle title="Identificacion" icon={ICONS.document} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Estanque relacionado *"
                options={ESTANQUES}
                value={estanque}
                onChange={setEstanque}
                placeholder="Seleccione el estanque"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Fecha del reporte *"
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

            <View style={itemStyle}>
              <Select
                label="Tipo de evento *"
                options={EVENTOS}
                value={tipoEvento}
                onChange={setTipoEvento}
                placeholder="Seleccione el evento"
                labelStyle={styles.label}
              />
            </View>
          </View>
        </Card>

        <Card>
          <SectionTitle title="Enfermedad detectada" icon={ICONS.report} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Enfermedad *"
                options={ENFERMEDADES}
                value={enfermedad}
                onChange={setEnfermedad}
                placeholder="Seleccione la enfermedad"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Severidad *"
                options={SEVERIDADES}
                value={severidad}
                onChange={setSeveridad}
                placeholder="Seleccione severidad"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <NumberInput
                label="Mortalidad registrada"
                value={mortalidad}
                onChangeText={setMortalidad}
                min={0}
                max={999999}
                step={1}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemFullStyle}>
              <Input
                label="Sintomas"
                value={sintomas}
                onChangeText={setSintomas}
                placeholder="Describa sintomas observados"
                multiline={true}
                labelStyle={styles.label}
                style={styles.textArea}
              />
            </View>

            <View style={itemFullStyle}>
              <Input
                label="Diagnostico de laboratorio"
                value={diagnostico}
                onChangeText={setDiagnostico}
                placeholder="Resultado o referencia del diagnostico"
                multiline={true}
                labelStyle={styles.label}
                style={styles.textArea}
              />
            </View>
          </View>
        </Card>

        <Card>
          <SectionTitle title="Tratamiento" icon={ICONS.chemicalContainer} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="¿Usa probiotico?"
                options={SI_NO}
                value={usaProbiotico}
                onChange={setUsaProbiotico}
                placeholder="Seleccione una opcion"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Producto probiotico"
                value={productoProbiotico}
                onChangeText={setProductoProbiotico}
                placeholder="Ej: BIOMIN"
                labelStyle={styles.label}
                editable={usaProbiotico === "si"}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="¿Usa antibiotico?"
                options={SI_NO}
                value={usaAntibiotico}
                onChange={setUsaAntibiotico}
                placeholder="Seleccione una opcion"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Producto antibiotico"
                value={productoAntibiotico}
                onChangeText={setProductoAntibiotico}
                placeholder="Ej: TM700"
                labelStyle={styles.label}
                editable={usaAntibiotico === "si"}
              />
            </View>

            <View style={itemStyle}>
              <NumberInput
                label="Periodo de retiro (dias)"
                value={periodoRetiro}
                onChangeText={setPeriodoRetiro}
                min={0}
                max={365}
                step={1}
                editable={usaAntibiotico === "si"}
                labelStyle={styles.label}
              />
            </View>
          </View>
        </Card>

        <Card>
          <SectionTitle title="Seguimiento" icon={ICONS.update} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Estado del caso"
                options={ESTADOS_CASO}
                value={estadoCaso}
                onChange={setEstadoCaso}
                placeholder="Seleccione el estado"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Proxima revision"
                value={proximaRevision}
                onChangeText={setProximaRevision}
                allowFutureDates={true}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemFullStyle}>
              <Input
                label="Observaciones"
                value={observaciones}
                onChangeText={setObservaciones}
                placeholder="Agregue observaciones"
                multiline={true}
                labelStyle={styles.label}
                style={styles.textArea}
              />
            </View>
          </View>
        </Card>

        <View style={actionsStyle}>
          <Button
            variant="outline"
            onPress={function () {
              setModalVisible(true);
            }}
            style={styles.actionButton}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.info} size={18} color={COLORS.primary} />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.outlineButtonText}
              >
                Ver recomendacion
              </CustomText>
            </View>
          </Button>

          <Button onPress={registrar} style={styles.actionButton}>
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.white} />

              <CustomText
                size={16}
                color={COLORS.white}
                style={styles.saveText}
              >
                Registrar caso
              </CustomText>
            </View>
          </Button>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        onClose={function () {
          setModalVisible(false);
        }}
        closeText="Cerrar"
        overlayStyle={styles.modalOverlay}
        containerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Icon icon={ICONS.certificate} size={26} color={COLORS.primary} />

          <Title
            level={4}
            color={COLORS.textSecondary}
            fuente={TYPOGRAPHY.fontFamily.bold}
            style={styles.modalTitle}
          >
            Recomendacion sanitaria
          </Title>
        </View>

        <CustomText
          size={15}
          color={COLORS.textSecondary}
          style={styles.modalText}
        >
          {obtenerRecomendacion()}
        </CustomText>
      </Modal>
    </ScrollView>
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