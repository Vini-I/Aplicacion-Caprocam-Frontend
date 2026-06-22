/**
 * ProveedorScreen
 * Pantalla principal del módulo de proveedores.
 * Muestra la lista de proveedores con búsqueda, filtros y acceso al detalle.
 */
import React from "react";
import { useRouter } from "expo-router";
import { View, FlatList } from "react-native";
import { useState } from "react";
import { proveedoresMock } from "../services/ProveedorData";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import SearchBar from "../../inventarios/components/SearchBar";
import FilterButton from "../../inventarios/components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles, ICON_STYLES } from "../styles/ProveedorStyles";

export default function ProveedorScreen() {
  const router = useRouter();

  // Estado principal: lista de proveedores, texto de búsqueda y filtros activos
  const [proveedores] = useState(proveedoresMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

  // Extrae los tipos únicos de producto para mostrarlos como opciones de filtro
  const TIPOS = [...new Set(proveedores.map((p) => p.tipoProducto))];

  // Filtra los proveedores según el texto ingresado y los tipos seleccionados
  const proveedoresFiltrados = proveedores.filter((p) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.tipoProducto.toLowerCase().includes(texto) ||
      p.telefono.toLowerCase().includes(texto) ||
      p.correo.toLowerCase().includes(texto);
    const coincideTipo =
      filtros.tipos.length === 0 || filtros.tipos.includes(p.tipoProducto);
    return coincideTexto && coincideTipo;
  });

  // Navega a la pantalla de detalle pasando el id del proveedor como parámetro
  function handleVerDetalle(proveedorId) {
    router.push({
      pathname: "/(drawer)/proveedores/detalleProveedor",
      params: { id: proveedorId.toString() },
    });
  }

  // Renderiza la tarjeta de cada proveedor con su info de contacto
  function renderProveedor(proveedor) {
    return (
      <Card style={styles.card}>
        {/* Encabezado con avatar, nombre, tipo y botón de detalle */}
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
            onPress={() => handleVerDetalle(proveedor.id)}
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
            {proveedor.telefono.replace(/^\+506\s?(\d{4})(\d{4})$/, "+506 $1-$2")}
          </CustomText>
        </View>

        {/* Correo electrónico del proveedor */}
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
    <View style={styles.screen}>
      {/* Navbar con botón de inicio a la izquierda */}
      <Navbar
        title="Proveedores"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button variant="ghost" onPress={() => router.replace("/inicio")} style={styles.btnHome}>
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
          onApply={(f) => setFiltros({ tipos: f.categories })}
          showLowStock={false}
          showExpiryDate={false}
          buttonStyle={styles.filterButton}
        />
      </View>

      {/* Contenedor con flex:1 para que la lista ocupe el espacio disponible
          y el boton de agregar quede siempre anclado al fondo de la pantalla */}
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

      {/* Boton de agregar fijo en la parte inferior para agregar un nuevo proveedor */}
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