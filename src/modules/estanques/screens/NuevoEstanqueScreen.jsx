/**
 * ============================================================
 * PANTALLA NUEVO ESTANQUE
 * ============================================================
 *
 * Registra un nuevo estanque usando componentes compartidos.
 *
 * Cambios aplicados segun estandar:
 * - Fechas centralizadas con dateUtils.
 * - DateInput con calendario e icono global.
 * - Campos requeridos usando required y submitted.
 * - Boton principal en variante outline.
 * - Select de aireador requerido solo cuando aplica.
 */

import { useEstanque } from "../context/EstanqueContext";
import { useFinca } from "../../finca/context/FincaContext"

import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
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

import { getCurrentDate } from "../../../shared/utils/dateUtils";

import { styles } from "../styles/EstanqueStyle";
import { STYLE } from "../../../theme/style";

import {
  obtenerOpcionesEstanqueSeleccionado,
} from "../services/AireadoresEstanqueService";
import {
  AIREADORES_EXISTENTES,
  ESPECIES,
  ESTADOS_ESTANQUE,
  FUENTES_AGUA,
  METODOS_ALIMENTACION,
  OPCIONES_AIREADORES,
  OPCIONES_ALIMENTADOR,
  OPCIONES_PRECRIA,
  TIPOS_ESTANQUE,
  construirNuevoEstanque,
  obtenerCambioAireadores,
  validarFormularioEstanque,
} from "../services/EstanqueScreenService";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function NuevoEstanqueScreen({ navigation, codigoCBO }) {
  const router = useRouter();

  const { crearEstanque } = useEstanque();
  const { buscarFinca } = useFinca();

  const [finca, setFinca] = useState(null);

  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("activo");
  const [tipoEstanque, setTipoEstanque] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [profundidad, setProfundidad] = useState("");
  const [fuenteAgua, setFuenteAgua] = useState("");
  const [especie, setEspecie] = useState("litopenaeus_vannamei");
  const [fechaSiembra, setFechaSiembra] = useState(getCurrentDate());
  const [fechaInicioEngorde, setFechaInicioEngorde] =
    useState(getCurrentDate());
  const [fechaMantenimiento, setFechaMantenimiento] =
    useState(getCurrentDate());
  const [densidadSiembra, setDensidadSiembra] = useState("12");
  const [precria, setPrecria] = useState("");
  const [metodoAlimentacion, setMetodoAlimentacion] = useState("");
  const [proveedorAlimento, setProveedorAlimento] = useState("Biomar");
  const [numeroAireadores, setNumeroAireadores] = useState("0");
  const [tieneAireadores, setTieneAireadores] = useState("no");
  const [codigoAireador, setCodigoAireador] = useState("");
  const [tieneAlimentadorAutomatico, setTieneAlimentadorAutomatico] =
    useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [submitted, setSubmitted] = useState(false);

  async function obtenerFinca(){
    const data = await buscarFinca(codigoCBO);
    setFinca(data);
  }

  useEffect(() => {
    obtenerFinca();
  }, []);

  function cancelar() {
    if (navigation) {
      navigation.goBack();
      return;
    }

    router.back();
  }

  function mostrarError(texto) {
    setTipoMensaje("warning");
    setMensaje(texto);
  }

  function manejarTieneAireadores(valor) {
    const cambio = obtenerCambioAireadores(valor, codigoAireador);

    setTieneAireadores(valor);
    setNumeroAireadores(cambio.numeroAireadores);
    setCodigoAireador(cambio.codigoAireador);
  }

  function validarFormulario() {
    setSubmitted(true);

    const resultado = validarFormularioEstanque({
      codigo: codigo,
      tipoEstanque: tipoEstanque,
      largo: largo,
      ancho: ancho,
      profundidad: profundidad,
      fechaSiembra: fechaSiembra,
      densidadSiembra: densidadSiembra,
      tieneAireadores: tieneAireadores,
      codigoAireador: codigoAireador,
    });

    if (resultado.valido === false) {
      setTipoMensaje(resultado.tipoMensaje);
      setMensaje(resultado.mensaje);
    }

    return resultado.valido;
  }

  async function registrarEstanque() {
    if (validarFormulario() === false) {
      return;
    }
    
    const { NuevoEstanqueDTO } = construirNuevoEstanque({
      idFinca: finca.id,
      codigo: codigo,
      estado: estado,
      tipoEstanque: tipoEstanque,
      largo: Number(largo),
      ancho: Number(ancho),
      profundidad: Number(profundidad),
      fuenteAgua: fuenteAgua,
      especie: especie,
      fechaSiembra: fechaSiembra,
      fechaInicioEngorde: fechaInicioEngorde,
      fechaMantenimiento: fechaMantenimiento,
      densidadSiembra: Number(densidadSiembra),
      precria: precria,
      metodoAlimentacion: metodoAlimentacion,
      proveedorAlimento: proveedorAlimento,
      numeroAireadores: Number(numeroAireadores),
      tieneAireadores: tieneAireadores,
      codigoAireador: codigoAireador,
      tieneAlimentadorAutomatico: tieneAlimentadorAutomatico,
    });

    try {
      await crearEstanque(NuevoEstanqueDTO);

      setTipoMensaje("success");
      setMensaje("Estanque creado correctamente.");

      setTimeout(function () {
        router.push({
          pathname: `/finca/detalle?id=${finca.id}`,
        });
      }, 900);
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(error.response?.data?.message || "Error al guardar los cambios.");
    }
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Nuevo Estanque"
        Subtitulo={`${finca?.nombreFinca ?? "Cargando..."}`}
        Icono="water"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          <Card>
            <SectionTitle title="Identificacion" icon={ICONS.document} />

            <Input
              label="Codigo del estanque"
              required={true}
              submitted={submitted}
              value={codigo}
              onChangeText={setCodigo}
              placeholder="Ej: EST-01"
              labelStyle={styles.label}
            />

            <Select
              label="Tipo de estanque"
              required={true}
              submitted={submitted}
              options={TIPOS_ESTANQUE}
              value={tipoEstanque}
              onChange={setTipoEstanque}
              placeholder="Seleccione el tipo"
              labelStyle={styles.label}
            />

            <CustomText
              size={14}
              color={COLORS.textPrimary}
              style={styles.labelText}
            >
              Estado del estanque
            </CustomText>

            <View style={styles.optionsGrid}>
              {ESTADOS_ESTANQUE.map(function (item) {
                return (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    selectedValue={estado}
                    onPress={setEstado}
                  />
                );
              })}
            </View>
          </Card>

          <Card>
            <SectionTitle title="Dimensiones" icon={ICONS.ruler} />

            <View style={styles.twoColumns}>
              <View style={styles.column}>
                <Input
                  label="Largo (m)"
                  required={true}
                  submitted={submitted}
                  value={largo}
                  onChangeText={setLargo}
                  placeholder="Ej: 100"
                  keyboardType="numeric"
                  numericOnly
                  labelStyle={styles.label}
                />
              </View>

              <View style={styles.column}>
                <Input
                  label="Ancho (m)"
                  required={true}
                  submitted={submitted}
                  value={ancho}
                  onChangeText={setAncho}
                  placeholder="Ej: 80"
                  keyboardType="numeric"
                  numericOnly
                  labelStyle={styles.label}
                />
              </View>
            </View>

            <Input
              label="Profundidad (m)"
              required={true}
              submitted={submitted}
              value={profundidad}
              onChangeText={setProfundidad}
              placeholder="Ej: 0.80"
              keyboardType="numeric"
              numericOnly
              labelStyle={styles.label}
            />

            <Select
              label="Fuente de agua"
              options={FUENTES_AGUA}
              value={fuenteAgua}
              onChange={setFuenteAgua}
              placeholder="Seleccione la fuente"
              labelStyle={styles.label}
            />
          </Card>

          <Card>
            <SectionTitle title="Siembra y fechas" icon={ICONS.calendar} />

            <Select
              label="Especie"
              options={ESPECIES}
              value={especie}
              onChange={setEspecie}
              placeholder="Seleccione la especie"
              labelStyle={styles.label}
            />

            <DateInput
              label="Fecha de siembra"
              required={true}
              submitted={submitted}
              value={fechaSiembra}
              onChangeText={setFechaSiembra}
              labelStyle={styles.label}
            />

            <DateInput
              label="Fecha inicio de engorde"
              value={fechaInicioEngorde}
              onChangeText={setFechaInicioEngorde}
              labelStyle={styles.label}
            />

            <DateInput
              label="Fecha mantenimiento"
              value={fechaMantenimiento}
              onChangeText={setFechaMantenimiento}
              labelStyle={styles.label}
            />

            <NumberInput
              label="Densidad de siembra (ind/m2)"
              required={true}
              submitted={submitted}
              value={densidadSiembra}
              onChangeText={setDensidadSiembra}
              min={0}
              max={9999}
              step={1}
              labelStyle={styles.label}
            />

            <Select
              label="Precria"
              options={OPCIONES_PRECRIA}
              value={precria}
              onChange={setPrecria}
              placeholder="Seleccione si usa precria"
              labelStyle={styles.label}
            />
          </Card>

          <Card>
            <SectionTitle title="Alimentacion y equipos" icon={ICONS.food} />

            <Select
              label="Metodo de alimentacion"
              options={METODOS_ALIMENTACION}
              value={metodoAlimentacion}
              onChange={setMetodoAlimentacion}
              placeholder="Seleccione el metodo"
              labelStyle={styles.label}
            />

            <Input
              label="Proveedor de alimento"
              value={proveedorAlimento}
              onChangeText={setProveedorAlimento}
              placeholder="Ej: Biomar"
              labelStyle={styles.label}
            />

            <Select
              label="Tiene aireadores"
              options={OPCIONES_AIREADORES}
              value={tieneAireadores}
              onChange={manejarTieneAireadores}
              placeholder="Seleccione una opcion"
              labelStyle={styles.label}
            />

            {tieneAireadores === "si" && (
              <View style={styles.aeratorBox}>
                <Select
                  label="Codigo del aireador"
                  required={true}
                  submitted={submitted}
                  options={AIREADORES_EXISTENTES}
                  value={codigoAireador}
                  onChange={setCodigoAireador}
                  placeholder="Seleccione el codigo"
                  labelStyle={styles.label}
                />

                <Select
                  label="Estanque seleccionado"
                  options={obtenerOpcionesEstanqueSeleccionado(
                    codigo,
                    `${finca?.nombreFinca ?? "Cargando..."}`
                  )}
                  value={codigo}
                  disabled={true}
                  placeholder="Ingrese primero el codigo del estanque"
                  labelStyle={styles.label}
                />

                <CustomText
                  size={13}
                  color={COLORS.textTertiary}
                  style={styles.helperText}
                >
                  El aireador se asigna automaticamente al estanque actual.
                </CustomText>
              </View>
            )}

            <Select
              label="Tiene alimentador automatico"
              options={OPCIONES_ALIMENTADOR}
              value={tieneAlimentadorAutomatico}
              onChange={setTieneAlimentadorAutomatico}
              placeholder="Seleccione una opcion"
              labelStyle={styles.label}
            />
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
            onPress={registrarEstanque}
            style={styles.outlinePrimaryButton}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.primary} />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                Registrar estanque
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

function OptionButton({ label, value, selectedValue, onPress }) {
  let buttonStyle = [styles.optionButton];
  let textColor = COLORS.textSecondary;
  let textFont = TYPOGRAPHY.fontFamily.medium;

  if (value === selectedValue) {
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
