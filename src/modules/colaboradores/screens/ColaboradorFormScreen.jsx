/**
 * ============================================================
 * PANTALLA: ColaboradorFormScreen
 * ============================================================
 * Módulo: Colaboradores
 *
 * Responsabilidad:
 * Pantalla para crear o editar un colaborador. Reutiliza el
 * formulario ColaboradorForm y maneja la carga de datos,
 * validaciones y la navegación.
 *
 * @dependencies - ColaboradorForm, servicios de roles/fincas.
 * @validations  - Las validaciones se delegan en useColaboradorForm.
 * @navigation   - Al guardar exitosamente redirige a la lista de
 *                 colaboradores con un mensaje de éxito en los
 *                 parámetros de la ruta.
 * ============================================================
 */

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
import { useError } from "../../../shared/context/ErrorContext";

export default function ColaboradorFormScreen() {
  const router = useRouter();
  const { id, userRole = "camprocam_admin", fincaId } = useLocalSearchParams();
  const isEditing = !!id;
  const { mostrarError } = useError();

  // ─── Estados del formulario y carga ──────────────────────────
  const [colaborador, setColaborador] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [fincasOptions, setFincasOptions] = useState([]);

  const formRef = useRef();

  // ─── Carga de opciones (roles y fincas) ──────────────────────
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const options = await getRolesOptions();
        setRoleOptions(options);
      } catch {
        setRoleOptions([]);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const loadFincas = async () => {
      try {
        const options = await getFincasOptions();
        setFincasOptions(options);
      } catch {
        setFincasOptions([]);
      }
    };
    loadFincas();
  }, []);

  // ─── Carga de datos del colaborador (si es edición) ──────────
  useEffect(() => {
    if (isEditing) {
      const loadColaborador = async () => {
        try {
          const data = await colaboradoresService.getColaboradorById(id);
          setColaborador(data);
        } catch (err) {
          setError(err.message || "Error al cargar el colaborador");
          mostrarError(err);
        } finally {
          setLoading(false);
        }
      };
      loadColaborador();
    }
  }, [id, isEditing, mostrarError]);

  // ─── Limpieza automática de mensajes de error ──────────────
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // ─── Manejadores ───────────────────────────────────────────────

  const handleSubmit = async (formData) => {
    setErrorMessage("");
    try {
      if (isEditing) {
        await colaboradoresService.updateColaborador(id, formData);
        router.replace({
          pathname: "/(drawer)/colaboradores",
          params: {
            alertType: "success",
            alertMessage: "Colaborador actualizado correctamente.",
          },
        });
      } else {
        await colaboradoresService.createColaborador(formData);
        router.replace({
          pathname: "/(drawer)/colaboradores",
          params: {
            alertType: "success",
            alertMessage: "Colaborador creado correctamente.",
          },
        });
      }
    } catch (err) {
      // Si es un error de validación (400/422), se muestra en el alert local.
      // Otros errores (red, 500) se muestran en el modal.
      const status = err.response?.status;
      if (status === 400 || status === 422) {
        setErrorMessage(err.message || "No se pudo guardar el colaborador.");
      } else {
        // No se muestra en el alert local, solo en el modal.
        mostrarError(err);
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleResetPin = async () => {
    setResetLoading(true);
    setErrorMessage("");
    try {
      await colaboradoresService.resetPin(id);
      // Se muestra el éxito en la lista después de redirigir
      router.replace({
        pathname: "/(drawer)/colaboradores",
        params: {
          alertType: "success",
          alertMessage: "PIN restablecido correctamente.",
        },
      });
    } catch (err) {
      // Para errores de red o del servidor, mostramos solo el modal.
      mostrarError(err);
    } finally {
      setResetLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <Spinner />
      </View>
    );
  }

  // Si hay error de carga, no mostramos el mensaje en la UI (el modal ya lo hizo).
  // Podemos mostrar un estado vacío, pero como es un formulario, mejor mostrar el formulario vacío.
  // Pero si no se pudo cargar el colaborador en edición, redirigimos o mostramos un mensaje.
  if (error && isEditing) {
    // Si es edición y no se pudo cargar, mostramos un mensaje pero el modal ya está.
    // Podemos mostrar un texto simple.
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <CustomText style={{ color: COLORS.error }}>
          No se pudo cargar el colaborador. Intente de nuevo.
        </CustomText>
        <Button variant="outline" onPress={handleCancel} style={{ marginTop: 16 }}>
          Volver
        </Button>
      </View>
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
          roleOptions={roleOptions}
          fincasOptions={fincasOptions}
          onResetPin={handleResetPin}
          resetLoading={resetLoading}
        />
      </ScrollView>
    </>
  );
}