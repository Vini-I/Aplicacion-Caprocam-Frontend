import api from "../../../api/api";

/*
OBTENER TODAS LAS VENTAS
*/

export const getVentas = async () => {
    try {

        const response = await api.get("/ventas");

        return response.data.data;

    } catch (error) {

        if (error.response?.status === 404 || error.response?.status === 500) {
            throw error;
        }

        throw new Error("No se pudieron obtener las ventas");

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

        if (error.response?.status === 404 || error.response?.status === 500) {
            throw error;
        }

        throw new Error("No se pudo registrar la venta");

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

        if (error.response?.status === 404 || error.response?.status === 500) {
            throw error;
        }

        throw new Error("No se pudo obtener la información de la venta");

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

        if (error.response?.status === 404 || error.response?.status === 500) {
            throw error;
        }

        throw new Error("No se pudieron guardar los cambios de la venta");

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

        if (error.response?.status === 404 || error.response?.status === 500) {
            throw error;
        }

        throw new Error("No se pudo eliminar la venta");

    }
};