import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: COLORS.white
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    cardTitle: {
        fontSize: 16,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontWeight: "700",
        color: COLORS.textSecondary,
    },

    filterTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
    },

    icon: {
        marginRight: 8
    },

    filterDescription: {
        marginTop: 16,
        marginBottom: 16,
        color: COLORS.textTertiary
    },

    filtersSection: {
        gap: 16,
    },

    inputs: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
    },

    inputItem: {
        flex: 1,
    },

    lista: {
        width: "100%",
        maxWidth: 900,
        alignSelf: "center",
    },

    emptyState: {
        marginTop: 24,
        paddingVertical: 32,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.secondary,
        borderRadius: 12,
        backgroundColor: COLORS.surface
    },

    emptyTitle: {
        marginTop: 14,
        fontSize: 16,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.textSecondary,
    },

    emptyDescription: {
        marginTop: 8,
        textAlign: "center",
        color: COLORS.textTertiary,
        lineHeight: 20,
    },

    cardRegistro: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },

    actionButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    mainContent: {
        flexDirection: "column",
    },

    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    infoItem: {
        width: "48%",
        marginBottom: 8,
    },

    label: {
        fontSize: 11,
        color: COLORS.textTertiary,
        marginBottom: 1,
    },

    value: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },

    pesoContainer: {
        marginTop: 6,
        paddingTop: 8,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: COLORS.surface,
    },

    pesoLabel: {
        fontSize: 11,
        color: COLORS.textTertiary,
    },

    peso: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.Crecimiento,
    },

    Buttons: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        marginRight: 10,
      },
    
    Eliminar: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderColor: COLORS.error,
        borderWidth: 2,
        marginBottom: "auto",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 6,
        marginHorizontal: 2,
        height: "70%",
    },

    Editar: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderColor: COLORS.primary,
        borderWidth: 2,
        marginBottom: "auto",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 6,
        marginHorizontal: 2,
        height: "70%",
    },

    alertCorrect: {
        alignItems: "center",
        backgroundColor: COLORS.successLight,
        borderWidth: 1.5,
        borderColor: COLORS.success,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
    },

    alertIncorrect: {
        alignItems: "center",
        backgroundColor: COLORS.errorLight,
        borderWidth: 1.5,
        borderColor: COLORS.error,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
});