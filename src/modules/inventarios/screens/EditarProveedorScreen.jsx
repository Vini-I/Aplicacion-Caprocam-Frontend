import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { proveedoresService } from "../services/proveedoresService";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Select from "../../../shared/components/Select";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

const TIPOS_PRODUCTO = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];

const PROVEEDORES = [
  { label: "Biomar", value: "Biomar" },
  { label: "Farivet", value: "Farivet" },
  { label: "Trisan", value: "Trisan" },
];

export default function EditarProveedorScreen() {
    const { id } = useLocalSearchParams();
    const proveedorEjemplo = proveedoresService.getProveedorById(id);
  const [nombre, setNombre] = useState(proveedorEjemplo.nombre);
  const [tipoProducto, setTipoProducto] = useState(
    proveedorEjemplo.tipoProducto,
  );
  const [telefono, setTelefono] = useState(proveedorEjemplo.telefono);
  const [correo, setCorreo] = useState(proveedorEjemplo.correo);
  const [direccion, setDireccion] = useState(proveedorEjemplo.direccion);
  const [notas, setNotas] = useState(proveedorEjemplo.notas);
  const [mensaje, setMensaje] = useState("");
  const [mensajeVariant, setMensajeVariant] = useState("info");

  function guardar() {
    if (telefono === "") {
      setMensaje("El teléfono no puede quedar vacío.");
      setMensajeVariant("danger");
      return;
    }

    if (correo === "") {
      setMensaje("El correo no puede quedar vacío.");
      setMensajeVariant("danger");
      return;
    }

    const proveedor = {
      nombre,
      tipoProducto,
      telefono,
      correo,
      direccion,
      notas,
    };
    setMensaje("Proveedor actualizado correctamente.");
    setMensajeVariant("success");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}></Text>
        <Text style={styles.headerTitle}>Editar Proveedor</Text>
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
          <Input label="Nombre de la empresa" 
          value={nombre} 
          editable={false} 
          style={{color: COLORS.textSecondary }}
          />

          <Select
            label="Tipo de producto"
            value={tipoProducto}
            onChange={setTipoProducto}
            options={TIPOS_PRODUCTO}
            labelStyle={styles.selectLabel}
          />

          <Input
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+506 2222-3344"
            keyboardType="phone-pad"
          />
          <Input
            label="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            placeholder="ventas@empresa.com"
            keyboardType="email-address"
          />
          <Input
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="San José, Costa Rica"
          />
          <Input
            label="Notas"
            value={notas}
            onChangeText={setNotas}
            placeholder="Observaciones adicionales..."
            multiline={true}
          />
        </Card>

        <Button onPress={guardar}>Guardar cambios</Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
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
  content: { padding: 16, width: "100%", maxWidth: 900, alignSelf: "center" },
  alert: { marginBottom: 16 },
  selectLabel: { color: COLORS.textSecondary },
});
