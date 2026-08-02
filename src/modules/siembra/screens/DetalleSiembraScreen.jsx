/**
 * =========================================================================
 * PANTALLA DETALLE DE SIEMBRA
 * =========================================================================
 *
 * Pantalla encargada de mostrar la información completa de una siembra
 * o pre-cría existente, en modo solo lectura.
 *
 * FUNCIONALIDAD:
 *
 * 1. Carga la información de una siembra o pre-cría seleccionada.
 *
 * 2. Muestra el resumen del ciclo productivo:
 *      - Día actual.
 *      - Progreso del cultivo.
 *      - Etapa de la siembra.
 *
 * 3. Renderiza las secciones del formulario, todas en modo lectura:
 *      - Información general.
 *      - Datos de larva.
 *      - Cálculo de población.
 *
 * 4. No permite editar directamente: el botón "Editar Siembra/Pre-Cría"
 *    navega a /siembra/editar, y el botón "Finalizar Pre-Cría" navega
 *    a la misma ruta con el param "finalizar", según el estándar de
 *    una ventana por operación CRUD (no combinar editar y detalle).
 *
 * 5. Cuando la Siembra viene de una Pre-Cría (pasoPorPrecria === "si"),
 *    el resumen embebido de Pre-Cría y la sección "Datos de larva"
 *    se muestran en modo lectura junto con el resto del formulario —
 *    son datos heredados, no propios de esta Siembra.
 *
 * LÓGICA:
 * - La gestión del estado y la carga de datos se realiza mediante:
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
 * - /siembra/editar
 *      Se navega hacia aquí al presionar "Editar Siembra/Pre-Cría" o
 *      "Finalizar Pre-Cría" (este último agrega el param "finalizar").
 *
 * - /siembra/nueva
 *      Se navega hacia aquí al presionar "Registrar Siembra", cuando
 *      la Pre-Cría ya fue finalizada previamente.
 *
 * DEPENDENCIAS PRINCIPALES:
 *
 * - useDetalleSiembra.
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
 * - No modifica datos: toda edición ocurre en EditarSiembraScreen.
 * - Mantiene la separación entre presentación y lógica.
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
  const router = useRouter();

  const {
    siembra,
    formData,
    fincas,
    estanques,
    proveedoresLarva,
    laboratoriosLarva,
    procedenciasLarva,
    plLarva,
    tecnicasCultivo,
    mensaje,
    mensajeVariant,
    diaActual,
    totalDias,
    etapa,
    progreso,
    guardando,
    handleFinalizarPreCria,
    handleFinalizarSiembra,
    handleCrearSiembraDesdePrecria,
    fieldHelpers,
  } = useDetalleSiembra(id);

  if (!siembra || !formData) {
    return (
      <NavbarRegistro
        Titulo="Detalle de Siembra"
        Subtitulo="Cargando información..."
        Icono="shrimp"
      />
    );
  }

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
                fincas={fincas}
                estanques={estanques}
                mode="view"
                fieldHelpers={fieldHelpers}
                isAutonomous={true}
                plOptions={plLarva}
              />
              <DatosLarvaSection
                formData={formData}
                proveedoresLarva={proveedoresLarva}
                laboratoriosLarva={laboratoriosLarva}
                procedenciasLarva={procedenciasLarva}
                plLarva={plLarva}
                mode="view"
                fieldHelpers={fieldHelpers}
              />
            </>
          ) : (
            <>
              <InformacionGeneralSection
                formData={formData}
                fincas={fincas}
                estanques={estanques}
                tecnicasCultivo={tecnicasCultivo}
                mode="view"
                fieldHelpers={fieldHelpers}
              />
              {formData.pasoPorPrecria === "si" && formData.precriaId && (
                <PreCriaSection
                  formData={formData}
                  mode="view"
                  fieldHelpers={fieldHelpers}
                />
              )}
              <DatosLarvaSection
                formData={formData}
                proveedoresLarva={proveedoresLarva}
                laboratoriosLarva={laboratoriosLarva}
                procedenciasLarva={procedenciasLarva}
                plLarva={plLarva}
                mode="view"
                fieldHelpers={fieldHelpers}
              />
              <CalculoPoblacionSection
                formData={formData}
                mode="view"
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

          <View style={styles.actions}>
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
              onPress={() =>
                router.push({
                  pathname: "/siembra/editar",
                  params: { id, tipoRegistro: formData.tipoRegistro },
                })
              }
              textStyle={styles.textoBoton}
              variant="outline"
            >
              <View style={styles.buttonContent}>
                <Icon icon={ICONS.edit} color={COLORS.primary} />
                <Text style={styles.textoBoton}>
                  {formData.tipoRegistro === "precria"
                    ? "Editar Pre-Cría"
                    : "Editar Siembra"}
                </Text>
              </View>
            </Button>

            {formData.tipoRegistro === "precria" &&
              formData.estado !== "Finalizada" && (
                <Button
                  style={styles.button}
                  onPress={() =>
                    router.push({
                      pathname: "/siembra/editar",
                      params: {
                        id,
                        tipoRegistro: formData.tipoRegistro,
                        finalizar: "1",
                      },
                    })
                  }
                  disabled={guardando}
                  textStyle={styles.textoBoton}
                  variant="outline"
                >
                  <View style={styles.buttonContent}>
                    <Icon icon={ICONS.check} color={COLORS.primary} />
                    <Text style={styles.textoBoton}>Finalizar Pre-Cría</Text>
                  </View>
                </Button>
              )}
            {formData.tipoRegistro === "siembra" &&
              formData.estado !== "Finalizada" && (
                <Button
                  style={styles.button}
                  onPress={handleFinalizarSiembra}
                  disabled={guardando}
                  textStyle={styles.textoBoton}
                  variant="outline"
                >
                  <View style={styles.buttonContent}>
                    <Icon icon={ICONS.check} color={COLORS.primary} />
                    <Text style={styles.textoBoton}>
                      {guardando ? "Finalizando..." : "Finalizar Siembra"}
                    </Text>
                  </View>
                </Button>
              )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
