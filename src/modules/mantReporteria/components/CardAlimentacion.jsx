import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import useAlimentacion from "../hooks/useAlimentacion.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

export default function CardAlimentacion({ fincaId, estanqueId, onEditar, onAlertChange }) {
    const {
        alimentaciones,
        loading,
        alert,

        modalVisible,
        alimentacionSeleccionada,
        loadingEliminar,
        abrirModalEliminar,
        cancelarEliminar,
        confirmarEliminar,
    } = useAlimentacion(fincaId, estanqueId, onAlertChange);

    if (loading) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Cargando registros...</Text>
            </View>
        );
    }

    if (alimentaciones.length === 0) {
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
            {alimentaciones.map((registro) => (
                <Card
                    key={registro.id}
                    style={[styles.cardRegistro, { borderLeftColor: COLORS.Alimentacion }]}
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
                            <Text style={styles.label}>Producto</Text>
                            <Text style={styles.value}>{registro.nombreProducto}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Fecha</Text>
                            <Text style={styles.value}>
                                {new Date(registro.fecha).toLocaleDateString("es-CR")}
                            </Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Hora</Text>
                            <Text style={styles.value}>{registro.hora}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Tipo de Alimento</Text>
                            <Text style={styles.value}>{registro.tipoAlimento}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Metodo de Alimentación</Text>
                            <Text style={styles.value}>{registro.metodo}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Proveedor</Text>
                            <Text style={styles.value}>{registro.proveedor}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Presentacion</Text>
                            <Text style={styles.value}>{registro.presentacion}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Observaciones</Text>
                            <Text style={styles.value}>{registro.observaciones}</Text>
                        </View>
                    </View>

                    <View style={styles.pesoContainer}>
                        <Text style={styles.label}>Cantidad KG</Text>
                        <Text style={styles.cantidadKg}>{registro.cantidadKg} Kg</Text>
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
                title="registro de alimentación"
                message={alimentacionSeleccionada?.tipoAlimento}
                onCancel={cancelarEliminar}
                onConfirm={confirmarEliminar}
                loading={loadingEliminar}
            />
        </>
    );
}