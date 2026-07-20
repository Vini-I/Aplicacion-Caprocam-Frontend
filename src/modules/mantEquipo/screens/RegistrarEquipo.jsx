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
 * - Muestra alerta de éxito al guardar correctamente y redirige
 *   a la lista de equipos.
 * - Muestra alerta de error si hay campos incompletos o inválidos,
 *   con mensajes específicos por campo.
 * - Botón "Guardar" (outline) y "Cancelar" (outline) que navega
 *   de vuelta a la lista.
 *
 * Componentes utilizados:
 * - Button, Card, Input, NumberInput, Select, Text, Alert
 * - EquipoFechaInput
 *
 * Dependencias:
 * - useRegistrarEquipo (hook con lógica y estado)
 * - equiposService (para obtener estanques disponibles)
 * - STYLE (estilos globales)
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

const { width } = Dimensions.get('window');
const isLargeScreen = width > 700;

export default function RegistrarEquipoScreen() {
  const router = useRouter();
  const { edit } = useLocalSearchParams();
  const [equipoEdicion, setEquipoEdicion] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(!!edit);

  // Cargar datos del equipo si estamos en modo edición
  useEffect(() => {
    if (edit) {
      const cargarEquipo = async () => {
        try {
          const data = await equiposService.getEquipoById(edit);
          setEquipoEdicion(data);
        } catch (err) {
          setEquipoEdicion(null);
        } finally {
          setCargandoDatos(false);
        }
      };
      cargarEquipo();
    } else {
      setCargandoDatos(false);
    }
  }, [edit]);

  const {
    formulario,
    errores,
    submitted,
    guardando,
    isEditing,
    tiposEquipo,
    estadosEquipo,
    actualizarCampo,
    guardarEquipo,
  } = useRegistrarEquipo(equipoEdicion);

  const [estanquesDisponibles, setEstanquesDisponibles] = useState([]);

useEffect(() => {
  equiposService.getEstanquesDisponibles().then(setEstanquesDisponibles);
}, []);

  // Estado para alertas
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 4000);
  };

  const handleGuardar = async () => {
    try {
      await guardarEquipo();
      showAlert('success', isEditing ? 'Equipo actualizado correctamente.' : 'Equipo registrado correctamente.');
      setTimeout(() => {
        router.replace('/equipos/equipos');
      }, 1500);
    } catch (error) {
      showAlert('danger', error.message || 'Ocurrió un error al guardar el equipo.');
    }
  };

  const handleCancelar = () => {
    router.back();
  };

  const renderError = (mensaje) => {
    if (mensaje && typeof mensaje === 'string' && mensaje.trim().length > 0) {
      return (
        <Text size={12} color={COLORS.error} style={styles.fieldErrorText}>
          {mensaje}
        </Text>
      );
    }
    return null;
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
      style={STYLE.container}
      contentContainerStyle={[
        styles.content,
        isLargeScreen ? styles.contentPaddingLarge : styles.contentPaddingSmall,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={STYLE.contentWrapper}>
        <Card style={styles.card}>
          {/* Número de serie / Identificador - solo lectura en edición */}
          <Input
            label="Número de serie / Identificador *"
            value={formulario.codigoInterno}
            onChangeText={(valor) => actualizarCampo('codigoInterno', valor)}
            placeholder="Ej: EQ-001"
            editable={!isEditing}
            style={submitted && errores.codigoInterno ? styles.invalidField : undefined}
            labelStyle={styles.labelMedium}
          />

          <Input
            label="Nombre del equipo *"
            value={formulario.nombre}
            onChangeText={(valor) => actualizarCampo('nombre', valor)}
            placeholder="Ej: Aireador principal"
            style={submitted && errores.nombre ? styles.invalidField : undefined}
            labelStyle={styles.labelMedium}
          />

          <Input
            label="Descripción *"
            value={formulario.descripcion}
            onChangeText={(valor) => actualizarCampo('descripcion', valor)}
            placeholder="Ej: Aireador de paletas para oxigenación"
            style={submitted && errores.descripcion ? styles.invalidField : undefined}
            labelStyle={styles.labelMedium}
          />

          <Select
            label="Tipo de equipo *"
            value={formulario.tipo}
            onChange={(valor) => actualizarCampo('tipo', valor)}
            options={tiposEquipo}
            placeholder="Seleccione el tipo"
            selectStyle={submitted && errores.tipo ? styles.invalidField : undefined}
            labelStyle={styles.labelMedium}
          />

          <Input
            label="Modelo *"
            value={formulario.modelo}
            onChangeText={(valor) => actualizarCampo('modelo', valor)}
            placeholder="Ej: MX-2000"
            style={submitted && errores.modelo ? styles.invalidField : undefined}
            labelStyle={styles.labelMedium}
          />

          {/* Fecha de instalación - solo lectura en edición */}
          <EquipoFechaInput
            label="Fecha de instalación *"
            value={formulario.fechaInstalacion}
            onChangeText={(valor) => actualizarCampo('fechaInstalacion', valor)}
            placeholder="Seleccione la fecha de instalación"
            editable={!isEditing}
            inputStyle={submitted && errores.fechaInstalacion ? styles.invalidField : undefined}
            labelStyle={styles.labelMedium}
          />
          {renderError(errores.fechaInstalacion)}

          <Input
            label="Función del equipo *"
            value={formulario.funcionEquipo}
            onChangeText={(valor) => actualizarCampo('funcionEquipo', valor)}
            placeholder="Ej: Mantener la oxigenación constante"
            multiline
            style={[
              styles.textArea,
              submitted && errores.funcionEquipo ? styles.invalidField : undefined,
            ]}
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
            label="Estado *"
            value={formulario.estado}
            onChange={(valor) => actualizarCampo('estado', valor)}
            options={estadosEquipo}
            placeholder="Seleccione el estado actual"
            selectStyle={submitted && errores.estado ? styles.invalidField : undefined}
            labelStyle={styles.labelMedium}
          />
        </Card>

        {alert && (
          <View style={styles.alertWrapper}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        {/* Botones: Cancelar y Guardar */}
        <View style={styles.botonesContainer}>

          <Button
            variant="outline"
            onPress={handleGuardar}
            disabled={guardando}
            style={styles.saveButtonOutline}
          >
            <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
            <Text style={styles.saveButtonText}>
              {guardando ? 'Guardando...' : isEditing ? 'Actualizar equipo' : 'Guardar equipo'}
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}