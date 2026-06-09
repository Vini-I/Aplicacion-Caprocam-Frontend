import React from "react";
import { FlatList, Text } from "react-native";
import Card from "../../../shared/components/Card";

export default function AlimentacionList({
    alimentaciones = []
}) {
    const renderItem = ({ item }) => (
        <Card title={item.estanque}>
            <Text>{item.cantidadKg} Kg</Text>
        </Card>
    );

    return (
        <FlatList
            data={alimentaciones}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
}