/**
 * InventarioScreen.jsx
 * Pantalla principal del módulo de Inventarios.
 *
 * FUNCIONALIDAD:
 * - Muestra el listado de productos del inventario.
 * - Integra búsqueda por texto y panel de filtros avanzados.
 * - Resalta tarjetas de productos que tengan stock bajo.
 *
 * REGLAS IMPORTANTES:
 * - Utiliza los componentes compartidos SearchBar y FilterButton.
 * - Botón outline inferior para agregar un nuevo producto.
 * - Sin estilos inline.
 *
 * @dependencies - React, SearchBar, FilterButton, useInventario
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

const iconoPorCategoria = [
  { match: ["alimentación", "alimentacion"], icon: ICONS.food },
  { match: ["tratamiento"], icon: ICONS.shieldAlert },
  { match: ["químico", "quimico"], icon: ICONS.chemicalContainer },
  { match: ["fertilizante"], icon: ICONS.growth },
  { match: ["antibiótico", "antibiotico"], icon: ICONS.microscope },
  { match: ["probiótico", "probiotico"], icon: ICONS.microscope },
  { match: ["mantenimiento"], icon: ICONS.tools },
];

function getIconForCategory(categoria) {
  const cat = (categoria || "").toLowerCase();
  const encontrado = iconoPorCategoria.find(({ match }) =>
    match.some((palabra) => cat.includes(palabra)),
  );
  return encontrado ? encontrado.icon : ICONS.box;
}

const unidadesInvariables = ["kg", "g", "mg", "ml", "l", "cc"];

const vocales = "aeiouáéíóú";
const acentos = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };

function pluralizarPalabra(palabra) {
  if (!palabra || palabra.toLowerCase().endsWith("s")) return palabra;

  const ultima = palabra.charAt(palabra.length - 1).toLowerCase();
  if (vocales.includes(ultima)) {
    return `${palabra}s`;
  }

  const penultima = palabra.charAt(palabra.length - 2).toLowerCase();
  if (acentos[penultima]) {
    return `${palabra.slice(0, -2)}${acentos[penultima]}${ultima}es`;
  }
  return `${palabra}es`;
}

function getPluralizedUnit(cantidad, unidad) {
  if (Number(cantidad) <= 1 || !unidad) return unidad;

  const [primeraPalabra, ...resto] = unidad.trim().split(" ");

  if (unidadesInvariables.includes(primeraPalabra.toLowerCase())) {
    return unidad;
  }

  const palabraPlural = pluralizarPalabra(primeraPalabra);
  return resto.length ? `${palabraPlural} ${resto.join(" ")}` : palabraPlural;
}

function TarjetaProducto({ producto, onVerDetalle }) {
  const tieneStockBajo = producto.cantidad < producto.stockMinimo;
  const precioFormateado =
    producto.precioUnidad != null && producto.precioUnidad !== ""
      ? `₡${Number(producto.precioUnidad).toLocaleString("es-CR")}`
      : "₡0";

  const fechaCaducidadFormateada =
    producto.fechaCaducidad != null && 
    producto.fechaCaducidad.toString().trim() !== "" && 
    producto.fechaCaducidad !== "-"
      ? producto.fechaCaducidad
      : "Sin Fecha de Caducidad";

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