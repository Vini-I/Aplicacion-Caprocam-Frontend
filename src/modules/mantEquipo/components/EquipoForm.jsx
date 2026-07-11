/**
 * ============================================================
 * COMPONENTE: EquipoForm
 * ============================================================
 *
 * Formulario para crear o editar equipos.
 * Incluye validaciones de campos y generación automática de código.
 *
 * Props:
 * - initialData: objeto con datos iniciales (para edición)
 * - onSubmit: función que recibe los datos del formulario al enviar
 * - isEditing: booleano que indica si es edición
 * - tiposEquipo: lista de tipos disponibles
 * - subcategorias: lista de subcategorías según el tipo seleccionado
 * - estanquesDisponibles: lista de estanques para asociar
 *
 * Ejemplo:
 * <EquipoForm
 *   initialData={{}}
 *   onSubmit={handleSubmit}
 *   isEditing={false}
 *   tiposEquipo={tipos}
 *   subcategorias={subcats}
 *   estanquesDisponibles={estanques}
 * />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import DateInput from "../../../shared/components/DateInput";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/equiposListStyles";
import { COLORS } from "../../../theme/colors";

// ============================================================
// VALIDADORES
// ============================================================
const validarNombre = (nombre) => {
  if (!nombre || !nombre.trim()) return "El nombre del equipo es obligatorio";
  if (nombre.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  return "";
};

const validarDescripcion = (descripcion) => {
  if (!descripcion || !descripcion.trim()) return "La descripción es obligatoria";
  if (descripcion.trim().length < 5) return "La descripción debe tener al menos 5 caracteres";
  return "";
};

const validarMarca = (marca) => {
  if (!marca || !marca.trim()) return "La marca es obligatoria";
  return "";
};

const validarModelo = (modelo) => {
  if (!modelo || !modelo.trim()) return "El modelo es obligatorio";
  return "";
};

const validarSerie = (serie) => {
  if (!serie || !serie.trim()) return "El número de serie es obligatorio";
  return "";
};

const validarFuncion = (funcion) => {
  if (!funcion || !funcion.trim()) return "La función del equipo es obligatoria";
  return "";
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function EquipoForm({
  initialData = {},
  onSubmit,
  isEditing = false,
  tiposEquipo = [],
  subcategorias = [],
  estanquesDisponibles = [],
}) {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [form, setForm] = useState({
    nombre: initialData.nombre || "",
    descripcion: initialData.descripcion || "",
    tipo: initialData.tipo || "",
    subcategoria: initialData.subcategoria || "",
    marca: initialData.marca || "",
    modelo: initialData.modelo || "",
    serie: initialData.serie || "",
    fechaInstalacion: initialData.fechaInstalacion || "",
    funcionEquipo: initialData.funcionEquipo || "",
    ubicacion: initialData.ubicacion || "",
    estanqueId: initialData.estanqueId || "",
    estado: initialData.estado || "activo",
    horasMantenimiento: initialData.horasMantenimiento || "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Actualizar subcategorías cuando cambia el tipo
  useEffect(() => {
    if (form.tipo) {
      const subcats = subcategorias[form.tipo] || [];
      if (subcats.length > 0 && !subcats.find(s => s.value === form.subcategoria)) {
        setForm(prev => ({ ...prev, subcategoria: "" }));
      }
    }
  }, [form.tipo, subcategorias]);

  // --------------------------------------------------------
  // MANEJADORES
  // --------------------------------------------------------
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTipoChange = (value) => {
    setForm(prev => ({ ...prev, tipo: value, subcategoria: "" }));
    if (errors.tipo) {
      setErrors(prev => ({ ...prev, tipo: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nombreError = validarNombre(form.nombre);
    if (nombreError) newErrors.nombre = nombreError;
    
    const descError = validarDescripcion(form.descripcion);
    if (descError) newErrors.descripcion = descError;
    
    if (!form.tipo) newErrors.tipo = "Debe seleccionar un tipo de equipo";
    
    const marcaError = validarMarca(form.marca);
    if (marcaError) newErrors.marca = marcaError;
    
    const modeloError = validarModelo(form.modelo);
    if (modeloError) newErrors.modelo = modeloError;
    
    const serieError = validarSerie(form.serie);
    if (serieError) newErrors.serie = serieError;
    
    if (!form.fechaInstalacion) newErrors.fechaInstalacion = "La fecha de instalación es obligatoria";
    
    const funcionError = validarFuncion(form.funcionEquipo);
    if (funcionError) newErrors.funcionEquipo = funcionError;
    
    if (form.horasMantenimiento && Number(form.horasMantenimiento) <= 0) {
      newErrors.horasMantenimiento = "Las horas de mantenimiento deben ser mayores a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validateForm()) return;
    
    const submitData = {
      ...form,
      horasMantenimiento: form.horasMantenimiento ? Number(form.horasMantenimiento) : 500,
    };
    onSubmit(submitData);
  };

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  const subcategoriasFiltradas = subcategorias[form.tipo] || [];

  return (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      {/* Código del equipo - solo lectura */}
      <View style={styles.codigoContainer}>
        <CustomText style={styles.codigoLabel}>Código del equipo</CustomText>
        <View style={styles.codigoValue}>
          <CustomText style={styles.codigoText}>
            {isEditing ? initialData.codigo : "Se generará automáticamente"}
          </CustomText>
        </View>
      </View>

      <Input
        label="Nombre del equipo *"
        value={form.nombre}
        onChangeText={(v) => handleChange("nombre", v)}
        placeholder="Ej: Aireador principal"
        error={submitted && errors.nombre}
      />

      <Input
        label="Descripción *"
        value={form.descripcion}
        onChangeText={(v) => handleChange("descripcion", v)}
        placeholder="Ej: Aireador de paletas para oxigenación"
        multiline
        error={submitted && errors.descripcion}
      />

      <Select
        label="Tipo de equipo *"
        options={tiposEquipo}
        value={form.tipo}
        onChange={handleTipoChange}
        placeholder="Seleccione un tipo"
        selectStyle={submitted && errors.tipo ? styles.errorInput : null}
      />

      {subcategoriasFiltradas.length > 0 && (
        <Select
          label="Subcategoría"
          options={subcategoriasFiltradas}
          value={form.subcategoria}
          onChange={(v) => handleChange("subcategoria", v)}
          placeholder="Seleccione una subcategoría"
        />
      )}

      <Input
        label="Marca *"
        value={form.marca}
        onChangeText={(v) => handleChange("marca", v)}
        placeholder="Ej: Makita"
        error={submitted && errors.marca}
      />

      <Input
        label="Modelo *"
        value={form.modelo}
        onChangeText={(v) => handleChange("modelo", v)}
        placeholder="Ej: MX-2000"
        error={submitted && errors.modelo}
      />

      <Input
        label="Número de serie *"
        value={form.serie}
        onChangeText={(v) => handleChange("serie", v)}
        placeholder="Ej: 9-0050"
        error={submitted && errors.serie}
      />

      <DateInput
        label="Fecha de instalación *"
        value={form.fechaInstalacion}
        onChangeText={(v) => handleChange("fechaInstalacion", v)}
        allowFutureDates={false}
      />

      <Input
        label="Función del equipo *"
        value={form.funcionEquipo}
        onChangeText={(v) => handleChange("funcionEquipo", v)}
        placeholder="Ej: Mantener la oxigenación constante"
        multiline
        error={submitted && errors.funcionEquipo}
      />

      <Select
        label="Estanque asociado"
        options={estanquesDisponibles}
        value={form.estanqueId}
        onChange={(v) => handleChange("estanqueId", v)}
        placeholder="Seleccione un estanque"
      />

      <Input
        label="Horas para mantenimiento"
        value={String(form.horasMantenimiento)}
        onChangeText={(v) => handleChange("horasMantenimiento", v)}
        placeholder="Ej: 500"
        keyboardType="numeric"
        error={submitted && errors.horasMantenimiento}
      />

      <Select
        label="Estado"
        options={[
          { label: "Activo", value: "activo" },
          { label: "Inactivo", value: "inactivo" },
          { label: "Mantenimiento", value: "mantenimiento" },
        ]}
        value={form.estado}
        onChange={(v) => handleChange("estado", v)}
      />

      <Button
        variant="outline"
        onPress={handleSubmit}
        style={styles.submitButton}
        textStyle={{ color: COLORS.primary }}
      >
        {isEditing ? "Actualizar equipo" : "Registrar equipo"}
      </Button>
    </ScrollView>
  );
}