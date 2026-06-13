import { ScrollView, View, TouchableOpacity } from "react-native";
import { useSearchParams, useRouter } from "expo-router";
import { fincas } from "./FincaData";
import { styles } from "../styles/FincaDetalleStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";


export default function FincaDetalleScreen({ id }) {
  const router = useRouter();

  const finca = fincas.find((f) => String(f.id) === String(id));

  if (!finca) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Finca no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: COLORS.textPrimary, marginTop: 20 }}>← Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
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
              <Text style={styles.etiqueta}>ID:</Text>
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
              <Text style={styles.etiqueta}>Largo:</Text>
              <Text style={styles.valor}>{finca.largo}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Ancho:</Text>
              <Text style={styles.valor}>{finca.ancho}</Text>
            </View>
          </View>
        </Card>
        <Button
          style={styles.addButton}
          onPress={() => router.push("/finca/nueva")}
        >
          <Icon icon={ICONS.add} size={15} />
          <Text size={15}>
            REGISTRAR NUEVO ESTANQUE
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}