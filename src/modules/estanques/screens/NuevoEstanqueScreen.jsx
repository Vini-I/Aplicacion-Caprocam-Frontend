/**
 * ============================================================
 * PANTALLA NUEVO ESTANQUE
 * ============================================================
 *
 * Esta pantalla permite registrar un nuevo estanque dentro del modulo
 * de estanques de la aplicacion Caprocam.
 *
 * Funcionalidad principal:
 * - Registra la informacion de identificacion del estanque.
 * - Permite seleccionar el tipo de estanque y la fuente de agua.
 * - Permite escoger el estado del estanque entre:
 *   Activo, En preparacion, Cosechado, Mantenimiento y Engorde.
 * - Registra dimensiones fisicas: largo, ancho y profundidad.
 * - Registra informacion de siembra: especie, fecha de siembra,
 *   densidad de siembra y precria.
 * - La fecha de siembra usa DateInput, muestra la fecha actual por
 *   defecto y abre un calendario al presionar el campo.
 * - La densidad de siembra usa un control numerico con botones para
 *   incrementar y disminuir.
 * - El numero de aireadores usa un control numerico con botones para
 *   incrementar y disminuir.
 * - Registra informacion de alimentacion y equipos.
 * - Valida campos obligatorios antes de construir el objeto final.
 * - Muestra alertas de error o exito usando el componente Alert.
 *
 * Componentes utilizados:
 * - Card: agrupa secciones del formulario.
 * - Input: permite ingresar campos de texto o numeros.
 * - Select: permite seleccionar opciones.
 * - DateInput: permite seleccionar la fecha desde calendario.
 * - Button: ejecuta acciones usando children.
 * - Alert: muestra mensajes de validacion.
 * - Title: muestra titulos de pantalla.
 * - Icon: muestra iconografia centralizada.
 *
 * Tema visual:
 * - Usa COLORS para colores centralizados.
 * - Usa ICONS para iconografia centralizada.
 * - Usa TYPOGRAPHY para aplicar la familia Roboto.
 *
 * Nota:
 * Actualmente el registro se imprime en consola.
 * Mas adelante se puede reemplazar el console.log por una llamada a API,
 * almacenamiento local o estado global.
 */

import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Text } from "react-native";

import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Title from "../components/Title";
import Alert from "../components/Alert";
import DateInput from "../components/DateInput";
import Icon from "../components/Icons";

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

export default function NuevoEstanqueScreen({ navigation }) {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("activo");
  const [tipoEstanque, setTipoEstanque] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [profundidad, setProfundidad] = useState("");
  const [fuenteAgua, setFuenteAgua] = useState("");
  const [especie, setEspecie] = useState("litopenaeus_vannamei");
  const [fechaSiembra, setFechaSiembra] = useState(obtenerFechaActual());
  const [densidadSiembra, setDensidadSiembra] = useState(12);
  const [precria, setPrecria] = useState("");
  const [metodoAlimentacion, setMetodoAlimentacion] = useState("");
  const [proveedorAlimento, setProveedorAlimento] = useState("Biomar");
  const [numeroAireadores, setNumeroAireadores] = useState(0);
  const [tieneAlimentadorAutomatico, setTieneAlimentadorAutomatico] =
    useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");

  const tiposEstanque = [
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

  const fuentesAgua = [
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

  const especies = [
    {
      label: "Litopenaeus vannamei - Camaron blanco",
      value: "litopenaeus_vannamei",
    },
  ];

  const opcionesPrecria = [
    {
      label: "Si, usa precria",
      value: "si",
    },
    {
      label: "No, siembra directa",
      value: "no",
    },
  ];

  const metodosAlimentacion = [
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

  const opcionesAlimentador = [
    {
      label: "Si",
      value: "si",
    },
    {
      label: "No",
      value: "no",
    },
  ];

  function seleccionarEstado(nuevoEstado) {
    setEstado(nuevoEstado);
  }

  function cancelar() {
    if (navigation) {
      navigation.goBack();
    }
  }

  function mostrarError(texto) {
    setTipoMensaje("danger");
    setMensaje(texto);
  }

  function registrarEstanque() {
    if (codigo === "") {
      mostrarError("Debe ingresar el codigo del estanque.");
      return;
    }

    if (tipoEstanque === "") {
      mostrarError("Debe seleccionar el tipo de estanque.");
      return;
    }

    if (largo === "" || ancho === "" || profundidad === "") {
      mostrarError("Debe completar largo, ancho y profundidad.");
      return;
    }

    if (fechaSiembra === "") {
      mostrarError("Debe seleccionar la fecha de siembra.");
      return;
    }

    const nuevoEstanque = {
      codigo: codigo,
      estado: estado,
      tipoEstanque: tipoEstanque,
      largo: largo,
      ancho: ancho,
      profundidad: profundidad,
      fuenteAgua: fuenteAgua,
      especie: especie,
      fechaSiembra: fechaSiembra,
      densidadSiembra: densidadSiembra,
      precria: precria,
      metodoAlimentacion: metodoAlimentacion,
      proveedorAlimento: proveedorAlimento,
      numeroAireadores: numeroAireadores,
      tieneAlimentadorAutomatico: tieneAlimentadorAutomatico,
    };

    console.log("Estanque registrado:", nuevoEstanque);

    setTipoMensaje("success");
    setMensaje("Estanque registrado correctamente.");
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.cancelButton} onPress={cancelar}>
          <Icon icon={ICONS.exit} size={18} color={COLORS.white} />

          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIconContainer}>
            <Icon icon={ICONS.water} size={30} color={COLORS.white} />
          </View>

          <View style={styles.headerTextContainer}>
            <Title level={3} color={COLORS.white} style={styles.headerTitle}>
              Nuevo Estanque
            </Title>

            <Text style={styles.headerSubtitle}>Finca: Finca La Reina</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
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
          <Input
            label="Codigo del estanque *"
            value={codigo}
            onChangeText={setCodigo}
            placeholder="Ej: EST-01, E-01, TANQUE-A"
            labelStyle={styles.fieldLabel}
            style={styles.input}
          />

          <Select
            label="Tipo de estanque *"
            options={tiposEstanque}
            value={tipoEstanque}
            onChange={setTipoEstanque}
            placeholder="Seleccione el tipo de estanque"
            labelStyle={styles.fieldLabel}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOptionText}
          />

          <Text style={styles.sectionLabel}>Estado del estanque</Text>

          <View style={styles.estadoGrid}>
            <EstadoOption
              title="Activo"
              value="activo"
              selectedValue={estado}
              onPress={seleccionarEstado}
            />

            <EstadoOption
              title="En preparacion"
              value="preparacion"
              selectedValue={estado}
              onPress={seleccionarEstado}
            />

            <EstadoOption
              title="Cosechado"
              value="cosechado"
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
          </View>
        </Card>

        <Card title="DIMENSIONES" titleStyle={styles.cardTitle}>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Input
                label="Largo (m) *"
                value={largo}
                onChangeText={setLargo}
                placeholder="Ej: 100"
                keyboardType="numeric"
                labelStyle={styles.fieldLabel}
                style={styles.input}
              />
            </View>

            <View style={styles.column}>
              <Input
                label="Ancho (m) *"
                value={ancho}
                onChangeText={setAncho}
                placeholder="Ej: 80"
                keyboardType="numeric"
                labelStyle={styles.fieldLabel}
                style={styles.input}
              />
            </View>
          </View>

          <Input
            label="Profundidad (m) *"
            value={profundidad}
            onChangeText={setProfundidad}
            placeholder="Ej: 0.80"
            keyboardType="numeric"
            labelStyle={styles.fieldLabel}
            style={styles.input}
          />

          <Select
            label="Fuente de agua"
            options={fuentesAgua}
            value={fuenteAgua}
            onChange={setFuenteAgua}
            placeholder="Seleccione la fuente de agua"
            labelStyle={styles.fieldLabel}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOptionText}
          />
        </Card>

        <Card title="SIEMBRA" titleStyle={styles.cardTitle}>
          <Select
            label="Especie"
            options={especies}
            value={especie}
            onChange={setEspecie}
            placeholder="Seleccione la especie"
            labelStyle={styles.fieldLabel}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOptionText}
          />

          <FechaSiembraInput
            value={fechaSiembra}
            onChangeText={setFechaSiembra}
          />

          <NumberStepper
            label="Densidad de siembra (ind/m²) *"
            value={densidadSiembra}
            onChange={setDensidadSiembra}
            minValue={0}
            step={1}
          />

          <Select
            label="Precria"
            options={opcionesPrecria}
            value={precria}
            onChange={setPrecria}
            placeholder="Seleccione si usa precria"
            labelStyle={styles.fieldLabel}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOptionText}
          />
        </Card>

        <Card title="ALIMENTACION Y EQUIPOS" titleStyle={styles.cardTitle}>
          <Select
            label="Metodo de alimentacion"
            options={metodosAlimentacion}
            value={metodoAlimentacion}
            onChange={setMetodoAlimentacion}
            placeholder="Seleccione el metodo"
            labelStyle={styles.fieldLabel}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOptionText}
          />

          <Input
            label="Proveedor de alimento"
            value={proveedorAlimento}
            onChangeText={setProveedorAlimento}
            placeholder="Ej: Biomar"
            labelStyle={styles.fieldLabel}
            style={styles.input}
          />

          <NumberStepper
            label="N° aireadores"
            value={numeroAireadores}
            onChange={setNumeroAireadores}
            minValue={0}
            step={1}
          />

          <Select
            label="¿Tiene alimentador automatico?"
            options={opcionesAlimentador}
            value={tieneAlimentadorAutomatico}
            onChange={setTieneAlimentadorAutomatico}
            placeholder="Seleccione una opcion"
            labelStyle={styles.fieldLabel}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOptionText}
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button onPress={registrarEstanque} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={18} color={COLORS.white} />

              <Text style={styles.buttonText}>Registrar estanque</Text>
            </View>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

function FechaSiembraInput({ value, onChangeText }) {
  return (
    <View style={styles.dateWrapper}>
      <DateInput
        label="Fecha de siembra *"
        value={value}
        onChangeText={onChangeText}
        placeholder="dd/mm/aaaa"
        inputStyle={styles.dateInput}
        labelStyle={styles.fieldLabel}
        textStyle={styles.dateText}
      />

      <View pointerEvents="none" style={styles.calendarIcon}>
        <Icon icon={ICONS.calendar} size={20} color={COLORS.primary} />
      </View>
    </View>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  minValue = 0,
  maxValue,
  step = 1,
}) {
  function disminuir() {
    const nuevoValor = Number(value) - step;

    if (nuevoValor >= minValue) {
      onChange(nuevoValor);
    }
  }

  function aumentar() {
    const nuevoValor = Number(value) + step;

    if (maxValue === undefined) {
      onChange(nuevoValor);
      return;
    }

    if (nuevoValor <= maxValue) {
      onChange(nuevoValor);
    }
  }

  return (
    <View style={styles.stepperContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={styles.stepperRow}>
        <Pressable style={styles.stepperButtonFilled} onPress={disminuir}>
          <Text style={styles.stepperButtonFilledText}>-</Text>
        </Pressable>

        <View style={styles.stepperValueContainer}>
          <Text style={styles.stepperValue}>{value}</Text>
        </View>

        <Pressable style={styles.stepperButtonFilled} onPress={aumentar}>
          <Text style={styles.stepperButtonFilledText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function EstadoOption({ title, value, selectedValue, onPress }) {
  let optionStyle = [styles.estadoOption];
  let textStyle = [styles.estadoText];

  if (value === selectedValue) {
    optionStyle.push(styles.estadoOptionSelected);
    textStyle.push(styles.estadoTextSelected);
  }

  function presionar() {
    onPress(value);
  }

  return (
    <Pressable style={optionStyle} onPress={presionar}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  cancelText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 6,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  headerSubtitle: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  content: {
    padding: 18,
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

  fieldLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  sectionLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  input: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  selectText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  selectOptionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  twoColumns: {
    flexDirection: "row",
    gap: 12,
  },

  column: {
    flex: 1,
  },

  estadoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  estadoOption: {
    minWidth: "30%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  estadoOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },

  estadoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  estadoTextSelected: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  dateWrapper: {
    position: "relative",
  },

  dateInput: {
    paddingRight: 46,
    borderColor: COLORS.secondary,
  },

  dateText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  calendarIcon: {
    position: "absolute",
    right: 14,
    top: 38,
  },

  stepperContainer: {
    marginBottom: 12,
  },

  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepperButtonFilled: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  stepperButtonFilledText: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  stepperValueContainer: {
    flex: 1,
    height: 46,
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  stepperValue: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  buttonContainer: {
    marginBottom: 32,
  },

  saveButton: {
    minHeight: 50,
    borderRadius: 14,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
