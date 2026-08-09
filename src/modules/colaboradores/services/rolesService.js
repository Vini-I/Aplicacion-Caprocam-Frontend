/**
 * ============================================================
 * SERVICIO: rolesService
 * ============================================================
 * Módulo: Colaboradores
 *
 * Responsabilidad:
 * - Proveer los roles disponibles para asignar a un colaborador.
 * - Actualmente es un MOCK/fallback porque el backend no tiene
 *   una ruta específica para /roles.
 *
 * NOTA: Reemplazar con una llamada a API cuando el backend
 *       exponga GET /roles o equivalente.
 * ============================================================
 */

// Basado en la captura de pantalla de la tabla 'roles' de la DB.
// (IDs 1 al 5)
const ROLES_MOCK = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Rol administrativo inicial del sistema",
  },
  {
    id: 2,
    nombre: "Administrador General",
    descripcion: "Acceso total a la plataforma y configuración del sistema",
  },
  {
    id: 3,
    nombre: "Gerente de Finca",
    descripcion: "Gestión operativa, inventarios y personal de finca",
  },
  {
    id: 4,
    nombre: "Biologo / Tecnico Acuacultura",
    descripcion: "Supervisión de parámetros físicos, químicos y patológicos",
  },
  {
    id: 5,
    nombre: "Operario de Campo",
    descripcion: "Registro diario de alimentaciones, conteos y mantenimiento",
  },
];

/**
 * Obtiene la lista de roles.
 * Devuelve una promesa para mantener la interfaz asíncrona (fallback).
 */
export const getRoles = async () => {
  return Promise.resolve([...ROLES_MOCK]);
};

/**
 * Devuelve los roles formateados para el componente <Select>.
 * Usa { label: nombre, value: id }.
 */
export const getRolesOptions = async () => {
  const roles = await getRoles();
  return roles.map((role) => ({
    label: role.nombre,
    value: role.id, // 1, 2, 3, 4, 5
  }));
};