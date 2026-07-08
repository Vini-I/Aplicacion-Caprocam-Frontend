/**
 * DetalleProveedorScreen
 * Pantalla que muestra la información completa de un proveedor.
 */
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Navbar from "../../../shared/components/Navbar";
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
import { styles, ICON_SIZE } from "../styles/DetalleProveedorStyles";

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
      <View style={styles.contenedor}>
        <Navbar
          title="Proveedor no encontrado"
          style={styles.navbar}
          titleStyle={styles.navbarTitulo}
          leftContent={
            <Button
              variant="outline"
              onPress={() => router.replace("/(drawer)/proveedores/proveedorScreen")}
              style={styles.backButton}
            >
              <Icon icon={ICONS.exit} size={ICON_SIZE.navbar} color={COLORS.white} />
            </Button>
          }
        />
        <EmptyState
          title="Proveedor no encontrado"
          description="El proveedor que buscas no existe."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
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
            <CustomText style={styles.seccionTitulo}>
              Información de contacto
            </CustomText>

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
              <CustomText style={styles.seccionTitulo}>
                Notas adicionales
              </CustomText>
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
            <Icon icon={ICONS.edit} size={ICON_SIZE.boton} color={COLORS.white} />
            <CustomText style={styles.botonTexto}>Editar</CustomText>
          </Button>

          <Button
            style={[styles.boton, styles.botonEliminar]}
            onPress={abrirModal}
          >
            <Icon icon={ICONS.delete} size={ICON_SIZE.boton} color={COLORS.white} />
            <CustomText style={styles.botonTexto}>Eliminar</CustomText>
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={cerrarModal}
        closeText="Cancelar"
        buttonStyle={styles.modalCancelButton}
        overlayStyle={styles.modalOverlay}
        containerStyle={styles.modalContainer}
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
          <Icon icon={ICONS.delete} size={ICON_SIZE.modal} color={COLORS.white} />
          <CustomText style={styles.modalConfirmTexto}>Sí, eliminar</CustomText>
        </Button>
      </Modal>
    </View>
  );
}
