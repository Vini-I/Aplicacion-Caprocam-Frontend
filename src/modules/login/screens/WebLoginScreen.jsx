/**
 * ============================================================
 * PANTALLA: WebLoginScreen
 * ============================================================
 * 
 * Responsabilidad: Pantalla de inicio de sesión para la plataforma
 * web de Caprocam. Permite a los usuarios autenticarse ingresando
 * su usuario y contraseña.
 * 
 * FUNCIONALIDAD:
 * 1. Formulario de inicio de sesión con campos de Usuario y Contraseña.
 * 2. Visualización de errores de validación de campos vacíos.
 * 3. Spinner de carga durante el proceso de autenticación.
 * 4. Botón para redirigir a la pantalla de registro de usuarios.
 * 
 * DATOS:
 * - username: Estado del nombre de usuario.
 * - password: Estado de la contraseña de acceso.
 * - errors: Objeto con los errores de validación por campo.
 * - serverError: Mensaje de error retornado por la API de autenticación.
 * 
 * VALIDACIONES:
 * - Los campos de Usuario y Contraseña son obligatorios (*).
 * - Los errores visuales (bordes rojos) y mensajes solo aparecen tras intentar enviar el formulario.
 * 
 * NAVEGACIÓN:
 * - Redirige a la sección principal tras un login exitoso (onLoginSuccess).
 * - Redirige al flujo de registro de administradores (onGoToRegister).
 * 
 * DEPENDENCIAS:
 * - Card, Alert, Spinner, Button, Header, Separator, FormField.
 * - Hook useAuth para la lógica de negocio y validación de campos.
 */

import { View, ScrollView } from 'react-native';

import Card      from '../../../shared/components/Card';
import Spinner   from '../../../shared/components/Spinner';
import Button    from '../../../shared/components/Button';
import Header    from '../../../shared/components/Header';
import Separator  from '../../../shared/components/Separator';
import FormField  from '../../../shared/components/FormField';
import Alert      from '../../../shared/components/Alert';

import { useAuth } from '../hooks/useAuth';
import { AUTH_MESSAGES as MSG } from '../constants/authMessages';
import styles from '../styles/webLoginStyles';
import { STYLE } from '../../../theme/style';

export default function WebLoginScreen({
  onLoginSuccess = () => {},
  onGoToRegister = () => {},
}) {
  const {
    username, setUsername,
    password, setPassword,
    errors, loading, serverError,
    handleLogin,
  } = useAuth({ onLoginSuccess });

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

      <Header
        title={MSG.COMPANY_NAME}
        subtitle={MSG.SUBTITLE}
        logo={require('../../../assets/shrimp-solid.png')}
      />

      <View style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <Card>

            <FormField
              label={`${MSG.LABEL_USERNAME} *`}
              value={username}
              onChangeText={setUsername}
              placeholder={MSG.PLACEHOLDER_USERNAME}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
              style={errors.username ? styles.errorField : null}
            />

            <FormField
              label={`${MSG.LABEL_PASSWORD} *`}
              value={password}
              onChangeText={setPassword}
              placeholder={MSG.PLACEHOLDER_PASSWORD}
              editable={!loading}
              secureTextEntry
              style={errors.password ? styles.errorField : null}
            />

            {serverError !== null && (
              <Alert
                variant="danger"
                message={serverError}
                style={styles.alertSpacing}
              />
            )}

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

            <Separator text={MSG.SEPARATOR_TEXT_LOGIN} />

            <Button variant="outline" disabled={loading} onPress={onGoToRegister}>
              {MSG.BUTTON_GO_TO_REGISTER}
            </Button>

          </Card>
        </View>
      </View>

    </ScrollView>
  );
}