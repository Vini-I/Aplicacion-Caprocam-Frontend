/**
 * ProveedorScreen
 *
 * Pantalla principal de proveedores, muestra una lista de proveedores con búsqueda y filtros.
 * Permite navegar a detalle de proveedor o agregar nuevo proveedor.
 *
 * Funcionalidades principales:
 * - Visualizar los proveedores registrados.
 * - Mostrar nombre, tipo de proveedor, teléfono y correo electrónico.
 * - Buscar proveedores por nombre, tipo, teléfono o correo.
 * - Filtrar proveedores por tipo de producto.
 * - Navegar al detalle de un proveedor mediante el botón "Ver detalle".
 * - Navegar a la pantalla de agregar nuevo proveedor.
 *
 * Datos:
 * - Los datos provienen de proveedorData (datos de ejemplo).
 */
import React from "react";
import { useRouter } from "expo-router";
import { View, FlatList } from "react-native";
import { useState } from "react";
import { proveedoresMock } from "../services/proveedorData";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/proveedorStyles";

export default function ProveedorScreen() {
  const router = useRouter();

  const [proveedores] = useState(proveedoresMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

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

  function handleVerDetalle(proveedorId) {
    router.push({
      pathname: "/(drawer)/inventarios/detalleProveedor",
      params: { id: proveedorId.toString() },
    });
  }

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
            onPress={() => handleVerDetalle(proveedor.id)}
            style={styles.btnVerDetalle}
            textStyle={styles.btnVerDetalleText}
          >
            Ver detalle
          </Button>
        </View>

        <View style={styles.contactRow}>
          <Icon icon={ICONS.phone} size={14} color={COLORS.textTertiary} />
          <CustomText style={styles.contactText}>
            {proveedor.telefono.replace(/(\d{4})(\d{4})/, "$1-$2")}
          </CustomText>
        </View>

        <View style={styles.contactRow}>
          <Icon icon={ICONS.user} size={14} color={COLORS.textTertiary} />
          <CustomText style={styles.contactText}>{proveedor.correo}</CustomText>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title="Proveedores"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button variant="ghost" onPress={() => router.replace("/inicio")}>
            <Icon icon={ICONS.home} size={22} color={COLORS.white} />
          </Button>
        }
        rightContent={
          <Button
            variant="ghost"
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
          showLowStock={false}
          showExpiryDate={false}
          buttonStyle={styles.filterButton}
        />
      </View>

      <FlatList
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
        <Button
          style={styles.tab}
          onPress={() =>
            router.replace("/(drawer)/inventarios/inventarioScreen")
          }
        >
          <Icon icon={ICONS.document} size={20} color={COLORS.textTertiary} />
          <CustomText size={12} color={COLORS.textTertiary}>
            Inventario
          </CustomText>
        </Button>

        <View style={[styles.tab, styles.tabActiva]}>
          <Icon icon={ICONS.user} size={20} color={COLORS.primary} />
          <CustomText size={12} color={COLORS.primary} weight="600">
            Proveedores
          </CustomText>
        </View>
      </View>
    </View>
  );
}
