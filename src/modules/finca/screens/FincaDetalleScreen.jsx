import { ScrollView, View, TouchableOpacity } from "react-native";
import { Color, useRouter } from "expo-router";

import { styles } from "../styles/FincaDetalleStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

import useFincaDetalle from "../hooks/useFincaDetalle";

import Card from "../../../shared/components/Card";
import CardPress from "../components/CardPress";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";
import Badge from "../../../shared/components/Badge";
import Avatar from "../../../shared/components/Avatar";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

export default function FincaDetalleScreen({ onEstanque, onEstanqueDetalle, onEstanqueEditar }) {
  const router = useRouter();

  const { finca, estanquesFinca, haldleGenerar, loading } = useFincaDetalle();

  return (
    <>
      <NavbarRegistro
        Titulo="Detalle de Finca"
        Subtitulo={finca.nombre}
        Icono="document"
      />
      <ScrollView style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <Card>
            <View style={styles.detalleCard}>
              <View>
                <Text color={COLORS.textTertiary} style={styles.titleText}>
                  DATOS DE LA FINCA
                </Text>
              </View>

              <View style={styles.filaDetalle}>
                <Text style={styles.etiqueta}>Nombre:</Text>
                <Text style={styles.valor}>{finca.nombre}</Text>
              </View>

              <View style={styles.filaDetalle}>
                <Text style={styles.etiqueta}>CBO:</Text>
                <Text style={styles.valor}>{finca.codigoInterno}</Text>
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
                <Text style={styles.etiqueta}>Responsable:</Text>
                <Text style={styles.valor}>{finca.responsable}</Text>
              </View>

              {finca.telefonos?.map((telefono, index) => (
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
                <Text style={styles.valor}>{finca.espejoAgua}</Text>
              </View>


              <Button style={styles.buttonExport} onPress={haldleGenerar} disabled={loading}>
                <Icon icon={ICONS.document} style={styles.iconDocument} size={18} />
                <Text size={15}>
                  {loading ? "GENERANDO..." : "GENERAR REPORTE FINCA"}
                </Text>
              </Button>

            </View>
          </Card>
          <Button
            style={styles.addButton}
            onPress={() => onEstanque()}
          >
            <Icon icon={ICONS.add} size={15} />
            <Text size={15}>
              REGISTRAR NUEVO ESTANQUE
            </Text>
          </Button>

          {estanquesFinca?.map((estanque, index) => (
            <View key={index}>
              <CardPress onPress={() => onEstanqueDetalle(estanque.codigo)}>
                <View style={styles.header}>

                  <View style={styles.icon}>
                    <Icon icon={ICONS.waterFlow} color={COLORS.primary} />
                  </View>

                  <View>
                    <Text style={styles.finca}>{estanque.finca}</Text>
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

                  <Button style={styles.Editar} onPress={() => onEstanqueEditar()}>
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

              </CardPress>
            </View>
          ))}

        </View>
      </ScrollView>
    </>
  );
}