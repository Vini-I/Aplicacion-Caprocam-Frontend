/**
 * ============================================================
 * PANTALLA: DETALLECOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Muestra la información completa de un comprador.
 *
 * FUNCIONALIDAD:
 * 1. Busca el comprador por id (useDetalleCompradorScreen).
 * 2. Muestra nombre, cédula, tipo de producto, teléfono, correo,
 *    dirección y notas.
 * 3. Botón "Editar" navega al formulario de edición.
 * 4. Botón "Eliminar" abre un modal de confirmación antes de
 *    volver a la lista.
 *
 * IMPORTANTE:
 * - Botones Editar/Eliminar usan Button variant="outline"; el de
 *   Eliminar además suma styles.botonEliminar (solo borderColor)
 *   para verse en rojo, sin depender de una variante roja del
 *   Button global.
 * - El "tipo de producto" que se muestra aquí es un dato existente
 *   del comprador (badge de solo lectura); no depende del select
 *   que se eliminó del formulario de alta/edición.
 * ============================================================
 */

import { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";

import Icon from "../../../shared/components/Icons";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import Modal from "../../../shared/components/Modal";
import ModalEliminar from "../../../shared/components/ModalEliminar";
import EmptyState from "../../../shared/components/EmptyState";
import Alert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

import { styles, ICON_SIZE } from "../styles/DetalleCompradorStyles";
import { useDetalleCompradorScreen } from "../hooks/useDetalleCompradorScreen";


export default function DetalleCompradorScreen() {
  const {
    comprador,
    cargando,
    error,
    modalVisible,
    setModalVisible,
    eliminado,
    eliminando,
    irAtras,
    irAEditar,
  } = useDetalleCompradorScreen();

  if (cargando) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!comprador) {
    return (
      <View style={styles.contenedor}>
        <EmptyState
          title="Comprador no encontrado"
          description={error || "El comprador que buscas no existe."}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.contenido, STYLE.contentWrapper]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.tarjeta}>

          {/* Encabezado con avatar, nombre y tipo de producto */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIniciales}>
                {comprador.iniciales}
              </Text>
            </View>
            <View style={styles.compradorInfo}>
              <Title level={4}>{comprador.nombre}</Title>
            </View>
          </View>

          {/* Sección de contacto: teléfono, correo y dirección */}
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>
              Información de contacto
            </Text>

            <View style={styles.filaDetalle}>
              <Text style={styles.filaEtiqueta}>Cédula</Text>
              <Text style={styles.filaValor}>{comprador.cedula}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.filaEtiqueta}>Teléfono</Text>
              <Text style={styles.filaValor}>{comprador.telefono}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.filaEtiqueta}>Correo electrónico</Text>
              <Text style={styles.filaValor}>{comprador.correo}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.filaEtiqueta}>Dirección</Text>
              <Text style={styles.filaValor}>{comprador.direccion}</Text>
            </View>
          </View>

          {/* Sección de notas, solo se muestra si el comprador tiene notas */}
          {!!comprador.notas && (
            <View style={styles.seccionNotas}>
              <Text style={styles.seccionTitulo}>
                Notas adicionales
              </Text>
              <Text style={styles.notasValor}>
                {comprador.notas}
              </Text>
            </View>
          )}
        </Card>

        {/* Botones de acción: editar y eliminar */}
        <View style={styles.botones}>
         <Button variant="outline" style={[styles.boton, styles.botonEditar]} onPress={irAEditar}>
          <Icon icon={ICONS.edit} size={ICON_SIZE.boton} color={COLORS.primary} />
          <Text style={[styles.botonTexto, styles.botonTextoEditar]}>Editar</Text>
        </Button>
        
        <Button variant="outline" style={[styles.boton, styles.botonEliminar]} onPress={() => setModalVisible(true)}>
          <Icon icon={ICONS.delete} size={ICON_SIZE.boton} color={COLORS.error} />
          <Text style={[styles.botonTexto, styles.botonTextoEliminar]}>Eliminar</Text>
        </Button>
        </View>

          {/* Alert de éxito al pie de la pantalla, igual que al guardar un producto */}
      {eliminado && (
        <Alert
          variant="success"
          message="Comprador eliminado correctamente."
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
        visible={modalVisible}
        title="comprador"
        message={comprador.nombre}
        onCancel={() => setModalVisible(false)}
        onConfirm={irAtras}
    />

      

    </View>
  );
}