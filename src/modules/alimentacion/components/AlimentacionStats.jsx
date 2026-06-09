import React from "react";
import { View, Text } from "react-native";
import Card from "../../../shared/components/Card";

export default function AlimentacionStats() {
    return (
        <View>
            <Card title="Alimentaciones Hoy">
                <Text>24</Text>
            </Card>

            <Card title="Kg Suministrados">
                <Text>450 Kg</Text>
            </Card>

            <Card title="Estanques">
                <Text>12</Text>
            </Card>
        </View>
    );
}