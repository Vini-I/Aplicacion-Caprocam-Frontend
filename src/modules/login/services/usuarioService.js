import api from "../../../api/api";

export async function getUsuarioById(id) {
  const response = await api.get(`/login/${id}`);

  const payload = response.data?.data ?? response.data;

  return payload;
}