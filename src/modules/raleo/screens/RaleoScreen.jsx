/**
 * ============================================================
 * SCREEN RALEOSCREEN
 * ============================================================
 *
 * Pantalla principal del módulo de Raleo. Orquesta el estado del
 * formulario (useRaleo) y el guardado real del registro.
 *
 * Funcionalidad:
 * - Toda la orquestación (formulario, validación, guardado y
 *   alerta) vive en hooks/useRaleoScreen.js; esta screen solo
 *   arma el layout, conecta el ModalError global y dispara el
 *   scroll automático hacia la alerta cuando aparece (estándar de
 *   alert de error sobre el botón de registrar).
 * - idColaborador se agrega al registro (antes faltaba por
 *   completo: el backend lo exigia como requerido y cada guardado
 *   fallaba con "El campo idColaborador es requerido"). Es
 *   opcional a nivel de columna en la base de datos, pero
 *   useRaleo.js lo valida como obligatorio en la UI, igual que
 *   Crecimiento.
 * - El feedback de éxito y de validación (campos incompletos) se
 *   muestra en línea con el componente global Alert de
 *   shared/components/. Los errores que devuelve el backend al
 *   guardar se muestran aparte, con el ModalError global
 *   (useError().mostrarError, montado en app/_layout.jsx) — no con
 *   el Alert en línea. Ninguno de los dos usa window.alert/
 *   Alert.alert nativos.
 * - `observaciones` no es obligatorio: si el usuario no escribe
 *   nada, useRaleoScreen.js lo completa con "No se realizan
 *   observaciones" antes de persistir el registro.
 * - Usa NavbarRegistro (header celeste con botón volver) en vez
 *   del Header.jsx compartido, igual que Alimentación y Densidad
 *   Poblacional: Header.jsx está diseñado para pantallas de
 *   login, no para navegación con botón volver + ruta contextual.
 *
 * Ejemplo:
 * <RaleoScreen />
 */

import React, { useEffect, useRef } from "react";
import { View, ScrollView } from "react-native";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import RaleoForm from "../components/RaleoForm";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Alert from "../../../shared/components/Alert";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/RaleoStyles";
import { STYLE } from "../../../theme/style";
import useRaleoScreen from "../hooks/useRaleoScreen";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function RaleoScreen() {
  const {
    form,
    updateField,
    porcentajeRaleo,
    biomasaRestante,
    submitted,
    errores,
    alerta,
    handleGuardar,
  } = useRaleoScreen();

  const { mostrarError } = useError();

  const scrollRef = useRef(null);

  useEffect(() => {
    if (alerta.visible) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [alerta.visible]);

  return (
    <>
      <NavbarRegistro
        Titulo="Raleo"
        Subtitulo="Cosecha parcial y densidad"
        Icono="raleo"
      />

      <View style={STYLE.container}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={STYLE.contentWrapper}
          showsVerticalScrollIndicator={false}
        >
          <RaleoForm
            form={form}
            updateField={updateField}
            submitted={submitted}
            errores={errores}
            porcentajeCalculado={porcentajeRaleo}
            biomasaCalculada={biomasaRestante}
          />

          <View style={styles.contenido}>
            <View style={STYLE.contentWrapper}>
              {alerta.visible && (
                <Alert
                  variant={alerta.variant}
                  message={alerta.mensaje}
                  style={styles.alert}
                />
              )}
            </View>
            <Button
              variant="outline"
              onPress={() => handleGuardar()}
              style={styles.submitButton}
            >
              <View style={styles.buttonContent}>
                <Icon icon={ICONS.save} size={24} color={COLORS.primary} />
                <Text style={styles.buttonText}>Registrar Raleo</Text>
              </View>
            </Button>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

