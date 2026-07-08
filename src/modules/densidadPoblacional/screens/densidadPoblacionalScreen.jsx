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
import Alert from "../../../shared/components/Alert";
import useDensidadPoblacional from "../hooks/useDensidadPoblacional";

export default function DensidadPoblacionalScreen({ onBack }) {
  const {
    finca,
    setFinca,
    estanque,
    setEstanque,
    fecha,
    setFecha,
    showAlert,
    handleGuardar,
    fincas,
    estanques,
  } = useDensidadPoblacional();

  return (
    <>
    <NavbarRegistro
        Titulo="Densidad Poblacional"
        Subtitulo="Registro de conteo"
        Icono="mortality"
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
        />

        <DatosConteo />

        {showAlert && (
          <Alert
            variant="success"
            message="¡Módulo guardado exitosamente!"
            style={{ width: "60%", alignSelf: "center" }}
            textStyle={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          />
        )}
        </View>
        <Footer
          children={
            <Button variant="primary" onPress={handleGuardar} style={styles.addButton}>
              Guardar módulo
            </Button>
          }
          fixedBottom={true}
        />
    </ScrollView>
    </>
  );
}