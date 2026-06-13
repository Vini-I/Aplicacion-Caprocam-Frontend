/**
 * ============================================================
 * PANTALLA FISICOQUIMICA
 * ============================================================
 *
 * Esta pantalla agrupa las mediciones fisico-quimicas del
 * modulo de agua y permite registrarlas con los componentes
 * reutilizables del proyecto.
 *
 * Permite:
 * - Consultar y editar temperatura
 * - Consultar y editar oxigeno disuelto
 * - Consultar y editar pH
 * - Seleccionar salinidad desde una ruleta
 * - Mostrar confirmacion visual al guardar
 *
 * ---
 * USO
 * ---
 *
 * Se renderiza dentro del flujo de navegacion del modulo y
 * recibe la prop onBack para volver a la vista anterior.
 *
 * ============================================================
 * EJEMPLO DE USO
 * ============================================================
 *
 * <FisicoQuimica onBack={volver} />
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import Button from '../../../shared/components/Button';
import Alert from '../../../shared/components/Alert';
import Text from '../../../shared/components/Text';
import Title from '../../../shared/components/Title';
import Footer from '../../../shared/components/Footer';
import RangeCard from '../components/RangeCard';
import SingleWheelCard from '../components/SingleWheelCard';
import { Ionicons } from '@expo/vector-icons';

// ─── Paleta de colores del proyecto ──────────────────────────────────────────
const C = {
  primary: "#009EF5",
  headerBg: "#009EF5",
  bg: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  inputBg: "#F8FAFC",
  text: "#1E293B",
  textSub: "#64748B",
  textHint: "#94A3B8",
  white: "#FFFFFF",
};

export default function FisicoQuimica({ onBack }) {
  // ── Estado ──────────────────────────────────────────────────────────────────
  const [salinidad, setSalinidad] = useState("14");
  const [, setTempReadings] = useState([]);
  const [, setPhReadings] = useState([]);
  const [, setOxReadings] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const alertTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
    };
  }, []);


  const handleGuardar = () => {
    setShowAlert(true);

    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }

    alertTimerRef.current = setTimeout(() => {
      setShowAlert(false);
      alertTimerRef.current = null;
    }, 3000);
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
          <Text tamano="sm" color={C.white} estilo={styles.backText}>
            Módulos
          </Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Ionicons name="flask" size={20} color={C.white} />
          <Title level={4} color={C.white} style={styles.headerTitleText}>
            Físico-Química
          </Title>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── TEMPERATURA ─────────────────────────────────────────────── */}

        <RangeCard
          title="Temperatura" unit="°C" icon="thermometer"
          idealMin={28} idealMax={30}
          sliderMin={15} sliderMax={45}
          step={0.5} decimals={1}
          maxReadings={2} labelStyle="daynight"
          colors={C} styles={styles}
          onChange={(r) => setTempReadings(r)}
        />


        {/* ── OXÍGENO DISUELTO ─────────────────────────────────────────────── */}
        <RangeCard
          title="Oxígeno Disuelto"
          unit="mg/L" icon="water"
          idealMin={5}
          sliderMin={0} sliderMax={20}
          step={0.1} decimals={1}
          showProgress={false} showRangeColor={false}
          maxReadings={5} labelStyle="numeric"
          colors={C} styles={styles}
          onChange={(r) => setOxReadings(r)}
        />

        {/* ── pH ──────────────────────────────────────────────────────────── */}
        <RangeCard
          title="pH" unit="pH" icon="flask-outline"
          idealMin={7.5} idealMax={8.5}
          sliderMin={4} sliderMax={10}
          step={0.1} decimals={1}
          maxReadings={2} labelStyle="daynight"
          colors={C} styles={styles}
          onChange={(r) => setPhReadings(r)}
        />

        {/* ── SALINIDAD ──────────────────────────────────────── */}
        <SingleWheelCard
          title="Salinidad"
          icon="analytics-outline"
          label="Salinidad"
          unit="ppt"
          min={5}
          max={40}
          idealMin={10}
          idealMax={25}
          value={salinidad}
          onChange={setSalinidad}
          colors={C}
          styles={styles}
        />

        {showAlert && (
          <Alert
            alertWidth="100%"
            alertHeight={48}
            alertColor="#dcfce7"
            borderColor="#22c55e"
            borderWidth={1}
            borderRadius={10}
            alertMessage="Físico-Química registrado correctamente."
            textColor="#15803d"
            textSize={13}
            textFontWeight="600"
          />
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Footer / Guardar ── */}
      <Footer
        backgroundColor={C.card}
        accentColor={C.primary}
        showTopBorder
        center={
          <Button
            title="Guardar módulo"
            type="primary"
            onPress={handleGuardar}
          />
        }
      />
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
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { fontSize: 14, color: C.white },
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitleText: { fontSize: 22, fontWeight: "700", color: C.white },

  // Scroll
  scroll: { flex: 1 },
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: C.text },
  cardUnit: { fontSize: 13, color: C.textSub },
  badge: { fontSize: 12, color: C.primary },

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
  unit: { fontSize: 13, color: C.textHint, marginLeft: 4 },
  hint: { fontSize: 11, color: C.textHint, marginTop: 4 },

  // Footer
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
});
