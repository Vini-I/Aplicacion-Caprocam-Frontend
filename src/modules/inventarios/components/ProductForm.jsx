import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";

export default function ProductForm() {
  const [form, setForm] = useState({
  name: "",
  category: "",
  supplierId: "",
  quantity: "",
  unit: "kg",
  minStock: "",
  currency: "usd",
  price: "",
});

// opciones de el select de categorias 
const categories = [
  { label: "Alimento", value: "alimento" },
  { label: "Insumos", value: "insumos" },
  { label: "Equipos", value: "equipos" },
  { label: "Salud", value: "salud" },
];


// estos son los proveedores que se tienen que pasar al agregar un proveedor 
const suppliers = [
  { label: "Proveedor 1", value: "1" },
  { label: "Proveedor 2", value: "2" },
];

// estas son las opciones de unidad de medida de el select 
const units = [
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "L", value: "l" },
  { label: "mL", value: "ml" },
];

// estos son los 2 tipos de cambio de los precios 
const currencies = [
  { label: "$", value: "usd" },
  { label: "₡", value: "crc" },
];

// Actualiza un campo específico del formulario
function handleField(field, value) {
    setForm((prev) => ({
      ...prev,   //mantiene los valores actuales del formulario
      [field]: value,// actualiza lolamnete el campo indicado
    }));
  }
  

  function handleSubmit() {
    console.log(form);
  }

  return (
    <View style={styles.screen}>
        {/* Este es el navbar se pone el titulo o lo que va a decir con brand... aqui le podemos agregar un boton con items[button] para que ese boton nos regresa a la pagina  */}
      <Navbar brand="Nuevo producto" />
{/* la carta que tiene todos los campos del formulario */}
      <Card title="Información del producto">
{/* el input para el nombre del producto... se usa el label para poner el titulo , name seria los datos que se le pasan  */}
        <Input
          label="Nombre del producto"
          value={form.name}
          onChangeText={(val) => handleField("name", val)}
          placeholder="Ej. Alimento camarón 35%"
        />
        {/* el select de categoria donde con base a las opciones categories */}
        <Select
          label="Categoría"
          value={form.category}
          options={categories}
          onChange={(val) => handleField("category", val)}
        />
        {/* el select de proveedores que los proveedores se agregan a esta lista cuando son agregados */}
        <Select
          label="Proveedor"
          value={form.supplierId}
          options={suppliers}
          onChange={(val) => handleField("supplierId", val)}
        />
        {/* el input parar la cantidad  */}
        <Input
          label="Cantidad"
          value={form.quantity}
          onChangeText={(val) => handleField("quantity", val)}
          placeholder="0"
        />

        <Select
          label="Unidad"
          value={form.unit}
          options={units}
          onChange={(val) => handleField("unit", val)}
        />
        
        <Input
          label="Stock mínimo"
          value={form.minStock}
          onChangeText={(val) => handleField("minStock", val)}
          placeholder="0"
        />
        {/* con base a el currencies se le ponen las opciones de moneda */}
        <Select
          label="Moneda"
          value={form.currency}
          options={currencies}
          onChange={(val) => handleField("currency", val)}
        />
        {/* El input para el presio */}
        <Input
          label="Precio"
          value={form.price}
          onChangeText={(val) => handleField("price", val)}
          placeholder="0.00"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
});