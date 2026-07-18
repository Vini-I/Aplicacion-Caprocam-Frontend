/**
 * ============================================================
 * SCREEN: ENFERMEDADES
 * ============================================================
 *
 * Modulo para registrar enfermedades por finca y estanque.
 *
 * Funcionalidad:
 * - Permite seleccionar finca y estanque.
 * - Permite seleccionar una o varias enfermedades.
 * - Usa DateInput con calendario e icono.
 * - Usa required/submitted estandarizado.
 * - Usa botones outline.
 * - Guarda los registros usando useEnfermedades.
 * - Los registros quedan disponibles para el dashboard.
 *
 * Importante:
 * - Este modulo NO registra parasitos.
 * - Gregarinas y epicomensales pasan a Parasitologia.
 * - NHP queda aqui como enfermedad bacteriana asociada a Hepatobacter penaei.
 */

import React, { useEffect, useState } from "react";
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

import useEnfermedades from "../hooks/UseEnfermedades";
import {
  ENFERMEDADES_CATALOGO,
  SEVERIDADES_ENFERMEDAD,
  obtenerNombreEnfermedad,
  obtenerNombreSeveridad,
  obtenerResponsableBackend,
} from "../services/EnfermedadesService";
import {
  actualizarSeleccionEnfermedad,
  construirCasoEnfermedad,
  obtenerOpcionesEstanques,
  obtenerOpcionesFincas,
  obtenerTextoEnfermedades,
  validarFormularioEnfermedad,
} from "../services/EnfermedadesScreenService";

import { styles } from "../styles/EnfermedadesStyle";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";
import { STYLE } from "../../../theme/style";
import { getCurrentDate } from "../../../shared/utils/dateUtils";

export default function EnfermedadesScreen({ onBack, navigation }) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { enfermedades, loading, error, guardarEnfermedad } = useEnfermedades();

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
  const [responsable, setResponsable] = useState("Cargando responsable...");
  const [enfermedadesSeleccionadas, setEnfermedadesSeleccionadas] = useState(
    [],
  );
  const [severidad, setSeveridad] = useState("");
  const [mortalidad, setMortalidad] = useState("0");
  const [reporte, setReporte] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [submitted, setSubmitted] = useState(false);

  let contentStyle = [STYLE.contentWrapper, styles.content];
  let gridStyle = [styles.grid];
  let itemStyle = [styles.gridItem];
  let itemFullStyle = [styles.gridItem];

  if (esTablet === true) {
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

  useEffect(function () {
    let activo = true;

    async function cargarResponsable() {
      const responsableBackend = await obtenerResponsableBackend();

      if (activo === true) {
        setResponsable(responsableBackend);
      }
    }

    cargarResponsable();

    return function () {
      activo = false;
    };
  }, []);

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

  function cambiarEnfermedad(valor) {
    const nuevasEnfermedades = actualizarSeleccionEnfermedad(
      valor,
      enfermedadesSeleccionadas,
    );

    setEnfermedadesSeleccionadas(nuevasEnfermedades);
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(getCurrentDate());
    setResponsable(responsable);
    setEnfermedadesSeleccionadas([]);
    setSeveridad("");
    setMortalidad("0");
    setReporte("");
    setSubmitted(false);
  }

  function validarFormulario() {
    setSubmitted(true);

    const resultado = validarFormularioEnfermedad({
      finca: finca,
      estanque: estanque,
      enfermedadesSeleccionadas: enfermedadesSeleccionadas,
      severidad: severidad,
      mortalidad: mortalidad,
      reporte: reporte,
    });

    if (resultado.valido === false) {
      setTipoMensaje(resultado.tipoMensaje);
      setMensaje(resultado.mensaje);
    }

    return resultado.valido;
  }

  async function registrarEnfermedad() {
    if (validarFormulario() === false) {
      return;
    }

    const nuevoCaso = construirCasoEnfermedad({
      finca: finca,
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      enfermedadesSeleccionadas: enfermedadesSeleccionadas,
      severidad: severidad,
      mortalidad: mortalidad,
      reporte: reporte,
    });

    const guardado = await guardarEnfermedad(nuevoCaso);

    if (guardado === null) {
      setTipoMensaje("danger");
      setMensaje("No se pudo guardar la enfermedad.");
      return;
    }

    setTipoMensaje("success");
    setMensaje("Enfermedad registrada correctamente.");

    limpiarFormulario();
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Enfermedades"
        Subtitulo="Registro sanitario"
        Icono="shieldAlert"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={contentStyle}>
          {mensaje !== "" && (
            <Alert
              variant={tipoMensaje}
              message={mensaje}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          {error !== "" && (
            <Alert
              variant="danger"
              message={error}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          <Card>
            <SectionTitle title="Ubicacion del caso" icon={ICONS.document} />

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
                  label="Persona encargada"
                  value={responsable}
                  onChangeText={setResponsable}
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

            <View style={styles.optionsGrid}>
              {ENFERMEDADES_CATALOGO.map(function (item) {
                return (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    selectedValues={enfermedadesSeleccionadas}
                    onPress={cambiarEnfermedad}
                  />
                );
              })}
            </View>
          </Card>

          <Card>
            <SectionTitle title="Reporte sanitario" icon={ICONS.info} />

            <View style={gridStyle}>
              <View style={itemStyle}>
                <Select
                  label="Severidad"
                  required={true}
                  submitted={submitted}
                  options={SEVERIDADES_ENFERMEDAD}
                  value={severidad}
                  onChange={setSeveridad}
                  placeholder="Seleccione la severidad"
                  labelStyle={styles.label}
                />
              </View>

              <View style={itemStyle}>
                <NumberInput
                  label="Mortalidad registrada (U)"
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
                  label="Reporte"
                  required={true}
                  submitted={submitted}
                  value={reporte}
                  onChangeText={setReporte}
                  placeholder="Describa sintomas, observaciones o acciones realizadas"
                  multiline={true}
                  labelStyle={styles.label}
                  style={styles.textArea}
                />
              </View>
            </View>
          </Card>

          <Button
            variant="outline"
            onPress={registrarEnfermedad}
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
                Registrar enfermedad
              </CustomText>
            </View>
          </Button>

          <Card>
            <SectionTitle title="Detalles guardados" icon={ICONS.certificate} />

            {enfermedades.length === 0 && (
              <CustomText
                size={14}
                color={COLORS.textTertiary}
                style={styles.emptyText}
              >
                Aun no hay enfermedades registradas.
              </CustomText>
            )}

            {enfermedades.map(function (caso) {
              return <CasoRegistrado key={caso.id} caso={caso} />;
            })}
          </Card>
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

  let buttonStyle = [styles.optionButton];
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

function CasoRegistrado({ caso }) {
  const enfermedadesTexto = obtenerTextoEnfermedades(caso.enfermedades);
  const severidadTexto = obtenerNombreSeveridad(caso.severidad);

  return (
    <View style={styles.savedCase}>
      <CustomText
        size={15}
        color={COLORS.textPrimary}
        style={styles.savedCaseTitle}
      >
        {caso.fincaNombre} - {caso.estanque}
      </CustomText>

      <Info label="Fecha" value={caso.fechaReporte} />
      <Info label="Responsable" value={caso.responsable} />
      <Info label="Enfermedades" value={enfermedadesTexto} />
      <Info label="Severidad" value={severidadTexto} />
      <Info label="Mortalidad" value={caso.mortalidad} />
      <Info label="Reporte" value={caso.reporte} />
    </View>
  );
}

function Info({ label, value }) {
  let valorFinal = value;

  if (value === "") {
    valorFinal = "No registrado";
  }

  if (value === undefined) {
    valorFinal = "No registrado";
  }

  if (value === null) {
    valorFinal = "No registrado";
  }

  return (
    <View style={styles.infoRow}>
      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.infoLabel}
      >
        {label}
      </CustomText>

      <CustomText
        size={14}
        color={COLORS.textSecondary}
        style={styles.infoValue}
      >
        {valorFinal}
      </CustomText>
    </View>
  );
}
