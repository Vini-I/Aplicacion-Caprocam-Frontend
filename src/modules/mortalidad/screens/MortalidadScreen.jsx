import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, TouchableOpacity} from "react-native";
import Title from "../../../shared/components/Title";
import DatosConteo from "./DatosConteo";
import InformacionEstanque from "./InformacionEstanque";
import RegistroConteo from "./RegistroConteo";
import { styles } from "../styles/mortalidadStyles"; 
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button";
import Footer from "../../../shared/components/Footer";
import Alert from "../../../shared/components/Alert";
import { useRouter } from "expo-router";

export default function MortalidadScreen({ onBack }) {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [showAlert, setShowAlert] = useState(false);
  const alertTimerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  const handleGuardar = () => {
    setShowAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => {
      setShowAlert(false);
      alertTimerRef.current = null;
      router.replace("/(drawer)/(tabs)/registros"); 

    }, 500);
  };
  
  const fincas = [
    { label: "Finca Norte", value: 1 },
    { label: "Finca Sur", value: 2 },
  ];

  const estanques = [
    { label: "Estanque A", value: 1 },
    { label: "Estanque B", value: 2 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon icon={ICONS.exit} size={20} color={COLORS.white} />
          <Text size={14} color={COLORS.white}>
            Módulos
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Icon icon={ICONS.frequency} size={20} color={COLORS.white} />
          <Title level={4} color={COLORS.white} style={styles.headerTitleText}>
            Mortalidad
          </Title>
        </View>
      </View>
      <Title
        style={[
          styles.subTitle,
          { fontFamily: TYPOGRAPHY.fontFamily.medium }
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
          { fontFamily: TYPOGRAPHY.fontFamily.medium }
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
            textStyle={{ textAlign: "center", fontWeight: "bold" }}
          />
        )}
      <Footer
        children={
          <Button variant="primary" onPress={handleGuardar}>
            Guardar módulo
          </Button>
        }
        fixedBottom={true}
      />
    </ScrollView>
  );
}