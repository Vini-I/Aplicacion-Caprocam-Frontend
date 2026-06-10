import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import SiembraForm from "../components/SiembraForm";

/**
 * Pantalla para registrar una nueva siembra.
 * Contiene el encabezado, formulario y botón de creación.
 */
export default function NuevaSiembraScreen() {
  const handleCrearSiembra = () => {
    console.log("Crear siembra");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </View>

        <View>
          <Text style={styles.moduleText}>Módulo Siembra</Text>
          <Text style={styles.title}>Nueva Siembra</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SiembraForm />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCrearSiembra}
          activeOpacity={0.7}
        >
          <Text style={styles.createButtonText}>Crear Siembra</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3FA",
  },
  header: {
    backgroundColor: "#009EF5",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  moduleText: {
    color: "#D9F0FF",
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  content: {
    padding: 18,
  },
  createButton: {
    backgroundColor: "#009EF5",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
