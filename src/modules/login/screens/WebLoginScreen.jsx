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
 * - Card, CustomText, Spinner, Button, Header, Separator, FormField.
 * - Hook useAuth para la lógica de negocio y validación de campos.
 */

import { View, ScrollView } from 'react-native';

import Card      from '../../../shared/components/Card';
import CustomText from '../../../shared/components/Text';
import Spinner   from '../../../shared/components/Spinner';
import Button    from '../../../shared/components/Button';
import Header    from '../../../shared/components/Header';
import Separator  from '../../../shared/components/Separator';
import FormField  from '../../../shared/components/FormField';
import Icon       from '../../../shared/components/Icons';

import { useAuth } from '../hooks/useAuth';
import { AUTH_MESSAGES as MSG } from '../constants/authMessages';
import styles from '../styles/webLoginStyles';
import { COLORS } from "../../../theme/colors";
import { ICONS } from '../../../theme/icons';
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
    <ScrollView style={[STYLE.container, { padding: 0 }]} showsVerticalScrollIndicator={false}>

      <Header
        title={MSG.COMPANY_NAME}
        subtitle={MSG.SUBTITLE}
        logo={require('../../../assets/shrimp-solid.png')}
      />

      <View style={STYLE.contentWrapper}>
        <View style={styles.formSection}>
        <Card>

          <FormField
            label={`${MSG.LABEL_USERNAME} *`}
            value={username}
            onChangeText={setUsername}
            placeholder={MSG.PLACEHOLDER_USERNAME}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
            style={errors.username ? { borderColor: COLORS.error } : null}
          />

          <FormField
            label={`${MSG.LABEL_PASSWORD} *`}
            value={password}
            onChangeText={setPassword}
            placeholder={MSG.PLACEHOLDER_PASSWORD}
            editable={!loading}
            secureTextEntry
            style={errors.password ? { borderColor: COLORS.error } : null}
          />

          {serverError !== null && (
            <View style={{ padding: 12, backgroundColor: COLORS.errorLight, borderRadius: 8, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon icon={ICONS.alertTriangle} size={18} color={COLORS.error} />
              <CustomText style={{ color: COLORS.error, fontSize: 13, fontWeight: "600", flex: 1 }}>
                {serverError}
              </CustomText>
            </View>
          )}

          {Object.values(errors).some((e) => e !== "") && (
            <View style={{ padding: 12, backgroundColor: COLORS.errorLight, borderRadius: 8, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon icon={ICONS.alertTriangle} size={18} color={COLORS.error} />
              <CustomText style={{ color: COLORS.error, fontSize: 13, fontWeight: "600", flex: 1 }}>
                Revisa los campos obligatorios marcados con * antes de ingresar.
              </CustomText>
            </View>
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