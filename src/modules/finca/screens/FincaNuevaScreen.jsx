/**
 * ============================================================
 * PANTALLA DE REGISTRO DE NUEVA FINCA
 * ============================================================
 *
 * Permite al usuario ingresar la información necesaria para
 * registrar una nueva finca dentro del sistema.
 *
 * Funcionalidad:
 * - Muestra un formulario dividido por secciones de información.
 * - Permite registrar datos generales de la finca.
 * - Permite seleccionar ubicación mediante provincia, cantón y distrito.
 * - Permite agregar múltiples números telefónicos.
 * - Permite ingresar características como área total y espejo de agua.
 * - Muestra alertas cuando existen campos obligatorios sin completar.
 * - Utiliza componentes reutilizables para mantener la estructura visual.
 */
import { ScrollView, View } from "react-native";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import CustomAlert from "../../../shared/components/Alert.jsx";

import { provincias } from "../screens/FincaNuevaData.js";
import { useFincaNueva } from "../hooks/useFincaNueva.js";
import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/StylesFincaNueva.js";
import { STYLE } from "../../../theme/style.js";

export default function FincaNuevaScreen({ onFinca }) {
  const {
    SectionTitle,
    ContentWrapper,
    formulario,
    telefonos,
    errores,
    displayErrorMessage,

    actualizarCampo,
    actualizarTelefono,
    agregarTelefono,
    eliminarTelefono,
    registrarFinca,

    opcionesCantones,
    opcionesDistritos,
  } = useFincaNueva({ onFinca });
  

  return (
    <>
      <NavbarRegistro
        Titulo="Nueva Finca"
        Subtitulo="Registro de finca"
        Icono="add"
      />
      <ScrollView
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ContentWrapper style={STYLE.contentWrapper}>
          <Card>
            <SectionTitle icon={ICONS.id} title="IDENTIFICACIÓN" />
            <View style={styles.row}>
              <View style={styles.column}>
                <Input
                  label="Código CVO *"
                  value={formulario.codigoCBO}
                  onChangeText={(valor) => actualizarCampo("codigoCBO", valor)}
                  placeholder="Ej: CVO-01"
                  style={errores.codigoCBO ? [styles.errorInput] : null}
                />
              </View>
              <View style={styles.column}>
                <Input
                  label="Nombre de la finca *"
                  value={formulario.nombre}
                  onChangeText={(valor) => actualizarCampo("nombre", valor)}
                  placeholder="Ej: Finca El Pacífico"
                  style={errores.nombre ? [styles.errorInput] : null}
                />
              </View>
            </View>
          </Card>

          <Card>
            <SectionTitle icon={ICONS.location} title="UBICACIÓN" />
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
                  selectStyle={errores.provincia ? [styles.errorInput] : null}
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
                  selectStyle={errores.canton ? [styles.errorInput] : null}
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
                  selectStyle={errores.distrito ? [styles.errorInput] : null}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Input
                  label="Otras señas *"
                  value={formulario.otrasSenas}
                  placeholder="Seleccione un distrito"
                  onChangeText={(valor) => actualizarCampo("otrasSenas", valor)}
                  style={errores.otrasSenas ? [styles.errorInput] : null}
                />
              </View>
            </View>
          </Card>

          <Card>
            <SectionTitle icon={ICONS.user} title="CONTACTO" />
            <View>
              <Input
                label="Propietario / Responsable *"
                value={formulario.responsable}
                onChangeText={(valor) => actualizarCampo("responsable", valor)}
                placeholder="Nombre completo"
                style={errores.responsable ? [styles.errorInput] : null}
              />
            </View>

            <View style={styles.phoneHeader}>
              <View style={styles.phoneTitle}>
                <Icon
                  icon={ICONS.phone}
                  size={18}
                  color={COLORS.primary}
                  style={styles.sectionIcon}
                />
                <Text size={14} weight="600" color={COLORS.textPrimary}>
                  Teléfonos
                </Text>
              </View>
              <Button style={styles.addPhoneButton} onPress={agregarTelefono}>
                <Icon icon={ICONS.add} size={18} color={COLORS.black} />
              </Button>
            </View>

            {(telefonos || []).map((telefono, index) => (
              <View key={index} style={styles.phoneRowWrapper}>
                <View style={styles.phoneInputContainer}>
                  <Input
                    label={`Teléfono ${index + 1}`}
                    value={telefono}
                    keyboardType="phone-pad"
                    onChangeText={(valor) => actualizarTelefono(index, valor)}
                    placeholder="8888 8888"
                    style={
                      errores[`telefono${index}`] ? styles.errorInput : null
                    }
                  />
                </View>

                <Button
                  style={styles.removePhoneButton}
                  onPress={() => eliminarTelefono(index)}
                >
                  <Icon icon={ICONS.delete} size={20} color={COLORS.error} />
                </Button>
              </View>
            ))}
          </Card>

          <Card>
            <SectionTitle icon={ICONS.document} title="CARACTERÍSTICAS" />
            <View>
              <Input
                label="Área total (ha) *"
                value={formulario.areaTotal}
                keyboardType="numeric"
                onChangeText={(valor) => actualizarCampo("areaTotal", valor)}
                placeholder="0.0"
                style={errores.areaTotal ? [styles.errorInput] : null}
              />
            </View>
            <View>
              <Input
                label="Espejo de agua (ha) *"
                value={formulario.espejoAgua}
                keyboardType="numeric"
                onChangeText={(valor) => actualizarCampo("espejoAgua", valor)}
                placeholder="0.0"
                style={errores.espejoAgua ? [styles.errorInput] : null}
              />
            </View>
          </Card>

          {displayErrorMessage && (
            <CustomAlert
              variant="danger"
              message={String(displayErrorMessage)}
              containerStyle={[styles.errorAlertContainer]}
              textStyle={[styles.errorAlertItems]}
              style={[styles.errorAlertItems]}
            />
          )}

          <View style={styles.buttonContainer}>
            <Button onPress={registrarFinca} style={styles.saveButton}>
              <View style={styles.buttonContent}>
                <Icon icon={ICONS.save} size={24} color={COLORS.primary} />
                <Text style={styles.buttonText}>Registrar finca</Text>
              </View>
            </Button>
          </View>
        </ContentWrapper>
      </ScrollView>
    </>
  );
}
