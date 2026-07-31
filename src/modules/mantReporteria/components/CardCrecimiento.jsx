import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx"
import Icon from "../../../shared/components/Icons.jsx"

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

export default function CardCrecimiento({ data }) {

    console.log("DATOS CRECIMIENTO:", data);

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
                                    Colaborador
                                </Text>
                                <Text style={styles.value}>
                                    {registro.nombreColaborador}
                                </Text>
                            </View>


                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Fecha
                                </Text>
                                <Text style={styles.value}>
                                    {new Date(registro.fecha_registro).toLocaleDateString("es-CR")}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pesoContainer}>
                            <Text style={styles.label}>
                                Peso actual
                            </Text>

                            <Text style={styles.peso}>
                                {registro.peso_actual} g
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