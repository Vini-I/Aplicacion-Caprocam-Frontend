/**
 * ============================================================
 * COMPONENTE MODAL ELIMINAR
 * ============================================================
 *
 * Modal reutilizable para confirmar la eliminación de un
 * elemento dentro de la aplicación.
 *
 * Funcionalidad:
 * - Solicita confirmación antes de ejecutar una eliminación.
 * - Muestra un título y un mensaje personalizados.
 * - Permite confirmar o cancelar la acción.
 * - Mantiene un diseño estándar para todos los módulos.
 * - Puede reutilizarse para eliminar cualquier tipo de registro
 *   (fincas, estanques, usuarios, productos, etc.).
 *
 * Props principales:
 * - visible: controla la visibilidad del modal.
 * - title: título mostrado en la ventana de confirmación.
 * - message: mensaje descriptivo de la acción a confirmar.
 * - confirmText: texto del botón de confirmación.
 * - cancelText: texto del botón para cancelar la acción.
 * - onConfirm: función ejecutada al confirmar la eliminación.
 * - onCancel: función ejecutada al cancelar o cerrar el modal.
 *
 * Ejemplo:
 * <ModalEliminar
 *     visible={modalVisible}
 *     title="¿Eliminar finca?"
 *     message={`${nombre}`}
 *     confirmText="Sí, eliminar"
 *     cancelText="Cancelar"
 *     onConfirm={confirmarEliminar}
 *     onCancel={cerrarModal}
 * />
 */
import { COLORS } from "../../theme/colors.js";
import { STYLE } from "../../theme/style.js";
import { StyleSheet } from "react-native";

import Modal from "./Modal.jsx";
import Button from "./Button.jsx";
import Title from "./Title.jsx";
import Text from "./Text.jsx";

export default function ModalEliminar({
  visible,
  title = "valor",
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      visible={visible}
      onClose={onCancel}
      closeText={"Cancelar"}
      buttonStyle={styles.cancelButton}
      buttonTextStyle={styles.cancelButtonText}
      containerStyle={STYLE.contentWrapper}
    >
      <Title level={3} style={styles.titleText}>
        ¿Eliminar {title}?
      </Title>

      <Text numberOfLines={2} style={styles.messageText}>
        ¿Estás seguro que deseas eliminar <Text style={styles.boldText} >{message}</Text>?
      </Text>

      <Button style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmButtonText}>{"Si, eliminar"}</Text>
      </Button>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  cancelButton: {
    borderWidth: 2,
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.white,
  },

  cancelButtonText: {
    color: COLORS.textTertiary,
  },

  confirmButton: {
    borderWidth: 2,
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
    marginTop: 12,
    flexDirection: "row",
  },

  confirmButtonText: {
    color: COLORS.error,
    fontWeight: "600",
  },

  titleText: {
    alignSelf: "center",
  },

  messageText: {
    color: COLORS.textTertiary,
    alignSelf: "center",
    fontWeight: 600
  },
  
  boldText: {
    fontWeight: "bold",
  },
});
