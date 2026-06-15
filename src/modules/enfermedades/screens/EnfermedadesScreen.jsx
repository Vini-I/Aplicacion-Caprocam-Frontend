/**
 * ============================================================
 * SCREEN: ENFERMEDADES
 * ============================================================
 *
 * Pantalla para registrar eventos sanitarios en estanques.
 * Incluye calendario local, periodo de retiro numerico,
 * riesgo por severidad y diseno responsive.
 */

import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  Modal as NativeModal,
} from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
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

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function obtenerFechaActual() {
  return formatearFecha(new Date());
}

function convertirTextoAFecha(texto) {
  const partes = texto.split("/");

  if (partes.length !== 3) {
    return new Date();
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const anio = Number(partes[2]);

  if (Number.isNaN(dia) === true) {
    return new Date();
  }

  if (Number.isNaN(mes) === true) {
    return new Date();
  }

  if (Number.isNaN(anio) === true) {
    return new Date();
  }

  return new Date(anio, mes, dia);
}

function obtenerNombreMes(fecha) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return meses[fecha.getMonth()];
}

function obtenerDiasMes(fecha) {
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const primerDia = new Date(anio, mes, 1).getDay();
  let dias = [];
  let indice = 0;

  while (indice < primerDia) {
    dias.push(null);
    indice = indice + 1;
  }

  let dia = 1;

  while (dia <= totalDias) {
    dias.push(dia);
    dia = dia + 1;
  }

  return dias;
}

function esMismaFecha(fechaUno, fechaDos) {
  let mismaFecha = false;

  if (
    fechaUno.getDate() === fechaDos.getDate() &&
    fechaUno.getMonth() === fechaDos.getMonth() &&
    fechaUno.getFullYear() === fechaDos.getFullYear()
  ) {
    mismaFecha = true;
  }

  return mismaFecha;
}

function CalendarInput({ label, value, onChangeText }) {
  const [visible, setVisible] = useState(false);
  const [mesVisible, setMesVisible] = useState(convertirTextoAFecha(value));

  const fechaSeleccionada = convertirTextoAFecha(value);
  const dias = obtenerDiasMes(mesVisible);

  function abrirCalendario() {
    setMesVisible(convertirTextoAFecha(value));
    setVisible(true);
  }

  function cerrarCalendario() {
    setVisible(false);
  }

  function cambiarMes(cantidad) {
    const nuevaFecha = new Date(
      mesVisible.getFullYear(),
      mesVisible.getMonth() + cantidad,
      1,
    );

    setMesVisible(nuevaFecha);
  }

  function seleccionarDia(dia) {
    const nuevaFecha = new Date(
      mesVisible.getFullYear(),
      mesVisible.getMonth(),
      dia,
    );

    onChangeText(formatearFecha(nuevaFecha));
    setVisible(false);
  }

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.calendarField} onPress={abrirCalendario}>
        <Text style={styles.calendarValue}>{value}</Text>
        <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} />
      </TouchableOpacity>

      <NativeModal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={cerrarCalendario}
      >
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.calendarArrow}
                onPress={function () {
                  cambiarMes(-1);
                }}
              >
                <Text style={styles.calendarArrowText}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.calendarTitle}>
                {obtenerNombreMes(mesVisible)} {mesVisible.getFullYear()}
              </Text>

              <TouchableOpacity
                style={styles.calendarArrow}
                onPress={function () {
                  cambiarMes(1);
                }}
              >
                <Text style={styles.calendarArrowText}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              <Text style={styles.weekText}>D</Text>
              <Text style={styles.weekText}>L</Text>
              <Text style={styles.weekText}>M</Text>
              <Text style={styles.weekText}>M</Text>
              <Text style={styles.weekText}>J</Text>
              <Text style={styles.weekText}>V</Text>
              <Text style={styles.weekText}>S</Text>
            </View>

            <View style={styles.daysGrid}>
              {dias.map(function (dia, index) {
                if (dia === null) {
                  return <View key={`empty-${index}`} style={styles.dayBox} />;
                }

                const fechaDia = new Date(
                  mesVisible.getFullYear(),
                  mesVisible.getMonth(),
                  dia,
                );
                let dayStyle = [styles.dayButton];
                let dayTextStyle = [styles.dayText];

                if (esMismaFecha(fechaDia, fechaSeleccionada) === true) {
                  dayStyle.push(styles.daySelected);
                  dayTextStyle.push(styles.dayTextSelected);
                }

                return (
                  <TouchableOpacity
                    key={`day-${dia}`}
                    style={dayStyle}
                    onPress={function () {
                      seleccionarDia(dia);
                    }}
                  >
                    <Text style={dayTextStyle}>{dia}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button onPress={cerrarCalendario}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </Button>
          </View>
        </View>
      </NativeModal>
    </View>
  );
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
              <CalendarInput
                label="Fecha del reporte *"
                value={fechaReporte}
                onChangeText={setFechaReporte}
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
              <CalendarInput
                label="Proxima revision"
                value={proximaRevision}
                onChangeText={setProximaRevision}
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
  calendarContainer: {
    width: "100%",
    marginBottom: 12,
  },
  calendarField: {
    minHeight: 45,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarValue: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  calendarModal: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  calendarArrow: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarArrowText: {
    color: COLORS.primary,
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    lineHeight: 30,
  },
  calendarTitle: {
    color: COLORS.textSecondary,
    fontSize: 17,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekText: {
    flex: 1,
    textAlign: "center",
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayBox: {
    width: "14.285%",
    height: 42,
  },
  dayButton: {
    width: "14.285%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  daySelected: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  dayTextSelected: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
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
