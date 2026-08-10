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
 * @dependencies - ColaboradorForm, servicios de fincas.
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
import Button from "../../../shared/components/Button";

import { STYLE } from "../../../theme/style";
import { COLORS } from "../../../theme/colors";

import { colaboradoresService } from "../services/colaboradoresService";
import { getFincasOptions } from "../services/fincaService";
import { useError } from "../../../shared/context/ErrorContext";
import { styles } from "../styles/colaboradorFormStyles";

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
  const [fincasOptions, setFincasOptions] = useState([]);

  const formRef = useRef();

  // ─── Carga de opciones (fincas) ──────────────────────────────
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
      const status = err.response?.status;
      if (status === 400 || status === 422) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message);
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // ─── Render ────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[STYLE.container, styles.centeredContainer]}>
        <Spinner />
      </View>
    );
  }

  if (error && isEditing) {
    return (
      <View style={[STYLE.container, styles.centeredContainer]}>
        <CustomText style={{ color: COLORS.error }}>
          No se pudo cargar el colaborador. Intente de nuevo.
        </CustomText>
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
          fincaId={fincaId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          serverError={errorMessage}
          fincasOptions={fincasOptions}
        />
      </ScrollView>
    </>
  );
}