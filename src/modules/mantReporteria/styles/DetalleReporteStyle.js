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
        marginTop: 16,
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
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        backgroundColor: COLORS.white,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primary,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 4,
    },

    infoItem: {
        width: "48%",
        marginBottom: 12,
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: COLORS.surface,
        borderRadius: 8,
    },

    label: {
        fontSize: 11,
        color: COLORS.textTertiary,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        marginBottom: 3,
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },

    value: {
        fontSize: 14,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.textSecondary,
    },

    //queridos compañeres antes que pregunten, se que el nombre de la clase es pesoContainer y peso label
    // no son extrictamente para el peso sino para un todo,
    // pero no se me ocurrio otro nombre y ya lo deje asi, no me juzguen por eso
    pesoContainer: {
        marginTop: 8,
        marginBottom: 8,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: COLORS.surface,
    },

    pesoLabel: {
        fontSize: 11,
        color: COLORS.textTertiary,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        marginBottom: 4,
    },

    peso: {
        fontSize: 26,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontWeight: "800",
        color: COLORS.Crecimiento,
    },

    infeccion: {
        fontSize: 26,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontWeight: "800",
        color: COLORS.Parasitologia,
    },

    cantidadKg: {
        fontSize: 26,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontWeight: "800",
        color: COLORS.Alimentacion,
    },

    Sobrevivencia: {
        fontSize: 26,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontWeight: "800",
        color: COLORS.Densidad,
    },

    muestreosContainer: {
        marginTop: 8,
        marginBottom: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: COLORS.surface,
        borderRadius: 10,
    },

    muestreosTitle: {
        fontSize: 11,
        color: COLORS.textTertiary,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        marginBottom: 8,
    },

    muestreoHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },

    muestreoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },

    muestreoNumero: {
        width: "12%",
        fontSize: 12,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.Crecimiento,
    },

    muestreoCantidad: {
        width: "30%",
        fontSize: 12,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        color: COLORS.textSecondary,
    },

    muestreoPesoTotal: {
        width: "30%",
        fontSize: 12,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        color: COLORS.textSecondary,
    },

    muestreoPromedio: {
        width: "28%",
        fontSize: 12,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.textSecondary,
        textAlign: "right",
    },

    muestreoHeaderText: {
        fontSize: 10,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.textTertiary,
        textTransform: "uppercase",
    },

    muestreosEmpty: {
        paddingVertical: 12,
        alignItems: "center",
    },

    muestreosEmptyText: {
        fontSize: 12,
        color: COLORS.textTertiary,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
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

    muestreoNumero: {
        width: "25%",
        fontSize: 12,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.Densidad,
        textAlign: "center",
    },

    muestreoCantidad: {
        width: "75%",
        fontSize: 12,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        color: COLORS.textSecondary,
        textAlign: "center",
    },
});