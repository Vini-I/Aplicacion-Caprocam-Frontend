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
 * =========================================================================
 */

import React from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
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
import Title from "../../../shared/components/Title";

// Secciones del formulario

import InformacionGeneralSection from "../components/InformacionGeneralSection";
import DatosLarvaSection from "../components/DatosLarvaSection";
import CalculoPoblacionSection from "../components/CalculoPoblacionSection";
import PreCriaSection from "../components/PreCriaSection";

// Tema y estilos

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/DetalleSiembraStyles";
import { STYLE } from "../../../theme/style";

// Hook principal
import useDetalleSiembra from "../hooks/useDetalleSiembra";

// Servicios

import {
  obtenerFincas,
  obtenerTecnicasCultivo,
  obtenerProveedoresLarva,
  obtenerLaboratoriosLarva,
  obtenerProcedenciasLarva,
  obtenerPLLarva,
} from "../services/SiembraService";

export default function DetalleSiembraScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    siembra,

    formData,

    estanques,

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

    fieldHelpers,
  } = useDetalleSiembra(id);

  /*
   * Opciones de los Select.
   *
   * Antes estas opciones eran responsabilidad de SiembraForm.
   * Ahora cada pantalla obtiene únicamente lo que necesita.
   */

  const fincas = obtenerFincas();

  const tecnicasCultivo = obtenerTecnicasCultivo();

  const proveedoresLarva = obtenerProveedoresLarva();

  const laboratoriosLarva = obtenerLaboratoriosLarva();

  const procedenciasLarva = obtenerProcedenciasLarva();

  const plLarva = obtenerPLLarva();

  if (!siembra || !formData) {
    return (
      <View style={STYLE.container}>
        <NavbarRegistro
          Titulo="Detalle de Siembra"
          Subtitulo="Cargando información..."
          Icono="shrimp"
        />
      </View>
    );
  }

  return (
    <View style={STYLE.container}>
      <NavbarRegistro
        Titulo={
          formData.tipoRegistro === "precria"
            ? "Detalle de Pre-Cría"
            : "Detalle de Siembra"
        }
        Subtitulo={`${formData.estanque || "Sin estanque"} – ${formData.finca || "Sin finca"}`}
        Icono="shrimp"
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={STYLE.contentWrapper}>
          {mensaje !== "" && (
            <Alert
              message={mensaje}
              variant={mensajeVariant}
              style={styles.alert}
            />
          )}

          {/* Resumen del ciclo de siembra */}
          <Card>
            <View style={styles.resumenHeader}>
              <View style={styles.iconContainer}>
                <Icon
                  icon={ICONS.shrimp}
                  size={28}
                  style={styles.summaryIcon}
                />
              </View>

              <View style={styles.resumenInfo}>
                <Badge
                  label={`Día ${diaActual} de ${totalDias}`}
                  variant="success"
                  textStyle={styles.badgeText}
                />

                <Text style={styles.siembraTitle}>
                  {formData.tipoRegistro === "precria" ? "Pre-Cría" : "Siembra"}{" "}
                  #{siembra.siembraId}
                </Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Avance del ciclo</Text>

            <ProgressBar progress={progreso} />

            <Text style={styles.subtitle}>Estado de Etapa</Text>

            <View style={styles.etapas}>
              <Badge
                label="Siembra"
                variant={etapa >= 1 ? "success" : undefined}
                style={styles.badgeEtapa}
                textStyle={styles.badgeText}
              />

              <Badge
                label="Maduración"
                variant={etapa >= 2 ? "warning" : undefined}
                style={styles.badgeEtapa}
                textStyle={styles.badgeText}
              />

              <Badge
                label="Cosecha"
                variant={etapa >= 3 ? "success" : undefined}
                style={styles.badgeEtapa}
                textStyle={styles.badgeText}
              />
            </View>
          </Card>

          {formData.tipoRegistro === "precria" ? (
            <>
              <PreCriaSection
                formData={formData}
                onChange={handleChange}
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

              {/* Datos de Pre-Cría */}
              {formData.pasoPorPrecria === "si" && (
                <PreCriaSection
                  formData={formData}
                  onChange={handleChange}
                  mode={isEditing ? "edit" : "view"}
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
                mode={isEditing ? "edit" : "view"}
                fieldHelpers={fieldHelpers}
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

          {!isEditing ? (
            <View style={styles.actions}>
              {/* 🚀 EL BOTÓN DE TRANSICIÓN SE MUESTRA ÚNICAMENTE EN MODO LECTURA */}
              {formData.tipoRegistro === "precria" && (
                <Button
                  style={styles.button}
                  onPress={() => {
                    router.push({
                      pathname: "/(drawer)/siembra/nueva",
                      params: {
                        provieneDePrecriaId: id,
                        finca: formData.fincaId || formData.finca || "",
                        estanque: formData.estanque || "",
                        cantidadFinal:
                          formData.cantidadFinal ||
                          formData.cantidadSobrevivientePrecria ||
                          "",
                        duracionDias:
                          formData.duracionDias ||
                          formData.duracionPrecria ||
                          "",
                        fechaFin:
                          formData.fechaFin ||
                          formData.fechaSalidaPrecria ||
                          "",
                        proveedorLarva: formData.proveedorLarva || "",
                        laboratorioLarva:
                          formData.laboratorioLarva ||
                          formData.laboratoriosLarva ||
                          "",
                        procedenciaLarva: formData.procedenciaLarva || "",
                        codigoLoteLarva: formData.codigoLoteLarva || "",
                        certificadoLarva: formData.certificadoLarva || "",
                        plLarva:
                          formData.plLarva ||
                          formData.plFinal ||
                          formData.plInicial ||
                          "",
                      },
                    });
                  }}
                  textStyle={styles.textoBoton}
                  variant="outline"
                >
                  Finalizar y Crear Siembra
                </Button>
              )}

              <Button
                onPress={iniciarEdicion}
                textStyle={styles.textoBoton}
                variant="outline"
              >
                Editar
              </Button>
            </View>
          ) : (
            <View style={styles.actions}>
              {/* EN MODO EDICIÓN SÓLO QUEDAN ACCIONES DE PERSISTENCIA */}
              <Button
                style={styles.button}
                onPress={guardar}
                textStyle={styles.textoBoton}
                variant="outline"
              >
                Guardar
              </Button>

              <Button
                variant="outline"
                style={styles.button}
                onPress={cancelarEdicion}
                textStyle={styles.textoBoton}
              >
                Cancelar
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}