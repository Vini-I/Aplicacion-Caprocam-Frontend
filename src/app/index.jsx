import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Placeholder() {
    return (
        
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    Login Placeholder
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

                 <Link href="/login" push style={{ marginTop: 10, color: 'blue' }}>
                    Go to Login
                </Link>

            </View>


    );
}