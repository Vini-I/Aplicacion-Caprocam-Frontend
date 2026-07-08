/**
 * Datos de ejemplo para compradores.
 * Estos datos se utilizan para mostrar la lista de compradores y sus detalles en las pantallas correspondientes.
 *
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
