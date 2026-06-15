import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import Title from "../../../shared/components/Title";
import DatosConteo from "./DatosConteo";
import InformacionEstanque from "./InformacionEstanque";
import RegistroConteo from "./RegistroConteo";
import AccionesMortalidad from "./AccionesMortalidad";
import { styles } from "../services/mortalidadStyles";

export default function MortalidadScreen() {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const fincas = [
    { label: "Finca Norte", value: 1 },
    { label: "Finca Sur", value: 2 },
  ];

  const estanques = [
    { label: "Estanque A", value: 1 },
    { label: "Estanque B", value: 2 },
  ];

  const cambiarFecha = (event, selectedDate) => {
    setMostrarCalendario(false);

    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.caprocamTitle}>MORTALIDAD</Text>

      <Title style={styles.subTitle}>Finca / Estanque</Title>

      <InformacionEstanque
        finca={finca}
        estanque={estanque}
        setFinca={setFinca}
        setEstanque={setEstanque}
        fincas={fincas}
        estanques={estanques}
      />

      <Title style={styles.subTitle}>Registro de Conteo</Title>

      <RegistroConteo
        fecha={fecha}
        mostrarCalendario={mostrarCalendario}
        setMostrarCalendario={setMostrarCalendario}
        cambiarFecha={cambiarFecha}
      />

      <DatosConteo />

      <AccionesMortalidad />
    </ScrollView>
  );
}