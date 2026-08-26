/**
 * ProveedorScreen.jsx
 * Pantalla principal que lista los proveedores con filtros y búsqueda.
 *
 * FUNCIONALIDAD:
 * - Lista de tarjetas con la información básica de cada proveedor.
 * - Contiene la barra de búsqueda y botón de filtro.
 *
 * REGLAS IMPORTANTES:
 * - Renderiza botón flotante para agregar en la parte inferior.
 * - Pantalla de solo lectura; la lógica de búsqueda está en el hook.
 *
 * @dependencies - React, Componentes UI, FilterButton, useProveedorScreen
 * @validations - N/A
 * @navigation - N/A (delegado a la ruta vía props onDetail, onNew)
 */
import React from "react";
import { View, ScrollView } from "react-native";

import CardPress from "../../../shared/components/CardPress";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";
import Alert from "../../../shared/components/Alert";
import Spinner from "../../../shared/components/Spinner";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles, ICON_STYLES } from "../styles/ProveedorStyles";
import { useProveedorScreen } from "../hooks/useProveedorScreen";
import { formatearTelefono } from "../utils/contactValidators";

export default function ProveedorScreen({ onDetail, onNew }) {
  const {
    proveedoresFiltrados,
    busqueda,
    setBusqueda,
    filtros,
    tipos,
    handleAplicarFiltros,
    alert,
    cargando,
    recargar,
  } = useProveedorScreen();

  return (
    <View style={STYLE.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={STYLE.contentWrapper}>
          {alert === "created" && (
            <Alert
              variant="success"
              message="Proveedor registrado correctamente"
              style={styles.alertSuccess}
            />
          )}
          {alert === "edited" && (
            <Alert
              variant="success"
              message="Proveedor editado correctamente"
              style={styles.alertSuccess}
            />
          )}
          {alert === "deleted" && (
            <Alert
              variant="success"
              message="Proveedor eliminado correctamente"
              style={styles.alertSuccess}
            />
          )}
        <View style={styles.barraBusqueda}>
          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar proveedor, tipo, correo..."
            containerStyle={styles.searchBarContainer}
          />
          <FilterButton
            categories={tipos}
            activeFilters={{
              categories: filtros.tipos,
              suppliers: [],
              units: [],
              lowStock: false,
              expiryDate: "",
            }}
            onApply={handleAplicarFiltros}
            showLowStock={false}
            showExpiryDate={false}
            buttonStyle={styles.filterButton}
          />
        </View>

        <CustomText style={styles.contadorResultados}>
          {proveedoresFiltrados.length}{" "}
          {proveedoresFiltrados.length === 1
            ? "proveedor encontrado"
            : "proveedores encontrados"}
        </CustomText>

        {cargando ? (
          <Spinner text="Cargando proveedores..." style={styles.spinner} />
        ) : proveedoresFiltrados.length === 0 ? (
          <EmptyState
            title="Sin proveedores"
            description="No se encontraron proveedores con esa búsqueda."
          />
        ) : (
          proveedoresFiltrados.map((proveedor) => (
            <CardPress
              key={proveedor.id}
              style={styles.card}
              onPress={() => onDetail(proveedor.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <CustomText style={styles.avatarText}>
                    {proveedor.iniciales}
                  </CustomText>
                </View>

                <View style={styles.providerInfo}>
                  <CustomText style={styles.providerName}>
                    {proveedor.nombre}
                  </CustomText>
                  <CustomText style={styles.providerType}>
                    {proveedor.tipoProducto}
                  </CustomText>
                </View>

                <Icon
                  icon={ICONS.growth}
                  color={ICON_STYLES.verDetalle?.color || COLORS.primary}
                />
              </View>

              <View style={styles.contactTitleRow}>
                <Icon icon={ICONS.phone} color={ICON_STYLES.phone.color} />
                <CustomText style={styles.contactTitle}>Contacto</CustomText>
              </View>

              <View style={styles.contactRow}>
                <CustomText style={styles.contactText}>
                  {formatearTelefono(proveedor.telefono)}
                </CustomText>
              </View>

              <View style={styles.contactRow}>
                <CustomText style={styles.contactText}>{proveedor.correo}</CustomText>
              </View>
            </CardPress>
          ))
        )}
        </View>
      </ScrollView>

      <View style={styles.floatingButtonWrapper} pointerEvents="box-none">
        <View style={STYLE.contentWrapper}>
          <Button
            onPress={onNew}
            style={styles.btnAgregar}
          >
            <Icon icon={ICONS.add} color={ICON_STYLES.add.color} />
            <CustomText style={styles.btnAgregarText}>Añadir Proveedor</CustomText>
          </Button>
        </View>
      </View>
    </View>
  );
}