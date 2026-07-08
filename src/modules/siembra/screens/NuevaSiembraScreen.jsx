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
 *      - Datos de larva.
 *      - Cálculo de población.
 *
 * 2. Obtiene los catálogos necesarios para completar los campos:
 *      - Fincas.
 *      - Técnicas de cultivo.
 *      - Proveedores de larva.
 *      - Laboratorios.
 *      - Procedencias.
 *      - PL de larva.
 *
 * 3. Administra la interacción del formulario mediante el hook:
 *      - useNuevaSiembra.
 *
 * 4. Muestra mensajes de validación cuando existen campos obligatorios
 *    incompletos antes de crear la siembra.
 *
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
 *      - Modal.
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
import React from "react";
import { View, ScrollView } from "react-native";

import { STYLE } from "../../../theme/style";
import { styles } from "../styles/NuevaSiembraStyles";

import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import InformacionGeneralSection from "../components/InformacionGeneralSection";
import DatosLarvaSection from "../components/DatosLarvaSection";
import CalculoPoblacionSection from "../components/CalculoPoblacionSection";
import PreCriaSection from "../components/PreCriaSection";

import useNuevaSiembra from "../hooks/useNuevaSiembra";

import {
  obtenerFincas,
  obtenerTecnicasCultivo,
  obtenerProveedoresLarva,
  obtenerLaboratoriosLarva,
  obtenerProcedenciasLarva,
  obtenerPLLarva,
} from "../services/SiembraService";

export default function NuevaSiembraScreen() {
  const {
    formData,

    estanques,

    modalVisible,

    setModalVisible,

    handleChange,

    handleChangeFinca,

    handleChangeEstanque,

    handleCrearSiembra,

    fieldHelpers,
  } = useNuevaSiembra();

  /**
   * ==========================================
   * Catálogos
   * ==========================================
   */

  const fincas = obtenerFincas();

  const tecnicasCultivo = obtenerTecnicasCultivo();

  const proveedoresLarva = obtenerProveedoresLarva();

  const laboratoriosLarva = obtenerLaboratoriosLarva();

  const procedenciasLarva = obtenerProcedenciasLarva();

  const plLarva = obtenerPLLarva();

  return (
    <View style={STYLE.container}>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={STYLE.contentWrapper}>
          <View style={styles.fieldContainer}>
            <Select
              label={fieldHelpers.requiredLabel("Tipo de registro")}
              placeholder="Seleccione una opción"
              options={[
                { label: "Siembra", value: "siembra" },
                { label: "Pre-Cría", value: "precria" },
              ]}
              value={formData.tipoRegistro}
              onChange={(value) => handleChange("tipoRegistro", value)}
              labelStyle={styles.requiredLabel}
              selectStyle={
                fieldHelpers.hasError("tipoRegistro") ? styles.inputError : null
              }
             
            />
            </View>
          {formData.tipoRegistro === "precria" ? (
            <>
              <PreCriaSection
                formData={formData}
                onChange={handleChange}
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
                fieldHelpers={fieldHelpers}
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
                fieldHelpers={fieldHelpers}
              />

              <View style={styles.fieldContainer}>
                <Select
                  label="¿Esta siembra pasó por un ciclo previo de Pre-Cría? *"
                  placeholder="Seleccione una opción"
                  options={[
                    { label: "No, siembra directa", value: "no" },
                    { label: "Sí, proviene de Pre-Cría", value: "si" },
                  ]}
                  value={formData.pasoPorPrecria}
                  onChange={(value) => handleChange("pasoPorPrecria", value)}
                  labelStyle={styles.requiredLabel}
                />
              </View>

              {formData.pasoPorPrecria === "si" && (
                <PreCriaSection
                  formData={formData}
                  onChange={handleChange}
                  fieldHelpers={fieldHelpers}
                  isAutonomous={false}
                />
              )}

              <DatosLarvaSection
                formData={formData}
                onChange={handleChange}
                proveedoresLarva={proveedoresLarva}
                laboratoriosLarva={laboratoriosLarva}
                procedenciasLarva={procedenciasLarva}
                plLarva={plLarva}
                fieldHelpers={fieldHelpers}
              />

              <CalculoPoblacionSection
                formData={formData}
                onChange={handleChange}
                fieldHelpers={fieldHelpers}
              />
            </>
          )}
          <Button
            onPress={handleCrearSiembra}
            style={styles.createButton}
            textStyle={styles.createButtonText}
            variant="outline"
          >
            {formData.tipoRegistro === "precria" ? "Guardar Pre-Cría" : "Guardar Siembra"}
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        closeText="Aceptar"
      >
        <Title style={styles.modalTitle}>Campos incompletos</Title>

        <Text style={styles.modalMessage}>
          Debe completar todos los campos para registrar esta{" "}
          {formData.tipoRegistro === "precria" ? "PreCría" : "Siembra"}.
        </Text>
      </Modal>
    </View>
  );
}
