import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";

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
                                    {registro.finca_id}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Estanque
                                </Text>
                                <Text style={styles.value}>
                                    {registro.estanque_id}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Colaborador
                                </Text>
                                <Text style={styles.value}>
                                    {registro.colaborador_id}
                                </Text>
                            </View>


                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Fecha
                                </Text>
                                <Text style={styles.value}>
                                    {registro.fecha_registro}
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


                    </Card>
                ))
            }
        </>
    )
}