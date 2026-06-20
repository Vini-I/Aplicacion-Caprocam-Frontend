/**
 * ============================================================
 * PANTALLA: WEB LOGIN
 * ============================================================
 *
 * Esta es la pantalla de autenticación para la versión WEB
 * del proyecto. Esta pantalla usa usuario y contraseña
 * real validada contra la API mediante JWT.
 *
 * RESPONSABILIDADES:
 * 1. Mostrar formulario con campo usuario y contraseña
 * 2. Mostrar errores de validación en tiempo real
 * 3. Mostrar errores del servidor (credenciales incorrectas, red, etc.)
 * 4. Botón "Iniciar Sesión" para autenticarse
 * 5. Botón "Registrarse" para crear cuenta nueva
 * ============================================================
 */

import { View, ScrollView } from 'react-native';

// Componentes usados
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Card from '../../../shared/components/Card';
import Title from '../../../shared/components/Title';
import CustomText from '../../../shared/components/Text';
import Spinner from '../../../shared/components/Spinner';
import Images from '../../../shared/components/Images';

// Hook de autenticación
import { useAuth } from '../hooks/useAuth';

// Constantes de mensajes
import { AUTH_MESSAGES } from '../constants/authMessages';

// Tema
import { COLORS } from '../../../theme/colors';

// Estilos
import styles from '../styles/webLoginStyles';


/**
 *
 * @param {Object} props
 * @param {Function} props.onLoginSuccess 
 */
export default function WebLoginScreen({ onLoginSuccess = () => { } }) {

  // Se comenta el handle login por mientras, para que no de error de función no definida. El flujo de autenticación se implementará en la próxima etapa.
  const {
    username,
    setUsername,
    password,
    setPassword,
    errors,
    loading,
    serverError,
    // handleLogin,
    handleRegister,
    isFormValid,
    buttonVariant,
  } = useAuth({ onLoginSuccess });

  // Eliminar luego, placeholder para simular login exitoso
  const handleLoginPress = () => {
   onLoginSuccess();
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER: Logo y nombre de empresa */}
      <View style={styles.header}>
        <View style={styles.headerContent}>

          {/* Logo */}
          <Card style={styles.logoCard}>
            <Images
              source={require('../../../assets/shrimp-solid.png')}
              width={64}
              height={64}
              borderRadius={0}
              resizeMode="contain"
              style={styles.logoImage}
            />
          </Card>

          {/* Título y subtítulo */}
          <Title level={1} color={COLORS.white} align="center">
            {AUTH_MESSAGES.COMPANY_NAME}
          </Title>

          <CustomText
            size={14}
            color={COLORS.white}
            align="center"
            style={styles.headerSubtitle}
          >
            {AUTH_MESSAGES.SUBTITLE}
          </CustomText>

        </View>
      </View>


      {/* FORMULARIO: Tarjeta con los campos de login */}
      <View style={styles.formSection}>
        <Card>

          {/* CAMPO: Usuario */}
          <Input
            label={AUTH_MESSAGES.LABEL_USERNAME}
            value={username}
            onChangeText={setUsername}
            placeholder={AUTH_MESSAGES.PLACEHOLDER_USERNAME}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Error de validación del campo usuario */}
          {errors.username !== '' && (
            <CustomText
              size={12}
              color={COLORS.error}
              style={styles.fieldError}
            >
              {errors.username}
            </CustomText>
          )}


          {/* CAMPO: Contraseña */}
          <Input
            label={AUTH_MESSAGES.LABEL_PASSWORD}
            value={password}
            onChangeText={setPassword}
            placeholder={AUTH_MESSAGES.PLACEHOLDER_PASSWORD}
            editable={!loading}
            secureTextEntry={true}
          />

          {/* Error de validación del campo contraseña */}
          {errors.password !== '' && (
            <CustomText
              size={12}
              color={COLORS.error}
              style={styles.fieldError}
            >
              {errors.password}
            </CustomText>
          )}


          {/* ERROR DEL SERVIDOR: credenciales incorrectas, red, etc. */}
          {serverError !== null && (
            <View style={styles.serverErrorContainer}>
              <CustomText
                size={14}
                color={COLORS.error}
                align="center"
              >
                {serverError}
              </CustomText>
            </View>
          )}


          {/* SPINNER: Visible mientras se espera respuesta de la API */}
          {loading && (
            <Spinner text={AUTH_MESSAGES.LOADING} />
          )}


          {/* BOTÓN: Iniciar Sesión */}
          <Button
            variant={buttonVariant}
            disabled={!isFormValid || loading}
            onPress={handleLoginPress}
          >
            {AUTH_MESSAGES.BUTTON_LOGIN}
          </Button>


          {/* SEPARADOR */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <CustomText
              size={12}
              color={COLORS.textTertiary}
              style={styles.separatorText}
            >
              {AUTH_MESSAGES.SEPARATOR_TEXT}
            </CustomText>
            <View style={styles.separatorLine} />
          </View>


          {/* BOTÓN: Registrarse */}
          <Button
            variant="outline"
            disabled={!isFormValid || loading}
            onPress={handleRegister}
          >
            {AUTH_MESSAGES.BUTTON_REGISTER}
          </Button>

        </Card>
      </View>

    </ScrollView>
  );
}