/**
 * ============================================================
 * COMPONENTE SESSION MONITOR (SESIÓN EXPIRADA)
 * ============================================================
 *
 * Muestra un modal cuando el token JWT ya expiró,
 * con el mismo estilo y márgenes que el modal de éxito del registro.
 * El usuario debe volver a iniciar sesión en /loginWeb.
 * ============================================================
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Modal from './Modal';
import Button from './Button';
import CustomText from './Text';
import Icon from './Icons';
import { getToken } from '../../modules/login/utils/tokenStorage';
import { getTokenExpiration } from '../utils/jwtUtils';
import { COLORS } from '../../theme/colors';
import { ICONS } from '../../theme/icons';
import { STYLE } from '../../theme/style';

const clearSession = () => {
  try {
    localStorage.removeItem('caprocam_auth_token');
    localStorage.removeItem('caprocam_refresh_token');
    localStorage.removeItem('caprocam_usuario');
  } catch (error) {
    console.error('Error al limpiar sesión:', error);
  }
};

export default function SessionMonitor({ children }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let interval;

    const checkToken = () => {
      const token = getToken();
      if (!token) return;

      const exp = getTokenExpiration(token);
      if (!exp) return;

      const now = Date.now();
      const diff = exp - now;

      if (diff <= 0) {
        if (!showModal) {
          setShowModal(true);
        }
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    interval = setInterval(checkToken, 5000);
    checkToken();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showModal]);

  const handleLogin = () => {
    clearSession();
    setShowModal(false);
    router.replace('/loginWeb');
  };

  return (
    <>
      {children}
      <Modal
        visible={showModal}
        onClose={() => {}}
        showCloseButton={false}
        containerStyle={[STYLE.contentWrapper, styles.modalContainer]}
      >
        <View style={styles.modalInner}>
          <View style={[styles.modalIconBadge, { backgroundColor: COLORS.warningLight }]}>
            <Icon icon={ICONS.info} size={32} color={COLORS.warning} />
          </View>

          <CustomText size={18} weight="700" color={COLORS.textSecondary} style={styles.modalTitle}>
            Su sesión ha expirado
          </CustomText>

          <CustomText size={14} color={COLORS.textTertiary} style={styles.modalBody}>
            Por favor, inicie sesión nuevamente para continuar usando la aplicación.
          </CustomText>

          <Button
            variant="outline"
            onPress={handleLogin}
            style={styles.modalButton}
            textStyle={styles.modalButtonText}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon icon={ICONS.enter} size={18} color={COLORS.primary} />
              <CustomText size={14} color={COLORS.primary} weight="600">
                Iniciar sesión
              </CustomText>
            </View>
          </Button>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 24,
  },
  modalInner: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalIconBadge: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
  },
  modalTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBody: {
    lineHeight: 22,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    marginTop: 24,
    borderColor: COLORS.primary,
  },
  modalButtonText: {
    color: COLORS.primary,
  },
});