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
 *    cédula, tipo de producto, teléfono, correo, dirección, notas),
 *    usada en la lista, el detalle y como base para Editar.
 * 2. tiposProducto: opciones para el Select de tipo de producto en
 *    la pantalla de editar comprador.
 *
 * IMPORTANTE:
 * - Los value de tiposProducto van en minúscula ("alimento"), pero
 *   compradoresMock.tipoProducto usa el label capitalizado
 *   ("Alimento"). Si se usa tiposProducto para hacer match exacto
 *   contra compradoresMock, revisar ese desfase de formato.
 * - nombre ahora usa nombres de personas (no de empresas): un
 *   comprador normalmente se registra como persona física, no como
 *   compañía.
 * - cedula es un dato obligatorio e inmutable del comprador (no se
 *   edita una vez creado), por eso viene fija en cada registro del
 *   mock, igual que el id.
 * ============================================================
 */

export const compradoresMock = [
  {
    id: 1,
    nombre: "María José Solano Vargas",
    iniciales: "MS",
    cedula: "1-0453-0987",
    tipoProducto: "Alimento",
    telefono: "+50688451122",
    correo: "maria.solano@gmail.com",
    direccion: "San José, Costa Rica",
    notas: "",
  },
  {
    id: 2,
    nombre: "Carlos Andrés Fernández Rojas",
    iniciales: "CF",
    cedula: "2-0678-0345",
    tipoProducto: "Antibióticos",
    telefono: "+50670223344",
    correo: "carlos.fernandezr@hotmail.com",
    direccion: "Alajuela, Costa Rica",
    notas: "",
  },
  {
    id: 3,
    nombre: "Ana Lucía Mora Chinchilla",
    iniciales: "AM",
    cedula: "3-0345-0678",
    tipoProducto: "Fertilizantes",
    telefono: "+50661778899",
    correo: "analucia.mora@yahoo.com",
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