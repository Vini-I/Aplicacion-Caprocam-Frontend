/**
 * ============================================================
 * PANTALLA DETALLE ESTANQUE
 * ============================================================
 *
 * Muestra la informacion registrada de un estanque.
 *
 * Cambios aplicados:
 * - El boton eliminar abre confirmacion.
 * - La confirmacion tiene boton Si y boton No.
 * - Si confirma, elimina el estanque del mock en la sesion local.
 * - Mantiene botones outline.
 */

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import ModalEliminar from "../../../shared/components/ModalEliminar";

import useDetalleEstanque from "../hooks/useDetalleEstanque";

import { styles } from "../styles/EstanqueStyle";
import { obtenerTextoSiNo } from "../services/AireadoresEstanqueService";
import {
  construirEstanqueDetalle,
  eliminarEstanqueLocal,
  obtenerValorInfo,
} from "../services/EstanqueScreenService";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function DetalleEstanqueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { estanque: estanqueEncontrado } = useDetalleEstanque();
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

  const estanque = construirEstanqueDetalle(estanqueEncontrado, params);

  function volver() {
    router.back();
  }

  function editarEstanque() {
    router.push({
      pathname: "/registros/EditarEstanque",
      params: estanque,
    });
  }

  function abrirConfirmacionEliminar() {
    setModalEliminarVisible(true);
  }

  function cerrarConfirmacionEliminar() {
    setModalEliminarVisible(false);
  }

  function confirmarEliminarEstanque() {
    eliminarEstanqueLocal(estanque.codigo);

    console.log("Estanque eliminado:", estanque.codigo);

    setModalEliminarVisible(false);
    router.back();
  }

  if (estanque.codigo === "") {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Alert
            variant="warning"
            message="No se encontro la informacion del estanque."
            style={styles.alert}
            textStyle={styles.alertText}
          />

          <Button variant="outline" onPress={volver} style={styles.outlinePrimaryButton}>
            <CustomText size={15} color={COLORS.primary}>
              Volver
            </CustomText>
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Detalle de Estanque"
        Subtitulo={`${estanque.finca} ${estanque.codigo}`}
        Icono="document"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card>
            <SectionTitle title="Informacion general" icon={ICONS.document} />

            <Info label="Codigo" value={estanque.codigo} />
            <Info label="Finca" value={estanque.finca} />
            <Info label="Estado" value={estanque.estado} />
            <Info label="Tipo de estanque" value={estanque.tipoEstanque} />
            <Info label="Fuente de agua" value={estanque.fuenteAgua} />
          </Card>

          <Card>
            <SectionTitle title="Dimensiones" icon={ICONS.ruler} />

            <Info label="Largo" value={`${estanque.largo} m`} />
            <Info label="Ancho" value={`${estanque.ancho} m`} />
            <Info label="Profundidad" value={`${estanque.profundidad} m`} />
          </Card>

          <Card>
            <SectionTitle title="Siembra y fechas" icon={ICONS.calendar} />

            <Info label="Especie" value={estanque.especie} />
            <Info label="Fecha de siembra" value={estanque.fechaSiembra} />
            <Info
              label="Fecha inicio de engorde"
              value={estanque.fechaInicioEngorde}
            />
            <Info
              label="Fecha de mantenimiento"
              value={estanque.fechaMantenimiento}
            />
            <Info
              label="Densidad de siembra"
              value={`${estanque.densidadSiembra} ind/m2`}
            />
            <Info label="Precria" value={estanque.precria} />
          </Card>

          <Card>
            <SectionTitle title="Alimentacion y equipos" icon={ICONS.food} />

            <Info
              label="Metodo de alimentacion"
              value={estanque.metodoAlimentacion}
            />
            <Info
              label="Proveedor de alimento"
              value={estanque.proveedorAlimento}
            />
            <Info
              label="Tiene aireadores"
              value={obtenerTextoSiNo(estanque.tieneAireadores)}
            />

            {estanque.tieneAireadores === "si" && (
              <View>
                <Info
                  label="Codigo del aireador"
                  value={estanque.codigoAireador}
                />

                <Info
                  label="Estanque seleccionado"
                  value={estanque.estanqueAireador}
                />

                <Info
                  label="Numero de aireadores"
                  value={estanque.numeroAireadores}
                />
              </View>
            )}

            <Info
              label="Alimentador automatico"
              value={estanque.tieneAlimentadorAutomatico}
            />
          </Card>

          <View style={styles.detailActionsRow}>
            <Button
              variant="outline"
              onPress={abrirConfirmacionEliminar}
              style={styles.outlineDangerButton}
            >
              <View style={styles.inlineButtonContentCentered}>
                <Icon icon={ICONS.delete} size={16} color={COLORS.error} />

                <CustomText
                  size={13}
                  color={COLORS.error}
                  style={styles.outlineActionText}
                >
                  Eliminar
                </CustomText>
              </View>
            </Button>

            <Button
              variant="outline"
              onPress={editarEstanque}
              style={styles.outlineEditButton}
            >
              <View style={styles.inlineButtonContentCentered}>
                <Icon icon={ICONS.edit} size={16} color={COLORS.primary} />

                <CustomText
                  size={13}
                  color={COLORS.primary}
                  style={styles.outlineActionText}
                >
                  Editar
                </CustomText>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>

      <ModalEliminar
        visible={modalEliminarVisible}
        title="estanque"
        message={estanque.codigo}
        confirmText="Si, eliminar"
        cancelText="No"
        onCancel={cerrarConfirmacionEliminar}
        onConfirm={confirmarEliminarEstanque}
      />
    </>
  );
}

function SectionTitle({ title, icon }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} />

      <Title
        level={5}
        color={COLORS.textSecondary}
        fuente={TYPOGRAPHY.fontFamily.bold}
        style={styles.sectionTitle}
      >
        {title}
      </Title>
    </View>
  );
}

function Info({ label, value }) {
  const valorFinal = obtenerValorInfo(value);

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
        size={15}
        color={COLORS.textSecondary}
        style={styles.infoValue}
      >
        {valorFinal}
      </CustomText>
    </View>
  );
}