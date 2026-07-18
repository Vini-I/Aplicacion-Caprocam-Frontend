// src/modules/mantCrecimiento/services/estanqueService.js
import api from "../../../api/api";

export const estanqueService  = {

    getEstanques: async () => {
        try {

            const response = await api.get("/estanques")

            return response.data.data;

        } catch (error) {

            throw error;

        }

    }
}