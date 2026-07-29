/**
 * ============================================================
 * SCREEN: ENFERMEDADES
 * ============================================================
 *
 * Descripcion:
 * Formulario CRUD del modulo Enfermedades.
 *
 * Integracion:
 * - Carga fincas y estanques reales.
 * - Carga catalogos reales.
 * - Lista registros guardados en MySQL.
 * - Crea, actualiza y elimina mediante Axios.
 *
 * Importante:
 * - El responsable se obtiene desde la sesion JWT.
 * - No utiliza datos mock ni AsyncStorage.
 */

import React from "react";

import {
  Alert as NativeAlert,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import DateInput from "../../../shared/components/DateInput";
import Icon from "../../../shared/components/Icons";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import useEnfermedadesScreen
  from "../hooks/useEnfermedadesScreen";

import {
  obtenerNombreEnfermedad,
  obtenerNombreSeveridad,
} from "../services/EnfermedadesService";

import {
  styles,
} from "../styles/EnfermedadesStyle";

import {
  COLORS,
} from "../../../theme/colors";

import {
  ICONS,
} from "../../../theme/icons";

import {
  TYPOGRAPHY,
} from "../../../theme/typography";

export default function EnfermedadesScreen({
  onBack,
  navigation,
}) {
  const {
    width,
  } = useWindowDimensions();

  const {
    finca,
    estanque,
    fechaReporte,
    enfermedad,
    severidad,
    mortalidad,
    reporte,

    responsableVisible,

    opcionesFincas,
    opcionesEstanques,
    opcionesEnfermedades,
    opcionesSeveridades,
    casosRegistrados,

    cargando,
    guardando,
    eliminandoId,
    submitted,
    mensaje,
    tipoMensaje,
    registroEditandoId,

    cambiarFinca,
    cambiarEstanque,
    cambiarFechaReporte,
    cambiarEnfermedad,
    cambiarSeveridad,
    cambiarMortalidad,
    cambiarReporte,

    guardarEnfermedad,
    editarCaso,
    cancelarEdicion,
    eliminarCaso,
    recargar,
  } = useEnfermedadesScreen({
    onBack: onBack,
    navigation: navigation,
  });

  let esTablet = false;
  let esDesktop = false;

  if (width >= 768) {
    esTablet = true;
  }

  if (width >= 1024) {
    esDesktop = true;
  }

  const contentStyle = [
    styles.content,
  ];

  const gridStyle = [
    styles.grid,
  ];

  const itemStyle = [
    styles.gridItem,
  ];

  const itemFullStyle = [
    styles.gridItem,
  ];

  if (esTablet === true) {
    contentStyle.push(
      styles.contentTablet,
    );

    gridStyle.push(
      styles.gridTablet,
    );

    itemStyle.push(
      styles.gridItemTablet,
    );

    itemFullStyle.push(
      styles.gridItemFull,
    );
  }

  if (esDesktop === true) {
    contentStyle.push(
      styles.contentDesktop,
    );

    gridStyle.push(
      styles.gridDesktop,
    );

    itemStyle.push(
      styles.gridItemDesktop,
    );

    itemFullStyle.push(
      styles.gridItemFull,
    );
  }

  let textoBoton =
    "Registrar enfermedad";

  if (guardando === true) {
    textoBoton =
      "Guardando...";
  }

  if (
    guardando === false &&
    registroEditandoId !== null
  ) {
    textoBoton =
      "Actualizar enfermedad";
  }

  function confirmarEliminacion(caso) {
    NativeAlert.alert(
      "Eliminar enfermedad",
      (
        "Desea eliminar el registro #" +
        caso.id +
        "?"
      ),
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          style: "destructive",
          onPress: function () {
            eliminarCaso(caso.id);
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={contentStyle}>
        {mensaje !== "" && (
          <Alert
            variant={tipoMensaje}
            message={mensaje}
            style={styles.alert}
            textStyle={styles.alertText}
          />
        )}

        {cargando === true && (
          <Alert
            variant="info"
            message="Cargando datos del modulo..."
            style={styles.alert}
            textStyle={styles.alertText}
          />
        )}

        <Card style={styles.card}>
          <SectionTitle
            title="Ubicacion del caso"
            icon={ICONS.document}
          />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Finca"
                required={true}
                submitted={submitted}
                options={opcionesFincas}
                value={finca}
                onChange={cambiarFinca}
                placeholder={
                  "Seleccione una finca"
                }
                disabled={cargando}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Select
                label="Estanque"
                required={true}
                submitted={submitted}
                options={opcionesEstanques}
                value={estanque}
                onChange={cambiarEstanque}
                placeholder={
                  "Seleccione un estanque"
                }
                disabled={
                  cargando === true ||
                  finca === ""
                }
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <DateInput
                label="Fecha del reporte"
                required={true}
                submitted={submitted}
                value={fechaReporte}
                onChangeText={
                  cambiarFechaReporte
                }
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <Input
                label="Responsable"
                value={responsableVisible}
                editable={false}
                placeholder={
                  "Se asigna desde la sesion"
                }
                labelStyle={styles.label}
                style={styles.disabledInput}
              />
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <SectionTitle
            title="Enfermedad detectada"
            icon={ICONS.report}
          />

          <Select
            label="Enfermedad"
            required={true}
            submitted={submitted}
            options={opcionesEnfermedades}
            value={enfermedad}
            onChange={cambiarEnfermedad}
            placeholder={
              "Seleccione una enfermedad"
            }
            disabled={cargando}
            labelStyle={styles.label}
          />
        </Card>

        <Card style={styles.card}>
          <SectionTitle
            title="Reporte sanitario"
            icon={ICONS.info}
          />

          <View style={gridStyle}>
            <View style={itemStyle}>
              <Select
                label="Severidad"
                required={true}
                submitted={submitted}
                options={opcionesSeveridades}
                value={severidad}
                onChange={cambiarSeveridad}
                placeholder={
                  "Seleccione la severidad"
                }
                disabled={cargando}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemStyle}>
              <NumberInput
                label="Mortalidad registrada (U)"
                value={mortalidad}
                onChangeText={
                  cambiarMortalidad
                }
                min={0}
                max={999999}
                step={1}
                labelStyle={styles.label}
              />
            </View>

            <View style={itemFullStyle}>
              <Input
                label="Reporte"
                required={true}
                submitted={submitted}
                value={reporte}
                onChangeText={cambiarReporte}
                placeholder={
                  "Describa sintomas, " +
                  "observaciones o acciones realizadas"
                }
                multiline={true}
                labelStyle={styles.label}
                style={styles.textArea}
              />
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={guardarEnfermedad}
            disabled={
              guardando === true ||
              cargando === true
            }
            style={styles.outlinePrimaryButton}
          >
            <View
              style={
                styles.inlineButtonContentCentered
              }
            >
              <Icon
                icon={ICONS.save}
                size={18}
                color={COLORS.primary}
              />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                {textoBoton}
              </CustomText>
            </View>
          </Button>

          {registroEditandoId !== null && (
            <Button
              variant="outline"
              onPress={cancelarEdicion}
              disabled={guardando}
              style={styles.cancelEditButton}
            >
              <View
                style={
                  styles.inlineButtonContentCentered
                }
              >
                <Icon
                  icon={ICONS.close}
                  size={18}
                  color={COLORS.textTertiary}
                />

                <CustomText
                  size={15}
                  color={COLORS.textTertiary}
                >
                  Cancelar edicion
                </CustomText>
              </View>
            </Button>
          )}
        </View>

        <Card style={styles.card}>
          <View style={styles.savedHeader}>
            <SectionTitle
              title="Registros guardados"
              icon={ICONS.certificate}
            />

            <Button
              variant="outline"
              onPress={recargar}
              disabled={cargando}
              style={styles.reloadButton}
            >
              <CustomText
                size={12}
                color={COLORS.primary}
              >
                Recargar
              </CustomText>
            </Button>
          </View>

          {casosRegistrados.length === 0 && (
            <CustomText
              size={14}
              color={COLORS.textTertiary}
              style={styles.emptyText}
            >
              No hay enfermedades registradas.
            </CustomText>
          )}

          {casosRegistrados.map(
            function (caso) {
              return (
                <CasoRegistrado
                  key={String(caso.id)}
                  caso={caso}
                  eliminando={
                    Number(eliminandoId) ===
                    Number(caso.id)
                  }
                  onEdit={editarCaso}
                  onDelete={
                    confirmarEliminacion
                  }
                />
              );
            },
          )}
        </Card>
      </View>
    </ScrollView>
  );
}

function SectionTitle({
  title,
  icon,
}) {
  return (
    <View
      style={styles.sectionTitleRow}
    >
      <Icon
        icon={icon}
        size={18}
        color={COLORS.primary}
      />

      <Title
        level={5}
        color={COLORS.textSecondary}
        fuente={
          TYPOGRAPHY.fontFamily.bold
        }
        style={styles.sectionTitle}
      >
        {title}
      </Title>
    </View>
  );
}

function CasoRegistrado({
  caso,
  eliminando,
  onEdit,
  onDelete,
}) {
  let textoEliminar =
    "Eliminar";

  if (eliminando === true) {
    textoEliminar =
      "Eliminando...";
  }

  return (
    <View style={styles.savedCase}>
      <View style={styles.savedCaseHeader}>
        <View style={styles.savedCaseHeaderText}>
          <CustomText
            size={15}
            color={COLORS.textPrimary}
            style={styles.savedCaseTitle}
          >
            {caso.enfermedadNombre}
          </CustomText>

          <CustomText
            size={12}
            color={COLORS.textTertiary}
          >
            Registro #{caso.id}
          </CustomText>
        </View>

        <View style={styles.caseActions}>
          <Button
            variant="outline"
            onPress={function () {
              onEdit(caso);
            }}
            disabled={eliminando}
            style={styles.caseActionButton}
          >
            <CustomText
              size={12}
              color={COLORS.primary}
            >
              Editar
            </CustomText>
          </Button>

          <Button
            variant="outline"
            onPress={function () {
              onDelete(caso);
            }}
            disabled={eliminando}
            style={styles.deleteButton}
          >
            <CustomText
              size={12}
              color={COLORS.error}
            >
              {textoEliminar}
            </CustomText>
          </Button>
        </View>
      </View>

      <Info
        label="Finca"
        value={caso.fincaNombre}
      />

      <Info
        label="Estanque"
        value={caso.estanqueNombre}
      />

      <Info
        label="Fecha"
        value={caso.fechaReporte}
      />

      <Info
        label="Responsable"
        value={caso.responsable}
      />

      <Info
        label="Enfermedad"
        value={
          obtenerNombreEnfermedad(
            caso.enfermedadNombre,
          )
        }
      />

      <Info
        label="Severidad"
        value={
          obtenerNombreSeveridad(
            caso.severidadNombre,
          )
        }
      />

      <Info
        label="Mortalidad"
        value={
          String(
            caso.mortalidadRegistrada,
          )
        }
      />

      <Info
        label="Reporte"
        value={caso.reporte}
      />
    </View>
  );
}

function Info({
  label,
  value,
}) {
  let valorFinal = value;

  if (
    value === "" ||
    value === undefined ||
    value === null
  ) {
    valorFinal =
      "No registrado";
  }

  return (
    <View style={styles.infoRow}>
      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.infoLabel}
      >
        {label}
      </CustomText>

      <CustomText
        size={14}
        color={COLORS.textSecondary}
        style={styles.infoValue}
      >
        {valorFinal}
      </CustomText>
    </View>
  );
}
