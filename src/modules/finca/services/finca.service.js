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

      throw error;

    }
  },

  createFincas: async (fincaDTO) => {
    try {
      const response = await api.post("/fincas", fincaDTO);

      return response.data;

    } catch (error) {

      console.error("Error al crear finca:", error.response?.data || error.message); 

      throw error;
    }
  },

  updateFincas: async (fincaDTO, fincaCodigoCBO) => {
    try {

      const response = await api.put(`/fincas/${fincaCodigoCBO}`, fincaDTO);

      return response.data;

    } catch (error) {
      
      console.error("Error al editar finca:", error.response?.data || error.message); 

      throw error;

    } 
  },

  deleteFincas: async (fincaCodigoCBO) => {
    try {

      const response = await api.delete(`/fincas/${fincaCodigoCBO}`);

      return response.data;

    } catch (error) {
      
      console.error("Error al eliminar finca:", error.response?.data || error.message); 

      throw error;

    }
  }
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
