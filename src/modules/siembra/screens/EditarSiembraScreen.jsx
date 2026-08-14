/**
 * =========================================================================
 * PANTALLA EDITAR SIEMBRA
 * =========================================================================
 *
 * Pantalla encargada de mostrar el formulario editable de una siembra
 * o pre-cría existente, y de guardar o finalizar los cambios.
 *
 * FUNCIONALIDAD:
 *
 * 1. Carga la información de una siembra o pre-cría seleccionada
 *    (mediante el mismo hook que usa el detalle, useDetalleSiembra).
 *
 * 2. Renderiza las secciones del formulario en modo edición:
 *      - Información general.
 *      - Datos de larva.
 *      - Cálculo de población.
 *
 * 3. Permite guardar o cancelar los cambios realizados.
 *
 * 4. Si la pantalla recibe el param "finalizar" (llega desde el botón
 *    "Finalizar Pre-Cría" del Detalle), el botón de guardar abre un
 *    modal de confirmación (la acción es irreversible) y, al
 *    confirmar, ejecuta handleFinalizarPreCria en vez de guardar -
 *    mismo formulario, distinta acción de submit.
 *
 * 5. Cuando la Siembra viene de una Pre-Cría (pasoPorPrecria === "si"),
 *    el resumen embebido de Pre-Cría y la sección "Datos de larva"
 *    quedan siempre en modo lectura, sin importar que el resto del
 *    formulario esté en edición — son datos heredados, no propios de
 *    esta Siembra.
 *
 * 6. Al guardar o finalizar con éxito, o al cancelar, vuelve a la
 *    pantalla anterior (router.back(), vía cancelarEdicion o dentro
 *    de guardar/handleFinalizarPreCria).
 *
 * LÓGICA:
 * - Toda la gestión de estado, cálculos derivados (esFinalizar,
 *   fincaLabel, estanqueLabel) y comportamiento (handlePresionarGuardar,
 *   scroll automático en caso de error) vive en useDetalleSiembra.
 * - Este componente NO usa useState/useEffect/useRef propios: solo
 *   consume lo que el hook expone y pinta UI.
 *
 * COMPONENTES UTILIZADOS:
 *
 * - Card.
 * - Button.
 * - Alert.
 * - Modal, Title (confirmación antes de finalizar).
 * - Componentes de sección del módulo Siembra.
 *
 * NAVEGACIÓN:
 * - Pantalla anterior (router.back())
 *      Se vuelve aquí al guardar/finalizar con éxito, o al cancelar.
 *      (cancelarEdicion vive en el hook y usa router.back() internamente).
 *
 * DEPENDENCIAS PRINCIPALES:
 *
 * - useDetalleSiembra.
 * - InformacionGeneralSection.
 * - DatosLarvaSection.
 * - CalculoPoblacionSection.
 * - PreCriaSection.
 * - Componentes compartidos:
 *      - Card, Button, Alert, Icon, NavbarRegistro.
 *
 * IMPORTANTE:
 *
 * - No contiene reglas de negocio.
 * - No realiza cálculos directamente (fincaLabel/estanqueLabel/esFinalizar
 *   vienen ya resueltos del hook).
 * - Comparte el hook con DetalleSiembraScreen: separar en dos pantallas
 *   evita combinar "editar" y "detalle" en un mismo screen, según el
 *   estándar de una ventana por operación CRUD.
 *
 * =========================================================================
 */
import React from "react";
import { View, ScrollView } from "react-native";

import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Text from "../../../shared/components/Text";
import Modal from "../../../shared/components/Modal";
import Title from "../../../shared/components/Title";

import InformacionGeneralSection from "../components/InformacionGeneralSection";
import DatosLarvaSection from "../components/DatosLarvaSection";
import CalculoPoblacionSection from "../components/CalculoPoblacionSection";
import PreCriaSection from "../components/PreCriaSection";

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/DetalleSiembraStyles";
import { STYLE } from "../../../theme/style";

import useDetalleSiembra from "../hooks/useDetalleSiembra";

export default function EditarSiembraScreen({
  id,
  tipoRegistroParam,
  finalizar,
  onGoBack,
  onSuccess,
  onSuccessFinalizarPrecria,
}) {
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
    guardando,
    scrollRef,
    esFinalizar,
    fincaLabel,
    estanqueLabel,
    handleChange,
    handleChangeFinca,
    handleChangeEstanque,
    handlePresionarGuardar,
    cancelarEdicion,
    handleFinalizarPreCria,
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
    confirmarFinalizar,
    setConfirmarFinalizar,
  } = useDetalleSiembra({
    id,
    tipoRegistroParam,
    finalizar,
    onGoBack,
    onSuccess,
    onSuccessFinalizarPrecria,
  });

  if (!siembra || !formData) {
    return (
      <NavbarRegistro
        Titulo="Editar"
        Subtitulo="Cargando información..."
        Icono="shrimp"
      />
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo={
          formData.tipoRegistro === "precria"
            ? "Editar Pre-Cría"
            : "Editar Siembra"
        }
        Subtitulo={`${estanqueLabel} – ${fincaLabel}`}
        Icono="shrimp"
        RutaVolver={`/siembra/editar?id=${id}&tipoRegistro=${tipoRegistro}`}
      />
      <ScrollView
        ref={scrollRef}
        style={STYLE.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={STYLE.contentWrapper}>
          {formData.tipoRegistro === "precria" ? (
            <>
              <PreCriaSection
                formData={formData}
                onChange={handleChange}
                onChangeFinca={handleChangeFinca}
                onChangeEstanque={handleChangeEstanque}
                fincas={fincas}
                estanques={estanques}
                mode="edit"
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
                mode="edit"
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
              <InformacionGeneralSection
                formData={formData}
                onChange={handleChange}
                onChangeFinca={handleChangeFinca}
                onChangeEstanque={handleChangeEstanque}
                fincas={fincas}
                estanques={estanques}
                tecnicasCultivo={tecnicasCultivo}
                mode="edit"
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
                mode="edit"
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
            <Button
              style={styles.button}
              onPress={handlePresionarGuardar}
              disabled={guardando}
              textStyle={styles.textoBoton}
              variant="outline"
            >
              <View style={styles.buttonContent}>
                <Icon
                  icon={esFinalizar ? ICONS.check : ICONS.save}
                  color={COLORS.primary}
                />
                <Text style={styles.textoBoton}>
                  {guardando
                    ? esFinalizar
                      ? "Finalizando..."
                      : "Actualizando..."
                    : esFinalizar
                      ? "Finalizar Pre-Cría"
                      : formData.tipoRegistro === "precria"
                        ? "Actualizar Pre-Cría"
                        : "Actualizar Siembra"}
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={confirmarFinalizar}
        onClose={() => setConfirmarFinalizar(false)}
        closeText="Cancelar"
        containerStyle={STYLE.contentWrapper}
        buttonStyle={styles.modalCancelButton}
        buttonTextStyle={styles.modalCancelButtonText}
      >
        <Title level={3} style={styles.modalTitle}>
          ¿Finalizar Pre-Cría?
        </Title>
        <Text style={styles.modalMessage}>
          Esta acción no se puede deshacer.
        </Text>
        <Button
          style={styles.modalConfirmButton}
          onPress={() => {
            setConfirmarFinalizar(false);
            handleFinalizarPreCria();
          }}
        >
          <Text style={styles.modalConfirmButtonText}>Sí, finalizar</Text>
        </Button>
      </Modal>
    </>
  );
}
