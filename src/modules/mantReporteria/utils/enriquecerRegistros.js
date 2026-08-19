/**
 * ============================================================
 * UTIL: enriquecerRegistros
 * ============================================================
 * Resuelve nombres de finca, estanque, colaborador asignado
 * y "creado por" (colaborador o usuario admin).
 */

import { colaboradorService } from "../../colaboradores/services/colaborador.service.js";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { getUsuarioById } from "../../login/services/usuarioService.js";
import { productoService } from "../../productos/services/producto.service.js";

export function nombreCompletoPersona(persona) {
  if (!persona || typeof persona !== "object") return null;

  const nombre = persona.nombre ?? persona.name ?? "";
  const apellidos =
    persona.apellidos ??
    persona.apellido ??
    persona.lastName ??
    persona.last_name ??
    "";

  const completo = `${nombre} ${apellidos}`.trim();
  if (completo) return completo;

  return (
    persona.nombreCompleto ??
    persona.nombre_completo ??
    persona.nombreUsuario ??
    persona.nombre_usuario ??
    persona.username ??
    persona.usuario ??
    persona.email ??
    null
  );
}

function pickId(registro, keys) {
  for (const key of keys) {
    const valor = registro?.[key];
    if (valor === undefined || valor === null || String(valor).trim() === "") {
      continue;
    }
    const n = Number(valor);
    if (!Number.isNaN(n) && n !== 0) return n;
  }
  return null;
}

/**
 * Carga catálogos + resuelve usuarios creadores y enriquece registros.
 */
export async function cargarYEnriquecerRegistros(registros = []) {
  const data = Array.isArray(registros) ? registros : [];

  const [fincasData, estanquesData, colaboradoresData, productosData] = await Promise.all([
    fincaService.getFincas(),
    estanqueService.getEstanques(),
    colaboradorService.getColaboradores(),
    productoService.getProductos(),
  ]);

  const fincasMap = Object.fromEntries(
    (fincasData || []).map((f) => [Number(f.id), f.nombreFinca]),
  );

  const estanquesMap = Object.fromEntries(
    (estanquesData || []).map((e) => [Number(e.id), e.codigo]),
  );

  const colaboradoresMap = Object.fromEntries(
    (colaboradoresData || []).map((c) => [
      Number(c.id),
      `${c.nombre ?? ""} ${c.apellidos ?? ""}`.trim() ||
        c.nombre ||
        "Sin nombre",
    ]),
  );

  const productosMap = Object.fromEntries(
    (productosData || []).map((p) => [Number(p.id), p.nombre]),
  );

  const idsUsuario = [
    ...new Set(
      data
        .map((r) =>
          pickId(r, [
            "creadoPorUsuarioId",
            "creado_por_usuario_id",
            "creadoPorUsuario",
          ]),
        )
        .filter(Boolean),
    ),
  ];

  const usuariosMap = {};
  await Promise.all(
    idsUsuario.map(async (id) => {
      try {
        const usuario = await getUsuarioById(id);
        usuariosMap[id] =
          nombreCompletoPersona(usuario) || `Usuario #${id}`;
      } catch (e) {
        console.warn(`No se pudo obtener usuario ${id}`, e);
        usuariosMap[id] = `Usuario #${id}`;
      }
    }),
  );

  return data.map((registro) => {
    const idFinca = pickId(registro, [
      "finca",
      "finca_id",
      "fincaId",
      "idFinca",
    ]);
    const idEstanque = pickId(registro, [
      "estanque",
      "estanque_id",
      "estanqueId",
      "idEstanque",
    ]);
    const idColaborador = pickId(registro, [
      "colaborador",
      "colaborador_id",
      "colaboradorId",
      "idColaborador",
    ]);
    const idProducto = pickId(registro, [
      "producto",
      "producto_id",
      "productoId",
      "idProducto",
    ]);
    const idCreadoPorColab = pickId(registro, [
      "creadoPorColaboradorId",
      "creado_por_colaborador_id",
      "creadoPorColaborador",
    ]);
    const idCreadoPorUsuario = pickId(registro, [
      "creadoPorUsuarioId",
      "creado_por_usuario_id",
      "creadoPorUsuario",
    ]);

    let nombreCreadoPor = "—";
    if (idCreadoPorColab && colaboradoresMap[idCreadoPorColab]) {
      nombreCreadoPor = colaboradoresMap[idCreadoPorColab];
    } else if (idCreadoPorUsuario) {
      nombreCreadoPor =
        usuariosMap[idCreadoPorUsuario] || `Usuario #${idCreadoPorUsuario}`;
    }

    return {
      ...registro,
      nombreFinca:
        registro.nombreFinca ||
        (idFinca && fincasMap[idFinca]) ||
        "No encontrada",
      codigoEstanque:
        registro.codigoEstanque ||
        (idEstanque && estanquesMap[idEstanque]) ||
        "No encontrado",
      nombreColaborador:
        registro.nombreColaborador ||
        registro.responsable ||
        (idColaborador && colaboradoresMap[idColaborador]) ||
        "Desconocido",
      nombreProducto:
        registro.nombreProducto ||
        (idProducto && productosMap[idProducto]) ||
        "No encontrado",
      nombreCreadoPor,
    };
  });
}