/**
 * ============================================================
 * SERVICIO: mantEquipoService
 * ============================================================
 *
 * Conecta el módulo de Mantenimiento de Equipos con el backend
 * real mediante la API REST. Expone funciones para tickets,
 * tareas y productos de mantenimiento.
 *
 * @dependencies - api (axios con interceptor de tokens) de api/api.js
 *               - equiposService, tareasService, InventarioService
 *               - mantEquipoMensajes (constantes de mapeo de estados)
 * @validations  - Endpoints bajo /api/v0/:
 *                 GET|POST|PUT|DELETE /mantenimientos
 *                 GET|POST|PUT|DELETE /mantenimientos/:id/tareas
 *                 GET|POST|PUT|DELETE /mantenimientos/:id/productos
 * @navigation   - N/A (capa de servicio).
 */

import api from "../../../api/api.js";
import { equiposService } from "./equiposService.js";
import { obtenerTareas } from "./tareasService.js";
import { getProductosInventario } from "../../inventarios/services/InventarioService.js";
import {
  ESTADO_BACKEND_A_FRONTEND,
  ESTADO_FRONTEND_A_BACKEND,
  TIPO_PERSONAL_A_BACKEND,
  TIPO_PERSONAL_A_FRONTEND,
  LISTA_ESTADOS_EQUIPO,
} from "../constants/mantEquipoMensajes.js";

// Re-exportar para compatibilidad
export {
  ESTADO_BACKEND_A_FRONTEND,
  ESTADO_FRONTEND_A_BACKEND,
  TIPO_PERSONAL_A_BACKEND,
  TIPO_PERSONAL_A_FRONTEND,
  LISTA_ESTADOS_EQUIPO,
  LISTA_ESTADOS_EQUIPO as ESTADOS_EQUIPO,
};

// ─── Adaptador: respuesta backend → objeto frontend ───────────────────────────
function adaptBackendTicket(item) {
  if (!item || !item.id) throw new Error('adaptBackendTicket: item inválido');

  const estadoRaw    = item.estadoTicket || 'En espera';
  const estadoFront  = ESTADO_BACKEND_A_FRONTEND[estadoRaw] || 'en_espera';
  const equipoId     = item.equipoId ? String(item.equipoId) : null;
  const tipoRaw      = item.tipoPersonal || 'TrabajadorInterno';
  const tipoPersonal = TIPO_PERSONAL_A_FRONTEND[tipoRaw] || 'interno';

  // ID visual: número consecutivo del backend
  const idVisual = String(item.id);

  // Tareas vinculadas al ticket (tabla junction mantenimiento_equipo_tareas)
  const tareas = Array.isArray(item.tareas) ? item.tareas.map(t => {
    const nombreDefaut = t.nombre || t.label || t.tarea?.nombre || `Tarea ${t.tareaId || t.id}`;
    return {
      id:               t.id,
      tareaId:          t.tareaId || t.tarea_id,
      value:            String(t.tareaId || t.tarea_id || t.id),
      label:            nombreDefaut,
      nombre:           nombreDefaut,
      categoria:        t.categoria || t.tarea?.categoria || '',
      duracionEstimada: Number(t.duracionEstimada || t.duracion_estimada || t.horas || t.tarea?.horas) || 0,
      descripcion:      t.descripcion || t.tarea?.descripcion || '',
      estado:           t.estadoTarea || t.estado_tarea || 'Pendiente',
      realizada:        (t.estadoTarea || t.estado_tarea) === 'Realizado',
    };
  }) : [];

  // Productos vinculados al ticket (tabla junction mantenimiento_equipo_productos)
  const productos = Array.isArray(item.productos) ? item.productos.map(p => ({
    id:          p.id,
    productoId:  p.productoId || p.producto_id,
    cantidad:    Number(p.cantidad) || 1,
    costoUnitario: Number(p.costoUnitario || p.costo_unitario) || 0,
    subtotal:    Number(p.subtotal) || 0,
    nombre:      p.nombre || p.producto?.nombre || `Producto ${p.productoId || p.id}`,
  })) : [];

  return {
    id:                 idVisual,
    dbId:               item.id,
    equipoId,
    herramienta:        equipoId ? `Equipo ${equipoId}` : 'Equipo General',
    titulo:             item.tituloTicket      || 'Mantenimiento',
    descripcion:        item.descripcionTicket || '',
    tareas,
    productos,
    estado:             estadoFront,
    creadoPor:          item.nombreCreador || (item.creadoPorUsuarioId ? String(item.creadoPorUsuarioId) : 'Usuario'),
    fechaCreacion:      new Date(item.fechaMantenimiento || item.fechaCreacion || Date.now()),
    estadoEquipo:       item.estadoEquipo || '',
    tipoPersonal,
    costoManoObra:      Number(item.costoManoObra)      || 0,
    costoProductos:     Number(item.costoProductos)     || 0,
    costoTotalEstimado: Number(item.costoTotalEstimado) || 0,
    costoTotal:         Number(item.costoTotalEstimado) || 0,
  };
}

// ─── OBTENER todos los tickets ─────────────────────────────────────────────────
export async function obtenerTickets() {
  const response = await api.get('/mantenimientos');
  const data = response.data?.data || response.data;

  if (!Array.isArray(data)) {
    throw new Error('obtenerTickets: la respuesta del servidor no es un arreglo');
  }

  // Resolver nombres de usuarios únicos en paralelo
  const idsUnicos = [...new Set(
    data.map(t => t.creado_por_usuario_id || t.creadoPorUsuarioId).filter(Boolean)
  )];
  const mapaUsuarios = {};
  await Promise.allSettled(
    idsUnicos.map(async (uid) => {
      try {
        const res = await api.get(`/login/${uid}`);
        const u = res.data?.data || res.data;
        mapaUsuarios[String(uid)] = u?.nombre || u?.nombreUsuario || u?.email || String(uid);
      } catch (_) {
        mapaUsuarios[String(uid)] = String(uid);
      }
    })
  );

  return data.map(item => adaptBackendTicket({
    ...item,
    nombreCreador: mapaUsuarios[String(item.creado_por_usuario_id || item.creadoPorUsuarioId)] || null,
  }));
}


// ─── OBTENER un ticket por ID con sus tareas y productos ──────────────────────
export async function obtenerTicketPorId(id) {
  const numericId = String(id).replace(/\D/g, '');

  if (!numericId) {
    throw new Error(`obtenerTicketPorId: ID inválido recibido: "${id}"`);
  }

  try {
    const [resTicket, resTareas, resProductos, resCatTareas, resCatProductos] = await Promise.allSettled([
      api.get(`/mantenimientos/${numericId}`),
      api.get(`/mantenimientos/${numericId}/tareas`),
      api.get(`/mantenimientos/${numericId}/productos`),
      obtenerTareas(),
      getProductosInventario(),
    ]);

    if (resTicket.status === 'rejected') {
      throw resTicket.reason;
    }

    const item = resTicket.value.data?.data || resTicket.value.data;

    // Catálogo de tareas para resolver nombres
    const catTareas = resCatTareas.status === 'fulfilled'
      ? (Array.isArray(resCatTareas.value) ? resCatTareas.value : [])
      : [];

    // Catálogo de productos para resolver nombres
    const rawProd = resCatProductos.status === 'fulfilled' ? resCatProductos.value : [];
    const catProductos = Array.isArray(rawProd) ? rawProd : (Array.isArray(rawProd?.data) ? rawProd.data : []);

    // Tareas del ticket enriquecidas con todos los campos del catálogo
    const tareasVal = resTareas.status === 'fulfilled' ? resTareas.value.data : null;
    const tareasRaw = Array.isArray(tareasVal?.data) ? tareasVal.data : (Array.isArray(tareasVal) ? tareasVal : []);
    const tareas = tareasRaw.map(t => {
      const tareaId = String(t.tareaId || t.tarea_id || t.id || '');
      const c = catTareas.find(x =>
        String(x.id) === tareaId ||
        String(x.tareaId) === tareaId ||
        String(x.value) === tareaId
      );
      return {
        ...t,
        tareaId,
        nombre:           t.nombre || c?.nombre || c?.label || `Tarea ${tareaId}`,
        label:            t.label  || t.nombre  || c?.nombre || c?.label || `Tarea ${tareaId}`,
        categoria:        t.categoria        || c?.categoria || '',
        descripcion:      t.descripcion      || c?.descripcion || '',
        duracionEstimada: t.duracionEstimada || c?.duracionEstimada || Number(c?.horas) || 0,
      };
    });

    // Productos del ticket enriquecidos con nombre del catálogo
    const productosVal = resProductos.status === 'fulfilled' ? resProductos.value.data : null;
    const productosRaw = Array.isArray(productosVal?.data) ? productosVal.data : (Array.isArray(productosVal) ? productosVal : []);
    const productos = productosRaw.map(p => {
      const prodId = String(p.productoId || p.producto_id || p.id || '');
      const enCatalogo = catProductos.find(c =>
        String(c.productoId || c.producto_id || c.id) === prodId ||
        String(c.id) === prodId
      );
      return {
        ...p,
        nombre: p.nombre || enCatalogo?.nombre || enCatalogo?.nombreProducto || `Producto ${prodId}`,
      };
    });

    // Nombre del usuario creador
    let nombreCreador = null;
    if (item.creadoPorUsuarioId) {
      try {
        const resUsuario = await api.get(`/login/${item.creadoPorUsuarioId}`);
        const uData = resUsuario.data?.data || resUsuario.data;
        nombreCreador = uData?.nombre || uData?.nombreUsuario || uData?.email || null;
      } catch (_) {
        // Si no se puede obtener el nombre, se mostrará el ID
      }
    }

    return adaptBackendTicket({ ...item, tareas, productos, nombreCreador });
  } catch (errorDirecto) {
    // Si GET /:id falla, intentar buscar en el listado completo
    const todos = await obtenerTickets();
    const encontrado = todos.find(
      t => t.id === id || String(t.dbId) === numericId
    );
    if (!encontrado) {
      throw new Error(`obtenerTicketPorId: ticket con ID "${id}" no encontrado`);
    }
    return encontrado;
  }
}

// ─── Actualizar estado operativo del equipo ───────────────────────────────────
export async function actualizarEstadoEquipo(equipoId, nuevoEstado) {
  if (!equipoId || !nuevoEstado) return;
  try {
    // Obtener el equipo completo para hacer un PUT con todos los campos
    const equipo = await equiposService.getEquipoById(equipoId);
    if (!equipo) return;
    // updateEquipo mapea data.estado → estadoOperativo en el backend
    await equiposService.updateEquipo(equipoId, { ...equipo, estado: nuevoEstado });
  } catch (err) {
    console.warn('actualizarEstadoEquipo:', err?.message || err);
  }
}

// ─── Reiniciar estado operativo del equipo a Activo ──────────────────────────
export function reiniciarHorasEquipo(equipoId) {
  if (!equipoId) return;
  equiposService.updateEquipo(equipoId, { estadoOperativo: 'Activo' })
    .catch(err => console.warn('reiniciarHorasEquipo:', err?.message || err));
}

// ─── Construir payload para POST / PUT ────────────────────────────────────────
function buildPayload(ticket) {
  if (!ticket.equipoId) throw new Error('buildPayload: equipoId es obligatorio');
  if (!ticket.titulo)   throw new Error('buildPayload: titulo es obligatorio');

  const estadoBackend       = ESTADO_FRONTEND_A_BACKEND[ticket.estado]     || 'En espera';
  const tipoPersonalBackend = TIPO_PERSONAL_A_BACKEND[ticket.tipoPersonal] || 'TrabajadorInterno';

  const fechaISO = ticket.fechaCreacion instanceof Date
    ? ticket.fechaCreacion.toISOString().slice(0, 19).replace('T', ' ')
    : new Date().toISOString().slice(0, 19).replace('T', ' ');

  const codigoTicket = (ticket.codigoTicket || ticket.codigo || `MT-${String(Date.now()).slice(-6)}`).slice(0, 10);

  return {
    codigoTicket,
    fechaMantenimiento: fechaISO,
    tituloTicket:       ticket.titulo,
    descripcionTicket:  ticket.descripcion,
    equipoId:           Number(ticket.equipoId),
    estadoTicket:       estadoBackend,
    tipoPersonal:       tipoPersonalBackend,
    costoManoObra:      Number(ticket.costoManoObra)  || 0,
    costoProductos:     Number(ticket.costoProductos  || ticket.costoTotal) || 0,
    costoTotalEstimado: Number(ticket.costoTotal)      || 0,
  };
}

// ─── Vincular tareas al ticket (tabla junction) ───────────────────────────────
async function vincularTareas(mantenimientoEquipoId, tareas) {
  if (!Array.isArray(tareas) || tareas.length === 0) return;

  const calls = tareas.map(t => {
    const tareaId = t.tareaId || t.value || t.id;
    if (!tareaId) return null;
    return api.post('/mantenimientos/tareas', {
      mantenimientoEquipoId,
      tareaId: Number(tareaId),
      estadoTarea: t.realizada ? 'Realizado' : 'Pendiente',
    }).catch(err => console.warn(`vincularTareas: no se pudo vincular tarea ${tareaId}:`, err?.message));
  }).filter(Boolean);

  await Promise.allSettled(calls);
}

// ─── Vincular productos al ticket (tabla junction) ────────────────────────────
async function vincularProductos(mantenimientoEquipoId, productos) {
  if (!Array.isArray(productos) || productos.length === 0) return;

  const calls = productos.map(p => {
    const productoId = p.productoId || p.id;
    if (!productoId) return null;
    const cantidad     = Number(p.cantidad) || 1;
    const costoUnitario = Number(p.precioUnidad || p.precio || p.costoUnitario) || 0;
    const subtotal     = cantidad * costoUnitario;

    return api.post('/mantenimientos/productos', {
      mantenimientoEquipoId,
      productoId: Number(productoId),
      cantidad,
      costoUnitario,
      subtotal,
    }).catch(err => console.warn(`vincularProductos: no se pudo vincular producto ${productoId}:`, err?.message));
  }).filter(Boolean);

  await Promise.allSettled(calls);
}

// ─── CREAR ticket ──────────────────────────────────────────────────────────────
export async function agregarTicket(ticket) {
  const payload = buildPayload(ticket);
  const res = await api.post('/mantenimientos', payload);
  const backendData = res.data?.data || res.data;
  const nuevoTicket = adaptBackendTicket(backendData);

  // Vincular tareas y productos en paralelo después de crear el ticket
  await Promise.allSettled([
    vincularTareas(nuevoTicket.dbId, ticket.tareas),
    vincularProductos(nuevoTicket.dbId, ticket.productos || []),
  ]);

  return nuevoTicket;
}

// ─── Sincronizar tareas al actualizar ticket (diff inteligente) ───────────────
async function sincronizarTareas(mantenimientoEquipoId, tareasNuevas) {
  try {
    const res = await api.get(`/mantenimientos/${mantenimientoEquipoId}/tareas`);
    const raw = res.data?.data ?? res.data;
    const existentes = Array.isArray(raw) ? raw : [];

    const safeTareasNuevas = Array.isArray(tareasNuevas) ? tareasNuevas : [];
    const procesadosExistentesIds = new Set();

    for (const t of safeTareasNuevas) {
      const tareaId = t.tareaId || t.value || t.id;
      if (!tareaId) continue;

      const estadoNuevo = t.realizada ? 'Realizado' : 'Pendiente';
      const existente = existentes.find(x => String(x.tareaId || x.tarea_id) === String(tareaId));

      if (existente) {
        procesadosExistentesIds.add(existente.id);
        const estadoActual = existente.estadoTarea || existente.estado_tarea;
        if (estadoActual !== estadoNuevo) {
          await api.put(`/mantenimientos/tareas/${existente.id}`, { estadoTarea: estadoNuevo })
            .catch(err => console.warn(`sincronizarTareas PUT failed for ${existente.id}:`, err?.message));
        }
      } else {
        await api.post('/mantenimientos/tareas', {
          mantenimientoEquipoId,
          tareaId: Number(tareaId),
          estadoTarea: estadoNuevo,
        }).catch(err => console.warn(`sincronizarTareas POST failed for tarea ${tareaId}:`, err?.message));
      }
    }

    for (const ex of existentes) {
      if (!procesadosExistentesIds.has(ex.id)) {
        await api.delete(`/mantenimientos/tareas/${ex.id}`)
          .catch(err => console.warn(`sincronizarTareas DELETE failed for ${ex.id}:`, err?.message));
      }
    }
  } catch (e) {
    console.warn('sincronizarTareas falló:', e?.message || e);
  }
}

// ─── Sincronizar productos al actualizar ticket (diff inteligente) ────────────
async function sincronizarProductos(mantenimientoEquipoId, productosNuevos) {
  try {
    const res = await api.get(`/mantenimientos/${mantenimientoEquipoId}/productos`);
    const raw = res.data?.data ?? res.data;
    const existentes = Array.isArray(raw) ? raw : [];

    const safeProductosNuevos = Array.isArray(productosNuevos) ? productosNuevos : [];
    const procesadosExistentesIds = new Set();

    for (const p of safeProductosNuevos) {
      const productoId = p.productoId || p.id;
      if (!productoId) continue;

      const cantidad = Number(p.cantidad) || 1;
      const costoUnitario = Number(p.precioUnidad || p.precio || p.costoUnitario) || 0;
      const subtotal = cantidad * costoUnitario;

      const existente = existentes.find(x => String(x.productoId || x.producto_id) === String(productoId));

      if (existente) {
        procesadosExistentesIds.add(existente.id);
        const cantActual = Number(existente.cantidad);
        const costoActual = Number(existente.costoUnitario || existente.costo_unitario);
        if (cantActual !== cantidad || costoActual !== costoUnitario) {
          await api.put(`/mantenimientos/productos/${existente.id}`, {
            cantidad,
            costoUnitario,
            subtotal,
          }).catch(err => console.warn(`sincronizarProductos PUT failed for ${existente.id}:`, err?.message));
        }
      } else {
        await api.post('/mantenimientos/productos', {
          mantenimientoEquipoId,
          productoId: Number(productoId),
          cantidad,
          costoUnitario,
          subtotal,
        }).catch(err => console.warn(`sincronizarProductos POST failed for producto ${productoId}:`, err?.message));
      }
    }

    for (const ex of existentes) {
      if (!procesadosExistentesIds.has(ex.id)) {
        await api.delete(`/mantenimientos/productos/${ex.id}`)
          .catch(err => console.warn(`sincronizarProductos DELETE failed for ${ex.id}:`, err?.message));
      }
    }
  } catch (e) {
    console.warn('sincronizarProductos falló:', e?.message || e);
  }
}

// ─── ACTUALIZAR ticket ─────────────────────────────────────────────────────────
export async function actualizarTicket(ticket) {
  const targetId = ticket.dbId || String(ticket.id).replace(/\D/g, '');
  if (!targetId) throw new Error('actualizarTicket: no se puede determinar el ID del ticket');

  const payload = buildPayload(ticket);
  await api.put(`/mantenimientos/${targetId}`, payload);

  // Sincronización inteligente por diffing de tareas y productos
  await Promise.allSettled([
    sincronizarTareas(Number(targetId), ticket.tareas),
    sincronizarProductos(Number(targetId), ticket.productos),
  ]);

  // Re-obtener el ticket actualizado para asegurar sincronización con la BD
  return await obtenerTicketPorId(targetId);
}

// ─── ELIMINAR ticket ───────────────────────────────────────────────────────────
export async function eliminarTicket(id) {
  const targetId = String(id).replace(/\D/g, '');
  if (!targetId) throw new Error('eliminarTicket: ID inválido');
  await api.delete(`/mantenimientos/${targetId}`);
}

// ─── Actualizar estado de una tarea en el ticket ──────────────────────────────
export async function actualizarEstadoTareaEnTicket(vinculoId, estadoTarea) {
  // estadoTarea: 'Pendiente' | 'Realizado'
  const res = await api.put(`/mantenimientos/tareas/${vinculoId}`, { estadoTarea });
  return res.data?.data || res.data;
}

// ─── Eliminar una tarea del ticket ────────────────────────────────────────────
export async function eliminarTareaDelTicket(vinculoId) {
  await api.delete(`/mantenimientos/tareas/${vinculoId}`);
}

// ─── Eliminar un producto del ticket ─────────────────────────────────────────
export async function eliminarProductoDelTicket(vinculoId) {
  await api.delete(`/mantenimientos/productos/${vinculoId}`);
}
