/**
 * ============================================================
 * SCREEN HISTORIALALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla de solo lectura que lista el historial completo de
 * registros de alimentación ya guardados. La carga de los datos,
 * el total y el callback de volver viven en
 * hooks/useHistorialAlimentacion.js; esta screen solo arma la UI
 * a partir de lo que ese hook retorna.
 *
 * Funcionalidad:
 * - Importa los estilos desde el archivo real AlimentacionStyles.js.
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

import useHistorialAlimentacion from "../hooks/useHistorialAlimentacion";
import AlimentacionList from "../components/AlimentacionList";

import Text from "../../../shared/components/Text";
import Spinner from "../../../shared/components/Spinner";

import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/AlimentacionStyles";
import { STYLE } from "../../../theme/style";

export default function HistorialAlimentacionScreen({ navigation }) {
  const {
    alimentaciones,
    loading,
    total,
    volver,
  } = useHistorialAlimentacion(navigation);

  if (loading) return <Spinner />;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={STYLE.contentWrapper}>
        <Text style={styles.total}>
          {total} registros en total
        </Text>

        <AlimentacionList alimentaciones={alimentaciones} />
      </ScrollView>

      <Pressable onPress={volver} style={styles.btnVolver}>
        <Text color={COLORS.primary}>Volver</Text>
      </Pressable>
    </View>
  );
}
