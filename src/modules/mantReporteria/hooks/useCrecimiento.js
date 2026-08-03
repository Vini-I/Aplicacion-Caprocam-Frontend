/**
 * ============================================================
 * HOOK DE CRECIMIENTO
 * ============================================================
 */
import { useState, useEffect } from "react";
import crecimientoService from "../../mantCrecimiento/services/mantCrecimiento.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { colaboradorService } from "../../colaboradores/services/colaborador.service.js";
import { getUsuarioById } from "../../login/services/usuarioService.js";

function nombreCompletoPersona(persona) {
  if (!persona || typeof persona !== "object") return null;

  const nombre =
    persona.nombre ??
    persona.name ??
    "";

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
    persona.email ??
    null
  );
}

export default function useCrecimiento(fincaId, estanqueId, onAlertChange) {
  const [crecimientos, setCrecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarCrecimientos() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData, colaboradoresData] =
        await Promise.all([
          obtenerDetalleReporte({
            tipoRegistro: "crecimiento",
            fincaId,
            estanqueId,
          }),
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          colaboradorService.getColaboradores(),
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
          `${c.nombre ?? ""} ${c.apellidos ?? ""}`.trim() || "Sin nombre",
        ]),
      );

      // IDs de usuario únicos en estos registros
      const idsUsuario = [
        ...new Set(
          (data || [])
            .map((r) =>
              Number(
                r.creadoPorUsuarioId ?? r.creado_por_usuario_id ?? null,
              ),
            )
            .filter((id) => id && !Number.isNaN(id)),
        ),
      ];

      // Resolver cada usuario (en paralelo)
      const usuariosMap = {};
      await Promise.all(
        idsUsuario.map(async (id) => {
          try {
            const usuario = await getUsuarioById(id);
            usuariosMap[id] =
              nombreCompletoPersona(usuario) || `Usuario #${id}`;
          } catch (e) {
            console.warn(`No se pudo obtener usuario ${id}`, e?.response?.status, e?.response?.data || e);
            usuariosMap[id] = `Usuario #${id}`;
          }
        }),
      );

      const enriquecidos = (data || []).map((registro) => {
        const idCreadoPorColab = Number(
          registro.creadoPorColaboradorId ??
          registro.creado_por_colaborador_id,
        );
        const idCreadoPorUsuario = Number(
          registro.creadoPorUsuarioId ?? registro.creado_por_usuario_id,
        );
        const idColaborador = Number(
          registro.colaborador ??
          registro.colaborador_id ??
          registro.colaboradorId ??
          registro.idColaborador,
        );

        let nombreCreadoPor = "—";

        if (
          idCreadoPorColab &&
          !Number.isNaN(idCreadoPorColab) &&
          colaboradoresMap[idCreadoPorColab]
        ) {
          nombreCreadoPor = colaboradoresMap[idCreadoPorColab];
        } else if (
          idCreadoPorUsuario &&
          !Number.isNaN(idCreadoPorUsuario)
        ) {
          nombreCreadoPor =
            usuariosMap[idCreadoPorUsuario] || `Usuario #${idCreadoPorUsuario}`;
        }

        return {
          ...registro,
          nombreFinca:
            fincasMap[
            Number(
              registro.finca ??
              registro.finca_id ??
              registro.fincaId ??
              registro.idFinca,
            )
            ] ?? "No encontrada",
          codigoEstanque:
            estanquesMap[
            Number(
              registro.estanque ??
              registro.estanque_id ??
              registro.estanqueId ??
              registro.idEstanque,
            )
            ] ?? "No encontrado",
          nombreColaborador:
            (idColaborador &&
              !Number.isNaN(idColaborador) &&
              colaboradoresMap[idColaborador]) ||
            "Desconocido",
          nombreCreadoPor,
        };
      });

      setCrecimientos(enriquecidos);
    } catch (error) {
      console.error("Error al cargar crecimientos", error);
      setCrecimientos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarCrecimientos();
    }
  }, [fincaId, estanqueId]);

  async function eliminarCrecimiento(id) {
    await crecimientoService.deleteById(id);
    await cargarCrecimientos();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: crecimientoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarCrecimiento);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    crecimientos,
    loading,
    alert,
    modalVisible,
    crecimientoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}