import { useCallback, useRef, useState } from "react";
import { View, FlatList } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

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

import { getProductosInventario } from "../services/inventarioService.js";

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

function TarjetaProducto({ producto }) {
  const tieneStockBajo = producto.cantidad < producto.stockMinimo;
  const precioFormateado = `₡${producto.precioUnidad.toLocaleString("es-CR")}`;

  return (
    <Card
      style={[
        styles.tarjeta,
        tieneStockBajo && styles.tarjetaStockBajo,
      ]}
    >
      <View style={styles.tarjetaEncabezado}>
        <Title level={5} style={styles.nombreProducto}>
          {producto.nombre}
        </Title>
      </View>

      {tieneStockBajo && (
        <Badge
          label="▲ Stock bajo"
          variant="danger"
          textStyle={styles.badgeTexto}
        />
      )}

      <Badge
        label={producto.categoria}
        style={styles.badgeCategoria}
        textStyle={styles.badgeTexto}
      />

      <View style={styles.filasDetalle}>
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
          valor={producto.proveedor}
        />

        <FilaDetalle
          etiqueta="Precio/unidad"
          valor={precioFormateado}
        />
      </View>
    </Card>
  );
}

export default function InventarioScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  function handleRegresarInicio() {
    router.replace("/inicio");
  }

  useFocusEffect(
    useCallback(() => {
      setProductos(getProductosInventario());

      setBusqueda("");

      setFiltros({
        categories: [],
        suppliers: [],
        units: [],
        lowStock: false,
        expiryDate: "",
      });

      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    }, [])
  );

  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const proveedores = [...new Set(productos.map((p) => p.proveedor))];
  const unidades = [...new Set(productos.map((p) => p.unidad))];

  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();

    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.proveedor.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto);

    const coincideCategoria =
      filtros.categories.length === 0 ||
      filtros.categories.includes(p.categoria);

    const coincideProveedor =
      filtros.suppliers.length === 0 ||
      filtros.suppliers.includes(p.proveedor);

    const coincideUnidad =
      filtros.units.length === 0 ||
      filtros.units.includes(p.unidad);

    const coincideStock =
      !filtros.lowStock ||
      p.cantidad < p.stockMinimo;

    return (
      coincideTexto &&
      coincideCategoria &&
      coincideProveedor &&
      coincideUnidad &&
      coincideStock
    );
  });

  const cantidadStockBajo = productos.filter(
    (p) => p.cantidad < p.stockMinimo
  ).length;

  const renderHeader = () => (
    <View>
      {cantidadStockBajo > 0 && (
        <View style={styles.alertaBanner}>
          <Icon
            icon={ICONS.notification}
            size={16}
            color={COLORS.error}
          />

          <CustomText
            size={13}
            weight="600"
            color={COLORS.error}
            style={styles.alertaTexto}
          >
            {cantidadStockBajo}{" "}
            {cantidadStockBajo === 1
              ? "producto"
              : "productos"}{" "}
            con stock bajo
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
  );

  return (
    <View style={styles.contenedor}>
      <Navbar
        title="Inventario"
        style={styles.navbar}
        titleStyle={styles.navbarTitulo}
        leftContent={
          <Button
            variant="outline"
            onPress={handleRegresarInicio}
            style={styles.backButton}
          >
            <Icon
              icon={ICONS.home}
              size={22}
              color={COLORS.white}
            />
          </Button>
        }
      />

      <View style={styles.barraBusqueda}>
        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar producto, categoría, proveedor..."
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

      <FlatList
        ref={flatListRef}
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TarjetaProducto producto={item} />
        )}
        ListHeaderComponent={renderHeader}
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