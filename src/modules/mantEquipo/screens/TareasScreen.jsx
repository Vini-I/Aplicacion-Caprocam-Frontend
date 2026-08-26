/**
 * PANTALLA: TareasScreen
 * Pantalla principal del catálogo de tareas de mantenimiento con lista, búsqueda y filtros por categoría/estado.
 *
 * @dependencies - FilaTarea.jsx (components), useTareas.js (hooks), Spinner.jsx, Button.jsx, SearchBar.jsx, FilterButton.jsx (shared/components)
 * @validations  - Muestra Spinner durante la carga y estado de lista vacía si no hay coincidencias.
 * @navigation   - Navega a la creación ('/equipos/tareaForm') y al detalle de tarea.
 */

import React, { useEffect } from "react";
import { View, FlatList, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { useTareas } from "../hooks/useTareas";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import { useError } from "../../../shared/context/ErrorContext";
import Alert from "../../../shared/components/Alert";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";
import CardPress from "../../../shared/components/CardPress";
import { TEXTOS_PANTALLA } from "../constants/tareasMensajes";
import { styles } from "../styles/tareasStyles";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import BadgeCategoria from '../components/BadgeCategoria';
import { STYLE } from "../../../theme/style";

export default function TareasScreen() {
  const router = useRouter();
  const {
    tareasFinales,
    busqueda,
    setBusqueda,
    loading,
    error,
    alert,
    showAlert,
    activeFiltersForButton,
    handleApplyFilter,
    opcionesCategoria,
  } = useTareas();

  
  const params = useLocalSearchParams();
  const handleAgregar = () => router.push("/mantenimientoEquipo/tareas/tareaForm");
  const abrirDetalle = (tarea) =>
    router.push(`/mantenimientoEquipo/tareas/detalleTarea?id=${tarea.id}`);

  useEffect(() => {
    const { alertType, alertMessage } = params;
    if (alertType && alertMessage) {
      showAlert(alertType, alertMessage);
      router.setParams({ alertType: undefined, alertMessage: undefined });
    }
  }, [params.alertType, params.alertMessage, router]);

  if (loading && tareasFinales.length === 0) {
    return (
      <View style={[STYLE.container, styles.centerContainer]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return mostrarError(error);
  }

  return (
    <>
    <ScrollView
      style={STYLE.container}
      contentContainerStyle={styles.screenScrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {alert && (
          <View style={styles.alertWrapper}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}
      {/* Barra de herramientas */}
      <View style={STYLE.contentWrapper}>
        <View style={styles.toolbar}>
          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder={TEXTOS_PANTALLA.placeholderBuscar}
            containerStyle={styles.searchBarContainer}
          />
          <FilterButton
            categories={opcionesCategoria}
            activeFilters={activeFiltersForButton}
            onApply={handleApplyFilter}
            showLowStock={false}
            showExpiryDate={false}
            buttonStyle={styles.filterButtonStyle}
          />
        </View>

        <View style={styles.taskCardList}>
          {tareasFinales.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>
                {TEXTOS_PANTALLA.sinTareas}
              </CustomText>
            </View>
          ) : (
            tareasFinales.map((item, index) => (
              <CardPress
                key={`${item.id}_${index}`}
                style={styles.taskCard}
                onPress={() => abrirDetalle(item)}
              >
                <View style={styles.taskCardHeader}>
                  <CustomText style={styles.taskTitle}>
                    Tarea {item.id}
                  </CustomText>

                  <BadgeCategoria categoria={item.categoria} />
                </View>
                <CustomText style={styles.taskCardTitle} numberOfLines={2}>
                  {item.nombre}
                </CustomText>

                {/* Descripción mostrada solo en detalle */}
                <View style={styles.taskCardFooter}>
                  <CustomText style={styles.taskCardMeta}>
                    Duración de {item.duracionEstimada} h
                  </CustomText>
                </View>
              </CardPress>
            ))
          )}
        </View>
      </View>
    </ScrollView>

    {/* Botón flotante fuera del ScrollView para quedar fijo sobre la pantalla */}
    <View style={styles.floatingButtonContainer} pointerEvents="box-none">
      <View style={STYLE.contentWrapper}>
        <Button
          variant="outline"
          onPress={handleAgregar}
          style={styles.floatingButton}
        >
          <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
          <CustomText style={styles.floatingButtonText}>
            {TEXTOS_PANTALLA.btnAgregarTarea}
          </CustomText>
        </Button>
      </View>
    </View>
    </>
  );
}
