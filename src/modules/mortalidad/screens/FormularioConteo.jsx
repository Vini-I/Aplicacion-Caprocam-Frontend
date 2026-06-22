import {React, useState}  from "react";
import { Text } from "react-native";
import Input from "../../../shared/components/Input";
import { styles } from "../styles/mortalidadStyles";
import { useDatosConteo } from "../hooks/useDatosConteo";
import { TYPOGRAPHY } from "../../../theme/typography";
import NumberInput from "../../../shared/components/NumberInput";

export default function FormularioConteo() {
  const [tiros, setTiros] = useState("1");

  const {
    numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro, sobrevivencia, notasConteo,
    setNumeroCamarones, setTirosAtarraya, setAreaAtarraya,
    setPromedioPorTiro, setSobrevivencia, setNotasConteo,} = useDatosConteo();
  return (
    <>
      <Text
        style={[
          styles.label,{fontFamily: TYPOGRAPHY.fontFamily.medium},
        ]}> Total de camarones contados
      </Text>
      <Input
        placeholder="Total de camarones contados"
        value={numeroCamarones}
        onChangeText={setNumeroCamarones}/>
      <NumberInput
        label={<Text style={{fontFamily: TYPOGRAPHY.fontFamily.medium,}}>
        Tiros de atarraya
        </Text>
        }
        value={tiros}
        min={1}
        max={20}
        onChangeText={setTiros}
      />
      <Text
        style={[styles.label,{fontFamily: TYPOGRAPHY.fontFamily.medium},]}
        >Área de la atarraya
      </Text>
      <Input
        value="2.5 metros cuadrados"
        editable={false}/>
      <Text
        style={[styles.label,{fontFamily: TYPOGRAPHY.fontFamily.medium},
        ]}>Promedio por tiro
      </Text>
      <Input
        placeholder="Promedio por tiro"
        value={promedioPorTiro}
        onChangeText={setPromedioPorTiro}/>
      <Text
        style={[styles.label,{fontFamily: TYPOGRAPHY.fontFamily.medium},
        ]}>
        Sobrevivencia
      </Text>
      <Input
        placeholder="Sobrevivencia"
        value={sobrevivencia}
        onChangeText={setSobrevivencia}/>
      <Text
        style={[styles.label,{fontFamily: TYPOGRAPHY.fontFamily.medium},
        ]}>Notas o comentarios del conteo
      </Text>
      <Input
        placeholder="Notas o comentarios del conteo"
        value={notasConteo}
        onChangeText={setNotasConteo}/></>
    );}