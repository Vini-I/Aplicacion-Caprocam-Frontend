import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Badge({ label, type = "success" }) {
  return (
    <View
      style={[
        styles.badge,
        type === "danger" && styles.danger,
        type === "warning" && styles.warning
      ]}
    >
      <Text style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#009EF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  danger: {
    backgroundColor: "#FFEDD4"
  },
  warning: {
    backgroundColor: "#EEF2FF"
  },
  text: {
    color: "#1F2937",
    fontWeight: "600",
    fontSize: 12
  }
});