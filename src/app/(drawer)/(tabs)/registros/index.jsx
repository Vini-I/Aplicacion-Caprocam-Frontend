import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomText from "../../../../shared/components/Text";
import { COLORS } from "../../../../theme/colors";
import { TYPOGRAPHY } from "../../../../theme/typography";

import FisicoQuimica from "../../../../modules/mantAgua/screens/fisicoQuimica";
import MortalidadScreen from "../../../../modules/mortalidad/screens/MortalidadScreen";
import AlimentacionScreen from "../../../../modules/alimentacion/screens/AlimentacionScreen";
import EnfermedadesScreen from "../../../../modules/enfermedades/screens/EnfermedadesScreen";

const FINCAS = [
  { id: 1, nombre: "Finca El Pacífico" },
  { id: 2, nombre: "Finca Santa Rosa" },
];

const ESTANQUES = {
  1: [
    { id: "E-01", especie: "Litopenaeus vannamei" },
    { id: "E-02", especie: "Litopenaeus vannamei" },
  ],
  2: [
    { id: "E-01", especie: "Litopenaeus stylirostris" },
  ],
};

const MODULOS = [
  {
    id: "alimentacion",
    label: "Alimentación",
    descripcion: "Raciones, alimento y comederos",
    icono: "fish",
    color: COLORS.primary,
  },
  {
    id: "crecimiento",
    label: "Crecimiento",
    descripcion: "Peso, incremento y biomasa",
    icono: "trending-up",
    color: "#10B981",
  },
  {
    id: "fisicoquimica",
    label: "Físico-Química",
    descripcion: "Temp, O₂, pH y nutrientes",
    icono: "flask",
    color: "#8B5CF6",
  },
  {
    id: "mortalidad",
    label: "Mortalidad",
    descripcion: "Conteo y sobrevivencia de camarones",
    icono: "calculator",
    color: "#F59E0B",
  },
  {
    id: "enfermedades",
    label: "Enfermedades",
    descripcion: "Registro sanitario de estanques",
    icono: "medical-bag",
    color: "#EF4444",
  },
];

function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      activeOpacity={0.7}
    >
      <CustomText
        size={13}
        weight={selected ? "600" : "400"}
        color={selected ? COLORS.primary : COLORS.textTertiary}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
}

function ModuloCard({ modulo, onPress }) {
  const disponible = onPress !== null && onPress !== undefined;

  return (
    <TouchableOpacity
      style={[styles.moduloCard, !disponible && styles.moduloCardDisabled]}
      onPress={onPress ?? undefined}
      activeOpacity={disponible ? 0.75 : 1}
    >
      <View
        style={[
          styles.moduloIcono,
          { backgroundColor: disponible ? modulo.color : COLORS.textQuaternary },
        ]}
      >
        <MaterialCommunityIcons name={modulo.icono} size={22} color="#FFFFFF" />
      </View>

      <CustomText
        size={14}
        weight="600"
        color={disponible ? COLORS.textSecondary : COLORS.textQuaternary}
        style={styles.moduloLabel}
      >
        {modulo.label}
      </CustomText>

      <CustomText size={12} color={COLORS.textTertiary} style={styles.moduloDesc}>
        {modulo.descripcion}
      </CustomText>

      <CustomText size={12} color={disponible ? COLORS.primary : COLORS.textQuaternary}>
        {disponible ? "Toca para registrar →" : "Próximamente"}
      </CustomText>
    </TouchableOpacity>
  );
}

export default function RegistrosIndex() {
  const [fincaSeleccionada, setFincaSeleccionada] = useState(FINCAS[0].id);
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState(
    ESTANQUES[FINCAS[0].id][0].id
  );
  const [moduloActivo, setModuloActivo] = useState(null);

  const estanques = ESTANQUES[fincaSeleccionada] ?? [];
  const finca = FINCAS.find((f) => f.id === fincaSeleccionada);
  const estanque = estanques.find((e) => e.id === estanqueSeleccionado);

  function handleFinca(id) {
    setFincaSeleccionada(id);
    setEstanqueSeleccionado(ESTANQUES[id][0].id);
  }

  if (moduloActivo === "fisicoquimica") {
    return <FisicoQuimica onBack={() => setModuloActivo(null)} />;
  }

  if (moduloActivo === "mortalidad") {
    return <MortalidadScreen onBack={() => setModuloActivo(null)} />;
  }

  if (moduloActivo === "alimentacion") {
    return <AlimentacionScreen onBack={() => setModuloActivo(null)} />;
  }

  if (moduloActivo === "enfermedades") {
    return <EnfermedadesScreen onBack={() => setModuloActivo(null)} />;
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Selección ── */}
        <View style={styles.seccion}>
          <CustomText
            size={11}
            weight="600"
            color={COLORS.textTertiary}
            style={styles.seccionLabel}
          >
            SELECCIÓN
          </CustomText>

          <CustomText size={13} color={COLORS.textSecondary} style={styles.subLabel}>
            Finca
          </CustomText>
          <View style={styles.chips}>
            {FINCAS.map((f) => (
              <Chip
                key={f.id}
                label={f.nombre}
                selected={fincaSeleccionada === f.id}
                onPress={() => handleFinca(f.id)}
              />
            ))}
          </View>

          <CustomText size={13} color={COLORS.textSecondary} style={styles.subLabel}>
            Estanque
          </CustomText>
          <View style={styles.chips}>
            {estanques.map((e) => (
              <Chip
                key={e.id}
                label={e.id}
                selected={estanqueSeleccionado === e.id}
                onPress={() => setEstanqueSeleccionado(e.id)}
              />
            ))}
          </View>

          {finca && estanque && (
            <CustomText size={12} color={COLORS.textTertiary}>
              {finca.nombre} → {estanque.id} · {estanque.especie}
            </CustomText>
          )}
        </View>

        {/* ── Módulos ── */}
        <CustomText
          size={11}
          weight="600"
          color={COLORS.textTertiary}
          style={styles.seccionLabel}
        >
          MÓDULOS DEL REGISTRO
        </CustomText>

        <View style={styles.grilla}>
          {MODULOS.map((m) => (
            <ModuloCard
              key={m.id}
              modulo={m}
              onPress={m.id === "fisicoquimica" ? () => setModuloActivo("fisicoquimica")
                     : m.id === "mortalidad" ? () => setModuloActivo("mortalidad")
                     : m.id === "alimentacion" ? () => setModuloActivo("alimentacion")
                     : m.id === "enfermedades" ? () => setModuloActivo("enfermedades")
                     : null}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  scroll: {
    padding: 16,
    paddingBottom: 32,
  },

  seccion: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },

  seccionLabel: {
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  subLabel: {
    marginBottom: 8,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },

  chipSelected: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  grilla: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  moduloCard: {
    width: "47.5%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    padding: 14,
  },

  moduloCardDisabled: {
    opacity: 0.6,
  },

  moduloIcono: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  moduloLabel: {
    marginBottom: 2,
  },

  moduloDesc: {
    marginBottom: 8,
    lineHeight: 16,
  },
});