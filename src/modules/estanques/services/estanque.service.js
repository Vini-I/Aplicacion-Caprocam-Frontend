import api from "../../../api/api";

export const estanqueService  = {

    /*
    OBTENER TODOS LAS ESTANQUES
    */

    getEstanques: async () => {
        try {

            const response = await api.get("/estanques")

            return response.data.data;

        } catch (error) {

            console.error("Error al obtener estanque:", error.response?.data || error.message);

            throw error;

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

            console.error("Error al obtener estanque:", error.response?.data || error.message);

            throw error;

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

            console.error("Error al crear estanque", error); 

            throw error;

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

            console.error("Error al actualizar un estanque", error)

            throw error;

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

            console.error("Error al eliminar Estanque", error);

            throw error;

        }
    }
}