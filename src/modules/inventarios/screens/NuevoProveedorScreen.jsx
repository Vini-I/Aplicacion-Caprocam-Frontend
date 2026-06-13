import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";

// Componentes de UI reutilizables del proyecto.
// Cada uno encapsula su propio estilo y lógica interna.
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Navbar from "../../../shared/components/Navbar";
import Select from "../../../shared/components/Select";

// Colores y tipografía centralizados. Siempre usar estas variables
// en lugar de valores directos para mantener consistencia visual.
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

// Lista de tipos de producto que puede proveer un proveedor.
// Se usa para poblar el segundo Select del formulario.
// En producción estos datos vendrían del backend.
const TIPOS_PRODUCTO = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];

// Lista de proveedores disponibles para seleccionar.
// Se usa para poblar el primer Select del formulario.
// En producción estos datos vendrían del backend.
const PROVEEDORES = [
  { label: "Biomar", value: "Biomar" },
  { label: "Farivet", value: "Farivet" },
  { label: "Trisan", value: "Trisan" },
];

export default function NuevoProveedorScreen() {

  // ── Campos del formulario ──────────────────────────────────
  // Cada campo tiene su propio estado. Al cambiar un valor
  // React re-renderiza solo lo necesario.
  const [nombre, setNombre] = useState("");         // Nombre del proveedor seleccionado
  const [tipoProducto, setTipoProducto] = useState(""); // Tipo de producto que provee
  const [telefono, setTelefono] = useState("");     // Teléfono de contacto (opcional)
  const [correo, setCorreo] = useState("");         // Correo electrónico (opcional)
  const [direccion, setDireccion] = useState("");   // Dirección física (opcional)
  const [notas, setNotas] = useState("");           // Observaciones adicionales (opcional)

  // `mensaje` controla el texto del Alert visible en pantalla.
  // `mensajeVariant` controla el color: "danger" = rojo, "success" = verde.
  // Si mensaje está vacío, el Alert no se muestra.
  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");

  // ── Función principal: guardar proveedor ───────────────────
  function guardar() {
    // Validación 1: el nombre es obligatorio porque identifica al proveedor.
    // Si está vacío, se muestra error y se detiene la ejecución con return.
    if (nombre === "") {
      setMensaje("Debe ingresar el nombre de la empresa.");
      setMensajeVariant("danger");
      return;
    }

    // Validación 2: el tipo de producto es obligatorio para categorizar
    // al proveedor dentro del sistema.
    if (tipoProducto === "") {
      setMensaje("Debe seleccionar el tipo de producto.");
      setMensajeVariant("danger");
      return;
    }

    // Se construye el objeto con todos los datos del formulario.
    // Los campos opcionales (teléfono, correo, dirección, notas)
    // se incluyen aunque estén vacíos; el backend decide qué hacer con ellos.
    const proveedor = {
      nombre,
      tipoProducto,
      telefono,
      correo,
      direccion,
      notas,
    };

    // TODO: reemplazar el console.log con la llamada real al backend (POST /proveedores)
    console.log("Proveedor guardado:", proveedor);
    setMensaje("Proveedor guardado correctamente.");
    setMensajeVariant("success");
  }

  return (
    <View style={styles.container}>

      {/* Encabezado: muestra la sección ("Proveedores") y el título de la pantalla */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Proveedores</Text>
        <Text style={styles.headerTitle}>Nuevo proveedor</Text>
      </View>

      {/* ScrollView permite desplazarse si el formulario supera la altura de la pantalla */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* El Alert solo se renderiza cuando hay un mensaje activo.
            Aparece arriba del formulario para que el usuario lo vea de inmediato. */}
        {mensaje !== "" && (
          <Alert
            message={mensaje}
            variant={mensajeVariant}
            style={styles.alert}
          />
        )}

        {/* Card agrupa visualmente todos los campos del formulario */}
        <Card>

          {/* Select de nombre: el usuario elige de una lista predefinida de proveedores.
              onChange actualiza el estado `nombre` con el value seleccionado. */}
          <Select
            label="Nombre de la empresa"
            value={nombre}
            onChange={setNombre}
            options={PROVEEDORES}
            placeholder="Seleccione un proveedor"
            labelStyle={styles.labelSelect}
            selectedTextStyle={styles.textoSeleccionado}
            optionTextStyle={styles.textoOpciones}
          />

          {/* Select de tipo de producto: categoriza al proveedor dentro del sistema. */}
          <Select
            label="Tipo de producto que provee"
            value={tipoProducto}
            onChange={setTipoProducto}
            options={TIPOS_PRODUCTO}
            placeholder="Seleccione un tipo de producto"
            labelStyle={styles.labelSelect}
            selectedTextStyle={styles.textoSeleccionado}
            optionTextStyle={styles.textoOpciones}
          />

          {/* keyboardType="phone-pad" abre el teclado numérico en móvil */}
          <Input
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+506 2222-3344"
            keyboardType="phone-pad"
            style={styles.inputNombre}
            labelStyle={styles.labelNombre}
          />

          {/* keyboardType="email-address" adapta el teclado para correos en móvil */}
          <Input
            label="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            placeholder="ventas@empresa.com"
            keyboardType="email-address"
            style={styles.inputNombre}
            labelStyle={styles.labelNombre}
          />

          <Input
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="San José, Costa Rica"
            style={styles.inputNombre}
            labelStyle={styles.labelNombre}
          />

          {/* multiline=true permite que el campo crezca en altura para texto largo */}
          <Input
            label="Notas"
            value={notas}
            onChangeText={setNotas}
            placeholder="Observaciones adicionales..."
            multiline={true}
            style={styles.inputNombre}
            labelStyle={styles.labelNombre}
          />
        </Card>

        {/* Botón principal: dispara guardar() que valida y envía los datos */}
        <Button onPress={guardar} textStyle={styles.textoBoton}>
          Guardar proveedor
        </Button>
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
    fontFamily: TYPOGRAPHY.fontFamily.regular,
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
  labelSelect: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
  },
  textoSeleccionado: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  textoOpciones: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  inputNombre: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  labelNombre: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  textoBoton: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});