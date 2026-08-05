/**
 * ============================================================
 * PANTALLA: RegistrarEquipo
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Formulario para registrar o editar un equipo en el sistema.
 * Solicita la información necesaria y aplica validaciones
 * con retroalimentación visual (Alert) al usuario.
 *
 * Funcionalidad:
 * - Si recibe el parámetro "edit" en la URL (ej. ?edit=eq-001),
 *   carga los datos del equipo para edición.
 * - Muestra campos para número de serie, nombre, descripción,
 *   tipo, modelo, fecha de instalación, función, estanque
 *   asociado (opcional), horas para mantenimiento y estado.
 * - Valida campos obligatorios al intentar guardar.
 * - Al guardar correctamente, redirige a la lista de equipos, donde se
 *   muestra la alerta de éxito (verde, 3s) arriba de los cards y debajo
 *   del buscador.
 * - Muestra alerta de error (rojo, 6s) si hay campos incompletos o
 *   inválidos, con el mensaje del campo pendiente e informando un campo
 *   a la vez, con ScrollToEnd automático al alert.
 * - Botón "Guardar Equipo" / "Actualizar Equipo" con ícono.
 *
 * @dependencies - Button, Card, Input, NumberInput, Select, Text, Alert, Icon
 * @dependencies - EquipoFechaInput (DateInput compartido)
 * @dependencies - useRegistrarEquipo (hook con lógica y estado)
 * @dependencies - equiposService (para obtener estanques disponibles)
 * @dependencies - STYLE (estilos globales)
 * @validations  - Campos obligatorios: codigoInterno, nombre, descripción,
 *                 tipo, fechaInstalacion, funcionEquipo, estadoOperativo.
 * @navigation   - Al guardar con éxito, redirige a la lista de equipos
 *                 (/equipos/equipos) con la alerta de éxito por parámetros.
 * ============================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import Input from '../../../shared/components/Input';
import NumberInput from '../../../shared/components/NumberInput';
import Select from '../../../shared/components/Select';
import Text from '../../../shared/components/Text';
import Alert from '../../../shared/components/Alert';
import Icon from '../../../shared/components/Icons';

import { COLORS } from '../../../theme/colors';
import { STYLE } from '../../../theme/style';
import { ICONS } from '../../../theme/icons';

import EquipoFechaInput from '../components/EquipoFechaInput';
import { useRegistrarEquipo } from '../hooks/useRegistrarEquipo';
import { equiposService } from '../services/equiposService';
import { styles } from '../styles/RegistrarEquipoStyles';
import { useError } from '../../../shared/context/ErrorContext';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 700;

// Duración del alert de error en esta pantalla según estándares (6 segundos).
// El alert de éxito ya no se muestra aquí: se muestra en la lista de
// equipos tras la redirección (Estándar 2).
const ALERT_DURACION_ERROR = 6000;

export default function RegistrarEquipoScreen() {
  const router = useRouter();
  const { edit } = useLocalSearchParams();
  const { mostrarError } = useError();
  const [equipoEdicion, setEquipoEdicion] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(!!edit);
  const scrollRef = useRef(null);

  // Cargar datos del equipo si estamos en modo edición
  useEffect(() => {
    if (edit) {
      const cargarEquipo = async () => {
        try {
          const data = await equiposService.getEquipoById(edit);
          setEquipoEdicion(data);
        } catch (err) {
          setEquipoEdicion(null);
          mostrarError(err);
        } finally {
          setCargandoDatos(false);
        }
      };
      cargarEquipo();
    } else {
      setCargandoDatos(false);
    }
  }, [edit, mostrarError]);

  const {
    formulario,
    errores,
    submitted,
    guardando,
    isEditing,
    tiposEquipo,
    estadosOperativos,
    actualizarCampo,
    guardarEquipo,
    resetFormulario,
  } = useRegistrarEquipo(equipoEdicion);

  const [estanquesDisponibles, setEstanquesDisponibles] = useState([]);

  useEffect(() => {
    equiposService.getEstanquesDisponibles().then(setEstanquesDisponibles);
  }, []);

  // Estado para alertas (solo errores de validación)
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  const showAlert = (type, message, duracion) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => setAlert(null), duracion);
  };

  const handleGuardar = async () => {
    try {
      await guardarEquipo();
      // Éxito: redirige a la lista de equipos, que muestra la alerta
      // verde arriba de los cards y debajo del buscador (Estándar 2)
      router.replace({
        pathname: '/equipos/equipos',
        params: {
          alertType: 'success',
          alertMessage: isEditing
            ? 'Equipo actualizado correctamente.'
            : 'Equipo registrado correctamente.',
        },
      });
    } catch (error) {
      // Error de validación (campo faltante) se muestra en el formulario
      // Error de red/backend ya se mostró en el modal global, pero mostramos
      // un mensaje local si es un error de validación controlado.
      if (error.message && error.message.includes('obligatorio')) {
        showAlert(
          'danger',
          error.message,
          ALERT_DURACION_ERROR
        );
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        // Ya se mostró el modal global, no mostramos alert adicional
        // para evitar duplicación.
        console.warn('Error no controlado:', error);
      }
    }
  };

  const handleCancelar = () => {
    router.back();
  };

  if (cargandoDatos) {
    return (
      <View style={[STYLE.container, styles.loadingContainer]}>
        <Text>Cargando equipo...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={STYLE.container}
      contentContainerStyle={[
        styles.content,
        isLargeScreen ? styles.contentPaddingLarge : styles.contentPaddingSmall,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={STYLE.contentWrapper}>
        {/* Card con título e ícono representativo del contenido (Estándar 9) */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon icon={ICONS.engine} size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>
              {isEditing ? 'Información del Equipo' : 'Datos del Nuevo Equipo'}
            </Text>
          </View>

          {/* Número de serie / Identificador - solo lectura en edición */}
          <Input
            label="Número de serie / Identificador"
            value={formulario.codigoInterno}
            onChangeText={(valor) => actualizarCampo('codigoInterno', valor)}
            placeholder="Ej: EQ001"
            editable={!isEditing}
            required
            submitted={submitted}
            error={submitted && errores.codigoInterno ? errores.codigoInterno : ''}
            labelStyle={styles.labelMedium}
          />

          <Input
            label="Nombre del equipo"
            value={formulario.nombre}
            onChangeText={(valor) => actualizarCampo('nombre', valor)}
            placeholder="Ej: Aireador principal"
            required
            submitted={submitted}
            error={submitted && errores.nombre ? errores.nombre : ''}
            labelStyle={styles.labelMedium}
          />

          <Input
            label="Descripción"
            value={formulario.descripcion}
            onChangeText={(valor) => actualizarCampo('descripcion', valor)}
            placeholder="Ej: Aireador de paletas para oxigenación"
            required
            submitted={submitted}
            error={submitted && errores.descripcion ? errores.descripcion : ''}
            labelStyle={styles.labelMedium}
          />

          <Select
            label="Tipo de equipo"
            value={formulario.tipo}
            onChange={(valor) => actualizarCampo('tipo', valor)}
            options={tiposEquipo}
            placeholder="Seleccione el tipo"
            required
            submitted={submitted}
            error={submitted && errores.tipo ? errores.tipo : ''}
            labelStyle={styles.labelMedium}
          />

          {/* Fecha de instalación - deshabilitada en edición */}
          <EquipoFechaInput
            label="Fecha de instalación"
            value={formulario.fechaInstalacion}
            onChangeText={(valor) => actualizarCampo('fechaInstalacion', valor)}
            placeholder="Seleccione la fecha de instalación"
            disabled={isEditing}
            required
            submitted={submitted}
            error={submitted && errores.fechaInstalacion ? errores.fechaInstalacion : ''}
            labelStyle={styles.labelMedium}
          />

          <Input
            label="Función del equipo"
            value={formulario.funcionEquipo}
            onChangeText={(valor) => actualizarCampo('funcionEquipo', valor)}
            placeholder="Ej: Mantener la oxigenación constante"
            multiline
            required
            submitted={submitted}
            error={submitted && errores.funcionEquipo ? errores.funcionEquipo : ''}
            style={styles.textArea}
            labelStyle={styles.labelMedium}
          />

          <Select
            label="Estanque asociado"
            value={formulario.estanqueId}
            onChange={(valor) => actualizarCampo('estanqueId', valor)}
            options={estanquesDisponibles}
            placeholder="Seleccione un estanque (opcional)"
            labelStyle={styles.labelMedium}
          />

          <NumberInput
            label="Horas para mantenimiento"
            value={String(formulario.horasMantenimiento ?? '')}
            onChangeText={(valor) => actualizarCampo('horasMantenimiento', valor)}
            min={0}
            max={99999}
            step={1}
            labelStyle={styles.labelMedium}
          />

          <Select
            label="Estado operativo"
            value={formulario.estadoOperativo}
            onChange={(valor) => actualizarCampo('estadoOperativo', valor)}
            options={estadosOperativos}
            placeholder="Seleccione el estado operativo"
            required
            submitted={submitted}
            error={submitted && errores.estadoOperativo ? errores.estadoOperativo : ''}
            labelStyle={styles.labelMedium}
          />
        </Card>

        {alert && (
          <View style={styles.alertWrapper}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        {/* Botón: Guardar / Actualizar Equipo — nomenclatura PascalCase (Estándar 4) */}
        <View style={styles.botonesContainer}>
          <Button
            variant="outline"
            onPress={handleGuardar}
            disabled={guardando}
            style={styles.saveButtonOutline}
          >
            <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
            <Text style={styles.saveButtonText}>
              {guardando ? 'Guardando...' : isEditing ? 'Editar Equipo' : 'Registrar Equipo'}
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}