import api from "../../../api/api";

export const compradorService = {

  getCompradores: async() => {
    try {

      const response = await api.get("/compradores");

      return response.data.data;

    } catch (error) {

      throw error; 
      
    }
  },

  getCompradorPorId: async (id) => {
    try {
      const response = await api.get(`/compradores/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  },

  // CORREGIDO: Se cambia de api.put('/compradores/:id/activo') a api.delete('/compradores/:id')
  desactivarComprador: async (id) => {
    try {
      const response = await api.delete(`/compradores/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
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