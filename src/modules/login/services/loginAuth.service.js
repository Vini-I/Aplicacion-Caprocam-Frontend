/**
 * SERVICIO: loginAuth.service
 * Servicio para verificar y validar las credenciales del PIN de operario contra la API REST backend.
 *
 * @dependencies - api (api/api.js)
 * @validations  - Requiere operarioId válido y un PIN numérico de 4 dígitos.
 * @navigation   - N/A
 */

import api from "../../../api/api";

export async function verifyPinCredentials({ workerId, pinCode }) {
  if (workerId == null || pinCode.length !== 4) {
    return { isValid: false, message: 'Datos inválidos para autenticar.' };
  }

  try {
    const response = await api.post("/login/verificar-pin", {
      operarioId: workerId,
      pin: pinCode,
    });

    return {
      isValid: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (err) {
    if (err.response) {
      // El backend respondió con 401, 404 o 422
      const message = err.response.data?.message || 'Error al verificar el PIN.';
      return { isValid: false, message };
    }
    // No hubo respuesta del servidor (red caída, IP mal, etc.)
    return { isValid: false, message: 'Error de red. Verifica tu conexión.' };
  }
}