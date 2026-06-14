/**
 * Pantalla: ProveedorScreen
 *
 * Esta pantalla muestra el listado de proveedores registrados dentro del
 * módulo de inventario.
 *
 * Funcionalidades principales:
 * - Visualizar los proveedores registrados cuando se integren los datos.
 * - Mostrar nombre, tipo de proveedor, teléfono y correo electrónico.
 * - Permitir la edición de la información de un proveedor.
 * - Permitir regresar a la pantalla anterior.
 *
 * Componentes utilizados:
 * - Navbar: encabezado de la pantalla.
 * - Card: agrupación visual de la información de cada proveedor.
 * - Button: acciones de regresar y editar proveedor.
 */
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { FontAwesome, AntDesign, MaterialIcons } from "@expo/vector-icons";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

export default function ProveedorScreen({ proveedores = [] }) {
  function handleRegresar() {
    console.log("Regresar");
  }

  function handleEditarProveedor(proveedorId) {
    console.log("Editar proveedor:", proveedorId);
  }

  function renderProveedor(proveedor) {
    return (
      <Card key={proveedor.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{proveedor.iniciales}</Text>
          </View>

          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{proveedor.nombre}</Text>
            <Text style={styles.providerType}>{proveedor.tipoProducto}</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <FontAwesome
            name={ICONS.phone.name}
            size={14}
            color={COLORS.textTertiary}
          />
          <Text style={styles.contactText}>{proveedor.telefono}</Text>
        </View>

        <View style={styles.contactRow}>
          <FontAwesome name="envelope" size={14} color={COLORS.textTertiary} />
          <Text style={styles.contactText}>{proveedor.correo}</Text>
        </View>

        <Button
          onPress={() => handleEditarProveedor(proveedor.id)}
          style={styles.editButton}
        >
          <View style={styles.editButtonContent}>
            <MaterialIcons
              name={ICONS.edit.name}
              size={16}
              color={COLORS.white}
            />

            <Text style={styles.editButtonText}>Editar proveedor</Text>
          </View>
        </Button>
      </Card>
    );
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title="Proveedores"
        leftContent={
          <Button
            variant="outline"
            onPress={handleRegresar}
            style={styles.backButton}
          >
            <AntDesign name={ICONS.exit.name} size={22} color={COLORS.white} />
          </Button>
        }
        style={styles.header}
        titleStyle={styles.headerTitle}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.wrapper}>
          <Text style={styles.summaryText}>
            {proveedores.length} proveedores registrados
          </Text>

          {proveedores.map(renderProveedor)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
  },
  scrollContent: {
    paddingVertical: 22,
    paddingBottom: 28,
  },
  wrapper: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  summaryText: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginBottom: 14,
  },
  card: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  providerType: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  contactText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginTop: 16,
  },
  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
