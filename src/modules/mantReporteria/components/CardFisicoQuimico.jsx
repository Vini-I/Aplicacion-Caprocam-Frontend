/**
 * ============================================================
 * CARD FÍSICO-QUÍMICO
 * ============================================================
 *
 * Muestra las lecturas físico-químicas filtradas por finca y
 * estanque. Es autocontenido: carga sus datos, maneja el modal
 * de eliminación y notifica el resultado vía onAlertChange.
 *
 * Sigue exactamente el mismo patrón que CardCrecimiento.
 */
import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";

import useFisicoQuimico from "../hooks/useFisicoQuimico.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

//funcion para formatear (poner como texto y no array) la medicion de las lecturas fisico-quimicas
function formatearMedicion(medicion, tipo = "diaNoche") {
  if (medicion == null) return "—";

  const lista = Array.isArray(medicion)
    ? medicion
    : typeof medicion === "object"
      ? [medicion]
      : [{ valor: medicion }];

  if (lista.length === 0) return "—";

  return lista
    .map((item, index) => {
      const valor =
        item != null && typeof item === "object"
          ? item.valor != null
            ? String(item.valor)
            : "—"
          : String(item);

      if (tipo === "oxigeno") {
        return `${index + 1}: ${valor}`;
      }

      // pH, salinidad, temperatura → día / noche
      const etiqueta =
        index === 0 ? "Día" : index === 1 ? "Noche" : `${index + 1}`;
      return `${etiqueta}: ${valor}`;
    })
    .join("  ·  ");
}

export default function CardFisicoQuimico({
  fincaId,
  estanqueId,
  onEditar,
  onAlertChange,
}) {
  const {
    lecturas,
    loading,

    modalVisible,
    lecturaSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useFisicoQuimico(fincaId, estanqueId, onAlertChange);

  if (loading) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Cargando registros...</Text>
      </View>
    );
  }

  if (lecturas.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon icon={ICONS.document} size={48} color={COLORS.textQuaternary} />
        <Text style={styles.emptyTitle}>No hay registros disponibles</Text>
        <Text style={styles.emptyDescription}>
          No se encontraron registros con los filtros seleccionados.
        </Text>
      </View>
    );
  }

  return (
    <>
      {lecturas.map((registro) => (
        <Card
          key={registro.id}
          style={[
            styles.cardRegistro,
            { borderLeftColor: COLORS.FisicoQuimica },
          ]}
        >
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Finca</Text>
              <Text style={styles.value}>{registro.nombreFinca}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Estanque</Text>
              <Text style={styles.value}>{registro.codigoEstanque}</Text>
            </View>


            <View style={styles.infoItem}>
              <Text style={styles.label}>Colaborador</Text>
              <Text style={styles.value}>{registro.nombreCreadoPor}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Fecha</Text>
              <Text style={styles.value}>
                {registro.fecha
                  ? new Date(registro.fecha).toLocaleDateString("es-CR")
                  : "—"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>pH</Text>
              <Text style={styles.value}>{formatearMedicion(registro.ph)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Salinidad</Text>
              <Text style={styles.value}>
                {formatearMedicion(registro.salinidad)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Temperatura</Text>
              <Text style={styles.value}>
                {formatearMedicion(registro.temperatura) === "—"
                  ? "—"
                  : `${formatearMedicion(registro.temperatura)} °C`}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Oxígeno disuelto</Text>
              <Text style={styles.value}>
                {formatearMedicion(registro.oxigenoDisuelto, "oxigeno") === "—"
                  ? "—"
                  : `${formatearMedicion(registro.oxigenoDisuelto, "oxigeno")} mg/L`}
              </Text>
            </View>
          </View>

          <View style={styles.Buttons}>
            <Button
              style={styles.Eliminar}
              onPress={() => abrirModalEliminar(registro)}
            >
              <Icon icon={ICONS.delete} color={COLORS.error} size={20} />
              <Text size={12} color={COLORS.error}>
                Eliminar
              </Text>
            </Button>

            <Button
              style={styles.Editar}
              onPress={() => {onEditar(registro.id)}}
            >
              <Icon icon={ICONS.edit} color={COLORS.primary} size={20} />
              <Text size={12} color={COLORS.primary}>
                Editar
              </Text>
            </Button>
          </View>
        </Card>
      ))}

      <ModalEliminar
        visible={modalVisible}
        title="lectura físico-química"
        message={
          lecturaSeleccionada
            ? `Fecha: ${lecturaSeleccionada.fecha ?? "—"} · pH: ${formatearMedicion(lecturaSeleccionada.ph)}`
            : undefined
        }
        onCancel={cancelarEliminar}
        onConfirm={confirmarEliminar}
        loading={loadingEliminar}
      />
    </>
  );
}
