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

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../styles/NuevaSiembraStyles";
import Navbar from "../../../shared/components/Navbar";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import { ICONS } from "../../../theme/icons";
import SiembraForm from "../components/SiembraForm";
import useNuevaSiembra from "../hooks/useNuevaSiembra";

export default function NuevaSiembraScreen() {
  const router = useRouter();

  const {
    formData,
    modalVisible,
    setModalVisible,
    handleChange,
    handleCrearSiembra,
  } = useNuevaSiembra();

  function handleCerrar() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <NavbarRegistro
        Titulo="Nueva Siembra"
        Subtitulo="Registrar siembra"
        Icono="add"
      />

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
