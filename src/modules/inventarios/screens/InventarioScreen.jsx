/**
 * InventarioScreen.jsx
 * Pantalla principal del módulo de Inventarios.
 *
 * FUNCIONALIDAD:
 * - Muestra el listado de productos del inventario.
 * - Integra búsqueda por texto y panel de filtros avanzados.
 * - Resalta tarjetas de productos que tengan stock bajo.
 * - Muestra en la parte superior el alert de éxito (verde) cuando
 *   Productos navega de vuelta a esta pantalla con el parámetro
 *   alertaProducto ("guardado" o "eliminado").
 *
 * REGLAS IMPORTANTES:
 * - Utiliza los componentes compartidos SearchBar y FilterButton.
 * - Botón outline inferior para agregar un nuevo producto.
 * - Sin estilos inline.
 * - El feedback (feedback) se arma en useInventario.js leyendo el
 *   parámetro de navegación alertaProducto enviado por Productos; no
 *   depende del estado interno de sus hooks.
 * - Solo estructura/JSX: los cálculos de negocio viven en
 *   InventarioCalculos.js y el formateo de presentación en
 *   InventarioFormatters.js.
 *
 * @dependencies - React, SearchBar, FilterButton, Alert, useInventario
 * @validations - N/A
 * @navigation - onDetail, onNew
 */

import { View, FlatList } from "react-native";

import CardPress from "../../../shared/components/CardPress";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import EmptyState from "../../../shared/components/EmptyState";
import Icon from "../../../shared/components/Icons";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";
import Alert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/InventarioStyles";

import { useInventario } from "../hooks/useInventario";
import { esStockBajo } from "../utils/InventarioCalculos";
import {
  getIconForCategory,
  getPluralizedUnit,
  formatearPrecioUnidad,
  formatearFechaCaducidad,
} from "../utils/InventarioFormatters";

function FilaDetalle({ etiqueta, valor, resaltado = false }) {
  return (
    <View style={styles.filaDetalle}>
      <CustomText
        size={12}
        color={COLORS.textTertiary}
        style={styles.etiquetaDetalle}
      >
        {etiqueta}
      </CustomText>
      <CustomText
        size={14}
        weight="600"
        color={resaltado ? COLORS.error : COLORS.textSecondary}
        style={styles.valorDetalle}
      >
        {valor}
      </CustomText>
    </View>
  );
}

function TarjetaProducto({ producto, onVerDetalle }) {
  const tieneStockBajo = esStockBajo(producto);
  const precioFormateado = formatearPrecioUnidad(producto.precioUnidad);
  const fechaCaducidadFormateada = formatearFechaCaducidad(
    producto.fechaCaducidad,
  );

  return (
    <CardPress
      onPress={onVerDetalle}
      style={[styles.tarjeta, tieneStockBajo && styles.tarjetaStockBajo]}
    >
      <View style={styles.filaTituloIcono}>
        <Icon icon={getIconForCategory(producto.categoria)} color={COLORS.primary}/>
        <Title level={5} style={styles.nombreProducto}>
          {producto.nombre}
        </Title>
      </View>

      {tieneStockBajo && (
        <View style={styles.badgeStockBajo}>
          <CustomText
            size={12}
            weight="600"
            color={COLORS.error}
            style={styles.badgeStockBajoTexto}
          >
            Stock bajo
          </CustomText>
        </View>
      )}

        <Badge
          label={producto.categoria}
          style={styles.badgeCategoria}
          textStyle={styles.badgeTexto}
        />
  
      <View style={styles.filasDetalle}>
        <FilaDetalle etiqueta="Código" valor={producto.codigo || "No registrado"} />
        <FilaDetalle
          etiqueta="Cantidad"
          valor={`${producto.cantidad} ${getPluralizedUnit(producto.cantidad, producto.unidad)}`}
          resaltado={tieneStockBajo}
        />
        <FilaDetalle
          etiqueta="Stock mínimo"
          valor={`${producto.stockMinimo} ${getPluralizedUnit(producto.stockMinimo, producto.unidad)}`}
        />
        <FilaDetalle
          etiqueta="Proveedor"
          valor={producto.nombreProveedor || "No registrado"}
        />
        <FilaDetalle etiqueta="Precio/unidad" valor={precioFormateado} />
        <FilaDetalle
          etiqueta="Fecha de caducidad"
          valor={fechaCaducidadFormateada}
        />
      </View>
    </CardPress>
  );
}

export default function InventarioScreen({ onDetail, onNew, onBack }) {
  const {
    flatListRef,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    categorias,
    proveedores,
    unidades,
    productosFiltrados,
    cantidadStockBajo,
    feedback,
  } = useInventario();

  return (
    <View style={STYLE.container}>
      <View style={[STYLE.contentWrapper, styles.zonaFiltros]}>
        {feedback && (
          <Alert
            variant={feedback.variant}
            message={feedback.message}
            style={styles.alertFeedback}
          />
        )}

        <View style={styles.barraBusqueda}>
          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar producto, código, categoría, proveedor..."
            containerStyle={styles.searchBarContainer}
          />
          <FilterButton
            categories={categorias}
            suppliers={proveedores}
            units={unidades}
            activeFilters={filtros}
            onApply={setFiltros}
            showLowStock
            showExpiryDate
            buttonStyle={styles.filterButton}
          />
        </View>

        {cantidadStockBajo > 0 && (
          <View style={styles.alertaBanner}>
            <Icon icon={ICONS.notification} color={COLORS.error} />
            <CustomText
              size={13}
              weight="600"
              color={COLORS.error}
              style={styles.alertaTexto}
            >
              {cantidadStockBajo}{" "}
              {cantidadStockBajo === 1 ? "producto" : "productos"} con stock
              bajo
            </CustomText>
          </View>
        )}

        <CustomText 
          size={13} 
          color={COLORS.textTertiary} 
          style={styles.contadorResultados}
        >
          {productosFiltrados.length}{" "}
          {productosFiltrados.length === 1 
            ? "producto encontrado" 
            : "productos encontrados"}
        </CustomText>
      </View>

      <FlatList
        ref={flatListRef}
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TarjetaProducto
            producto={item}
            onVerDetalle={() => onDetail(item.productoId)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sin productos"
            description="No se encontraron productos con esa búsqueda."
          />
        }
        contentContainerStyle={styles.lista}
      />

      <View style={styles.floatingButtonWrapper} pointerEvents="box-none">
        <View style={STYLE.contentWrapper}>
          <Button variant="outline" onPress={onNew} style={styles.botonAgregar}>
            <Icon icon={ICONS.add} color={COLORS.primary} />
            <CustomText size={14} weight="600" color={COLORS.primary}>
              Añadir Producto
            </CustomText>
          </Button>
        </View>
      </View>
    </View>  
  );
}
