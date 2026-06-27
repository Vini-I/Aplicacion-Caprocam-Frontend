export const TIPOS_EQUIPO = [
  { label: "Aireación", value: "aireacion" },
  { label: "Bombeo", value: "bombeo" },
  { label: "Alimentación", value: "alimentacion" },
  { label: "Monitoreo", value: "monitoreo" },
  { label: "Mantenimiento", value: "mantenimiento" },
  { label: "Otro", value: "otro" },
];

export const ESTADOS_EQUIPO = [
  { label: "Activo", value: "activo" },
  { label: "Mantenimiento", value: "mantenimiento" },
  { label: "Inactivo", value: "inactivo" },
];

export function crearEquipoPayload(formulario) {
  return {
    codigoInterno: formulario.codigoInterno.trim(),
    descripcion: formulario.descripcion.trim(),
    fechaInstalacion: formulario.fechaInstalacion,
    tipo: formulario.tipo,
    estado: formulario.estado,
    funcionEquipo: formulario.funcionEquipo.trim(),
  };
}

export async function agregarEquipo(payload) {
  // TODO backend: reemplazar este stub por la llamada real al endpoint de equipos.
  // El payload ya queda normalizado desde el hook para conectarlo con POST /equipos.
  return Promise.resolve({
    ok: true,
    data: payload,
  });
}