/**
 * ============================================================
 * HOOK: useUsuarioSesion
 * ============================================================
 *
 * Obtiene de forma reactiva el nombre del usuario en sesión
 * almacenado en tokenStorage. Expone usuarioSesion como string
 * listo para mostrar en la UI.
 *
 * @dependencies - getUsuario de login/utils/tokenStorage.js
 * @validations  - Retorna 'Usuario' como fallback si no hay sesión
 *               - o si la lectura de tokenStorage falla.
 * @navigation   - Ninguna.
 */

import { useState, useEffect } from 'react';
import { getUsuario } from '../../login/utils/tokenStorage.js';

export function useUsuarioSesion() {
  const [usuarioSesion, setUsuarioSesion] = useState('Usuario');

  useEffect(() => {
    try {
      const user = getUsuario();
      const nombre = user?.nombre || user?.username || user?.user || 'Usuario';
      setUsuarioSesion(nombre);
    } catch {
      setUsuarioSesion('Usuario');
    }
  }, []);

  return usuarioSesion;
}
