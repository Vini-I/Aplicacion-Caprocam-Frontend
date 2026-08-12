/**
 * ============================================================
 * SCREEN REGISTROALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla alterna de registro de alimentación (sin listado ni
 * estadísticas). Toda la lógica (estado del formulario, validación,
 * guardado vía Alimentacion.service.js y cierre del modal) vive en
 * hooks/useRegistroAlimentacion.js; esta screen solo arma la UI a
 * partir de lo que ese hook retorna.
 *
 * Funcionalidad:
 * - Importa los estilos desde el archivo real AlimentacionStyles.js.
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

import React from "react";
import { View, ScrollView, Pressable } from "react-native";

import useRegistroAlimentacion from "../hooks/useRegistroAlimentacion";
import AlimentacionForm from "../components/AlimentacionForm";

import Text from "../../../shared/components/Text";
import Modal from "../../../shared/components/Modal";
import Alert from "../../../shared/components/Alert";

import { styles } from "../styles/AlimentacionStyles";
import { STYLE } from "../../../theme/style";

export default function RegistroAlimentacionScreen({ navigation }) {
  const {
    form,
    updateField,
    modal,
    handleGuardar,
    cerrarModal,
  } = useRegistroAlimentacion(navigation);

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
