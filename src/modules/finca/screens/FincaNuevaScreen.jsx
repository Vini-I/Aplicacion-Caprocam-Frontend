import { ScrollView, View } from "react-native";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import CustomAlert from "../../../shared/components/Alert.jsx"; 

import { provincias, ubicaciones } from "../screens/FincaNuevaData.js";
import { useFincaNueva} from "../hooks/useFincaNueva.js"
import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/StylesFincaNueva.js";
import { STYLE } from "../../../theme/style";

export default function FincaNuevaScreen() {
  const {
    ContentWrapper,
    formulario,
    setFormulario,
    telefonos,
    setTelefonos,
    errores,
    setErrores,

    actualizarCampo,
    actualizarTelefono,
    agregarTelefono,
    eliminarTelefono,
    registrarFinca,

    cantones,
    distritos,
    opcionesCantones,
    opcionesDistritos,

    isLargeScreen,
  } = useFincaNueva();

  return (
    <>
    <NavbarRegistro
      Titulo="Nueva Finca"
      Subtitulo="Registro de finca"
      Icono="add"
    />
    <ScrollView
      style={[STYLE.container, { paddingHorizontal: isLargeScreen ? 40 : 16 }]}
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
                label="Código CVO *"
                value={formulario.codigoInterno}
                onChangeText={(valor) => actualizarCampo("codigoInterno", valor)}
                placeholder="Ej: CVO-01"
                style={errores.codigoInterno ? { borderColor: COLORS.error, backgroundColor: COLORS.surface } : null}
              />
            </View>
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
            UBICACIÓN
          </Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Select
                label="Provincia *"
                value={formulario.provincia}
                options={provincias}
                placeholder="Seleccione una provincia"
                onChange={(valor) => {
                  actualizarCampo("provincia", valor);
                  actualizarCampo("canton", "");
                  actualizarCampo("distrito", "");
                }}
                selectStyle={errores.provincia ? { borderColor: COLORS.error, backgroundColor: COLORS.surface } : null}
              />
            </View>
            <View style={styles.column}>
              <Select
                label="Cantón *"
                value={formulario.canton}
                options={opcionesCantones}
                placeholder="Seleccione un cantón"
                disabled={formulario.provincia === ""}
                onChange={(valor) => {
                  actualizarCampo("canton", valor);
                  actualizarCampo("distrito", "");
                }}
                selectStyle={errores.canton ? { borderColor: COLORS.error, backgroundColor: COLORS.surface } : null}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Select
                label="Distrito *"
                value={formulario.distrito}
                options={opcionesDistritos}
                placeholder="Seleccione un distrito"
                disabled={formulario.canton === ""}
                onChange={(valor) => actualizarCampo("distrito", valor)}
                selectStyle={errores.distrito ? { borderColor: COLORS.error, backgroundColor: COLORS.surface } : null}
              />
            </View>
          </View>

          <View style={styles.fullWidthRow}>
            <Input
              label="Otras señas *"
              value={formulario.otrasSenas}
              onChangeText={(valor) => actualizarCampo("otrasSenas", valor)}
              placeholder="Ej: 200m norte de la escuela central, portón negro"
              multiline={true}
              style={errores.otrasSenas ? { borderColor: COLORS.error, backgroundColor: COLORS.surface  } : null}
            />
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
            <Button style={styles.addPhoneButton} onPress={agregarTelefono}>
              {ICONS && ICONS.add ? (
                <Icon icon={ICONS.add} size={18} color={COLORS.black} />
              ) : (
                <Text style={{ fontSize: 18, color: COLORS.black, fontWeight: "bold" }}>+</Text>
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
                <Button style={styles.removePhoneButton} onPress={() => eliminarTelefono(index)}>
                  {ICONS && ICONS.delete ? (
                    <Icon icon={ICONS.delete} size={20} color={COLORS.error} />
                  ) : (
                    <Text style={{ fontSize: 16, color: COLORS.error, fontWeight: "bold" }}>✕</Text>
                  )}
                </Button>
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
          <View>
            <Input
              label="Espejo de agua (ha) *"
              value={formulario.espejoAgua}
              keyboardType="numeric"
              onChangeText={(valor) => actualizarCampo("espejoAgua", valor)}
              placeholder="0.0"
              style={errores.espejoAgua ? { borderColor: COLORS.error, backgroundColor: COLORS.surface  } : null}
            />
          </View>
        </Card>

        {Object.keys(errores).length > 0 && (
        <CustomAlert 
          variant="danger" 
          message="Rellene los espacios importantes para continuar." 
          containerStyle={{ alignItems: "center", justifyContent: "center", width: "100%" }}
          textStyle={{ textAlign: "center", width: "100%" }}
          style={{ textAlign: "center", width: "100%" }}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={registrarFinca} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              {ICONS && ICONS.save ? (
                <Icon icon={ICONS.save} size={24} color={COLORS.white} />
              ) : null}
              <Text style={styles.buttonText}>Registrar finca</Text>
            </View>
          </Button>
        </View>
      </ContentWrapper>
    </ScrollView>
    </>
  );
}
