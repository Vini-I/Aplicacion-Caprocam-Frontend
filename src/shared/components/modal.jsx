
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CustomModal({ visible, onClose, children }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {children}
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.text}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    container: {
        width: "85%",
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#F3F4FC"
    },
    button: {
        marginTop: 16,
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: "#009EF5"
    },
    text: {
        color: "#FFF",
        fontWeight: "600"
    }
});