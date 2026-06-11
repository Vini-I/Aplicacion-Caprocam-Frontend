import { ScrollView, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Card from "../components/Card";
import Text from "../components/Text";
import { fincas } from "./FincaData";
import { styles } from "./FincaDetalleStyles";

export default function FincaDetalleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const finca = fincas.find(f => f.id === parseInt(id));

  if (!finca) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Finca no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#0088FF", marginTop: 20 }}>← Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.detalleCard}>
          <View>
            <Text tamano="sm" color="#888" style={styles.titleText}>
              DATOS DE LA FINCA
            </Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text estilo={styles.etiqueta}>Finca:</Text>
            <Text estilo={styles.valor}>{finca.nombre}</Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text estilo={styles.etiqueta}>ID:</Text>
            <Text estilo={styles.valor}>{finca.id}</Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text estilo={styles.etiqueta}>Ubicación:</Text>
            <Text estilo={styles.valor}>{finca.ubicacion}</Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text estilo={styles.etiqueta}>Responsable:</Text>
            <Text estilo={styles.valor}>{finca.responsable}</Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text estilo={styles.etiqueta}>Teléfono:</Text>
            <Text estilo={styles.valor}>{finca.telefono}</Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text estilo={styles.etiqueta}>Área:</Text>
            <Text estilo={styles.valor}>{finca.Area}</Text>
          </View>
        </View>
      </Card>
      <TouchableOpacity
        style={styles.addButton}
        //onPress={() => router.push("./FincaDetalleScreen")} COLOCAR RUTA ESTANQUE
      >
        <Text tamano="lg" estilo={styles.addButtonText}>
          ➕ Registrar nuevo estanque
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
