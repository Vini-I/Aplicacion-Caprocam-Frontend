/**
 * ============================================================
 * CONSTANTES: Mensajes de Autenticación Web
 * ============================================================
 *
 * Centraliza todos los textos mostrados en la pantalla de
 * login web. Facilita cambios de mensajes y mantenimiento.
 */

export const AUTH_MESSAGES = {

  
  //Encabezado
  COMPANY_NAME: 'Caprocam',
  SUBTITLE: 'Ingresa tus credenciales para continuar',


  // SECCIÓN: Etiquetas de campos
  LABEL_USERNAME: 'Usuario',
  LABEL_PASSWORD: 'Contraseña',

  // SECCIÓN: Placeholders (en mayúsculas según estándar del proyecto)
  PLACEHOLDER_USERNAME: 'INGRESA TU USUARIO',
  PLACEHOLDER_PASSWORD: 'INGRESA TU CONTRASEÑA',

  // SECCIÓN: Botones
  BUTTON_LOGIN: 'Iniciar Sesión',
  BUTTON_REGISTER: 'Registrarse',

  // SECCIÓN: Estados de carga
  LOADING: 'Verificando credenciales...',

  // SECCIÓN: Errores de validación (cliente)
  ERROR_USERNAME_REQUIRED: 'El usuario es obligatorio',
  ERROR_PASSWORD_REQUIRED: 'La contraseña es obligatoria',
  ERROR_PASSWORD_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
  ERROR_PASSWORD_UPPERCASE: 'La contraseña debe iniciar con una letra mayúscula',
  ERROR_PASSWORD_NUMERIC: 'La contraseña debe contener al menos 4 números',

  // SECCIÓN: Errores de autenticación (servidor)
  ERROR_INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos',
  ERROR_SERVER: 'Error del servidor. Intenta de nuevo más tarde',
  ERROR_NETWORK: 'Sin conexión. Verifica tu red e intenta de nuevo',
  ERROR_UNKNOWN: 'Ocurrió un error',

  // SECCIÓN: Separador entre botones
  SEPARATOR_TEXT: '¿No tienes cuenta?',
};