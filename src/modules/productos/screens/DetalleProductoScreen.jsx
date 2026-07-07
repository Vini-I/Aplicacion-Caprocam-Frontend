
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProductoById, deleteProducto } from "../../inventarios/services/InventarioService.js";

import Navbar from "../../../shared/components/Navbar";
import Icon from "../../../shared/components/Icons";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import Badge from "../../../shared/components/Badge";
import Modal from "../../../shared/components/Modal";

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

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
  } = useDetalleProducto();

  if (!producto) {
    return (
      <View style={styles.contenedor}>
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
          <Text>El producto no existe</Text>
        </View>
      </View>
    );
  }


    return (
        <View style={styles.contenedor}>
            <Navbar
                title="Detalle de Producto"
                style={styles.navbar}
                titleStyle={styles.navbarTitulo}
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

            <ScrollView
                contentContainerStyle={styles.contentContainer}
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
            </ScrollView>

            <Modal
                visible={modalEliminarVisible}
                onClose={handleCerrarModal}
                closeText="Cancelar"
            >
                <Title level={5} style={styles.modalTitulo}>
                    Eliminar producto
                </Title>
                <Text size={14} color={COLORS.textSecondary} style={styles.modalTexto}>
                    ¿Está seguro que desea eliminar "{producto.nombre}"? Esta acción no se puede deshacer.
                </Text>
                <Button style={styles.botonModalEliminar} onPress={confirmarEliminar}>
                    <Icon icon={ICONS.delete} size={18} color={COLORS.white} />
                    <Text color={COLORS.white} weight="600" size={14}>
                        Eliminar
                    </Text>
                </Button>
            </Modal>
        </View>
    );
}

