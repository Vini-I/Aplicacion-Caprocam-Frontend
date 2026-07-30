/**
 * =========================================================================
 * PANTALLA DETALLE DE SIEMBRA
 * =========================================================================
 *
 * Pantalla encargada de mostrar la información completa de una siembra
 * existente y permitir su edición.
 *
 * FUNCIONALIDAD:
 *
 * 1. Carga la información de una siembra seleccionada.
 *
 * 2. Muestra el resumen del ciclo productivo:
 *      - Día actual.
 *      - Progreso del cultivo.
 *      - Etapa de la siembra.
 *
 * 3. Renderiza las secciones del formulario:
 *      - Información general.
 *      - Datos de larva.
 *      - Cálculo de población.
 *
 * 4. Permite editar, guardar y cancelar cambios realizados en la siembra.
 *
 * 5. Cuando la Siembra viene de una Pre-Cría (pasoPorPrecria === "si"),
 *    el resumen embebido de Pre-Cría y la sección "Datos de larva"
 *    quedan siempre en modo lectura (mode="view"), sin importar si el
 *    resto del formulario está en edición — son datos heredados, no
 *    propios de esta Siembra.
 *
 * LÓGICA:
 * - La gestión del estado, validaciones y acciones se realiza mediante:
 *  -useDetalleSiembra.
 *
 * COMPONENTES UTILIZADOS:
 *
 * - Card.
 * - Badge.
 * - Button.
 * - ProgressBar.
 * - Alert.
 * - Componentes de sección del módulo Siembra.
 *
 * NAVEGACIÓN:
 * - /(drawer)/siembra/nueva
 *      Se navega hacia aquí al finalizar una Pre-Cría o al crear una
 *      siembra a partir de una Pre-Cría, enviando los datos ya
 *      completados como parámetros.
 *
 * DEPENDENCIAS PRINCIPALES:
 *
 * - useDetalleSiembra.
 * - SiembraService.
 * - InformacionGeneralSection.
 * - DatosLarvaSection.
 * - CalculoPoblacionSection.
 * - PreCriaSection.
 * - Componentes compartidos:
 *      - Card, Badge, Button, ProgressBar, Alert, Icon, NavbarRegistro.
 *
 * IMPORTANTE:
 *
 * - No contiene reglas de negocio.
 * - No realiza cálculos directamente.
 * - Mantiene la separación entre presentación y lógica.
 *
 * =========================================================================
 */

import React from "react";

import { useLocalSearchParams } from "expo-router";
import { View, ScrollView } from "react-native";

// Componentes compartidos

import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import ProgressBar from "../../../shared/components/ProgressBar";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Text from "../../../shared/components/Text";


// Secciones del formulario

import InformacionGeneralSection from "../components/InformacionGeneralSection";
import DatosLarvaSection from "../components/DatosLarvaSection";
import CalculoPoblacionSection from "../components/CalculoPoblacionSection";
import PreCriaSection from "../components/PreCriaSection";

// Tema y estilos

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/DetalleSiembraStyles";
import { STYLE } from "../../../theme/style";

// Hook principal
import useDetalleSiembra from "../hooks/useDetalleSiembra";

export default function DetalleSiembraScreen() {
  const { id } = useLocalSearchParams();

  const {
    siembra,

    formData,

    estanques,

    fincas,

    tecnicasCultivo,

    proveedoresLarva,

    laboratoriosLarva,

    procedenciasLarva,

    plLarva,

    isEditing,

    mensaje,

    mensajeVariant,

    diaActual,

    totalDias,

    etapa,

    progreso,

    handleChange,

    handleChangeFinca,

    handleChangeEstanque,

    iniciarEdicion,

    cancelarEdicion,

    guardar,

    guardando,

    handleFinalizarPreCria,

    handleCrearSiembraDesdePrecria,

    datosCierrePreCriaCompletos,

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
  } = useDetalleSiembra(id);

  if (!siembra || !formData) {
    return (
      <>
        <NavbarRegistro
          Titulo="Detalle de Siembra"
          Subtitulo="Cargando información..."
          Icono="shrimp"
        />
      </>
    );
  }

  // NUEVO: busca el nombre real en los catálogos, con fallback si no
  // se encuentra (ej. mientras cargan, o si el id no calza con nada).
  const fincaLabel =
    fincas.find((f) => f.value === formData.finca)?.label || "Sin finca";
  const estanqueLabel =
    estanques.find((e) => e.value === formData.estanque)?.label ||
    "Sin estanque";

  return (
    <>
      <NavbarRegistro
        Titulo={
          formData.tipoRegistro === "precria"
            ? "Detalle de Pre-Cría"
            : "Detalle de Siembra"
        }
        Subtitulo={`${estanqueLabel} – ${fincaLabel}`}
        Icono="shrimp"
      />
      <ScrollView
        style={STYLE.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={STYLE.contentWrapper}>
          {/* Resumen del ciclo de siembra */}
          <Card>
            <View style={styles.resumenHeader}>
              <View style={styles.iconContainer}>
                <Icon icon={ICONS.shrimp} style={styles.summaryIcon} />
              </View>

              <View style={styles.resumenInfo}>
                <Badge
                  label={`Día ${diaActual} de ${totalDias}`}
                  variant="success"
                  textStyle={styles.badgeText}
                />

                <Text style={styles.siembraTitle}>
                  {formData.tipoRegistro === "precria" ? "Pre-Cría" : "Siembra"}{" "}
                  #{id}
                </Text>
              </View>
            </View>

            <View style={styles.subtitleRow}>
              <Icon icon={ICONS.growth} color={COLORS.textTertiary} />
              <Text style={styles.subtitle}>Avance del ciclo</Text>
            </View>

            <ProgressBar progress={progreso} />

            <View style={styles.subtitleRow}>
              <Icon icon={ICONS.clipboard} color={COLORS.textTertiary} />
              <Text style={styles.subtitle}>Estado de Etapa</Text>
            </View>

            <View style={styles.etapas}>
              {(formData.tipoRegistro === "precria"
                ? [
                    { label: "Siembra", variant: "success" },
                    { label: "Desarrollo", variant: "warning" },
                    { label: "Finalización", variant: "success" },
                  ]
                : [
                    { label: "Siembra", variant: "success" },
                    { label: "Maduración", variant: "warning" },
                    { label: "Cosecha", variant: "success" },
                  ]
              ).map((etapaInfo, index) => (
                <Badge
                  key={etapaInfo.label}
                  label={etapaInfo.label}
                  variant={etapa >= index + 1 ? etapaInfo.variant : undefined}
                  style={styles.badgeEtapa}
                  textStyle={styles.badgeText}
                />
              ))}
            </View>
          </Card>

          {formData.tipoRegistro === "precria" ? (
            <>
              <PreCriaSection
                formData={formData}
                onChange={handleChange}
                onChangeFinca={handleChangeFinca}
                onChangeEstanque={handleChangeEstanque}
                fincas={fincas}
                estanques={estanques}
                mode={isEditing ? "edit" : "view"}
                fieldHelpers={fieldHelpers}
                isAutonomous={true}
                plOptions={plLarva}
              />
              <DatosLarvaSection
                formData={formData}
                onChange={handleChange}
                proveedoresLarva={proveedoresLarva}
                laboratoriosLarva={laboratoriosLarva}
                procedenciasLarva={procedenciasLarva}
                plLarva={plLarva}
                mode={isEditing ? "edit" : "view"}
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
              {/* Información general */}

              <InformacionGeneralSection
                formData={formData}
                onChange={handleChange}
                onChangeFinca={handleChangeFinca}
                onChangeEstanque={handleChangeEstanque}
                fincas={fincas}
                estanques={estanques}
                tecnicasCultivo={tecnicasCultivo}
                mode={isEditing ? "edit" : "view"}
                fieldHelpers={fieldHelpers}
              />

              {formData.pasoPorPrecria === "si" && formData.precriaId && (
                <PreCriaSection
                  formData={formData}
                  onChange={handleChange}
                  mode="view"
                  fieldHelpers={fieldHelpers}
                />
              )}

              {/* Datos de larva */}

              <DatosLarvaSection
                formData={formData}
                onChange={handleChange}
                proveedoresLarva={proveedoresLarva}
                laboratoriosLarva={laboratoriosLarva}
                procedenciasLarva={procedenciasLarva}
                plLarva={plLarva}
                mode={
                  isEditing && formData.pasoPorPrecria !== "si"
                    ? "edit"
                    : "view"
                }
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

              {/* Cálculo de población */}

              <CalculoPoblacionSection
                formData={formData}
                onChange={handleChange}
                mode={isEditing ? "edit" : "view"}
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

          {!isEditing ? (
            <View style={styles.actions}>
              {/*
                Si la Pre-Cría ya fue finalizada previamente, se ofrece
                un acceso directo para registrar la Siembra sin tener
                que volver a entrar en modo edición.
              */}
              {formData.tipoRegistro === "precria" &&
                formData.estado === "Finalizada" && (
                  <Button
                    style={styles.button}
                    onPress={handleCrearSiembraDesdePrecria}
                    textStyle={styles.textoBoton}
                    variant="outline"
                  >
                    <View style={styles.buttonContent}>
                      <Icon icon={ICONS.add} color={COLORS.primary} />
                      <Text style={styles.textoBoton}>Registrar Siembra</Text>
                    </View>
                  </Button>
                )}

              <Button
                style={styles.button}
                onPress={iniciarEdicion}
                textStyle={styles.textoBoton}
                variant="outline"
              >
                <View style={styles.buttonContent}>
                  <Icon icon={ICONS.edit} color={COLORS.primary} />
                  <Text style={styles.textoBoton}>Editar</Text>
                </View>
              </Button>

              {formData.tipoRegistro === "precria" &&
                formData.estado !== "Finalizada" && (
                  <Button
                    style={styles.button}
                    onPress={handleFinalizarPreCria}
                    disabled={guardando}
                    textStyle={styles.textoBoton}
                    variant="outline"
                  >
                    <View style={styles.buttonContent}>
                      <Icon icon={ICONS.check} color={COLORS.primary} />
                      <Text style={styles.textoBoton}>
                        {guardando ? "Finalizando..." : "Finalizar Precria"}
                      </Text>
                    </View>
                  </Button>
                )}
            </View>
          ) : (
            <View style={styles.actions}>
              {/* EN MODO EDICIÓN QUEDAN LAS ACCIONES DE PERSISTENCIA */}
              <Button
                style={styles.button}
                onPress={guardar}
                disabled={guardando}
                textStyle={styles.textoBoton}
                variant="outline"
              >
                <View style={styles.buttonContent}>
                  <Icon icon={ICONS.save} color={COLORS.primary} />
                  <Text style={styles.textoBoton}>
                    {guardando ? "Guardando..." : "Guardar"}
                  </Text>
                </View>
              </Button>

              <Button
                variant="outline"
                style={styles.button}
                onPress={cancelarEdicion}
                textStyle={styles.textoBoton}
              >
                <View style={styles.buttonContent}>
                  <Icon icon={ICONS.close} color={COLORS.primary} />
                  <Text style={styles.textoBoton}>Cancelar</Text>
                </View>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
