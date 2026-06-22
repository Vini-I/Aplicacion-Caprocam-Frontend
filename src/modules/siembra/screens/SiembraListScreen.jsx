/**
 * Pantalla: SiembraListScreen
 *
 * Muestra el listado de siembras activas registradas en el módulo de siembra.
 *
 * Funcionalidades principales:
 * - Visualizar las siembras activas.
 * - Mostrar información resumida de cada siembra mediante tarjetas.
 * - Acceder al detalle o edición de una siembra.
 *
 * Componentes utilizados:
 * - Navbar: encabezado principal de la pantalla.
 * - Button: acción para crear una nueva siembra.
 * - SiembraCard: tarjeta reutilizable para mostrar cada siembra.
 */
import { View, Text, ScrollView } from "react-native";
import { styles } from "../styles/SiembraListStyles";

import Navbar from "../../../shared/components/Navbar";
import Button from "../../../shared/components/Button";
import SiembraCard from "../components/SiembraCard";
import { obtenerSiembras } from "../services/SiembraService";
import { useRouter } from "expo-router";

export default function SiembraListScreen() {
  const siembras = obtenerSiembras();
  const router = useRouter();

  const handleNuevaSiembra = () => {
    router.push("/siembra/nueva");
  };

  const handleDetalleSiembra = (siembraId) => {
    router.push("/siembra/detalle");
  };

  const renderSiembraCard = (siembra) => (
    <SiembraCard
      key={siembra.siembraId}
      siembraId={siembra.siembraId}
      estanque={siembra.estanque}
      finca={siembra.finca}
      diasCultivo={siembra.diasCultivo}
      diasMaduracion={siembra.diasMaduracion}
      cantidadSembrada={siembra.cantidadSembrada}
      estado={siembra.estado}
      onPress={() => handleDetalleSiembra(siembra.siembraId)}
    />
  );

  return (
    <View style={styles.screen}>
      <Navbar
        title=""
        style={styles.header}
        leftContent={<Text style={styles.title}>Siembra</Text>}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <View style={styles.contentHeader}>
            <Text style={styles.sectionTitle}>
              Siembras activas ({siembras.length})
            </Text>

            <Button
              onPress={handleNuevaSiembra}
              style={styles.newButton}
              textStyle={styles.newButtonText}
            >
              + Nueva Siembra
            </Button>
          </View>

          {siembras.map(renderSiembraCard)}
        </View>
      </ScrollView>
    </View>
  );
}
