/**
 * Pantalla: ProveedorScreen
 *
 * Esta pantalla muestra el listado de proveedores registrados dentro del
 * módulo de inventario.
 *
 * Funcionalidades principales:
 * - Visualizar los proveedores registrados cuando se integren los datos.
 * - Mostrar nombre, tipo de proveedor, teléfono y correo electrónico.
 * - Permitir la edición de la información de un proveedor.
 * - Permitir regresar a la pantalla anterior.
 *
 * Componentes utilizados:
 * - Navbar: encabezado de la pantalla.
 * - Card: agrupación visual de la información de cada proveedor.
 * - Button: acciones de regresar y editar proveedor.
 */
import React from "react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState, useCallback, useRef } from "react";
import { getProveedores } from "../services/proveedoresService";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

export default function ProveedorScreen() {
  const router = useRouter();

  function handleRegresar() {
    router.replace("/inicio");
  }
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    tipos: [],
  });
  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setProveedores(getProveedores());
      setBusqueda("");
      setFiltros({ tipos: [] });
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [])
  );

  const TIPOS = [...new Set(proveedores.map((p) => p.tipoProducto))];

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

  function handleEditarProveedor(proveedorId) {
    router.push({
      pathname: "/(drawer)/inventarios/detalleProveedor",
      params: { id: proveedorId.toString() },
    });
  }

  function renderProveedor(proveedor) {
    return (
      <TouchableOpacity
        key={proveedor.id}
        activeOpacity={0.7}
        onPress={() => handleEditarProveedor(proveedor.id)}
      >
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{proveedor.iniciales}</Text>
            </View>

            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{proveedor.nombre}</Text>
              <Text style={styles.providerType}>{proveedor.tipoProducto}</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <FontAwesome name={ICONS.phone.name} size={14} color={COLORS.textTertiary} />
            <Text style={styles.contactText}>{proveedor.telefono}</Text>
          </View>

          <View style={styles.contactRow}>
            <FontAwesome name="envelope" size={14} color={COLORS.textTertiary} />
            <Text style={styles.contactText}>{proveedor.correo}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.screen}>
      <Navbar
        title="Proveedores"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button
            variant="outline"
            onPress={handleRegresar}
            style={styles.backButton}
          >
            <Icon icon={ICONS.home} size={22} color={COLORS.white} />
          </Button>
        }
        rightContent={
          <Button
            style={styles.btnAgregar}
            onPress={() => router.push("/(drawer)/inventarios/nuevoProveedor")}
          >
            <Icon icon={ICONS.add} size={20} color={COLORS.white} />
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
          onApply={(f) => setFiltros({ tipos: f.categories })}
          showLowStock={false}     // ← no aplica para proveedores
          showExpiryDate={false}
          buttonStyle={styles.filterButton}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={proveedoresFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderProveedor(item)}
        ListHeaderComponent={
          <CustomText
            size={13}
            color={COLORS.textTertiary}
            style={styles.contadorResultados}
          >
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
        contentContainerStyle={styles.lista}
      />

      <View style={styles.tabsInternas}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.replace("/(drawer)/inventarios/inventarioScreen")}
        >
          <Icon icon={ICONS.document} size={20} color={COLORS.textTertiary} />
          <CustomText size={12} color={COLORS.textTertiary}>
            Inventario
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, styles.tabActiva]}>
          <Icon icon={ICONS.user} size={20} color={COLORS.primary} />
          <CustomText size={12} color={COLORS.primary} weight="600">
            Proveedores
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  navbar: { backgroundColor: COLORS.primary, borderBottomWidth: 0 },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
  },
  card: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  providerType: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  contactText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginTop: 16,
  },
  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  tabsInternas: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 4,
  },
  tabActiva: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  btnAgregar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginTop: 0,
  },
  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  searchBarContainer: { flex: 1 },
  filterButton: { alignSelf: "center", marginTop: 0, height: 43 },
  contadorResultados: { marginHorizontal: 16, marginTop: 10, marginBottom: 4 },
  lista: { paddingBottom: 24 },
});
