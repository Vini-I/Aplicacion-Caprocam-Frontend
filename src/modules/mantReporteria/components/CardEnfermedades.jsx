import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx"
import Icon from "../../../shared/components/Icons.jsx"
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import useEnfermedad from "../hooks/useEnfermedad.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

export default function CardEnfermedades({ fincaId, estanqueId, onEditar, onAlertChange }) {

    const {
        enfermedades,
        loading,
        alert,

        modalVisible,
        enfermedadSeleccionada,
        loadingEliminar,

        abrirModalEliminar,
        cancelarEliminar,
        confirmarEliminar,
    } = useEnfermedad(fincaId, estanqueId, onAlertChange);

    if (loading) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Cargando registros...</Text>
            </View>
        );
    }

    if (enfermedades.length === 0) {
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
            {
                enfermedades.map((registro) => (
                    <Card
                        key={registro.id}
                        style={[styles.cardRegistro, { borderLeftColor: COLORS.Enfermedades }]}
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
                                <Text style={styles.label}>
                                    Colaborador
                                </Text>
                                <Text style={styles.value}>
                                    {registro.nombreCreadoPor}
                                </Text>
                            </View>


                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Fecha
                                </Text>
                                <Text style={styles.value}>
                                    {new Date(registro.fechaReporte).toLocaleDateString("es-CR")}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Nombre Enfermedad
                                </Text>
                                <Text style={styles.value}>
                                    {registro.enfermedad ? registro.enfermedad.charAt(0).toUpperCase() + registro.enfermedad.slice(1) : ""}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Severidad
                                </Text>
                                <Text style={styles.value}>
                                    {registro.severidad ? registro.severidad.charAt(0).toUpperCase() + registro.severidad.slice(1) : ""}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Reporte
                                </Text>
                                <Text style={styles.value}>
                                    {registro.reporte}
                                </Text>
                            </View>

                        </View>
                        <View style={styles.Buttons}>
                            <Button
                                style={styles.Eliminar}
                                onPress={() => abrirModalEliminar(registro)}
                            >
                                <Icon
                                    icon={ICONS.delete}
                                    color={COLORS.error}
                                    size={20}
                                />
                                <Text size={12} color={COLORS.error}>
                                    Eliminar
                                </Text>
                            </Button>

                            <Button
                                style={styles.Editar}
                                onPress={() => onEditar(registro.id)}
                            >
                                <Icon
                                    icon={ICONS.edit}
                                    color={COLORS.primary}
                                    size={20}
                                />
                                <Text size={12} color={COLORS.primary}>
                                    Editar
                                </Text>
                            </Button>
                        </View>


                    </Card>
                ))
            }

            <ModalEliminar
                visible={modalVisible}
                title="registro de enfermedades"
                message={enfermedadSeleccionada?.enfermedad}
                onCancel={cancelarEliminar}
                onConfirm={confirmarEliminar}
                loading={loadingEliminar}
            />
        </>
    )
}