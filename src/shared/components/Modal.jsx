/**
 * ============================================================
 * COMPONENTE MODAL
 * ============================================================
 *
 * Modal reutilizable para React Native.
 *
 * Funcionalidad:
 * - Muestra contenido encima de la pantalla principal.
 * - Recibe children para colocar cualquier contenido dentro.
 * - Permite abrir y cerrar el modal mediante la prop visible.
 * - Permite ejecutar una funcion de cierre con onClose.
 * - Mantiene el nombre Modal para respetar el nombre original del componente.
 *
 * Props principales:
 * - visible: controla si el modal se muestra.
 * - onClose: funcion que se ejecuta al cerrar.
 * - children: contenido interno del modal.
 * - animationType: tipo de animacion del modal.
 * - transparent: permite fondo transparente.
 * - showCloseButton: muestra u oculta el boton cerrar.
 * - closeText: texto del boton cerrar.
 * - overlayStyle: estilos extra para el fondo oscuro.
 * - containerStyle: estilos extra para la caja del modal.
 * - buttonStyle: estilos extra para el boton cerrar.
 * - buttonTextStyle: estilos extra para el texto del boton.
 *
 * Ejemplo:
 * <Modal visible={modalVisible} onClose={cerrarModal}>
 *     <Text>Contenido del modal</Text>
 * </Modal>
 */

import React from "react";
import {
  Modal as NativeModal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../theme/colors";

export default function Modal({
  visible = false,
  onClose,
  children,
  animationType = "fade",
  transparent = true,
  showCloseButton = true,
  closeText = "Cerrar",
  overlayStyle,
  containerStyle,
  buttonStyle,
  buttonTextStyle,
}) {
  return (
    <NativeModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, overlayStyle]}>
        <View style={[styles.container, containerStyle]}>
          {children}

          {showCloseButton === true && (
            <Pressable
              style={[styles.button, buttonStyle]}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, buttonTextStyle]}>
                {closeText}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </NativeModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  container: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
});