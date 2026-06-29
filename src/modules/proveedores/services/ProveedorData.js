/**
 * Datos de ejemplo para proveedores.
 * Estos datos se utilizan para mostrar la lista de proveedores y sus detalles en las pantallas correspondientes.
 *
 */
export const proveedoresMock = [
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

export const tiposProducto = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];

const CATEGORIA_A_TIPO = {
  "Alimentación": "Alimento",
  "Tratamiento":  "Antibióticos",
  "Químico":      "Fertilizantes",
  "Fertilizante": "Fertilizantes",
  "Antibiótico":  "Antibióticos",
  "Probiótico":   "Probióticos",
};

export function getProveedoresByCategoria(categoria) {
  if (!categoria) return proveedoresMock;

  const tipo = CATEGORIA_A_TIPO[categoria];
  if (!tipo) return proveedoresMock;

  return proveedoresMock.filter((p) => p.tipoProducto === tipo);
}