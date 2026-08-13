/**
 * ============================================================
 * SCREEN EDITARALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla de edición de un registro de alimentación ya
 * existente. Toda la lógica (carga del registro por id,
 * precarga del formulario, validación y guardado del cambio)
 * vive en hooks/useEditarAlimentacion.js; esta screen solo arma
 * la UI a partir de lo que ese hook retorna.
 *
 * Funcionalidad:
 * - Usa NavbarRegistro (header celeste con botón volver), igual
 *   que el resto de pantallas de edición del proyecto.
 * - Mientras se carga el registro, o si no se recibió registroId,
 *   se muestra un mensaje centrado en vez del formulario.
 * - El feedback de guardado (éxito, campos incompletos o error
 *   del backend) se muestra con el componente Alert de
 *   shared/components/, en el mismo lugar en el que se muestra
 *   en AlimentacionForm/GestionAlimentacion: justo antes del
 *   botón de guardar.
 *
 * Props principales:
 * - registroId: id del registro de alimentación a editar.
 *
 * Ejemplo:
 * <EditarAlimentacionScreen registroId={id} />
 */

import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import useEditarAlimentacionScreen from "../hooks/useEditarAlimentacion";
import AlimentacionForm from "../components/AlimentacionForm";

import Text from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

import { styles } from "../styles/AlimentacionStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

export default function EditarAlimentacionScreen({ registroId }) {
  const router = useRouter();

  const {
    form,
    updateField,
    cargando,
    submitted,
    errores,
    alerta,
    guardando,
    handleGuardar,
  } = useEditarAlimentacionScreen(registroId, () => {
    router.replace({
        pathname: "/registros/Reporteria",
        params: { alert: "edited" },
    });
    });

  if (!registroId) {
    return (
      <View style={styles.screen}>
        <NavbarRegistro Titulo="Alimentación" Subtitulo="Editar registro" Icono="food" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            No se encontró el registro a editar.
          </Text>
        </View>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={styles.screen}>
        <NavbarRegistro Titulo="Alimentación" Subtitulo="Editar registro" Icono="food" />
        <View style={STYLE.contentWrapper}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            Cargando registro...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <NavbarRegistro Titulo="Alimentación" Subtitulo="Editar registro" Icono="food" />
      <View style={STYLE.container}>
        <ScrollView
          style={STYLE.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={STYLE.contentWrapper}>
            <AlimentacionForm
              form={form}
              updateField={updateField}
              submitted={submitted}
              errores={errores}
            />

            {alerta.visible && (
              <Alert
                variant={alerta.variant}
                message={alerta.mensaje}
                style={styles.alert}
              />
            )}

            <Button
              variant="outline"
              onPress={handleGuardar}
              disabled={guardando}
              style={styles.submitButton}
            >
              <View style={styles.buttonContent}>
                <Icon icon={ICONS.save} size={24} color={COLORS.primary} />
                <Text style={styles.buttonText}>
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </Text>
              </View>
            </Button>

            <View style={styles.spacer} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}