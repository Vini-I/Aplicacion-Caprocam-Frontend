/**
 * ============================================================
 * SCREEN HISTORIALALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla de solo lectura que lista el historial completo de
 * registros de alimentación ya guardados.
 *
 * Funcionalidad:
 * - Corrige el import de estilos: el archivo real en disco es
 *   alimentacionStyles.js (a minúscula); el import anterior
 *   decía "../styles/AlimentacionStyles" (A mayúscula), lo cual
 *   falla en sistemas sensibles a mayúsculas (Linux/EAS Build).
 *
 * Nota: esta pantalla no está enrutada actualmente desde
 * src/app/ (ninguna ruta la importa) y no tiene filtros ni
 * búsqueda; ver resumen final para más detalle.
 *
 * Props principales:
 * - navigation: objeto de navegación (usa navigation.goBack()).
 *
 * Ejemplo:
 * <HistorialAlimentacionScreen navigation={navigation} />
 */

import React from "react";
import { View, ScrollView, Pressable } from "react-native";

import useAlimentacion from "../hooks/useAlimentacion";
import AlimentacionList from "../components/AlimentacionList";
import Text from "../../../shared/components/Text";
import Spinner from "../../../shared/components/Spinner";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { styles } from "../styles/alimentacionStyles";
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