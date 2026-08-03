/**
 * ============================================================
 * PANTALLA DE EDICIÓN DE FINCA
 * ============================================================
 *
 * Permite modificar la información de una finca existente
 * mediante un formulario organizado por secciones.
 *
 * Funcionalidad:
 * - Muestra los datos actuales de la finca seleccionada.
 * - Permite editar información general de la finca.
 * - Permite agregar, modificar y eliminar teléfonos.
 * - Permite actualizar características como área total y espejo de agua.
 * - Muestra mensajes de error cuando existen validaciones pendientes.
 * - Utiliza componentes reutilizables para mantener la estructura visual.
 */
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
import { STYLE } from "../../../theme/style.js";

export default function FincaEditarScreen({ onFinca, id }) {
  const {
    SectionTitle,
    ContentWrapper,
    formulario,
    telefonos,
    errores,
    finca,
    displayErrorMessage,

    actualizarCampo,
    actualizarTelefono,
    agregarTelefono,
    eliminarTelefono,

    registrarFinca,
  } = useFincaEditar({ onFinca, id });

  return (
    <>
      <NavbarRegistro
        Titulo="Editar Finca"
        Subtitulo={finca?.nombreFinca ?? "Cargando..."}
        Icono="edit"
      />
      <ScrollView
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ContentWrapper>
          <Card>
            <SectionTitle icon={ICONS.id} title="IDENTIFICACIÓN" />
            <View style={styles.row}>
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
                <Icon icon={ICONS.edit} size={24} color={COLORS.primary} />
                <Text style={styles.buttonText}>Editar Finca</Text>
              </View>
            </Button>
          </View>
        </ContentWrapper>
      </ScrollView>
    </>
  );
}
