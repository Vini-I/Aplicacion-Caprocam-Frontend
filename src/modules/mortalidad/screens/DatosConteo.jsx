import React from "react";
import Card from "../../../shared/components/Card";
import Title from "../../../shared/components/Title";

import FormularioConteo from "./FormularioConteo";
import { styles } from "../services/mortalidadStyles";

export default function DatosConteo() {
  return (
    <Card>
      <Title style={styles.subTitle}>
        Datos de Conteo
      </Title>

      <FormularioConteo />
    </Card>
  );
}