import api from "../../../api/api";

/*
OBTENER TODAS LAS VENTAS
*/

export const getVentas = async () => {
    try {

        const response = await api.get("/ventas");

        return response.data.data;

    } catch (error) {

        console.error("Error al crear venta:", error); //Mientras se prueba todo unicamente

        throw error;

    }
};

/*
CREAR UNA VENTA
*/

export const createVenta = async (ventaDTO) => {
    try {
        
        const response = await api.post("/ventas", ventaDTO);

        return response.data;

    } catch (error) {

        console.error("Error al crear venta:", error.response?.data || error.message); //Mientras se prueba todo unicamente

        throw error;

    }
}