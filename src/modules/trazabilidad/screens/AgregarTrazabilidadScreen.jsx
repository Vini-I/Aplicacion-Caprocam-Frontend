/**
 * ============================================================
 * AgregarTrazabilidadScreen
 * ============================================================
 *
 * Pantalla para registrar un nuevo movimiento de trazabilidad.
 *
 * Reglas importantes / restricciones:
 * - El header no es local: lo resuelve el Stack layout de rutas
 *   (ver src/app/(drawer)/trazabilidad/_layout.jsx). No agregar un Navbar aquí.
 * - Botones normales deben usar `variant="outline"` salvo excepción aprobada.
 * - Colores deben salir de `COLORS`.
 *
 * Navegación / dependencias relevantes:
 * - Navega a listar/detalle mediante `useTrazabilidad`.
 */
import { View, ScrollView } from "react-native";
import Text from "../../../shared/components/Text";
import { styles } from "../styles/AgregarTrazabilidadStyle";
import { STYLE } from "../../../theme/style";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

import TrazabilidadForm from "../components/TrazabilidadForm";
import { useTrazabilidad } from "../hooks/useTrazabilidad";

export default function AgregarTrazabilidadScreen() {
  const {
    formData,
    fincas,
    colaboradores,
    estanquesOrigen,
    estanquesDestino,
    mensajeError,
    submitted,
    mostrarAlerta,
    manejarCambio,
    manejarCambioFinca,
    manejarEnvio,
    plAutocompletado,
  } = useTrazabilidad();

  return (
    <View style={STYLE.container}>


      {/* Header provided by Stack layout (see src/app/(drawer)/trazabilidad/_layout.jsx) */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={STYLE.contentWrapper}>
          <Alert
            variant="info"
            message="Este registro es un hecho histórico: no se puede editar ni borrar una vez guardado."
            style={styles.infoBanner}
            textStyle={{ color: COLORS.white }}
          />

          <TrazabilidadForm
            formData={formData}
            fincas={fincas}
            colaboradores={colaboradores}
            estanquesOrigen={estanquesOrigen}
            estanquesDestino={estanquesDestino}
            onChange={manejarCambio}
            onChangeFinca={manejarCambioFinca}
            plAutocompletado={plAutocompletado}
            submitted={submitted}
          />

          {mensajeError !== "" && (
            <Alert
              variant="danger"
              message={
                mensajeError ||
                "Revisa los campos obligatorios marcados con * antes de guardar."
              }
              style={styles.infoBanner}
              textStyle={{ color: COLORS.error }}
            />
          )}

          {mostrarAlerta && (
            <Alert
              variant="success"
              message="¡Movimiento registrado exitosamente!"
              style={styles.alertBox}
              textStyle={styles.alertText}
            />
          )}

          <Button
            variant="outline"
            onPress={manejarEnvio}
            style={styles.createButton}
          >
            <View style={styles.createButtonContent}>
              <Icon icon={ICONS.save} size={20} color={COLORS.primary} />
              <Text style={styles.createButtonText}>Registrar movimiento</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    
    </View>
  );
}