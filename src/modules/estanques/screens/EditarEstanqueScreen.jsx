/**
 * ============================================================
 * PANTALLA EDITAR ESTANQUE
 * ============================================================
 *
 * Permite modificar la informacion de un estanque existente.
 */

import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
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
import {
  obtenerCodigoAireadorDefault,
  obtenerCodigoAireadorInicial,
  obtenerEstanqueAireador,
  obtenerOpcionesAireadores,
  obtenerOpcionesEstanqueSeleccionado,
  obtenerTieneAireadoresInicial,
} from "../services/AireadoresEstanqueService";

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

function obtenerParametro(valor, defecto) {
  let resultado = defecto;

  if (valor !== undefined && valor !== null && valor !== "") {
    resultado = String(valor);
  }

  return resultado;
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

export default function EditarEstanqueScreen({ navigation }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const tieneAireadoresBase = obtenerTieneAireadoresInicial(
    params.tieneAireadores,
    params.numeroAireadores,
  );

  const estanqueBase = {
    id: obtenerParametro(params.id, String(Date.now())),
    finca: obtenerParametro(params.finca, "Finca La Reina"),
    codigo: obtenerParametro(params.codigo, "EST-01"),
    estado: obtenerParametro(params.estado, "engorde"),
    tipoEstanque: obtenerParametro(params.tipoEstanque, "tierra_semiintensivo"),
    largo: obtenerParametro(params.largo, "100"),
    ancho: obtenerParametro(params.ancho, "80"),
    profundidad: obtenerParametro(params.profundidad, "0.80"),
    fuenteAgua: obtenerParametro(params.fuenteAgua, "estero"),
    especie: obtenerParametro(params.especie, "litopenaeus_vannamei"),
    fechaSiembra: obtenerParametro(params.fechaSiembra, obtenerFechaActual()),
    fechaInicioEngorde: obtenerParametro(
      params.fechaInicioEngorde,
      obtenerFechaActual(),
    ),
    fechaMantenimiento: obtenerParametro(
      params.fechaMantenimiento,
      obtenerFechaActual(),
    ),
    densidadSiembra: obtenerParametro(params.densidadSiembra, "12"),
    precria: obtenerParametro(params.precria, "si"),
    metodoAlimentacion: obtenerParametro(
      params.metodoAlimentacion,
      "manual_automatico",
    ),
    proveedorAlimento: obtenerParametro(params.proveedorAlimento, "Biomar"),
    numeroAireadores: obtenerParametro(params.numeroAireadores, "4"),
    tieneAireadores: tieneAireadoresBase,
    codigoAireador: obtenerCodigoAireadorInicial(
      params.codigoAireador,
      tieneAireadoresBase,
    ),
    estanqueAireador: obtenerParametro(params.estanqueAireador, ""),
    tieneAlimentadorAutomatico: obtenerParametro(
      params.tieneAlimentadorAutomatico,
      "si",
    ),
  };

  let esTablet = false;
  let esDesktop = false;

  if (width >= 768) {
    esTablet = true;
  }

  if (width >= 1024) {
    esDesktop = true;
  }

  const [codigo, setCodigo] = useState(estanqueBase.codigo);
  const [estado, setEstado] = useState(estanqueBase.estado);
  const [tipoEstanque, setTipoEstanque] = useState(estanqueBase.tipoEstanque);
  const [largo, setLargo] = useState(estanqueBase.largo);
  const [ancho, setAncho] = useState(estanqueBase.ancho);
  const [profundidad, setProfundidad] = useState(estanqueBase.profundidad);
  const [fuenteAgua, setFuenteAgua] = useState(estanqueBase.fuenteAgua);
  const [especie, setEspecie] = useState(estanqueBase.especie);
  const [fechaSiembra, setFechaSiembra] = useState(estanqueBase.fechaSiembra);
  const [fechaInicioEngorde, setFechaInicioEngorde] = useState(
    estanqueBase.fechaInicioEngorde,
  );
  const [fechaMantenimiento, setFechaMantenimiento] = useState(
    estanqueBase.fechaMantenimiento,
  );
  const [densidadSiembra, setDensidadSiembra] = useState(
    estanqueBase.densidadSiembra,
  );
  const [precria, setPrecria] = useState(estanqueBase.precria);
  const [metodoAlimentacion, setMetodoAlimentacion] = useState(
    estanqueBase.metodoAlimentacion,
  );
  const [proveedorAlimento, setProveedorAlimento] = useState(
    estanqueBase.proveedorAlimento,
  );
  const [numeroAireadores, setNumeroAireadores] = useState(
    estanqueBase.numeroAireadores,
  );
  const [tieneAireadores, setTieneAireadores] = useState(
    estanqueBase.tieneAireadores,
  );
  const [codigoAireador, setCodigoAireador] = useState(
    estanqueBase.codigoAireador,
  );
  const [tieneAlimentadorAutomatico, setTieneAlimentadorAutomatico] = useState(
    estanqueBase.tieneAlimentadorAutomatico,
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
      return;
    }

    router.back();
  }

  function mostrarAdvertencia(texto) {
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
    let valido = true;

    if (codigo === "") {
      mostrarAdvertencia("Debe ingresar el codigo del estanque.");
      valido = false;
    }

    if (valido === true && tipoEstanque === "") {
      mostrarAdvertencia("Debe seleccionar el tipo de estanque.");
      valido = false;
    }

    if (valido === true && largo === "") {
      mostrarAdvertencia("Debe ingresar el largo del estanque.");
      valido = false;
    }

    if (valido === true && ancho === "") {
      mostrarAdvertencia("Debe ingresar el ancho del estanque.");
      valido = false;
    }

    if (valido === true && profundidad === "") {
      mostrarAdvertencia("Debe ingresar la profundidad del estanque.");
      valido = false;
    }

    if (valido === true && fechaSiembra === "") {
      mostrarAdvertencia("Debe seleccionar la fecha de siembra.");
      valido = false;
    }

    if (valido === true && Number(densidadSiembra) <= 0) {
      mostrarAdvertencia("La densidad de siembra debe ser mayor a 0.");
      valido = false;
    }

    if (valido === true && tieneAireadores === "si" && codigoAireador === "") {
      mostrarAdvertencia("Debe seleccionar el codigo del aireador.");
      valido = false;
    }

    return valido;
  }

  function guardarCambios() {
    if (validarFormulario() === false) {
      return;
    }

    const estanqueActualizado = {
      id: estanqueBase.id,
      finca: estanqueBase.finca,
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
        estanqueBase.finca,
      ),
      tieneAlimentadorAutomatico: tieneAlimentadorAutomatico,
    };

    console.log("Estanque actualizado:", estanqueActualizado);

    setTipoMensaje("success");
    setMensaje("Cambios del estanque guardados correctamente.");

    router.push({
      pathname: "/registros/DetalleEstanque",
      params: {
        id: estanqueActualizado.id,
        finca: estanqueActualizado.finca,
        codigo: estanqueActualizado.codigo,
        estado: estanqueActualizado.estado,
        tipoEstanque: estanqueActualizado.tipoEstanque,
        largo: estanqueActualizado.largo,
        ancho: estanqueActualizado.ancho,
        profundidad: estanqueActualizado.profundidad,
        fuenteAgua: estanqueActualizado.fuenteAgua,
        especie: estanqueActualizado.especie,
        fechaSiembra: estanqueActualizado.fechaSiembra,
        fechaInicioEngorde: estanqueActualizado.fechaInicioEngorde,
        fechaMantenimiento: estanqueActualizado.fechaMantenimiento,
        densidadSiembra: estanqueActualizado.densidadSiembra,
        precria: estanqueActualizado.precria,
        metodoAlimentacion: estanqueActualizado.metodoAlimentacion,
        proveedorAlimento: estanqueActualizado.proveedorAlimento,
        numeroAireadores: estanqueActualizado.numeroAireadores,
        tieneAireadores: estanqueActualizado.tieneAireadores,
        codigoAireador: estanqueActualizado.codigoAireador,
        estanqueAireador: estanqueActualizado.estanqueAireador,
        tieneAlimentadorAutomatico:
          estanqueActualizado.tieneAlimentadorAutomatico,
      },
    });
  }

  return (
    <>
    <NavbarRegistro
      Titulo="Editar Estanque"
      Subtitulo={`${estanqueBase.finca} ${estanqueBase.codigo}`}
      Icono="edit"
    />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={contentStyle}>
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

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Input
                label="Codigo del estanque *"
                value={codigo}
                onChangeText={setCodigo}
                placeholder="Ej: EST-01"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Tipo de estanque *"
                options={TIPOS_ESTANQUE}
                value={tipoEstanque}
                onChange={setTipoEstanque}
                placeholder="Seleccione el tipo"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemFullStyle}>
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
            </View>
          </View>
        </Card>

        <Card>
          <SectionTitle title="Dimensiones" icon={ICONS.ruler} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Input
                label="Largo (m) *"
                value={largo}
                onChangeText={setLargo}
                keyboardType="numeric"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Ancho (m) *"
                value={ancho}
                onChangeText={setAncho}
                keyboardType="numeric"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Profundidad (m) *"
                value={profundidad}
                onChangeText={setProfundidad}
                keyboardType="numeric"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Fuente de agua"
                options={FUENTES_AGUA}
                value={fuenteAgua}
                onChange={setFuenteAgua}
                labelStyle={styles.label}
              />
            </View>
          </View>
        </Card>

        <Card>
          <SectionTitle title="Siembra y fechas" icon={ICONS.calendar} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Especie"
                options={ESPECIES}
                value={especie}
                onChange={setEspecie}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Fecha de siembra *"
                value={fechaSiembra}
                onChangeText={setFechaSiembra}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Fecha inicio engorde"
                value={fechaInicioEngorde}
                onChangeText={setFechaInicioEngorde}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Fecha mantenimiento"
                value={fechaMantenimiento}
                onChangeText={setFechaMantenimiento}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <NumberInput
                label="Densidad de siembra (ind/m²) *"
                value={densidadSiembra}
                onChangeText={setDensidadSiembra}
                min={0}
                max={9999}
                step={1}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Precria"
                options={OPCIONES_PRECRIA}
                value={precria}
                onChange={setPrecria}
                labelStyle={styles.label}
              />
            </View>
          </View>
        </Card>

        <Card>
          <SectionTitle title="Alimentacion y equipos" icon={ICONS.food} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Metodo de alimentacion"
                options={METODOS_ALIMENTACION}
                value={metodoAlimentacion}
                onChange={setMetodoAlimentacion}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Proveedor de alimento"
                value={proveedorAlimento}
                onChangeText={setProveedorAlimento}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="¿Tiene aireadores?"
                options={OPCIONES_AIREADORES}
                value={tieneAireadores}
                onChange={manejarTieneAireadores}
                labelStyle={styles.label}
              />
            </View>

            {tieneAireadores === "si" && (
              <View style={itemFullStyle}>
                <View style={styles.aeratorBox}>
                  <View style={gridStyle}>
                    <View style={itemStyle}>
                      <Select
                        label="Codigo del aireador"
                        options={AIREADORES_EXISTENTES}
                        value={codigoAireador}
                        onChange={setCodigoAireador}
                        placeholder="Seleccione el codigo"
                        labelStyle={styles.label}
                      />
                    </View>

                    <View style={itemStyle}>
                      <Select
                        label="Estanque seleccionado"
                        options={obtenerOpcionesEstanqueSeleccionado(
                          codigo,
                          estanqueBase.finca,
                        )}
                        value={codigo}
                        disabled={true}
                        placeholder="Ingrese primero el codigo del estanque"
                        labelStyle={styles.label}
                      />
                    </View>
                  </View>

                  <CustomText
                    size={13}
                    color={COLORS.textTertiary}
                    style={styles.helperText}
                  >
                    El aireador se asigna automaticamente al estanque actual.
                  </CustomText>
                </View>
              </View>
            )}

            <View style={itemStyle}>
              <Select
                label="¿Tiene alimentador automatico?"
                options={OPCIONES_ALIMENTADOR}
                value={tieneAlimentadorAutomatico}
                onChange={setTieneAlimentadorAutomatico}
                labelStyle={styles.label}
              />
            </View>
          </View>
        </Card>

        <View style={actionsStyle}>
          <Button
            variant="secondary"
            onPress={cancelar}
            style={styles.actionButton}
          >
            Cancelar
          </Button>

          <Button onPress={guardarCambios} style={styles.actionButton}>
            <View style={styles.inlineButtonContentCentered}>
              <Icon icon={ICONS.save} size={18} color={COLORS.white} />

              <CustomText
                size={16}
                color={COLORS.white}
                style={styles.saveText}
              >
                Guardar cambios
              </CustomText>
            </View>
          </Button>
        </View>
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
