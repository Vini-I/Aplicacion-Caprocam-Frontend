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
    }

})