/**
 * ============================================================
 * SERVICE: COMPRADORDATA
 * ============================================================
 * Módulo: Compradores
 *
 * Datos de ejemplo (mock) usados por las pantallas de compradores.
 *
 * FUNCIONALIDAD:
 * 1. compradoresMock: lista de compradores de ejemplo (id, nombre,
 *    tipo de producto, teléfono, correo, dirección, notas), usada
 *    en la lista, el detalle y como base para Editar.
 * 2. tiposProducto: opciones para el Select de tipo de producto en
 *    la pantalla de editar comprador.
 *
 * IMPORTANTE:
 * - Los value de tiposProducto van en minúscula ("alimento"), pero
 *   compradoresMock.tipoProducto usa el label capitalizado
 *   ("Alimento"). Si se usa tiposProducto para hacer match exacto
 *   contra compradoresMock, revisar ese desfase de formato.
 * ============================================================
 */

export const compradoresMock = [
  {
    id: 1,
    nombre: "Biomar",
    iniciales: "BI",
    tipoProducto: "Alimento",
    telefono: "+50622001100",
    correo: "ventas@biomar.cr",
    direccion: "San José, Costa Rica",
    notas: "",
  },
  {
    id: 2,
    nombre: "Farivet",
    iniciales: "FV",
    tipoProducto: "Antibióticos",
    telefono: "+50622458800",
    correo: "info@farivet.com",
    direccion: "Alajuela, Costa Rica",
    notas: "",
  },
  {
    id: 3,
    nombre: "Trisan",
    iniciales: "TR",
    tipoProducto: "Fertilizantes",
    telefono: "+50622903300",
    correo: "clientes@trisan.co.cr",
    direccion: "Cartago, Costa Rica",
    notas: "",
  },
];

// Opciones de tipo de producto para el select en la pantalla de editar comprador
export const tiposProducto = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];
