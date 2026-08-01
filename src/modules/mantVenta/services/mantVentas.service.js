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

/*
OBTENER UNA VENTA POR ID
NOTA: ruta asumida por convención REST ("/ventas/:id"), verificar contra el backend real.
*/

export const getVentaById = async (id) => {
    try {

        const response = await api.get(`/ventas/${id}`);

        return response.data.data;

    } catch (error) {

        console.error("Error al obtener venta:", error.response?.data || error.message);

        throw error;

    }
};

/*
ACTUALIZAR UNA VENTA
NOTA: ruta/método asumidos por convención REST ("/ventas/:id" con PUT), verificar contra el backend real.
*/

export const updateVenta = async (id, ventaDTO) => {
    try {

        const response = await api.put(`/ventas/${id}`, ventaDTO);

        return response.data;

    } catch (error) {

        console.error("Error al actualizar venta:", error.response?.data || error.message);

        throw error;

    }
};

/*
ELIMINAR UNA VENTA
NOTA: ruta/método asumidos por convención REST ("/ventas/:id" con DELETE), verificar contra el backend real.
*/

export const deleteVenta = async (id) => {
    try {

        const response = await api.delete(`/ventas/${id}`);

        return response.data;

    } catch (error) {

        console.error("Error al eliminar venta:", error.response?.data || error.message);

        throw error;

    }
};