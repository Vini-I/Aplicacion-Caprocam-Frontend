/**
 * ============================================================
 * COMPONENTE SESSION MONITOR (SESIÓN EXPIRADA)
 * ============================================================
 *
 * Muestra un modal cuando el token JWT ya expiró,
 * con el mismo estilo y márgenes que el modal de éxito del registro.
 * El usuario debe volver a iniciar sesión en /loginWeb.
 *
 * IMPORTANTE: Este componente solo debe activarse en rutas protegidas.
 * En rutas públicas (landing, login, registro) no debe mostrar el modal
 * aunque exista un token expirado en localStorage.
 * ============================================================
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Modal from './Modal';
import Button from './Button';
import CustomText from './Text';
import Icon from './Icons';
import { getToken } from '../../modules/login/utils/tokenStorage';
import { getTokenExpiration } from '../utils/jwtUtils';
import { COLORS } from '../../theme/colors';
import { ICONS } from '../../theme/icons';
import { STYLE } from '../../theme/style';
import { useError } from '../context/ErrorContext';

// Rutas que no requieren autenticación
const RUTAS_PUBLICAS = ['/landing', '/loginWeb', '/registerWeb', '/login'];

export default function SessionMonitor({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const { mostrarError } = useError();

  // Determina si la ruta actual es pública
  const esRutaPublica = RUTAS_PUBLICAS.some((ruta) => pathname?.startsWith(ruta));

  useEffect(() => {
    // Si estamos en una ruta pública, no activamos el monitor
    if (esRutaPublica) return;

    let interval;

    const checkToken = () => {
      const token = getToken();
      if (!token) return;

      const exp = getTokenExpiration(token);
      if (!exp) return;

      const now = Date.now();
      if (exp <= now) {
        if (!esRutaPublica) {
          setShowModal(true);
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
        }
      }
    };

    checkToken();
    interval = setInterval(checkToken, 5000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [esRutaPublica]);

  // Si es ruta pública, no renderizamos el modal
  if (esRutaPublica) {
    return <>{children}</>;
  }

  const clearSession = () => {
    try {
      localStorage.removeItem('caprocam_auth_token');
      localStorage.removeItem('caprocam_refresh_token');
      localStorage.removeItem('caprocam_usuario');
    } catch (error) {
      mostrarError('Error al limpiar la sesión. Por favor, cierra la aplicación y vuelve a iniciar sesión.');
    }
  };

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
        onClose={() => { }}
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