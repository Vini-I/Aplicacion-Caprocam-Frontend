import { ScrollView, View } from "react-native";
import { useState } from "react";
import { fincas } from "./FincaData.js";
import { styles } from "../../finca/styles/FincaStyles.js";
import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import Button from "../../../shared/components/Button.jsx";
import Title from "../../../shared/components/Title.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import ModalEliminarFinca from "./ModalEliminarFinca.jsx";

export default function FincasScreen({ onDetail, onNew, onEdit }) {
  const [ModalVisible, setModalVisible] = useState(false);
  const [FincaNombreSeleccionada, setFincaNombreSeleccionada] = useState(null);

  function abrirModalEliminar(Finca) {
    setFincaNombreSeleccionada(Finca.nombre);
    setModalVisible(true);
  }

  function cancelarEliminar() {
    setModalVisible(false);
    setFincaNombreSeleccionada(null);
  }

  function confirmarEliminar() {
    console.log("Eliminando finca:", FincaNombreSeleccionada);
    setModalVisible(false);
    setFincaNombreSeleccionada(null);
  }

  return (
    <ScrollView style={styles.container}>
      {fincas.map((Finca) => (
        <Button
          key={Finca.id}
          style={styles.ContentWrapper}
          onPress={() => onDetail(Finca.codigoInterno)}
        >
          <View style={styles.CardContent}>
            <View style={styles.IconContainer}>
              <Icon icon={ICONS.location} size={25} color={COLORS.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Title level={4} numberOfLines={1}>
                {Finca.nombre}
              </Title>

              <Text numberOfLines={2} color={COLORS.textTertiary}>
                {Finca.provincia}, {Finca.canton}, {Finca.distrito}
              </Text>
              <Text color={COLORS.primary}>{Finca.responsable}</Text>

              <View style={styles.Detalles}>
                <Text size={14} style={styles.Detalle}>
                  {Finca.estanques} estanques
                </Text>
                <Text size={14} style={styles.Detalle}>
                  {Finca.areaTotal} ha
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Button
              style={styles.Eliminar}
              onPress={() => abrirModalEliminar(Finca)}
            >
              <Icon
                icon={ICONS.delete}
                style={{ color: COLORS.error }}
                size={20}
              />
              <Text size={12} style={{ color: COLORS.error }}>
                Eliminar
              </Text>
            </Button>
            <Button style={styles.Editar} onPress={() => onEdit()}>
              <Icon
                icon={ICONS.edit}
                style={{ color: COLORS.primary }}
                size={20}
              />
              <Text size={12} style={{ color: COLORS.primary }}>
                Editar
              </Text>
            </Button>
          </View>
        </Button>
      ))}
      <Button style={styles.AddButton} onPress={() => onNew()}>
        <Icon icon={ICONS.add} size={15} />
        <Text size={15}>REGISTRAR NUEVA FINCA</Text>
      </Button>

      <ModalEliminarFinca
        visible={ModalVisible}
        nombre={FincaNombreSeleccionada}
        onCancelar={cancelarEliminar}
        onConfirmar={confirmarEliminar}
      />
      <ModalEliminarFinca
        visible={ModalVisible}
        nombre={FincaNombreSeleccionada}
        onCancelar={cancelarEliminar}
        onConfirmar={confirmarEliminar}
      />
    </ScrollView>
  );
}
