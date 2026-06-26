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
import { View, Text, ScrollView } from "react-native";

import { styles } from "../styles/NuevaSiembraStyles";
import Navbar from "../../../shared/components/Navbar";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import Icon from "../../../shared/components/Icons";
import { ICONS } from "../../../theme/icons";
import SiembraForm from "../components/SiembraForm";
import { useRouter } from "expo-router";

//FUNCION PARA PONER LA FECHA POR DEFECTO
function getTodayTextDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function NuevaSiembraScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fechaSiembra: getTodayTextDate(),
    horaIngreso: "",
    finca: "",
    estanque: "",
    proveedorLarva: "",
    cantidadSembrada: "",
    certificadoLarva: "",
    tecnicaCultivo: "",
    tipoLarva: "vannamei",
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
      "finca",
      "estanque",
      "proveedorLarva",
      "cantidadSembrada",
      "certificadoLarva",
      "tecnicaCultivo",
      "diasMaduracion",
      "tipoLarva",
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
            style={styles.backButton}
          >
            <Icon icon={ICONS.back} size={22} style={styles.iconColor} />
          </Button>
        }
        style={styles.header}
        titleStyle={styles.title}
      ></Navbar>

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
