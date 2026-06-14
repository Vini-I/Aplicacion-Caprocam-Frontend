/**
 * Pantalla: NuevaSiembraScreen
 *
 * Permite registrar una nueva siembra mediante un formulario reutilizable.
 *
 * Funcionalidades principales:
 * - Administrar los datos ingresados en el formulario.
 * - Validar que los campos obligatorios estén completos.
 * - Mostrar un modal cuando falta información.
 * - Enviar temporalmente los datos por consola al crear la siembra.
 *
 * Componentes utilizados:
 * - Navbar: encabezado de la pantalla.
 * - SiembraForm: formulario reutilizable para los datos de siembra.
 * - Button: acción para crear la siembra.
 * - Modal: aviso cuando existen campos incompletos.
 */
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

import Navbar from "../../../shared/components/Navbar";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import SiembraForm from "../components/SiembraForm";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { useRouter } from "expo-router";

export default function NuevaSiembraScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fechaSiembra: "",
    horaIngreso: "",
    estanque: "",
    proveedorLarva: "",
    cantidadSembrada: "",
    certificadoLarva: "",
    tecnicaCultivo: "",
    diasMaduracion: "30",
  });

  function handleChange(field, value) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  }

  function handleCrearSiembra() {
    const camposObligatorios = [
      "fechaSiembra",
      "horaIngreso",
      "estanque",
      "proveedorLarva",
      "cantidadSembrada",
      "certificadoLarva",
      "tecnicaCultivo",
      "diasMaduracion",
    ];

    const hayCamposVacios = camposObligatorios.some(
      (campo) => formData[campo].trim() === "",
    );

    if (hayCamposVacios) {
      setModalVisible(true);
      return;
    }

    console.log("Siembra registrada:", formData);
  }

  function handleCerrar() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <Navbar
        title="Nueva Siembra"
        leftContent={
          <Button
            variant="outline"
            onPress={handleCerrar}
            style={styles.closeButton}
            textStyle={styles.closeText}
          >
            ✕
          </Button>
        }
        style={styles.header}
        titleStyle={styles.title}
      >
        <Text style={styles.moduleText}>Módulo Siembra</Text>
      </Navbar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.wrapper}>
          <SiembraForm formData={formData} onChange={handleChange} />

          <Button
            onPress={handleCrearSiembra}
            style={styles.createButton}
            textStyle={styles.createButtonText}
          >
            Crear Siembra
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        closeText="Aceptar"
      >
        <Text style={styles.modalTitle}>Campos incompletos</Text>
        <Text style={styles.modalMessage}>
          Debe completar todos los campos para registrar la siembra.
        </Text>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 0,
  },
  moduleText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    opacity: 0.85,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  scrollContent: {
    paddingVertical: 28,
    paddingBottom: 40,
  },
  wrapper: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 18,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
  },
  closeText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 20,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  modalTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 8,
  },
  modalMessage: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
