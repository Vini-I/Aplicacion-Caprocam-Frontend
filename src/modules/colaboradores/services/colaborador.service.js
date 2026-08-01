import api from "../../../api/api";

export const colaboradorService  = {

    getColaboradores: async () => { 
        try {

            const response = await api.get("/colaboradores");

            return response.data.data;

        } catch (error) {
            
            throw error;
        
        }
    },

    getColaboradorById: async (id) => {
        try {

            const response = await api.get(`/colaboradores/${id}`);

            return response.data.data;

        } catch (error) {

            throw error;

        }
    }
}

