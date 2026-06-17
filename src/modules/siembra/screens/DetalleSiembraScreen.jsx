import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

// Componentes de UI reutilizables del proyecto
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import ProgressBar from "../../../shared/components/ProgressBar";
import Alert from "../../../shared/components/Alert";
import NumberInput from "../../../shared/components/NumberInput";
import Icon from "../../../shared/components/Icons";

// Tema global: colores, tipografía e iconos
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

// Opciones para el select de tipo de larva
const tiposLarva = [
  { label: "PL10", value: "pl10" },
  { label: "PL12", value: "pl12" },
];

// Opciones para el select de proveedor
const tiposProveedor = [
  { label: "Larvas del Pacífico", value: "pacifico" },
  { label: "AquaLarva", value: "aqua" },
  { label: "Maricultura CR", value: "maricultura" },
];

// Opciones para el select de técnica de cultivo
const tiposTecnica = [
  { label: "Extensiva", value: "extensiva" },
  { label: "Semi-intensiva", value: "semi" },
  { label: "Intensiva", value: "intensiva" },
];

// Datos del ciclo actual (en producción vendrían del backend)
const diaActual = 2;
const totalDias = 90;

// Retorna la etapa del ciclo: 1=Siembra, 2=Maduración, 3=Cosecha
function calcularEtapa(dia, diasTotales) {
  if (dia > 60) return 3;
  if (dia > 30) return 2;
  return 1;
}

export default function DetalleSiembraScreen() {

  // Controla si el formulario está en modo lectura o edición
  const [isEditing, setIsEditing] = useState(false);

  // Mensaje de feedback al usuario (éxito o error)
  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");

  // Campos del formulario
  const [fechaSiembra, setFechaSiembra] = useState("");
  const [cantidad, setCantidad] = useState("1000");
  const [area, setArea] = useState("0.5");
  const [densidad, setDensidad] = useState("12");
  const [tipoLarva, setTipoLarva] = useState("pl12");
  const [proveedor, setProveedor] = useState("pacifico");
  const [fechaIngreso, setFechaIngreso] = useState("03/06/2026");
  const [horaIngreso, setHoraIngreso] = useState("08:30");
  const [certificado, setCertificado] = useState("CERT-2026-001");
  const [tecnica, setTecnica] = useState("semi");
  const [diasCiclo, setDiasCiclo] = useState("90");

  // Copia del último estado guardado. Se usa para restaurar
  // los campos si el usuario cancela la edición.
  const [valoresGuardados, setValoresGuardados] = useState({
    fechaSiembra: "",
    cantidad: "1000",
    area: "0.5",
    densidad: "12",
    tipoLarva: "pl12",
    proveedor: "pacifico",
    fechaIngreso: "03/06/2026",
    horaIngreso: "08:30",
    certificado: "CERT-2026-001",
    tecnica: "semi",
    diasCiclo: "90",
  });

  // Ancho de pantalla para distinguir móvil vs web/tablet
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  // Etapa actual del ciclo calculada una sola vez por render
  const etapa = calcularEtapa(diaActual, totalDias);

  // Agrupa los valores del formulario en un objeto para validarlos de una vez.
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

  // Devuelve true si algún campo está vacío.
  function hayCamposVacios() {
    const actuales = obtenerValoresActuales();
    return Object.values(actuales).some((valor) => valor.trim() === "");
  }

  // Limpia el mensaje y activa el modo edición
  function iniciarEdicion() {
    setMensaje("");
    setIsEditing(true);
  }

  // Restaura los campos al último valor guardado y vuelve al modo lectura.
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
    setDiasCiclo(valoresGuardados.diasMaduracion);

    setMensaje("");
    setIsEditing(false);
  }

  function guardar() {
    // Valida que ningún campo esté en blanco antes de guardar
    if (hayCamposVacios()) {
      setMensaje("Ningún campo puede quedar en blanco.");
      setMensajeVariant("danger");
      return;
    }

    // Actualiza el snapshot y regresa al modo lectura
    setValoresGuardados(obtenerValoresActuales());
    setMensaje("Siembra guardada correctamente.");
    setMensajeVariant("success");
    setIsEditing(false);
  }

  return (
    <View style={styles.container}>

      {/* Encabezado con nombre de la finca */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Detalle de Siembra</Text>
        <Text style={styles.headerTitle}>A01 – Finca Pivot</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Muestra el alert solo si hay un mensaje activo */}
        {mensaje !== "" && (
          <Alert
            message={mensaje}
            variant={mensajeVariant}
            style={styles.alert}
          />
        )}

        {/* Tarjeta resumen: ícono, día actual, progreso y etapa */}
        <Card>
          <View style={styles.resumenHeader}>
            <View style={styles.iconContainer}>
              <Icon icon={ICONS.shrimp} size={28} color={COLORS.white} />
            </View>
            <View style={styles.resumenInfo}>
              <Badge
                label={`Día ${diaActual} de ${totalDias}`}
                variant="success"
                textStyle={styles.badgeText}
              />
              <Text style={styles.siembraTitle}>Siembra #25</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Avance del ciclo</Text>
          {/* Porcentaje calculado en base al día actual vs total */}
          <ProgressBar progress={Math.round((diaActual / totalDias) * 100)} />

          <Text style={styles.subtitle}>Estado de Etapa</Text>
          {/* Cada badge se colorea según la etapa alcanzada */}
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

        {/* Tarjeta con los datos del lote: alterna entre lectura y edición */}
        <Card title="Información de la Siembra" titleStyle={styles.cardTitle}>
          {!isEditing ? (
            // Modo lectura: todos los campos deshabilitados
            <>
              <Input
                label="Fecha de siembra"
                inputType="date"
                value={fechaSiembra}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
              />
              <NumberInput
                label="Camarones sembrados"
                value={cantidad}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
                min={0}
                max={100}
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
              <Input
                label="Fecha ingreso de larva"
                inputType="date"
                value={fechaIngreso}
                editable={false}
                style={styles.inputNombre}
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
                label="Duracion estimada del Ciclo"
                value={diasCiclo}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
                min={0}
                max={100}
              />
            </>
          ) : (
            // Modo edición: campos habilitados para modificar
            <>
              <Input
                label="Fecha de siembra"
                inputType="date"
                value={fechaSiembra}
                onChangeText={setFechaSiembra}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
              />
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
              <Input
                label="Fecha ingreso de larva"
                inputType="date"
                value={fechaIngreso}
                onChangeText={setFechaIngreso}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
              />
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
                label="Días estimada del ciclo"
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

        {/* Botones: en lectura muestra Editar, en edición muestra Guardar y Cancelar */}
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

const styles = StyleSheet.create({
  // Fondo general de la pantalla
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  // Franja superior con color primario y esquinas redondeadas abajo
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.white,
    opacity: 0.9,
  },
  // Limita el ancho en pantallas grandes y centra el contenido
  content: {
    padding: 16,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  alert: {
    marginBottom: 16,
  },
  // Fila con ícono + badge + título de la siembra
  resumenHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  // Cuadro de fondo del ícono del camarón
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  resumenInfo: {
    flex: 1,
  },
  siembraTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  // Subtítulos de sección dentro de la tarjeta resumen
  subtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textTertiary,
    marginTop: 1,
    marginBottom: 16,
  },
  // Fila horizontal de los tres badges de etapa
  etapas: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 16,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  // En web los badges de etapa se expanden para ocupar el mismo ancho
  badgeEtapa: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  // Fila de botones Guardar / Cancelar en modo edición
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  // Cada botón ocupa el mismo ancho dentro de la fila
  button: {
    flex: 1,
  },
  textoBoton: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  // Estilo de Select en modo lectura: sin borde y fondo secundario
  selectVista: {
    backgroundColor: COLORS.secondary,
    opacity: 1,
    borderWidth: 0,
  },
  // Estilo de Input/NumberInput en modo lectura: fondo gris, sin edición visual
  inputNombre: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
    opacity: 1,
    color: COLORS.black,
  },
  labelNombre: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  labelSelect: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  textoSeleccionado: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  textoOpciones: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  // Estilo de Input/NumberInput en modo edición: borde visible, fondo blanco
  inputEditing: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    opacity: 1,
    color: COLORS.black,
  },
});