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
 * @navigation   - Botón "Volver" regresa a la lista.
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

export default function ColaboradorFormScreen() {
  const router = useRouter();
  const { id, userRole = "camprocam_admin", fincaId } = useLocalSearchParams();
  const isEditing = !!id;

  // ─── Estados del formulario y carga ──────────────────────────
  const [colaborador, setColaborador] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
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
        } finally {
          setLoading(false);
        }
      };
      loadColaborador();
    }
  }, [id]);

  // ─── Limpieza automática de mensajes ──────────────────────────
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // ─── Manejadores ───────────────────────────────────────────────

  const handleSubmit = async (formData) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      if (isEditing) {
        await colaboradoresService.updateColaborador(id, formData);
        setSuccessMessage("Colaborador actualizado correctamente.");
      } else {
        await colaboradoresService.createColaborador(formData);
        setSuccessMessage("Colaborador creado correctamente.");
        formRef.current?.resetForm();
      }
    } catch (err) {
      setErrorMessage(err.message || "No se pudo guardar el colaborador.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleResetPin = async () => {
    setResetLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await colaboradoresService.resetPin(id);
      setSuccessMessage("PIN restablecido correctamente.");
    } catch (err) {
      setErrorMessage(err.message || "No se pudo restablecer el PIN.");
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
          onResetPin={handleResetPin}
          resetLoading={resetLoading}
        />
      </ScrollView>
    </>
  );
}