import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx"
import Icon from "../../../shared/components/Icons.jsx"

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

export default function CardAlimentacion({ data }) {

    return (
        <>
            {
                data.map((registro) => (
                    <Card
                        key={registro.id}
                        style={styles.cardRegistro}

                    >
                        <View style={styles.infoGrid}> 
                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Finca
                                </Text>
                                <Text style={styles.value}>
                                    {registro.nombreFinca}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Estanque
                                </Text>
                                <Text style={styles.value}>
                                    {registro.codigoEstanque}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Producto
                                </Text>
                                <Text style={styles.value}>
                                    {registro.idProducto}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Fecha
                                </Text>
                                <Text style={styles.value}>
                                    {new Date(registro.fecha).toLocaleDateString("es-CR")}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Hora
                                </Text>
                                <Text style={styles.value}>
                                    {(registro.hora)}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Tipo de Alimento
                                </Text>
                                <Text style={styles.value}>
                                    {registro.tipoAlimento}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Metodo de Alimentación
                                </Text>
                                <Text style={styles.value}>
                                    {registro.metodo}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Proveedor
                                </Text>
                                <Text style={styles.value}>
                                    {registro.proveedor}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Presentacion
                                </Text>
                                <Text style={styles.value}>
                                    {registro.presentacion}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Observaciones
                                </Text>
                                <Text style={styles.value}>
                                    {registro.observaciones}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pesoContainer}>
                            <Text style={styles.label}>
                                Cantidad KG
                            </Text>

                            <Text style={styles.peso}>
                                {registro.cantidadKg} Kg
                            </Text>
                        </View>

                        <View style={styles.Buttons}>
                            <Button
                                style={styles.Eliminar}
                                onPress={() => abrirModalEliminar(estanque)}
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
                                onPress={() => onEstanqueEditar(finca.codigoCBO, estanque.id)}
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
        </>
    )
}