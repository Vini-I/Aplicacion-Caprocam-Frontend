// src/shared/components/emptyState.jsx    => direccion de el componente
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyState({
    // Estos son parametros  con valores por defecto
  icon = "mail",          
  iconSize = 36,
  iconColor = "#009EF5",
  title = "No hay datos",
  description = "No hay información disponible.",
  buttonText,
  buttonVariant = "primary",
  onButtonClick,
}) {
  return (
    // Todo es una carta 
    <View style={styles.card}>   
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={iconSize} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {buttonText && (
        <TouchableOpacity
          style={buttonVariant === "outline" ? styles.btnOutline : styles.btnPrimary}
          onPress={onButtonClick}
        >
          <Text style={buttonVariant === "outline" ? styles.btnOutlineText : styles.btnPrimaryText}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    margin: 16,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a2b3c",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 260,
    marginBottom: 20,
    lineHeight: 20,
  },
  btnPrimary: {
    backgroundColor: "#009EF5",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: "#009EF5",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  btnOutlineText: {
    color: "#009EF5",
    fontWeight: "600",
    fontSize: 14,
  },
});