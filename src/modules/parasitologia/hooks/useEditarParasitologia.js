/**
 * Calco de useParasitologiaScreen para edición.
 */
import { useEffect, useMemo, useState } from "react";
import parasitologiaService from "../services/ParasitologiaService.js";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

function convertirFechaParaBackend(fecha) {
  if (!fecha) return "";
  if (fecha.includes("-") && !fecha.includes("/")) return fecha.slice(0, 10);
  const [d, m, y] = fecha.split("/");
  return `${y}-${m}-${d}`;
}

function formatearFechaUI(fecha) {
  if (!fecha) return "";
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
  }
  return fecha;
}

export default function useEditarParasitologia(registroId, onGuardado) {
  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState("");
  const [responsable, setResponsable] = useState("");
  const [parasito, setParasito] = useState("");
  const [camaronesMuestreados, setCamaronesMuestreados] = useState("");
  const [camaronesInfectados, setCamaronesInfectados] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [loading, setLoading] = useState(false);
  const [cargandoRegistro, setCargandoRegistro] = useState(true);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        setCargandoOpciones(true);
        const [f, e, c] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          parasitologiaService.getCatalogo?.() ?? Promise.resolve([]),
        ]);
        if (!activo) return;
        setFincas(Array.isArray(f) ? f : []);
        setEstanques(Array.isArray(e) ? e : []);
        setCatalogo(Array.isArray(c) ? c : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (activo) setCargandoOpciones(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (!registroId) { setCargandoRegistro(false); return; }
    let activo = true;
    setCargandoRegistro(true);
    parasitologiaService.getById(registroId)
      .then((r) => {
        if (!activo || !r) return;
        setFinca(String(r.fincaId ?? r.finca_id ?? ""));
        setEstanque(String(r.estanqueId ?? r.estanque_id ?? ""));
        setFechaReporte(formatearFechaUI(r.fechaReporte ?? r.fecha));
        setResponsable(r.responsable ?? "");
        setParasito(r.parasito ?? "");
        setCamaronesMuestreados(String(r.camaronesMuestreados ?? ""));
        setCamaronesInfectados(String(r.camaronesInfectados ?? ""));
        setObservaciones(r.observaciones ?? "");
      })
      .catch(() => setMensaje("No se pudo cargar el registro."))
      .finally(() => { if (activo) setCargandoRegistro(false); });
    return () => { activo = false; };
  }, [registroId]);

  const muestreadosN = Number(camaronesMuestreados) || 0;
  const infectadosN = Number(camaronesInfectados) || 0;
  const gradoCalculado = muestreadosN > 0
    ? ((infectadosN / muestreadosN) * 100).toFixed(1)
    : "0.0";
  const colorGrado = Number(gradoCalculado) >= 50 ? "error" : Number(gradoCalculado) >= 20 ? "warning" : "success";

  const opcionesFincas = useMemo(
    () => fincas.map((f) => ({ label: f.nombreFinca, value: String(f.id) })),
    [fincas],
  );
  const opcionesEstanques = useMemo(
    () =>
      estanques
        .filter((e) => Number(e.idFinca ?? e.fincaId) === Number(finca))
        .map((e) => ({ label: e.codigo, value: String(e.id) })),
    [estanques, finca],
  );
  const opcionesParasitos = useMemo(() => {
    if (!Array.isArray(catalogo) || catalogo.length === 0) return [];
    return catalogo.map((x) =>
      typeof x === "string"
        ? { label: x, value: x }
        : { label: x.nombre ?? x.label ?? x.value, value: x.value ?? x.codigo ?? x.nombre }
    );
  }, [catalogo]);

  const cambiarFinca = (v) => { setFinca(String(v)); setEstanque(""); setMensaje(""); };
  const cambiarEstanque = (v) => { setEstanque(String(v)); setMensaje(""); };
  const cambiarFechaReporte = (v) => { setFechaReporte(v); setMensaje(""); };
  const cambiarParasito = (v) => { setParasito(String(v)); setMensaje(""); };
  const cambiarCamaronesMuestreados = (v) => { setCamaronesMuestreados(String(v)); setMensaje(""); };
  const cambiarCamaronesInfectados = (v) => { setCamaronesInfectados(String(v)); setMensaje(""); };
  const cambiarObservaciones = (v) => { setObservaciones(v); setMensaje(""); };

  const registrarParasitologia = async () => {
    setSubmitted(true);
    setMensaje("");
    if (!finca || !estanque || !fechaReporte || !parasito) {
      setTipoMensaje("danger");
      setMensaje("Rellene los datos requeridos correctamente.");
      return;
    }
    setLoading(true);
    try {
      await parasitologiaService.update(registroId, {
        fincaId: Number(finca),
        estanqueId: Number(estanque),
        fechaReporte: convertirFechaParaBackend(fechaReporte),
        parasito,
        camaronesMuestreados: muestreadosN,
        camaronesInfectados: infectadosN,
        observaciones: observaciones.trim() || null,
      });
      setTipoMensaje("success");
      setMensaje("Parasitologia actualizada correctamente.");
      onGuardado?.();
    } catch (e) {
      setTipoMensaje("danger");
      setMensaje(e.response?.data?.message || "No se pudo actualizar.");
    } finally {
      setLoading(false);
    }
  };

  return {
    finca, estanque, fechaReporte, responsable, parasito,
    camaronesMuestreados, camaronesInfectados, observaciones,
    opcionesFincas, opcionesEstanques, opcionesParasitos,
    placeholderFinca: "Seleccione una finca",
    placeholderEstanque: "Seleccione un estanque",
    placeholderParasito: "Seleccione un parasito",
    gradoCalculado, colorGrado,
    gridStyle: undefined, itemStyle: undefined, itemFullStyle: undefined,
    errorFinca: submitted && !finca,
    errorEstanque: submitted && !estanque,
    errorFechaReporte: submitted && !fechaReporte,
    errorParasito: submitted && !parasito,
    errorMuestreados: false,
    errorInfectados: false,
    mensaje, tipoMensaje,
    loading: loading || cargandoOpciones,
    cargandoRegistro,
    cambiarFinca,
    setEstanque: cambiarEstanque,
    setFechaReporte: cambiarFechaReporte,
    setParasito: cambiarParasito,
    setCamaronesMuestreados: cambiarCamaronesMuestreados,
    setCamaronesInfectados: cambiarCamaronesInfectados,
    setObservaciones: cambiarObservaciones,
    registrarParasitologia,
  };
}
