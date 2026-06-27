import React from "react";
import { View, ScrollView } from "react-native";
import AlimentacionStats from "../components/AlimentacionStats";
import AlimentacionList from "../components/AlimentacionList";
import AlimentacionForm from "../components/AlimentacionForm";
import Text from "../../../shared/components/Text";
import { styles } from "../styles/alimentacionStyles";
import { COLORS } from "../../../theme/colors";
import Footer from "../../../shared/components/Footer";
import Button from "../../../shared/components/Button";

export default function GestionAlimentacion({
  alimentaciones,
  form,
  updateField,
  handleGuardar,
  onBack,
}) {
  const calcularStats = (data) => ({
    registrosHoy: data.length,
    kgSuministrados: data.reduce(
      (acc, a) => acc + Number(a.cantidadKg || 0),
      0,
    ),
    estanquesActivos: new Set(data.map((a) => a.estanque)).size,
  });

  return (
    <ScrollView style={styles.contenido}>
      <View style={styles.alimentacionContent}>
      <AlimentacionStats {...calcularStats(alimentaciones)} />

      <AlimentacionForm form={form} updateField={updateField} />

      <Text tamano="xs" style={styles.secLabel}>
        REGISTROS DEL DÍA
      </Text>

      <AlimentacionList alimentaciones={alimentaciones} />

      <View style={styles.spacer} />

      <Footer
        children={
          <Button variant="primary" onPress={handleGuardar}>
            Guardar Registro
          </Button>
        }
        fixedBottom={true}
      />
    </View>
    </ScrollView>
  );
}
