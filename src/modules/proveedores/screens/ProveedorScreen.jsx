/**
 * ProveedorScreen
 * Pantalla principal del módulo de proveedores.
 */
import React from "react";
import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import SearchBar from "../../inventarios/components/SearchBar";
import FilterButton from "../../inventarios/components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";

import { ICONS } from "../../../theme/icons";
import { styles, ICON_STYLES } from "../styles/ProveedorStyles";
import { useProveedorScreen } from "../hooks/useProveedorScreen";

export default function ProveedorScreen() {
  const router = useRouter();
  const {
    proveedoresFiltrados,
    busqueda,
    setBusqueda,
    filtros,
    TIPOS,
    handleAplicarFiltros,
  } = useProveedorScreen();

  function renderProveedor(proveedor) {
    return (
      <Card style={styles.card}>
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

          <Button
            onPress={() =>
              router.push({
                pathname: "/(drawer)/proveedores/detalleProveedor",
                params: { id: proveedor.id.toString() },
              })
            }
            style={styles.btnVerDetalle}
          >
            <CustomText style={styles.btnVerDetalleText}>Ver Detalle</CustomText>
          </Button>
        </View>

        <View style={styles.contactRow}>
          <Icon
            icon={ICONS.phone}
            size={ICON_STYLES.phone.size}
            color={ICON_STYLES.phone.color}
          />
          <CustomText style={styles.contactText}>
            {proveedor.telefono.replace(/^\+506\s?(\d{4})(\d{4})$/, "+506 $1-$2")}
          </CustomText>
        </View>

        <View style={styles.contactRow}>
          <Icon
            icon={ICONS.user}
            size={ICON_STYLES.user.size}
            color={ICON_STYLES.user.color}
          />
          <CustomText style={styles.contactText}>{proveedor.correo}</CustomText>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar
        title="Proveedores"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button
            variant="ghost"
            onPress={() => router.replace("/inicio")}
            style={styles.btnHome}
          >
            <Icon
              icon={ICONS.home}
              size={ICON_STYLES.home.size}
              color={ICON_STYLES.home.color}
            />
          </Button>
        }
      />

      <View style={styles.barraBusqueda}>
        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar proveedor, tipo, correo..."
          containerStyle={styles.searchBarContainer}
        />
        <FilterButton
          categories={TIPOS}
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

      <View style={styles.listaContainer}>
        <FlatList
          data={proveedoresFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderProveedor(item)}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <CustomText style={styles.contadorResultados}>
              {proveedoresFiltrados.length}{" "}
              {proveedoresFiltrados.length === 1
                ? "proveedor encontrado"
                : "proveedores encontrados"}
            </CustomText>
          }
          ListEmptyComponent={
            <EmptyState
              title="Sin proveedores"
              description="No se encontraron proveedores con esa búsqueda."
            />
          }
        />
      </View>

      <Button
        variant="ghost"
        onPress={() => router.push("/(drawer)/proveedores/nuevoProveedor")}
        style={styles.btnAgregar}
      >
        <Icon
          icon={ICONS.add}
          size={ICON_STYLES.add.size}
          color={ICON_STYLES.add.color}
        />
        <CustomText style={styles.btnAgregarText}>Agregar proveedor</CustomText>
      </Button>
    </View>
  );
}
