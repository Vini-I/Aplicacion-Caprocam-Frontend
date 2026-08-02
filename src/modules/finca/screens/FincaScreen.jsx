/**
 * ============================================================
 * PANTALLA PRINCIPAL DE FINCAS
 * ============================================================
 *
 * Muestra el listado de fincas registradas y permite realizar
 * acciones principales sobre cada una de ellas.
 *
 * Funcionalidad:
 * - Presenta las fincas disponibles mediante tarjetas interactivas.
 * - Muestra información básica como nombre, ubicación y responsable.
 * - Permite acceder al detalle de una finca seleccionada.
 * - Permite editar y eliminar fincas registradas.
 * - Muestra alertas de confirmación después de acciones CRUD.
 * - Controla la visualización del modal de eliminación.
 * - Utiliza componentes reutilizables para mantener la interfaz.
 */
import { ScrollView, View } from "react-native";

import { styles } from "../../finca/styles/FincaStyles.js";
import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { useFincaScreen } from "../hooks/useFincaScreen.js";

import { STYLE } from "../../../theme/style.js";
import Alert from "../../../shared/components/Alert.jsx";
import Button from "../../../shared/components/Button.jsx";
import CardPress from "../../../shared/components/CardPress";
import Title from "../../../shared/components/Title.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Badge from "../../../shared/components/Badge.jsx";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";

export default function FincaScreen({ onDetail, onNew, onEdit }) {
  const {
    fincas,
    isCompact,
    alert,
    ModalVisible,
    FincaNombreSeleccionada,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useFincaScreen();

  return (
    <>
      <ScrollView style={[STYLE.container, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          {alert === "edited" && (
            <Alert style={styles.alertCorrect}>
              Finca editada correctamente
            </Alert>
          )}
          {alert === "created" && (
            <Alert style={styles.alertCorrect}>
              Finca registrada correctamente
            </Alert>
          )}
          {alert === "deleted" && (
            <Alert style={styles.alertIncorrect}>
              Finca eliminada correctamente
            </Alert>
          )}

          {fincas.map((Finca) => (
            <CardPress
              key={Finca.id}
              onPress={() => onDetail(Finca.id)}
              style={styles.card}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Icon
                    icon={ICONS.location}
                    size={25}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.flex}>
                  <Title level={4} numberOfLines={2}>
                    {Finca.nombreFinca}
                  </Title>

                  <Text numberOfLines={3} color={COLORS.textTertiary}>
                    {Finca.provincia}, {Finca.canton}, {Finca.distrito}
                  </Text>
                  <Text color={COLORS.primary}>
                    {Finca.propietarioResponsable}
                  </Text>

                  <View
                    style={[styles.details, isCompact && styles.detailsColumn]}
                  >
                    <Badge
                      label={`${Finca.estanques ?? "-"} estanques`}
                      textStyle={styles.detail}
                    ></Badge>
                    <Badge
                      label={`${Finca.areaTotal}  ha`}
                      textStyle={styles.detail}
                    ></Badge>
                  </View>
                </View>
                <View style={styles.buttonsCrud}>
                  <Button
                    style={styles.delete}
                    onPress={() => abrirModalEliminar(Finca)}
                  >
                    <Icon
                      icon={ICONS.delete}
                      style={[styles.deleteIcon]}
                      size={20}
                    />
                    <Text size={12} style={styles.deleteIcon}>
                      Eliminar
                    </Text>
                  </Button>

                  <Button style={styles.edit} onPress={() => onEdit(Finca.id)}>
                    <Icon icon={ICONS.edit} style={styles.editIcon} size={20} />
                    <Text size={12} style={styles.editIcon}>
                      Editar
                    </Text>
                  </Button>
                </View>
              </View>
            </CardPress>
          ))}

          <ModalEliminar
            visible={ModalVisible}
            title="finca"
            message={FincaNombreSeleccionada}
            onCancel={cancelarEliminar}
            onConfirm={confirmarEliminar}
          />
        </View>
      </ScrollView>
      <View style={styles.addButtonContainer}>
        <Button style={[STYLE.contentWrapper, styles.addButton]} onPress={() => onNew()}>
          <Icon style={styles.addButtonText} icon={ICONS.add} size={15} />
          <Text style={styles.addButtonText} size={15}>
             Añadir Finca
          </Text>
        </Button>
      </View>
    </>
  );
}
