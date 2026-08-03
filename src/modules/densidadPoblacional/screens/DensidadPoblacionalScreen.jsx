/**
 * ============================================================
 * SCREEN DENSIDADPOBLACIONALSCREEN
 * ============================================================
 *
 * Pantalla principal del módulo de Densidad Poblacional.
 * Orquesta useDensidadPoblacional (finca/estanque/fecha, datos
 * de conteo y guardado real) y distribuye submitted/errores a
 * InformacionEstanque, RegistroConteo y DatosConteo/FormularioConteo.
 *
 * Funcionalidad:
 * - Usa NavbarRegistro (header celeste con botón volver) en vez
 *   del Header.jsx compartido, igual que Alimentación y Raleo:
 *   Header.jsx está diseñado para pantallas de login, no para
 *   navegación con botón volver + ruta contextual.
 *
 * - El ícono del NavbarRegistro ya no es "mortality" (el módulo
 *   dejó de llamarse Mortalidad): se usa ICONS.chart, ya
 *   existente en theme/icons.js, para representar conteo/densidad.
 *
 * - El feedback de guardado (éxito, campos incompletos, error de
 *   guardado) se muestra con el componente global Alert de
 *   shared/components/, evitando window.alert() o Alert.alert()
 *   nativos. No se usa Modal: el Alert se renderiza en línea,
 *   dentro de la card, justo arriba del botón Guardar — mismo
 *   patrón visual que FincaCrecimientoScreen (ver captura de
 *   referencia: banner verde "Guarado exitosamente" sobre el
 *   botón). Antes el éxito se mostraba en un Alert aparte, fijo
 *   arriba de toda la pantalla (fuera de la card): se unificó
 *   para que éxito y error usen exactamente el mismo lugar.
 *
 * - Se utiliza scroll automático cuando ocurre un error para que
 *   el usuario pueda visualizar el mensaje generado después de
 *   intentar guardar.
 *
 * - El botón Guardar mantiene la misma estructura visual utilizada
 *   en FincaCrecimientoScreen:
 *      Icono + Texto dentro del Button.
 *
 * Props principales:
 * - onBack: callback opcional de navegación hacia atrás.
 *
 * Ejemplo:
 * <DensidadPoblacionalScreen />
 */

import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";

import Text from "../../../shared/components/Text.jsx";
import DatosConteo from "./DatosConteo";
import InformacionEstanque from "./InformacionEstanque";
import RegistroConteo from "./RegistroConteo";

import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";

import { styles } from "../styles/DensidadPoblacionalStyles";
import { STYLE } from "../../../theme/style";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

import useDensidadPoblacional from "../hooks/useDensidadPoblacional";


export default function DensidadPoblacionalScreen({ onBack }) {

  const scrollRef = useRef(null);


  const {
    finca,
    setFinca,

    estanque,
    setEstanque,

    fecha,
    setFecha,

    fincas,
    estanques,

    submitted,
    errores,

    alerta,
    handleGuardar,

    numeroCamarones,
    setNumeroCamarones,

    tirosAtarraya,
    setTirosAtarraya,

    areaAtarraya,
    setAreaAtarraya,

    promedioPorTiro,
    setPromedioPorTiro,

    supervivencia,
    setSupervivencia,

    notasConteo,
    setNotasConteo,

    siembraPorM2,
    setSiembraPorM2,

    areaEstanque,
    setAreaEstanque,

  } = useDensidadPoblacional();



  // Muestra la alerta (éxito, error o validación) en línea, dentro
  // de la card, junto al resto del formulario: mismo lugar sin
  // importar la variante (antes el éxito se separaba en un Alert
  // fijo arriba de toda la pantalla).
  const mostrarAlertaLocal = alerta.visible;



  // Cuando aparece una alerta (éxito o error),
  // desplaza automáticamente el scroll hacia abajo
  // para mostrar el mensaje al usuario.
  useEffect(() => {

    if (mostrarAlertaLocal) {

      scrollRef.current?.scrollToEnd({
        animated: true,
      });

    }

  }, [mostrarAlertaLocal]);



  return (
    <>

      <NavbarRegistro
        Titulo="Densidad Poblacional"
        Subtitulo="Registro de conteo"
        Icono="chart"
      />



      <View style={[STYLE.container, styles.container]}>


        <ScrollView

          ref={scrollRef}

          contentContainerStyle={[
            STYLE.contentWrapper,
            styles.scrollContent,
          ]}

          showsVerticalScrollIndicator={false}

        >


          <View style={styles.content}>


            <InformacionEstanque

              finca={finca}

              estanque={estanque}

              setFinca={setFinca}

              setEstanque={setEstanque}

              fincas={fincas}

              estanques={estanques}

              siembraPorM2={siembraPorM2}

              setSiembraPorM2={setSiembraPorM2}

              areaEstanque={areaEstanque}

              setAreaEstanque={setAreaEstanque}

              submitted={submitted}

              errores={errores}

            />



            <RegistroConteo

              fecha={fecha}

              cambiarFecha={setFecha}

              submitted={submitted}

              errores={errores}

            />



            <DatosConteo

              numeroCamarones={numeroCamarones}

              setNumeroCamarones={setNumeroCamarones}

              tirosAtarraya={tirosAtarraya}

              setTirosAtarraya={setTirosAtarraya}

              areaAtarraya={areaAtarraya}

              setAreaAtarraya={setAreaAtarraya}

              promedioPorTiro={promedioPorTiro}

              setPromedioPorTiro={setPromedioPorTiro}

              supervivencia={supervivencia}

              setSupervivencia={setSupervivencia}

              notasConteo={notasConteo}

              setNotasConteo={setNotasConteo}

              submitted={submitted}

              errores={errores}

            />



            {/* Alerta en línea: éxito, error o validación, mismo lugar */}
            {mostrarAlertaLocal && (

              <Alert

                variant={alerta.variant}

                message={alerta.mensaje}

                style={styles.alert}

              />

            )}



            {/* 
              Botón Guardar con la misma estructura visual
              utilizada en FincaCrecimientoScreen:
              Icono + texto dentro del Button.
            */}

            <Button

              variant="outline"

              onPress={handleGuardar}

              style={styles.submitButton}

            >

              <View style={styles.buttonContent}>


                <Icon

                  icon={ICONS.save}

                  size={24}

                  color={COLORS.primary}

                />


                <Text style={styles.buttonText}>

                  Registrar Densidad Poblacional

                </Text>


              </View>


            </Button>


          </View>


        </ScrollView>


      </View>


    </>
  );
}