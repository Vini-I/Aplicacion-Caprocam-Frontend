/**
 * ============================================================
 * PANTALLA: WebLoginScreen
 * ============================================================
 *
 * Pantalla de inicio de sesión para la plataforma web de Caprocam.
 * Permite a los usuarios autenticarse ingresando usuario y contraseña.
 * Ambos campos son obligatorios y se marcan con asterisco (*).
 *
 * @dependencies - Card, Alert, Spinner, Button, Header, Input, Icon (shared)
 *               - useAuth (hooks/useAuth) para lógica de autenticación
 *               - styles/webLoginStyles, theme/style
 * @validations  - Usuario y Contraseña obligatorios (*).
 *               - Errores de validación visibles solo tras primer intento de envío.
 *               - Borde rojo por campo cuando hay error de validación (prop error de Input).
 *               - createChangeHandler limpia serverError en cada cambio de campo.
 * @navigation   - onLoginSuccess → sección principal de la aplicación.
 *               - onGoToLanding → redirige a la pantalla /landing.
 *               - El registro de administradores ya no vive aquí: solo es
 *                 accesible desde Configuración dentro del drawer, y
 *                 solamente para usuarios ya autenticados.
 */

import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';

import Card from '../../../shared/components/Card';
import Spinner from '../../../shared/components/Spinner';
import Button from '../../../shared/components/Button';
import Header from '../../../shared/components/Header';
import Input from '../../../shared/components/Input';
import Alert from '../../../shared/components/Alert';
import Icon from '../../../shared/components/Icons';

import { useAuth } from '../hooks/useAuth';
import { AUTH_MESSAGES as MSG } from '../constants/authMessages';
import styles from '../styles/webLoginStyles';
import { STYLE } from '../../../theme/style';
import { ICONS } from '../../../theme/icons';
import { COLORS } from '../../../theme/colors';

export default function WebLoginScreen({
  onLoginSuccess = () => { },
  onGoToLanding = () => { },
}) {
  const {
    username, setUsername,
    password, setPassword,
    errors, loading, serverError, setServerError,
    handleLogin,
  } = useAuth({ onLoginSuccess });

  // Suprime el botón nativo del browser para mostrar contraseña (solo web),
  // que se superponía con el ícono personalizado del campo.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const style = document.createElement('style');
    style.innerHTML = [
      'input[type="password"]::-ms-reveal { display: none !important; }',
      'input[type="password"]::-ms-clear { display: none !important; }',
      'input::-webkit-contacts-auto-fill-button { visibility: hidden; }',
      'input::-webkit-credentials-auto-fill-button { visibility: hidden; }',
    ].join(' ');
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Controla la visibilidad de la contraseña; se oculta automáticamente
  // cuando el servidor responde con un error para no exponer el texto.
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (serverError) {
      setShowPassword(false);
    }
  }, [serverError]);

  const createChangeHandler = (setter) => (val) => {
    if (serverError && setServerError) setServerError(null);
    setter(val);
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      <Header
        title={MSG.COMPANY_NAME}
        subtitle={MSG.SUBTITLE}
        logo={require('../../../assets/shrimp-solid.png')}
      />

      <View style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <Card>

            <Input
              label={`${MSG.LABEL_USERNAME} *`}
              value={username}
              onChangeText={createChangeHandler(setUsername)}
              placeholder={MSG.PLACEHOLDER_USERNAME}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.username}
              returnKeyType="next"
              blurOnSubmit={false}
            />

            
            <View style={styles.passwordWrapper}>
              <Input
                label={`${MSG.LABEL_PASSWORD} *`}
                value={password}
                onChangeText={createChangeHandler(setPassword)}
                placeholder={MSG.PLACEHOLDER_PASSWORD}
                editable={!loading}
                secureTextEntry={!showPassword}
                error={errors.password}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                containerStyle={styles.passwordInput}
                style={styles.passwordFieldInput}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon
                  icon={showPassword ? ICONS.eyeOff : ICONS.eye}
                  size={20}
                  color={COLORS.textQuaternary}
                />
              </TouchableOpacity>
            </View>

            {serverError ? (
              <Alert variant="danger" message={serverError} style={styles.serverAlertSpacing} />
            ) : null}

            {Object.values(errors).some((e) => e !== "") && (
              <Alert
                variant="danger"
                message="Revisa los campos obligatorios marcados con * antes de ingresar."
                style={styles.alertSpacing}
              />
            )}

            {loading && <Spinner text={MSG.LOADING_LOGIN} />}

            <Button variant="outline" disabled={loading} onPress={handleLogin}>
              {MSG.BUTTON_LOGIN}
            </Button>

            <Button variant="secondary" disabled={loading} onPress={onGoToLanding}>
              Volver al inicio
            </Button>

          </Card>
        </View>
      </View>

    </ScrollView>
  );
}