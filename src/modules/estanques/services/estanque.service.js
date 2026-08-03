import api from "../../../api/api";

export const estanqueService = {
  /*
    OBTENER TODOS LAS ESTANQUES
    */

  getEstanques: async () => {
    try {
      const response = await api.get("/estanques");

      return response.data.data;

    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 422 || error.response?.status === 400) {
        throw error;
      }

      throw new Error("No se pudieron obtener los estanques");
    }
  },

  /*
    OBTENER LOS ESTANQUES POR ID
    */

  getEstanqueById: async (id) => {
    try {
      const response = await api.get(`/estanques/${id}`);

      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 422 || error.response?.status === 400) {
        throw error;
      }

      throw new Error("No se pudo obtener la información del estanque.");
    }
  },

  /*
    CREAR UN ESTANQUE
    */

  createEstanque: async (estanqueDTO) => {
    try {
      const response = await api.post("/estanques", estanqueDTO);

      return response.data;
    } catch (error) {
      if (
        error.response?.status === 404 ||
        error.response?.status === 500 ||
        error.response?.status === 422 ||
        error.response?.status === 400 ||
        error.response?.status === 409
      ) {
        throw error;
      }

      throw new Error("No se pudo registrar el estanque.");
    }
  },

  /*
    ACTUALIZAR UN ESTANQUE
    */

  actualizarEstanque: async (id, estanqueDTO) => {
    try {
      const response = await api.put(`/estanques/${id}`, estanqueDTO);

      return response.data;
    } catch (error) {

      if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 422 || error.response?.status === 400 || error.response?.status === 409) {
        throw error;
      }

      throw new Error("No se pudieron guardar los cambios del estanque.");
    }
  },

  /*
    ELIMINAR UN ESTANQUE
    */

  eliminarEstanque: async (id) => {
    try {
      const response = await api.delete(`/estanques/${id}`);

      return response.data;
    } catch (error) {
      if (
        error.response?.status === 404 ||
        error.response?.status === 500 ||
        error.response?.status === 422 ||
        error.response?.status === 400 ||
        error.response?.status === 409
      ) {
        throw error;
      }
      throw new Error("No se pudo eliminar el estanque.");
    }
  },
};
