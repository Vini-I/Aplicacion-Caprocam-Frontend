import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Card from "../components/Card.jsx";
import Texts from "../components/Text.jsx";
import { fincas } from "./FincaData.js";
import { styles } from "./FincaStyles.js";
import Titles from "../components/Title.jsx";

export default function FincasScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentWrapper}>
        {fincas.map((finca) => (
          <TouchableOpacity
            key={finca.id}
            style={{ marginBottom: 12 }}
            onPress={() => router.push(`/FincaDetalleScreen?id=${finca.id}`)}
          >
            <Card>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Text>📍</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Titles level={4} numberOfLines={1}>
                    {finca.nombre}
                  </Titles>
                  <Texts tamano="md" color="#666" fuente="Roboto_500Medium">
                    {finca.ubicacion}
                  </Texts>
                  <Texts tamano="md" color="#0088FF" fuente="Roboto_500Medium">
                    {finca.responsable}
                  </Texts>
                  <View style={styles.detalles}>
                    <Texts
                      tamano="sm"
                      color="#FFF"
                      fuente="Roboto_500Medium"
                      estilo={styles.detalle}
                    >
                      {finca.estanques} estanques
                    </Texts>
                    <Texts
                      tamano="sm"
                      color="#FFF"
                      fuente="Roboto_500Medium"
                      estilo={styles.detalle}
                    >
                      {finca.Area} ha
                    </Texts>
                  </View>
                </View>

                <View style={styles.IconoDetalle}>
                  <Text style={styles.iconoDetalleText}>→</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("./FincaNuevaScreen")}
        >
          <Text style={{ fontSize: 24, marginRight: 8 }}>➕</Text>
          <Texts tamano="md" color="#0088FF" fuente="Roboto_500Medium">
            Registrar nueva finca
          </Texts>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
