/**
 * PANTALLA: DetalleTareaScreen
 * Pantalla de vista detallada de solo lectura para una tarea de mantenimiento con acciones de edición y eliminación.
 *
 * @dependencies - NavbarRegistro.jsx, Card.jsx, Icon.jsx, Button.jsx, ModalEliminar.jsx (shared/components), tareasService.js (services)
 * @validations  - Muestra mensaje de error si la tarea no existe o falla al eliminarse.
 * @navigation   - Regresa a la lista ('/equipos/tareas') o navega a edición ('/equipos/tareaForm?id={id}').
 */

import React from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Spinner from "../../../shared/components/Spinner";
import ModalEliminar from "../../../shared/components/ModalEliminar";
import Alert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles, detalleStyles } from "../styles/tareasStyles";

import { OPCIONES_CATEGORIA } from "../constants/tareasMensajes";
import { useDetalleTarea } from "../hooks/useDetalleTarea";

// Componente interno para fila con ícono alineado a la izquierda
function FilaDetalleIcono({ icon, label, value }) {
  return (
    <View style={detalleStyles.fila}>
      <View style={detalleStyles.iconoWrapper}>
        <Icon icon={icon} size={18} color={COLORS.textTertiary} />
      </View>
      <View style={detalleStyles.contenido}>
        <CustomText style={detalleStyles.etiqueta}>{label}</CustomText>
        <CustomText style={detalleStyles.valor}>{value || "—"}</CustomText>
      </View>
    </View>
  );
}

export default function DetalleTareaScreen() {
  const { tarea, loading, error, alert, showAlert, editar, eliminar } =
    useDetalleTarea();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const handleEditar = () => editar(tarea);
  const handleEliminarPress = () => {
    setDeleteTarget(tarea);
    setShowConfirmModal(true);
  };
  const confirmDelete = async () => {
    try {
      await eliminar(deleteTarget);
      setShowConfirmModal(false);
    } catch (err) {
      setShowConfirmModal(false);
    }
  };
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <View style={[STYLE.container, styles.loadingContainer]}>
        <Spinner />
      </View>
    );
  }

  if (error || !tarea) {
    return <View style={STYLE.container} />;
  }

  const categoriaLabel =
    OPCIONES_CATEGORIA.find((c) => c.value === tarea.categoria)?.label ||
    tarea.categoria;

  return (
    <>
      <ScrollView
        style={STYLE.container}
        contentContainerStyle={STYLE.contentWrapper}
      >    
          {alert && (
          <View style={styles.alertMarginBottom}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}
        <Card>
          <FilaDetalleIcono
            icon={ICONS.certificate}
            label="ID"
            value={tarea.id}
          />
          <FilaDetalleIcono
            icon={ICONS.user}
            label="Nombre"
            value={tarea.nombre}
          />
          <FilaDetalleIcono
            icon={ICONS.document}
            label="Descripción"
            value={tarea.descripcion}
          />
          <FilaDetalleIcono
            icon={ICONS.id}
            label="Categoría"
            value={categoriaLabel}
          />
          <FilaDetalleIcono
            icon={ICONS.clock}
            label="Duración estimada"
            value={`${tarea.duracionEstimada} hrs`}
          />
          {/* Estado y Productos eliminados: se muestran solo en mantenimientos cuando aplique */}
        </Card>



        <View style={styles.botonesRow}>
          <Button
            variant="outline"
            onPress={handleEditar}
            style={styles.botonDetalleEditar}
          >
            <View style={styles.botonInnerRow}>
              <Icon icon={ICONS.edit} size={18} color={COLORS.primary} />
              <CustomText style={styles.botonTexto}>Editar</CustomText>
            </View>
          </Button>
          <Button
            variant="outline"
            onPress={handleEliminarPress}
            style={styles.botonDetalleEliminar}
          >
            <View style={styles.botonInnerRow}>
              <Icon icon={ICONS.delete} size={18} color={COLORS.error} />
              <CustomText style={styles.botonTextoEliminar}>
                Eliminar
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>

      <ModalEliminar
        visible={showConfirmModal}
        title="Tarea"
        message={deleteTarget ? deleteTarget.nombre : ""}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
