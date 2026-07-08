/**
 * ============================================================
 * COMPONENTE SELECT
 * ============================================================
 * 
 * Selector reutilizable para React Native.
 *
 * Funcionalidad:
 * - Permite seleccionar una opcion de una lista.
 * - Usa Pressable para evitar dependencias externas.
 * - Muestra opciones desplegables dentro del mismo componente.
 * - Puede usarse para estados, categorias, tipos o filtros.
 *
 * Props principales:
 * - label: texto opcional encima del selector.
 * - value: valor seleccionado.
 * - options: arreglo de opciones.
 * - onChange: funcion que recibe el valor seleccionado.
 * - placeholder: texto cuando no hay seleccion.
 * - disabled: bloquea el selector.
 * - containerStyle: estilos extra para el contenedor.
 * - selectStyle: estilos extra para el campo.
 * - optionStyle: estilos extra para cada opcion.
 *
 * Formato de options:
 * [
 *     { label: "Activo", value: "activo" },
 *     { label: "Inactivo", value: "inactivo" }
 * ]
 *
 * Ejemplo:
 * <Select
 *     label="Estado"
 *     value={estado}
 *     onChange={setEstado}
 *     options={[
 *         { label: "Activo", value: "activo" },
 *         { label: "Inactivo", value: "inactivo" }
 *     ]}
 * />
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";

import { COLORS } from "../../theme/colors";

function getSelectedLabel(options, value, placeholder) {
  let selectedLabel = placeholder;

  for (let index = 0; index < options.length; index++) {
    if (options[index].value === value) {
      selectedLabel = options[index].label;
    }
  }

  return selectedLabel;
}


export default function Select({
  label = "",
  value = "",
  options = [],
  onChange,
  placeholder = "Seleccione una opcion",
  disabled = false,
  containerStyle,
  selectStyle,
  labelStyle,
  optionStyle,
  optionTextStyle,
  selectedTextStyle,
}) {

  const [open, setOpen] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });


  const selectRef = useRef(null);


  function handleToggle() {

    if (disabled === false) {

      selectRef.current.measure(
        function (
          x,
          y,
          width,
          height,
          pageX,
          pageY
        ) {

          setPosition({
            top: pageY + height,
            left: pageX,
            width: width,
          });

          setOpen(true);

        }
      );

    }

  }


  function handleSelect(optionValue) {

    if (onChange) {
      onChange(optionValue);
    }

    setOpen(false);

  }



  const selectStyles = [
    styles.select
  ];


  if (disabled === true) {
    selectStyles.push(styles.disabledSelect);
  }


  if (selectStyle) {
    selectStyles.push(selectStyle);
  }



  return (

    <View style={[styles.container, containerStyle]}>

      {
        label !== "" && (
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
        )
      }



      <Pressable
        ref={selectRef}
        style={selectStyles}
        onPress={handleToggle}
        disabled={disabled}
        accessibilityRole="button"
      >

        <Text style={[styles.selectedText, selectedTextStyle]}>
          {
            getSelectedLabel(
              options,
              value,
              placeholder
            )
          }
        </Text>


        <Text style={styles.arrow}>
          ▾
        </Text>


      </Pressable>



      <Modal
        transparent={true}
        visible={open}
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >


        <Pressable
          style={styles.modalBackground}
          onPress={() => setOpen(false)}
        >


          <View
            style={[
              styles.optionsContainer,
              {
                top: position.top,
                left: position.left,
                width: position.width,
              }
            ]}
          >


            {
              options.map(function(option) {

                return (

                  <Pressable
                    key={option.value}
                    style={[
                      styles.option,
                      optionStyle
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >

                    <Text
                      style={[
                        styles.optionText,
                        optionTextStyle
                      ]}
                    >
                      {option.label}
                    </Text>


                  </Pressable>

                );

              })
            }


          </View>


        </Pressable>


      </Modal>


    </View>

  );

}



const styles = StyleSheet.create({

  container: {
    marginBottom: 12,
  },


  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },


  select: {
    minHeight: 45,

    borderWidth: 1,
    borderColor: COLORS.secondary,

    borderRadius: 8,

    paddingVertical: 10,
    paddingHorizontal: 12,

    backgroundColor: COLORS.white,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  disabledSelect: {
    backgroundColor: COLORS.secondary,
    opacity: 0.7,
  },


  selectedText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },


  arrow: {
    fontSize: 18,
    color: COLORS.textTertiary,
  },


  modalBackground: {
    flex: 1,
    backgroundColor: "transparent",
  },


  optionsContainer: {

    position: "absolute",

    borderWidth: 1,
    borderColor: COLORS.secondary,

    borderRadius: 8,

    backgroundColor: COLORS.white,

    overflow: "hidden",

    elevation: 10,
  },


  option: {

    paddingVertical: 12,
    paddingHorizontal: 12,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,

  },


  optionText: {

    fontSize: 15,
    color: COLORS.textPrimary,

  },


});