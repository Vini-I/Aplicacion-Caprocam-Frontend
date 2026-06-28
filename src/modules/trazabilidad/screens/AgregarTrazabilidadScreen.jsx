/**
 * Pantalla: AgregarTrazabilidadScreen
 *
 * Permite registrar un nuevo movimiento de pre-cría a engorde
 * mediante el formulario reutilizable de Trazabilidad.
 *
 * Funcionalidades principales:
 * - Administrar los datos ingresados en el formulario mediante useTrazabilidad.
 * - Validar que los campos obligatorios estén completos y sean correctos.
 * - Mostrar un modal cuando la validación falla.
 * - Registrar el movimiento de forma permanente al confirmar.
 *
 * Componentes utilizados:
 * - Navbar: encabezado de la pantalla.
 * - Alert: aviso de que el registro es histórico e inmutable.
 * - TrazabilidadForm: formulario reutilizable para los datos del movimiento.
 * - Button: acción para registrar el movimiento.
 * - Modal: aviso cuando la validación del formulario falla.
 */
import { View, ScrollView } from "react-native";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import { styles } from "../styles/AgregarTrazabilidadStyle";
import Navbar from "../../../shared/components/Navbar";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import { ICONS } from "../../../theme/icons";

import TrazabilidadForm from "../components/TrazabilidadForm";
import { useTrazabilidad } from "../hooks/useTrazabilidad";

export default function AgregarTrazabilidadScreen() {
  const {
    formData,
    fincas,
    colaboradores,
    estanquesOrigen,
    estanquesDestino,
    modalVisible,
    mensajeError,
    manejarCambio,
    manejarCambioFinca,
    manejarEnvio,
    cerrarModal,
    cerrarFormulario,
    plAutocompletado,
  } = useTrazabilidad();

  return (
    <View style={styles.container}>
      <Navbar
        title=""
        leftContent={
          <View style={styles.headerRowLeft}>
            <Button onPress={cerrarFormulario} style={styles.backButton}>
              <Icon icon={ICONS.back} size={20} style={styles.iconColor} />
            </Button>
            <Title style={styles.title}>Trazabilidad Biológica</Title>
          </View>
        }
        style={styles.header}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.wrapper}>
          <Alert
            variant="info"
            message="Este registro es un hecho histórico: no se puede editar ni borrar una vez guardado."
            style={styles.infoBanner}
            textStyle={{ color: '#FFFFFF' }}
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
          />

          <Button
            onPress={manejarEnvio}
            style={styles.createButton}
          >
            <View style={styles.createButtonContent}>
              <Icon icon={ICONS.save} size={20} style={styles.iconColor} />
              <Text style={styles.createButtonText}>Registrar movimiento</Text>
            </View>
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={cerrarModal}
        closeText="Aceptar"
      >
        <Title level={4} style={styles.modalTitle}>
          No se pudo registrar el movimiento
        </Title>
        <Text style={styles.modalMessage}>{mensajeError}</Text>
      </Modal>
    </View>
  );
}
