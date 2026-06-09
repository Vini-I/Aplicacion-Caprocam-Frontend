
import React from "react";
import {
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native";


export default function Spinner({
    size = "large",
    color = "#009EF5"
}) {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                size={size}
                color={color}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    }
});