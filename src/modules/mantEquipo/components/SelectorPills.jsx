/**
 * ============================================================
 * COMPONENTE: SelectorPills
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Renderiza un selector interactivo horizontal con diseño tipo pills (pastillas),
 *   resaltando la opción activa mediante un fondo de color suave y borde de color.
 *   Utiliza los botones outline del estándar de diseño del proyecto.
 * 
 * DATOS / PROPS:
 * - value: string (Valor actualmente seleccionado)
 * - onChange: function (Callback disparado al seleccionar una pill)
 * - label: string (Título superior de la sección de pills)
 * - opciones: Array<{label: string, value: string}> (Colección de opciones)
 * 
 * VALIDACIONES / REGLAS:
 * - Los botones usan variante outline del color primario.
 * - Al activarse una opción, se resalta con un fondo suave de tonalidad azul.
 * 
 * NAVEGACIÓN:
 * - Ninguna.
 * 
 * DEPENDENCIAS:
 * - CustomText y Button de shared
 * - COLORS de theme, styles de mantEquipoStyles
 * ============================================================
 */

import React from "react";
import { View } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";

export default function SelectorPills({ value, onChange, label, opciones }) {
  return (
    <View style={styles.comboContainer}>
      <CustomText style={styles.comboLabel}>{label}</CustomText>
      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
        {opciones.map((op) => {
          const isActive = value === op.value;
          return (
            <Button
              key={op.value}
              variant="outline"
              onPress={() => onChange(op.value)}
              style={[
                { flex: 1, marginTop: 0, paddingVertical: 8, minWidth: 80, borderColor: COLORS.primary },
                isActive && { backgroundColor: COLORS.primaryLight }
              ]}
              textStyle={{ fontSize: 11, color: COLORS.primary, fontWeight: isActive ? "700" : "600" }}
            >
              {op.label}
            </Button>
          );
        })}
      </View>
    </View>
  );
}
