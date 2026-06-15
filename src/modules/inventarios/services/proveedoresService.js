export const proveedoresService = [
  { id: 1, nombre: "Biomar", iniciales: "BI", tipoProducto: "alimento", telefono: "+506 2200-1100", correo: "ventas@biomar.cr", direccion: "San José, Costa Rica", notas: "" },
  { id: 2, nombre: "Farivet", iniciales: "FV", tipoProducto: "antibioticos", telefono: "+506 2245-8800", correo: "info@farivet.com", direccion: "Alajuela, Costa Rica", notas: "" },
  { id: 3, nombre: "Trisan", iniciales: "TR", tipoProducto: "fertilizantes", telefono: "+506 2290-3300", correo: "clientes@trisan.co.cr", direccion: "Cartago, Costa Rica", notas: "" },
];

export function getProveedorById(id) {
  return proveedoresService.find((p) => String(p.id) === String(id));
}