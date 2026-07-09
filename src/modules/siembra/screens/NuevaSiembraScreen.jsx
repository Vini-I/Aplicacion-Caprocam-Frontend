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
 *    incompletos antes de crear la siembra, y de confirmación cuando el
 *    registro se guarda correctamente. Ambos casos usan el componente
 *    global Alert (no un Modal), centrado y ubicado arriba del botón
 *    de guardar, tal como lo define el estándar de interfaz del proyecto.
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
import React from "react";
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

    mensaje,

    mensajeVariant,

    handleChange,

    handleChangeFinca,

    handleChangeEstanque,

    handleCrearSiembra,

    fieldHelpers,
  } = useNuevaSiembra();


  const fincas = obtenerFincas();

  const tecnicasCultivo = obtenerTecnicasCultivo();

  const proveedoresLarva = obtenerProveedoresLarva();

  const laboratoriosLarva = obtenerLaboratoriosLarva();

  const procedenciasLarva = obtenerProcedenciasLarva();

  const plLarva = obtenerPLLarva();

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
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={STYLE.contentWrapper}>

          {!formData.precriaId && (
            <Card>
              <SectionTitle icon={ICONS.clipboard} title="Tipo de registro" />

              <Select
                label={fieldHelpers.requiredLabel(
                  "¿Qué desea registrar?",
                )}
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
            style={styles.createButton}
            textStyle={styles.createButtonText}
            variant="outline"
          >
            <View style={styles.createButtonContent}>
              <Icon icon={ICONS.save} color={COLORS.primary} />
              <Text style={styles.createButtonText}>
                {formData.tipoRegistro === "precria"
                  ? "Guardar Pre-Cría"
                  : "Guardar Siembra"}
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
