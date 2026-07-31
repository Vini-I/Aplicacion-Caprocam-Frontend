/**
 * ============================================================
 * SCREEN: InventarioScreen
 * ============================================================
 *
 * Responsabilidad:
 * Pantalla principal del módulo de Inventarios. Muestra el listado de
 * productos con búsqueda, filtros y alerta de stock bajo, y permite
 * navegar al detalle de un producto o a la creación de uno nuevo.
 *
 * Datos:
 * Consume useInventario(), que a su vez lee del InventarioService.
 * Cada producto muestra: nombre, código, categoría, cantidad, unidad,
 * stock mínimo, proveedor, precio por unidad y fecha de caducidad
 * (dd/mm/aaaa, o "Sin Fecha de Caducidad").
 *
 * Validaciones:
 * No aplica formularios en esta pantalla. 
 * Estados visuales condicionale:
 *  Stock bajo: se resalta la tarjeta cuando cantidad < stockMinimo
 *  Precio nulo: se muestra "₡0" en lugar de romper la app
 *  Fecha vacía: se muestra "Sin fecha registrada"
 *
 * Navegación:
 * onDetail(id): navega al detalle de un producto.
 * onNew(): navega a la creación de un nuevo producto (el producto
 * creado se antepone al listado, ver InventarioService.addProducto).
 * onBack: se recibe como prop por consistencia con la navegación del
 * módulo; el botón de regreso lo resuelve el header global, no esta
 * pantalla.
 *
 * Dependencias:
 * shared/components (Card, Badge, Button, Text, Title, EmptyState,
 * Icons), components/SearchBar.jsx, components/FilterButton.jsx,
 * hooks/useInventario.js, theme (colors, icons, style).
 *
 * Notas de diseño:
 * La tarjeta de producto usa CardPress para navegación al detalle
 * El badge de "Stock bajo" no lleva ícono, solo texto.
 * Los íconos de la pantalla (caja, gráfico, notificación de stock
 * bajo y "Agregar producto") usan el tamaño por defecto del
 * componente Icon, sin overrides de size.
 *
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
import InventarioFiltros from "../components/InventarioFiltros";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/InventarioStyles";

import { useInventario } from "../hooks/useInventario";

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
  const tieneStockBajo = producto.cantidad < producto.stockMinimo;
  const precioFormateado =
    producto.precioUnidad != null
      ? `₡${producto.precioUnidad.toLocaleString("es-CR")}`
      : "₡0";

  return (
    <CardPress
    onPress={onVerDetalle}
    style={[styles.tarjeta, tieneStockBajo && styles.tarjetaStockBajo]}
>
  <View style = {styles.filaTituloIcono}>
    <Icon icon={ICONS.box} color={COLORS.primary}/>
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
        <FilaDetalle etiqueta="Código" valor={producto.codigo || "—"} />
        <FilaDetalle
          etiqueta="Cantidad"
          valor={`${producto.cantidad} ${producto.unidad}`}
          resaltado={tieneStockBajo}
        />
        <FilaDetalle
          etiqueta="Stock mínimo"
          valor={`${producto.stockMinimo} ${producto.unidad}`}
        />
        <FilaDetalle
          etiqueta="Proveedor"
          valor={producto.nombreProveedor || "—"}
        />
        <FilaDetalle etiqueta="Precio/unidad" valor={precioFormateado} />
        <FilaDetalle
          etiqueta="Fecha de caducidad"
          valor={producto.fechaCaducidad || "Sin Fecha de Caducidad"}
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
  } = useInventario();

  return (
    <View style={STYLE.container}>
      <View style={[STYLE.contentWrapper, styles.zonaFiltros]}>
        <View style={styles.barraBusqueda}>
          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar producto, código, categoría, proveedor..."
            containerStyle={styles.searchBarContainer}
          />
          <InventarioFiltros
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

        <CustomText size={13} color={COLORS.textTertiary} style={styles.contadorResultados}>
          {productosFiltrados.length}{" "}
          {productosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"}
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

      <View style={[STYLE.contentWrapper]}>
      <Button variant="outline" onPress={onNew} style={styles.botonAgregar}>
          <Icon icon={ICONS.add} color={COLORS.primary} />
          <CustomText size={14} weight="600" color={COLORS.primary}>
            Registrar Producto
          </CustomText>
        </Button>
      </View>
    </View>  
  );
}
