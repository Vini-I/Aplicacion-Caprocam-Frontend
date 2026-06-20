/**
 * ============================================================
 * SCREEN: ENFERMEDADES
 * ============================================================
 *
 * Modulo para registrar enfermedades por finca y estanque.
 *
 * Funcionalidad:
 * - Permite seleccionar una finca.
 * - Carga los estanques de la finca seleccionada.
 * - Permite seleccionar una o varias enfermedades.
 * - Permite escribir un reporte sanitario.
 * - Guarda el registro en memoria local de la pantalla.
 * - Muestra los detalles guardados debajo del formulario.
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

import { styles } from "../styles/EnfermedadesStyles";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

const FINCAS = [
  {
    label: "Finca El Pacífico",
    value: "finca_el_pacifico",
  },
  {
    label: "Finca Santa Rosa",
    value: "finca_santa_rosa",
  },
];

const ESTANQUES_POR_FINCA = {
  finca_el_pacifico: [
    {
      label: "E-01 - Litopenaeus vannamei",
      value: "E-01",
    },
    {
      label: "E-02 - Litopenaeus vannamei",
      value: "E-02",
    },
  ],

  finca_santa_rosa: [
    {
      label: "E-01 - Litopenaeus stylirostris",
      value: "E-01",
    },
  ],
};

const ENFERMEDADES = [
  {
    label: "WSSV - Mancha Blanca",
    value: "wssv",
  },
  {
    label: "AHPND - Necrosis hepatopancreática aguda",
    value: "ahpnd",
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
    label: "IHHNV",
    value: "ihhnv",
  },
  {
    label: "NHP",
    value: "nhp",
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

const SEVERIDADES = [
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
    label: "Crítica",
    value: "critica",
  },
];

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function obtenerNombrePorValor(lista, valor) {
  let nombre = valor;

  lista.forEach(function (item) {
    if (item.value === valor) {
      nombre = item.label;
    }
  });

  return nombre;
}

export default function EnfermedadesScreen({ onBack, navigation }) {
  const router = useRouter();
  const { width } = useWindowDimensions();

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
  const [enfermedadesSeleccionadas, setEnfermedadesSeleccionadas] = useState(
    [],
  );
  const [severidad, setSeveridad] = useState("");
  const [mortalidad, setMortalidad] = useState("0");
  const [reporte, setReporte] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [casosRegistrados, setCasosRegistrados] = useState([]);

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

  let opcionesEstanques = [];

  if (finca !== "") {
    opcionesEstanques = ESTANQUES_POR_FINCA[finca];
  }

  if (opcionesEstanques === undefined) {
    opcionesEstanques = [];
  }

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
    let nuevasEnfermedades = [];
    let yaExiste = false;

    enfermedadesSeleccionadas.forEach(function (item) {
      if (item === valor) {
        yaExiste = true;
      }
    });

    if (yaExiste === true) {
      enfermedadesSeleccionadas.forEach(function (item) {
        if (item !== valor) {
          nuevasEnfermedades.push(item);
        }
      });
    }

    if (yaExiste === false) {
      enfermedadesSeleccionadas.forEach(function (item) {
        nuevasEnfermedades.push(item);
      });

      nuevasEnfermedades.push(valor);
    }

    setEnfermedadesSeleccionadas(nuevasEnfermedades);
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(obtenerFechaActual());
    setResponsable("");
    setEnfermedadesSeleccionadas([]);
    setSeveridad("");
    setMortalidad("0");
    setReporte("");
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

    if (valido === true && enfermedadesSeleccionadas.length === 0) {
      setTipoMensaje("warning");
      setMensaje("Debe seleccionar al menos una enfermedad.");
      valido = false;
    }

    if (valido === true && severidad === "") {
      setTipoMensaje("warning");
      setMensaje("Debe seleccionar la severidad del caso.");
      valido = false;
    }

    if (valido === true && reporte === "") {
      setTipoMensaje("warning");
      setMensaje("Debe escribir un reporte del caso.");
      valido = false;
    }

    return valido;
  }

  function registrarEnfermedad() {
    if (validarFormulario() === false) {
      return;
    }

    const nuevoCaso = {
      id: String(Date.now()),
      finca: finca,
      fincaNombre: obtenerNombrePorValor(FINCAS, finca),
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      enfermedades: enfermedadesSeleccionadas,
      severidad: severidad,
      mortalidad: mortalidad,
      reporte: reporte,
    };

    let nuevosCasos = [];

    casosRegistrados.forEach(function (caso) {
      nuevosCasos.push(caso);
    });

    nuevosCasos.push(nuevoCaso);

    setCasosRegistrados(nuevosCasos);

    console.log("Enfermedad registrada:", nuevoCaso);

    setTipoMensaje("success");
    setMensaje("Enfermedad registrada correctamente.");

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
            <Icon
              icon={ICONS.chemicalContainer}
              size={26}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.headerTextBox}>
            <Title
              level={3}
              color={COLORS.white}
              fuente={TYPOGRAPHY.fontFamily.bold}
            >
              Enfermedades
            </Title>

            <CustomText
              size={14}
              color={COLORS.white}
              style={styles.headerSubtitle}
            >
              Registro sanitario por finca y estanque
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

        <Card>
          <SectionTitle title="Ubicación del caso" icon={ICONS.document} />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Finca *"
                options={FINCAS}
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
          <SectionTitle title="Enfermedades que presenta" icon={ICONS.report} />

          <View style={styles.optionsGrid}>
            {ENFERMEDADES.map(function (item) {
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
                label="Severidad *"
                options={SEVERIDADES}
                value={severidad}
                onChange={setSeveridad}
                placeholder="Seleccione la severidad"
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <NumberInput
                label="Mortalidad registrada"
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
                label="Reporte *"
                value={reporte}
                onChangeText={setReporte}
                placeholder="Describa síntomas, observaciones o acciones realizadas"
                multiline={true}
                labelStyle={styles.label}
                style={styles.textArea}
              />
            </View>
          </View>
        </Card>

        <Button onPress={registrarEnfermedad} style={styles.saveButton}>
          <View style={styles.inlineButtonContentCentered}>
            <Icon icon={ICONS.save} size={18} color={COLORS.white} />

            <CustomText size={16} color={COLORS.white} style={styles.saveText}>
              Registrar enfermedad
            </CustomText>
          </View>
        </Button>

        <Card>
          <SectionTitle title="Detalles guardados" icon={ICONS.certificate} />

          {casosRegistrados.length === 0 && (
            <CustomText
              size={14}
              color={COLORS.textTertiary}
              style={styles.emptyText}
            >
              Aún no hay enfermedades registradas.
            </CustomText>
          )}

          {casosRegistrados.map(function (caso) {
            return <CasoRegistrado key={caso.id} caso={caso} />;
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
  let enfermedadesTexto = "";

  caso.enfermedades.forEach(function (item, index) {
    let nombre = obtenerNombrePorValor(ENFERMEDADES, item);

    if (index === 0) {
      enfermedadesTexto = nombre;
    }

    if (index > 0) {
      enfermedadesTexto = `${enfermedadesTexto}, ${nombre}`;
    }
  });

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
      <Info label="Severidad" value={caso.severidad} />
      <Info label="Mortalidad" value={caso.mortalidad} />
      <Info label="Reporte" value={caso.reporte} />
    </View>
  );
}

function Info({ label, value }) {
  let valorFinal = value;

  if (value === "" || value === undefined || value === null) {
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
