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
import { useRouter } from "expo-router";
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
import Icon from '../../../shared/components/Icons';
import RangeCard from '../components/RangeCard';
import SingleWheelCard from '../components/SingleWheelCard';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';

export default function FisicoQuimica({ onBack }) {
  const [salinidad, setSalinidad] = useState("14");
  const [, setTempReadings] = useState([]);
  const [, setPhReadings] = useState([]);
  const [, setOxReadings] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const alertTimerRef = useRef(null);
  const router = useRouter();


  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  const handleGuardar = () => {
    setShowAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => {
      setShowAlert(false);
      alertTimerRef.current = null;
      router.replace("/(drawer)/(tabs)/registros");  // ← reemplaza onBack()

    }, 500);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon icon={ICONS.exit} size={20} color={COLORS.white} />
          <Text size={14} color={COLORS.white}>
            Módulos
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Icon icon={ICONS.chemicalContainer} size={20} color={COLORS.white} />
          <Title level={4} color={COLORS.white} style={styles.headerTitleText}>
            Físico-Química
          </Title>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── TEMPERATURA ── */}
        <RangeCard
          title="Temperatura"
          unit="°C"
          icon={<Icon icon={ICONS.temperature} color={COLORS.primary} size={18} />}
          idealMin={28} idealMax={30}
          sliderMin={15} sliderMax={45}
          step={0.5} decimals={1}
          maxReadings={2} labelStyle="daynight"
          colors={COLORS}
          styles={styles}
          onChange={(r) => setTempReadings(r)}
        />

        {/* ── OXÍGENO DISUELTO ── */}
        <RangeCard
          title="Oxígeno Disuelto"
          unit="mg/L"
          icon={<Icon icon={ICONS.water} color={COLORS.primary} size={18} />}
          idealMin={5}
          sliderMin={0} sliderMax={20}
          step={0.1} decimals={1}
          showProgress={false} showRangeColor={false}
          maxReadings={5} labelStyle="numeric"
          colors={COLORS}
          styles={styles}
          onChange={(r) => setOxReadings(r)}
        />

        {/* ── pH ── */}
        <RangeCard
          title="pH"
          unit="pH"
          icon={<Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={18} />}
          idealMin={7.5} idealMax={8.5}
          sliderMin={4} sliderMax={10}
          step={0.1} decimals={1}
          maxReadings={2} labelStyle="daynight"
          colors={COLORS}
          styles={styles}
          onChange={(r) => setPhReadings(r)}
        />

        {/* ── SALINIDAD ── */}
        <SingleWheelCard
          title="Salinidad"
          icon={<Icon icon={ICONS.frequency} color={COLORS.primary} size={18} />}
          label="Salinidad"
          unit="ppt"
          min={5} max={40}
          idealMin={10} idealMax={25}
          value={salinidad}
          colors={COLORS}
          styles={styles}
          onChange={setSalinidad}
        />

        {showAlert && (
          <Alert
            variant="success"
            message="¡Módulo guardado exitosamente!"
            style={{ width: "60%", alignSelf: "center" }}
            textStyle={{ textAlign: "center", fontWeight: "bold" }}
          />
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Footer / Guardar ── */}
      <Footer
        children={
          <Button variant="primary" onPress={handleGuardar}>
            Guardar módulo
          </Button>
        }
        fixedBottom={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitleText: { fontSize: 22, fontWeight: "700" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
});
