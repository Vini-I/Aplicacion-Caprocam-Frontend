import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { styles } from "../../../modules/mantCrecimiento/styles/EstanqueStyles.js";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Text from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import { searchEstanqueById } from "./EstanqueData.js";
import { COLORS } from "../../../theme/colors.js";
import BadgeLabel from "../../../shared/components/Badge.jsx";
import Title from "../../../shared/components/Title.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { ICONS } from "../../../theme/icons.js";

function guardarDatos() {
  // Aquí deberia de ir la lógica para guardar los datos ingresados
}

export default function FincaCrecimientoScreen() {
  const { id } = useLocalSearchParams();
  const parsedId = id ? parseInt(id, 10) : null;

  const estanque = useMemo(() => {
    if (parsedId !== null && !Number.isNaN(parsedId)) {
      return searchEstanqueById(parsedId);
    }

    return searchEstanqueById(1);

  }, [parsedId]);
  const [pesoActual, setPesoActual] = useState("");

  if (!estanque) {
    return (
      <ScrollView style={styles.contentWrapper}>
        <Card>
          <Text>No se encontró un estanque válido.</Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.contentWrapper}>
      <Card>
        <View style={styles.cardContent}>
          <Icon icon={ICONS.growth} size={25} color={COLORS.primary} style={{ paddingRight: 8 }} />
          <Text style={styles.cardTitle}>Peso y crecimiento</Text>
        </View>
        <View style={styles.badgeRow}>
          <BadgeLabel
            label={"Estanque: " + estanque.codigo}
            variant="success"
            style={styles.badgeItem}
          /> 
          <BadgeLabel
            label={"Días de cultivo: " + (estanque.diasCultivo ?? "-")}
            variant="success"
          />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputItem}>
            <Title level={5}>
              Peso actual (g) <Icon icon={ICONS.shrimp} size={18} color={COLORS.primary} />
            </Title>
            <Input
              style={{ borderColor: COLORS.primary }}
              placeholder={"Ej. 24"}
              value={pesoActual}
              onChangeText={setPesoActual}
              keyboardType="numeric"
            />
          </View>

        {/* querido greivin  o equipo de backend esto es para mostrar el peso de la semana anterior,  
        se supone que lo ideal es que guarde el valor y despues se cargue */}
          <View style={styles.inputItem}>
            <Title level={5}>
              Peso semana anterior (g) <Icon icon={ICONS.shrimp} size={18} color={COLORS.primary} />
            </Title>
            <Input
              disableInput={true}
              editable={false}
              value={estanque.pesoSemanaAnterior ? estanque.pesoSemanaAnterior.toString() : "-"}
              style={{ borderColor: COLORS.primary } }
            />
          </View>
        </View>
              <Button onPress={guardarDatos}>Guardar</Button>
      </Card>
    </ScrollView>
  );
}