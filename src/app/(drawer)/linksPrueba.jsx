import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function LinksPrueba() {
    return (
        
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    Links de Prueba
                </Text>

                <Link href="/inicio/" push style={{ marginTop: 10, color: 'blue' }}>
                    Go to Inicio
                </Link>

                 <Link href="/registros/" push style={{ marginTop: 10, color: 'blue' }}>
                    Go to Registros
                </Link>
                

                 <Link href="/reportes/" push style={{ marginTop: 10, color: 'blue' }}>
                    Go to Reportes
                </Link>

                <Link href="/colaboradores" push style={{ marginTop: 10, color: 'blue' }}>
                    Go to Colaboradores
                </Link>

                 <Link href="/login" push style={{ marginTop: 10, color: 'blue' }}>
                    Go to Login
                </Link>

                 <Link href="/venta" push style={{ marginTop: 10, color: 'blue' }}>
                    Go to venta
                </Link>

            </View>
    );
}