/**
 * ============================================================
 * PANTALLA FÍSICO-QUÍMICA
 * ============================================================
 *
 * Agrupa las 4 mediciones físico-químicas del módulo de agua
 * (pH, salinidad, temperatura, oxígeno disuelto) usando el
 * componente RangeCard.
 *
 * El estado (lecturas, alertas, navegación al guardar) vive en
 * useFisicoQuimica(). Los estilos viven en FisicoQuimicaStyles.js.
 *
 * ---
 * PROPS
 * ---
 * onBack  fn  — se ejecuta al tocar el botón "Módulos" del header
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * <FisicoQuimicaScreen onBack={() => setModuloActivo(null)} />
 *
 * Se renderiza desde RegistroScreen.jsx cuando moduloActivo === 'fisicoquimica'.
 */

import { View, ScrollView, StatusBar } from 'react-native';
import { useMemo, useState } from 'react';
import Button from '../../../shared/components/Button';
import Alert from '../../../shared/components/Alert';
import Card from '../../../shared/components/Card';
import Select from '../../../shared/components/Select';
import Text from '../../../shared/components/Text';
import Title from '../../../shared/components/Title';
import Footer from '../../../shared/components/Footer';
import Icon from '../../../shared/components/Icons';
import RangeCard from '../components/RangeCard';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import useFisicoQuimica from '../hooks/useFisicoQuimica';
import { obtenerLecturasPorEstanque } from '../services/FisicoQuimicaServices';
import { styles } from '../styles/FisicoQuimicaStyles';
import { useRouter } from 'expo-router';

export default function FisicoQuimicaScreen({ onBack }) {
  const {
    setLecturasSalinidad,
    setLecturasTemp, setLecturasPh, setLecturasOx,
    mostrarAlerta, mostrarAlertaEdicion,
    alGuardar, alEditar,
  } = useFisicoQuimica();

  const router = useRouter();
  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [medicionesPorEstanque, setMedicionesPorEstanque] = useState({
    ph: [],
    salinidad: [],
    temperatura: [],
    ox: [],
  });

  const opcionesFincas = useMemo(
    () => [
      { label: "Finca Camarón de Occidente", value: "laReina" },
      { label: "Finca Camarón del Sur", value: "laEsperanza" },
      { label: "Finca Camarón del Norte", value: "laVilla" },
    ],
    [],
  );

  const estanquesPorFinca = useMemo(
    () => ({
      laReina: [
        { label: "Estanque P-01 (Pre-cría)", value: "A01" },
        { label: "Estanque P-02 (Pre-cría)", value: "A02" },
        { label: "Estanque E-08 (Engorde)", value: "B01" },
        { label: "Estanque E-09 (Engorde)", value: "B02" },
      ],
      laEsperanza: [
        { label: "Estanque P-03 (Pre-cría)", value: "P-03" },
        { label: "Estanque E-02 (Engorde)", value: "E-02" },
        { label: "Estanque E-03 (Engorde)", value: "E-03" },
      ],
      laVilla: [
        { label: "Estanque P-04 (Pre-cría)", value: "P-04" },
        { label: "Estanque E-05 (Engorde)", value: "E-05" },
      ],
    }),
    [],
  );

  const estanquesFiltrados = useMemo(
    () => estanquesPorFinca[fincaSeleccionada] || [],
    [fincaSeleccionada, estanquesPorFinca],
  );

  const estanqueSeleccionadoObj = useMemo(
    () =>
      estanquesFiltrados.find((item) => item.value === estanqueSeleccionado) || null,
    [estanqueSeleccionado, estanquesFiltrados],
  );

  const handleFincaChange = (value) => {
    setFincaSeleccionada(value);
    setEstanqueSeleccionado("");
    setMedicionesPorEstanque({ ph: [], salinidad: [], temperatura: [], ox: [] });
  };

  const handleEstanqueChange = (value) => {
    setEstanqueSeleccionado(value);

    const lecturas = obtenerLecturasPorEstanque(value);
    setMedicionesPorEstanque(
      lecturas ?? { ph: [], salinidad: [], temperatura: [], ox: [] },
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Button onPress={() => router.back()} style={styles.backBtn}>
          <Icon icon={ICONS.exit} size={20} color={COLORS.white} />
          <Text size={14} color={COLORS.white}>Módulos</Text>
        </Button>

        <View style={styles.headerTitle}>
          <Icon icon={ICONS.chemicalContainer} size={20} color={COLORS.white} />
          <Title level={4} color={COLORS.white} style={styles.headerTitleText}>
            Físico-Química
          </Title>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={22} />
            <Text style={styles.cardTitle}>Finca y estanque</Text>
          </View>

          <Select
            label="Seleccione la finca"
            placeholder="Seleccione una finca"
            options={opcionesFincas}
            value={fincaSeleccionada}
            onChange={handleFincaChange}
          />

          <Select
            label="Seleccione el estanque"
            placeholder="Seleccione un estanque"
            options={estanquesFiltrados}
            value={estanqueSeleccionado}
            onChange={handleEstanqueChange}
            disabled={!fincaSeleccionada}
          />

          {estanqueSeleccionadoObj && (
            <Text style={styles.estanqueInfo}>
              Estanque seleccionado: {estanqueSeleccionadoObj.label}
            </Text>
          )}
        </Card>

        <RangeCard
          title="pH" unit="pH"
          icon={<Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={18} />}
          idealMin={7.5} idealMax={8.5}
          sliderMin={4} sliderMax={10}
          step={0.1} decimals={1}
          maxLecturas={2} labelStyle="daynight"
          initialValues={medicionesPorEstanque.ph}
          onChange={setLecturasPh}
        />

        <RangeCard
          title="Salinidad" unit="ppt"
          icon={<Icon icon={ICONS.frequency} color={COLORS.primary} size={18} />}
          idealMin={15} idealMax={35}
          sliderMin={0} sliderMax={50}
          step={0.1} decimals={1}
          maxLecturas={2} labelStyle="daynight"
          initialValues={medicionesPorEstanque.salinidad}
          onChange={setLecturasSalinidad}
        />

        <RangeCard
          title="Temperatura" unit="°C"
          icon={<Icon icon={ICONS.temperature} color={COLORS.primary} size={18} />}
          idealMin={28} idealMax={30}
          sliderMin={15} sliderMax={45}
          step={0.5} decimals={1}
          maxLecturas={2} labelStyle="daynight"
          initialValues={medicionesPorEstanque.temperatura}
          onChange={setLecturasTemp}
        />

        <RangeCard
          title="Oxígeno Disuelto" unit="mg/L"
          icon={<Icon icon={ICONS.water} color={COLORS.primary} size={18} />}
          idealMin={5} idealMax={7}
          sliderMin={0} sliderMax={20}
          step={0.1} decimals={1}
          maxLecturas={5} labelStyle="numeric"
          initialValues={medicionesPorEstanque.ox}
          onChange={setLecturasOx}
        />

        <View style={{ height: 24 }} />
      </ScrollView>

      <Footer
        fixedBottom
        children={
          <View style={styles.footerContent}>
            <View>
              {mostrarAlerta && (
                <Alert variant="success" message="¡Módulo guardado exitosamente!" style={styles.alertBox} textStyle={styles.alertText} />
              )}
              {mostrarAlertaEdicion && (
                <Alert variant="success" message="¡Módulo actualizado exitosamente!" style={styles.alertBox} textStyle={styles.alertText} />
              )}
            </View>

            <View style={styles.footerActions}>
              <Button variant="outline" onPress={alEditar}>Actualizar módulo</Button>
              <Button variant="primary" onPress={alGuardar}>Guardar módulo</Button>
            </View>
          </View>
        }
      />
    </View>
  );
}