/**
 * ============================================================
 * DTOs DE SIEMBRA (FRONTEND -> BACKEND)
 * ============================================================
 *
 * Normaliza los datos del formulario de Siembra/Pre-Cría al
 * formato exacto que espera el backend antes de enviarlos.
 *
 * El backend valida contra: lote_larva_id, precria_id, finca_id,
 * estanque_id, fecha_siembra/fecha_inicio, cantidad_sembrada/
 * cantidad_inicial, pl_siembra/pl_inicial, estado.
 *
 * Sin esta normalización, el backend rechaza o corrompe los
 * datos silenciosamente 
 */

// El estandar del proyecto para fechas en el formulario es
// dd/mm/aaaa, pero el backend compara fechas
// con "new Date(str)" de JS, que solo es confiable con formato
// ISO (aaaa-mm-dd). Mandar dd/mm/aaaa tal cual produce fechas
// invalidas o mal interpretadas del lado del backend.
function aFechaISO(fecha) {
  if (!fecha) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha; // ya viene en ISO
  const [dia, mes, anio] = fecha.split("/");
  if (!dia || !mes || !anio) return fecha;
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

// Los campos de PL (plInicial, plFinal, plSiembra) se seleccionan
// en el formulario como texto tipo "PL8", pero el backend los
// guarda como entero puro (8). Sin esta conversion, Number("PL8")
// da NaN y el PL se pierde silenciosamente (se guarda como null
// sin ningun error visible).
function numeroDesdePL(pl) {
  if (!pl) return null;
  const coincidencia = String(pl).match(/\d+/);
  return coincidencia ? parseInt(coincidencia[0], 10) : null;
}

export class LoteLarvaDTO {
  constructor(formData) {
    this.codigo_lote = String(formData.codigoLoteLarva || "").trim();
    this.proveedor_id = formData.proveedorLarva ? Number(formData.proveedorLarva) : null;
    this.laboratorio_id = formData.laboratorioLarva ? Number(formData.laboratorioLarva) : null;
    this.procedencia_id = formData.procedenciaLarva ? Number(formData.procedenciaLarva) : null;
    this.certificado_larva = String(formData.certificadoLarva || "").trim();
    this.pl_inicial = numeroDesdePL(formData.plInicial || formData.plSiembra || 0);
    this.cantidad_inicial = Number(formData.cantidadInicial || formData.cantidadSembrada || 0);
    this.fecha_ingreso = aFechaISO(formData.fechaInicio || formData.fechaSiembra || "");
    this.estado_lote = formData.estadoLote || undefined;
  }
}

export class PrecriaDTO {
  constructor(formData, idLoteLarva) {
    this.lote_larva_id = idLoteLarva;
    this.finca_id = Number(formData.fincaId || formData.finca || 0);
    this.estanque_id = Number(formData.estanque || 0);
    this.fecha_inicio = aFechaISO(formData.fechaInicio || "");
    this.duracion_dias = Number(formData.duracionDias || 0);
    this.cantidad_inicial = Number(formData.cantidadInicial || 0);
    this.pl_inicial = numeroDesdePL(formData.plInicial) ?? Number(formData.plInicial || 0);
    // El backend acepta estos tres desde el update normal, no solo
    // desde /finalizar - si no se mandan aquí, "Guardar" los borra.
    this.fecha_fin = formData.fechaFin ? aFechaISO(formData.fechaFin) : null;
    this.cantidad_final = formData.cantidadFinal ? Number(formData.cantidadFinal) : null;
    this.pl_final = formData.plFinal ? numeroDesdePL(formData.plFinal) : null;
  }
}

export class FinalizarPrecriaDTO {
  constructor(formData) {
    this.fecha_fin = aFechaISO(formData.fechaFin || "");
    this.cantidad_final = Number(formData.cantidadFinal || 0);
    this.pl_final = numeroDesdePL(formData.plFinal);
  }
}

export class SiembraDTO {
  constructor(formData, idLoteLarva) {
    this.lote_larva_id = idLoteLarva;
    this.precria_id = formData.precriaId ? Number(formData.precriaId) : null;
    this.finca_id = Number(formData.fincaId || formData.finca || 0);
    this.estanque_id = Number(formData.estanque || 0);
    this.fecha_siembra = aFechaISO(formData.fechaSiembra || "");
    this.tecnica_cultivo = formData.tecnicaCultivo || null;
    this.densidad_poblacional = formData.densidadPoblacional ? Number(formData.densidadPoblacional) : null;
    this.cantidad_sembrada = Number(formData.cantidadSembrada || 0);
    this.pl_siembra = numeroDesdePL(formData.plSiembra);
    this.duracion_ciclo = formData.duracionCiclo ? Number(formData.duracionCiclo) : null;
  }
}

/**
 * ============================================================
 * DTOs COMBINADOS PARA /con-lote
 * ============================================================
 * El backend crea el lote NUEVO y el registro (siembra o pre-cría)
 * en una sola petición/transacción. Por eso van sin lote_larva_id
 * (el lote todavía no existe) y, en el caso de siembra, sin
 * precria_id (este endpoint es solo para lote nuevo; si viene de
 * una pre-cría, seguí usando SiembraDTO + createSiembra normal).
 */

export class SiembraConLoteDTO {
  constructor(formData) {
    // Campos del lote
    this.codigo_lote = String(formData.codigoLoteLarva || "").trim();
    this.proveedor_id = formData.proveedorLarva ? Number(formData.proveedorLarva) : null;
    this.laboratorio_id = formData.laboratorioLarva ? Number(formData.laboratorioLarva) : null;
    this.procedencia_id = formData.procedenciaLarva ? Number(formData.procedenciaLarva) : null;
    this.certificado_larva = String(formData.certificadoLarva || "").trim();
    this.pl_inicial = numeroDesdePL(formData.plInicial || formData.plSiembra || 0);
    this.cantidad_inicial = Number(formData.cantidadInicial || formData.cantidadSembrada || 0);
    this.fecha_ingreso = aFechaISO(formData.fechaInicio || formData.fechaSiembra || "");

    // Campos de la siembra
    this.finca_id = Number(formData.fincaId || formData.finca || 0);
    this.estanque_id = Number(formData.estanque || 0);
    this.fecha_siembra = aFechaISO(formData.fechaSiembra || "");
    this.tecnica_cultivo = formData.tecnicaCultivo || null;
    this.densidad_poblacional = formData.densidadPoblacional ? Number(formData.densidadPoblacional) : null;
    this.cantidad_sembrada = Number(formData.cantidadSembrada || 0);
    this.pl_siembra = numeroDesdePL(formData.plSiembra);
    this.duracion_ciclo = formData.duracionCiclo ? Number(formData.duracionCiclo) : null;
  }
}

export class PrecriaConLoteDTO {
  constructor(formData) {
    // Campos del lote
    this.codigo_lote = String(formData.codigoLoteLarva || "").trim();
    this.proveedor_id = formData.proveedorLarva ? Number(formData.proveedorLarva) : null;
    this.laboratorio_id = formData.laboratorioLarva ? Number(formData.laboratorioLarva) : null;
    this.procedencia_id = formData.procedenciaLarva ? Number(formData.procedenciaLarva) : null;
    this.certificado_larva = String(formData.certificadoLarva || "").trim();
    this.pl_inicial = numeroDesdePL(formData.plInicial) ?? Number(formData.plInicial || 0);
    this.fecha_ingreso = aFechaISO(formData.fechaInicio || "");

    // Campos de la pre-cría (cantidad_inicial es una sola: la del lote/pre-cría)
    this.finca_id = Number(formData.fincaId || formData.finca || 0);
    this.estanque_id = Number(formData.estanque || 0);
    this.fecha_inicio = aFechaISO(formData.fechaInicio || "");
    this.cantidad_inicial = Number(formData.cantidadInicial || 0);
    this.duracion_dias = Number(formData.duracionDias || 0);
  }
}
