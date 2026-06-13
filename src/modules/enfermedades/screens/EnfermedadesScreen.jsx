/**
 * ============================================================
 * SCREEN: ENFERMEDADES
 * ============================================================
 *
 * Pantalla para registrar eventos sanitarios en estanques.
 *
 * Funcionalidad:
 * - Registra casos sanitarios.
 * - Usa DateInput separado para fechas.
 * - Usa Input separado para texto y numeros.
 * - Usa periodo de retiro numerico con botones.
 * - Calcula riesgo por severidad.
 * - Muestra recomendacion sanitaria.
 * - Usa rutas correctas desde modules/enfermedades/screens.
 */

import React, { useState } from "react";
import {ScrollView,View,StyleSheet,TouchableOpacity,Text,useWindowDimensions,} from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Title from "../../../shared/components/Title";
import CustomText from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import Badge from "../../../shared/components/Badge";
import ProgressBar from "../../../shared/components/ProgressBar";
import Modal from "../../../shared/components/Modal";
import Icon from "../../../shared/components/Icons";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

const ESTANQUES = [
  {
    label: "EST-01 - Finca La Reina",
    value: "est-01",
  },
  {
    label: "EST-02 - Finca La Reina",
    value: "est-02",
  },
  {
    label: "EST-03 - Finca La Reina",
    value: "est-03",
  },
];

const EVENTOS = [
  {
    label: "Monitoreo preventivo",
    value: "monitoreo_preventivo",
  },
  {
    label: "Sospecha de enfermedad",
    value: "sospecha_enfermedad",
  },
  {
    label: "Enfermedad confirmada",
    value: "enfermedad_confirmada",
  },
  {
    label: "Mortalidad elevada",
    value: "mortalidad_elevada",
  },
];

const ENFERMEDADES = [
  {
    label: "WSSV - Mancha Blanca",
    value: "wssv",
  },
  {
    label: "AHPND - Necrosis Hepatopancreatica Aguda",
    value: "ahpnd",
  },
  {
    label: "NHP - Necrosis Hepatopancreatica",
    value: "nhp",
  },
  {
    label: "IHHNV",
    value: "ihhnv",
  },
  {
    label: "Vibriosis",
    value: "vibriosis",
  },
  {
    label: "Gregarinas",
    value: "gregarinas",
  },
  {
    label: "Epicomensales",
    value: "epicomensales",
  },
  {
    label: "Otro",
    value: "otro",
  },
];

const SEVERIDADES = [
  {
    label: "Baja",
    value: "baja",
  },
  {
    label: "Media",
    value: "media",
  },
  {
    label: "Alta",
    value: "alta",
  },
  {
    label: "Critica",
    value: "critica",
  },
];

const SI_NO = [
  {
    label: "Si",
    value: "si",
  },
  {
    label: "No",
    value: "no",
  },
];

const ESTADOS_CASO = [
  {
    label: "En observacion",
    value: "observacion",
  },
  {
    label: "En tratamiento",
    value: "tratamiento",
  },
  {
    label: "Controlado",
    value: "controlado",
  },
  {
    label: "Cerrado",
    value: "cerrado",
  },
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
  const [mortalidad, setMortalidad] = useState("");
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
        "Mantener observacion diaria y revisar parametros fisicoquimicos.";
    }

    if (severidad === "media") {
      recomendacion =
        "Aumentar monitoreo, revisar alimentacion y registrar cambios.";
    }

    if (severidad === "alta") {
      recomendacion =
        "Solicitar apoyo tecnico y tomar muestra para diagnostico.";
    }

    if (severidad === "critica") {
      recomendacion =
        "Atender como emergencia sanitaria y dar seguimiento continuo.";
    }

    return recomendacion;
  }

  function cambiarPeriodo(texto) {
    const soloNumeros = texto.replace(/[^0-9]/g, "");

    if (soloNumeros === "") {
      setPeriodoRetiro("0");
      return;
    }

    setPeriodoRetiro(soloNumeros);
  }

  function disminuirPeriodo() {
    const valor = Number(periodoRetiro);

    if (valor > 0) {
      setPeriodoRetiro(String(valor - 1));
    }
  }

  function aumentarPeriodo() {
    const valor = Number(periodoRetiro);
    setPeriodoRetiro(String(valor + 1));
  }

  function validar() {
    let valido = true;

    if (estanque === "") {
      setMensaje("Debe seleccionar el estanque.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && tipoEvento === "") {
      setMensaje("Debe seleccionar el tipo de evento.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && enfermedad === "") {
      setMensaje("Debe seleccionar la enfermedad.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && severidad === "") {
      setMensaje("Debe seleccionar la severidad.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && sintomas === "") {
      setMensaje("Debe describir los sintomas observados.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && diagnostico === "") {
      setMensaje("Debe indicar si existe diagnostico de laboratorio.");
      setTipoMensaje("warning");
      valido = false;
    }

    if (valido === true && usaAntibiotico === "si" && diagnostico !== "si") {
      setMensaje("No registre antibioticos sin diagnostico de laboratorio.");
      setTipoMensaje("danger");
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
    const valido = validar();

    if (valido === false) {
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
      mortalidad: mortalidad,
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
    <ScrollView style={styles.screen}>
      <View style={headerStyle}>
        <TouchableOpacity onPress={volver} style={styles.cancelButton}>
          <Icon icon={ICONS.exit} size={18} color={COLORS.white} />
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Icon
              icon={ICONS.chemicalContainer}
              size={26}
              color={COLORS.primary}
            />
          </View>

          <View>
            <Title level={3} color={COLORS.white} style={styles.headerTitle}>
              Enfermedades
            </Title>

            <CustomText
              size={14}
              color={COLORS.white}
              weight="500"
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

        <Card title="RESUMEN DEL RIESGO" titleStyle={styles.cardTitle}>
          <View style={styles.riskRow}>
            <Icon
              icon={ICONS.notification}
              size={24}
              color={obtenerColorRiesgo()}
            />

            <View style={styles.riskTextBox}>
              <CustomText size={13} color={COLORS.textTertiary} weight="600">
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
            progress={obtenerRiesgo()}
            color={obtenerColorRiesgo()}
            backgroundColor={COLORS.secondary}
          />
        </Card>

        <Card title="IDENTIFICACION" titleStyle={styles.cardTitle}>
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
                placeholder="dd/mm/aaaa"
                allowFutureDates={false}
                labelStyle={styles.label}
                textStyle={styles.inputText}
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

        <Card title="ENFERMEDAD DETECTADA" titleStyle={styles.cardTitle}>
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
                placeholder="Seleccione la severidad"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Mortalidad observada"
                value={mortalidad}
                onChangeText={setMortalidad}
                placeholder="Ej: 20 camarones"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Diagnostico de laboratorio *"
                options={SI_NO}
                value={diagnostico}
                onChange={setDiagnostico}
                placeholder="Seleccione una opcion"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemFullStyle}>
              <Input
                label="Sintomas observados *"
                value={sintomas}
                onChangeText={setSintomas}
                placeholder="Describa sintomas observados"
                multiline={true}
                labelStyle={styles.label}
                style={styles.textArea}
              />
            </View>
          </View>
        </Card>

        <Card title="MANEJO SANITARIO" titleStyle={styles.cardTitle}>
          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Uso de probioticos"
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
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Uso de antibioticos"
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
                placeholder="Ej: oxitetraciclina"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <View style={styles.periodoContainer}>
                <Text style={styles.label}>Periodo de retiro</Text>

                <View style={styles.periodoRow}>
                  <TouchableOpacity
                    style={styles.periodoButton}
                    onPress={disminuirPeriodo}
                  >
                    <Text style={styles.periodoButtonText}>-</Text>
                  </TouchableOpacity>

                  <Input
                    value={periodoRetiro}
                    onChangeText={cambiarPeriodo}
                    keyboardType="numeric"
                    containerStyle={styles.periodoInputContainer}
                    style={styles.periodoInput}
                  />

                  <Text style={styles.periodoSuffix}>(dias)</Text>

                  <TouchableOpacity
                    style={styles.periodoButton}
                    onPress={aumentarPeriodo}
                  >
                    <Text style={styles.periodoButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <Card title="SEGUIMIENTO" titleStyle={styles.cardTitle}>
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
                placeholder="dd/mm/aaaa"
                allowFutureDates={true}
                labelStyle={styles.label}
                textStyle={styles.inputText}
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
            <View style={styles.buttonContentOutline}>
              <Icon icon={ICONS.info} size={18} color={COLORS.primary} />
              <Text style={styles.buttonOutlineText}>Ver recomendacion</Text>
            </View>
          </Button>

          <Button onPress={registrar} style={styles.actionButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={18} color={COLORS.white} />
              <Text style={styles.buttonText}>Registrar caso</Text>
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
            style={styles.modalTitle}
          >
            Recomendacion sanitaria
          </Title>
        </View>

        <CustomText
          size={15}
          color={COLORS.textSecondary}
          weight="500"
          style={styles.modalText}
        >
          {obtenerRecomendacion()}
        </CustomText>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.surface,
  },

  header: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerDesktop: {
    paddingHorizontal: 48,
  },

  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  cancelText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginLeft: 8,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  headerSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginTop: 2,
  },

  content: {
    width: "100%",
    padding: 18,
  },

  contentTablet: {
    paddingHorizontal: 32,
  },

  contentDesktop: {
    paddingHorizontal: 48,
  },

  alert: {
    marginBottom: 14,
  },

  alertText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontWeight: "600",
    marginBottom: 6,
  },

  inputText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  grid: {
    width: "100%",
    flexDirection: "column",
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  gridDesktop: {
    gap: 18,
  },

  gridItem: {
    width: "100%",
  },

  gridItemTablet: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "48%",
  },

  gridItemDesktop: {
    flexBasis: "31%",
  },

  gridItemFull: {
    flexBasis: "100%",
  },

  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  riskTextBox: {
    marginLeft: 12,
    flex: 1,
  },

  badge: {
    marginTop: 6,
  },

  textArea: {
    minHeight: 105,
    textAlignVertical: "top",
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  periodoContainer: {
    width: "100%",
    marginBottom: 12,
  },

  periodoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  periodoButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  periodoButtonText: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  periodoInputContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 0,
  },

  periodoInput: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  periodoSuffix: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginRight: 8,
  },

  actions: {
    marginBottom: 34,
    gap: 12,
  },

  actionsTablet: {
    flexDirection: "row",
  },

  actionButton: {
    flex: 1,
    minHeight: 48,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContentOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginLeft: 8,
  },

  buttonOutlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginLeft: 8,
  },

  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modalContainer: {
    maxWidth: 520,
    borderRadius: 18,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },

  modalTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  modalText: {
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});
