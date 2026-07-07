import {React, useState} from "react";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import { View, Text, Pressable, } from "react-native";
import { styles } from "../styles/densidadPoblacionalStyles";
import { TYPOGRAPHY } from "../../../theme/typography";
import DateInput from "../../../shared/components/DateInput";
import Icon from "../../../shared/components/Icons";

export default function RegistroConteo({
}) {
  const [fecha, setFecha]= useState ("");
  return (
    <Card>
      <Text
        size={14}
        weight="600"
        style={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
      >
      </Text>
      <DateInput
        label= "Fecha de Registro"
        value= {fecha}
        onChangeText={setFecha}
        allowFutureDates={true}
      />
      <Text
        size={14}
        weight="600"
        style={[
          styles.label,
          { fontFamily: TYPOGRAPHY.fontFamily.medium }
        ]}
      >
        Método de conteo
      </Text>
      <Input
        value="Directo"
        editable={false}
      />
    </Card>
  );
}