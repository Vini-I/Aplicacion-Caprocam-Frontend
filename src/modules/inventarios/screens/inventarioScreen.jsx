/**
 * Muestra el listado de productos del inventario.
 * Indica visualmente los productos con stock bajo.
 */

import { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import EmptyState from "../../../shared/components/EmptyState";
import Icon from "../../../shared/components/Icons";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

import { getProductosInventario } from "../services/inventarioService";

const colorCategoria = {
  Alimentación: { fondo: COLORS.warningLight, texto: COLORS.warning },
  Tratamiento: { fondo: COLORS.secondary, texto: COLORS.primary },
  Químico: { fondo: COLORS.secondary, texto: COLORS.primary },
  Fertilizante: { fondo: COLORS.secondary, texto: COLORS.primary },
  Antibiótico: { fondo: COLORS.secondary, texto: COLORS.primary },
  Probiótico: { fondo: COLORS.successLight, texto: "#0D9488" },
};

const colorCategoriaDefault = {
  fondo: COLORS.secondary,
  texto: COLORS.textTertiary,
};

function FilaDetalle({ etiqueta, valor, resaltado = false }) {
  return (
    <View style={styles.filaDetalle}>
      <CustomText size={12} color={COLORS.textTertiary}>
        {etiqueta}
      </CustomText>
      <CustomText
        size={14}
        weight="600"
        color={resaltado ? COLORS.error : COLORS.textSecondary}
      >
        {valor}
      </CustomText>
    </View>
  );
}

function TarjetaProducto({ producto }) {
  const tieneStockBajo = producto.cantidad < producto.stockMinimo;
  const colores = colorCategoria[producto.categoria] || colorCategoriaDefault;
  const precioFormateado = `₡${producto.precioUnidad.toLocaleString("es-CR")}`;

  return (
    <TouchableOpacity activeOpacity={0.85}>
      <Card style={[styles.tarjeta, tieneStockBajo && styles.tarjetaStockBajo]}>
        <View style={styles.tarjetaEncabezado}>
          <Title level={5} style={styles.nombreProducto}>
            {producto.nombre}
          </Title>
          {tieneStockBajo && (
            <Badge
              label="▲ Stock bajo"
              variant="danger"
              style={styles.badgeStockBajo}
            />
          )}
        </View>

        <Badge
          label={producto.categoria}
          style={[styles.badgeCategoria, { backgroundColor: colores.fondo }]}
          textStyle={{ color: colores.texto }}
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
          <FilaDetalle etiqueta="Proveedor" valor={producto.proveedor} />
          <FilaDetalle etiqueta="Precio/unidad" valor={precioFormateado} />
        </View>

        <View
          style={[
            styles.tarjetaPie,
            tieneStockBajo && styles.tarjetaPieStockBajo,
          ]}
        >
          <CustomText
            size={12}
            color={tieneStockBajo ? COLORS.textQuaternary : COLORS.primary}
          >
            Toca para editar
          </CustomText>
          <Icon
            icon={ICONS.enter}
            size={12}
            color={tieneStockBajo ? COLORS.textQuaternary : COLORS.primary}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function InventarioScreen() {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  const productosInventario = getProductosInventario();
  const CATEGORIAS = [...new Set(productosInventario.map((p) => p.categoria))];
  const PROVEEDORES = [...new Set(productosInventario.map((p) => p.proveedor))];
  const UNIDADES = [...new Set(productosInventario.map((p) => p.unidad))];

  const productosFiltrados = productosInventario.filter((p) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.proveedor.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto);
    const coincideCategoria =
      filtros.categories.length === 0 || filtros.categories.includes(p.categoria);
    const coincideProveedor =
      filtros.suppliers.length === 0 || filtros.suppliers.includes(p.proveedor);
    const coincideUnidad =
      filtros.units.length === 0 || filtros.units.includes(p.unidad);
    const coincideStock =
      !filtros.lowStock || p.cantidad < p.stockMinimo;

    return coincideTexto && coincideCategoria && coincideProveedor && coincideUnidad && coincideStock;
  });

  const cantidadStockBajo = productosInventario.filter(
    (p) => p.cantidad < p.stockMinimo,
  ).length;

  function renderHeader() {
    return (
      <View>
        {cantidadStockBajo > 0 && (
          <View style={styles.alertaBanner}>
            <Icon icon={ICONS.notification} size={16} color={COLORS.error} />
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
    );
  }

  function renderProducto({ item }) {
    return <TarjetaProducto producto={item} />;
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <Navbar
        title="Inventario"
        style={styles.navbar}
        titleStyle={styles.navbarTitulo}
        rightContent={
          <Button style={styles.botonAgregar}>
            <Icon icon={ICONS.add} size={20} color={COLORS.white} />
          </Button>
        }
      />
      <View style={styles.barraBusqueda}>
        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          containerStyle={styles.searchBarContainer}
        />
        <FilterButton
          categories={CATEGORIAS}
          suppliers={PROVEEDORES}
          units={UNIDADES}
          activeFilters={filtros}
          onApply={setFiltros}
          buttonStyle={styles.filterButton}
        />
      </View>

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProducto}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            title="Sin productos"
            description="No se encontraron productos con esa búsqueda."
          />
        }
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },
  navbarTitulo: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  botonAgregar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginTop: 0,
  },

  alertaBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.errorLight,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 8,
  },
  alertaTexto: {
    marginLeft: 4,
  },

  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  searchBarContainer: {
    flex: 1,
    
  },
  filterButton: {
    alignSelf: "center",
    marginTop: 0,
    height: 43,
  },
  contadorResultados: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },

  lista: {
    paddingBottom: 24,
  },

  tarjeta: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  tarjetaStockBajo: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.errorLight,
  },
  tarjetaEncabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  nombreProducto: {
    flex: 1,
    marginRight: 8,
  },
  badgeStockBajo: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  badgeCategoria: {
    marginBottom: 12,
  },
  filasDetalle: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  filaDetalle: {
    width: "45%",
    gap: 2,
  },
  tarjetaPie: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 10,
  },
  tarjetaPieStockBajo: {
    borderTopColor: COLORS.errorLight,
  },

});
