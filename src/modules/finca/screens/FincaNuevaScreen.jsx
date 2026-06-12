import { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Text from "../../../shared/components/Text";
import { styles } from "../../finca/styles/StylesFincaNueva";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export default function FincaNuevaScreen() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    codigoInterno: "",
    provincia: "",
    canton: "",
    propietario: "",
    telefono: "",
    areaTotal: "",
  });

  const actualizarCampo = (campo, valor) => {
    setFormulario((datosActuales) => ({
      ...datosActuales,
      [campo]: valor,
    }));
  };

  const registrarFinca = () => {
    console.log("Registrar finca", formulario);
  };

  const ContentWrapper = ({ children }) => (
    <View style={styles.contentWrapper}>{children}</View>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingHorizontal: isLargeScreen ? 40 : 16,
        },
      ]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ContentWrapper>
        <Card>
          <Text tamano="xs" estilo={styles.sectionTitle}>
            IDENTIFICACIÓN
          </Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Input
                label="Nombre de la finca *"
                value={formulario.nombre}
                onChangeText={(valor) => actualizarCampo("nombre", valor)}
                placeholder="Ej: Finca El Pacífico"
              />
            </View>

            <View style={styles.column}>
              <Input
                label="Código interno"
                value={formulario.codigoInterno}
                onChangeText={(valor) =>
                  actualizarCampo("codigoInterno", valor)
                }
                placeholder="Ej: FP-01"
              />
            </View>
          </View>
        </Card>

        <Card>
          <Text tamano="xs" estilo={styles.sectionTitle}>
            UBICACIÓN
          </Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Input
                label="Provincia *"
                value={formulario.provincia}
                onChangeText={(valor) => actualizarCampo("provincia", valor)}
                placeholder="Ej: Guayas"
              />
            </View>

            <View style={styles.column}>
              <Input
                label="Cantón *"
                value={formulario.canton}
                onChangeText={(valor) => actualizarCampo("canton", valor)}
                placeholder="Ej: Machala"
              />
            </View>
          </View>
        </Card>

        <Card>
          <Text tamano="xs" estilo={styles.sectionTitle}>
            CONTACTO
          </Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Input
                label="Propietario / Responsable *"
                value={formulario.propietario}
                onChangeText={(valor) => actualizarCampo("propietario", valor)}
                placeholder="Nombre completo"
              />
            </View>

            <View style={styles.column}>
              <Input
                label="Teléfono"
                value={formulario.telefono}
                onChangeText={(valor) => actualizarCampo("telefono", valor)}
                placeholder="8865 5777"
              />
            </View>
          </View>
        </Card>

        <Card>
          <Text tamano="xs" estilo={styles.sectionTitle}>
            CARACTERÍSTICAS
          </Text>

          <Input
            label="Área total (ha) *"
            value={formulario.areaTotal}
            onChangeText={(valor) => actualizarCampo("areaTotal", valor)}
            placeholder="0.0"
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Registrar finca" onPress={registrarFinca} />
        </View>
      </ContentWrapper>
    </ScrollView>
  );
}
