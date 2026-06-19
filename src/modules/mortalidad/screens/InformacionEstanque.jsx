import React from "react";
import { Text } from "react-native";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import { styles } from "../services/mortalidadStyles";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function InformacionEstanque({
finca, estanque, setFinca, setEstanque, fincas, estanques,
}) {
return (
<Card>
<Text style={[styles.label,{fontFamily:TYPOGRAPHY.fontFamily.medium}]}>
Seleccione la finca
</Text>
  <Select
    placeholder="Seleccione una finca"
    options={fincas}
    value={finca}
    onChange={setFinca}
  />
  <Text style={[styles.label,{fontFamily:TYPOGRAPHY.fontFamily.medium}]}>
    Seleccione el estanque
  </Text>
  <Select
    placeholder="Seleccione un estanque"
    options={estanques}
    value={estanque}
    onChange={setEstanque}
  />
  <Text style={[styles.label,{fontFamily:TYPOGRAPHY.fontFamily.medium}]}>
    Cantidad de siembra por m²
  </Text>
  <Input placeholder="Siembra" />
  <Text style={[styles.label,{fontFamily:TYPOGRAPHY.fontFamily.medium}]}>
    Tamaño del área del estanque
  </Text>
  <Input placeholder="Área" />
</Card>
);
}