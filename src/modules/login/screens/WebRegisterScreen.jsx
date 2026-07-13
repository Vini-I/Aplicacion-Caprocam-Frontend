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
 * DATOS:
 * - nombre, apellidos, email, username, password: Estados de los campos del formulario.
 * - errors: Objeto con los mensajes de validación por campo.
 * - showSuccessModal: Controla la visibilidad del modal de éxito.
 * 
 * VALIDACIONES:
 * - Todos los campos son obligatorios (*).
 * - El formato del correo electrónico debe ser válido.
 * - La contraseña debe cumplir criterios de robustez (mayúscula, números, longitud).
 * - Los errores visuales (bordes rojos) y mensajes solo aparecen tras intentar enviar el formulario.
 * 
 * NAVEGACIÓN:
 * - Redirige a la pantalla de login tras registrarse y cerrar el modal (onRegisterSuccess).
 * - Permite regresar a la pantalla de login directamente (onBackToLogin).
 * 
 * DEPENDENCIAS:
 * - Card, CustomText, Spinner, Button, Modal, Header, Separator, FormField.
 * - Hook useRegister para gestionar la lógica de envío y validación de campos.
 */

import { View, ScrollView } from 'react-native';

import Card     from '../../../shared/components/Card';
import CustomText from '../../../shared/components/Text';
import Spinner  from '../../../shared/components/Spinner';
import Button   from '../../../shared/components/Button';
import Modal    from '../../../shared/components/Modal';
import Header   from '../../../shared/components/Header';
import Separator from '../../../shared/components/Separator';
import FormField from '../../../shared/components/FormField';
import Icon     from '../../../shared/components/Icons';

import { useRegister } from '../hooks/useRegister';
import { AUTH_MESSAGES as MSG } from '../constants/authMessages';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { STYLE } from '../../../theme/style';
import styles from '../styles/webRegisterStyles';

export default function WebRegisterScreen({
  onRegisterSuccess = () => {},
  onBackToLogin     = () => {},
}) {
  const {
    nombre, setNombre, apellidos, setApellidos,
    email, setEmail, username, setUsername, password, setPassword,
    errors, loading, serverError, setServerError,
    handleRegister, showSuccessModal, handleModalClose,
  } = useRegister({ onRegisterSuccess });

  const handleNombreChange = (text) => {
    const cleaned = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
    setNombre(cleaned);
    if (serverError) setServerError(null);
  };

  const handleApellidosChange = (text) => {
    const cleaned = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
    setApellidos(cleaned);
    if (serverError) setServerError(null);
  };

  const fields = [
    { key: 'nombre',    label: MSG.LABEL_NOMBRE,    value: nombre,    onChangeText: handleNombreChange,    placeholder: MSG.PLACEHOLDER_NOMBRE,    error: errors.nombre },
    { key: 'apellidos', label: MSG.LABEL_APELLIDOS,  value: apellidos, onChangeText: handleApellidosChange, placeholder: MSG.PLACEHOLDER_APELLIDOS,  error: errors.apellidos },
    { key: 'email',     label: MSG.LABEL_EMAIL,      value: email,     onChangeText: (v) => { setEmail(v); if (serverError) setServerError(null); },     placeholder: MSG.PLACEHOLDER_EMAIL,     error: errors.email,    autoCapitalize: 'none', autoCorrect: false, keyboardType: 'email-address' },
    { key: 'username',  label: MSG.LABEL_USERNAME,   value: username,  onChangeText: (v) => { setUsername(v); if (serverError) setServerError(null); },  placeholder: MSG.PLACEHOLDER_USERNAME,  error: errors.username, autoCapitalize: 'none', autoCorrect: false },
    { key: 'password',  label: MSG.LABEL_PASSWORD,   value: password,  onChangeText: (v) => { setPassword(v); if (serverError) setServerError(null); },  placeholder: MSG.PLACEHOLDER_PASSWORD,  error: errors.password, secureTextEntry: true },
  ];

  return (
    <ScrollView style={[STYLE.container, { padding: 0 }]} showsVerticalScrollIndicator={false}>

      <Modal
        visible={showSuccessModal}
        onClose={handleModalClose}
        showCloseButton={false}
        containerStyle={{ width: "100%", maxWidth: 860, alignSelf: "center", padding: 24 }}
      >
        <View style={{ alignItems: "center", paddingVertical: 10 }}>
          <View style={{ marginBottom: 16, backgroundColor: COLORS.successLight, padding: 12, borderRadius: 99, alignItems: "center", justifyContent: "center", width: 64, height: 64 }}>
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
            style={{ width: "100%", marginTop: 24, borderColor: COLORS.primary }}
            textStyle={{ color: COLORS.primary }}
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

      <View style={STYLE.contentWrapper}>
        <View style={styles.formSection}>
        <Card>

          {fields.map(({ key, error, label, ...fieldProps }) => (
            <FormField
              key={key}
              label={`${label} *`}
              editable={!loading}
              style={error ? { borderColor: COLORS.error } : null}
              {...fieldProps}
            />
          ))}

          {(Object.values(errors).some((e) => e !== "") || serverError) && (
            <View style={{ padding: 12, backgroundColor: COLORS.errorLight, borderRadius: 8, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon icon={ICONS.alertTriangle} size={18} color={COLORS.error} />
              <CustomText style={{ color: COLORS.error, fontSize: 13, fontWeight: "600", flex: 1 }}>
                {serverError ? serverError : "Revisa los campos obligatorios marcados con * antes de guardar."}
              </CustomText>
            </View>
          )}

          {loading && <Spinner text={MSG.LOADING_REGISTER} />}

          <Button variant="outline" disabled={loading} onPress={handleRegister}>
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