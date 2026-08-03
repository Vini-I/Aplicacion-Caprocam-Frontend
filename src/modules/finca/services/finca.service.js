import api from "../../../api/api";

export const fincaService = {
  getFincas: async () => {
    try {
      const response = await api.get("/fincas");

      return response.data.data.map((finca) => ({
        ...finca,
        telefonoParse: parseTelefonos(finca.telefono),
      }));
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        throw error;
      }

      throw new Error("No se pudieron obtener las fincas");
    }
  },

  getFincasById: async (codigoCBO) => {
    try {
      const response = await api.get(`/fincas/${codigoCBO}`);

      return {
        ...response.data.data,
        telefonoParse: parseTelefonos(response.data.data.telefono),
      };
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        throw error;
      }
      throw new Error("No se pudo obtener la información de la finca.");
    }
  },

  createFincas: async (fincaDTO) => {
    try {
      const response = await api.post("/fincas", fincaDTO);

      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        throw error;
      }
      throw new Error("No se pudo registrar la finca.");
    }
  },

  updateFincas: async (fincaDTO, fincaCodigoCBO) => {
    try {
      const response = await api.put(`/fincas/${fincaCodigoCBO}`, fincaDTO);

      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        throw error;
      }
      throw new Error("No se pudieron guardar los cambios de la finca.");
    }
  },

  deleteFincas: async (fincaCodigoCBO) => {
    try {
      const response = await api.delete(`/fincas/${fincaCodigoCBO}`);

      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        throw error;
      }
      throw new Error("No se pudo eliminar la finca.");
    }
  },
};

function parseTelefonos(telefono) {
  if (!telefono) return ["No hay teléfonos guardado"];

  let lista = [];

  if (Array.isArray(telefono)) {
    lista = telefono;
  } else {
    try {
      const parsed = JSON.parse(telefono);
      lista = Array.isArray(parsed) ? parsed : [telefono];
    } catch {
      lista = [telefono];
    }
  }

  const limpios = lista.filter((tel) => tel && tel.toString().trim() !== "");

  return limpios.length > 0 ? limpios : ["No hay teléfonos guardado"];
}
