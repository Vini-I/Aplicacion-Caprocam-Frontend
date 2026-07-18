import api from "../../../api/api";

export const fincaService = {

  getFincas: async () => {
    try {

      const response = await api.get("/fincas");

      return response.data.data;

    } catch (error) {
      
      throw error;
    
    }
  }
}