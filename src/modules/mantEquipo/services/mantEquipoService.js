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
  MENSAJES_SERVICIOS,
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

/**
 * Obtiene el catálogo completo de productos del grupo de datos del usuario,
 * combinando /productos e /inventario para no omitir ningún registro.
 */
export async function getProductosCatalogo() {
  try {
    const [resProductos, resInventario] = await Promise.allSettled([
      api.get('/productos'),
      api.get('/inventario'),
    ]);

    const prodsRaw = resProductos.status === 'fulfilled'
      ? (resProductos.value.data?.data || resProductos.value.data || [])
      : [];
    const invRaw = resInventario.status === 'fulfilled'
      ? (resInventario.value.data?.data || resInventario.value.data || [])
      : [];

    const mapaProds = new Map();

    // 1. Agregar productos desde /productos
    if (Array.isArray(prodsRaw)) {
      prodsRaw.forEach(p => {
        const idStr = String(p.id ?? p.producto_id ?? p.productoId ?? '');
        if (idStr) {
          mapaProds.set(idStr, {
            ...p,
            id: idStr,
            productoId: idStr,
            nombre: p.nombre ?? p.nombreProducto ?? p.producto?.nombre ?? `Producto ${idStr}`,
            precioUnidad: Number(p.precioUnidad ?? p.precio_unidad ?? p.precio) || 0,
            costoUnitario: Number(p.precioUnidad ?? p.precio_unidad ?? p.precio) || 0,
            stockMaximo: p.cantidad !== undefined ? Number(p.cantidad) : (p.stock !== undefined ? Number(p.stock) : 999),
          });
        }
      });
    }

    // 2. Fusionar/agregar productos desde /inventario
    if (Array.isArray(invRaw)) {
      invRaw.forEach(p => {
        const idStr = String(p.producto_id ?? p.productoId ?? p.id ?? '');
        if (idStr) {
          const existente = mapaProds.get(idStr) || {};
          mapaProds.set(idStr, {
            ...existente,
            ...p,
            id: idStr,
            productoId: idStr,
            nombre: p.nombre ?? p.nombreProducto ?? p.producto?.nombre ?? existente.nombre ?? `Producto ${idStr}`,
            precioUnidad: Number(p.precioUnidad ?? p.precio_unidad ?? p.precio ?? existente.precioUnidad) || 0,
            costoUnitario: Number(p.precioUnidad ?? p.precio_unidad ?? p.precio ?? existente.costoUnitario) || 0,
            stockMaximo: p.cantidad !== undefined ? Number(p.cantidad) : (p.stock !== undefined ? Number(p.stock) : (existente.stockMaximo ?? 999)),
          });
        }
      });
    }

    return Array.from(mapaProds.values());
  } catch (err) {
    throw construirErrorHttp(err, "No se pudieron obtener el catálogo de productos");
    return [];
  }
}


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


// ─── Adaptador: respuesta backend → objeto frontend ───────────────────────────
function adaptBackendTicket(item) {
  if (!item || !item.id) throw new Error(MENSAJES_SERVICIOS.itemInvalido);

  const estadoRaw = item.estadoTicket || 'En espera';
  const estadoFront = ESTADO_BACKEND_A_FRONTEND[estadoRaw] || 'en_espera';
  const equipoId = item.equipoId ? String(item.equipoId) : null;
  const tipoRaw = item.tipoPersonal || 'TrabajadorInterno';
  const tipoPersonal = TIPO_PERSONAL_A_FRONTEND[tipoRaw] || 'interno';

  // ID visual: número consecutivo del backend
  const idVisual = String(item.id);

  // Tareas vinculadas al ticket (tabla junction mantenimiento_equipo_tareas)
  const tareas = Array.isArray(item.tareas) ? item.tareas.map(t => {
    const nombreDefaut = t.nombre || t.label || t.tarea?.nombre || `Tarea ${t.tareaId || t.id}`;
    return {
      id: t.id,
      tareaId: t.tareaId || t.tarea_id,
      value: String(t.tareaId || t.tarea_id || t.id),
      label: nombreDefaut,
      nombre: nombreDefaut,
      categoria: t.categoria || t.tarea?.categoria || '',
      duracionEstimada: Number(t.duracionEstimada || t.duracion_estimada || t.horas || t.tarea?.horas) || 0,
      descripcion: t.descripcion || t.tarea?.descripcion || '',
      estado: t.estadoTarea || t.estado_tarea || 'Pendiente',
      realizada: (t.estadoTarea || t.estado_tarea) === 'Realizado',
    };
  }) : [];

  // Productos vinculados al ticket (tabla junction mantenimiento_equipo_productos)
  const productos = Array.isArray(item.productos) ? item.productos.map(p => ({
    id: p.id,
    productoId: p.productoId || p.producto_id,
    cantidad: Number(p.cantidad) || 1,
    costoUnitario: Number(p.costoUnitario || p.costo_unitario) || 0,
    subtotal: Number(p.subtotal) || 0,
    nombre: p.nombre || p.producto?.nombre || `Producto ${p.productoId || p.id}`,
  })) : [];

  return {
    id: idVisual,
    dbId: item.id,
    equipoId,
    herramienta: equipoId ? `Equipo ${equipoId}` : 'Equipo General',
    titulo: item.tituloTicket || 'Mantenimiento',
    descripcion: item.descripcionTicket || '',
    tareas,
    productos,
    estado: estadoFront,
    creadoPor: item.nombreCreador || (item.creadoPorColaboradorId ? `Colaborador #${item.creadoPorColaboradorId}` : (item.creadoPorUsuarioId ? `Usuario #${item.creadoPorUsuarioId}` : 'Usuario')),
    fechaCreacion: new Date(item.fechaMantenimiento || item.fechaCreacion || Date.now()),
    estadoEquipo: item.estadoEquipo || '',
    tipoPersonal,
    costoManoObra: Number(item.costoManoObra) || 0,
    costoProductos: Number(item.costoProductos) || 0,
    costoTotalEstimado: Number(item.costoTotalEstimado) || 0,
    costoTotal: Number(item.costoTotalEstimado) || 0,
  };
}

// ─── OBTENER todos los tickets ─────────────────────────────────────────────────
export async function obtenerTickets() {
  try {
    const response = await api.get('/mantenimientos');
    const data = response.data?.data || response.data;

    if (!Array.isArray(data)) {
      throw new Error(MENSAJES_SERVICIOS.respuestaNoArreglo);
    }

    const tickets = data;
    const mapaCreadores = {};

    await Promise.allSettled(
      tickets.map(async (t) => {
        const uid = t.creadoPorUsuarioId || t.creado_por_usuario_id;
        const cid = t.creadoPorColaboradorId || t.creado_por_colaborador_id;

        if (cid) {
          const key = `c_${cid}`;
          if (!mapaCreadores[key]) {
            try {
              const res = await api.get(`/colaboradores/${cid}`);
              const c = res.data?.data || res.data;
              const nom = [c?.nombre, c?.apellidos].filter(Boolean).join(' ').trim();
              mapaCreadores[key] = nom || c?.nombreUsuario || `Colaborador #${cid}`;
            } catch (_) {
              mapaCreadores[key] = `Colaborador #${cid}`;
            }
          }
        }

        if (uid) {
          const key = `u_${uid}`;
          if (!mapaCreadores[key]) {
            try {
              const res = await api.get(`/login/${uid}`);
              const u = res.data?.data || res.data;
              const nom = [u?.nombre, u?.apellidos].filter(Boolean).join(' ').trim();
              mapaCreadores[key] = nom || u?.nombreUsuario || u?.email || `Usuario #${uid}`;
            } catch (_) {
              mapaCreadores[key] = `Usuario #${uid}`;
            }
          }
        }
      })
    );

    return tickets.map(item => {
      const cid = item.creadoPorColaboradorId || item.creado_por_colaborador_id;
      const uid = item.creadoPorUsuarioId || item.creado_por_usuario_id;
      const nombreCreador = (cid ? mapaCreadores[`c_${cid}`] : null) || (uid ? mapaCreadores[`u_${uid}`] : null) || item.nombreCreador || null;
      return adaptBackendTicket({
        ...item,
        nombreCreador,
      });
    });
  } catch (err) {
    console.warn('obtenerTickets error:', err?.response?.data || err?.message || err);
    throw construirErrorHttp(err, 'No se pudieron obtener los tickets de mantenimiento');
  }
}

// ─── OBTENER un ticket por ID con sus tareas y productos ──────────────────────
export async function obtenerTicketPorId(id) {
  const numericId = String(id).replace(/\D/g, '');

  if (!numericId) {
    throw new Error(MENSAJES_SERVICIOS.idInvalido(id));
  }

  try {
    const [resTicket, resTareas, resProductos, resCatTareas, resCatProductos] = await Promise.allSettled([
      api.get(`/mantenimientos/${numericId}`),
      api.get(`/mantenimientos/${numericId}/tareas`),
      api.get(`/mantenimientos/${numericId}/productos`),
      obtenerTareas(),
      getProductosCatalogo(),
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
        nombre: t.nombre || c?.nombre || c?.label || `Tarea ${tareaId}`,
        label: t.label || t.nombre || c?.nombre || c?.label || `Tarea ${tareaId}`,
        categoria: t.categoria || c?.categoria || '',
        descripcion: t.descripcion || c?.descripcion || '',
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
      const costoUnit = Number(p.costoUnitario || p.costo_unitario || enCatalogo?.precioUnidad || enCatalogo?.precio_unidad || enCatalogo?.precio) || 0;
      return {
        ...p,
        id:            prodId,
        productoId:    prodId,
        nombre:        p.nombre || enCatalogo?.nombre || enCatalogo?.nombreProducto || `Producto ${prodId}`,
        precioUnidad:  costoUnit,
        costoUnitario: costoUnit,
        cantidad:      Number(p.cantidad) || 1,
      };
    });

        // Nombre del usuario o colaborador creador
    let nombreCreador = null;
    const cid = item.creadoPorColaboradorId || item.creado_por_colaborador_id;
    const uid = item.creadoPorUsuarioId || item.creado_por_usuario_id;

    if (cid) {
      try {
        const resColab = await api.get(`/colaboradores/${cid}`);
        const c = resColab.data?.data || resColab.data;
        const nom = [c?.nombre, c?.apellidos].filter(Boolean).join(' ').trim();
        nombreCreador = nom || c?.nombreUsuario || `Colaborador #${cid}`;
      } catch (_) {
        nombreCreador = `Colaborador #${cid}`;
      }
    } else if (uid) {
      try {
        const resUsuario = await api.get(`/login/${uid}`);
        const u = resUsuario.data?.data || resUsuario.data;
        const nom = [u?.nombre, u?.apellidos].filter(Boolean).join(' ').trim();
        nombreCreador = nom || u?.nombreUsuario || u?.email || `Usuario #${uid}`;
      } catch (_) {
        nombreCreador = `Usuario #${uid}`;
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
      throw construirErrorHttp(errorDirecto, `No se pudo obtener el ticket con ID ${id}`);
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
    throw construirErrorHttp(err, `No se pudo actualizar el estado operativo del equipo`);
  }
}

// ─── Reiniciar estado operativo del equipo a Activo ──────────────────────────
export async function reiniciarHorasEquipo(equipoId) {
  if (!equipoId) return;
  try {
    const equipo = await equiposService.getEquipoById(equipoId);
    if (!equipo) return;
    await equiposService.updateEquipo(equipoId, {
      ...equipo,
      estadoOperativo: 'Activo',
      horasActuales: 0,
    });
  } catch (err) {
    console.warn('reiniciarHorasEquipo:', err?.message || err);
  }
}

// ─── Construir payload para POST / PUT ────────────────────────────────────────
function buildPayload(ticket) {
  if (!ticket.equipoId) throw new Error(MENSAJES_SERVICIOS.equipoObligatorio);
  if (!ticket.titulo) throw new Error(MENSAJES_SERVICIOS.tituloObligatorio);

  const estadoBackend = ESTADO_FRONTEND_A_BACKEND[ticket.estado] || 'En espera';
  const tipoPersonalBackend = TIPO_PERSONAL_A_BACKEND[ticket.tipoPersonal] || 'TrabajadorInterno';

  const fechaISO = ticket.fechaCreacion instanceof Date
    ? ticket.fechaCreacion.toISOString().slice(0, 19).replace('T', ' ')
    : new Date().toISOString().slice(0, 19).replace('T', ' ');

  const codigoTicket = (ticket.codigoTicket || ticket.codigo || `MT-${String(Date.now()).slice(-6)}`).slice(0, 10);

  return {
    codigoTicket,
    fechaMantenimiento: fechaISO,
    tituloTicket: ticket.titulo,
    descripcionTicket: ticket.descripcion,
    equipoId: Number(ticket.equipoId),
    estadoTicket: estadoBackend,
    tipoPersonal: tipoPersonalBackend,
    costoManoObra: Number(ticket.costoManoObra) || 0,
    costoProductos: Number(ticket.costoProductos || ticket.costoTotal) || 0,
    costoTotalEstimado: Number(ticket.costoTotal) || 0,
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
    const cantidad = Number(p.cantidad) || 1;
    const costoUnitario = Number(p.precioUnidad || p.precio || p.costoUnitario) || 0;
    const subtotal = cantidad * costoUnitario;

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

// ─── Descontar stock de inventario cuando el ticket se marca como Terminado ───
async function descontarStockMantenimiento(productos) {
  if (!Array.isArray(productos) || productos.length === 0) return;
  try {
    const res = await api.get('/inventario');
    const invList = res.data?.data || res.data || [];
    if (!Array.isArray(invList)) return;

    for (const prod of productos) {
      const prodId = String(prod.productoId || prod.id);
      const invItem = invList.find(i => String(i.producto_id || i.productoId || i.id || i.inv_id) === prodId);
      if (invItem) {
        const cantUsada = Number(prod.cantidad) || 1;
        const nuevaCantidad = Math.max(0, (Number(invItem.cantidad) || 0) - cantUsada);
        try {
          await api.put(`/inventario/${invItem.id || invItem.inv_id}`, {
            cantidad: nuevaCantidad,
            proveedor_id: invItem.proveedor_id || invItem.proveedorId || null,
            stock_minimo: invItem.stock_minimo || invItem.stockMinimo || 0,
          });
        } catch (_) {
          // Fallback en caso de restricción en backend
        }
      }
    }
  } catch (err) {
    throw construirErrorHttp(err, 'No se pudo descontar el stock de inventario tras finalizar el ticket');
  }
}

// ─── CREAR ticket ──────────────────────────────────────────────────────────────
export async function agregarTicket(ticket) {
  try {
    const payload = buildPayload(ticket);
    const esTerminado = payload.estadoTicket === 'Terminado' || ticket.estado === 'terminado';

    // Si viene directamente como Terminado, crearlo primero como 'En espera'
    // para permitir vincular tareas y productos antes del cierre definitivo.
    if (esTerminado) {
      payload.estadoTicket = 'En espera';
    }

    const res = await api.post('/mantenimientos', payload);
    const backendData = res.data?.data || res.data;
    const nuevoTicket = adaptBackendTicket(backendData);

    // Vincular tareas y productos en paralelo después de crear el ticket
    await Promise.allSettled([
      vincularTareas(nuevoTicket.dbId, ticket.tareas),
      vincularProductos(nuevoTicket.dbId, ticket.productos || []),
    ]);

    // Si el ticket se marcó como Terminado al crearlo, actualizar su estado a Terminado
    // para que el backend ejecute la transacción y descuente el stock de los productos vinculados.
    if (esTerminado) {
      await api.put(`/mantenimientos/${nuevoTicket.dbId}`, {
        ...payload,
        estadoTicket: 'Terminado',
      });
      return await obtenerTicketPorId(nuevoTicket.dbId);
    }

    return nuevoTicket;
  } catch (err) {
    console.warn('agregarTicket error:', err?.response?.data || err?.message || err);
    throw construirErrorHttp(err, 'No se pudo agregar el ticket');
  }
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
    throw construirErrorHttp(e, 'No se pudo sincronizar las tareas del ticket');
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
    throw construirErrorHttp(e, 'No se pudo sincronizar los productos del ticket');
  }
}

// ─── ACTUALIZAR ticket ─────────────────────────────────────────────────────────
export async function actualizarTicket(ticket) {
  const targetId = ticket.dbId || String(ticket.id).replace(/\D/g, '');
  if (!targetId) throw new Error(MENSAJES_SERVICIOS.sinIdActualizar);

  try {
    const payload = buildPayload(ticket);

    // 1. Sincronización inteligente de tareas y productos ANTES de actualizar el estado del ticket en BD.
    // Esto garantiza que cuando el backend procese el cambio a 'Terminado', los productos
    // ya existan en la tabla mantenimiento_equipo_productos y el trigger/transacción descuente
    // correctamente el stock en movimientos_inventario e inventario.
    const resultados = await Promise.allSettled([
      sincronizarTareas(Number(targetId), ticket.tareas),
      sincronizarProductos(Number(targetId), ticket.productos),
    ]);
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`actualizarTicket: falló la sincronización #${i} del ticket ${targetId}:`, r.reason?.message || r.reason);
      }
    });

    // 2. Actualizar el ticket principal en la base de datos
    await api.put(`/mantenimientos/${targetId}`, payload);

    // Re-obtener el ticket actualizado para asegurar sincronización con la BD
    const ticketActualizado = await obtenerTicketPorId(targetId);

    return ticketActualizado;
  } catch (err) {
    console.warn(`actualizarTicket(${targetId}):`, err?.response?.data || err?.message || err);
    throw construirErrorHttp(err, `No se pudo actualizar el ticket`);
  }
}

// ─── ELIMINAR ticket ───────────────────────────────────────────────────────────
export async function eliminarTicket(id) {
  const targetId = String(id).replace(/\D/g, '');
  if (!targetId) throw new Error(MENSAJES_SERVICIOS.idInvalidoEliminar);
  try {
    await api.delete(`/mantenimientos/${targetId}`);
  } catch (err) {
    console.warn(`eliminarTicket(${targetId}):`, err?.response?.data || err?.message || err);
    throw construirErrorHttp(err, `No se pudo eliminar el ticket`);
  }
}

// ─── Actualizar estado de una tarea en el ticket ──────────────────────────────
export async function actualizarEstadoTareaEnTicket(vinculoId, estadoTarea) {
  // estadoTarea: 'Pendiente' | 'Realizado'
  try {
    const res = await api.put(`/mantenimientos/tareas/${vinculoId}`, { estadoTarea });
    return res.data?.data || res.data;
  } catch (err) {
    console.warn(`actualizarEstadoTareaEnTicket(${vinculoId}):`, err?.response?.data || err?.message || err);
    throw construirErrorHttp(err, 'No se pudo actualizar la tarea del ticket');
  }
}

// ─── Eliminar una tarea del ticket ────────────────────────────────────────────
export async function eliminarTareaDelTicket(vinculoId) {
  try {
    await api.delete(`/mantenimientos/tareas/${vinculoId}`);
  } catch (err) {
    console.warn(`eliminarTareaDelTicket(${vinculoId}):`, err?.response?.data || err?.message || err);
    throw construirErrorHttp(err, 'No se pudo eliminar la tarea del ticket');
  }
}

// ─── Eliminar un producto del ticket ─────────────────────────────────────────
export async function eliminarProductoDelTicket(vinculoId) {
  try {
    await api.delete(`/mantenimientos/productos/${vinculoId}`);
  } catch (err) {
    console.warn(`eliminarProductoDelTicket(${vinculoId}):`, err?.response?.data || err?.message || err);
    throw construirErrorHttp(err, 'No se pudo eliminar el producto del ticket');
  }
}