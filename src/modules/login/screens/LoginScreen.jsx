/**
 * ============================================================
 * PANTALLA: LOGIN (Selección de Turno y Trabajador)
 * ============================================================
 *
 * Esta es la pantalla principal del módulo de login.
 *
 * RESPONSABILIDADES:
 * 1. Mostrar opciones de turnos (Mañana, Tarde, Noche)
 * 2. Permitir seleccionar un turno
 * 3. Mostrar lista de trabajadores disponibles
 * 4. Permitir seleccionar un trabajador
 * 5. Botón "Comenzar turno" para confirmar
 *
 * FLUJO:
 * 1. Al montar: useWorkers obtiene la lista de trabajadores
 * 2. Usuario selecciona un turno (selectedShift state)
 * 3. Usuario selecciona un trabajador (selectedWorker state)
 * 4. Usuario presiona botón - (por ahora solo console.log, después irá a home)
 *
 * ============================================================
 */

import { View, ScrollView } from 'react-native';
import { useState } from 'react';

// Componentes compartidos
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import Title from '../../../shared/components/Title';
import CustomText from '../../../shared/components/Text';
import Images from '../../../shared/components/Images';

// Hook personalizado
import { useWorkers } from '../hooks/useWorkers';

// Componentes internos
import { ShiftButton } from '../components/ShiftButton';
import { WorkerCard } from '../components/WorkerCard';

// Constantes
import { SHIFTS } from '../constants/shifts';
import { LOGIN_MESSAGES } from '../constants/messages';

// Utilidades
import { formatDateInSpanish } from '../utils/dateFormatter';
import { getLoginValidationMessage, isLoginFormValid, getButtonType } from '../utils/loginValidator';

// Estilos
import styles from '../styles/loginStyles';


/**
 * COMPONENTE PRINCIPAL
 *
 * LoginScreen - Pantalla de login con selección de turno y trabajador
 */
export default function LoginScreen( {onLoginSuccess = () => {}} ) {
  // ============ ESTADO ============

  // Obtener trabajadores usando el hook (con loading/error)
  const { workers, loading, error } = useWorkers();

  // Turno seleccionado (null = ninguno seleccionado)
  const [selectedShift, setSelectedShift] = useState(null);

  // Trabajador seleccionado (null = ninguno)
  const [selectedWorker, setSelectedWorker] = useState(null);

  // ============ DATOS DERIVADOS ============

  // Calcular fecha formateada
  const formattedDate = formatDateInSpanish();

  // Determinar si el formulario es válido
  const isFormValid = isLoginFormValid(!!selectedShift, !!selectedWorker);

  // Obtener mensaje de validación
  const validationMessage = getLoginValidationMessage(!!selectedShift, !!selectedWorker);

  // Obtener tipo de botón según validación
  const buttonType = getButtonType(isFormValid);

  // ============ FUNCIONES ============

  /**
   * handleStartShift()
   *
   * Se ejecuta cuando el usuario presiona "Comenzar turno"
   *
   * AHORA: Solo hace console.log (para debug)
   * FUTURO: Navegar a home, guardar sesión, etc.
   */
  const handleStartShift = () => {
    onLoginSuccess();
    // TODO: Navegar a home cuando se implemente navegación
  };

  /**
   * handleSelectShift(shiftId)
   *
   * Manejar cuando el usuario selecciona un turno
   *
   * @param {string} shiftId - El ID del turno seleccionado
   */
  const handleSelectShift = (shiftId) => {
    setSelectedShift(shiftId);
  };

  /**
   * handleSelectWorker(workerId)
   *
   * Manejar cuando el usuario selecciona un trabajador
   *
   * @param {string} workerId - El ID del trabajador
   */
  const handleSelectWorker = (workerId) => {
    setSelectedWorker(workerId);
  };

  // ============ RENDER ============

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER CON NOMBRE DE EMPRESA Y FECHA */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Logo/Icono */}
          <Card backgroundColor="#0079CB">
            <Images Icon={require('../../../assets/shrimp-solid.png')} style={{ width: 50, height: 50 }} />
          </Card>

          <Title level={1} color="#FFFFFF" align="center">
            {LOGIN_MESSAGES.COMPANY_NAME}
          </Title>
          <CustomText
            tamano="sm"
            color="#FFFFFF"
            alineacion="center"
            estilo={styles.date}
          >
            {formattedDate}
          </CustomText>
        </View>
      </View>

      {/* SECCION: SELECCIÓN DE TURNO */}
      <View style={styles.section}>
        <CustomText
          tamano="lg"
          color="#333333"
          alineacion="center"
          estilo={{ fontWeight: 'bold', marginBottom: 5 }}
        >
          {LOGIN_MESSAGES.SHIFT_TITLE}
        </CustomText>
        <CustomText
          tamano="sm"
          color="#0084D1"
          alineacion="center"
          estilo={{ marginBottom: 15 }}
        >
          {LOGIN_MESSAGES.SHIFT_SUBTITLE}
        </CustomText>

        {/* TURNOS - Mostrar los 3 botones */}
        <View style={styles.shiftsContainer}>
          {SHIFTS.map((shift) => (
            <ShiftButton
              key={shift.id}
              shift={shift}
              isSelected={selectedShift === shift.id}
              onPress={() => handleSelectShift(shift.id)}
            />
          ))}
        </View>
      </View>

      {/* SECCION: SELECCIÓN DE TRABAJADOR */}
      <View style={styles.section}>
        <CustomText
          tamano="lg"
          color="#333333"
          alineacion="center"
          estilo={{ fontWeight: 'bold', marginBottom: 5 }}
        >
          {LOGIN_MESSAGES.WORKER_TITLE}
        </CustomText>
        <CustomText
          tamano="sm"
          color="#0084D1"
          alineacion="center"
          estilo={{ marginBottom: 15 }}
        >
          {LOGIN_MESSAGES.WORKER_SUBTITLE}
        </CustomText>

        {/* MOSTRAR ESTADO DE CARGA O ERROR */}
        {loading && (
          <CustomText
            tamano="md"
            color="#666666"
            alineacion="center"
            estilo={{ marginVertical: 20 }}
          >
            {LOGIN_MESSAGES.LOADING}
          </CustomText>
        )}

        {error && (
          <CustomText
            tamano="md"
            color="#DC3545"
            alineacion="center"
            estilo={{ marginVertical: 20 }}
          >
            {LOGIN_MESSAGES.ERROR_PREFIX}
            {error}
          </CustomText>
        )}

        {/* LISTA DE TRABAJADORES */}
        {!loading && !error && (
          <View>
            {workers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                isSelected={selectedWorker === worker.id}
                onPress={() => handleSelectWorker(worker.id)}
              />
            ))}
          </View>
        )}
      </View>

      {/* BOTON: COMENZAR TURNO */}
      <View style={styles.buttonContainer}>
        <View style={styles.startButtonWrapper}>
          <Button
            title={LOGIN_MESSAGES.BUTTON_TEXT}
            onPress={handleStartShift}
            type={buttonType}
          />
        </View>
      </View>

      {/* MENSAJE DE VALIDACIÓN */}
      <View style={styles.validationContainer}>
        <CustomText
          tamano="sm"
          color="#666666"
          alineacion="center"
        >
          {validationMessage}
        </CustomText>
      </View>
    </ScrollView>
  );
}