/**
 * =========================================================================
 * PANTALLA NUEVA SIEMBRA
 * =========================================================================
 *
 * Pantalla encargada del registro de nuevas siembras dentro del módulo
 * de Siembra.
 *
 * FUNCIONALIDAD:
 *
 * 1. Renderiza el formulario dividido en secciones reutilizables:
 *      - Información general.
 *      - Origen de la siembra (Directa / A partir de Pre-Cría).
 *      - Datos de larva.
 *      - Cálculo de población.
 *
 * 2. Recibe del hook los catálogos necesarios para completar los
 *    campos (fincas, técnicas de cultivo, proveedores de larva,
 *    laboratorios, procedencias y PL de larva). La screen ya no
 *    los solicita directamente a SiembraService.
 *
 * 3. Administra la interacción del formulario mediante el hook:
 *      - useNuevaSiembra.
 *
 * 4. Muestra mensajes de validación cuando existen campos obligatorios
 *    incompletos antes de crear la siembra, y de confirmación cuando el
 *    registro se guarda correctamente. Ambos casos usan el componente
 *    global Alert (no un Modal), centrado y ubicado arriba del botón
 *    de guardar, tal como lo define el estándar de interfaz del proyecto.
 *
 * 5. Selector "Origen de esta siembra" (solo si NO se llegó
 *    automáticamente desde "Finalizar Pre-Cría"): Directa o A partir
 *    de Pre-Cría. Al elegir "A partir de Pre-Cría" aparece un Select
 *    con las Pre-Crías finalizadas y disponibles; al elegirla se
 *    autocompletan y bloquean (mode="view") los campos heredados en
 *    "Información de Pre-Cría" y "Datos de larva".
 *
 * DEPENDENCIAS PRINCIPALES:
 *
 * - useNuevaSiembra.
 * - SiembraService.
 * - InformacionGeneralSection.
 * - DatosLarvaSection.
 * - CalculoPoblacionSection.
 * - Componentes compartidos:
 *      - Button.
 *      - Alert.
 *      - NavbarRegistro.
 *
 * IMPORTANTE:
 *
 * - No contiene reglas de negocio.
 * - No realiza cálculos directamente.
 * - No accede directamente a datos persistentes.
 * - Mantiene la separación entre presentación y lógica.
 *
 * =========================================================================
 */
import React, { useRef, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";

import { STYLE } from "../../../theme/style";
import { styles } from "../styles/NuevaSiembraStyles";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Select from "../../../shared/components/Select";

import InformacionGeneralSection from "../components/InformacionGeneralSection";
import DatosLarvaSection from "../components/DatosLarvaSection";
import CalculoPoblacionSection from "../components/CalculoPoblacionSection";
import PreCriaSection from "../components/PreCriaSection";
import SectionTitle from "../components/SectionTitle";

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

import useNuevaSiembra from "../hooks/useNuevaSiembra";

export default function NuevaSiembraScreen() {
  const {
    formData,

    estanques,

    fincas,

    tecnicasCultivo,

    proveedoresLarva,

    laboratoriosLarva,

    procedenciasLarva,

    plLarva,

    vinoAutomaticoDePrecria,

    preCriasDisponibles,

    origenSiembra,

    handleCambiarOrigenSiembra,

    handleSeleccionarPreCria,

    mensaje,

    mensajeVariant,

    handleChange,

    handleChangeFinca,

    handleChangeEstanque,

    handleCrearSiembra,
    guardando,

    handleAgregarProveedorLarva,

    handleAgregarLaboratorioLarva,

    handleAgregarProcedenciaLarva,

    handleEditarProveedorLarva,

    handleEditarLaboratorioLarva,

    handleEditarProcedenciaLarva,

    handleEliminarProveedorLarva,

    handleEliminarLaboratorioLarva,

    handleEliminarProcedenciaLarva,

    fieldHelpers,
  } = useNuevaSiembra();

  const scrollRef = useRef(null);

  useEffect(() => {
    if (mensaje !== "" && mensajeVariant === "danger") {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensaje, mensajeVariant]);

  return (
    <>
      <NavbarRegistro
        Titulo={
          formData.tipoRegistro === "precria"
            ? "Nueva Pre-Cría"
            : "Nueva Siembra"
        }
        Subtitulo="Registrar siembra"
        Icono="add"
      />

      <ScrollView
        ref={scrollRef}
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={STYLE.contentWrapper}>
          {!formData.precriaId && (
            <Card>
              <SectionTitle icon={ICONS.clipboard} title="Tipo de registro" />

              <Select
                label={fieldHelpers.requiredLabel("¿Qué desea registrar?")}
                placeholder="Seleccione una opción"
                options={[
                  { label: "Siembra", value: "siembra" },
                  { label: "Pre-Cría", value: "precria" },
                ]}
                value={formData.tipoRegistro}
                onChange={(value) => handleChange("tipoRegistro", value)}
                labelStyle={styles.requiredLabel}
                selectStyle={
                  fieldHelpers.hasError("tipoRegistro")
                    ? styles.inputError
                    : null
                }
              />
            </Card>
          )}
          {formData.tipoRegistro === "precria" ? (
            <>
              <PreCriaSection
                formData={formData}
                onChange={handleChange}
                onChangeFinca={handleChangeFinca}
                onChangeEstanque={handleChangeEstanque}
                fincas={fincas}
                estanques={estanques}
                fieldHelpers={fieldHelpers}
                isAutonomous={true}
                isCreating={true}
                plOptions={plLarva}
              />
              <DatosLarvaSection
                formData={formData}
                onChange={handleChange}
                proveedoresLarva={proveedoresLarva}
                laboratoriosLarva={laboratoriosLarva}
                procedenciasLarva={procedenciasLarva}
                plLarva={plLarva}
                fieldHelpers={fieldHelpers}
                onAgregarProveedor={handleAgregarProveedorLarva}
                onAgregarLaboratorio={handleAgregarLaboratorioLarva}
                onAgregarProcedencia={handleAgregarProcedenciaLarva}
                onEditarProveedor={handleEditarProveedorLarva}
                onEditarLaboratorio={handleEditarLaboratorioLarva}
                onEditarProcedencia={handleEditarProcedenciaLarva}
                onEliminarProveedor={handleEliminarProveedorLarva}
                onEliminarLaboratorio={handleEliminarLaboratorioLarva}
                onEliminarProcedencia={handleEliminarProcedenciaLarva}
              />
            </>
          ) : (
            <>
              {!vinoAutomaticoDePrecria && (
                <Card>
                  <SectionTitle
                    icon={ICONS.growth}
                    title="Origen de esta siembra"
                  />

                  <Select
                    label="¿Cómo se origina esta siembra?"
                    placeholder="Seleccione una opción"
                    options={[
                      { label: "Directa", value: "directa" },
                      { label: "A partir de Pre-Cría", value: "precria" },
                    ]}
                    value={origenSiembra}
                    onChange={handleCambiarOrigenSiembra}
                  />

                  {origenSiembra === "precria" && (
                    <Select
                      label={fieldHelpers.requiredLabel("Pre-Cría finalizada")}
                      placeholder="Seleccionar Pre-Cría"
                      options={preCriasDisponibles}
                      value={formData.precriaId}
                      onChange={handleSeleccionarPreCria}
                      labelStyle={styles.requiredLabel}
                      selectStyle={
                        fieldHelpers.hasError("precriaId")
                          ? styles.inputError
                          : null
                      }
                    />
                  )}
                </Card>
              )}

              <InformacionGeneralSection
                formData={formData}
                onChange={handleChange}
                onChangeFinca={handleChangeFinca}
                onChangeEstanque={handleChangeEstanque}
                fincas={fincas}
                estanques={estanques}
                tecnicasCultivo={tecnicasCultivo}
                fieldHelpers={fieldHelpers}
              />

              {formData.pasoPorPrecria === "si" && (
                <PreCriaSection
                  formData={formData}
                  onChange={handleChange}
                  fieldHelpers={fieldHelpers}
                  isAutonomous={false}
                  mode="view"
                />
              )}

              <DatosLarvaSection
                formData={formData}
                onChange={handleChange}
                proveedoresLarva={proveedoresLarva}
                laboratoriosLarva={laboratoriosLarva}
                procedenciasLarva={procedenciasLarva}
                plLarva={plLarva}
                mode={formData.pasoPorPrecria === "si" ? "view" : "edit"}
                fieldHelpers={fieldHelpers}
                onAgregarProveedor={handleAgregarProveedorLarva}
                onAgregarLaboratorio={handleAgregarLaboratorioLarva}
                onAgregarProcedencia={handleAgregarProcedenciaLarva}
                onEditarProveedor={handleEditarProveedorLarva}
                onEditarLaboratorio={handleEditarLaboratorioLarva}
                onEditarProcedencia={handleEditarProcedenciaLarva}
                onEliminarProveedor={handleEliminarProveedorLarva}
                onEliminarLaboratorio={handleEliminarLaboratorioLarva}
                onEliminarProcedencia={handleEliminarProcedenciaLarva}
              />

              <CalculoPoblacionSection
                formData={formData}
                onChange={handleChange}
                fieldHelpers={fieldHelpers}
              />
            </>
          )}
          {mensaje !== "" && (
            <Alert
              message={mensaje}
              variant={mensajeVariant}
              style={[
                styles.alert,
                mensajeVariant === "success" && styles.alertSuccess,
              ]}
              textStyle={{ textAlign: "center" }}
            />
          )}

          <Button
            onPress={handleCrearSiembra}
            disabled={guardando}
            style={styles.createButton}
            textStyle={styles.createButtonText}
            variant="outline"
          >
            <View style={styles.createButtonContent}>
              <Icon icon={ICONS.save} color={COLORS.primary} />
              <Text style={styles.createButtonText}>
                {guardando
                  ? "Guardando..."
                  : formData.tipoRegistro === "precria"
                    ? "Registar Pre-Cría"
                    : "Registrar Siembra"}
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
