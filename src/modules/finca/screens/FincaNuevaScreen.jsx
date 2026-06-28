import { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";

import CustomAlert from "../../../shared/components/Alert.jsx"; 

import { provincias, ubicaciones } from "../screens/FincaNuevaData.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/StylesFincaNueva.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export default function FincaNuevaScreen() {
  const [formulario, setFormulario] = useState({
    codigoInterno: "",
    nombre: "",
    provincia: "",
    canton: "",
    distrito: "",
    otrasSenas: "", 
    propietario: "",
    areaTotal: "",
    espejoAgua: "",
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

    if (!formulario.codigoInterno.trim()) nuevosErrores.codigoInterno = true;
    if (!formulario.nombre.trim()) nuevosErrores.nombre = true;
    if (!formulario.provincia) nuevosErrores.provincia = true;
    if (!formulario.canton) nuevosErrores.canton = true;
    if (!formulario.distrito) nuevosErrores.distrito = true;
    if (!formulario.otrasSenas.trim()) nuevosErrores.otrasSenas = true;
    if (!formulario.propietario.trim()) nuevosErrores.propietario = true;
    if (!formulario.areaTotal.trim()) nuevosErrores.areaTotal = true;
    if (!formulario.espejoAgua.trim()) nuevosErrores.espejoAgua = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    console.log({ ...formulario, telefonos });
  };

  const cantones = formulario.provincia !== "" ? Object.keys(ubicaciones[formulario.provincia] || {}) : [];
  const distritos = formulario.provincia !== "" && formulario.canton !== "" ? ubicaciones[formulario.provincia][formulario.canton] || [] : [];

  const opcionesCantones = cantones.map((canton) => ({ label: canton, value: canton }));
  const opcionesDistritos = distritos.map((distrito) => ({ label: distrito, value: distrito }));

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
  );
}
