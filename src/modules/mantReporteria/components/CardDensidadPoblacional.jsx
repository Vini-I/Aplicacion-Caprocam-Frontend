/**
 * ============================================================
 * CARD DENSIDAD POBLACIONAL
 * ============================================================
 *
 * Muestra los registros de densidad poblacional filtrados por
 * finca y estanque. Es autocontenido: carga sus datos, maneja
 * el modal de eliminación y notifica el resultado vía onAlertChange.
 *
 * Sigue exactamente el mismo patrón que CardAlimentacion.
 */
import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";

import useDensidadPoblacional from "../hooks/useDensidadPoblacional.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

export default function CardDensidadPoblacional({ fincaId, estanqueId, onEditar, onAlertChange }) {
    const {
        densidades,
        loading,

        modalVisible,
        densidadSeleccionada,
        loadingEliminar,
        abrirModalEliminar,
        cancelarEliminar,
        confirmarEliminar,
    } = useDensidadPoblacional(fincaId, estanqueId, onAlertChange);

    if (loading) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Cargando registros...</Text>
            </View>
        );
    }

    if (densidades.length === 0) {
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
            {densidades.map((registro) => (
                <Card
                    key={registro.id}
                    style={[styles.cardRegistro, { borderLeftColor: COLORS.Densidad }]}
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
                                {new Date(registro.fecha).toLocaleDateString("es-CR")}
                            </Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Densidad Poblacional</Text>
                            <Text style={styles.value}>{registro.densidad}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Camarones estimados</Text>
                            <Text style={styles.value}>{registro.numeroCamarones}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Promedio por tiro</Text>
                            <Text style={styles.value}>{registro.promedioPorTiro}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Tiros de atarraya</Text>
                            <Text style={styles.value}>{registro.tirosAtarraya}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Área del estanque</Text>
                            <Text style={styles.value}>{registro.areaEstanque}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Área de la atarraya</Text>
                            <Text style={styles.value}>{registro.areaAtarraya} m²</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Cantidad de siembra</Text>
                            <Text style={styles.value}>{registro.cantidadSiembra} cam/m²</Text>
                        </View>
                    </View>

                    <View style={styles.pesoContainer}>
                        <Text style={styles.label}>Sobrevivencia</Text>
                        <Text style={styles.Sobrevivencia}>{registro.sobrevivencia} %</Text>
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
                title="registro de densidad poblacional"
                message={
                    densidadSeleccionada
                        ? `Densidad: ${densidadSeleccionada.densidad} · Sobrevivencia: ${densidadSeleccionada.sobrevivencia}%`
                        : undefined
                }
                onCancel={cancelarEliminar}
                onConfirm={confirmarEliminar}
                loading={loadingEliminar}
            />
        </>
    );
}
