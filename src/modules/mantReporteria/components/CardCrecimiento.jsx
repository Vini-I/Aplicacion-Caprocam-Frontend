/**
 * ============================================================
 * CARD CRECIMIENTO
 * ============================================================
 *
 * Muestra los registros de crecimiento filtrados por finca y
 * estanque. Es autocontenido: carga sus datos, maneja el modal
 * de eliminación y notifica el resultado vía onAlertChange.
 *
 * Sigue exactamente el mismo patrón que CardAlimentacion.
 */
import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";

import useCrecimiento from "../hooks/useCrecimiento.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

export default function CardCrecimiento({ fincaId, estanqueId, onEditar, onAlertChange }) {
    const {
        crecimientos,
        loading,

        modalVisible,
        crecimientoSeleccionado,
        loadingEliminar,
        abrirModalEliminar,
        cancelarEliminar,
        confirmarEliminar,
    } = useCrecimiento(fincaId, estanqueId, onAlertChange);

    if (loading) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Cargando registros...</Text>
            </View>
        );
    }

    if (crecimientos.length === 0) {
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
            {crecimientos.map((registro) => (
                <Card
                    key={registro.id}
                    style={[styles.cardRegistro, { borderLeftColor: COLORS.Crecimiento }]}
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
                                
                                {new Date(registro.fechaRegistro || registro.fecha_registro || registro.fecha).toLocaleDateString("es-CR")}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.pesoContainer}>
                        <Text style={styles.label}>Peso actual</Text>
                        <Text style={styles.peso}>
                            {registro.peso_actual ?? registro.pesoActual} g
                        </Text>
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
                title="registro de crecimiento"
                message={
                    crecimientoSeleccionado
                        ? `Peso: ${crecimientoSeleccionado.peso_actual ?? crecimientoSeleccionado.pesoActual} g`
                        : undefined
                }
                onCancel={cancelarEliminar}
                onConfirm={confirmarEliminar}
                loading={loadingEliminar}
            />
        </>
    );
}
