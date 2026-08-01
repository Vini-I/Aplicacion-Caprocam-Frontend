/**
 * ============================================================
 * SCREEN REGISTROALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla alterna de registro de alimentación (sin listado ni
 * estadísticas): valida el formulario y lo persiste mediante
 * Alimentacion.service.js.
 *
 * Funcionalidad:
 * - Corrige el import de estilos para apuntar al archivo real
 *   AlimentacionStyles.js.
 * - El feedback de guardado (éxito, campos incompletos, error de
 *   guardado) se muestra con los componentes globales Modal +
 *   Alert de shared/components/, en vez de window.alert/
 *   Alert.alert nativos (mismo patrón de AlimentacionScreen.jsx).
 *
 * Nota: esta pantalla no está enrutada actualmente desde
 * src/app/ (ninguna ruta la importa), por lo que no se le aplicó
 * el contrato completo de submitted/asterisco/borde rojo de
 * AlimentacionForm (queda con sus valores por defecto
 * submitted=false); ver resumen final para más detalle.
 *
 * Props principales:
 * - navigation: objeto de navegación (usa navigation.goBack()).
 *
 * Ejemplo:
 * <RegistroAlimentacionScreen navigation={navigation} />
 */
 
import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import useAlimentacionForm from "../hooks/useAlimentacionForm";
import AlimentacionForm from "../components/AlimentacionForm";
import alimentacionService from "../services/Alimentacion.service";
import Text from "../../../shared/components/Text";
import Modal from "../../../shared/components/Modal";
import Alert from "../../../shared/components/Alert";
import { styles } from "../styles/AlimentacionStyles";
import { STYLE } from "../../../theme/style";

export default function RegistroAlimentacionScreen({ navigation }) {
    const { form, updateField, resetForm, validarForm } = useAlimentacionForm();
    const [modal, setModal] = useState({ visible: false, variant: "success", mensaje: "" });

    const handleGuardar = async () => {
        const { valido, errores } = validarForm();
        if (!valido) {
            const lista = Object.values(errores).map(e => `• ${e}`).join('\n');
            setModal({ visible: true, variant: "warning", mensaje: `Por favor complete:\n${lista}` });
            return;
        }
        try {
            await alimentacionService.create(form);
            setModal({ visible: true, variant: "success", mensaje: "Alimentación registrada correctamente" });
        } catch {
            setModal({ visible: true, variant: "danger", mensaje: "No se pudo guardar el registro" });
        }
    };

    const cerrarModal = () => {
        setModal((prev) => ({ ...prev, visible: false }));
        if (modal.variant === "success") {
            resetForm();
            navigation?.goBack();
        }
    };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={STYLE.contentWrapper}>
        <AlimentacionForm form={form} updateField={updateField} />
      </ScrollView>

      <Pressable onPress={handleGuardar} style={styles.btnGuardar}>
        <Text color="white">Guardar módulo</Text>
      </Pressable>

      <Modal visible={modal.visible} onClose={cerrarModal}>
        <Alert
          variant={modal.variant}
          message={modal.mensaje}
          textStyle={{ textAlign: "center" }}
        />
      </Modal>
    </View>
  );
}