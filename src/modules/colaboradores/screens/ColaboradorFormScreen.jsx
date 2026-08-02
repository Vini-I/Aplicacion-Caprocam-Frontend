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
// src/modules/colaboradores/screens/ColaboradorFormScreen.jsx

import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import ColaboradorForm from "../components/ColaboradorForm";
import Spinner from "../../../shared/components/Spinner";
import CustomText from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";

import { STYLE } from "../../../theme/style";
import { COLORS } from "../../../theme/colors";

import { colaboradoresService } from "../services/colaboradoresService";
import { getRolesOptions } from "../services/rolesService";
import { getFincasOptions } from "../services/fincaService"; // <-- NUEVO

export default function ColaboradorFormScreen() {
  const router = useRouter();
  const { id, userRole = "camprocam_admin", fincaId } = useLocalSearchParams();
  const isEditing = !!id;

  const [colaborador, setColaborador] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [fincasOptions, setFincasOptions] = useState([]); // <-- NUEVO

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

  const handleSubmit = async (formData) => {
    setAlert(null);
    try {
      if (isEditing) {
        await colaboradoresService.updateColaborador(id, formData);
        setAlert({ type: "success", message: "Colaborador actualizado correctamente." });
        setTimeout(() => router.replace("/(drawer)/colaboradores"), 1500);
      } else {
        await colaboradoresService.createColaborador(formData);
        setAlert({ type: "success", message: "Colaborador creado correctamente." });
        setTimeout(() => router.replace("/(drawer)/colaboradores"), 1500);
      }
    } catch (err) {
      setAlert({ type: "danger", message: err.message || "No se pudo guardar el colaborador." });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const serverError = alert && alert.type === "danger" ? alert.message : "";

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
        {alert && alert.type === "success" && (
          <View style={{ marginBottom: 12 }}>
            <Alert variant="success" message={alert.message} />
          </View>
        )}
        <ColaboradorForm
          initialData={initialData}
          isEditing={isEditing}
          userRole={userRole}
          fincaId={fincaId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          serverError={serverError}
          roleOptions={roleOptions}
          fincasOptions={fincasOptions} // <-- PASAMOS LAS FINCAS
        />
      </ScrollView>
    </>
  );
}