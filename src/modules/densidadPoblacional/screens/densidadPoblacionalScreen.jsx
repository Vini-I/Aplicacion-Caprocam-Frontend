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
 * - Ya no usa el componente Alert compartido con un estado
 *   booleano local de éxito: la confirmación de guardado se
 *   muestra con el mismo patrón showAlert (Platform.OS === 'web'
 *   ? window.alert : Alert.alert) usado en Alimentación,
 *   encapsulado dentro de useDensidadPoblacional().handleGuardar.
 *
 * Props principales:
 * - onBack: callback opcional de navegación hacia atrás.
 *
 * Ejemplo:
 * <DensidadPoblacionalScreen />
 */

import React from "react";
import { ScrollView, View } from "react-native";
import Title from "../../../shared/components/Title";
import DatosConteo from "./DatosConteo";
import InformacionEstanque from "./InformacionEstanque";
import RegistroConteo from "./RegistroConteo";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import { styles } from "../styles/densidadPoblacionalStyles";
import { TYPOGRAPHY } from "../../../theme/typography";
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
    handleGuardar,
    numeroCamarones,
    setNumeroCamarones,
    tirosAtarraya,
    setTirosAtarraya,
    areaAtarraya,
    setAreaAtarraya,
    promedioPorTiro,
    setPromedioPorTiro,
    sobrevivencia,
    setSobrevivencia,
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title
          style={[
            styles.subTitle,
            { fontFamily: TYPOGRAPHY.fontFamily.medium },
          ]}
        >
          Finca / Estanque
        </Title>

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

        <Title
          style={[
            styles.subTitle,
            { fontFamily: TYPOGRAPHY.fontFamily.medium },
          ]}
        >
          Registro de Conteo
        </Title>

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
          sobrevivencia={sobrevivencia}
          setSobrevivencia={setSobrevivencia}
          notasConteo={notasConteo}
          setNotasConteo={setNotasConteo}
          submitted={submitted}
          errores={errores}
        />
        </View>
        <Footer
          children={
            <Button variant="outline" onPress={handleGuardar} style={styles.addButton}>
              Guardar módulo
            </Button>
          }
          fixedBottom={true}
        />
    </ScrollView>
    </>
  );
}
