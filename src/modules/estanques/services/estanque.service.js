import api from "../../../api/api";

function construirErrorHttp(error, mensajeGenerico) {
  const status = error?.response?.status;
  const mensaje = error?.response?.data?.message || error?.response?.data?.error || error?.message;

  if (status) {
    const err = new Error(mensaje || mensajeGenerico);
    err.status = status;
    return err;
  }

  return new Error(mensajeGenerico);
}

export const estanqueService = {
  /*
    OBTENER TODOS LAS ESTANQUES
    */

  getEstanques: async () => {
    try {
      const response = await api.get("/estanques");

      return response.data.data;

    } catch (error) {
      throw construirErrorHttp(error, "No se pudieron obtener los estanques");
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
      throw construirErrorHttp(error, "No se pudo obtener la información del estanque.");
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
      throw construirErrorHttp(error, "No se pudo registrar el estanque.");
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
      throw construirErrorHttp(error, "No se pudieron guardar los cambios del estanque.");
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
      throw construirErrorHttp(error, "No se pudo eliminar el estanque.");
    }
  },
};
