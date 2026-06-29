/**
 * CompradorScreen
 * Pantalla principal del módulo de compradores.
 * Muestra la lista de compradores con búsqueda, filtros y acceso al detalle.
 */
import React from "react";
import { View, FlatList } from "react-native";
import { useState } from "react";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import SearchBar from "../../inventarios/components/SearchBar";
import FilterButton from "../../inventarios/components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";

import { ICONS } from "../../../theme/icons";
import { styles, ICON_STYLES } from "../styles/CompradorStyles";
import { useCompradorScreen } from "../hooks/useCompradorScreen";



export default function CompradorScreen() {
  const {
    compradoresFiltrados,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    TIPOS,
    handleVerDetalle,
    handleAgregar,
    handleHome,
  } = useCompradorScreen();

  // Renderiza la tarjeta de cada comprador con su info de contacto
  function renderComprador(comprador) {
    return (
      <Card style={styles.card}>
        {/* Encabezado con avatar, nombre, tipo y botón de detalle */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <CustomText style={styles.avatarText}>
              {comprador.iniciales}
            </CustomText>
          </View>

          <View style={styles.providerInfo}>
            <CustomText style={styles.providerName}>
              {comprador.nombre}
            </CustomText>
            <CustomText style={styles.providerType}>
              {comprador.tipoProducto}
            </CustomText>
          </View>

          <Button
            onPress={() => handleVerDetalle(comprador.id)}
            style={styles.btnVerDetalle}
          >
            <CustomText style={styles.btnVerDetalleText}>Ver Detalle</CustomText>
          </Button>
        </View>

        {/* Teléfono formateado con el patrón +506 XXXX-XXXX */}
        <View style={styles.contactRow}>
          <Icon
            icon={ICONS.phone}
            size={ICON_STYLES.phone.size}
            color={ICON_STYLES.phone.color}
          />
          <CustomText style={styles.contactText}>
            {comprador.telefono.replace(/^\+506\s?(\d{4})(\d{4})$/, "+506 $1-$2")}
          </CustomText>
        </View>

        {/* Correo electrónico del comprador */}
        <View style={styles.contactRow}>
          <Icon
            icon={ICONS.user}
            size={ICON_STYLES.user.size}
            color={ICON_STYLES.user.color}
          />
          <CustomText style={styles.contactText}>{comprador.correo}</CustomText>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navbar con botón de inicio a la izquierda */}
      <Navbar
        title="Compradores"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button variant="ghost" onPress={handleHome} style={styles.btnHome}>
            <Icon
              icon={ICONS.home}
              size={ICON_STYLES.home.size}
              color={ICON_STYLES.home.color}
            />
          </Button>
        }
      />

      {/* Barra de búsqueda por texto y filtro por tipo de producto */}
      <View style={styles.barraBusqueda}>
        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar comprador, tipo, correo..."
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
          onApply={(f) => setFiltros({ tipos: f.categories })}
          showLowStock={false}
          showExpiryDate={false}
          buttonStyle={styles.filterButton}
        />
      </View>

      {/* Contenedor con flex:1 para que la lista ocupe el espacio disponible
          y el botón de agregar quede siempre anclado al fondo de la pantalla */}
      <View style={styles.listaContainer}>
        <FlatList
          data={compradoresFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderComprador(item)}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <CustomText style={styles.contadorResultados}>
              {compradoresFiltrados.length}{" "}
              {compradoresFiltrados.length === 1
                ? "comprador encontrado"
                : "compradores encontrados"}
            </CustomText>
          }
          ListEmptyComponent={
            <EmptyState
              title="Sin compradores"
              description="No se encontraron compradores con esa búsqueda."
            />
          }
        />
      </View>

      {/* Botón de agregar fijo en la parte inferior */}
      <Button
        variant="ghost"
        onPress={handleAgregar}
        style={styles.btnAgregar}
      >
        <Icon
          icon={ICONS.add}
          size={ICON_STYLES.add.size}
          color={ICON_STYLES.add.color}
        />
        <CustomText style={styles.btnAgregarText}>Agregar comprador</CustomText>
      </Button>
    </View>
  );
}
