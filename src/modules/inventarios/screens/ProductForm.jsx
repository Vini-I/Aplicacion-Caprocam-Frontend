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

// modules/inventarios/screens/ProductForm.jsx

import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";


import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import NumberInput from "../../../shared/components/NumberInput";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import DateInput from "../../../shared/components/DateInput";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/productoStyles";

import { addProducto, updateProducto } from "../services/inventarioService";
import { getProveedores, getProveedoresByCategoria } from "../services/proveedoresService";

// ─────────────────────────────────────────────
// Opciones de selects
// ─────────────────────────────────────────────
const CATEGORIAS = [
  { label: "Alimentación", value: "Alimentación" },
  { label: "Tratamiento", value: "Tratamiento" },
  { label: "Químico", value: "Químico" },
  { label: "Fertilizante", value: "Fertilizante" },
  { label: "Antibiótico", value: "Antibiótico" },
  { label: "Probiótico", value: "Probiótico" },
];

const UNIDADES = [
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "litros", value: "litros" },
  { label: "mL", value: "mL" },
  { label: "unidades", value: "unidades" },
];

// ─────────────────────────────────────────────
// Estado inicial limpio (sin fechas)
// ─────────────────────────────────────────────
const initialForm = {
  nombre: "",
  categoria: "",
  proveedor: "",
  cantidad: "",
  unidad: "kg",
  stockMinimo: "",
  precioUnidad: "",
};

export default function ProductForm() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [form, setForm] = useState(initialForm);
  const [originalForm, setOriginalForm] = useState(initialForm);
  const [productoId, setProductoId] = useState(null); // null = modo crear
  const [opcionesProveedores, setOpcionesProveedores] = useState([]);

  useEffect(() => {
    const lista = getProveedoresByCategoria(form.categoria).map((p) => ({
      label: p.nombre,
      value: p.nombre,
    }));
    setOpcionesProveedores(lista);
    // Si el proveedor seleccionado ya no está en la lista, lo limpia
    if (form.proveedor && !lista.find((p) => p.value === form.proveedor)) {
      setForm((prev) => ({ ...prev, proveedor: "" }));
    }
  }, [form.categoria]);

  // ── Carga datos si viene un producto para editar ──
  useEffect(() => {
    if (params?.productoParam) {
      try {
        const producto = JSON.parse(params.productoParam);

        const cargado = {
          nombre: producto.nombre ?? "",
          categoria: producto.categoria ?? "",
          proveedor: producto.proveedor ?? "",
          cantidad: producto.cantidad !== undefined ? String(producto.cantidad) : "",
          unidad: producto.unidad ?? "kg",
          stockMinimo: producto.stockMinimo !== undefined ? String(producto.stockMinimo) : "",
          precioUnidad: producto.precioUnidad !== undefined ? String(producto.precioUnidad) : "",
        };

        setForm(cargado);
        setOriginalForm(cargado);
        setProductoId(producto.id);
      } catch {
        // param malformado → modo crear
        setForm(initialForm);
        setOriginalForm(initialForm);
        setProductoId(null);
      }
    } else {
      setForm(initialForm);
      setOriginalForm(initialForm);
      setProductoId(null);
    }
  }, [params?.productoParam]);

  const isEditMode = productoId !== null;

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  const hasRequiredData =
    form.nombre.trim() !== "" &&
    form.categoria !== "" &&
    form.cantidad !== "" &&
    form.stockMinimo !== "" &&
    form.precioUnidad !== "";

  const canSave = isEditMode ? hasRequiredData && hasChanges : hasRequiredData;

  const validationMessage = !hasRequiredData
    ? "Complete los campos obligatorios para guardar."
    : isEditMode && !hasChanges
      ? "Realice algún cambio para guardar la actualización."
      : "";

  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function handleCategoriaChange(value) {
    const categoriasConCaducidad = ["Alimentación", "Tratamiento"];

    setForm((prev) => ({
      ...prev,
      categoria: value,
      // Si la nueva categoría no requiere fecha, la limpia
      expirationDate: categoriasConCaducidad.includes(value) ? prev.expirationDate : "",
    }));
  }

  function handleSubmit() {
    if (!canSave) return;

    const producto = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      proveedor: form.proveedor,
      cantidad: Number(form.cantidad),
      unidad: form.unidad,
      stockMinimo: Number(form.stockMinimo),
      precioUnidad: Number(form.precioUnidad),
    };

    if (isEditMode) {
      updateProducto({ ...producto, id: productoId });
      router.replace({
        pathname: "/(drawer)/inventarios/detalleProducto",
        params: { id: productoId.toString() },
      });
    } else {
      addProducto(producto);
      router.replace("/(drawer)/inventarios/inventarioScreen");
    }
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title={isEditMode ? "Editar producto" : "Nuevo producto"}
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button
            variant="ghost"
            onPress={() =>
              isEditMode
                ? router.replace({
                  pathname: "/(drawer)/inventarios/detalleProducto",
                  params: { id: productoId.toString() },
                })
                : router.replace("/(drawer)/inventarios/inventarioScreen")
            }
            style={styles.backBtn}
          >
            <Icon icon={ICONS.exit} size={20} color={COLORS.white} />
          </Button>
        }
        rightContent={
          // Placeholder invisible para balancear y no empujar altura
          <View style={styles.navbarPlaceholder} />
        }
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
          {/* Nombre */}
          <Input
            label="Nombre del producto *"
            value={form.nombre}
            onChangeText={(v) => handleField("nombre", v)}
            placeholder="Ej. Alimento camarón 35%"
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          {/* Categoría */}
          <Select
            label="Categoría *"
            value={form.categoria}
            options={CATEGORIAS}
            onChange={handleCategoriaChange}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          {/* Proveedor */}
          <Select
            label="Proveedor"
            value={form.proveedor}
            options={opcionesProveedores}
            onChange={(v) => handleField("proveedor", v)}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          {/* Cantidad */}
          <NumberInput
            label="Cantidad *"
            value={form.cantidad}
            onChangeText={(v) => handleField("cantidad", v)}
            min={0}
            max={99999}
            step={1}
            containerStyle={styles.field}
            labelStyle={styles.label}
            style={styles.numberInput}
          />

          {/* Unidad */}
          <Select
            label="Unidad"
            value={form.unidad}
            options={UNIDADES}
            onChange={(v) => handleField("unidad", v)}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          {/* Stock mínimo */}
          <NumberInput
            label="Stock mínimo *"
            value={form.stockMinimo}
            onChangeText={(v) => handleField("stockMinimo", v)}
            min={0}
            max={99999}
            step={1}
            containerStyle={styles.field}
            labelStyle={styles.label}
            style={styles.numberInput}
          />

          {/* Precio por unidad */}
          <Input
            label="Precio por unidad *"
            value={form.precioUnidad}
            onChangeText={(v) => handleField("precioUnidad", v)}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          <DateInput
            label="Fecha de ingreso"
            value={form.entryDate}
            onChangeText={(val) => handleField("entryDate", val)}
            containerStyle={styles.field}
            labelStyle={styles.label}
          />

          {(form.categoria === "Alimentación" || form.categoria === "Tratamiento") && (
            <DateInput
              key={form.categoria}              // ← esto es lo que fuerza el remount
              label="Fecha de caducidad"
              value={form.expirationDate}
              onChangeText={(val) => handleField("expirationDate", val)}
              allowFutureDates={true}
              containerStyle={styles.field}
              labelStyle={styles.label}
            />
          )}

          {/* Botón guardar */}
          <Button
            onPress={handleSubmit}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
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