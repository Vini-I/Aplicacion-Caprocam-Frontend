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

import React from "react";
import { useRouter } from "expo-router";
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

import useEditarDensidad from "../hooks/useEditarDensidad";
import useScrollAlAparecerAlerta from "../hooks/useScrollAlAparecerAlerta";

export default function EditarDensidadScreen({ registroId }) {
  const router = useRouter();

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
    errorCatalogos,
    cargandoDatosBase,
    handleGuardar,
    cargando,

    // Tiros de atarraya: la lista es la fuente de verdad.
    tiros,
    setTiro,
    agregarTiro,
    eliminarTiro,
    setCantidadTiros,
    maxTiros,

    // Calculados, solo para mostrar
    numeroCamarones,
    areaMuestreadaTexto,
    promedioPorTiroTexto,
    densidadPorM2Texto,
    poblacionTotalTexto,

    areaAtarraya,
    setAreaAtarraya,

    supervivencia,

    notasConteo,
    setNotasConteo,

    siembraPorM2,
    setSiembraPorM2,

    areaEstanque,
    setAreaEstanque,
  } = useEditarDensidad(registroId, () => {
    router.replace({
      pathname: "/registros/Reporteria",
      params: { alert: "edited" },
    });
  });

  const mostrarAlertaLocal = alerta.visible || !!errorCatalogos;
  const mensajeAlerta = alerta.visible ? alerta.mensaje : errorCatalogos || "";
  const varianteAlerta = alerta.visible ? alerta.variant : "danger";

  const scrollRef = useScrollAlAparecerAlerta(mostrarAlertaLocal);

  if (!registroId) {
    return (
      <>
        <NavbarRegistro
          Titulo="Densidad Poblacional"
          Subtitulo="Editar registro"
          Icono="chart"
        />
        <Text style={{ textAlign: "center", marginTop: 24 }}>
          No se encontró el registro a editar.
        </Text>
      </>
    );
  }

  if (cargando) {
    return (
      <>
        <NavbarRegistro
          Titulo="Densidad Poblacional"
          Subtitulo="Editar registro"
          Icono="chart"
        />
        <Text style={{ textAlign: "center", marginTop: 24 }}>
          Cargando registro...
        </Text>
      </>
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Densidad Poblacional"
        Subtitulo="Registro de conteo"
        Icono="chart"
      />

      <View style={STYLE.container}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[STYLE.contentWrapper, styles.scrollContent]}
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
              cargandoDatosBase={cargandoDatosBase}
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
              tiros={tiros}
              setTiro={setTiro}
              agregarTiro={agregarTiro}
              eliminarTiro={eliminarTiro}
              setCantidadTiros={setCantidadTiros}
              maxTiros={maxTiros}
              areaAtarraya={areaAtarraya}
              setAreaAtarraya={setAreaAtarraya}
              numeroCamarones={numeroCamarones}
              areaMuestreadaTexto={areaMuestreadaTexto}
              promedioPorTiroTexto={promedioPorTiroTexto}
              densidadPorM2Texto={densidadPorM2Texto}
              poblacionTotalTexto={poblacionTotalTexto}
              supervivencia={supervivencia}
              notasConteo={notasConteo}
              setNotasConteo={setNotasConteo}
              submitted={submitted}
              errores={errores}
            />

            {/* Alerta en línea: éxito, error o validación, mismo lugar */}
            {mostrarAlertaLocal && (
              <Alert
                variant={varianteAlerta}
                message={mensajeAlerta}
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
                <Icon icon={ICONS.save} size={24} color={COLORS.primary} />

                <Text style={styles.buttonText}>Guardar cambios</Text>
              </View>
            </Button>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
