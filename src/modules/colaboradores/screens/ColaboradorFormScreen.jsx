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
 * - Botón "Guardar" dispara el envío y NO navega; se queda en la pantalla.
 * ============================================================
 */
// src/modules/colaboradores/screens/ColaboradorFormScreen.jsx

import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import ColaboradorForm from "../components/ColaboradorForm";
import Spinner from "../../../shared/components/Spinner";
import CustomText from "../../../shared/components/Text";

import { STYLE } from "../../../theme/style";
import { COLORS } from "../../../theme/colors";

import { colaboradoresService } from "../services/colaboradoresService";
import { getRolesOptions } from "../services/rolesService";
import { getFincasOptions } from "../services/fincaService";

export default function ColaboradorFormScreen() {
  const router = useRouter();
  const { id, userRole = "camprocam_admin", fincaId } = useLocalSearchParams();
  const isEditing = !!id;

  const [colaborador, setColaborador] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [fincasOptions, setFincasOptions] = useState([]);

  const formRef = useRef();

  // Cargar roles disponibles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const options = await getRolesOptions();
        setRoleOptions(options);
      } catch (err) {
        setRoleOptions([]);
      }
    };
    loadRoles();
  }, []);

  // Cargar fincas disponibles
  useEffect(() => {
    const loadFincas = async () => {
      try {
        const options = await getFincasOptions();
        setFincasOptions(options);
      } catch (err) {
        setFincasOptions([]);
      }
    };
    loadFincas();
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing) {
      const loadColaborador = async () => {
        try {
          const data = await colaboradoresService.getColaboradorById(id);
          setColaborador(data);
        } catch (err) {
          setError(err.message || "Error al cargar el colaborador");
        } finally {
          setLoading(false);
        }
      };
      loadColaborador();
    }
  }, [id]);

  // Limpiar mensajes después de 3 segundos (estándar 2)
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (formData) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      if (isEditing) {
        await colaboradoresService.updateColaborador(id, formData);
        setSuccessMessage("Colaborador actualizado correctamente.");
        // En edición, no limpiamos el formulario para no perder los cambios
      } else {
        await colaboradoresService.createColaborador(formData);
        setSuccessMessage("Colaborador creado correctamente.");
        // Limpiar formulario para agregar otro colaborador
        formRef.current?.resetForm();
      }
    } catch (err) {
      setErrorMessage(err.message || "No se pudo guardar el colaborador.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <>
        <NavbarRegistro Titulo="Error" Subtitulo="Cargando colaborador" Icono="user" />
        <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
          <CustomText style={{ color: COLORS.error }}>{error}</CustomText>
        </View>
      </>
    );
  }

  const initialData = colaborador || {};

  return (
    <>
      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper}>
        <ColaboradorForm
          ref={formRef}
          initialData={initialData}
          isEditing={isEditing}
          userRole={userRole}
          fincaId={fincaId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          serverError={errorMessage}
          successMessage={successMessage}
          roleOptions={roleOptions}
          fincasOptions={fincasOptions}
        />
      </ScrollView>
    </>
  );
}