import { ScrollView, View } from "react-native";
import { fincas } from "./FincaData.js";
import { styles } from "../../finca/styles/FincaStyles.js";
import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import Button from "../../../shared/components/Button.jsx";
import Title from "../../../shared/components/Title.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Badge from "../../../shared/components/Badge.jsx";
import ModalEliminarFinca from "./ModalEliminarFinca.jsx";
import { useFincaScreen } from "../hooks/useFincaScreen.js";

export default function FincasScreen({ onDetail, onNew, onEdit }) {
  const {
    width,
    isCompact,
    ModalVisible,
    FincaNombreSeleccionada,
    setModalVisible,
    setFincaNombreSeleccionada,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useFincaScreen();

  return (
    <ScrollView style={styles.Container}>
      {fincas.map((Finca) => (
        <View key={Finca.codigoInterno} style={styles.Card}>
          <Button
            style={styles.ContentWrapper}
            onPress={() => onDetail(Finca.codigoInterno)}
          >
            <View style={styles.CardContent}>
              <View style={styles.IconContainer}>
                <Icon icon={ICONS.location} size={25} color={COLORS.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Title level={4} numberOfLines={2}>
                  {Finca.nombre}
                </Title>

                <Text numberOfLines={3} color={COLORS.textTertiary}>
                  {Finca.provincia}, {Finca.canton}, {Finca.distrito}
                </Text>
                <Text color={COLORS.primary}>{Finca.responsable}</Text>

                <View
                  style={[styles.Detalles, isCompact && styles.DetallesColumn]}
                >
                  <Badge
                    label={`${Finca.estanques}  estanques`}
                    textStyle={styles.Detalle}
                  ></Badge>
                  <Badge
                    label={`${Finca.areaTotal}  ha`}
                    textStyle={styles.Detalle}
                  ></Badge>
                </View>
              </View>
            </View>
          </Button>
          <View style={styles.Buttons}>
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
        </View>
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
    </ScrollView>
  );
}
