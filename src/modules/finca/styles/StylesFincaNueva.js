import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
        paddingTop: 10,
    },
    content: {
        padding: 12,
        paddingBottom: 28,
    },
    contentWrapper: {
        width: "100%",
        maxWidth: 700,
        alignSelf: "center",
    },
    sectionTitle: {
        fontWeight: "700",
        marginBottom: 12,
        color: COLORS.textPrimary,
        letterSpacing: 0.3,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    column: {
        flex: 1,
        minWidth: 150,
    },
    buttonContainer: {
        width: "100%",
        maxWidth: 700,
        alignSelf: "center",
        marginTop: 12,
    },
    saveButton: {
        width: "100%",
        minHeight: 56,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 16,
    },
    phoneHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 12,
    },
    addPhoneButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.secondary,
    },
    phoneRowWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
    },
    removePhoneButton: {
        backgroundColor: COLORS.surface,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    wrapperError: {
        borderWidth: 1.5,
        borderColor: COLORS.error,
        borderRadius: 8,
        padding: 3,
        backgroundColor: COLORS.errorLight,
    },
    errorBox: {
        backgroundColor: COLORS.errorLight,
        padding: 12,
        borderRadius: 8,
        marginTop: 14,
        borderWidth: 1,
        borderColor: COLORS.error,
        alignItems: "center",
    },
    errorBoxText: {
        color: COLORS.error,
        fontWeight: "600",
        fontSize: 14,
    },
    blackTextLabels: {
        color: COLORS.black,
    },
    requiredText: {
        color: COLORS.error,
    },
    fullWidthRow: {
        width: "100%",
        marginTop: 10,
    },
});