/**
 * ============================================================
 * PANTALLA LISTADO DE PROVEEDORES
 * ============================================================
 *
 * Pantalla principal del módulo de proveedores.
 *
 * FUNCIONALIDAD:
 * 1. Muestra el listado de proveedores en cards (avatar, nombre, tipo,
 *    teléfono, correo).
 * 
 * 2. Permite buscar por texto y filtrar por tipo de producto.
 * 
 * 3. "Ver Detalle" navega a
 *    /(drawer)/proveedores/detalleProveedor?id=.
 * 
 * 4. "Agregar proveedor" navega a
 *    /(drawer)/proveedores/nuevoProveedor.
 * 
 * 5. Muestra un EmptyState cuando no hay resultados para la búsqueda o
 *    los filtros aplicados.
 *
 * IMPORTANTE:
 * - Es una pantalla de solo lectura/listado, sin formulario.
 * - El filtro y la búsqueda no modifican datos.
 */
import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";

import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles, ICON_STYLES } from "../styles/ProveedorStyles";
import { useProveedorScreen } from "../hooks/useProveedorScreen";
import { formatearTelefono } from "../utils/contactValidators";

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

  return (
    <ScrollView style={STYLE.container} ScrollView showsVerticalScrollIndicator={false}>
      <View style={STYLE.contentWrapper}>
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

        <CustomText style={styles.contadorResultados}>
          {proveedoresFiltrados.length}{" "}
          {proveedoresFiltrados.length === 1
            ? "proveedor encontrado"
            : "proveedores encontrados"}
        </CustomText>

        {proveedoresFiltrados.length === 0 && (
          <EmptyState
            title="Sin proveedores"
            description="No se encontraron proveedores con esa búsqueda."
          />
        )}

        {proveedoresFiltrados.map((proveedor) => (
          <Card key={proveedor.id} style={styles.card}>
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
                <Icon icon={ICONS.growth} color={ICON_STYLES.verDetalle.color} />
                <CustomText style={styles.btnVerDetalleText}>Ver Detalle</CustomText>
              </Button>
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
          </Card>
        ))}

        <Button
          variant="ghost"
          onPress={() => router.push("/(drawer)/proveedores/nuevoProveedor")}
          style={styles.btnAgregar}
        >
          <Icon icon={ICONS.add} color={ICON_STYLES.add.color} />
          <CustomText style={styles.btnAgregarText}>Agregar proveedor</CustomText>
        </Button>
      </View>
    </ScrollView>
  );
}