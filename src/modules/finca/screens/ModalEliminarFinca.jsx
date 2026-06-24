import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/FincaStyles.js";
import { ICONS } from "../../../theme/icons.js";
import Text from "../../../shared/components/Text.jsx";
import Title from "../../../shared/components/Title.jsx";
import Button from "../../../shared/components/Button.jsx";
import Modal from "../../../shared/components/Modal.jsx";
import Icon from "../../../shared/components/Icons.jsx";

export default function ModalEliminarFinca({
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
      buttonStyle={{ backgroundColor: COLORS.textTertiary }}
      overlayStyle={{ backgroundColor: "#00000066" }}
      containerStyle={{
        maxWidth: 900,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <Title level={3} style={{ alignSelf: "center" }}>
        ¿Eliminar finca?
      </Title>
      <Text color={COLORS.textTertiary} style={{ alignSelf: "center" }}>
        ¿Estás seguro que deseas eliminar{" "}
        <Text style={{ fontWeight: "bold" }}>{nombre}</Text>?
      </Text>
      <Button
        style={{ backgroundColor: COLORS.error, marginTop: 12, flexDirection: "row"}}
        onPress={onConfirmar}
      >
        <Icon icon={ICONS.delete} style={{ color: COLORS.white }} size={20} />
        <Text style={{ color: COLORS.white }}>Sí, eliminar</Text>
      </Button>
    </Modal>
  );
}