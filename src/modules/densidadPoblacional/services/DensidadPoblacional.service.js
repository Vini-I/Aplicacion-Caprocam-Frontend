//Service DensidadPoblacional

import api from "../../../api/api";

function construirErrorHttp(error, mensajeGenerico) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 500) {
    // Un 500 no trae un mensaje seguro para mostrar (puede ser un
    // detalle interno del servidor): siempre se usa el generico.
    return new Error(mensajeGenerico);
  }

  if (status) {
    // data.error puede venir como un arreglo de mensajes especificos
    // por campo (ver validarCuerpo en el controller: junta uno por
    // cada validacion que fallo y responde 422 con ese arreglo). Ese
    // detalle vale mas que data.message, que es siempre el mismo
    // texto generico ("Datos invalidos para el registro...") sin
    // importar cual campo fallo. Por eso se revisa primero.
    let mensaje;

    if (Array.isArray(data?.error) && data.error.length > 0) {
      mensaje = data.error.join(" ");
    } else {
      mensaje = data?.message || (typeof data?.error === "string" ? data.error : null) || error?.message;
    }

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