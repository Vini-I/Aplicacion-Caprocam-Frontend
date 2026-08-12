//Service DensidadPoblacional

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

async function getAll() {
  try {
    const response = await api.get("/densidad-poblacional");
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener densidades poblacionales");
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/densidad-poblacional/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener la densidad poblacional");
  }
}

async function getDatosBaseEstanque(idEstanque) {
  /*
  Descripcion:
  Trae los datos base del estanque elegido para precargar el
  formulario: area en hectareas, siembra por m2, cantidad de tiros
  recomendada y area de atarraya sugerida.

  El area sale de largo x ancho del estanque y la siembra por m2 de
  la siembra activa de ese estanque; ninguno de los dos se digita.

  Parametros:
  - idEstanque: Id del estanque seleccionado.

  Retorna:
  - Objeto con { areaEstanque, cantidadSiembra, origenCantidadSiembra,
    tirosRecomendados, areaAtarrayaSugerida, ... }.
  */
  try {
    const response = await api.get(`/densidad-poblacional/estanque/${idEstanque}/datos-base`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener los datos del estanque");
  }
}

async function create(densidadDTO) {
  try {
    const response = await api.post("/densidad-poblacional", densidadDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al crear la densidad poblacional");
  }
}

async function update(id, densidadDTO) {
  try {
    const response = await api.put(`/densidad-poblacional/${id}`, densidadDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al actualizar la densidad poblacional");
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/densidad-poblacional/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al eliminar la densidad poblacional");
  }
}

const densidadPoblacionalService = {
  getAll,
  getById,
  getDatosBaseEstanque,
  create,
  update,
  deleteById,
};

export default densidadPoblacionalService;