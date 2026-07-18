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
 * - El ícono del NavbarRegistro ya no es "mortality" (el módulo
 *   dejó de llamarse Mortalidad): se usa ICONS.chart, ya
 *   existente en theme/icons.js, para representar conteo/densidad.
 * - El feedback de guardado (éxito, campos incompletos, error de
 *   guardado) se muestra con los componentes globales Modal +
 *   Alert de shared/components/, en vez de window.alert/
 *   Alert.alert nativos (mismo patrón de AlimentacionScreen.jsx),
 *   usando el estado `modal` y la función cerrarModal() que
 *   retorna useDensidadPoblacional().
 *
 * Props principales:
 * - onBack: callback opcional de navegación hacia atrás.
 *
 * Ejemplo:
 * <DensidadPoblacionalScreen />
 */

import React, {useState} from "react";
import { ScrollView, View } from "react-native";
import Title from "../../../shared/components/Title";
import DatosConteo from "./DatosConteo";
import InformacionEstanque from "./InformacionEstanque";
import RegistroConteo from "./RegistroConteo";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import { styles } from "../styles/DensidadPoblacionalStyles";
import { STYLE } from "../../../theme/style"
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import Button from "../../../shared/components/Button";
import Footer from "../../../shared/components/Footer";
import useDensidadPoblacional from "../hooks/useDensidadPoblacional";

export default function DensidadPoblacionalScreen({ onBack }) {
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

  return (
<>
    <NavbarRegistro
      Titulo="Densidad Poblacional"
      Subtitulo="Registro de conteo"
      Icono="chart"
    />

<View style={STYLE.container}>
    <View style={STYLE.contentWrapper}>
      {alerta.visible && (
        <Alert
          variant={alerta.variant}
          message={alerta.mensaje}
          style={styles.alert}
        />
      )}
    </View>

    <ScrollView
      contentContainerStyle={STYLE.contentWrapper}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.content}>
        {/* Todo tu contenido actual */}

        <View style={styles.sectionTitleRow}>
          <Icon icon={ICONS.water} size={18} color={COLORS.primary} style={styles.sectionIcon} />
          <Title
            style={[
              styles.subTitle,
              { fontFamily: TYPOGRAPHY.fontFamily.medium },
            ]}
          >
            Finca / Estanque
          </Title>
        </View>

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

        <View style={styles.sectionTitleRow}>
          <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} style={styles.sectionIcon} />
          <Title
            style={[
              styles.subTitle,
              { fontFamily: TYPOGRAPHY.fontFamily.medium },
            ]}
          >
            Registro de Conteo
          </Title>
        </View>

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

        <Footer
          fixedBottom
          children={
            <Button
              variant="outline"
              onPress={handleGuardar}
              style={styles.addButton}
            >
              Guardar módulo
            </Button>
          }
        />
      </View>
    </ScrollView>
  </View>
  </>
  );
}