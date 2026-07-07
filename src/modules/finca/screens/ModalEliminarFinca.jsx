/**
 * ============================================================
 * MODAL DE ELIMINACIÓN DE FINCA
 * ============================================================
 *
 * Muestra una ventana de confirmación antes de eliminar una
 * finca registrada dentro del sistema.
 *
 * Funcionalidad:
 * - Solicita confirmación al usuario antes de eliminar.
 * - Muestra el nombre de la finca seleccionada.
 * - Permite cancelar la acción de eliminación.
 * - Ejecuta la eliminación mediante una acción confirmada.
 * - Utiliza componentes compartidos para mantener la interfaz.
 */
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/ModalEliminarStyles.js";
import { STYLE } from "../../../theme/style.js";
import { ICONS } from "../../../theme/icons.js";
import Text from "../../../shared/components/Text.jsx";
import Title from "../../../shared/components/Title.jsx";
import Button from "../../../shared/components/Button.jsx";
import Modal from "../../../shared/components/Modal.jsx";
import Icon from "../../../shared/components/Icons.jsx";

export default function ModalEliminarFinca({
  codigoInterno,
  visible,
  nombre,
  onCancelar,
  onConfirmar,
}) {
  return (
    <Modal
      visible={visible}
      onClose={onCancelar}
      closeText="Cancelar"
      buttonStyle={styles.cancelButton}
      containerStyle={ STYLE.contentWrapper}
    >
      <Title level={3} style={styles.centeredText}>
        ¿Eliminar finca?
      </Title>
      <Text color={COLORS.textTertiary} style={styles.centeredText}>
        ¿Estás seguro que deseas eliminar{" "}
        <Text style={styles.boldText}>{nombre}</Text>?
      </Text>
      <Button
        style={styles.confirmButton}
        onPress={onConfirmar}
      >
        <Icon icon={ICONS.delete} style={styles.confirmButtonText} size={20} />
        <Text style={styles.confirmButtonText}>Sí, eliminar</Text>
      </Button>
    </Modal>
  );
}