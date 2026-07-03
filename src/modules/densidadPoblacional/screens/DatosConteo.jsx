import React from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Title from "../../../shared/components/Title";
import FormularioConteo from "./FormularioConteo";
import { styles } from "../styles/densidadPoblacionalStyles";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function DatosConteo() {
  return (
    <View>
      <Title
        style={[
          styles.subTitle,
          { fontFamily: TYPOGRAPHY.fontFamily.medium }
        ]}
      >
        Datos de Conteo
      </Title>
      <Card>
        <FormularioConteo />
      </Card>
    </View>
  );
}