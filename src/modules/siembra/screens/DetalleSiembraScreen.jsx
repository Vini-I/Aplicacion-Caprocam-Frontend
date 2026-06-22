import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  ScrollView,
  Text,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";

import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Select from "../../../shared/components/Select";
import ProgressBar from "../../../shared/components/ProgressBar";
import Alert from "../../../shared/components/Alert";
import NumberInput from "../../../shared/components/NumberInput";
import Icon from "../../../shared/components/Icons";

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/DetalleSiembraStyles";

import {
  obtenerSiembraPorId,
  obtenerProveedoresLarva,
  obtenerTecnicasCultivo,
  obtenerTiposLarva,
} from "../services/SiembraService";

const diaActual = 2;
const totalDias = 90;

function calcularEtapa(dia, diasTotales) {
  if (dia > 60) return 3;
  if (dia > 30) return 2;
  return 1;
}

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function convertirADdMmAaaa(fechaIso) {
  const partes = fechaIso.split("-");

  if (partes.length !== 3) {
    return "";
  }

  const anio = partes[0];
  const mes = partes[1];
  const dia = partes[2];

  return `${dia}/${mes}/${anio}`;
}

function convertirAAaaaMmDd(fechaTexto) {
  const partes = fechaTexto.split("/");

  if (partes.length !== 3) {
    return "";
  }

  const dia = partes[0];
  const mes = partes[1];
  const anio = partes[2];

  return `${anio}-${mes}-${dia}`;
}

export default function DetalleSiembraScreen() {
  const router = useRouter();

  const siembra = obtenerSiembraPorId(25);

  const tiposLarva = obtenerTiposLarva();
  const tiposProveedor = obtenerProveedoresLarva();
  const tiposTecnica = obtenerTecnicasCultivo();

  const [isEditing, setIsEditing] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");

  const [fechaSiembra, setFechaSiembra] = useState(
    siembra?.fechaSiembra ?? obtenerFechaActual(),
  );
  const [cantidad, setCantidad] = useState(
    String(siembra?.cantidadSembrada ?? "1000"),
  );
  const [area, setArea] = useState(siembra?.areaEstanque ?? "0.5");
  const [densidad, setDensidad] = useState(siembra?.densidad ?? "12");
  const [tipoLarva, setTipoLarva] = useState(
    siembra?.tipoLarva ?? siembra?.especie ?? "vannamei",
  );
  const [proveedor, setProveedor] = useState(
    siembra?.proveedorLarva ?? "pacifico",
  );
  const [fechaIngreso, setFechaIngreso] = useState(
    siembra?.fechaIngreso ?? siembra?.fechaSiembra ?? obtenerFechaActual(),
  );
  const [horaIngreso, setHoraIngreso] = useState(
    siembra?.horaIngreso ?? "08:30",
  );
  const [certificado, setCertificado] = useState(
    siembra?.certificadoLarva ?? "CERT-2026-001",
  );
  const [tecnica, setTecnica] = useState(siembra?.tecnicaCultivo ?? "semi");
  const [diasCiclo, setDiasCiclo] = useState(
    String(siembra?.diasMaduracion ?? "90"),
  );

  const [valoresGuardados, setValoresGuardados] = useState({
    fechaSiembra: siembra?.fechaSiembra ?? obtenerFechaActual(),
    cantidad: String(siembra?.cantidadSembrada ?? "1000"),
    area: siembra?.areaEstanque ?? "0.5",
    densidad: siembra?.densidad ?? "12",
    tipoLarva: siembra?.tipoLarva ?? siembra?.especie ?? "vannamei",
    proveedor: siembra?.proveedorLarva ?? "pacifico",
    fechaIngreso:
      siembra?.fechaIngreso ?? siembra?.fechaSiembra ?? obtenerFechaActual(),
    horaIngreso: siembra?.horaIngreso ?? "08:30",
    certificado: siembra?.certificadoLarva ?? "CERT-2026-001",
    tecnica: siembra?.tecnicaCultivo ?? "semi",
    diasCiclo: String(siembra?.diasMaduracion ?? "90"),
  });

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const etapa = calcularEtapa(diaActual, totalDias);

  function obtenerValoresActuales() {
    return {
      fechaSiembra,
      cantidad,
      area,
      densidad,
      tipoLarva,
      proveedor,
      fechaIngreso,
      horaIngreso,
      certificado,
      tecnica,
      diasCiclo,
    };
  }

  function hayCamposVacios() {
    const actuales = obtenerValoresActuales();

    return Object.values(actuales).some(
      (valor) => String(valor ?? "").trim() === "",
    );
  }

  function iniciarEdicion() {
    setMensaje("");
    setIsEditing(true);
  }

  function cancelarEdicion() {
    setFechaSiembra(valoresGuardados.fechaSiembra);
    setCantidad(valoresGuardados.cantidad);
    setArea(valoresGuardados.area);
    setDensidad(valoresGuardados.densidad);
    setTipoLarva(valoresGuardados.tipoLarva);
    setProveedor(valoresGuardados.proveedor);
    setFechaIngreso(valoresGuardados.fechaIngreso);
    setHoraIngreso(valoresGuardados.horaIngreso);
    setCertificado(valoresGuardados.certificado);
    setTecnica(valoresGuardados.tecnica);
    setDiasCiclo(valoresGuardados.diasCiclo);

    setMensaje("");
    setIsEditing(false);
  }

  function guardar() {
    if (hayCamposVacios()) {
      setMensaje("Ningún campo puede quedar en blanco.");
      setMensajeVariant("danger");
      return;
    }

    setValoresGuardados(obtenerValoresActuales());
    setMensaje("Siembra guardada correctamente.");
    setMensajeVariant("success");
    setIsEditing(false);
  }

  function regresarASiembra() {
    router.push("/siembra");
  }

  function renderFechaSiembraEditable() {
    if (Platform.OS === "web") {
      return (
        <View style={styles.webDateContainer}>
          <Text style={styles.webDateLabel}>Fecha de siembra</Text>

          <input
            type="date"
            value={convertirAAaaaMmDd(fechaSiembra)}
            max={convertirAAaaaMmDd(obtenerFechaActual())}
            onChange={(event) =>
              setFechaSiembra(convertirADdMmAaaa(event.target.value))
            }
            style={styles.webDateInput}
          />
        </View>
      );
    }

    return (
      <DateInput
        label="Fecha de siembra"
        value={fechaSiembra}
        onChangeText={setFechaSiembra}
        inputStyle={styles.inputEditing}
        labelStyle={styles.labelNombre}
      />
    );
  }

  function renderFechaIngresoEditable() {
    if (Platform.OS === "web") {
      return (
        <View style={styles.webDateContainer}>
          <Text style={styles.webDateLabel}>Fecha ingreso de larva</Text>

          <input
            type="date"
            value={convertirAAaaaMmDd(fechaIngreso)}
            max={convertirAAaaaMmDd(obtenerFechaActual())}
            onChange={(event) =>
              setFechaIngreso(convertirADdMmAaaa(event.target.value))
            }
            style={styles.webDateInput}
          />
        </View>
      );
    }

    return (
      <DateInput
        label="Fecha ingreso de larva"
        value={fechaIngreso}
        onChangeText={setFechaIngreso}
        inputStyle={styles.inputEditing}
        labelStyle={styles.labelNombre}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={regresarASiembra} style={styles.backButton}>
            <Icon icon={ICONS.exit} size={22} style={styles.headerIcon} />
          </Pressable>

          <View>
            <Text style={styles.headerSubtitle}>Detalle de Siembra</Text>
            <Text style={styles.headerTitle}>
              {siembra?.estanque ?? "A01"} – {siembra?.finca ?? "Finca"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mensaje !== "" && (
          <Alert
            message={mensaje}
            variant={mensajeVariant}
            style={styles.alert}
          />
        )}

        <Card>
          <View style={styles.resumenHeader}>
            <View style={styles.iconContainer}>
              <Icon icon={ICONS.shrimp} size={28} style={styles.summaryIcon} />
            </View>

            <View style={styles.resumenInfo}>
              <Badge
                label={`Día ${diaActual} de ${totalDias}`}
                variant="success"
                textStyle={styles.badgeText}
              />

              <Text style={styles.siembraTitle}>
                Siembra #{siembra?.siembraId ?? 25}
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Avance del ciclo</Text>
          <ProgressBar progress={Math.round((diaActual / totalDias) * 100)} />

          <Text style={styles.subtitle}>Estado de Etapa</Text>

          <View style={styles.etapas}>
            <Badge
              label="Siembra"
              variant={etapa >= 1 ? "success" : undefined}
              style={isWeb ? styles.badgeEtapa : undefined}
              textStyle={styles.badgeText}
            />
            <Badge
              label="Maduración"
              variant={etapa >= 2 ? "warning" : undefined}
              style={isWeb ? styles.badgeEtapa : undefined}
              textStyle={styles.badgeText}
            />
            <Badge
              label="Cosecha"
              variant={etapa >= 3 ? "success" : undefined}
              style={isWeb ? styles.badgeEtapa : undefined}
              textStyle={styles.badgeText}
            />
          </View>
        </Card>

        <Card title="Información de la Siembra" titleStyle={styles.cardTitle}>
          {!isEditing ? (
            <>
              <DateInput
                label="Fecha de siembra"
                value={fechaSiembra}
                disabled={true}
                inputStyle={styles.dateInputLectura}
                textStyle={styles.dateInputTexto}
                labelStyle={styles.labelNombre}
              />

              <NumberInput
                label="Camarones sembrados"
                value={cantidad}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
                min={0}
                max={1000000}
              />

              <Input
                label="Área (ha)"
                value={area}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
              />

              <Input
                label="Densidad"
                value={densidad}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
              />

              <Select
                label="Tipo de larva"
                options={tiposLarva}
                value={tipoLarva}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Select
                label="Proveedor"
                options={tiposProveedor}
                value={proveedor}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <DateInput
                label="Fecha ingreso de larva"
                value={fechaIngreso}
                disabled={true}
                inputStyle={styles.dateInputLectura}
                textStyle={styles.dateInputTexto}
                labelStyle={styles.labelNombre}
              />

              <Input
                label="Hora ingreso"
                value={horaIngreso}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
              />

              <Input
                label="Certificado de larva"
                value={certificado}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
              />

              <Select
                label="Técnica de cultivo"
                options={tiposTecnica}
                value={tecnica}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <NumberInput
                label="Duración estimada del ciclo"
                value={diasCiclo}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
                min={0}
                max={100}
              />
            </>
          ) : (
            <>
              {renderFechaSiembraEditable()}

              <NumberInput
                label="Camarones sembrados"
                value={cantidad}
                onChangeText={setCantidad}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
                min={1000}
                max={100000}
                step={1000}
              />

              <Select
                label="Tipo de larva"
                options={tiposLarva}
                value={tipoLarva}
                onChange={setTipoLarva}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Select
                label="Proveedor"
                options={tiposProveedor}
                value={proveedor}
                onChange={setProveedor}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              {renderFechaIngresoEditable()}

              <Input
                label="Hora ingreso"
                value={horaIngreso}
                onChangeText={setHoraIngreso}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
              />

              <Input
                label="Certificado de larva"
                value={certificado}
                onChangeText={setCertificado}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
              />

              <Select
                label="Técnica de cultivo"
                options={tiposTecnica}
                value={tecnica}
                onChange={setTecnica}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <NumberInput
                label="Días estimados del ciclo"
                value={diasCiclo}
                onChangeText={setDiasCiclo}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
                min={0}
                max={100}
              />
            </>
          )}
        </Card>

        {!isEditing ? (
          <Button onPress={iniciarEdicion} textStyle={styles.textoBoton}>
            Editar
          </Button>
        ) : (
          <View style={styles.actions}>
            <Button
              style={styles.button}
              onPress={guardar}
              textStyle={styles.textoBoton}
            >
              Guardar
            </Button>

            <Button
              variant="outline"
              style={styles.button}
              onPress={cancelarEdicion}
              textStyle={styles.textoBoton}
            >
              Cancelar
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
