/**
 * DetalleCompradorScreen
 * Pantalla que muestra la información completa de un comprador.
 * Permite navegar a la edición o eliminar el comprador mediante un modal de confirmación.
 */
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

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

import { styles, ICON_SIZE } from "../styles/DetalleCompradorStyles";
import { useDetalleCompradorScreen } from "../hooks/useDetalleCompradorScreen";


export default function DetalleCompradorScreen() {
  const {
    comprador,
    modalVisible,
    setModalVisible,
    irAtras,
    irAEditar,
    getTipoProductoSelect,
  } = useDetalleCompradorScreen();

  if (!comprador) {
    return (
      <View style={styles.contenedor}>
        <EmptyState
          title="Comprador no encontrado"
          description="El comprador que buscas no existe."
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

          {/* Encabezado con avatar, nombre y tipo de producto */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <CustomText style={styles.avatarIniciales}>
                {comprador.iniciales}
              </CustomText>
            </View>
            <View style={styles.compradorInfo}>
              <Title level={4}>{comprador.nombre}</Title>
              <Badge
                label={getTipoProductoSelect(comprador.tipoProducto)}
                style={styles.badge}
                textStyle={styles.badgeTexto}
              />
            </View>
          </View>

          {/* Sección de contacto: teléfono, correo y dirección */}
          <View style={styles.seccion}>
            <CustomText style={styles.seccionTitulo}>
              Información de contacto
            </CustomText>

            <View style={styles.filaDetalle}>
              <CustomText style={styles.filaEtiqueta}>Teléfono</CustomText>
              <CustomText style={styles.filaValor}>{comprador.telefono}</CustomText>
            </View>

            <View style={styles.filaDetalle}>
              <CustomText style={styles.filaEtiqueta}>Correo electrónico</CustomText>
              <CustomText style={styles.filaValor}>{comprador.correo}</CustomText>
            </View>

            <View style={styles.filaDetalle}>
              <CustomText style={styles.filaEtiqueta}>Dirección</CustomText>
              <CustomText style={styles.filaValor}>{comprador.direccion}</CustomText>
            </View>
          </View>

          {/* Sección de notas, solo se muestra si el comprador tiene notas */}
          {!!comprador.notas && (
            <View style={styles.seccionNotas}>
              <CustomText style={styles.seccionTitulo}>
                Notas adicionales
              </CustomText>
              <CustomText style={styles.notasValor}>
                {comprador.notas}
              </CustomText>
            </View>
          )}
        </Card>

        {/* Botones de acción: editar y eliminar */}
        <View style={styles.botones}>
         <Button variant="outline" style={[styles.boton, styles.botonEditar]} onPress={irAEditar}>
          <Icon icon={ICONS.edit} size={ICON_SIZE.boton} color={COLORS.primary} />
          <CustomText style={[styles.botonTexto, styles.botonTextoEditar]}>Editar</CustomText>
        </Button>
        
        <Button variant="outline" style={[styles.boton, styles.botonEliminar]} onPress={() => setModalVisible(true)}>
          <Icon icon={ICONS.delete} size={ICON_SIZE.boton} color={COLORS.error} />
          <CustomText style={[styles.botonTexto, styles.botonTextoEliminar]}>Eliminar</CustomText>
        </Button>
        </View>
      </ScrollView>

      {/* Modal de confirmación antes de eliminar el comprador */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        closeText="Cancelar"
        buttonStyle={styles.modalCancelButton}
        overlayStyle={styles.modalOverlay}
        containerStyle={styles.modalContainer}
      >
        <Title level={3} style={styles.modalTitle}>
          ¿Eliminar comprador?
        </Title>
        <CustomText style={styles.modalMessage}>
          ¿Estás seguro que deseas eliminar{" "}
          <CustomText style={styles.modalNombreNegrita}>{comprador.nombre}</CustomText>?
        </CustomText>
        <Button style={styles.modalConfirmButton} onPress={irAtras}>
          <Icon icon={ICONS.delete} size={ICON_SIZE.modal} color={COLORS.white} />
          <CustomText style={styles.modalConfirmTexto}>Sí, eliminar</CustomText>
        </Button>
      </Modal>

    </View>
  );
}
