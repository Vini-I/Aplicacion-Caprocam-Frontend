/**
 * FisicoQuimicaScreen
 * Pantalla principal para captura y actualizacion de lecturas fisico-quimicas (pH, salinidad, temperatura, oxigeno).
 * @dependencies - RangeCard, Select, Button, Alert, useFisicoQuimica, FisicoQuimicaStyles
 * @validations - Finca y estanque requeridos marcados con *. Requiere al menos una medicion valida en cualquier parametro.
 * @navigation - Redirige a /registros tras guardar o actualizar exitosamente.
 */

import { View, ScrollView } from 'react-native';
import Button from '../../../shared/components/Button';
import Alert from '../../../shared/components/Alert';
import Card from '../../../shared/components/Card';
import Select from '../../../shared/components/Select';
import Text from '../../../shared/components/Text';
import Icon from '../../../shared/components/Icons';
import NavbarRegistro from '../../../shared/components/NavbarRegistro';
import RangeCard from '../components/RangeCard';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import useFisicoQuimica from '../hooks/useFisicoQuimica';
import { styles } from '../styles/FisicoQuimicaStyles';
import { STYLE } from '../../../theme/style';

export default function FisicoQuimicaScreen({ onBack }) {
  const {
    fincaSeleccionada,
    estanqueSeleccionado,
    medicionesPorEstanque,
    submitted,
    errorMessage,
    tieneMedicionesExistentes,
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
    alEditar,
  } = useFisicoQuimica();

  return (
    <>
      <NavbarRegistro
        Titulo="Físico-Química"
        Subtitulo="Registro de mediciones"
        Icono="chemicalContainer"
      />

      <View style={STYLE.container}>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={STYLE.contentWrapper}>
            <Card style={styles.formCard}>
              <View style={styles.cardHeader}>
                <Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={22} />
                <Text style={styles.cardTitle}>Finca y estanque</Text>
              </View>

              <Select
                label="Seleccione la finca *"
                placeholder="Seleccione una finca"
                options={opcionesFincas}
                value={fincaSeleccionada}
                onChange={handleFincaChange}
                labelStyle={styles.label}
                selectStyle={submitted && !fincaSeleccionada ? styles.errorInput : undefined}
              />

              <Select
                label="Seleccione el estanque *"
                placeholder="Seleccione un estanque"
                options={estanquesFiltrados}
                value={estanqueSeleccionado}
                onChange={handleEstanqueChange}
                disabled={!fincaSeleccionada}
                labelStyle={styles.label}
                selectStyle={submitted && !estanqueSeleccionado ? styles.errorInput : undefined}
              />

              {estanqueSeleccionadoObj && (
                <Text style={styles.estanqueInfo}>
                  Estanque seleccionado: {estanqueSeleccionadoObj.label}
                </Text>
              )}
            </Card>

            <RangeCard
              key={`ph-${estanqueSeleccionado}`}
              title="pH" unit="pH"
              icon={<Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={18} />}
              idealMin={7.5} idealMax={8.5}
              sliderMin={4} sliderMax={10}
              step={0.1} decimals={1}
              maxLecturas={2} labelStyle="daynight"
              initialValues={medicionesPorEstanque.ph}
              onChange={handlePhChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <RangeCard
              key={`salinidad-${estanqueSeleccionado}`}
              title="Salinidad" unit="ppt"
              icon={<Icon icon={ICONS.frequency} color={COLORS.primary} size={18} />}
              idealMin={15} idealMax={35}
              sliderMin={0} sliderMax={50}
              step={0.1} decimals={1}
              maxLecturas={2} labelStyle="daynight"
              initialValues={medicionesPorEstanque.salinidad}
              onChange={handleSalinidadChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <RangeCard
              key={`temperatura-${estanqueSeleccionado}`}
              title="Temperatura" unit="°C"
              icon={<Icon icon={ICONS.temperature} color={COLORS.primary} size={18} />}
              idealMin={28} idealMax={30}
              sliderMin={15} sliderMax={45}
              step={0.5} decimals={1}
              maxLecturas={2} labelStyle="daynight"
              initialValues={medicionesPorEstanque.temperatura}
              onChange={handleTempChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <RangeCard
              key={`oxigeno-${estanqueSeleccionado}`}
              title="Oxígeno Disuelto" unit="mg/L"
              icon={<Icon icon={ICONS.water} color={COLORS.primary} size={18} />}
              idealMin={5} idealMax={7}
              sliderMin={0} sliderMax={20}
              step={0.1} decimals={1}
              maxLecturas={5} labelStyle="numeric"
              initialValues={medicionesPorEstanque.ox}
              onChange={handleOxChange}
              puedeAgregar={puedeAgregarMediciones}
              onIntentoAgregarBloqueado={handleIntentoAgregarSinSeleccion}
            />

            <View style={styles.spacer} />

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
            {tieneMedicionesExistentes ? (
              <Button variant="outline" onPress={alEditar} style={styles.fullButton}>
                <View style={styles.btnContent}>
                  <Icon icon={ICONS.edit} size={20} color={COLORS.primary} />
                  <Text style={styles.btnText}>Actualizar mediciones</Text>
                </View>
              </Button>
            ) : (
              <Button variant="outline" onPress={handleGuardarClick} style={styles.fullButton}>
                <View style={styles.btnContent}>
                  <Icon icon={ICONS.save} size={20} color={COLORS.primary} />
                  <Text style={styles.btnText}>Guardar mediciones</Text>
                </View>
              </Button>
            )}
          </View>
        )}
      </View>
    </>
  );
}