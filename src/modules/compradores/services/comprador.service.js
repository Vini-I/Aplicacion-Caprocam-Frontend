import api from "../../../api/api";

export const compradorService = {

  getCompradores: async() => {
    try {

      const response = await api.get("/compradores");

      return response.data.data;

    } catch (error) {

      throw error; 

    }
  }
}