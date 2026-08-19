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

import DashboardAlertas from "../components/DashboardAlertas.jsx";
import DashboardEstadisticas from "../components/DashboardEstadisticas.jsx";
import DashboardEstanquesPanel from "../components/DashboardEstanquesPanel.jsx";
import DashboardFincasPanel from "../components/DashboardFincasPanel.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import DashboardSanidadPanel from "../components/DashboardSanidadPanel.jsx";
import DashboardUltimosRegistros from "../components/DashboardUltimosRegistros.jsx";

import useDashboardScreen from "../hooks/useDashboardScreen.js";

import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/DashboardStyle.js";

export default function DashboardScreen() {
  const pantalla = useDashboardScreen();

  const panelSeleccionado = pantalla.selectedCard === "fincas" ? (
    <DashboardFincasPanel
      fincas={pantalla.fincasDashboard}
      estanques={pantalla.estanquesData}
      onPressFinca={pantalla.irAFinca}
    />
  ) : pantalla.selectedCard === "estanques" ? (
    <DashboardEstanquesPanel
      estanques={pantalla.estanquesData}
      alimentacionSemanal={pantalla.alimentacionSemanal}
      onPressEstanque={pantalla.irAEstanque}
    />
  ) : pantalla.selectedCard === "casos" ? (
    <DashboardSanidadPanel
      resumenEnfermedades={pantalla.resumenEnfermedades}
      resumenParasitologia={pantalla.resumenParasitologia}
      registrosEnfermedades={pantalla.registrosEnfermedades}
      registrosParasitologia={pantalla.registrosParasitologia}
      onPressCaso={pantalla.irACasoSanitario}
    />
  ) : null;

  return (
    <SafeAreaView style={STYLE.container}>
      <ScrollView
        contentContainerStyle={[STYLE.contentWrapper, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={pantalla.cargando}
            onRefresh={pantalla.recargar}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <DashboardHeader />

        <DashboardAlertas
          alertas={pantalla.alertasDashboard}
          abiertos={pantalla.alertasAbiertas}
          onToggle={pantalla.alternarAlertas}
          onDismiss={pantalla.descartarAlertaDashboard}
          onViewAll={pantalla.irAAlertas}
          onPressAlerta={pantalla.irAAlerta}
        />

        <DashboardEstadisticas
          selectedCard={pantalla.selectedCard}
          isTablet={pantalla.isTablet}
          totalFincas={pantalla.fincasDashboard.length}
          totalEstanques={pantalla.estanquesData.length}
          totalCasosSanitarios={pantalla.totalCasosSanitarios}
          onSelect={pantalla.manejarSeleccionCard}
        />

        {panelSeleccionado}

        <DashboardUltimosRegistros registros={pantalla.ultimosRegistros} />
      </ScrollView>
    </SafeAreaView>
  );
}