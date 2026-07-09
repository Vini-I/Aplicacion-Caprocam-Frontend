import { ScrollView, View } from "react-native";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";

import CustomAlert from "../../../shared/components/Alert.jsx"; 

import { useFincaEditar } from "../hooks/useFincaEditar.js";
import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/StylesFincaNueva.js";

export default function FincaEditarScreen() {
  const {
    ContentWrapper,
    formulario,
    telefonos,
    errores,
    setErrores,


    actualizarCampo,
    actualizarTelefono,
    agregarTelefono,
    eliminarTelefono,

    registrarFinca,

    isLargeScreen,
  } = useFincaEditar();

  return (
    <>
    <NavbarRegistro
      Titulo="Editar Finca"
      Subtitulo="Finca: Finca La Reina"
      Icono="edit"
    />
    <ScrollView
      style={[styles.container, { paddingHorizontal: isLargeScreen ? 40 : 16 }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ContentWrapper>
        <Card>
          <Text
            style={styles.sectionTitle}
            size={14}
            weight="700"
            color={COLORS.textPrimary}
          >
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
          </View>
        </Card>

        <Card>
          <Text
            style={styles.sectionTitle}
            size={14}
            weight="700"
            color={COLORS.textPrimary}
          >
            CONTACTO
          </Text>
          <View>
            <Input
              label="Propietario / Responsable *"
              value={formulario.propietario}
              onChangeText={(valor) => actualizarCampo("propietario", valor)}
              placeholder="Nombre completo"
            />
          </View>

          <View style={styles.phoneHeader}>
            <Text size={14} weight="600" color={COLORS.textPrimary}>
              Teléfonos
            </Text>
            <Button style={styles.addPhoneButton} onPress={agregarTelefono}>
              {ICONS && ICONS.add ? (
                <Icon icon={ICONS.add} size={18} color={COLORS.black} />
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    color: COLORS.black,
                    fontWeight: "bold",
                  }}
                >
                  +
                </Text>
              )}
            </Button>
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
                <Button
                  style={styles.removePhoneButton}
                  onPress={() => eliminarTelefono(index)}
                >
                  {ICONS && ICONS.delete ? (
                    <Icon icon={ICONS.delete} size={20} color={COLORS.error} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.error,
                        fontWeight: "bold",
                      }}
                    >
                      ✕
                    </Text>
                  )}
                </Button>
              )}
            </View>
          ))}
        </Card>

        <Card>
          <Text
            style={styles.sectionTitle}
            size={14}
            weight="700"
            color={COLORS.textPrimary}
          >
            CARACTERÍSTICAS
          </Text>
          <View>
            <Input
              label="Área total (ha) *"
              value={formulario.areaTotal}
              keyboardType="numeric"
              onChangeText={(valor) => actualizarCampo("areaTotal", valor)}
              placeholder="0.0"
            />
          </View>
          <View>
            <Input
              label="Espejo de agua (ha) *"
              value={formulario.espejoAgua}
              keyboardType="numeric"
              onChangeText={(valor) => actualizarCampo("espejoAgua", valor)}
              placeholder="0.0"
            />
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
    </>
  );
}
