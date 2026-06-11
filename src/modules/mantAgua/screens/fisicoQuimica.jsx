import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─── Paleta de colores del proyecto ──────────────────────────────────────────
const C = {
  primary:    "#009EF5",
  headerBg:   "#009EF5",
  bg:         "#F1F5F9",
  card:       "#FFFFFF",
  border:     "#E2E8F0",
  inputBg:    "#F8FAFC",
  text:       "#1E293B",
  textSub:    "#64748B",
  textHint:   "#94A3B8",
  white:      "#FFFFFF",
};

export default function fisicoQuimica({ onBack }) {
  // ── Estado ──────────────────────────────────────────────────────────────────
  const [tempAM,      setTempAM]      = useState("28.0");
  const [tempPM,      setTempPM]      = useState("29.5");
  const [oxigeno,     setOxigeno]     = useState(["", "", "", "", ""]);
  const [phAM,        setPhAM]        = useState("7.8");
  const [phPM,        setPhPM]        = useState("8.0");
  const [salinidad,   setSalinidad]   = useState("14");
  const [alcalinidad, setAlcalinidad] = useState("128");
  const [secchi,      setSecchi]      = useState("35");
  const [amonio,      setAmonio]      = useState("<0.01");
  const [nitrito,     setNitrito]     = useState("0.00");
  const [nitrato,     setNitrato]     = useState("0.00");
  const [fosfatos,    setFosfatos]    = useState("0.00");

  const updateOx = (i, v) => {
    const arr = [...oxigeno];
    arr[i] = v;
    setOxigeno(arr);
  };

  const handleGuardar = () => {
    Alert.alert("Módulo guardado", "Físico-Química registrado correctamente.");
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.headerBg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={C.white} />
          <Text style={styles.backText}>Módulos</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Ionicons name="flask" size={20} color={C.white} />
          <Text style={styles.headerTitleText}>Físico-Química</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── TEMPERATURA ─────────────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Card header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="thermometer" size={18} color={C.primary} />
              <Text style={styles.cardTitle}>Temperatura</Text>
              <Text style={styles.cardUnit}> (°C)</Text>
            </View>
            <Text style={styles.badge}>Ideal: 28–30°C</Text>
          </View>

          {/* Inputs AM / PM */}
          <View style={styles.row2}>
            {/* AM */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>AM</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={tempAM}
                  onChangeText={setTempAM}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
              </View>
            </View>
            {/* PM */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>PM</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={tempPM}
                  onChangeText={setTempPM}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ── OXÍGENO DISUELTO ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="water" size={18} color={C.primary} />
              <Text style={styles.cardTitle}>Oxígeno Disuelto</Text>
              <Text style={styles.cardUnit}> (mg/L)</Text>
            </View>
            <Text style={styles.badge}>Mín: 5 mg/L</Text>
          </View>

          <Text style={styles.subHint}>Hasta 5 lecturas diarias</Text>

          <View style={styles.oxRow}>
            {["1\n5AM", "2", "3", "4", "5"].map((lbl, i) => (
              <View key={i} style={styles.oxItem}>
                <Text style={styles.oxLabel}>{lbl}</Text>
                <TextInput
                  style={styles.oxInput}
                  value={oxigeno[i]}
                  onChangeText={(v) => updateOx(i, v)}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
              </View>
            ))}
          </View>
        </View>

        {/* ── pH ──────────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="pulse" size={18} color={C.primary} />
              <Text style={styles.cardTitle}>pH</Text>
            </View>
            <Text style={styles.badge}>Ideal: 7.5–8.5</Text>
          </View>

          <View style={styles.row2}>
            {/* AM */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>AM</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={phAM}
                  onChangeText={setPhAM}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
              </View>
            </View>
            {/* PM */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>PM</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={phPM}
                  onChangeText={setPhPM}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ── SALINIDAD Y ALCALINIDAD ──────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="analytics" size={18} color={C.primary} />
              <Text style={styles.cardTitle}>Salinidad y Alcalinidad</Text>
            </View>
          </View>

          <View style={styles.row2}>
            {/* Salinidad */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Salinidad</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={salinidad}
                  onChangeText={setSalinidad}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
                <Text style={styles.unit}>ppt</Text>
              </View>
              <Text style={styles.hint}>5–40 ppt</Text>
            </View>
            {/* Alcalinidad */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Alcalinidad</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={alcalinidad}
                  onChangeText={setAlcalinidad}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
                <Text style={styles.unit}>mg/L</Text>
              </View>
              <Text style={styles.hint}>80–150 mg/L</Text>
            </View>
          </View>
        </View>

        {/* ── TURBIDEZ SECCHI ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="eye" size={18} color={C.primary} />
              <Text style={styles.cardTitle}>Turbidez Secchi</Text>
              <Text style={styles.cardUnit}> (cm)</Text>
            </View>
            <Text style={styles.badge}>Ideal: 25–45 cm</Text>
          </View>

          <Text style={styles.inputLabel}>Lectura disco Secchi</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={secchi}
              onChangeText={setSecchi}
              keyboardType="decimal-pad"
              placeholder="—"
              placeholderTextColor={C.textHint}
            />
            <Text style={styles.unit}>cm</Text>
          </View>
          <Text style={styles.hint}>Profundidad visible</Text>
        </View>

        {/* ── NUTRIENTES ──────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="flask" size={18} color={C.primary} />
              <Text style={styles.cardTitle}>Nutrientes</Text>
              <Text style={styles.cardUnit}> (mg/L)</Text>
            </View>
          </View>

          {/* Fila 1: Amonio + Nitrito */}
          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Amonio (NH₃)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={amonio}
                  onChangeText={setAmonio}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
                <Text style={styles.unit}>mg/L</Text>
              </View>
              <Text style={styles.hint}>Máx: 0.1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Nitrito (NO₂)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={nitrito}
                  onChangeText={setNitrito}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
                <Text style={styles.unit}>mg/L</Text>
              </View>
              <Text style={styles.hint}>Máx: 0.1</Text>
            </View>
          </View>

          {/* Fila 2: Nitrato + Fosfatos */}
          <View style={[styles.row2, { marginTop: 12 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Nitrato (NO₃)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={nitrato}
                  onChangeText={setNitrato}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
                <Text style={styles.unit}>mg/L</Text>
              </View>
              <Text style={styles.hint}>Máx: 10</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Fosfatos (PO₄)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={fosfatos}
                  onChangeText={setFosfatos}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={C.textHint}
                />
                <Text style={styles.unit}>mg/L</Text>
              </View>
              <Text style={styles.hint}>Máx: 1</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Footer / Guardar ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleGuardar}
          activeOpacity={0.85}
        >
          <Ionicons name="save" size={18} color={C.white} />
          <Text style={styles.saveBtnText}>Guardar módulo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    backgroundColor: C.headerBg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  backBtn:         { flexDirection: "row", alignItems: "center", gap: 4 },
  backText:        { fontSize: 14, color: C.white },
  headerTitle:     { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitleText: { fontSize: 22, fontWeight: "700", color: C.white },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },

  // Card
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle:      { fontSize: 15, fontWeight: "700", color: C.text },
  cardUnit:       { fontSize: 13, color: C.textSub },
  badge:          { fontSize: 12, color: C.primary },

  // Layout
  row2: { flexDirection: "row", gap: 12 },

  // Inputs
  inputLabel: { fontSize: 13, color: C.textSub, marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, fontSize: 16, color: C.text },
  unit:  { fontSize: 13, color: C.textHint, marginLeft: 4 },
  hint:  { fontSize: 11, color: C.textHint, marginTop: 4 },

  // Oxígeno
  subHint: { fontSize: 12, color: C.textHint, marginBottom: 10 },
  oxRow:   { flexDirection: "row", gap: 8 },
  oxItem:  { flex: 1, alignItems: "center", gap: 4 },
  oxLabel: { fontSize: 11, color: C.textSub, textAlign: "center" },
  oxInput: {
    width: "100%",
    backgroundColor: C.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    height: 40,
    textAlign: "center",
    fontSize: 14,
    color: C.text,
  },

  // Footer
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.headerBg,
    borderRadius: 14,
    height: 52,
  },
  saveBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
});
