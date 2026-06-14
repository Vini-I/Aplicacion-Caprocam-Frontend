/**
 * ============================================================
 * PANTALLA: PRODUCTFORM
 * ============================================================
 *
 * Módulo: Inventarios
 *
 * Esta pantalla permite registrar un nuevo producto y también
 * queda preparada para editar productos existentes en el futuro.
 *
 * La edición completa se manejará desde la futura lista de inventarios:
 * - La lista tendrá el botón de editar.
 * - La lista enviará el producto seleccionado mediante productToEdit.
 * - Este formulario cargará los datos y permitirá guardar cambios.
 *
 * COMPONENTES UTILIZADOS:
 * - Navbar: encabezado de la pantalla.
 * - Card: contenedor visual del formulario.
 * - Input: campos de texto normales.
 * - Select: campos desplegables.
 * - NumberInput: campos numéricos con flechas.
 * - ProductDateInput: calendario propio del módulo de inventarios.
 * - Button: botón para guardar.
 *
 * CAMPOS DEL PRODUCTO:
 * - Nombre
 * - Categoría
 * - Proveedor
 * - Fecha de ingreso
 * - Fecha de caducidad
 * - Cantidad
 * - Unidad
 * - Stock mínimo
 * - Moneda
 * - Precio
 *
 * NOTA:
 * El botón tipo lápiz NO pertenece a este formulario.
 * Ese botón deberá colocarse después en la lista de inventarios.
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import NumberInput from "../../../shared/components/NumberInput";
import DateInput from "../../../shared/components/DateInput";
import { TYPOGRAPHY } from '../../../theme/typography';
import { COLORS } from "../../../theme/colors";
import CustomText from "../../../shared/components/Text";

/**
 * Estado inicial del formulario.
 *
 * Se usa cuando:
 * - Se abre el formulario para crear un producto nuevo.
 * - Se limpia el formulario después de guardar.
 * - No se recibe ningún producto para editar.
 */

const initialForm = {
  name: "",
  category: "",
  supplierId: "",
  entryDate: "",
  expirationDate: "",
  quantity: "",
  unit: "kg",
  minStock: "",
  currency: "usd",
  price: "",
};

export default function ProductForm({
  productToEdit = null,
  onSave = () => {},
}) {
  /**
   * form:
   * Guarda los datos actuales que el usuario escribe o selecciona.
   */
  const [form, setForm] = useState(initialForm);

  /**
   * originalForm:
   * Guarda una copia del producto original.
   * Sirve para saber si el usuario hizo cambios.
   */
  const [originalForm, setOriginalForm] = useState(initialForm);

  /**
   * useEffect:
   * Se ejecuta cuando cambia productToEdit.
   *
   * Si viene un producto desde la futura lista de inventarios,
   * el formulario carga esos datos.
   *
   * Si no viene ningún producto, el formulario queda vacío.
   */
  useEffect(() => {
    if (productToEdit) {
      const productData = {
        ...initialForm,
        ...productToEdit,
      };

      setForm(productData);
      setOriginalForm(productData);
    } else {
      setForm(initialForm);
      setOriginalForm(initialForm);
    }
  }, [productToEdit]);

  /**
   * Indica si el formulario está creando o editando.
   *
   * true  = editar producto existente
   * false = crear producto nuevo
   */
  const isEditMode = !!productToEdit;

  /**
   * Compara el formulario actual con el formulario original.
   *
   * Si son diferentes, significa que el usuario realizó cambios.
   */
  const hasChanges =
    JSON.stringify(form) !== JSON.stringify(originalForm);

  /**
   * Validación de campos obligatorios.
   *
   * Por ahora son obligatorios:
   * - Nombre
   * - Categoría
   * - Fecha de ingreso
   * - Cantidad
   * - Stock mínimo
   * - Precio
   *
   * Proveedor y fecha de caducidad quedan opcionales.
   */
  const hasRequiredData =
    (form.name || "").trim() !== "" &&
    form.category !== "" &&
    form.entryDate !== "" &&
    form.quantity !== "" &&
    form.minStock !== "" &&
    form.price !== "";

  /**
   * Controla si el botón puede guardar.
   *
   * En modo crear:
   * - Se puede guardar si los campos obligatorios están completos.
   *
   * En modo editar:
   * - Se puede guardar si los campos están completos y además hubo cambios.
   */
  const canSave = isEditMode
    ? hasRequiredData && hasChanges
    : hasRequiredData;

  /**
   * Mensaje de ayuda que se muestra debajo del botón.
   */
  const validationMessage = !hasRequiredData
    ? "Complete los campos obligatorios para guardar el producto."
    : isEditMode && !hasChanges
      ? "Realice algún cambio para guardar la actualización."
      : "";

  /**
   * Opciones temporales para los selects.
   * Más adelante pueden venir desde una API o desde otro módulo.
   */
  const categories = [
    { label: "Alimento", value: "alimento" },
    { label: "Insumos", value: "insumos" },
    { label: "Equipos", value: "equipos" },
    { label: "Salud", value: "salud" },
  ];

  const suppliers = [
    { label: "Proveedor 1", value: "1" },
    { label: "Proveedor 2", value: "2" },
  ];

  const units = [
    { label: "kg", value: "kg" },
    { label: "g", value: "g" },
    { label: "L", value: "l" },
    { label: "mL", value: "ml" },
  ];

  const currencies = [
    { label: "$", value: "usd" },
    { label: "₡", value: "crc" },
  ];

  /**
   * Actualiza un campo específico del formulario.
   *
   * field: nombre del campo que se quiere actualizar.
   * value: nuevo valor del campo.
   */
  function handleField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /**
   * Guarda la información del producto.
   *
   * Si faltan datos obligatorios, no hace nada.
   * Si todo está correcto:
   * - Crea un objeto productData.
   * - Mantiene el id si se está editando.
   * - Crea un id temporal si es producto nuevo.
   * - Envía los datos usando onSave(productData).
   */
  function handleSubmit() {
    if (!canSave) return;

    const productData = {
      ...form,
      id: productToEdit?.id ?? Date.now(),
    };

    console.log(productData);
    onSave(productData);

    setOriginalForm(productData);

    /**
     * Si es un producto nuevo, se limpia el formulario.
     * Si es edición, no se limpia porque se mantienen los datos editados.
     */
    if (!isEditMode) {
      setForm(initialForm);
      setOriginalForm(initialForm);
    }
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title={isEditMode ? "Editar producto" : "Nuevo producto"}
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card
          title="Información del producto"
          style={styles.card}
          titleStyle={styles.cardTitle}
        >
          <Input
            label="Nombre del producto"
            value={form.name}
            onChangeText={(val) => handleField("name", val)}
            placeholder="Ej. Alimento camarón 35%"
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          <Select
            label="Categoría"
            value={form.category}
            options={categories}
            onChange={(val) => handleField("category", val)}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          <Select
            label="Proveedor"
            value={form.supplierId}
            options={suppliers}
            onChange={(val) => handleField("supplierId", val)}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          <DateInput
            label="Fecha de ingreso"
            value={form.entryDate}
            onChangeText={(val) => handleField("entryDate", val)}
            containerStyle={styles.field}
            labelStyle={styles.label}
          />

          <DateInput
            label="Fecha de caducidad"
            value={form.expirationDate}
            onChangeText={(val) => handleField("expirationDate", val)}
            allowFutureDates={true}
            containerStyle={styles.field}
            labelStyle={styles.label}
          />

          <NumberInput
            label="Cantidad"
            value={form.quantity}
            onChangeText={(val) => handleField("quantity", val)}
            min={0}
            max={9999}
            step={1}
            containerStyle={styles.field}
            labelStyle={styles.label}
            style={styles.numberInput}
          />

          <Select
            label="Unidad"
            value={form.unit}
            options={units}
            onChange={(val) => handleField("unit", val)}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          <NumberInput
            label="Stock mínimo"
            value={form.minStock}
            onChangeText={(val) => handleField("minStock", val)}
            min={0}
            max={9999}
            step={1}
            containerStyle={styles.field}
            labelStyle={styles.label}
            style={styles.numberInput}
          />

          <Select
            label="Moneda"
            value={form.currency}
            options={currencies}
            onChange={(val) => handleField("currency", val)}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          <Input
            label="Precio"
            value={form.price}
            onChangeText={(val) => handleField("price", val)}
            placeholder="0.00"
            keyboardType="numeric"
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          <Button
            onPress={handleSubmit}
            disabled={!canSave}
            style={[
              styles.saveButton,
              !canSave && styles.saveButtonDisabled,
            ]}
            textStyle={styles.saveButtonText}
          >
            {isEditMode ? "Guardar cambios" : "Guardar producto"}
          </Button>

          {validationMessage !== "" && (
            <CustomText style={styles.validationText}>
              {validationMessage}
            </CustomText>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.primary,
    paddingVertical: 16,
  },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: COLORS.white,
    borderColor: COLORS.header,
  },

  cardTitle: {
    fontSize: 19,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.black,
    marginBottom: 6,
  },

  input: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  numberInput: {
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
  },

  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },

  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
  },

  saveButtonDisabled: {
    backgroundColor: COLORS.textQuaternary || "#D1D5DB",
  },

  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },

  validationText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});