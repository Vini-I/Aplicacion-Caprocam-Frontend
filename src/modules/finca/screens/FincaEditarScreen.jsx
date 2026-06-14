import { useState } from "react";
import { Dimensions, ScrollView, View, Pressable } from "react-native";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";

import { provincias, ubicaciones } from "../screens/FincaNuevaData.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/StylesFincaNueva.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export default function FincaEditarScreen() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    otrasSenas: "", 
    propietario: "",
    areaTotal: "",
    largo: "",
    ancho: "",
  });

  const [telefonos, setTelefonos] = useState([""]);
  const [errores, setErrores] = useState({});

  const actualizarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
    if (errores[campo]) {
      setErrores((actual) => ({ ...actual, [campo]: false }));
    }
  };

  const actualizarTelefono = (index, valor) => {
    const nuevosTelefonos = [...telefonos];
    nuevosTelefonos[index] = valor;
    setTelefonos(nuevosTelefonos);
  };

  const agregarTelefono = () => {
    setTelefonos([...telefonos, ""]);
  };

  const eliminarTelefono = (index) => {
    const nuevosTelefonos = telefonos.filter((_, i) => i !== index);
    setTelefonos(nuevosTelefonos);
  };

  const registrarFinca = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) nuevosErrores.nombre = true;
    if (!formulario.otrasSenas.trim()) nuevosErrores.otrasSenas = true;
    if (!formulario.propietario.trim()) nuevosErrores.propietario = true;
    if (!formulario.areaTotal.trim()) nuevosErrores.areaTotal = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    console.log({ ...formulario, telefonos });
  };


  const ContentWrapper = ({ children }) => <View style={styles.contentWrapper}>{children}</View>;

  return (
    <ScrollView
      style={[styles.container, { paddingHorizontal: isLargeScreen ? 40 : 16 }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ContentWrapper>
        <Card>
          <Text style={styles.sectionTitle} size={14} weight="700" color={COLORS.textPrimary}>
            IDENTIFICACIÓN
          </Text>
          <View style={styles.row}>
            
            <View style={styles.column}>
              <Input
                label="Nombre de la finca *"
                value={formulario.nombre}
                onChangeText={(valor) => actualizarCampo("nombre", valor)}
                placeholder="Ej: Finca El Pacífico"
                style={errores.nombre ? { borderColor: COLORS.error, backgroundColor: COLORS.surface } : null}
              />
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle} size={14} weight="700" color={COLORS.textPrimary}>
            CONTACTO
          </Text>
          <View>
            <Input
              label="Propietario / Responsable *"
              value={formulario.propietario}
              onChangeText={(valor) => actualizarCampo("propietario", valor)}
              placeholder="Nombre completo"
              style={errores.propietario ? { borderColor: COLORS.error, backgroundColor: COLORS.surface } : null}
            />
          </View>

          <View style={styles.phoneHeader}>
            <Text size={14} weight="600" color={COLORS.textPrimary}>Teléfonos</Text>
            <Pressable style={styles.addPhoneButton} onPress={agregarTelefono}>
              {ICONS && ICONS.add ? (
                <Icon icon={ICONS.add} size={18} color={COLORS.black} />
              ) : (
                <Text style={{ fontSize: 18, color: COLORS.black, fontWeight: "bold" }}>+</Text>
              )}
            </Pressable>
          </View>

          {(telefonos || []).map((telefono, index) => (
            <View key={index} style={styles.phoneRowWrapper}>
              <View style={{ flex: 1 }}>
                <Input
                  label={`Teléfono ${index + 1}`}
                  value={telefono}
                  keyboardType="phone-pad"
                  onChangeText={(valor) => actualizarTelefono(index, valor)}
                  placeholder="8888 8888"
                />
              </View>
              {index > 0 && (
                <Pressable style={styles.removePhoneButton} onPress={() => eliminarTelefono(index)}>
                  {ICONS && ICONS.delete ? (
                    <Icon icon={ICONS.delete} size={20} color={COLORS.error} />
                  ) : (
                    <Text style={{ fontSize: 16, color: COLORS.error, fontWeight: "bold" }}>✕</Text>
                  )}
                </Pressable>
              )}
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle} size={14} weight="700" color={COLORS.textPrimary}>
            CARACTERÍSTICAS
          </Text>
          <View>
            <Input
              label="Área total (ha) *"
              value={formulario.areaTotal}
              keyboardType="numeric"
              onChangeText={(valor) => actualizarCampo("areaTotal", valor)}
              placeholder="0.0"
              style={errores.areaTotal ? { borderColor: COLORS.error, backgroundColor: COLORS.surface  } : null}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Input
                label="Largo (m)"
                value={formulario.largo}
                keyboardType="numeric"
                onChangeText={(valor) => actualizarCampo("largo", valor)}
                placeholder="0"
              />
            </View>
            <View style={styles.column}>
              <Input
                label="Ancho (m)"
                value={formulario.ancho}
                keyboardType="numeric"
                onChangeText={(valor) => actualizarCampo("ancho", valor)}
                placeholder="0"
              />
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button onPress={registrarFinca} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              {ICONS && ICONS.save ? (
                <Icon icon={ICONS.edit} size={24} color={COLORS.white} />
              ) : null}
              <Text style={styles.buttonText}>Editer Finca</Text>
            </View>
          </Button>
        </View>
      </ContentWrapper>
    </ScrollView>
  );
}