/**
 * ============================================================
 * PANTALLA DETALLE PROVEEDOR
 * ============================================================
 *
 * Muestra la informacion completa de un proveedor y permite editarlo o
 * eliminarlo.
 *
 * FUNCIONALIDAD:
 * 1. Muestra contacto (telefono, correo, direccion) del proveedor.
 * 2. Muestra la seccion "Notas adicionales" con su icono solo si el
 *    proveedor tiene notas guardadas; si no hay notas, la seccion se
 *    quita por completo (no se renderiza vacia).
 * 3. Si el proveedor no existe muestra un EmptyState y un botón
 *    outline "Volver al listado".
 * 4. "Editar" navega a /(drawer)/proveedores/editarProveedor?id=.
 * 5. "Eliminar" abre un modal de confirmación con dos botones outline:
 *    "Sí, eliminar" (rojo, icono de basura) y "Cancelar" (azul, icono
 *    de cerrar); al confirmar (o si el proveedor no existe) vuelve a
 *    /(drawer)/proveedores/proveedorScreen.
 *
 * IMPORTANTE:
 * - Es una pantalla de solo lectura, no aplica validacion de formulario.
 * - No define header/navbar propio: el header celeste global se
 *   resuelve fuera de este módulo.
 * - El Modal compartido usa showCloseButton={false} para que no
 *   agregue su boton "Cerrar" por defecto, ya que esta pantalla
 *   define sus propios botones "Sí, eliminar" y "Cancelar".
 */
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Icon from "../../../shared/components/Icons";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import Badge from "../../../shared/components/Badge";
import Modal from "../../../shared/components/Modal";
import EmptyState from "../../../shared/components/EmptyState";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/DetalleProveedorStyles";

import { useDetalleProveedorScreen } from "../hooks/useDetalleProveedorScreen";

export default function DetalleProveedorScreen() {
  const router = useRouter();
  const {
    proveedor,
    modalVisible,
    abrirModal,
    cerrarModal,
    getTipoLabel,
  } = useDetalleProveedorScreen();

  if (!proveedor) {
    return (
      <View style={[STYLE.container, styles.container]}>
        <View style={STYLE.contentWrapper}>
          <EmptyState
            title="Proveedor no encontrado"
            description="El proveedor que buscas no existe."
          />
          <Button
            style={styles.volverButton}
            onPress={() => router.replace("/(drawer)/proveedores/proveedorScreen")}
          >
            <Icon icon={ICONS.exit} color={COLORS.primary} />
            <CustomText style={styles.volverButtonText}>Volver al listado</CustomText>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[STYLE.container, styles.container]}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
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
              <CustomText style={styles.filaValor}>{proveedor.telefono}</CustomText>
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
            onPress={() =>
              router.push({
                pathname: "/(drawer)/proveedores/editarProveedor",
                params: { id: proveedor.id.toString() },
              })
            }
          >
            <Icon icon={ICONS.edit} color={COLORS.primary} />
            <CustomText style={[styles.botonTexto, styles.botonTextoEditar]}>Editar</CustomText>
          </Button>

          <Button
            style={[styles.boton, styles.botonEliminar]}
            onPress={abrirModal}
          >
            <Icon icon={ICONS.delete} color={COLORS.error} />
            <CustomText style={[styles.botonTexto, styles.botonTextoEliminar]}>Eliminar</CustomText>
          </Button>
        </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        showCloseButton={false}
        overlayStyle={styles.modalOverlay}
        containerStyle={[STYLE.contentWrapper, styles.modalContainer]}
      >
        <Title level={3} style={styles.modalTitle}>
          ¿Eliminar proveedor?
        </Title>
        <CustomText style={styles.modalMessage}>
          ¿Estás seguro que deseas eliminar{" "}
          <CustomText style={styles.modalNombreNegrita}>{proveedor.nombre}</CustomText>?
        </CustomText>
        <Button
          style={styles.modalConfirmButton}
          onPress={() => router.replace("/(drawer)/proveedores/proveedorScreen")}
        >
          <Icon icon={ICONS.delete} color={COLORS.error} />
          <CustomText style={styles.modalConfirmTexto}>Sí, eliminar</CustomText>
        </Button>
        <Button style={styles.modalCancelButton} onPress={cerrarModal}>
          <Icon icon={ICONS.close} color={COLORS.primary} />
          <CustomText style={styles.modalCancelButtonText}>Cancelar</CustomText>
        </Button>
      </Modal>
    </View>
  );
}