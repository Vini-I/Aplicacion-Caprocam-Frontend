import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";

/**
 * Componente Select reutilizable
 * 
 * options     - Lista de opciones { label, value }
 * value       - Valor seleccionado actualmente
 * onChange    - Callback al seleccionar una opción
 * placeholder - Texto cuando no hay selección
 * label       - Etiqueta superior del select
 * 
 * Ejemplo:
 * <Select
 *   label="Estanque"
 *   options={[{ label: "Estanque Norte", value: 1 }]}
 *   value={form.estanque}
 *   onChange={handleChange("estanque")}
 * />
 */

const Select = ({ options, value, onChange, placeholder = "Seleccionar.", label }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0 });
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  const handleOpen = () => {
    ref.current?.measureInWindow((x, y, w, h) => {
      setPos({ x, y: y + h, w });
      setOpen(true);
    });
  };

  return (
    <View ref={ref}>
      {label && <Text style={s.label}>{label}</Text>}
      <TouchableOpacity style={s.trigger} onPress={handleOpen}>
        <Text>{selected ? selected.label : placeholder}</Text>
        <Text>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={s.overlay} onPress={() => setOpen(false)}>
          <View style={[s.dropdown, { top: pos.y, left: pos.x, width: pos.w }]}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {options.map((item) => (
                <TouchableOpacity key={String(item.value)} style={s.option} onPress={() => { onChange(item.value); setOpen(false); }}>
                  <Text style={item.value === value ? s.selected : undefined}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  label:    { fontSize: 14, marginBottom: 6 },
  trigger:  { flexDirection: "row", justifyContent: "space-between", padding: 12, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8 },
  overlay:  { flex: 1 },
  dropdown: { position: "absolute", backgroundColor: "#fff", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, maxHeight: 200 },
  option:   { padding: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  selected: { color: "#1E3A5F", fontWeight: "600" },
});

export default Select;