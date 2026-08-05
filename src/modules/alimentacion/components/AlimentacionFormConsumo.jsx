/**
 * ============================================================
 * COMPONENTE ALIMENTACIONFORMCONSUMO
 * ============================================================
 *
 * Sección "Consumo" del formulario de Alimentación: cantidad en
 * Kg (obligatoria, con asterisco + borde rojo + mensaje de error
 * tras submitted), proveedor y producto.
 *
 * Proveedor y Producto ahora usan el catálogo real (useProveedorProductoAlimentacion),
 * en vez de la lista fija hardcodeada que había antes: eso guardaba
 * texto libre y dejaba proveedor_id/producto_id siempre en NULL.
 * Al elegir un proveedor, se guarda su id (idProveedor -> proveedor_id)
 * y también su nombre (proveedor, para mantener compatibilidad con
 * la columna de texto libre).
 *
 * Props principales:
 * - form, updateField, submitted, errores (mismos que recibe
 *   AlimentacionForm).
 *
 * Ejemplo:
 * <AlimentacionFormConsumo form={form} updateField={updateField} submitted={submitted} errores={errores} />
 */

import React from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/AlimentacionStyles";
import { useProveedorProductoAlimentacion } from "../hooks/useProveedorProductoAlimentacion";

export default function AlimentacionFormConsumo({
  form = {},
  updateField = () => { },
  submitted = false,
  errores = {},
}) {
  const { proveedoresOptions, productosOptions } = useProveedorProductoAlimentacion(form.idProveedor);

  const handleProveedorChange = (idProveedor) => {
    updateField("idProveedor", idProveedor);
    const seleccionado = proveedoresOptions.find((p) => String(p.value) === String(idProveedor));
    updateField("proveedor", seleccionado ? seleccionado.label : "");
    // Al cambiar de proveedor, el producto elegido ya no aplica
    // (pertenecia al proveedor anterior).
    updateField("idProducto", "");
  };

  return (
    <Card>
      <View style={styles.sectionTitleRow}>
        <Icon icon={ICONS.weight} size={18} color={COLORS.primary} style={styles.sectionIcon} />
        <Text size={18} weight="700" color={COLORS.textSecondary}>
          Consumo
        </Text>
      </View>

      <Input
        label="Cantidad (Kg)"
        placeholder="Ej: 20"
        value={String(form.cantidadKg ?? "")}
        keyboardType="numeric"
        maxLength={6}
        onChangeText={(v) => {
          const soloNumeros = v.replace(/[^0-9]/g, "");
          updateField("cantidadKg", soloNumeros);
        }}
        required
        submitted={submitted}
        error={submitted ? (errores.cantidadKg || "") : ""}
      />

      <Select
        label="Proveedor"
        value={form.idProveedor}
        onChange={handleProveedorChange}
        options={proveedoresOptions}
        placeholder="Seleccionar proveedor"
        required
        submitted={submitted}
        error={submitted ? (errores.proveedor || "") : ""}
      />

      <Select
        label="Producto"
        value={form.idProducto}
        onChange={(v) => updateField("idProducto", v)}
        options={productosOptions}
        placeholder={form.idProveedor ? "Seleccionar producto" : "Primero elija un proveedor"}
        required
        submitted={submitted}
        error={submitted ? (errores.producto || "") : ""}
      />
    </Card>
  );
}

