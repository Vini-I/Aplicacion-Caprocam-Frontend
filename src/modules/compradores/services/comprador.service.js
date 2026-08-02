import api from "../../../api/api";

/**
 * ============================================================
 * MANEJO DE ERRORES DE ESTE SERVICE
 * ============================================================
 * Patrón acordado en equipo (ver Explicación ModalError): si el
 * back devuelve un status "controlado" (con un mensaje real y útil,
 * ej. 404 "Comprador no encontrado"), dejamos pasar el error tal
 * cual (throw error) para que el mensaje real del back llegue hasta
 * mostrarError(). Para cualquier otro status (500 inesperado, sin
 * respuesta del servidor, etc.) armamos un mensaje genérico propio
 * de la acción que falló, en vez de mostrarle al usuario un error
 * técnico crudo.
 * ============================================================
 */
function esErrorControlado(error, statusEsperados) {
  return statusEsperados.includes(error.response?.status);
}

export const compradorService = {

  getCompradores: async () => {
    try {
      const response = await api.get("/compradores");
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [500])) throw error;
      throw new Error("No se pudieron obtener los compradores.");
    }
  },

  getCompradorPorId: async (id) => {
    try {
      const response = await api.get(`/compradores/${id}`);
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [404, 500])) throw error;
      throw new Error("No se pudo obtener el comprador.");
    }
  },


  crearComprador: async (datos) => {
    try {
      const response = await api.post("/compradores", {
        nombre: datos.nombre,
        cedula: datos.cedula,
        telefono: datos.telefono,
        correo: datos.correo,
        direccion: datos.direccion,
        notas: datos.notas,
      });
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [400, 500])) throw error;
      throw new Error("No se pudo crear el comprador.");
    }
  },

  actualizarComprador: async (id, datos) => {
    try {
      const response = await api.put(`/compradores/${id}`, {
        nombre: datos.nombre,
        cedula: datos.cedula,
        telefono: datos.telefono,
        correo: datos.correo,
        direccion: datos.direccion,
        notas: datos.notas,
      });
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [400, 404, 500])) throw error;
      throw new Error("No se pudo actualizar el comprador.");
    }
  },

  // CORREGIDO: Se cambia de api.put('/compradores/:id/activo') a api.delete('/compradores/:id')
  desactivarComprador: async (id) => {
    try {
      const response = await api.delete(`/compradores/${id}`);
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [404, 500])) throw error;
      throw new Error("No se pudo eliminar el comprador.");
    }
  },
}

export function mapComprador(apiComprador) {
  if (!apiComprador) return null;
  return {
    id: apiComprador.id,
    nombre: apiComprador.nombre,
    cedula: apiComprador.cedula,
    telefono: apiComprador.telefono,
    correo: apiComprador.correo ?? "",
    direccion: apiComprador.direccion ?? "",
    notas: apiComprador.notas ?? "",
    iniciales: obtenerIniciales(apiComprador.nombre),
  };
}

function obtenerIniciales(nombre = "") {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "";
  const primera = palabras[0][0] ?? "";
  const segunda = palabras.length > 1 ? palabras[1][0] ?? "" : "";
  return (primera + segunda).toUpperCase();
}