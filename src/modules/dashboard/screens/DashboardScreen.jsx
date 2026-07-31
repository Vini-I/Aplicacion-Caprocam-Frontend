/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardScreen.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Renderiza la pantalla principal del Dashboard utilizando
componentes separados y datos preparados desde el hook.
//////////////////////////////////////////////////////////
*/

import React from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DashboardAlertas from "../components/DashboardAlertas";
import DashboardEstadisticas from "../components/DashboardEstadisticas";
import DashboardEstanquesPanel from "../components/DashboardEstanquesPanel";
import DashboardFincasPanel from "../components/DashboardFincasPanel";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSanidadPanel from "../components/DashboardSanidadPanel";
import DashboardUltimosRegistros from "../components/DashboardUltimosRegistros";

import useDashboardScreen from "../hooks/useDashboardScreen";

import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/DashboardStyle";

export default function DashboardScreen() {
  const pantalla = useDashboardScreen();

  const panelSeleccionado = pantalla.selectedCard === "fincas" ? (
    <DashboardFincasPanel fincas={pantalla.fincasDashboard} estanques={pantalla.estanquesData} />
  ) : pantalla.selectedCard === "estanques" ? (
    <DashboardEstanquesPanel estanques={pantalla.estanquesData} alimentacionSemanal={pantalla.alimentacionSemanal} />
  ) : pantalla.selectedCard === "casos" ? (
    <DashboardSanidadPanel
      tipo="casos"
      resumenEnfermedades={pantalla.resumenEnfermedades}
      resumenParasitologia={pantalla.resumenParasitologia}
      registrosEnfermedades={pantalla.registrosEnfermedades}
      registrosParasitologia={pantalla.registrosParasitologia}
    />
  ) : pantalla.selectedCard === "mortalidad" ? (
    <DashboardSanidadPanel tipo="mortalidad" resumenEnfermedades={pantalla.resumenEnfermedades} registrosEnfermedades={pantalla.registrosEnfermedades} registrosParasitologia={pantalla.registrosParasitologia} />
  ) : null;

  return (
    <SafeAreaView style={STYLE.container}>
      <ScrollView
        contentContainerStyle={[STYLE.contentWrapper, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={pantalla.cargando} onRefresh={pantalla.recargar} colors={[COLORS.primary]} tintColor={COLORS.primary} />}
      >
        <DashboardHeader />

        <DashboardAlertas
          alertas={pantalla.alertasDashboard}
          abiertos={pantalla.alertasAbiertas}
          onToggle={pantalla.alternarAlertas}
          onDismiss={pantalla.descartarAlertaDashboard}
          onViewAll={pantalla.irAAlertas}
        />

        <DashboardEstadisticas
          selectedCard={pantalla.selectedCard}
          isTablet={pantalla.isTablet}
          totalFincas={pantalla.fincasDashboard.length}
          totalEstanques={pantalla.estanquesData.length}
          totalCasosSanitarios={pantalla.totalCasosSanitarios}
          totalMortalidad={pantalla.totalMortalidad}
          onSelect={pantalla.manejarSeleccionCard}
        />

        {panelSeleccionado}

        <DashboardUltimosRegistros registros={pantalla.ultimosRegistros} />
      </ScrollView>
    </SafeAreaView>
  );
}