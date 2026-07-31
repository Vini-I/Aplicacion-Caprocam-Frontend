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
 * - DateInput: calendario propio del módulo de inventarios.
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

import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";


import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import NumberInput from "../../../shared/components/NumberInput";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import DateInput from "../../../shared/components/DateInput";
import Alert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { useProductForm } from "../hooks/useProductForm";
import { CATEGORIAS,UNIDADES } from "../services/DataProductForm";

import { styles } from "../styles/ProductFormStyles";


export default function ProductForm() {
  const {
    form,
    opcionesProveedores,
    cargandoProveedores,
    errorProveedores,
    isEditMode,
    canSave,
    validationMessage,
    showExpirationDate,
    errorCodigo,
    errorNombre,
    errorCategoria,
    errorProveedor,
    errorCantidad,
    errorStockMinimo,
    errorPrecio,
    guardadoExitoso,
    guardando,
    errorGuardado,
    handleField,
    handleCategoriaChange,
    handleSubmit,
    handleBack,
  } = useProductForm();

  return (
    <>
      <Stack.Screen
        options={{ title: isEditMode ? "Editar Producto" : "Agregar Producto" }}
      />
      <View style={STYLE.container}>
      <ScrollView
        contentContainerStyle={[styles.content, STYLE.contentWrapper]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card
          title="Información del producto"
          style={styles.card}
          titleStyle={styles.cardTitle}
        >

          {/* Código / identificador */}
          <Input
            label="Código *"
            value={form.codigo}
            onChangeText={(v) => handleField("codigo", v)}
            placeholder="Ej. ALI-001"
            containerStyle={styles.field}
            style={[styles.input, errorCodigo && styles.inputError]}
            labelStyle={styles.label}
          />

          {/* Nombre */}
          <Input
            label="Nombre del producto *"
            value={form.nombre}
            onChangeText={(v) => handleField("nombre", v)}
            placeholder="Ej. Alimento camarón 35%"
            containerStyle={styles.field}
            style={[styles.input, errorNombre && styles.inputError]}
            labelStyle={styles.label}
          />

          {/* Categoría */}
          <Select
             label="Categoría *"
             value={form.categoria}
             options={CATEGORIAS}
             onChange={handleCategoriaChange}
             containerStyle={styles.field}
             selectStyle={[styles.select, errorCategoria && styles.inputError]}
             labelStyle={styles.label}
          />

          {/* Proveedor */}
          <Select
            label={cargandoProveedores ? "Proveedor * (cargando...)" : "Proveedor *"}
            value={form.proveedor}
            options={opcionesProveedores}
            onChange={(v) => handleField("proveedor", v)}
            containerStyle={styles.field}
            selectStyle={[styles.select, errorProveedor && styles.inputError]}
            labelStyle={styles.label}
          />

          {!!errorProveedores && (
            <Alert
              variant="danger"
              message={errorProveedores}
              style={styles.alertBox}
            />
          )}

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
            style={[styles.numberInput, errorCantidad && styles.inputError]}
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
            style={[styles.numberInput, errorStockMinimo && styles.inputError]}
          />

          {/* Precio por unidad */}
          <NumberInput
            label="Precio por unidad *"
            value={form.precioUnidad}
            onChangeText={(v) => handleField("precioUnidad", v)}
            min={0}
            max={999999}
            step={1}
            containerStyle={styles.field}
            labelStyle={styles.label}
            style={[styles.numberInput, errorPrecio && styles.inputError]}
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
              key={form.categoria}              
              label="Fecha de caducidad"
              value={form.expirationDate}
              onChangeText={(val) => handleField("expirationDate", val)}
              allowFutureDates={true}
              containerStyle={styles.field}
              labelStyle={styles.label}
            />
          )}
          
         {!!errorGuardado && (
            <Alert
              variant="danger"
              message={errorGuardado}
              style={styles.alertBox}
            />
          )}

          {!!errorGuardado && (
            <Alert
              variant="danger"
              message={errorGuardado}
              style={styles.alertBox}
            />
          )}

          {guardadoExitoso && (
            <Alert
              variant="success"
              message={isEditMode ? "Producto actualizado correctamente." : "Producto guardado correctamente."}
              style={styles.alertBox}
            />
          )}

          {validationMessage !== "" && (
            <Alert
              variant="danger"
              message={validationMessage}
              style={styles.alertBox}
            />
          )}

          {/* Botón guardar */}
          <Button
            variant="outline"
            onPress={handleSubmit}
            disabled={(isEditMode && !canSave) || guardadoExitoso || guardando}
            style={[styles.saveButton, isEditMode && !canSave && styles.saveButtonDisabled]}
            textStyle={styles.saveButtonText}
          >
            {guardando ? "Guardando..." : isEditMode ? "Guardar cambios" : "Guardar producto"}
          </Button>

         
        </Card>
      </ScrollView>
      </View>
    </>
  );
}