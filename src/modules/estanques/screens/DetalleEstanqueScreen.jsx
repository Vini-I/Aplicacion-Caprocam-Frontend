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
import { Modal, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

import useDetalleEstanque from "../hooks/useDetalleEstanque";
import { estanques } from "../../finca/screens/EstanqueData";

import { styles } from "../styles/EstanqueStyle";
import {
  obtenerTextoSiNo,
  obtenerTieneAireadoresInicial,
} from "../services/AireadoresEstanqueService";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

function obtenerParametro(valor, respaldo) {
  let resultado = respaldo;

  if (valor !== undefined && valor !== null && valor !== "") {
    resultado = String(valor);
  }

  return resultado;
}

function obtenerValor(estanque, params, campo, respaldo) {
  let resultado = respaldo;

  if (
    estanque &&
    estanque[campo] !== undefined &&
    estanque[campo] !== null &&
    estanque[campo] !== ""
  ) {
    resultado = String(estanque[campo]);
  }

  if (
    params[campo] !== undefined &&
    params[campo] !== null &&
    params[campo] !== ""
  ) {
    resultado = String(params[campo]);
  }

  return resultado;
}

function eliminarEstanqueMock(codigo) {
  let eliminado = false;

  for (let index = 0; index < estanques.length; index++) {
    if (estanques[index].codigo === codigo) {
      estanques.splice(index, 1);
      eliminado = true;
      break;
    }
  }

  return eliminado;
}

export default function DetalleEstanqueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { estanque: estanqueEncontrado } = useDetalleEstanque();
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

  const numeroAireadores = obtenerValor(
    estanqueEncontrado,
    params,
    "numeroAireadores",
    "0",
  );

  const tieneAireadores = obtenerTieneAireadoresInicial(
    obtenerValor(estanqueEncontrado, params, "tieneAireadores", ""),
    numeroAireadores,
  );

  const estanque = {
    id: obtenerValor(estanqueEncontrado, params, "id", ""),
    finca: obtenerValor(estanqueEncontrado, params, "finca", "Finca La Reina"),
    codigo: obtenerValor(estanqueEncontrado, params, "codigo", ""),
    estado: obtenerValor(estanqueEncontrado, params, "estado", "Activo"),
    tipoEstanque: obtenerValor(
      estanqueEncontrado,
      params,
      "tipoEstanque",
      "No registrado",
    ),
    largo: obtenerValor(estanqueEncontrado, params, "largo", "0"),
    ancho: obtenerValor(estanqueEncontrado, params, "ancho", "0"),
    profundidad: obtenerValor(
      estanqueEncontrado,
      params,
      "profundidad",
      "0",
    ),
    fuenteAgua: obtenerValor(
      estanqueEncontrado,
      params,
      "fuenteAgua",
      "No registrado",
    ),
    especie: obtenerValor(
      estanqueEncontrado,
      params,
      "especie",
      "litopenaeus_vannamei",
    ),
    fechaSiembra: obtenerValor(
      estanqueEncontrado,
      params,
      "fechaSiembra",
      "No registrada",
    ),
    fechaInicioEngorde: obtenerValor(
      estanqueEncontrado,
      params,
      "fechaInicioEngorde",
      "No registrada",
    ),
    fechaMantenimiento: obtenerValor(
      estanqueEncontrado,
      params,
      "fechaMantenimiento",
      "No registrada",
    ),
    densidadSiembra: obtenerValor(
      estanqueEncontrado,
      params,
      "densidadSiembra",
      "0",
    ),
    precria: obtenerValor(
      estanqueEncontrado,
      params,
      "precria",
      "No registrado",
    ),
    metodoAlimentacion: obtenerValor(
      estanqueEncontrado,
      params,
      "metodoAlimentacion",
      "No registrado",
    ),
    proveedorAlimento: obtenerValor(
      estanqueEncontrado,
      params,
      "proveedorAlimento",
      "No registrado",
    ),
    numeroAireadores: numeroAireadores,
    tieneAireadores: tieneAireadores,
    codigoAireador: obtenerValor(
      estanqueEncontrado,
      params,
      "codigoAireador",
      "No asignado",
    ),
    estanqueAireador: obtenerValor(
      estanqueEncontrado,
      params,
      "estanqueAireador",
      "No asignado",
    ),
    tieneAlimentadorAutomatico: obtenerValor(
      estanqueEncontrado,
      params,
      "tieneAlimentadorAutomatico",
      "No registrado",
    ),
  };

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
    eliminarEstanqueMock(estanque.codigo);

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

      <Modal
        transparent={true}
        visible={modalEliminarVisible}
        animationType="fade"
        onRequestClose={cerrarConfirmacionEliminar}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <View style={styles.confirmIconBox}>
              <Icon icon={ICONS.delete} size={28} color={COLORS.error} />
            </View>

            <Title
              level={5}
              color={COLORS.textPrimary}
              fuente={TYPOGRAPHY.fontFamily.bold}
              style={styles.confirmTitle}
            >
              Eliminar estanque
            </Title>

            <CustomText
              size={14}
              color={COLORS.textTertiary}
              align="center"
              style={styles.confirmMessage}
            >
              ¿Esta seguro que desea eliminar el estanque {estanque.codigo}?
            </CustomText>

            <View style={styles.confirmActions}>
              <Button
                variant="outline"
                onPress={cerrarConfirmacionEliminar}
                style={styles.confirmNoButton}
              >
                <CustomText
                  size={14}
                  color={COLORS.textSecondary}
                  style={styles.confirmButtonText}
                >
                  No
                </CustomText>
              </Button>

              <Button
                variant="outline"
                onPress={confirmarEliminarEstanque}
                style={styles.confirmYesButton}
              >
                <CustomText
                  size={14}
                  color={COLORS.error}
                  style={styles.confirmButtonText}
                >
                  Si
                </CustomText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  let valorFinal = value;

  if (value === "" || value === undefined || value === null) {
    valorFinal = "No registrado";
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
        size={15}
        color={COLORS.textSecondary}
        style={styles.infoValue}
      >
        {valorFinal}
      </CustomText>
    </View>
  );
}