// src/modules/mantEquipo/screens/TareasScreen.jsx

import React, { useState, useRef, useEffect } from "react";
import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";

import { useTareas } from "../hooks/useTareas";
import FilaTarea from "../components/FilaTarea";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { TEXTOS_PANTALLA, HEADERS_TABLA } from "../constants/tareasMensajes";
import { styles } from "../styles/tareasStyles";

export default function TareasScreen() {
  const router = useRouter();
  const {
    tareasFinales,
    busqueda,
    setBusqueda,
    loading,
    error,
    filtros,
    setFiltros,
    opcionesCategoria,
    opcionesEstado,
  } = useTareas();

  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 4000);
  };

  const handleAgregar = () => router.push("/equipos/tareaForm");
  const abrirDetalle = (tarea) => router.push(`/equipos/detalleTarea?id=${tarea.id}`);

  if (loading && tareasFinales.length === 0) {
    return (
      <View style={[STYLE.container, styles.centerContainer]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[STYLE.container, styles.centerContainer]}>
        <CustomText style={{ color: COLORS.error }}>Error: {error}</CustomText>
      </View>
    );
  }

  return (
    <View style={[STYLE.container, styles.container]}>
      {/* Barra de herramientas */}
      <View style={styles.toolbar}>
        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder={TEXTOS_PANTALLA.placeholderBuscar}
          containerStyle={styles.searchBarContainer}
        />
        <FilterButton
          categories={opcionesCategoria}
          suppliers={opcionesEstado}
          activeFilters={filtros}
          onApply={(f) =>
            setFiltros({
              categories: f.categories || [],
              suppliers: f.suppliers || [],
              units: [],
              lowStock: false,
              expiryDate: "",
            })
          }
          showLowStock={false}
          showExpiryDate={false}
          buttonStyle={styles.filterButtonStyle}
        />
      </View>

      {alert && (
        <View style={styles.alertWrapper}>
          <Alert variant={alert.type} message={alert.message} />
        </View>
      )}

      {/* Tabla */}
      <View style={styles.tableWrapper}>
        <View style={styles.rowInner}>
          <View style={styles.tableHeader}>
            {[
              styles.colId,
              styles.colNombre,
              styles.colDesc,
              styles.colCategoria,
              styles.colDuracion,
              styles.colEstado,
            ].map((col, i) => (
              <View key={i} style={col}>
                <CustomText style={styles.headerCell}>
                  {HEADERS_TABLA[i] || ""}
                </CustomText>
              </View>
            ))}
          </View>
        </View>

        <FlatList
          data={tareasFinales}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={({ item }) => <FilaTarea tarea={item} onPressFila={abrirDetalle} />}
          scrollEnabled
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>{TEXTOS_PANTALLA.sinTareas}</CustomText>
            </View>
          }
        />
      </View>

      {/* Botón flotante */}
      <View style={styles.floatingButtonContainer}>
        <Button variant="outline" onPress={handleAgregar} style={styles.floatingButton}>
          <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
          <CustomText style={styles.floatingButtonText}>
            {TEXTOS_PANTALLA.btnAgregarTarea}
          </CustomText>
        </Button>
      </View>
    </View>
  );
}