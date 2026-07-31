/**
 * ============================================================
 * COMPONENTE ERROR MODAL
 * ============================================================
 *
 * Muestra un modal global cuando ocurre una excepción o error
 * fuera del flujo normal de un formulario (fallos de red,
 * errores del backend, excepciones no controladas).
 * Usa el mismo estilo y estructura que SessionMonitor.
 * ============================================================
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import Modal from "./Modal";
import Button from "./Button";
import CustomText from "./Text";
import Icon from "./Icons";
import { useError } from "../context/ErrorContext";
import { COLORS } from "../../theme/colors";
import { ICONS } from "../../theme/icons";
import { STYLE } from "../../theme/style";

export default function ModalError() {
  const { error, limpiarError } = useError();

  return (
    <Modal
      visible={Boolean(error)}
      onClose={limpiarError}
      showCloseButton={false}
      containerStyle={[STYLE.contentWrapper, styles.modalContainer]}
    >
      <View style={styles.modalInner}>
        <View style={[styles.modalIconBadge, { backgroundColor: COLORS.errorLight }]}>
          <Icon icon={ICONS.close} size={70} color={COLORS.error} />
        </View>

        <CustomText size={18} weight="700" color={COLORS.textSecondary} style={styles.modalTitle}>
          Ocurrió un error
        </CustomText>

        <CustomText size={14} color={COLORS.textTertiary} style={styles.modalBody}>
          {error}
        </CustomText>

        <Button
          variant="outline"
          onPress={limpiarError}
          style={styles.modalButton}
          textStyle={styles.modalButtonText}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon icon={ICONS.close} size={18} color={COLORS.error} />
            <CustomText size={14} color={COLORS.error} weight="600">
              Cerrar
            </CustomText>
          </View>
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 24,
  },
  modalInner: {
    alignItems: "center",
    paddingVertical: 10,
  },
  modalIconBadge: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 90,
  },
  modalTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  modalBody: {
    lineHeight: 22,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    marginTop: 24,
    borderColor: COLORS.error,
  },
  modalButtonText: {
    color: COLORS.error,
  },
});