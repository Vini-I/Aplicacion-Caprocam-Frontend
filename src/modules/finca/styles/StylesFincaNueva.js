import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingTop: 10
    },

    content: {
        padding: 12,
        paddingBottom: 28
    },

    sectionTitle: {
        fontWeight: "700",
        marginBottom: 8
    },

    contentWrapper: {
        width: "100%",
        maxWidth: 700,
        alignSelf: "center"
    },

    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12
    },

    column: {
        flex: 1,
        minWidth: 150,
        maxWidth: 360
    },

    buttonContainer: {
        marginTop: 12,
        marginBottom: 8,
        width: "100%"
    }
});