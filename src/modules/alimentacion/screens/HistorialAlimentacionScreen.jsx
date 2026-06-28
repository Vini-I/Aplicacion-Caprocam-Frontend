import React from "react";
import { View, ScrollView, Pressable } from "react-native";

import useAlimentacion from "../hooks/useAlimentacion";
import AlimentacionList from "../components/AlimentacionList";
import Text from "../../../shared/components/Text";
import Spinner from "../../../shared/components/Spinner";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { styles } from "../styles/AlimentacionStyles";
export default function HistorialAlimentacionScreen({ navigation }) {
  const { alimentaciones, loading, error } = useAlimentacion();

  if (loading) return <Spinner />;
  if (error) return <Text color={COLORS.error}>{error}</Text>;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <Text style={styles.total}>
          {alimentaciones.length} registros en total
        </Text>

        <AlimentacionList alimentaciones={alimentaciones} />
      </ScrollView>

      <Pressable onPress={() => navigation.goBack()} style={styles.btnVolver}>
        <Text color={COLORS.primary}>VOLVER</Text>
      </Pressable>
    </View>
  );
}