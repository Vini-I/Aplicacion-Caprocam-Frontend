/**
 * ============================================================
 * SISTEMA DE TIPOGRAFÍA CENTRALIZADO
 * ============================================================
 *
 * Define todos los tamaños de fuente utilizados en la aplicación.
 * Esto permite mantener consistencia visual y facilita cambios globales.
 *
 * USO:
 * import { TYPOGRAPHY } from '../theme/typography';
 * fontSize: TYPOGRAPHY.baseFontSize,
 * 
 * Dentro del codigo Text: 
 * <View style={styles.filaDetalle}>
        <Text estilo={styles.etiqueta} 
            fuente={TYPOGRAPHY.fontFamily.regular}> -----> DE ESTA FORMA SE DEBE UTILIZAR EL ROBOTO.
               ID:
            </Text>
        <Text estilo={styles.valor}>{finca.id}</Text>
    </View>
 * 
 * 
 */

export const TYPOGRAPHY = {
    fontFamily: {
        regular: "Roboto-Regular",
        medium: "Roboto-Medium",
        bold: "Roboto-Bold", 
    }
};