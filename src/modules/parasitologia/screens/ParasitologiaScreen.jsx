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
 * - Calcula porcentaje de infeccion.
 * - Calcula grado de infeccion.
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

import { FINCAS, ESTANQUES } from "../../registro/screens/RegistroData";

import useParasitologia from "../hooks/useParasitologia";
import {
  PARASITOS_CATALOGO,
  calcularGradoInfeccion,
  obtenerNombreParasito,
} from "../services/PrasitologiaService";

import { styles } from "../styles/ParasitologiaStyle";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function obtenerOpcionesFincas() {
  const opciones = [];

  FINCAS.forEach(function (finca) {
    opciones.push({
      label: finca.nombre,
      value: finca.id,
    });
  });

  return opciones;
}

function obtenerOpcionesEstanques(fincaId) {
  let opciones = [];

  if (fincaId !== "") {
    const estanquesFinca = ESTANQUES[fincaId];

    if (estanquesFinca !== undefined) {
      estanquesFinca.forEach(function (estanque) {
        opciones.push({
          label: `${estanque.id} - ${estanque.especie}`,
          value: estanque.id,
        });
      });
    }
  }

  return opciones;
}

function obtenerNombreFinca(fincaId) {
  let nombre = "";

  FINCAS.forEach(function (finca) {
    if (finca.id === fincaId) {
      nombre = finca.nombre;
    }
  });

  return nombre;
}

function obtenerColorGrado(grado) {
  let color = COLORS.success;

  if (Number(grado) === 2) {
    color = COLORS.warning;
  }

  if (Number(grado) === 3) {
    color = COLORS.error;
  }

  if (Number(grado) === 4) {
    color = COLORS.error;
  }

  return color;
}

export default function ParasitologiaScreen({ onBack, navigation }) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { registrosParasitologia, loading, error, guardarRegistro } =
    useParasitologia();

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
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaActual());
  const [responsable, setResponsable] = useState("");
  const [parasito, setParasito] = useState("");
  const [camaronesMuestreados, setCamaronesMuestreados] = useState("0");
  const [camaronesInfectados, setCamaronesInfectados] = useState("0");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");

  let headerStyle = [styles.header];
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
    headerStyle.push(styles.headerDesktop);
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
    setFechaReporte(obtenerFechaActual());
    setResponsable("");
    setParasito("");
    setCamaronesMuestreados("0");
    setCamaronesInfectados("0");
    setObservaciones("");
  }

  function validarFormulario() {
    let valido = true;

    if (finca === "") {
      setTipoMensaje("warning");
      setMensaje("Debe seleccionar una finca.");
      valido = false;
    }

    if (valido === true && estanque === "") {
      setTipoMensaje("warning");
      setMensaje("Debe seleccionar un estanque.");
      valido = false;
    }

    if (valido === true && fechaReporte === "") {
      setTipoMensaje("warning");
      setMensaje("Debe seleccionar la fecha del reporte.");
      valido = false;
    }

    if (valido === true && parasito === "") {
      setTipoMensaje("warning");
      setMensaje("Debe seleccionar el parasito.");
      valido = false;
    }

    if (valido === true && Number(camaronesMuestreados) <= 0) {
      setTipoMensaje("warning");
      setMensaje("Debe ingresar la cantidad de camarones muestreados.");
      valido = false;
    }

    if (valido === true && Number(camaronesInfectados) < 0) {
      setTipoMensaje("warning");
      setMensaje("Los camarones infectados no pueden ser negativos.");
      valido = false;
    }

    if (
      valido === true &&
      Number(camaronesInfectados) > Number(camaronesMuestreados)
    ) {
      setTipoMensaje("warning");
      setMensaje("Los camarones infectados no pueden superar la muestra.");
      valido = false;
    }

    return valido;
  }

  async function registrarParasitologia() {
    if (validarFormulario() === false) {
      return;
    }

    const nuevoRegistro = {
      finca: finca,
      fincaNombre: obtenerNombreFinca(finca),
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      parasito: parasito,
      camaronesMuestreados: camaronesMuestreados,
      camaronesInfectados: camaronesInfectados,
      observaciones: observaciones.trim(),
    };

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
              Volver
            </CustomText>
          </View>
        </Button>

        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Icon icon={ICONS.parasite} size={28} color={COLORS.primary} />
          </View>

          <View style={styles.headerTextBox}>
            <Title
              level={3}
              color={COLORS.white}
              fuente={TYPOGRAPHY.fontFamily.bold}
            >
              Parasitologia
            </Title>

            <CustomText
              size={14}
              color={COLORS.white}
              style={styles.headerSubtitle}
            >
              Registro por grados de infeccion
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

        {error !== "" && (
          <Alert
            variant="danger"
            message={error}
            style={styles.alert}
            textStyle={styles.alertText}
          />
        )}

        <Card>
          <SectionTitle title="Ubicacion del muestreo" icon={ICONS.document} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Finca *"
                options={opcionesFincas}
                value={finca}
                onChange={cambiarFinca}
                placeholder="Seleccione la finca"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Estanque *"
                options={opcionesEstanques}
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
          </View>
        </Card>

        <Card>
          <SectionTitle title="Conteo parasitologico" icon={ICONS.microscope} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Parasito *"
                options={PARASITOS_CATALOGO}
                value={parasito}
                onChange={setParasito}
                placeholder="Seleccione el parasito"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <NumberInput
                label="Camarones muestreados *"
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
                label="Camarones infectados *"
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

        <Button
          onPress={registrarParasitologia}
          style={styles.saveButton}
          disabled={loading}
        >
          <View style={styles.inlineButtonContentCentered}>
            <Icon icon={ICONS.save} size={18} color={COLORS.white} />

            <CustomText size={16} color={COLORS.white} style={styles.saveText}>
              Registrar parasitologia
            </CustomText>
          </View>
        </Button>

        <Card>
          <SectionTitle title="Detalles guardados" icon={ICONS.certificate} />

          {registrosParasitologia.length === 0 && (
            <CustomText
              size={14}
              color={COLORS.textTertiary}
              style={styles.emptyText}
            >
              Aun no hay registros de parasitologia.
            </CustomText>
          )}

          {registrosParasitologia.map(function (registro) {
            return (
              <RegistroParasitologia key={registro.id} registro={registro} />
            );
          })}
        </Card>
      </View>
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

function RegistroParasitologia({ registro }) {
  const colorGrado = obtenerColorGrado(registro.gradoInfeccion);

  return (
    <View style={styles.savedCase}>
      <View style={styles.savedCaseHeader}>
        <View style={styles.savedCaseTitleBox}>
          <CustomText
            size={15}
            color={COLORS.textPrimary}
            style={styles.savedCaseTitle}
          >
            {registro.fincaNombre} - {registro.estanque}
          </CustomText>

          <CustomText
            size={12}
            color={COLORS.textTertiary}
            style={styles.savedCaseSubtitle}
          >
            {registro.parasitoNombre}
          </CustomText>
        </View>

        <View style={styles.savedGradeBadge}>
          <CustomText size={12} color={colorGrado} weight="800">
            {registro.nombreGrado}
          </CustomText>
        </View>
      </View>

      <Info label="Fecha" value={registro.fechaReporte} />
      <Info label="Responsable" value={registro.responsable} />
      <Info label="Parasito" value={obtenerNombreParasito(registro.parasito)} />
      <Info label="Muestreados" value={registro.camaronesMuestreados} />
      <Info label="Infectados" value={registro.camaronesInfectados} />
      <Info label="Porcentaje" value={`${registro.porcentajeInfeccion}%`} />
      <Info label="Descripcion" value={registro.descripcionGrado} />
      <Info label="Observaciones" value={registro.observaciones} />
    </View>
  );
}

function Info({ label, value }) {
  let valorFinal = value;

  if (valorFinal === "") {
    valorFinal = "No registrado";
  }

  if (valorFinal === undefined) {
    valorFinal = "No registrado";
  }

  if (valorFinal === null) {
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
