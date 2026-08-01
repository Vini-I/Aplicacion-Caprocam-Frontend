/**
 * ============================================================
 * PANTALLA: COMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Pantalla principal del módulo de compradores.
 *
 * FUNCIONALIDAD:
 * 1. Muestra la lista de compradores (compradoresMock) en tarjetas.
 * 2. Permite buscar por nombre, tipo de producto, teléfono o correo.
 * 3. Permite filtrar por tipo de producto.
 * 4. Botón "Ver Detalle" en cada tarjeta navega al detalle del
 *    comprador.
 * 5. Botón flotante "Agregar comprador" navega al formulario de
 *    alta.
 *
 * IMPORTANTE:
 * - SearchBar y FilterButton se importan desde el módulo de
 *   Inventarios (../../inventarios/components/...): es una
 *   dependencia cruzada pendiente de migrar a un componente
 *   realmente global en shared/, coordinado con ese equipo.
 * - El ancho de la barra de búsqueda, las tarjetas, la lista y el
 *   botón de agregar se alinea con STYLE.contentWrapper (misma
 *   referencia que usa el módulo de Finca), en vez de repetir
 *   maxWidth/alignSelf por separado en cada estilo.
 * ============================================================
 */

import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import Card from "../../../shared/components/Card";
import CardPress from "../../../shared/components/CardPress";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";
import EmptyState from "../../../shared/components/EmptyState";
import Alert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles, ICON_STYLES } from "../styles/CompradorStyles";
import { useCompradorScreen } from "../hooks/useCompradorScreen";



export default function CompradorScreen() {
  const {
    compradoresFiltrados,
    cargando,
    error,
    recargar,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    TIPOS,
    handleVerDetalle,
    handleAgregar,
  } = useCompradorScreen();

  // Renderiza la tarjeta de cada comprador con su info de contacto
  function renderComprador(comprador) {
    return (
      <CardPress onPress={() => handleVerDetalle(comprador.id)} style={[styles.card, STYLE.contentWrapper]}>
        {/* Encabezado con avatar, nombre, tipo y botón de detalle */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {comprador.iniciales}
            </Text>
          </View>

          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>
              {comprador.nombre}
            </Text>
          </View>

          
        </View>

        {/* Teléfono formateado con el patrón +506 XXXX-XXXX */}
        <View style={styles.contactRow}>
          <Icon
            icon={ICONS.phone}
            size={ICON_STYLES.phone.size}
            color={ICON_STYLES.phone.color}
          />
          <Text style={styles.contactText}>
            {comprador.telefono.replace(/^\+506\s?(\d{4})(\d{4})$/, "+506 $1-$2")}
          </Text>
        </View>

        {/* Correo electrónico del comprador */}
        <View style={styles.contactRow}>
          <Icon
            icon={ICONS.user}
            size={ICON_STYLES.user.size}
            color={ICON_STYLES.user.color}
          />
          <Text style={styles.contactText}>{comprador.correo}</Text>
        </View>
      </CardPress>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda por texto y filtro por tipo de producto */}
      <View style={[styles.barraBusqueda, STYLE.contentWrapper]}>
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

      {/* Alerta de error al cargar, con botón para reintentar */}
      {!!error && (
        <View style={[STYLE.contentWrapper, styles.barraBusqueda]}>
          <Alert variant="danger" message={error} style={{ flex: 1 }} />
          <Button variant="outline" onPress={recargar} style={styles.btnVerDetalle}>
            <Text style={styles.btnVerDetalleText}>Reintentar</Text>
          </Button>
        </View>
      )}

      {/* Contenedor con flex:1 para que la lista ocupe el espacio disponible
          y el botón de agregar quede siempre anclado al fondo de la pantalla */}
      <View style={styles.listaContainer}>
        {cargando ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loadingIndicator}
          />
        ) : (
          <FlatList
            data={compradoresFiltrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderComprador(item)}
            contentContainerStyle={[styles.lista, STYLE.contentWrapper]}
            refreshing={cargando}
            onRefresh={recargar}
            ListHeaderComponent={
              <Text style={styles.contadorResultados}>
                {compradoresFiltrados.length}{" "}
                {compradoresFiltrados.length === 1
                  ? "comprador encontrado"
                  : "compradores encontrados"}
              </Text>
            }
            ListEmptyComponent={
              <EmptyState
                title="Sin compradores"
                description="No se encontraron compradores con esa búsqueda."
              />
            }
          />
        )}
      </View>

      {/* Botón de agregar fijo en la parte inferior */}
      <Button
        variant="outline"
        onPress={handleAgregar}
        style={[styles.btnAgregar, STYLE.contentWrapper]}
      >
        <Icon
          icon={ICONS.add}
          size={ICON_STYLES.add.size}
          color={ICON_STYLES.add.color}
        />
        <Text style={styles.btnAgregarText}>Agregar comprador</Text>
      </Button>
    </View>
  );
}
