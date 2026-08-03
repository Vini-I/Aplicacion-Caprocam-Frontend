/**
 * ============================================================
 * PANTALLA DE DETALLE DE FINCA
 * ============================================================
 *
 * Muestra la información completa de una finca seleccionada
 * junto con los estanques asociados.
 *
 * Funcionalidad:
 * - Presenta información general de la finca.
 * - Muestra teléfonos, ubicación y características principales.
 * - Permite generar reportes PDF de la finca.
 * - Lista los estanques asociados.
 * - Permite navegar al registro y detalle de estanques.
 * - Utiliza componentes reutilizables para mantener el diseño.
 */
import { ScrollView, View } from "react-native";

import { styles } from "../styles/FincaDetalleStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

import useFincaDetalle from "../hooks/useFincaDetalle";

import Card from "../../../shared/components/Card";
import CardPress from "../../../shared/components/CardPress";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";
import Badge from "../../../shared/components/Badge";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import ModalEliminar from "../../../shared/components/ModalEliminar";
import Alert from "../../../shared/components/Alert";

export default function FincaDetalleScreen({
  onEstanque,
  onEstanqueDetalle,
  onEstanqueEditar,
}) {
  const {
    finca,
    estanquesFinca,
    handleGenerar,
    loadingFincas,
    loadingEstanques,
    loadingPdf,

    alert,

    modalVisible,
    estanqueSeleccionado,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useFincaDetalle();

  if (loadingFincas || loadingEstanques) {
    return <Text>Cargando...</Text>;
  }

  if (!finca) {
    return <Text>Finca no encontrada</Text>;
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Detalle de Finca"
        Subtitulo={finca.nombreFinca}
        Icono="document"
      />
      <ScrollView showsVerticalScrollIndicator={false} style={STYLE.container}>
        <View style={[STYLE.contentWrapper, styles.content]}>
          {alert === "edited" && (
            <Alert style={styles.alertCorrect}>
              Estanque editado correctamente
            </Alert>
          )}
          {alert === "created" && (
            <Alert style={styles.alertCorrect}>
              Estanque registrado correctamente
            </Alert>
          )}
          {alert === "deleted" && (
            <Alert style={styles.alertIncorrect}>
              Estanque eliminado correctamente
            </Alert>
          )}

          <Card>
            <View>
              <Text
                color={COLORS.textTertiary}
                weight="500"
                style={styles.titleText}
              >
                Datos De La Finca
              </Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Nombre:</Text>
              <Text style={styles.valor}>{finca.nombreFinca}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>CBO:</Text>
              <Text style={styles.valor}>{finca.codigoCBO}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Provincia:</Text>
              <Text style={styles.valor}>{finca.provincia}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Canton:</Text>
              <Text style={styles.valor}>{finca.canton}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Distrito:</Text>
              <Text style={styles.valor}>{finca.distrito}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Otras Señas:</Text>
              <Text numberOfLines={3} style={styles.valor}>
                {finca.otrasSenas}
              </Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Responsable:</Text>
              <Text style={styles.valor}>{finca.propietarioResponsable}</Text>
            </View>

            {finca.telefonoParse?.map((telefono, index) => (
              <View key={index} style={styles.filaDetalle}>
                <Text style={styles.etiqueta}>Teléfono {index + 1}: </Text>
                <Text style={styles.valor}>{telefono}</Text>
              </View>
            ))}

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Área:</Text>
              <Text style={styles.valor}>{finca.areaTotal}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Espejo Agua:</Text>
              <Text style={styles.valor}>{finca.espejosAgua}</Text>
            </View>

            <Button
              style={styles.buttonExport}
              onPress={handleGenerar}
              disabled={loadingPdf}
            >
              <Icon
                icon={ICONS.document}
                style={styles.iconDocument}
                size={18}
              />
              <Text size={15}>
                {loadingPdf ? "Generando..." : "Generar Reporte Finca"}
              </Text>
            </Button>
          </Card>

          {estanquesFinca?.map((estanque, index) => (
            <View key={index}>
              <CardPress onPress={() => onEstanqueDetalle(estanque.id, finca)}>
                <View style={styles.header}>
                  <View style={styles.icon}>
                    <Icon icon={ICONS.waterFlow} color={COLORS.primary} />
                  </View>

                  <View>
                    <Text style={styles.finca}>{finca.nombreFinca}</Text>
                    <Text style={styles.codigo}>{estanque.codigo}</Text>
                  </View>

                  <Badge style={styles.estado} label={estanque.estado} />
                </View>

                <View style={styles.dimensiones}>
                  <View style={styles.item}>
                    <Text style={styles.label}>Largo</Text>
                    <Text style={styles.valorE}>{estanque.largo} m</Text>
                  </View>

                  <View style={styles.item}>
                    <Text style={styles.label}>Ancho</Text>
                    <Text style={styles.valorE}>{estanque.ancho} m</Text>
                  </View>

                  <View style={styles.item}>
                    <Text style={styles.label}>Profundidad</Text>
                    <Text style={styles.valorE}>{estanque.profundidad} m</Text>
                  </View>
                </View>

                <View style={styles.Buttons}>
                  <Button
                    style={styles.Eliminar}
                    onPress={() => abrirModalEliminar(estanque)}
                  >
                    <Icon icon={ICONS.delete} color={COLORS.error} size={20} />
                    <Text size={12} color={COLORS.error}>
                      Eliminar
                    </Text>
                  </Button>

                  <Button
                    style={styles.Editar}
                    onPress={() =>
                      onEstanqueEditar(finca.codigoCBO, estanque.id)
                    }
                  >
                    <Icon icon={ICONS.edit} color={COLORS.primary} size={20} />
                    <Text size={12} color={COLORS.primary}>
                      Editar
                    </Text>
                  </Button>
                </View>
              </CardPress>
            </View>
          ))}

          <ModalEliminar
            visible={modalVisible}
            title="estanque"
            message={estanqueSeleccionado?.codigo}
            onCancel={cancelarEliminar}
            onConfirm={confirmarEliminar}
          />
        </View>
      </ScrollView>
      <View style={styles.addButtonContainer}>
        <Button
          style={[STYLE.contentWrapper, styles.addButton]}
          onPress={() => onEstanque(finca.codigoCBO)}
        >
          <Icon style={styles.addButtonText} icon={ICONS.add} size={15} />
          <Text style={styles.addButtonText} size={15}>
            Añadir Estanque
          </Text>
        </Button>
      </View>
    </>
  );
}
