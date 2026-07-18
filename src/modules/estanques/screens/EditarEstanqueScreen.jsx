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

import { getCurrentDate } from "../../../shared/utils/dateUtils";

import { styles } from "../styles/EstanqueStyle";
import {
  obtenerCodigoAireadorDefault,
  obtenerEstanqueAireador,
  obtenerOpcionesAireadores,
  obtenerOpcionesEstanqueSeleccionado,
} from "../services/AireadoresEstanqueService";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

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

const OPCIONES_AIREADORES = [
  {
    label: "Si",
    value: "si",
  },
  {
    label: "No",
    value: "no",
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

const AIREADORES_EXISTENTES = obtenerOpcionesAireadores();

const ESTADOS_ESTANQUE = [
  {
    label: "Activo",
    value: "activo",
  },
  {
    label: "En preparacion",
    value: "preparacion",
  },
  {
    label: "Mantenimiento",
    value: "mantenimiento",
  },
  {
    label: "Engorde",
    value: "engorde",
  },
  {
    label: "Cosechado",
    value: "cosechado",
  },
];

function obtenerParametro(valor, respaldo) {
  let resultado = respaldo;

  if (valor !== undefined && valor !== null && valor !== "") {
    resultado = String(valor);
  }

  return resultado;
}

export default function EditarEstanqueScreen({ navigation }) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [codigo, setCodigo] = useState(
    obtenerParametro(params.codigo, "EST-01"),
  );
  const [estado, setEstado] = useState(
    obtenerParametro(params.estado, "activo"),
  );
  const [tipoEstanque, setTipoEstanque] = useState(
    obtenerParametro(params.tipoEstanque, ""),
  );
  const [largo, setLargo] = useState(obtenerParametro(params.largo, ""));
  const [ancho, setAncho] = useState(obtenerParametro(params.ancho, ""));
  const [profundidad, setProfundidad] = useState(
    obtenerParametro(params.profundidad, ""),
  );
  const [fuenteAgua, setFuenteAgua] = useState(
    obtenerParametro(params.fuenteAgua, ""),
  );
  const [especie, setEspecie] = useState(
    obtenerParametro(params.especie, "litopenaeus_vannamei"),
  );
  const [fechaSiembra, setFechaSiembra] = useState(
    obtenerParametro(params.fechaSiembra, getCurrentDate()),
  );
  const [fechaInicioEngorde, setFechaInicioEngorde] = useState(
    obtenerParametro(params.fechaInicioEngorde, getCurrentDate()),
  );
  const [fechaMantenimiento, setFechaMantenimiento] = useState(
    obtenerParametro(params.fechaMantenimiento, getCurrentDate()),
  );
  const [densidadSiembra, setDensidadSiembra] = useState(
    obtenerParametro(params.densidadSiembra, "12"),
  );
  const [precria, setPrecria] = useState(obtenerParametro(params.precria, ""));
  const [metodoAlimentacion, setMetodoAlimentacion] = useState(
    obtenerParametro(params.metodoAlimentacion, ""),
  );
  const [proveedorAlimento, setProveedorAlimento] = useState(
    obtenerParametro(params.proveedorAlimento, "Biomar"),
  );
  const [numeroAireadores, setNumeroAireadores] = useState(
    obtenerParametro(params.numeroAireadores, "0"),
  );
  const [tieneAireadores, setTieneAireadores] = useState(
    obtenerParametro(params.tieneAireadores, "no"),
  );
  const [codigoAireador, setCodigoAireador] = useState(
    obtenerParametro(params.codigoAireador, ""),
  );
  const [tieneAlimentadorAutomatico, setTieneAlimentadorAutomatico] = useState(
    obtenerParametro(params.tieneAlimentadorAutomatico, ""),
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
    setTieneAireadores(valor);

    if (valor === "si") {
      setNumeroAireadores("1");

      if (codigoAireador === "") {
        setCodigoAireador(obtenerCodigoAireadorDefault());
      }
    }

    if (valor === "no") {
      setNumeroAireadores("0");
      setCodigoAireador("");
    }
  }

  function validarFormulario() {
    setSubmitted(true);

    if (codigo === "") {
      mostrarError("Debe ingresar el codigo del estanque.");
      return false;
    }

    if (tipoEstanque === "") {
      mostrarError("Debe seleccionar el tipo de estanque.");
      return false;
    }

    if (largo === "") {
      mostrarError("Debe ingresar el largo del estanque.");
      return false;
    }

    if (ancho === "") {
      mostrarError("Debe ingresar el ancho del estanque.");
      return false;
    }

    if (profundidad === "") {
      mostrarError("Debe ingresar la profundidad del estanque.");
      return false;
    }

    if (fechaSiembra === "") {
      mostrarError("Debe seleccionar la fecha de siembra.");
      return false;
    }

    if (Number(densidadSiembra) <= 0) {
      mostrarError("La densidad de siembra debe ser mayor a 0.");
      return false;
    }

    if (tieneAireadores === "si" && codigoAireador === "") {
      mostrarError("Debe seleccionar el codigo del aireador.");
      return false;
    }

    return true;
  }

  function guardarCambios() {
    if (validarFormulario() === false) {
      return;
    }

    const estanqueEditado = {
      id: obtenerParametro(params.id, String(Date.now())),
      finca: obtenerParametro(params.finca, "Finca La Reina"),
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
      estanqueAireador: obtenerEstanqueAireador(
        tieneAireadores,
        codigo,
        obtenerParametro(params.finca, "Finca La Reina"),
      ),
      tieneAlimentadorAutomatico: tieneAlimentadorAutomatico,
    };

    console.log("Estanque editado:", estanqueEditado);

    setTipoMensaje("success");
    setMensaje("Cambios guardados correctamente.");

    router.push({
      pathname: "/registros/DetalleEstanque",
      params: estanqueEditado,
    });
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Editar Estanque"
        Subtitulo={`Estanque: ${codigo}`}
        Icono="water"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {mensaje !== "" && (
            <Alert
              variant={tipoMensaje}
              message={mensaje}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

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
                    obtenerParametro(params.finca, "Finca La Reina"),
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