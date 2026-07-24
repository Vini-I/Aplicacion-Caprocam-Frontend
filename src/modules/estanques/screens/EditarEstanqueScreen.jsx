/**
 * ============================================================
 * PANTALLA EDITAR ESTANQUE
 * ============================================================
 *
 * Edita la informacion de un estanque existente.
 *
 * Cambios aplicados segun estandar:
 * - Fechas centralizadas con dateUtils.
 * - DateInput con calendario e icono global.
 * - Campos requeridos usando required y submitted.
 * - Boton principal en variante outline.
 * - Select de aireador requerido solo si tiene aireadores.
 */

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

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
  construirEstanqueEditado,
  obtenerCambioAireadores,
  obtenerParametro,
  obtenerValoresInicialesEditar,
  validarFormularioEstanque,
} from "../services/EstanqueScreenService";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function EditarEstanqueScreen({ navigation }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const valoresIniciales = obtenerValoresInicialesEditar(params);

  const [codigo, setCodigo] = useState(valoresIniciales.codigo);
  const [estado, setEstado] = useState(
    valoresIniciales.estado,
  );
  const [tipoEstanque, setTipoEstanque] = useState(
    valoresIniciales.tipoEstanque,
  );
  const [largo, setLargo] = useState(valoresIniciales.largo);
  const [ancho, setAncho] = useState(valoresIniciales.ancho);
  const [profundidad, setProfundidad] = useState(
    valoresIniciales.profundidad,
  );
  const [fuenteAgua, setFuenteAgua] = useState(
    valoresIniciales.fuenteAgua,
  );
  const [especie, setEspecie] = useState(
    valoresIniciales.especie,
  );
  const [fechaSiembra, setFechaSiembra] = useState(
    valoresIniciales.fechaSiembra,
  );
  const [fechaInicioEngorde, setFechaInicioEngorde] = useState(
    valoresIniciales.fechaInicioEngorde,
  );
  const [fechaMantenimiento, setFechaMantenimiento] = useState(
    valoresIniciales.fechaMantenimiento,
  );
  const [densidadSiembra, setDensidadSiembra] = useState(
    valoresIniciales.densidadSiembra,
  );
  const [precria, setPrecria] = useState(valoresIniciales.precria);
  const [metodoAlimentacion, setMetodoAlimentacion] = useState(
    valoresIniciales.metodoAlimentacion,
  );
  const [proveedorAlimento, setProveedorAlimento] = useState(
    valoresIniciales.proveedorAlimento,
  );
  const [numeroAireadores, setNumeroAireadores] = useState(
    valoresIniciales.numeroAireadores,
  );
  const [tieneAireadores, setTieneAireadores] = useState(
    valoresIniciales.tieneAireadores,
  );
  const [codigoAireador, setCodigoAireador] = useState(
    valoresIniciales.codigoAireador,
  );
  const [tieneAlimentadorAutomatico, setTieneAlimentadorAutomatico] = useState(
    valoresIniciales.tieneAlimentadorAutomatico,
  );
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [submitted, setSubmitted] = useState(false);

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

  function guardarCambios() {
    if (validarFormulario() === false) {
      return;
    }

    const estanqueEditado = construirEstanqueEditado(
      {
        codigo: codigo,
        estado: estado,
        tipoEstanque: tipoEstanque,
        largo: largo,
        ancho: ancho,
        profundidad: profundidad,
        fuenteAgua: fuenteAgua,
        especie: especie,
        fechaSiembra: fechaSiembra,
        fechaInicioEngorde: fechaInicioEngorde,
        fechaMantenimiento: fechaMantenimiento,
        densidadSiembra: densidadSiembra,
        precria: precria,
        metodoAlimentacion: metodoAlimentacion,
        proveedorAlimento: proveedorAlimento,
        numeroAireadores: numeroAireadores,
        tieneAireadores: tieneAireadores,
        codigoAireador: codigoAireador,
        tieneAlimentadorAutomatico: tieneAlimentadorAutomatico,
      },
      params,
    );

    console.log("Estanque editado:", estanqueEditado);

    setTipoMensaje("success");
    setMensaje("Cambios guardados correctamente.");

    setTimeout(function () {
      router.push({
        pathname: "/registros/DetalleEstanque",
        params: estanqueEditado,
      });
    }, 900);
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Editar Estanque"
        Subtitulo={`Estanque: ${codigo}`}
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
            onPress={guardarCambios}
            style={styles.outlinePrimaryButton}
          >
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.primary} />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                Guardar cambios
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
