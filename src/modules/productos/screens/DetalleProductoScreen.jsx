/**
 * ============================================================
 * PANTALLA: DETALLEPRODUCTOSCREEN
 * ============================================================
 * Módulo: Productos
 *
 * Muestra el detalle completo de un producto del inventario.
 *
 * FUNCIONALIDAD:
 * 1. Header celeste usando COLORS.primary.
 * 2. Muestra información general: cantidad, stock mínimo,
 *    categoría y proveedor.
 * 3. Muestra información económica: precio por unidad y valor
 *    total en stock (precio x cantidad).
 * 4. Marca con un badge cuando el producto tiene stock bajo
 *    (cantidad menor al stock mínimo).
 * 5. Botón "Editar" navega al formulario con el producto cargado.
 * 6. Botón "Eliminar" abre un modal de confirmación antes de
 *    borrar el producto definitivamente.
 *
 * IMPORTANTE:
 * - No modifica rutas existentes ni la estructura del proyecto.
 * ============================================================
 */



import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";


import Navbar from "../../../shared/components/Navbar";
import Icon from "../../../shared/components/Icons";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import ModalEliminar from "../../../shared/components/ModalEliminar";
import Badge from "../../../shared/components/Badge";
import Modal from "../../../shared/components/Modal";
import Alert from "../../../shared/components/Alert";

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

import { styles,colorCategoria,colorCategoriaDefault } from "../styles/DetalleProductScreenStyles";

import { useDetalleProducto } from "../hooks/useDetalleProductoScreen.js";

function FilaDetalle({ etiqueta, valor, resaltado = false }) {
  return (
    <View style={styles.filaDetalle}>
      <Text size={12} color={COLORS.textTertiary}>
        {etiqueta}
      </Text>
      <Text
        size={14}
        weight="600"
        color={resaltado ? COLORS.error : COLORS.textSecondary}
      >
        {valor}
      </Text>
    </View>
  );
}

export default function DetalleProductoScreen() {
  const {
    producto,
    cargando,
    error,
    eliminando,
    tieneStockBajo,
    colores,
    precioFormateado,
    stockTotalFormateado,
    modalEliminarVisible,
    handleEditar,
    handleEliminar,
    confirmarEliminar,
    handleBack,
    handleCerrarModal,
    eliminado,
  } = useDetalleProducto();

  if (cargando) {
    return (
      <View style={[STYLE.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!producto) {
    return (
      <View style={STYLE.container}>
        <Navbar
          title="Producto no encontrado"
          style={styles.navbar}
          leftContent={
            <Button
              variant="outline"
              onPress={handleBack}
              style={styles.backButton}
            >
              <Icon icon={ICONS.back} size={22} color={COLORS.white} />
            </Button>
          }
        />
        <View style={styles.emptyContainer}>
          <Text>{error || "El producto no existe"}</Text>
        </View>
      </View>
    );
  }


    return (
        <View style={STYLE.container}>
            <ScrollView
                contentContainerStyle={[styles.contentContainer, STYLE.contentWrapper]}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.tarjeta}>
                    <View style={styles.tarjetaEncabezado}>
                        <Title level={4} style={styles.nombreProducto}>
                            {producto.nombre}
                        </Title>
                    </View>

                    {tieneStockBajo && (
                        <Badge
                            label="▲ Stock bajo"
                            variant="danger"
                            style={styles.badgeStockBajo}
                        />
                    )}

                    <Badge
                        label={producto.categoria}
                        style={[styles.badgeCategoria, { backgroundColor: colores.fondo }]}
                        textStyle={{ color: colores.texto }}
                    />

                    <View style={styles.detallesSeccion}>
                        <Title level={5} style={styles.sectionTitle}>
                            Información General
                        </Title>

                        <FilaDetalle
                            etiqueta="Cantidad actual"
                            valor={`${producto.cantidad} ${producto.unidad}`}
                            resaltado={tieneStockBajo}
                        />
                        <FilaDetalle etiqueta="Stock mínimo" valor={`${producto.stockMinimo} ${producto.unidad}`} />
                        <FilaDetalle etiqueta="Categoría" valor={producto.categoria} />
                        <FilaDetalle etiqueta="Proveedor" valor={producto.proveedor} />

                        <Title level={5} style={styles.sectionTitle}>
                            Información Económica
                        </Title>

                        <FilaDetalle etiqueta="Precio por unidad" valor={precioFormateado} />
                        <FilaDetalle
                            etiqueta="Valor total en stock"
                            valor={stockTotalFormateado}
                        />
                    </View>
                </Card>

        <View style={styles.botonesSeccion}>
                    <Button variant="outline" style={[styles.botonAccion, styles.botonEditar]} onPress={handleEditar}>
                        <Icon icon={ICONS.edit} size={20} color={COLORS.primary} />
                        <Text color={COLORS.primary} weight="600" size={14}>Editar</Text>
                        </Button>
                        
                    <Button variant="outline" style={[styles.botonAccion, styles.botonEliminar]} onPress={handleEliminar}>
                        <Icon icon={ICONS.delete} size={20} color={COLORS.error} />
                        <Text color={COLORS.error} weight="600" size={14}>Eliminar</Text>
                    </Button>
                </View>

                {/* Alert de éxito al pie de la pantalla, igual que al guardar un producto */}
                {eliminado && (
                    <Alert
                        variant="success"
                        message="Producto eliminado correctamente."
                        style={styles.alertEliminado}
                    />
                )}

                {/* Si falla la desactivación en el back, se muestra el error aquí */}
                {!!error && !eliminado && (
                    <Alert
                        variant="danger"
                        message={error}
                        style={styles.alertEliminado}
                    />
                )}
            </ScrollView>

            <ModalEliminar
                visible={modalEliminarVisible}
                title="producto"
                message={producto.nombre}
                onCancel={handleCerrarModal}
                onConfirm={confirmarEliminar}
            />
        </View>        
    );
}

