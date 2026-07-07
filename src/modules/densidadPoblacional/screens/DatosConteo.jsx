/**
 * ============================================================
 * SCREEN DATOSCONTEO
 * ============================================================
 *
 * Envoltorio de presentación (Card + Title) para el formulario
 * de datos de conteo. No contiene lógica de negocio propia:
 * reenvía tal cual todas las props que recibe de su padre
 * (densidadPoblacionalScreen) hacia FormularioConteo.
 *
 * Props principales:
 * - numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro,
 *   sobrevivencia, notasConteo y sus setters.
 * - submitted / errores: estado de validación, reenviados tal
 *   cual a FormularioConteo.
 *
 * Ejemplo:
 * <DatosConteo
 *   numeroCamarones={numeroCamarones}
 *   setNumeroCamarones={setNumeroCamarones}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */

import React from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Title from "../../../shared/components/Title";
import FormularioConteo from "./FormularioConteo";
import { styles } from "../styles/densidadPoblacionalStyles";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function DatosConteo(props) {
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
        <FormularioConteo {...props} />
      </Card>
    </View>
  );
}
