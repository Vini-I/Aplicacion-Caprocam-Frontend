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
 * Valida que exista al menos una medición antes de guardar y muestra
 * una alerta de error al final del formulario si falla la validación.
 *
 * ---
 * PROPS
 * ---
 * onBack  fn  — se ejecuta al tocar el botón "Módulos" del header
 *
 * ---
 * RESTRICCIONES
 * ---
 * - El estado no se maneja aquí; delegar siempre a useFisicoQuimica().
 * - Botones normales deben usar variant="outline" salvo excepción aprobada.
 *
 * ---
 * 
 * ---
 * EJEMPLO DE USO
 * ---
 * <FisicoQuimicaScreen onBack={() => setModuloActivo(null)} />
 *
 * Se renderiza desde RegistroScreen.jsx cuando moduloActivo === 'fisicoquimica'.
 */

import { View, ScrollView } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../../shared/components/Button';
import Alert from '../../../shared/components/Alert';
import Card from '../../../shared/components/Card';
import Select from '../../../shared/components/Select';
import Text from '../../../shared/components/Text';
import Footer from '../../../shared/components/Footer';
import Icon from '../../../shared/components/Icons';
import NavbarRegistro from '../../../shared/components/NavbarRegistro';
import RangeCard from '../components/RangeCard';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import useFisicoQuimica from '../hooks/useFisicoQuimica';
import { obtenerLecturasPorEstanque } from '../services/FisicoQuimicaServices';
import { styles } from '../styles/FisicoQuimicaStyles';
import { STYLE } from '../../../theme/style';

export default function FisicoQuimicaScreen({ onBack }) {
  const {
    setLecturasSalinidad,
    setLecturasTemp, setLecturasPh, setLecturasOx,
    mostrarAlerta, mostrarAlertaEdicion,
    alGuardar, alEditar,
  } = useFisicoQuimica();

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [medicionesPorEstanque, setMedicionesPorEstanque] = useState({
    ph: [],
    salinidad: [],
    temperatura: [],
    ox: [],
  });
  const [lecturasPhLocal, setLecturasPhLocal] = useState([]);
  const [lecturasSalinidadLocal, setLecturasSalinidadLocal] = useState([]);
  const [lecturasTempLocal, setLecturasTempLocal] = useState([]);
  const [lecturasOxLocal, setLecturasOxLocal] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLecturasPhLocal(medicionesPorEstanque.ph ?? []);
    setLecturasSalinidadLocal(medicionesPorEstanque.salinidad ?? []);
    setLecturasTempLocal(medicionesPorEstanque.temperatura ?? []);
    setLecturasOxLocal(medicionesPorEstanque.ox ?? []);
  }, [medicionesPorEstanque]);

  const tieneAlgunaMedicion = useMemo(
    () =>
      [
        lecturasPhLocal,
        lecturasSalinidadLocal,
        lecturasTempLocal,
        lecturasOxLocal,
      ].some((arr) => Array.isArray(arr) && arr.length > 0),
    [lecturasPhLocal, lecturasSalinidadLocal, lecturasTempLocal, lecturasOxLocal],
  );

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
    setErrorMessage("");
  };

  const handleEstanqueChange = (value) => {
    setEstanqueSeleccionado(value);
    setErrorMessage("");

    const lecturas = obtenerLecturasPorEstanque(value);
    setMedicionesPorEstanque(
      lecturas ?? { ph: [], salinidad: [], temperatura: [], ox: [] },
    );
  };

  const handlePhChange = (values) => {
    setLecturasPhLocal(values ?? []);
    setLecturasPh(values ?? []);
  };

  const handleSalinidadChange = (values) => {
    setLecturasSalinidadLocal(values ?? []);
    setLecturasSalinidad(values ?? []);
  };

  const handleTempChange = (values) => {
    setLecturasTempLocal(values ?? []);
    setLecturasTemp(values ?? []);
  };

  const handleOxChange = (values) => {
    setLecturasOxLocal(values ?? []);
    setLecturasOx(values ?? []);
  };

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

          <View style={[styles.selectWrapper, styles.selectWrapperFinca]}>
            <View style={styles.selectContainer}>
              <Select
                label="Seleccione la finca *"
                placeholder="Seleccione una finca"
                options={opcionesFincas}
                value={fincaSeleccionada}
                onChange={handleFincaChange}
                containerStyle={styles.selectField}
                labelStyle={[styles.label, styles.selectLabel]}
                selectStyle={submitted && !fincaSeleccionada ? [styles.selectButton, styles.errorInput] :  styles.selectButton}
              />
            </View>
            <View style={styles.selectPlaceholder} />
          </View>

          <View style={[styles.selectWrapper, styles.selectWrapperEstanque]}>
            <View style={styles.selectContainer}>
              <Select
                label="Seleccione el estanque *"
                placeholder="Seleccione un estanque"
                options={estanquesFiltrados}
                value={estanqueSeleccionado}
                onChange={handleEstanqueChange}
                disabled={!fincaSeleccionada}
                containerStyle={styles.selectField}
                labelStyle={[styles.label, styles.selectLabel]}
                selectStyle={submitted && !estanqueSeleccionado ? [styles.selectButton, styles.errorInput] :  styles.selectButton}
              />
            </View>
            <View style={styles.selectPlaceholder} />
          </View>

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
          onChange={handlePhChange}
        />

        <RangeCard
          title="Salinidad" unit="ppt"
          icon={<Icon icon={ICONS.frequency} color={COLORS.primary} size={18} />}
          idealMin={15} idealMax={35}
          sliderMin={0} sliderMax={50}
          step={0.1} decimals={1}
          maxLecturas={2} labelStyle="daynight"
          initialValues={medicionesPorEstanque.salinidad}
          onChange={handleSalinidadChange}
        />

        <RangeCard
          title="Temperatura" unit="°C"
          icon={<Icon icon={ICONS.temperature} color={COLORS.primary} size={18} />}
          idealMin={28} idealMax={30}
          sliderMin={15} sliderMax={45}
          step={0.5} decimals={1}
          maxLecturas={2} labelStyle="daynight"
          initialValues={medicionesPorEstanque.temperatura}
          onChange={handleTempChange}
        />

        <RangeCard
          title="Oxígeno Disuelto" unit="mg/L"
          icon={<Icon icon={ICONS.water} color={COLORS.primary} size={18} />}
          idealMin={5} idealMax={7}
          sliderMin={0} sliderMax={20}
          step={0.1} decimals={1}
          maxLecturas={5} labelStyle="numeric"
          initialValues={medicionesPorEstanque.ox}
          onChange={handleOxChange}
        />

        <View style={{ height: 24 }} />

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
              <Button
                variant="outline"
                onPress={() => {
                  setSubmitted(true);

                  if (!fincaSeleccionada || !estanqueSeleccionado) {
                    setErrorMessage("Selecciona la finca y el estanque antes de guardar.");
                    return;
                  }

                  if (!tieneAlgunaMedicion) {
                    setErrorMessage("Agrega al menos una medición antes de guardar.");
                    return;
                  }

                  setErrorMessage("");
                  alGuardar();
                }}
              >
                Guardar módulo
              </Button>
            </View>
          </View>
        }
      />
    </View>
    </>
    
  );
}