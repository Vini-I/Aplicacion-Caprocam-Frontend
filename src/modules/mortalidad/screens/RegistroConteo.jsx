import React from "react";
import { View, Text, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import { COLORS } from "../../../theme/colors";
import { styles } from "../services/mortalidadStyles";

export default function RegistroConteo({
  fecha,
  mostrarCalendario,
  setMostrarCalendario,
  cambiarFecha,
}) {
  return (
    <Card>
      <Text style={styles.label}>Selecciona la Fecha</Text>
      <View style={styles.fechaContainer}>
        <View style={styles.fechaInput}>
          <Input
            value={fecha.toLocaleDateString("es-CR")}
            editable={false}
          />
        </View>

        <Pressable
          style={styles.calendarButton}
          onPress={() => setMostrarCalendario(true)}
        >
          <MaterialIcons
            name="calendar-month"
            size={32}
            color={COLORS.primary}
          />
        </Pressable>
      </View>

      {mostrarCalendario && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={cambiarFecha}
        />
      )}

      <Text style={styles.label}>Método de conteo</Text>
      <Input
        value="Directo"
        editable={false}
      />
    </Card>
  );
}