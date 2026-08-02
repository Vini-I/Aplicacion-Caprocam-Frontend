/**
 * CONSTANTES: authMessages
 * Centraliza los mensajes estáticos, etiquetas de formularios, placeholders
 * y textos de error para los flujos de autenticación web y móvil (AUTH_MESSAGES, LOGIN_MESSAGES).
 *
 * @dependencies - Ninguna
 * @validations  - Cadenas de texto que coinciden con las reglas de validación.
 * @navigation   - N/A
 */

export const AUTH_MESSAGES = {

  // SECCIÓN: Compartido entre Login y Registro Web
  LABEL_USERNAME:            'Usuario',
  LABEL_PASSWORD:            'Contraseña',
  PLACEHOLDER_USERNAME:      'Ingresa tu usuario',
  PLACEHOLDER_PASSWORD:      'Ingresa tu contraseña',
  ERROR_REQUIRED:            'Campo obligatorio',
  ERROR_EMAIL_INVALID:       'Ingresa un correo electrónico válido',
  ERROR_EMAIL_TAKEN:         'El correo electrónico ya está registrado',
  ERROR_PASSWORD_REQUIRED:   'La contraseña es obligatoria',
  ERROR_PASSWORD_LENGTH:     'Mínimo 8 caracteres',
  ERROR_PASSWORD_UPPERCASE:  'Debe incluir al menos una letra mayúscula',
  ERROR_PASSWORD_LOWERCASE:  'Debe incluir al menos una letra minúscula',
  ERROR_PASSWORD_DIGIT:      'Debe incluir al menos un número',
  ERROR_PASSWORD_SYMBOL:     'Debe incluir al menos un símbolo (@$!%*?&._-#)',
  ERROR_SERVER:              'Error del servidor. Intenta de nuevo más tarde',
  ERROR_NETWORK:             'Sin conexión. Verifica tu red e intenta de nuevo',
  ERROR_UNKNOWN:             'Ocurrió un error. Intenta de nuevo',

  // SECCIÓN: Login Web
  COMPANY_NAME:               'Caprocam',
  SUBTITLE:                   'Ingresa tus credenciales para continuar',
  BUTTON_LOGIN:               'Iniciar Sesión',
  BUTTON_GO_TO_REGISTER:      'Registrarse',
  LOADING_LOGIN:              'Verificando credenciales...',
  ERROR_INVALID_CREDENTIALS:  'Usuario o contraseña incorrectos',
  SEPARATOR_TEXT_LOGIN:       '¿No tienes cuenta?',

  // SECCIÓN: Registro Web
  REGISTER_TITLE:           'Crear cuenta',
  REGISTER_SUBTITLE:        'Completa tus datos para registrarte',
  LABEL_NOMBRE:             'Nombre',
  LABEL_APELLIDOS:          'Apellidos',
  LABEL_EMAIL:              'Correo electrónico',
  PLACEHOLDER_NOMBRE:       'Ingresa tu nombre',
  PLACEHOLDER_APELLIDOS:    'Ingresa tus apellidos',
  PLACEHOLDER_EMAIL:        'Ingresa tu correo electrónico',
  BUTTON_SUBMIT_REGISTER:   'Registrarme',
  BUTTON_BACK_TO_LOGIN:     'Ya tengo cuenta',
  LOADING_REGISTER:         'Creando tu cuenta...',
  SEPARATOR_TEXT_REGISTER:  'o',

  // SECCIÓN: Modal de éxito del registro
  MODAL_SUCCESS_TITLE:   '¡Cuenta creada con éxito!',
  MODAL_SUCCESS_BODY:    'Recibirás un correo electrónico con la información de acceso a tu cuenta.',
  MODAL_SUCCESS_BUTTON:  'Volver al Login',
};

export const LOGIN_MESSAGES = {
  // Sección de Turnos
  SHIFT_TITLE: 'Selecciona tu turno',
  SHIFT_SUBTITLE: '¿En qué horario vas a trabajar?',

  // Sección de Trabajadores
  WORKER_TITLE: 'Selecciona tu nombre',
  WORKER_SUBTITLE: 'Toca tu nombre para comenzar',

  // Estados de Carga
  LOADING: 'Cargando colaboradores...',
  ERROR_PREFIX: 'Error: ',
  NO_WORKERS_FOUND: 'No se encontraron colaboradores.',
  SEARCH_PLACEHOLDER: 'Buscar por nombre',
  SYNC_BUTTON_TEXT: 'Sincronizar Usuarios',

  // Botón
  BUTTON_TEXT: 'Continuar',

  // Empresa
  COMPANY_NAME: 'Caprocam',
};