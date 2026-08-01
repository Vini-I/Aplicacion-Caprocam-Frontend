/**
 * ============================================================
 * PANTALLA AgregarTrazabilidadScreen
 * ============================================================
 *
 * Descripción:
 * Pantalla para el registro de nuevos movimientos de trazabilidad entre estanques.
 *
 * @dependencies TrazabilidadForm, useTrazabilidad, Button, Alert, Icon
 * @validations Campos obligatorios marcados con *. Estanque origen != destino.
 * @navigation Muestra alerta y redirige tras guardar exitosamente.
 */
import { useRef, useEffect } from "react";
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
  const scrollViewRef = useRef(null);

  const {
    formData,
    fincas,
    colaboradorSesion,
    estanquesOrigen,
    estanquesDestino,
    mensajeError,
    submitted,
    manejarCambio,
    manejarCambioFinca,
    manejarEnvio,
    plAutocompletado,
    errorCarga,
    sesionExpirada,
    cerrarErrorCarga,
    irALogin,
  } = useTrazabilidad();

  useEffect(() => {
    if (mensajeError) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensajeError]);

  return (
    <View style={STYLE.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={STYLE.contentWrapper}>
          <Alert
            variant="info"
            message="Este registro es un hecho histórico: no se puede editar ni borrar una vez guardado."
            style={styles.infoBannerHistorico}
            textStyle={styles.infoAlertText}
          />

          {errorCarga !== "" && (
            <Alert
              variant="danger"
              message={errorCarga}
              style={styles.infoBanner}
              textStyle={styles.errorAlertText}
            />
          )}

          {errorCarga !== "" && (
            <Button
              variant="outline"
              onPress={sesionExpirada ? irALogin : cerrarErrorCarga}
              style={styles.infoBanner}
            >
              {sesionExpirada ? "Ir a iniciar sesión" : "Cerrar"}
            </Button>
          )}

          <TrazabilidadForm
            formData={formData}
            fincas={fincas}
            colaboradorSesion={colaboradorSesion}
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
              textStyle={styles.errorAlertText}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <Button
          variant="outline"
          onPress={manejarEnvio}
          style={styles.fullButton}
        >
          <View style={styles.btnContent}>
            <Icon icon={ICONS.save} size={20} color={COLORS.primary} />
            <Text style={styles.btnText}>Registrar movimiento</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}