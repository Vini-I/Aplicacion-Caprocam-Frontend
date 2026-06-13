/**
 * ============================================================
 * SCREEN: EDITAR ESTANQUE
 * ============================================================
 *
 * Pantalla para editar la informacion de un estanque existente.
 *
 * Funcionalidad:
 * - Carga datos iniciales del estanque.
 * - Permite modificar codigo, tipo y estado.
 * - Incluye estados Activo, Preparacion, Mantenimiento, Engorde y Cosechado.
 * - Usa DateInput separado para fecha de siembra, engorde y mantenimiento.
 * - Usa Input separado para texto y numeros.
 * - Usa contador numerico para densidad y numero de aireadores.
 * - Usa rutas correctas desde modules/estanques/screens.
 */

import React, { useState } from "react";
import {ScrollView,View,StyleSheet,TouchableOpacity,Pressable,Text,useWindowDimensions,} from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Title from "../../../shared/components/Title";
import CustomText from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";

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

const TIPOS_ESTANQUE = [
  {
    label: "Estanque de tierra semiintensivo",
    value: "tierra_semiintensivo",
  },
  {
    label: "Estanque reservorio",
    value: "reservorio",
  },
  {
    label: "Estanque con geomembrana",
    value: "geomembrana",
  },
  {
    label: "Estanque superintensivo",
    value: "superintensivo",
  },
];

const FUENTES_AGUA = [
  {
    label: "Estero",
    value: "estero",
  },
  {
    label: "Golfo",
    value: "golfo",
  },
  {
    label: "Reservorio",
    value: "reservorio",
  },
];

const ESPECIES = [
  {
    label: "Litopenaeus vannamei - Camaron blanco",
    value: "litopenaeus_vannamei",
  },
];

const OPCIONES_PRECRIA = [
  {
    label: "Si, usa precria",
    value: "si",
  },
  {
    label: "No, siembra directa",
    value: "no",
  },
];

const METODOS_ALIMENTACION = [
  {
    label: "Manual",
    value: "manual",
  },
  {
    label: "Automatico",
    value: "automatico",
  },
  {
    label: "Manual y automatico",
    value: "manual_automatico",
  },
];

const OPCIONES_ALIMENTADOR = [
  {
    label: "Si",
    value: "si",
  },
  {
    label: "No",
    value: "no",
  },
];

const ESTANQUE_INICIAL = {
  id: 1,
  finca: "Finca La Reina",
  codigo: "EST-01",
  estado: "engorde",
  tipoEstanque: "tierra_semiintensivo",
  largo: "100",
  ancho: "80",
  profundidad: "0.80",
  fuenteAgua: "estero",
  especie: "litopenaeus_vannamei",
  fechaSiembra: obtenerFechaActual(),
  fechaInicioEngorde: obtenerFechaActual(),
  fechaMantenimiento: obtenerFechaActual(),
  densidadSiembra: 12,
  precria: "si",
  metodoAlimentacion: "manual_automatico",
  proveedorAlimento: "Biomar",
  numeroAireadores: 4,
  tieneAlimentadorAutomatico: "si",
};

export default function EditarEstanqueScreen({ navigation }) {
  const { width } = useWindowDimensions();

  let esTablet = false;
  let esDesktop = false;

  if (width >= 768) {
    esTablet = true;
  }

  if (width >= 1024) {
    esDesktop = true;
  }

  const [codigo, setCodigo] = useState(ESTANQUE_INICIAL.codigo);
  const [estado, setEstado] = useState(ESTANQUE_INICIAL.estado);
  const [tipoEstanque, setTipoEstanque] = useState(
    ESTANQUE_INICIAL.tipoEstanque,
  );
  const [largo, setLargo] = useState(ESTANQUE_INICIAL.largo);
  const [ancho, setAncho] = useState(ESTANQUE_INICIAL.ancho);
  const [profundidad, setProfundidad] = useState(ESTANQUE_INICIAL.profundidad);
  const [fuenteAgua, setFuenteAgua] = useState(ESTANQUE_INICIAL.fuenteAgua);
  const [especie, setEspecie] = useState(ESTANQUE_INICIAL.especie);
  const [fechaSiembra, setFechaSiembra] = useState(
    ESTANQUE_INICIAL.fechaSiembra,
  );
  const [fechaInicioEngorde, setFechaInicioEngorde] = useState(
    ESTANQUE_INICIAL.fechaInicioEngorde,
  );
  const [fechaMantenimiento, setFechaMantenimiento] = useState(
    ESTANQUE_INICIAL.fechaMantenimiento,
  );
  const [densidadSiembra, setDensidadSiembra] = useState(
    ESTANQUE_INICIAL.densidadSiembra,
  );
  const [precria, setPrecria] = useState(ESTANQUE_INICIAL.precria);
  const [metodoAlimentacion, setMetodoAlimentacion] = useState(
    ESTANQUE_INICIAL.metodoAlimentacion,
  );
  const [proveedorAlimento, setProveedorAlimento] = useState(
    ESTANQUE_INICIAL.proveedorAlimento,
  );
  const [numeroAireadores, setNumeroAireadores] = useState(
    ESTANQUE_INICIAL.numeroAireadores,
  );
  const [tieneAlimentadorAutomatico, setTieneAlimentadorAutomatico] = useState(
    ESTANQUE_INICIAL.tieneAlimentadorAutomatico,
  );
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");

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

  function cancelar() {
    if (navigation) {
      navigation.goBack();
    }
  }

  function seleccionarEstado(nuevoEstado) {
    setEstado(nuevoEstado);
  }

  function disminuirDensidad() {
    if (densidadSiembra > 0) {
      setDensidadSiembra(densidadSiembra - 1);
    }
  }

  function aumentarDensidad() {
    setDensidadSiembra(densidadSiembra + 1);
  }

  function cambiarDensidad(texto) {
    const soloNumeros = texto.replace(/[^0-9]/g, "");

    if (soloNumeros === "") {
      setDensidadSiembra(0);
      return;
    }

    setDensidadSiembra(Number(soloNumeros));
  }

  function disminuirAireadores() {
    if (numeroAireadores > 0) {
      setNumeroAireadores(numeroAireadores - 1);
    }
  }

  function aumentarAireadores() {
    setNumeroAireadores(numeroAireadores + 1);
  }

  function cambiarAireadores(texto) {
    const soloNumeros = texto.replace(/[^0-9]/g, "");

    if (soloNumeros === "") {
      setNumeroAireadores(0);
      return;
    }

    setNumeroAireadores(Number(soloNumeros));
  }

  function limpiarMensaje() {
    setMensaje("");
    setTipoMensaje("info");
  }

  function validarFormulario() {
    let formularioValido = true;

    if (codigo === "") {
      setMensaje("Debe ingresar el codigo del estanque.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && tipoEstanque === "") {
      setMensaje("Debe seleccionar el tipo de estanque.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && largo === "") {
      setMensaje("Debe ingresar el largo del estanque.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && ancho === "") {
      setMensaje("Debe ingresar el ancho del estanque.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && profundidad === "") {
      setMensaje("Debe ingresar la profundidad del estanque.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && fuenteAgua === "") {
      setMensaje("Debe seleccionar la fuente de agua.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && especie === "") {
      setMensaje("Debe seleccionar la especie.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && fechaSiembra === "") {
      setMensaje("Debe seleccionar la fecha de siembra.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && fechaInicioEngorde === "") {
      setMensaje("Debe seleccionar la fecha de inicio de engorde.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && fechaMantenimiento === "") {
      setMensaje("Debe seleccionar la fecha de mantenimiento.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && densidadSiembra <= 0) {
      setMensaje("La densidad de siembra debe ser mayor a 0.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && precria === "") {
      setMensaje("Debe seleccionar si usa precria.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && metodoAlimentacion === "") {
      setMensaje("Debe seleccionar el metodo de alimentacion.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    if (formularioValido === true && tieneAlimentadorAutomatico === "") {
      setMensaje("Debe indicar si tiene alimentador automatico.");
      setTipoMensaje("warning");
      formularioValido = false;
    }

    return formularioValido;
  }

  function guardarCambios() {
    const formularioValido = validarFormulario();

    if (formularioValido === false) {
      return;
    }

    const estanqueActualizado = {
      id: ESTANQUE_INICIAL.id,
      finca: ESTANQUE_INICIAL.finca,
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
      tieneAlimentadorAutomatico: tieneAlimentadorAutomatico,
    };

    console.log("Estanque actualizado:", estanqueActualizado);

    setMensaje("Cambios del estanque guardados correctamente.");
    setTipoMensaje("success");
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={headerStyle}>
        <TouchableOpacity onPress={cancelar} style={styles.cancelButton}>
          <Icon icon={ICONS.exit} size={18} color={COLORS.white} />
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Icon icon={ICONS.edit} size={26} color={COLORS.primary} />
          </View>

          <View style={styles.headerText}>
            <Title level={3} color={COLORS.white} style={styles.headerTitle}>
              Editar Estanque
            </Title>

            <CustomText
              size={14}
              color={COLORS.white}
              weight="500"
              style={styles.headerSubtitle}
            >
              Finca: {ESTANQUE_INICIAL.finca}
            </CustomText>

            <CustomText
              size={13}
              color={COLORS.white}
              weight="400"
              style={styles.headerCode}
            >
              Codigo actual: {ESTANQUE_INICIAL.codigo}
            </CustomText>
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

        <Card title="IDENTIFICACION" titleStyle={styles.cardTitle}>
          <View style={gridStyle}>
            <View style={itemStyle}>
              <Input
                label="Codigo del estanque *"
                value={codigo}
                onChangeText={setCodigo}
                placeholder="Ej: EST-01, E-01, TANQUE-A"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Tipo de estanque *"
                options={TIPOS_ESTANQUE}
                value={tipoEstanque}
                onChange={setTipoEstanque}
                placeholder="Seleccione el tipo de estanque"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={itemFullStyle}>
              <CustomText
                size={14}
                color={COLORS.textPrimary}
                weight="600"
                style={styles.estadoLabel}
              >
                Estado
              </CustomText>

              <View style={styles.optionsRow}>
                <EstadoOption
                  title="Activo"
                  value="activo"
                  selectedValue={estado}
                  onPress={seleccionarEstado}
                />

                <EstadoOption
                  title="Preparacion"
                  value="preparacion"
                  selectedValue={estado}
                  onPress={seleccionarEstado}
                />

                <EstadoOption
                  title="Mantenimiento"
                  value="mantenimiento"
                  selectedValue={estado}
                  onPress={seleccionarEstado}
                />

                <EstadoOption
                  title="Engorde"
                  value="engorde"
                  selectedValue={estado}
                  onPress={seleccionarEstado}
                />

                <EstadoOption
                  title="Cosechado"
                  value="cosechado"
                  selectedValue={estado}
                  onPress={seleccionarEstado}
                />
              </View>
            </View>
          </View>
        </Card>

        <Card title="DIMENSIONES" titleStyle={styles.cardTitle}>
          <View style={styles.sectionHelp}>
            <Icon icon={ICONS.ruler} size={18} color={COLORS.primary} />
            <Text style={styles.sectionHelpText}>
              Modifique las medidas fisicas del estanque.
            </Text>
          </View>

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Input
                label="Largo (m) *"
                value={largo}
                onChangeText={setLargo}
                placeholder="Ej: 100"
                keyboardType="numeric"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Ancho (m) *"
                value={ancho}
                onChangeText={setAncho}
                placeholder="Ej: 80"
                keyboardType="numeric"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Profundidad (m) *"
                value={profundidad}
                onChangeText={setProfundidad}
                placeholder="Ej: 0.80"
                keyboardType="numeric"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Fuente de agua *"
                options={FUENTES_AGUA}
                value={fuenteAgua}
                onChange={setFuenteAgua}
                placeholder="Seleccione la fuente de agua"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>
          </View>
        </Card>

        <Card title="FECHAS DEL ESTANQUE" titleStyle={styles.cardTitle}>
          <View style={styles.sectionHelp}>
            <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} />
            <Text style={styles.sectionHelpText}>
              Seleccione las fechas usando el calendario.
            </Text>
          </View>

          <View style={gridStyle}>
            <View style={itemStyle}>
              <DateInput
                label="Fecha de siembra *"
                value={fechaSiembra}
                onChangeText={setFechaSiembra}
                placeholder="dd/mm/aaaa"
                allowFutureDates={false}
                labelStyle={styles.label}
                textStyle={styles.inputText}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Fecha inicio de engorde *"
                value={fechaInicioEngorde}
                onChangeText={setFechaInicioEngorde}
                placeholder="dd/mm/aaaa"
                allowFutureDates={true}
                labelStyle={styles.label}
                textStyle={styles.inputText}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Fecha de mantenimiento *"
                value={fechaMantenimiento}
                onChangeText={setFechaMantenimiento}
                placeholder="dd/mm/aaaa"
                allowFutureDates={true}
                labelStyle={styles.label}
                textStyle={styles.inputText}
              />
            </View>
          </View>
        </Card>

        <Card title="SIEMBRA" titleStyle={styles.cardTitle}>
          <View style={styles.sectionHelp}>
            <Icon icon={ICONS.shrimp} size={18} color={COLORS.primary} />
            <Text style={styles.sectionHelpText}>
              Revise especie, densidad y precria.
            </Text>
          </View>

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Especie *"
                options={ESPECIES}
                value={especie}
                onChange={setEspecie}
                placeholder="Seleccione la especie"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={itemStyle}>
              <CounterInput
                label="Densidad de siembra (ind/m²) *"
                value={densidadSiembra}
                onChangeText={cambiarDensidad}
                onDecrease={disminuirDensidad}
                onIncrease={aumentarDensidad}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Precria *"
                options={OPCIONES_PRECRIA}
                value={precria}
                onChange={setPrecria}
                placeholder="Seleccione si usa precria"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>
          </View>
        </Card>

        <Card title="ALIMENTACION Y EQUIPOS" titleStyle={styles.cardTitle}>
          <View style={styles.sectionHelp}>
            <Icon icon={ICONS.food} size={18} color={COLORS.primary} />
            <Text style={styles.sectionHelpText}>
              Modifique alimentacion, proveedor y equipos disponibles.
            </Text>
          </View>

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Metodo de alimentacion *"
                options={METODOS_ALIMENTACION}
                value={metodoAlimentacion}
                onChange={setMetodoAlimentacion}
                placeholder="Seleccione el metodo"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Proveedor de alimento"
                value={proveedorAlimento}
                onChangeText={setProveedorAlimento}
                placeholder="Ej: Biomar"
                labelStyle={styles.label}
                style={styles.input}
              />
            </View>

            <View style={itemStyle}>
              <CounterInput
                label="N° aireadores"
                value={numeroAireadores}
                onChangeText={cambiarAireadores}
                onDecrease={disminuirAireadores}
                onIncrease={aumentarAireadores}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Tiene alimentador automatico *"
                options={OPCIONES_ALIMENTADOR}
                value={tieneAlimentadorAutomatico}
                onChange={setTieneAlimentadorAutomatico}
                placeholder="Seleccione una opcion"
                labelStyle={styles.label}
                selectedTextStyle={styles.inputText}
              />
            </View>
          </View>
        </Card>

        <View style={actionsStyle}>
          <Button
            variant="outline"
            onPress={limpiarMensaje}
            style={styles.actionButton}
          >
            Limpiar mensaje
          </Button>

          <Button onPress={guardarCambios} style={styles.actionButton}>
            <View style={styles.saveButtonContent}>
              <Icon icon={ICONS.save} size={18} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </View>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

function EstadoOption({ title, value, selectedValue, onPress }) {
  let optionStyle = [styles.optionButton];
  let textStyle = [styles.optionText];

  if (value === selectedValue) {
    optionStyle.push(styles.optionSelected);
    textStyle.push(styles.optionTextSelected);
  }

  function presionar() {
    onPress(value);
  }

  return (
    <TouchableOpacity style={optionStyle} onPress={presionar}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

function CounterInput({ label, value, onChangeText, onDecrease, onIncrease }) {
  return (
    <View style={styles.counterContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.counterRow}>
        <Pressable style={styles.counterButton} onPress={onDecrease}>
          <Text style={styles.counterButtonText}>-</Text>
        </Pressable>

        <Input
          value={String(value)}
          onChangeText={onChangeText}
          keyboardType="numeric"
          containerStyle={styles.counterInputContainer}
          style={styles.counterInput}
        />

        <Pressable style={styles.counterButton} onPress={onIncrease}>
          <Text style={styles.counterButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
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

  headerText: {
    flex: 1,
  },

  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 2,
  },

  headerSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  headerCode: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 6,
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

  alertWrapper: {
    marginBottom: 16,
  },

  alertText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  cardTitle: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  inputText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  sectionHelp: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },

  sectionHelpText: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  estadoLabel: {
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
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

  optionsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  optionButton: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },

  optionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  counterContainer: {
    width: "100%",
    marginBottom: 12,
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  counterButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
  },

  counterInputContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 0,
  },

  counterInput: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
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

  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginLeft: 8,
  },
});
