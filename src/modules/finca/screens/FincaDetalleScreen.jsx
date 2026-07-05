import { ScrollView, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../styles/FincaDetalleStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

import useFincaDetalle from "../hooks/useFincaDetalle";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";


export default function FincaDetalleScreen({ onEstanque }) {
  const router = useRouter();

  const { finca, haldleGenerar, loading } = useFincaDetalle();
  
  return (
    <>
    <NavbarRegistro
        Titulo="Detalle de Finca"
        Subtitulo={finca.nombre}
        Icono="document"
    />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentWrapper}>
        <Card>
          <View style={styles.detalleCard}>
            <View>
              <Text tamano="sm" color="#888" style={styles.titleText}>
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
              <Icon icon={ICONS.document} style={styles.iconDocument} size={18}/>
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
      </View>
    </ScrollView>
    </>
  );
}