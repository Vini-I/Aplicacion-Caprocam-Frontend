import api from "../../../api/api";

/*
OBTENER TODAS LAS VENTAS
*/

export const getCrecimiento = async () => {
    try {

        const response = await api.get("/crecimiento")

        return response.data.data;

    } catch (error) {

        console.error("Error al ver Crecimiento", error); //Mientras se prueba de forma local

        throw error; 

    }
}

/*
CREAR UNA VENTA
*/

export const createCrecimiento = async (crecimientoDTO) => {
    try {
        
        const response = await api.post("/crecimiento", crecimientoDTO);

        return response.data;

    } catch (error) {

        console.error("Error al crear Crecimiento", error.response?.data || error.message); //Mientras se prueba todo

        throw error;

    }
}