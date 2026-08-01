/**
 * ============================================================
 * SCREEN HISTORIALALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla de solo lectura que lista el historial completo de
 * registros de alimentación ya guardados.
 *
 * Funcionalidad:
 * - Corrige el import de estilos para apuntar al archivo real
 *   AlimentacionStyles.js.
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
import { styles } from "../styles/AlimentacionStyles";
import { STYLE } from "../../../theme/style";
export default function HistorialAlimentacionScreen({ navigation }) {
  const { alimentaciones, loading } = useAlimentacion();

  if (loading) return <Spinner />;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={STYLE.contentWrapper}>
        <Text style={styles.total}>
          {alimentaciones.length} registros en total
        </Text>

        <AlimentacionList alimentaciones={alimentaciones} />
      </ScrollView>

      <Pressable onPress={() => navigation.goBack()} style={styles.btnVolver}>
        <Text color={COLORS.primary}>Volver</Text>
      </Pressable>
    </View>
  );
} 