/**
 * ============================================================
 * PANTALLA EditarFisicoQuimicaScreen
 * ============================================================
 * Calco literal de FisicoQuimicaScreen: misma UI (Selects + RangeCard).
 * Solo cambia el hook (carga por id + update) y textos de edición.
 */
import { useRef, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Card from "../../../shared/components/Card";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import RangeCard from "../components/RangeCard";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import useEditarFisicoQuimica from "../hooks/useEditarFisicoQuimica";
import { styles } from "../styles/FisicoQuimicaStyles";
import { STYLE } from "../../../theme/style";

export default function EditarFisicoQuimicaScreen({ registroId }) {
  const router = useRouter();
  const scrollViewRef = useRef(null);

  const {
    cargando,
    fincaSeleccionada,
    estanqueSeleccionado,
    medicionesPorEstanque,
    submitted,
    errorMessage,
    mensajeExito,
    tieneMedicionesExistentes,
    tieneAlgunaMedicion,
    puedeAgregarMediciones,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    handleFincaChange,
    handleEstanqueChange,
    handlePhChange,
    handleSalinidadChange,
    handleTempChange,
    handleOxChange,
    handleGuardarClick,
    handleIntentoAgregarSinSeleccion,
  } = useEditarFisicoQuimica(registroId, () => {
    router.replace({
      pathname: "/registros/Reporteria",
      params: { alert: "edited" },
    });
  });

  useEffect(() => {
    if (errorMessage || mensajeExito) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [errorMessage, mensajeExito]);

  if (!registroId) {
    return (
      <>
        <NavbarRegistro
          Titulo="Físico-Química"
          Subtitulo="Editar registro"
          Icono="chemicalContainer"
        />
        <View style={STYLE.container}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            No se encontró el registro a editar.
          </Text>
        </View>
      </>
    );
  }

  if (cargando) {
    return (
      <>
        <NavbarRegistro
          Titulo="Físico-Química"
          Subtitulo="Editar registro"
          Icono="chemicalContainer"
        />
        <View style={STYLE.container}>
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            Cargando registro...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Físico-Química"
        Subtitulo="Editar registro"
        Icono="chemicalContainer"
      />

      <View style={STYLE.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={STYLE.contentWrapper}>
            <Card style={styles.formCard}>
              <View style={styles.cardHeader}>
                <Icon
                  icon={ICONS.chemicalContainer}
                  color={COLORS.primary}
                  size={22}
                />
                <Text style={styles.cardTitle}>Finca y estanque</Text>
              </View>

              <Select
                label="Seleccione la finca *"
                placeholder="Seleccione una finca"
                options={opcionesFincas}
                value={fincaSeleccionada}
                onChange={handleFincaChange}
                labelStyle={styles.label}
                selectStyle={
                  submitted && !fincaSeleccionada
                    ? styles.errorInput
                    : undefined
                }
              />

              <Select
                label="Seleccione el estanque *"
                placeholder="Seleccione un estanque"
                options={estanquesFiltrados}
                value={estanqueSeleccionado}
                onChange={handleEstanqueChange}
                disabled={!fincaSeleccionada}
                labelStyle={styles.label}
                selectStyle={
                  submitted && !estanqueSeleccionado
                    ? styles.errorInput
                    : undefined
                }
              />

              {estanqueSeleccionadoObj && (
                <Text style={styles.estanqueInfo}>
                  Estanque seleccionado: {estanqueSeleccionadoObj.label}
                </Text>
              )}
            </Card>

            <RangeCard
              key={`ph-${estanqueSeleccionado}-edit`}
              title="pH"
              unit="pH"
              icon={
                <Icon
                  icon={ICONS.chemicalContainer}
                  color={COLORS.primary}
                  size={18}
                />
              }
              idealMin={7.5}
              idealMax={8.5}
              sliderMin={4}
              sliderMax={10}
              step={0.1}
              decimals={1}
              maxLecturas={2}
              labelStyle="daynight"
              initialValues={medicionesPorEstanque.ph}
              onChange={handlePhChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <RangeCard
              key={`salinidad-${estanqueSeleccionado}-edit`}
              title="Salinidad"
              unit="ppt"
              icon={
                <Icon
                  icon={ICONS.frequency}
                  color={COLORS.primary}
                  size={18}
                />
              }
              idealMin={15}
              idealMax={35}
              sliderMin={0}
              sliderMax={50}
              step={0.1}
              decimals={1}
              maxLecturas={2}
              labelStyle="daynight"
              initialValues={medicionesPorEstanque.salinidad}
              onChange={handleSalinidadChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <RangeCard
              key={`temperatura-${estanqueSeleccionado}-edit`}
              title="Temperatura"
              unit="°C"
              icon={
                <Icon
                  icon={ICONS.temperature}
                  color={COLORS.primary}
                  size={18}
                />
              }
              idealMin={28}
              idealMax={30}
              sliderMin={15}
              sliderMax={45}
              step={0.5}
              decimals={1}
              maxLecturas={2}
              labelStyle="daynight"
              initialValues={medicionesPorEstanque.temperatura}
              onChange={handleTempChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <RangeCard
              key={`ox-${estanqueSeleccionado}-edit`}
              title="Oxígeno disuelto"
              unit="mg/L"
              icon={
                <Icon icon={ICONS.water} color={COLORS.primary} size={18} />
              }
              idealMin={5}
              idealMax={7}
              sliderMin={0}
              sliderMax={20}
              step={0.1}
              decimals={1}
              maxLecturas={5}
              labelStyle="numeric"
              initialValues={medicionesPorEstanque.ox}
              onChange={handleOxChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <View style={styles.spacer} />

            {mensajeExito !== "" && (
              <Alert
                variant="success"
                message={mensajeExito}
                style={styles.errorBanner}
              />
            )}

            {errorMessage !== "" && (
              <Alert
                variant="danger"
                message={errorMessage}
                style={styles.errorBanner}
                textStyle={styles.errorText}
              />
            )}
          </View>
        </ScrollView>

        {Boolean(fincaSeleccionada && estanqueSeleccionado) && (
          <View style={styles.floatingButtonContainer}>
            <Button
              variant="outline"
              onPress={handleGuardarClick}
              style={styles.fullButton}
            >
              <View style={styles.btnContent}>
                <Icon icon={ICONS.edit} size={20} color={COLORS.primary} />
                <Text style={styles.btnText}>Guardar cambios</Text>
              </View>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}
