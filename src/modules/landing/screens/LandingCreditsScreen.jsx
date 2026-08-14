/**
 * ============================================================
 * PANTALLA DE CRÉDITOS DE LA LANDING
 * ============================================================
 *
 * Presenta la información académica y los créditos de las
 * personas que participaron en el desarrollo del proyecto
 * CAPROCAM para el curso Integrador I de la UTN.
 *
 * Funcionalidad:
 * - Muestra la Universidad Técnica Nacional y la Sede Guanacaste.
 * - Presenta por separado a los líderes de equipo.
 * - Muestra a los integrantes del equipo de desarrollo.
 * - Identifica al profesor encargado del curso.
 * - Distribuye los nombres en columnas según el ancho disponible.
 * - Adapta la cantidad de columnas para computadora, tableta y móvil.
 * - Permite regresar a la página principal de CAPROCAM.
 * - Utiliza desplazamiento vertical cuando el contenido lo requiere.
 */

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../styles/LandingCreditsStyle";

const LIDERES = [
  "Brandon Gerardo Valdelomar Cortés",
  "Brayan Jose Azofeifa Amador",
  "Eduard Salas Murillo",
  "Gerald Andrés Alfaro Solórzano",
  "José Rodolfo Chaves Herrera",
  "Ricardo Josue Chaves Campos",
];

const EQUIPO_DESARROLLO = [
  "Andrés Jesús Gutiérrez Herrera",
  "Ariana María Araya Cordero",
  "Dennis Alberto Marchena Delgado",
  "Génesis Pamela Leiva Gómez",
  "Gloriana Paola Carrillo Alfaro",
  "Greivin Eliecer Arguedas Gudiel",
  "Isaac Alfredo Chaves Reyes",
  "Jeshuan Joel Torres González",
  "Joan Andrés Campos Ramos",
  "Jorge Adrián Rojas Rojas",
  "José Ignacio Espinoza Palacio",
  "Kristy Daniela Alvarado Gutiérrez",
  "Leandro Sanchez Rojas",
  "Luis Daniel Álvarez Vargas",
  "Marco Vinicio Vasquez Barrantes",
  "Marisol Alfaro López",
  "Oscar Mario Álvarez Cruz",
  "Reynold José Ruiz Obregón",
  "Ricardo Ángel Gallardo Espinoza",
  "Samuel Eduardo Cerdas Cerdas",
  "Sebastián Villegas Barquero",
  "Víctor Duván López Ávila",
  "Wendy María Martínez López",
];

const PROFESOR = "Franklin Jose Chaves Baltodano";

export default function LandingCreditsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

const esMovil = width < 650;
const esTablet = width >= 650 && width < 900;
const esPantallaMediana = width >= 900 && width < 1200;

  function mostrarIntegrantes(integrantes) {
    return integrantes.map((integrante) => (
      <View
        key={integrante}
        style={[
  styles.studentItem,
  esPantallaMediana && styles.studentItemMedium,
  esTablet && styles.studentItemTablet,
  esMovil && styles.studentItemMobile,
]}
      >
        <View style={styles.studentBullet} />

        <Text style={styles.studentName}>
          {integrante}
        </Text>
      </View>
    ));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.institution}>
            Universidad Técnica Nacional
          </Text>

          <Text style={styles.campus}>
            Sede Guanacaste
          </Text>

          <Text style={styles.title}>
            Integrador I
          </Text>

          <Text style={styles.subtitle}>
            Estudiantes creadores de la página
          </Text>

          <View style={styles.card}>
            <View style={styles.teamSection}>
              <Text style={styles.sectionTitle}>
                LÍDERES DE EQUIPO
              </Text>

              <View style={styles.studentsContainer}>
                {mostrarIntegrantes(LIDERES)}
              </View>
            </View>

            <View style={styles.teamSection}>
              <Text style={styles.sectionTitle}>
                EQUIPO DE DESARROLLO
              </Text>

              <View style={styles.studentsContainer}>
                {mostrarIntegrantes(EQUIPO_DESARROLLO)}
              </View>
            </View>

            <View style={styles.professorSection}>
              <Text style={styles.professorLabel}>
                PROFESOR
              </Text>

              <Text style={styles.professorName}>
                {PROFESOR}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Text style={styles.backButtonText}>
              Volver a CAPROCAM
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
