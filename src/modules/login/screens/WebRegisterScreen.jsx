/**
 * ============================================================
 * PANTALLA: WebRegisterScreen
 * ============================================================
 *
 * Responsabilidad: Pantalla de registro de usuarios administradores
 * para la plataforma web de Caprocam.
 *
 * FUNCIONALIDAD:
 * 1. Formulario de registro con Nombre, Apellidos, Correo, Usuario y Contraseña.
 * 2. Visualización de errores de validación y obligatoriedad.
 * 3. Spinner de carga durante el proceso de registro.
 * 4. Modal de confirmación tras un registro exitoso.
 *
 * @dependencies - Card, CustomText, Spinner, Button, Modal, Header, Separator, FormField, Alert, Icon
 *               - Hook useRegister para gestión de envio y validación
 *               - styles/webRegisterStyles, theme/style, theme/colors, theme/icons
 * @validations  - Todos los campos obligatorios (*)
 *               - Formato de correo válido
 *               - Contraseña con criterios de robustez
 *               - Errores visuales solo tras intento de envío
 * @navigation   - onRegisterSuccess → pantalla de login
 *               - onBackToLogin → pantalla de login directamente
 */

import { View, ScrollView } from 'react-native';

import Card from '../../../shared/components/Card';
import CustomText from '../../../shared/components/Text';
import Spinner from '../../../shared/components/Spinner';
import Button from '../../../shared/components/Button';
import Modal from '../../../shared/components/Modal';
import Header from '../../../shared/components/Header';
import Separator from '../../../shared/components/Separator';
import Input from '../../../shared/components/Input';
import Alert from '../../../shared/components/Alert';
import Icon from '../../../shared/components/Icons';

import { useRegister } from '../hooks/useRegister';
import { AUTH_MESSAGES as MSG } from '../constants/authMessages';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { STYLE } from '../../../theme/style';
import styles from '../styles/webRegisterStyles';

export default function WebRegisterScreen({
  onRegisterSuccess = () => { },
  onBackToLogin = () => { },
}) {
  const {
    nombre, setNombre, apellidos, setApellidos,
    email, setEmail, username, setUsername, password, setPassword,
    errors, validationResult, loading, serverError, setServerError,
    handleRegister, showSuccessModal, handleModalClose,
  } = useRegister({ onRegisterSuccess });

  const createChangeHandler = (setter) => (val) => {
    if (serverError && setServerError) setServerError(null);
    setter(val);
  };

  const fields = [
      { key: 'nombre', label: MSG.LABEL_NOMBRE, value: nombre, onChangeText: createChangeHandler(setNombre), placeholder: MSG.PLACEHOLDER_NOMBRE, error: errors.nombre, maxLength: 80 },
      { key: 'apellidos', label: MSG.LABEL_APELLIDOS, value: apellidos, onChangeText: createChangeHandler(setApellidos), placeholder: MSG.PLACEHOLDER_APELLIDOS, error: errors.apellidos, maxLength: 120 },
      { key: 'email', label: MSG.LABEL_EMAIL, value: email, onChangeText: createChangeHandler(setEmail), placeholder: MSG.PLACEHOLDER_EMAIL, error: errors.email, autoCapitalize: 'none', autoCorrect: false, keyboardType: 'email-address', maxLength: 120 },
      { key: 'username', label: MSG.LABEL_USERNAME, value: username, onChangeText: createChangeHandler(setUsername), placeholder: MSG.PLACEHOLDER_USERNAME, error: errors.username, autoCapitalize: 'none', autoCorrect: false, maxLength: 80 },
      { key: 'password', label: MSG.LABEL_PASSWORD, value: password, onChangeText: createChangeHandler(setPassword), placeholder: MSG.PLACEHOLDER_PASSWORD, error: errors.password, secureTextEntry: true },
    ];
    
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      <Modal
        visible={showSuccessModal}
        onClose={handleModalClose}
        showCloseButton={false}
        containerStyle={[STYLE.contentWrapper, styles.modalContainer]}
      >
        <View style={styles.modalInner}>
          <View style={styles.modalIconBadge}>
            <Icon icon={ICONS.check} size={32} color={COLORS.success} />
          </View>
          <CustomText weight="700" size={18} align="center" style={styles.modalTitle}>
            {MSG.MODAL_SUCCESS_TITLE}
          </CustomText>
          <CustomText size={14} color={COLORS.textTertiary} align="center" style={styles.modalBody}>
            {MSG.MODAL_SUCCESS_BODY}
          </CustomText>
          <Button
            variant="outline"
            style={styles.modalButton}
            textStyle={styles.modalButtonText}
            onPress={handleModalClose}
          >
            {MSG.MODAL_SUCCESS_BUTTON}
          </Button>
        </View>
      </Modal>

      <Header
        title={MSG.REGISTER_TITLE}
        subtitle={MSG.REGISTER_SUBTITLE}
        logo={require('../../../assets/shrimp-solid.png')}
      />

      <View style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <Card>

            {fields.map(({ key, label, error, ...fieldProps }) => {
              const isHighlighted = validationResult?.fieldsToHighlight?.includes(key);
              const isServerErrorOnPassword = key === 'password' && serverError && serverError.toLowerCase().includes('contrase');
              const hasError = Boolean(isHighlighted || isServerErrorOnPassword);
              return (
                <Input
                  key={key}
                  label={`${label} *`}
                  editable={!loading}
                  style={hasError ? styles.errorField : null}
                  {...fieldProps}
                />
              );
            })}

            {serverError ? (
              <Alert variant="danger" message={serverError} style={styles.serverAlertSpacing} />
            ) : null}

            {validationResult?.mode !== 'none' && (
              <Alert
                variant="danger"
                message={validationResult.message}
                style={styles.alertSpacing}
              />
            )}

            {loading && <Spinner text={MSG.LOADING_REGISTER} />}

            <Button disabled={loading} onPress={handleRegister}>
              {MSG.BUTTON_SUBMIT_REGISTER}
            </Button>

            <Separator text={MSG.SEPARATOR_TEXT_REGISTER} />

            <Button variant="outline" disabled={loading} onPress={onBackToLogin}>
              {MSG.BUTTON_BACK_TO_LOGIN}
            </Button>

          </Card>
        </View>
      </View>

    </ScrollView>
  );
}