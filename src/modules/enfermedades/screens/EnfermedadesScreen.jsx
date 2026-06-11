/**
 * ============================================================
 * PANTALLA: ENFERMEDADES SCREEN
 * ============================================================
 *
 * Esta pantalla permite registrar un evento sanitario o una
 * enfermedad detectada en un estanque de cultivo de camaron.
 *
 * Funcionalidad general:
 * - Muestra un encabezado con boton de cancelar.
 * - Permite seleccionar el estanque relacionado con el caso.
 * - Permite registrar fecha del reporte mediante calendario local.
 * - Permite registrar proxima revision mediante calendario local.
 * - Ambas fechas toman por defecto la fecha actual.
 * - El calendario muestra un icono y se abre al presionar el campo.
 * - Permite seleccionar fechas anteriores y futuras.
 * - Permite seleccionar tipo de evento sanitario.
 * - Permite seleccionar enfermedad o agente detectado.
 * - Permite seleccionar severidad.
 * - Permite registrar mortalidad y sintomas observados.
 * - Permite indicar si existe diagnostico de laboratorio.
 * - Permite registrar uso de probioticos.
 * - Permite registrar uso de antibioticos.
 * - El periodo de retiro se maneja como contador numerico.
 * - La palabra dias aparece fuera del numero.
 * - Valida campos obligatorios antes de registrar.
 * - Muestra nivel de riesgo con barra de progreso.
 * - Muestra recomendacion sanitaria en modal.
 *
 * Responsive:
 * - En celular, los campos se muestran en una columna.
 * - En tablet, los campos se muestran en dos columnas.
 * - En PC, el contenido ocupa todo el ancho y usa tres columnas.
 *
 * Temas utilizados:
 * - COLORS: colores centralizados de la aplicacion.
 * - TYPOGRAPHY: familia tipografica Roboto.
 * - ICONS: iconos centralizados de la aplicacion.
 */

import React, { useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, useWindowDimensions, Modal as NativeModal, } from "react-native";

import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Title from "../components/Title";
import CustomText from "../components/Text";
import Alert from "../components/Alert";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import CustomModal from "../components/Modal";
import Icon from "../components/Icons";

import { COLORS } from "../theme/colors";
import { TYPOGRAPHY } from "../theme/typography";
import { ICONS } from "../theme/icons";

function obtenerFechaActual() {
  const fecha = new Date();

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
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

function obtenerDiasDelMes(fecha) {
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const primerDiaSemana = new Date(anio, mes, 1).getDay();

  let dias = [];
  let indice = 0;

  while (indice < primerDiaSemana) {
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
  let misma = false;

  if (
    fechaUno.getDate() === fechaDos.getDate() &&
    fechaUno.getMonth() === fechaDos.getMonth() &&
    fechaUno.getFullYear() === fechaDos.getFullYear()
  ) {
    misma = true;
  }

  return misma;
}

function CalendarInput({ label, value, onChangeText, placeholder }) {
  const [visible, setVisible] = useState(false);
  const [mesVisible, setMesVisible] = useState(convertirTextoAFecha(value));

  const fechaSeleccionada = convertirTextoAFecha(value);
  const dias = obtenerDiasDelMes(mesVisible);

  let textoValor = placeholder;

  if (value !== "") {
    textoValor = value;
  }

  function abrirCalendario() {
    setMesVisible(convertirTextoAFecha(value));
    setVisible(true);
  }

  function cerrarCalendario() {
    setVisible(false);
  }

  function irMesAnterior() {
    const nuevaFecha = new Date(
      mesVisible.getFullYear(),
      mesVisible.getMonth() - 1,
      1,
    );

    setMesVisible(nuevaFecha);
  }

  function irMesSiguiente() {
    const nuevaFecha = new Date(
      mesVisible.getFullYear(),
      mesVisible.getMonth() + 1,
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
    <View style={styles.calendarInputContainer}>
      <Text style={styles.calendarLabel}>{label}</Text>

      <TouchableOpacity style={styles.calendarField} onPress={abrirCalendario}>
        <Text style={styles.calendarValue}>{textoValor}</Text>

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
                onPress={irMesAnterior}
              >
                <Text style={styles.calendarArrowText}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.calendarTitle}>
                {obtenerNombreMes(mesVisible)} {mesVisible.getFullYear()}
              </Text>

              <TouchableOpacity
                style={styles.calendarArrow}
                onPress={irMesSiguiente}
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

            <TouchableOpacity
              style={styles.calendarCloseButton}
              onPress={cerrarCalendario}
            >
              <Text style={styles.calendarCloseText}>Cerrar</Text>
            </TouchableOpacity>
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
  const [diagnosticoLaboratorio, setDiagnosticoLaboratorio] = useState("");
  const [usaProbiotico, setUsaProbiotico] = useState("");
  const [productoProbiotico, setProductoProbiotico] = useState("");
  const [dosisProbiotico, setDosisProbiotico] = useState("");
  const [frecuenciaProbiotico, setFrecuenciaProbiotico] = useState("");
  const [usaAntibiotico, setUsaAntibiotico] = useState("");
  const [productoAntibiotico, setProductoAntibiotico] = useState("");
  const [periodoRetiro, setPeriodoRetiro] = useState("0");
  const [observaciones, setObservaciones] = useState("");
  const [estadoCaso, setEstadoCaso] = useState("");
  const [proximaRevision, setProximaRevision] = useState(obtenerFechaActual());
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [modalVisible, setModalVisible] = useState(false);

  let headerStyle = [styles.header];

  if (esDesktop === true) {
    headerStyle.push(styles.headerDesktop);
  }

  let headerContentStyle = [styles.headerContent];

  if (esDesktop === true) {
    headerContentStyle.push(styles.headerContentFull);
  }

  let contentStyle = [styles.content];

  if (esTablet === true) {
    contentStyle.push(styles.contentTablet);
  }

  if (esDesktop === true) {
    contentStyle.push(styles.contentDesktop);
  }

  let gridStyle = [styles.grid];

  if (esTablet === true) {
    gridStyle.push(styles.gridTablet);
  }

  if (esDesktop === true) {
    gridStyle.push(styles.gridDesktop);
  }

  let gridItemStyle = [styles.gridItem];

  if (esTablet === true) {
    gridItemStyle.push(styles.gridItemTablet);
  }

  if (esDesktop === true) {
    gridItemStyle.push(styles.gridItemDesktop);
  }

  let fullGridItemStyle = [styles.gridItem];

  if (esTablet === true) {
    fullGridItemStyle.push(styles.gridItemFull);
  }

  if (esDesktop === true) {
    fullGridItemStyle.push(styles.gridItemFull);
  }

  let actionsStyle = [styles.actions];

  if (esTablet === true) {
    actionsStyle.push(styles.actionsTablet);
  }

  let actionButtonStyle = [styles.actionButton];

  if (esTablet === true) {
    actionButtonStyle.push(styles.actionButtonTablet);
  }

  const estanques = [
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

  const tiposEvento = [
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

  const enfermedades = [
    {
      label: "WSSV - Sindrome de la Mancha Blanca",
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
      label: "IHHNV - Necrosis Infecciosa Hipodermica y Hematopoyetica",
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

  const nivelesSeveridad = [
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

  const opcionesSiNo = [
    {
      label: "Si",
      value: "si",
    },
    {
      label: "No",
      value: "no",
    },
  ];

  const estadosCaso = [
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

  function cancelar() {
    if (navigation) {
      navigation.goBack();
    }
  }

  function obtenerProgresoRiesgo() {
    let progreso = 0;

    if (severidad === "baja") {
      progreso = 25;
    }

    if (severidad === "media") {
      progreso = 50;
    }

    if (severidad === "alta") {
      progreso = 75;
    }

    if (severidad === "critica") {
      progreso = 100;
    }

    return progreso;
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

  function obtenerEtiquetaRiesgo() {
    let etiqueta = "Sin clasificar";

    if (severidad === "baja") {
      etiqueta = "Riesgo bajo";
    }

    if (severidad === "media") {
      etiqueta = "Riesgo medio";
    }

    if (severidad === "alta") {
      etiqueta = "Riesgo alto";
    }

    if (severidad === "critica") {
      etiqueta = "Riesgo critico";
    }

    return etiqueta;
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
      "Complete la informacion del caso sanitario para generar una recomendacion.";

    if (severidad === "baja") {
      recomendacion =
        "Mantener observacion diaria, revisar parametros fisicoquimicos y reforzar el manejo preventivo del estanque.";
    }

    if (severidad === "media") {
      recomendacion =
        "Aumentar el monitoreo, revisar alimentacion, oxigeno, temperatura, salinidad y registrar cambios en mortalidad.";
    }

    if (severidad === "alta") {
      recomendacion =
        "Solicitar apoyo tecnico, tomar muestra para diagnostico y evitar aplicar antibioticos sin confirmacion del problema.";
    }

    if (severidad === "critica") {
      recomendacion =
        "Atender el caso como emergencia sanitaria, solicitar diagnostico, documentar acciones y dar seguimiento continuo al estanque.";
    }

    return recomendacion;
  }

  function mostrarRecomendacion() {
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
  }

  function disminuirPeriodoRetiro() {
    const valorActual = Number(periodoRetiro);

    if (valorActual > 0) {
      const nuevoValor = valorActual - 1;
      setPeriodoRetiro(String(nuevoValor));
    }
  }

  function aumentarPeriodoRetiro() {
    const valorActual = Number(periodoRetiro);
    const nuevoValor = valorActual + 1;

    setPeriodoRetiro(String(nuevoValor));
  }

  function cambiarPeriodoRetiro(texto) {
    const soloNumeros = texto.replace(/[^0-9]/g, "");

    if (soloNumeros === "") {
      setPeriodoRetiro("0");
      return;
    }

    setPeriodoRetiro(soloNumeros);
  }

  function validarFormulario() {
    let formularioValido = true;

    if (estanque === "") {
      setMensaje("Debe seleccionar el estanque relacionado con el caso.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && fechaReporte === "") {
      setMensaje("Debe seleccionar la fecha del reporte.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && tipoEvento === "") {
      setMensaje("Debe seleccionar el tipo de evento sanitario.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && enfermedad === "") {
      setMensaje("Debe seleccionar la enfermedad o agente detectado.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && severidad === "") {
      setMensaje("Debe seleccionar la severidad del caso.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && sintomas === "") {
      setMensaje("Debe describir los sintomas observados.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && diagnosticoLaboratorio === "") {
      setMensaje("Debe indicar si existe diagnostico de laboratorio.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (
      formularioValido === true &&
      usaAntibiotico === "si" &&
      diagnosticoLaboratorio !== "si"
    ) {
      setMensaje(
        "Antes de registrar antibioticos, indique un diagnostico de laboratorio.",
      );
      setTipoMensaje("danger");
      formularioValido = false;
    }

    if (
      formularioValido === true &&
      usaAntibiotico === "si" &&
      productoAntibiotico === ""
    ) {
      setMensaje("Debe indicar el producto antibiotico utilizado.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (
      formularioValido === true &&
      usaAntibiotico === "si" &&
      Number(periodoRetiro) <= 0
    ) {
      setMensaje("Debe indicar un periodo de retiro mayor a 0 dias.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    return formularioValido;
  }

  function registrarCasoSanitario() {
    const formularioValido = validarFormulario();

    if (formularioValido === false) {
      return;
    }

    const nuevoCasoSanitario = {
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      tipoEvento: tipoEvento,
      enfermedad: enfermedad,
      severidad: severidad,
      nivelRiesgo: obtenerProgresoRiesgo(),
      mortalidad: mortalidad,
      sintomas: sintomas,
      diagnosticoLaboratorio: diagnosticoLaboratorio,
      usaProbiotico: usaProbiotico,
      productoProbiotico: productoProbiotico,
      dosisProbiotico: dosisProbiotico,
      frecuenciaProbiotico: frecuenciaProbiotico,
      usaAntibiotico: usaAntibiotico,
      productoAntibiotico: productoAntibiotico,
      periodoRetiroDias: Number(periodoRetiro),
      observaciones: observaciones,
      estadoCaso: estadoCaso,
      proximaRevision: proximaRevision,
      recomendacion: obtenerRecomendacion(),
    };

    console.log("Caso sanitario registrado:", nuevoCasoSanitario);

    setMensaje("Caso sanitario registrado correctamente.");
    setTipoMensaje("success");
    setModalVisible(true);
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={headerStyle}>
        <View style={headerContentStyle}>
          <TouchableOpacity onPress={cancelar} style={styles.cancelarButton}>
            <Icon icon={ICONS.exit} size={18} color={COLORS.white} />
            <Text style={styles.cancelar}>Cancelar</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <View style={styles.headerIcon}>
              <Icon
                icon={ICONS.chemicalContainer}
                size={26}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.headerTextContainer}>
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

          <View style={styles.headerBadges}>
            <Badge
              label="Sanidad"
              variant="info"
              style={styles.headerBadge}
              textStyle={styles.headerBadgeText}
            />

            <Badge
              label="Camaron"
              variant="success"
              style={styles.headerBadge}
              textStyle={styles.headerBadgeText}
            />
          </View>
        </View>
      </View>

      <View style={contentStyle}>
        {mensaje !== "" && (
          <View style={styles.alertWrapper}>
            <Alert
              variant={tipoMensaje}
              message={mensaje}
              textStyle={styles.alertText}
            />
          </View>
        )}

        <Card title="RESUMEN DEL RIESGO" titleStyle={styles.cardTitle}>
          <View style={styles.riskHeader}>
            <View style={styles.riskIcon}>
              <Icon
                icon={ICONS.notification}
                size={24}
                color={obtenerColorRiesgo()}
              />
            </View>

            <View style={styles.riskInfo}>
              <CustomText
                size={13}
                color={COLORS.textTertiary}
                weight="600"
                style={styles.robotoMedium}
              >
                Nivel sanitario actual
              </CustomText>

              <Badge
                label={obtenerEtiquetaRiesgo()}
                variant={obtenerVarianteRiesgo()}
                style={styles.riskBadge}
                textStyle={styles.badgeText}
              />
            </View>
          </View>

          <ProgressBar
            progress={obtenerProgresoRiesgo()}
            color={obtenerColorRiesgo()}
            backgroundColor={COLORS.secondary}
            style={styles.progress}
          />

          <CustomText
            size={13}
            color={COLORS.textTertiary}
            weight="400"
            style={styles.riskHelp}
          >
            El riesgo se calcula segun la severidad seleccionada para el caso
            sanitario.
          </CustomText>
        </Card>

        <Card title="IDENTIFICACION" titleStyle={styles.cardTitle}>
          <View style={gridStyle}>
            <View style={gridItemStyle}>
              <Select
                label="Estanque relacionado *"
                options={estanques}
                value={estanque}
                onChange={setEstanque}
                placeholder="Seleccione el estanque"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={gridItemStyle}>
              <CalendarInput
                label="Fecha del reporte *"
                value={fechaReporte}
                onChangeText={setFechaReporte}
                placeholder="dd/mm/aaaa"
              />
            </View>

            <View style={gridItemStyle}>
              <Input
                label="Responsable"
                value={responsable}
                onChangeText={setResponsable}
                placeholder="Nombre de quien realiza el reporte"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={gridItemStyle}>
              <Select
                label="Tipo de evento sanitario *"
                options={tiposEvento}
                value={tipoEvento}
                onChange={setTipoEvento}
                placeholder="Seleccione el tipo de evento"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>
          </View>
        </Card>

        <Card title="ENFERMEDAD DETECTADA" titleStyle={styles.cardTitle}>
          <View style={gridStyle}>
            <View style={gridItemStyle}>
              <Select
                label="Enfermedad o agente detectado *"
                options={enfermedades}
                value={enfermedad}
                onChange={setEnfermedad}
                placeholder="Seleccione la enfermedad"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={gridItemStyle}>
              <Select
                label="Severidad *"
                options={nivelesSeveridad}
                value={severidad}
                onChange={setSeveridad}
                placeholder="Seleccione la severidad"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={gridItemStyle}>
              <Input
                label="Mortalidad observada"
                value={mortalidad}
                onChangeText={setMortalidad}
                placeholder="Ej: 20 camarones, baja, alta o sin mortalidad"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={gridItemStyle}>
              <Select
                label="Diagnostico de laboratorio *"
                options={opcionesSiNo}
                value={diagnosticoLaboratorio}
                onChange={setDiagnosticoLaboratorio}
                placeholder="Seleccione una opcion"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={fullGridItemStyle}>
              <Input
                label="Sintomas observados *"
                value={sintomas}
                onChangeText={setSintomas}
                placeholder="Describa coloracion, comportamiento, alimentacion, bordes del estanque o mortalidad"
                multiline={true}
                labelStyle={styles.label}
                style={styles.textArea}
              />
            </View>
          </View>
        </Card>

        <Card
          title="MANEJO PREVENTIVO CON PROBIOTICOS"
          titleStyle={styles.cardTitle}
        >
          <View style={styles.infoBox}>
            <Icon icon={ICONS.info} size={20} color={COLORS.primary} />

            <CustomText
              size={13}
              color={COLORS.textSecondary}
              weight="500"
              style={styles.infoText}
            >
              Los probioticos se registran como apoyo preventivo para mejorar el
              ambiente del estanque y el manejo sanitario.
            </CustomText>
          </View>

          <View style={gridStyle}>
            <View style={gridItemStyle}>
              <Select
                label="Uso de probioticos"
                options={opcionesSiNo}
                value={usaProbiotico}
                onChange={setUsaProbiotico}
                placeholder="Seleccione una opcion"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={gridItemStyle}>
              <Input
                label="Producto probiotico"
                value={productoProbiotico}
                onChangeText={setProductoProbiotico}
                placeholder="Ej: BIOMIN o Bacillus subtilis"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={gridItemStyle}>
              <Input
                label="Dosis"
                value={dosisProbiotico}
                onChangeText={setDosisProbiotico}
                placeholder="Ej: 0.3 kg/ha"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={gridItemStyle}>
              <Input
                label="Frecuencia"
                value={frecuenciaProbiotico}
                onChangeText={setFrecuenciaProbiotico}
                placeholder="Ej: semanal"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>
          </View>
        </Card>

        <Card title="USO DE ANTIBIOTICOS" titleStyle={styles.cardTitle}>
          <View style={styles.warningBox}>
            <Icon icon={ICONS.notification} size={20} color={COLORS.warning} />

            <CustomText
              size={13}
              color={COLORS.textSecondary}
              weight="500"
              style={styles.infoText}
            >
              Registre antibioticos solo cuando exista diagnostico y control del
              periodo de retiro.
            </CustomText>
          </View>

          <View style={gridStyle}>
            <View style={gridItemStyle}>
              <Select
                label="Uso de antibioticos"
                options={opcionesSiNo}
                value={usaAntibiotico}
                onChange={setUsaAntibiotico}
                placeholder="Seleccione una opcion"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={gridItemStyle}>
              <Input
                label="Producto antibiotico"
                value={productoAntibiotico}
                onChangeText={setProductoAntibiotico}
                placeholder="Ej: TM700 u oxitetraciclina"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={gridItemStyle}>
              <View style={styles.periodoContainer}>
                <Text style={styles.periodoLabel}>
                  Periodo de retiro (dias)
                </Text>

                <View style={styles.periodoControl}>
                  <TouchableOpacity
                    style={styles.periodoButton}
                    onPress={disminuirPeriodoRetiro}
                  >
                    <Text style={styles.periodoButtonText}>-</Text>
                  </TouchableOpacity>

                  <Input
                    value={periodoRetiro}
                    onChangeText={cambiarPeriodoRetiro}
                    keyboardType="numeric"
                    placeholder="0"
                    containerStyle={styles.periodoInputContainer}
                    style={styles.periodoInput}
                  />

                  <Text style={styles.periodoSuffix}>(dias)</Text>

                  <TouchableOpacity
                    style={styles.periodoButton}
                    onPress={aumentarPeriodoRetiro}
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
            <View style={gridItemStyle}>
              <Select
                label="Estado del caso"
                options={estadosCaso}
                value={estadoCaso}
                onChange={setEstadoCaso}
                placeholder="Seleccione el estado"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={gridItemStyle}>
              <CalendarInput
                label="Proxima revision"
                value={proximaRevision}
                onChangeText={setProximaRevision}
                placeholder="dd/mm/aaaa"
              />
            </View>

            <View style={fullGridItemStyle}>
              <Input
                label="Observaciones"
                value={observaciones}
                onChangeText={setObservaciones}
                placeholder="Agregue recomendaciones, acciones realizadas o cambios observados"
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
            onPress={mostrarRecomendacion}
            style={actionButtonStyle}
          >
            <View style={styles.buttonContentOutline}>
              <Icon icon={ICONS.info} size={18} color={COLORS.primary} />
              <Text style={styles.buttonOutlineText}>Ver recomendacion</Text>
            </View>
          </Button>

          <Button onPress={registrarCasoSanitario} style={actionButtonStyle}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={18} color={COLORS.white} />
              <Text style={styles.buttonText}>Registrar caso</Text>
            </View>
          </Button>
        </View>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={cerrarModal}
        closeText="Cerrar"
        overlayStyle={styles.modalOverlay}
        containerStyle={styles.modalContainer}
        buttonStyle={styles.modalButton}
        buttonTextStyle={styles.modalButtonText}
      >
        <View style={styles.modalHeader}>
          <View style={styles.modalIcon}>
            <Icon icon={ICONS.certificate} size={26} color={COLORS.primary} />
          </View>

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

        <View style={styles.modalBadgeContainer}>
          <Badge
            label={obtenerEtiquetaRiesgo()}
            variant={obtenerVarianteRiesgo()}
            textStyle={styles.badgeText}
          />
        </View>
      </CustomModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
    width: "100%",
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    width: "100%",
  },

  headerDesktop: {
    paddingHorizontal: 48,
  },

  headerContent: {
    width: "100%",
  },

  headerContentFull: {
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },

  cancelarButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  cancelar: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  headerTitleRow: {
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

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 2,
  },

  headerSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  headerBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
    gap: 8,
  },

  headerBadge: {
    backgroundColor: COLORS.white,
  },

  headerBadgeText: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  content: {
    width: "100%",
    padding: 18,
  },

  contentTablet: {
    paddingHorizontal: 32,
  },

  contentDesktop: {
    width: "100%",
    maxWidth: "100%",
    paddingHorizontal: 48,
    alignSelf: "stretch",
  },

  alertWrapper: {
    marginBottom: 16,
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
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  input: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  inputText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  robotoMedium: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  grid: {
    flexDirection: "column",
    width: "100%",
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  gridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "31%",
  },

  gridItemFull: {
    flexBasis: "100%",
  },

  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  riskIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  riskInfo: {
    flex: 1,
  },

  riskBadge: {
    marginTop: 6,
  },

  badgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  progress: {
    marginTop: 6,
  },

  riskHelp: {
    marginTop: 10,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },

  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.warningLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    lineHeight: 19,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  calendarInputContainer: {
    width: "100%",
    marginBottom: 12,
  },

  calendarLabel: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  calendarField: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.textQuaternary,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  calendarValue: {
    color: COLORS.textSecondary,
    fontSize: 15,
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
    borderRadius: 18,
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
    fontWeight: "700",
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

  calendarCloseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },

  calendarCloseText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  periodoContainer: {
    width: "100%",
    marginBottom: 12,
  },

  periodoLabel: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  periodoControl: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  periodoButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  periodoButtonText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  periodoInputContainer: {
    flex: 1,
    marginBottom: 0,
    marginHorizontal: 8,
  },

  periodoInput: {
    textAlign: "center",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
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
    minHeight: 48,
  },

  actionButtonTablet: {
    flex: 1,
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
    fontWeight: "700",
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  buttonOutlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modalContainer: {
    width: "92%",
    maxWidth: 520,
    borderRadius: 18,
    padding: 22,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  modalIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  modalTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  modalText: {
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  modalBadgeContainer: {
    marginTop: 16,
  },

  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  modalButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
