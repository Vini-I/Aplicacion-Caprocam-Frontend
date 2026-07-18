/**
 * ============================================================
 * PANTALLA: ColaboradorFormScreen
 * ============================================================
 * Módulo: Colaboradores
 *
 * Responsabilidad:
 * Pantalla para crear o editar un colaborador. Reutiliza el formulario
 * ColaboradorForm y maneja la navegación y el estado de carga.
 *
 * Datos:
 * - Recibe parámetros: id (opcional), userRole, fincaId.
 * - Carga los datos del colaborador si existe id.
 *
 * Validaciones:
 * - Todas las validaciones se manejan en useColaboradorForm.
 * - Muestra alertas de éxito/error al guardar.
 *
 * Navegación:
 * - Botón "Volver" (NavbarRegistro) regresa a la lista.
 * - Botón "Guardar" dispara el envío y vuelve a la lista.
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import NavbarRegistro from '../../../shared/components/NavbarRegistro';
import ColaboradorForm from '../components/ColaboradorForm';
import Spinner from '../../../shared/components/Spinner';
import CustomText from '../../../shared/components/Text';
import Alert from '../../../shared/components/Alert';

import { STYLE } from '../../../theme/style';
import { COLORS } from '../../../theme/colors';

import { colaboradoresService } from '../services/colaboradoresService';

export default function ColaboradorFormScreen() {
  const router = useRouter();
  const { id, userRole = 'camprocam_admin', fincaId } = useLocalSearchParams();
  const isEditing = !!id;

  const [colaborador, setColaborador] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing) {
      const loadColaborador = async () => {
        try {
          const data = await colaboradoresService.getColaboradorById(id);
          setColaborador(data);
        } catch (err) {
          setError(err.message || 'Error al cargar el colaborador');
        } finally {
          setLoading(false);
        }
      };
      loadColaborador();
    }
  }, [id]);

  // Manejador de envío del formulario
  const handleSubmit = async (formData) => {
    try {
      let result;
      if (isEditing) {
        result = await colaboradoresService.updateColaborador(id, formData);
        setAlert({ type: 'success', message: 'Colaborador actualizado correctamente.' });
      } else {
        result = await colaboradoresService.createColaborador(formData);
        setAlert({ type: 'success', message: 'Colaborador creado correctamente.' });
      }
      // Volver a la lista después de un breve momento para que se vea el alert
      setTimeout(() => router.replace('/(drawer)/colaboradores'), 1500);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'No se pudo guardar el colaborador.' });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[STYLE.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <>
        <NavbarRegistro Titulo="Error" Subtitulo="Cargando colaborador" Icono="user" />
        <View style={[STYLE.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <CustomText style={{ color: COLORS.error }}>{error}</CustomText>
        </View>
      </>
    );
  }

  const initialData = colaborador || {};

  return (
    <>

      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper}>
        {alert && (
          <View style={{ marginBottom: 12 }}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}
        <ColaboradorForm
          initialData={initialData}
          isEditing={isEditing}
          userRole={userRole}
          fincaId={fincaId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </ScrollView>
    </>
  );
}