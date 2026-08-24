/**
 * DetalleProveedorScreen.jsx
 * Pantalla que muestra el detalle de un proveedor.
 *
 * FUNCIONALIDAD:
 * - Muestra la información de contacto y notas de un proveedor.
 * - Renderiza botones de acción (Editar y Eliminar).
 *
 * REGLAS IMPORTANTES:
 * - Si no existe el proveedor, muestra un estado vacío (EmptyState).
 * - Confirmar eliminación abre un modal.
 *
 * @dependencies - React, Componentes UI, useDetalleProveedorScreen, Styles
 * @validations - N/A
 * @navigation - N/A (delegado a la ruta vía props onVolverAlListado, onEditarProveedor, onEliminado)
 */
import { View, ScrollView } from "react-native";

import Icon from "../../../shared/components/Icons";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import Badge from "../../../shared/components/Badge";
import ModalEliminar from "../../../shared/components/ModalEliminar";
import EmptyState from "../../../shared/components/EmptyState";
import Spinner from "../../../shared/components/Spinner";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/DetalleProveedorStyles";

import { useDetalleProveedorScreen } from "../hooks/useDetalleProveedorScreen";
import { formatearTelefono } from "../utils/contactValidators";

export default function DetalleProveedorScreen({
  onVolverAlListado,
  onEditarProveedor,
  onEliminado,
}) {
  const {
    proveedor,
    modalVisible,
    abrirModal,
    cerrarModal,
    confirmarEliminar,
    getTipoLabel,
    cargando,
  } = useDetalleProveedorScreen({ onEliminado });

  if (cargando) {
    return (
      <View style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <Spinner text="Cargando proveedor..." style={{ marginTop: 40 }} />
        </View>
      </View>
    );
  }

  if (!proveedor) {
    return (
      <View style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <EmptyState
            title="Proveedor no encontrado"
            description="El proveedor que buscas no existe."
          />
          <Button
            style={styles.volverButton}
            onPress={onVolverAlListado}
          >
            <Icon icon={ICONS.exit} color={COLORS.primary} />
            <CustomText style={styles.volverButtonText}>Volver al listado</CustomText>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={STYLE.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={STYLE.contentWrapper}>
          <Card style={styles.tarjeta}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <CustomText style={styles.avatarIniciales}>
                  {proveedor.iniciales}
                </CustomText>
              </View>
              <View style={styles.proveedorInfo}>
                <Title level={4}>{proveedor.nombre}</Title>
                <Badge
                  label={getTipoLabel(proveedor.tipoProducto)}
                  style={styles.badge}
                  textStyle={styles.badgeTexto}
                />
              </View>
            </View>

            <View style={styles.seccion}>
              <View style={styles.seccionTituloRow}>
                <Icon icon={ICONS.phone} color={COLORS.primary} />
                <CustomText style={styles.seccionTitulo}>
                  Información de contacto
                </CustomText>
              </View>

              <View style={styles.filaDetalle}>
                <CustomText style={styles.filaEtiqueta}>Teléfono</CustomText>
                <CustomText style={styles.filaValor}>
                  {formatearTelefono(proveedor.telefono)}
                </CustomText>
              </View>

              <View style={styles.filaDetalle}>
                <CustomText style={styles.filaEtiqueta}>Correo electrónico</CustomText>
                <CustomText style={styles.filaValor}>{proveedor.correo}</CustomText>
              </View>

              <View style={styles.filaDetalle}>
                <CustomText style={styles.filaEtiqueta}>Dirección</CustomText>
                <CustomText style={styles.filaValor}>{proveedor.direccion}</CustomText>
              </View>
            </View>

            {!!proveedor.notas && (
              <View style={styles.seccionNotas}>
                <View style={styles.seccionTituloRow}>
                  <Icon icon={ICONS.document} color={COLORS.primary} />
                  <CustomText style={styles.seccionTitulo}>
                    Notas adicionales
                  </CustomText>
                </View>
                <CustomText style={styles.notasValor}>
                  {proveedor.notas}
                </CustomText>
              </View>
            )}
          </Card>

          <View style={styles.botones}>
            <Button
              style={[styles.boton, styles.botonEditar]}
              onPress={() => onEditarProveedor(proveedor.id)}
            >
              <Icon icon={ICONS.edit} color={COLORS.primary} />
              <CustomText style={[styles.botonTexto, styles.botonTextoEditar]}>
                Editar Proveedor
              </CustomText>
            </Button>

            <Button
              style={[styles.boton, styles.botonEliminar]}
              onPress={abrirModal}
            >
              <Icon icon={ICONS.delete} color={COLORS.error} />
              <CustomText style={[styles.botonTexto, styles.botonTextoEliminar]}>
                Eliminar Proveedor
              </CustomText>
            </Button>
          </View>
        </View>
      </ScrollView>

      <ModalEliminar
        visible={modalVisible}
        title="proveedor"
        message={proveedor.nombre}
        onCancel={cerrarModal}
        onConfirm={confirmarEliminar}

      />
    </View>
  );
}