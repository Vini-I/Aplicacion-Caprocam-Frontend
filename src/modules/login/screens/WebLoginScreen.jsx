/**
 * PANTALLA: Web Login
 *
 * Login web con usuario/contraseña reales contra la API (JWT).
 * Los errores de campo aparecen solo tras presionar "Iniciar Sesión".
 */

import { View, ScrollView } from 'react-native';

import Card      from '../../../shared/components/Card';
import CustomText from '../../../shared/components/Text';
import Spinner   from '../../../shared/components/Spinner';
import Button    from '../../../shared/components/Button';
import Header    from '../../../shared/components/Header';
import Separator  from '../../../shared/components/Separator';
import FormField  from '../../../shared/components/FormField';

import { useAuth } from '../hooks/useAuth';
import { AUTH_MESSAGES as MSG } from '../constants/authMessages';
import styles from '../styles/webLoginStyles';

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Header
        title={MSG.COMPANY_NAME}
        subtitle={MSG.SUBTITLE}
        logo={require('../../../assets/shrimp-solid.png')}
      />

      <View style={styles.formSection}>
        <Card>

          <FormField
            label={MSG.LABEL_USERNAME}
            value={username}
            onChangeText={setUsername}
            placeholder={MSG.PLACEHOLDER_USERNAME}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.username}
          />

          <FormField
            label={MSG.LABEL_PASSWORD}
            value={password}
            onChangeText={setPassword}
            placeholder={MSG.PLACEHOLDER_PASSWORD}
            editable={!loading}
            secureTextEntry
            error={errors.password}
          />

          {serverError !== null && (
            <View style={styles.serverErrorContainer}>
              <CustomText size={14} color={COLORS.error} align="center">{serverError}</CustomText>
            </View>
          )}

          {loading && <Spinner text={MSG.LOADING_LOGIN} />}

          <Button disabled={loading} onPress={handleLogin}>
            {MSG.BUTTON_LOGIN}
          </Button>

          <Separator text={MSG.SEPARATOR_TEXT_LOGIN} />

          <Button variant="outline" disabled={loading} onPress={onGoToRegister}>
            {MSG.BUTTON_GO_TO_REGISTER}
          </Button>

        </Card>
      </View>

    </ScrollView>
  );
}