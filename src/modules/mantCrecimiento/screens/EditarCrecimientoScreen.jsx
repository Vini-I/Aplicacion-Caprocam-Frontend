/**
 * ============================================================
 * PANTALLA EDITAR CRECIMIENTO
 * ============================================================
 * Calco de FincaCrecimientoScreen: misma UI, carga por id y update.
 */

import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../../modules/mantCrecimiento/styles/CrecimientoStyle.js";
import { STYLE } from "../../../theme/style.js";
import Alert from "../../../shared/components/Alert.jsx";
import BadgeLabel from "../../../shared/components/Badge.jsx";
import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Calendario from "../../../shared/components/DateInput.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import NumberInput from "../../../shared/components/NumberInput.jsx";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text.jsx";
import Title from "../../../shared/components/Title.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import useEditarCrecimiento from "../hooks/useEditarCrecimiento.js";

export default function EditarCrecimientoScreen({ registroId }) {
  const router = useRouter();
  const {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoActual,
    fechaRegistro,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque,

    setEstanqueSeleccionado,
    setPesoActual,
    setFechaRegistro,
    handleFincaChange,
    guardarDatos,

    submitted,
    successMessage,
    errorMessage,
    pesoAnteriorLabel,
    mostrarErrorFinca,
    mostrarErrorEstanque,
    mostrarErrorPeso,
    mostrarErrorFecha,
    cargando,
  } = useEditarCrecimiento(registroId, () => {
    router.replace({
      pathname: "/registros/Reporteria",
      params: { alert: "edited" },
    });
  });

  if (!registroId) {
    return (
      <View style={styles.screenContainer}>
        <NavbarRegistro Titulo="Crecimiento" Subtitulo="Editar registro" Icono="growth" />
        <Text style={{ textAlign: "center", marginTop: 24 }}>No se encontró el registro a editar.</Text>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={styles.screenContainer}>
        <NavbarRegistro Titulo="Crecimiento" Subtitulo="Editar registro" Icono="growth" />
        <Text style={{ textAlign: "center", marginTop: 24 }}>Cargando registro...</Text>
      </View>
    );
  }


  return (
    <View style={styles.screenContainer}>
      <NavbarRegistro
        Titulo="Crecimiento"
        Subtitulo="Editar registro"
        Icono="growth"
      />
      <ScrollView
        style={STYLE.container}
        contentContainerStyle={styles.contentScroll}
      >
        <Card style={STYLE.contentWrapper}>
          <View style={styles.headerRow}>
            <Icon
              icon={ICONS.growth}
              size={22}
              color={COLORS.primary}
              style={styles.headerIcon}
            />
            <Text style={styles.cardTitle}>Peso y crecimiento</Text>
          </View>

          <Select
            label="Seleccione la finca *"
            placeholder="Seleccione una finca"
            options={opcionesFincas}
            value={fincaSeleccionada}
            onChange={handleFincaChange}
            selectStyle={mostrarErrorFinca ? styles.inputError : null}
          />

          <Select
            label="Seleccione el estanque *"
            placeholder="Seleccione un estanque"
            options={estanquesFiltrados}
            value={estanqueSeleccionado}
            onChange={setEstanqueSeleccionado}
            disabled={
              estanqueSeleccionado !== "" && estanquesFiltrados.length === 0
            }
            selectStyle={mostrarErrorEstanque ? styles.inputError : null}
          />

          <View style={styles.badgeRow}>
            <BadgeLabel
              label={pesoAnteriorLabel}
              variant="warning"
              style={styles.badgeItem}
            />
          </View>

          <View style={styles.inputColumn}>
            <Calendario
              label="Fecha de registro *"
              value={fechaRegistro}
              onChangeText={setFechaRegistro}
              inputStyle={mostrarErrorFecha ? styles.inputError : null}
            />
            <View>
              <NumberInput
                label="Peso actual (g) *"
                style={[styles.sameInput, mostrarErrorPeso && styles.inputError]}
                value={pesoActual}
                onChangeText={setPesoActual}
                step={0.5}
                min={0}
                max={1000}
              />
            </View>
          </View>

          {submitted && errorMessage ? (
            <Alert variant="danger" message={errorMessage} />
          ) : null}
          {submitted && successMessage ? (
            <Alert variant="success" message={successMessage} />
          ) : null}

          <Button
            variant="outline"
            onPress={guardarDatos}
            style={styles.submitButton}
          >
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={24} color={COLORS.primary} />
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </View>
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}
