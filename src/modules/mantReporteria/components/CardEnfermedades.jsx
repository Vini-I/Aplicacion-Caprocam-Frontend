import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button.jsx"
import Icon from "../../../shared/components/Icons.jsx"

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";

import { styles } from "../styles/DetalleReporteStyle.js";

export default function CardEnfermedades({ data }) {

    console.log("DATOS ENFERMEDADES:", data);

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
                                    {new Date(registro.fechaReporte).toLocaleDateString("es-CR")}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Nombre Enfermedad
                                </Text>
                                <Text style={styles.value}>
                                    {registro.enfermedad}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Severidad
                                </Text>
                                <Text style={styles.value}>
                                    {registro.severidad.charAt(0).toUpperCase() + registro.severidad.slice(1)}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>
                                    Mortalidad
                                </Text>
                                <Text style={styles.value}>
                                    {registro.mortalidadRegistrada}
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