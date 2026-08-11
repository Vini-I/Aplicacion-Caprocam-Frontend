import api from "../../../api/api";

function construirErrorHttp(error, mensajeGenerico) {
  const status = error?.response?.status;
  const mensaje = error?.response?.data?.message || error?.response?.data?.error || error?.message;

  if (status === 500) {
    return new Error(mensajeGenerico);
  }
  
  if (status) {
    const err = new Error(mensaje || mensajeGenerico);
    err.status = status;
    return err;
  }

  return new Error(mensajeGenerico);
}

/*
OBTENER TODAS LAS VENTAS
*/

export const getVentas = async () => {
    try {

        const response = await api.get("/ventas");

        return response.data.data;

    } catch (error) {
        throw construirErrorHttp(error, "No se pudieron obtener las ventas");
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
        throw construirErrorHttp(error, "No se pudo registrar la venta");
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
        throw construirErrorHttp(error, "No se pudo obtener la información de la venta");
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
        throw construirErrorHttp(error, "No se pudieron guardar los cambios de la venta");
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
        throw construirErrorHttp(error, "No se pudo eliminar la venta");
    }
};