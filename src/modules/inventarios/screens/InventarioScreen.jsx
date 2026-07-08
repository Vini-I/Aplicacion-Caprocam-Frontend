import { View, FlatList } from "react-native";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import EmptyState from "../../../shared/components/EmptyState";
import Icon from "../../../shared/components/Icons";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/InventarioStyles";

import { useInventario } from "../hooks/useInventario";

function FilaDetalle({ etiqueta, valor, resaltado = false }) {
  return (
    <View style={styles.filaDetalle}>
      <CustomText size={12} color={COLORS.textTertiary} style={styles.etiquetaDetalle}>
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
  const precioFormateado = `₡${producto.precioUnidad.toLocaleString("es-CR")}`;

  return (
    <Card style={[styles.tarjeta, tieneStockBajo && styles.tarjetaStockBajo]}>
      <Title level={5} style={styles.nombreProducto}>
        {producto.nombre}
      </Title>

      {tieneStockBajo && (
        <View style={styles.badgeStockBajo}>
          <Icon icon={ICONS.notification} size={13} color={COLORS.error} />
          <CustomText size={12} weight="600" color={COLORS.error} style={styles.badgeStockBajoTexto}>
            Stock bajo
          </CustomText>
        </View>
      )}

      <View style={styles.filaCategoriaBoton}>
        <Badge
          label={producto.categoria}
          style={styles.badgeCategoria}
          textStyle={styles.badgeTexto}
        />
        <Button variant="outline" onPress={onVerDetalle} style={styles.botonDetalle}>
          <CustomText size={13} weight="600" color={COLORS.white}>
            Ver detalle
          </CustomText>
        </Button>
      </View>

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
        <FilaDetalle etiqueta="Proveedor" valor={producto.proveedor} />
        <FilaDetalle etiqueta="Precio/unidad" valor={precioFormateado} />
      </View>
    </Card>
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
    <View style={styles.contenedor}>
      <View style={styles.zonaFiltros}>
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
            <Icon icon={ICONS.notification} size={16} color={COLORS.error} />
            <CustomText size={13} weight="600" color={COLORS.error} style={styles.alertaTexto}>
              {cantidadStockBajo}{" "}
              {cantidadStockBajo === 1 ? "producto" : "productos"} con stock bajo
            </CustomText>
          </View>
        )}

        <View style={styles.filaContadorBoton}>
          <CustomText size={13} color={COLORS.textTertiary} style={styles.contadorResultados}>
            {productosFiltrados.length}{" "}
            {productosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"}
          </CustomText>
          <Button variant="outline" onPress={onNew} style={styles.botonAgregar}>
            <Icon icon={ICONS.add} size={16} color={COLORS.white} />
            <CustomText size={13} weight="600" color={COLORS.white}>
              Agregar producto
            </CustomText>
          </Button>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TarjetaProducto
            producto={item}
            onVerDetalle={() => onDetail(item.id)}
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
    </View>
  );
}