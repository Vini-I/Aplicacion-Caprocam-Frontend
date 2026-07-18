/**
 * ============================================================
 * PANTALLA: AgregarMantenimiento
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Provee un formulario interactivo para registrar un nuevo ticket de mantenimiento
 *   de equipos, capturando detalles técnicos, tareas asociadas y costos.
 * 
 * FUNCIONALIDAD:
 * - Selección de equipo. Al seleccionarlo, se precargan sus datos y horas de uso actual.
 * - Selección de tipo de personal (Trabajador Interno o Trabajador Externo).
 * - Selección y asignación de múltiples tareas con su respectivo estado de realizado.
 * - Validación condicional de costos e inyección al payload de guardado.
 * 
 * DATOS / VARIABLES:
 * - Formulario reactivo y estados locales para cada campo (titulo, descripcion, equipoId, costoManoObra).
 * - errores: Objeto para persistir campos faltantes al intentar guardar.
 * - submitted: Booleano para activar la visualización del borde rojo tras intentar guardar.
 * 
 * VALIDACIONES / REGLAS:
 * - Campos requeridos (Título, Descripción, Tarea, Equipo y Costo) marcados con asterisco.
 * - El borde en rojo de validación aparece únicamente después de presionar "Aceptar" si el campo está vacío.
 * - Si el estado es "Terminado", el costo de mano de obra es obligatorio. De lo contrario, es opcional.
 * 
 * NAVEGACIÓN:
 * - Al guardar con éxito, redirecciona a /equipos/mantEquipo con banner verde.
 * - Al cancelar, regresa a /equipos/mantEquipo sin guardar.
 * 
 * DEPENDENCIAS:
 * - Input, Select, Button, Icon, CustomText, Card, Alert
 * - mantEquipoService, colors, style, icons, typography
 * ============================================================
 */

import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Input from "../../../shared/components/Input.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Card from "../../../shared/components/Card.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { TYPOGRAPHY } from "../../../theme/typography.js";

import {
  TEXTOS_MODAL_AGREGAR,
  USUARIO_SESION,
} from "../constants/mantEquipoMensajes.js";
import { TAREAS_DEMO } from "../services/tareasService.js";
import * as MantService from "../services/mantEquipoService.js";
import { generarNuevoId, obtenerFechaHoraActual } from "../utils/mantEquipoUtils.js";
import MantenimientoEquipoSelect from "../components/MantenimientoEquipoSelect.jsx";
import MantenimientoTareaSelect from "../components/MantenimientoTareaSelect.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";

import SelectorPills from "../components/SelectorPills.jsx";
import TareasSeleccionadasList from "../components/TareasSeleccionadasList.jsx";
import Select from "../../../shared/components/Select.jsx";
import { getProductosInventario } from "../../inventarios/services/InventarioService.js";
import ProductosSeleccionadosList from "../components/ProductosSeleccionadosList.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import { parseDate } from "../../../shared/utils/dateUtils.js";

// Monkey patch de ScrollView para forzar la ocultación de scrollbars en todo el módulo
if (ScrollView.prototype && ScrollView.prototype.render) {
  const originalRender = ScrollView.prototype.render;
  ScrollView.prototype.render = function () {
    this.props = {
      ...this.props,
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
    };
    return originalRender.apply(this, arguments);
  };
} else if (ScrollView.render) {
  const originalRender = ScrollView.render;
  ScrollView.render = function (props, ref) {
    const newProps = {
      ...props,
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
    };
    return originalRender(newProps, ref);
  };
}

export default function AgregarMantenimientoScreen() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [estadoEquipo, setEstadoEquipo] = useState("");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [fecha, setFecha] = useState(obtenerFechaHoraActual());

  // Nuevos campos de Horas de uso y Costos del estándar
  const [horasUso, setHorasUso] = useState("");
  const [tipoPersonal, setTipoPersonal] = useState("interno");
  const [costoManoObra, setCostoManoObra] = useState("0");
  const [estadoTicket, setEstadoTicket] = useState("en_espera");

  // Insumos del inventario
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productosList, setProductosList] = useState([]);

  useEffect(() => {
    const list = getProductosInventario() || [];
    setProductosList(list);
  }, []);

  const seleccionarProducto = (prodId) => {
    if (!prodId) return;
    const prod = productosList.find(p => String(p.id) === String(prodId));
    if (prod && !productosSeleccionados.some(x => x.id === prod.id)) {
      setProductosSeleccionados(prev => [...prev, prod]);
    }
  };

  const quitarProducto = (prodId) => {
    setProductosSeleccionados(prev => prev.filter(p => p.id !== prodId));
  };



  const seleccionarEquipoById = (eq) => {
    if (eq) {
      setEquipoSeleccionado(eq);
      setEquipoId(eq.id);
      setEstadoEquipo(eq.estado || "");
      // Pre-cargar horas de uso actuales
      setHorasUso(String(eq.horasUso || ""));
      if (errores.equipoId) setErrores((prev) => { const s = { ...prev }; delete s.equipoId; return s; });
      if (errores.horasUso) setErrores((prev) => { const s = { ...prev }; delete s.horasUso; return s; });
    }
  };

  const quitarEquipo = () => {
    setEquipoSeleccionado(null);
    setEquipoId("");
    setEstadoEquipo("");
    setHorasUso("");
  };



  // Calcular el costo total dinámicamente sumando mano de obra y el precio de todos los insumos seleccionados
  const numManoObra = parseFloat(costoManoObra) || 0;
  const precioInsumos = productosSeleccionados.reduce((sum, p) => sum + (parseFloat(p.precioUnidad) || 0), 0);
  const costoTotal = numManoObra + precioInsumos;

  const validar = () => {
    const err = {};
    if (!titulo.trim()) err.titulo = true;
    if (!equipoId) err.equipoId = true;
    if (!descripcion.trim()) err.descripcion = true;
    if (tareasSeleccionadas.length === 0) err.tareas = true;

    // El costo de mano de obra es obligatorio en cualquier estado (debe ser un número >= 0)
    if (!costoManoObra.trim() || isNaN(costoManoObra) || parseFloat(costoManoObra) < 0) {
      err.costoManoObra = true;
    }

    // No se puede terminar el ticket si existen tareas pendientes
    if (estadoTicket === "Terminado" && tareasSeleccionadas.some(t => !t.realizada)) {
      err.tareasPendientes = true;
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleCrear = () => {
    setSubmitted(true);
    if (!validar()) return;

    // Crear el payload del nuevo ticket
    const nuevo = {
      id: generarNuevoId(MantService.TICKETS_MOCK),
      equipoId,
      herramienta: `${equipoSeleccionado.nombre} ${equipoSeleccionado.serie}`,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tareas: tareasSeleccionadas,
      estado: estadoTicket,
      creadoPor: USUARIO_SESION,
      fechaCreacion: parseDate(fecha) || new Date(),

      horasUsoIngreso: equipoSeleccionado ? equipoSeleccionado.horasUso : 0,
      tipoPersonal: tipoPersonal,
      costoMiscelaneo: 0,
      costoManoObra: parseFloat(costoManoObra) || 0,
      costoTotal: costoTotal,
      productos: productosSeleccionados.map(p => ({ id: p.id, precio: p.precioUnidad })),
    };

    // Agregar el ticket al servicio mutable
    MantService.agregarTicket(nuevo);

    // Actualizar estado del equipo si se modificó
    if (estadoEquipo) {
      MantService.actualizarEstadoEquipo(equipoId, estadoEquipo);
    }

    // Reiniciar las horas de uso del equipo a 0 solo si se completa el ticket ("Terminado")
    if (estadoTicket === "Terminado") {
      MantService.reiniciarHorasEquipo(equipoId);
    }

    // Redireccionar al listado principal con alerta de éxito
    router.replace({
      pathname: "/equipos/mantEquipo",
      params: {
        alertaTipo: "success",
        alertaMensaje: `Ticket ${nuevo.id} creado con éxito.`,
      }
    });
  };

  const SectionTitle = ({ icon, title }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
      <CustomText style={{ fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, letterSpacing: 0.3 }}>
        {title}
      </CustomText>
    </View>
  );

  return (
    <ScrollView style={STYLE.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={[STYLE.contentWrapper, { paddingBottom: 40, gap: 16 }]}>

        {/* Sección: IDENTIFICACIÓN Y GENERAL */}
        <Card style={[styles.card, { padding: 16 }]}>
          <SectionTitle icon={ICONS.document} title="IDENTIFICACIÓN Y DATOS GENERALES" />

          {/* Fecha y Creado por */}
          <View style={styles.comboRow}>
            <View style={styles.halfCol}>
              <DateInput
                label={TEXTOS_MODAL_AGREGAR.labelFechaHora}
                value={fecha}
                onChangeText={setFecha}
                containerStyle={{ marginBottom: 0 }}
                inputStyle={styles.comboInput}
                labelStyle={styles.comboLabel}
              />
            </View>
            <View style={styles.halfCol}>
              <View style={styles.comboContainer}>
                <CustomText style={styles.comboLabel}>{TEXTOS_MODAL_AGREGAR.labelCreadoPor}</CustomText>
                <View style={[styles.comboInput, { backgroundColor: COLORS.surface }]}>
                  <CustomText style={{ fontSize: 14, color: COLORS.textSecondary }}>{USUARIO_SESION}</CustomText>
                </View>
              </View>
            </View>
          </View>

          {/* Título */}
          <View style={styles.comboContainer}>
            <CustomText style={styles.comboLabel}>{TEXTOS_MODAL_AGREGAR.labelTitulo}</CustomText>
            <Input
              value={titulo}
              onChangeText={(v) => {
                setTitulo(v);
                if (errores.titulo) setErrores((prev) => { const s = { ...prev }; delete s.titulo; return s; });
              }}
              placeholder={TEXTOS_MODAL_AGREGAR.placeholderTitulo}
              containerStyle={{ marginBottom: 0 }}
              style={[styles.comboInput, submitted && errores.titulo && { borderColor: COLORS.error }]}
            />
          </View>

          {/* Descripción */}
          <View style={styles.comboContainer}>
            <CustomText style={styles.comboLabel}>{TEXTOS_MODAL_AGREGAR.labelDescripcion}</CustomText>
            <Input
              value={descripcion}
              onChangeText={(v) => {
                setDescripcion(v);
                if (errores.descripcion) setErrores((prev) => { const s = { ...prev }; delete s.descripcion; return s; });
              }}
              placeholder={TEXTOS_MODAL_AGREGAR.placeholderDesc}
              multiline
              numberOfLines={4}
              containerStyle={{ marginBottom: 0 }}
              style={[styles.comboInput, { minHeight: 80, textAlignVertical: "top" }, submitted && errores.descripcion && { borderColor: COLORS.error }]}
            />
          </View>
        </Card>

        {/* Sección: DETALLES DEL EQUIPO */}
        <Card style={[styles.card, { padding: 16 }]}>
          <SectionTitle icon={ICONS.tools} title="DETALLES DEL EQUIPO" />

          {/* Selector de Equipo */}
          <MantenimientoEquipoSelect
            value={equipoId}
            onChange={seleccionarEquipoById}
            error={submitted && errores.equipoId}
          />
          <EquipoDetail equipo={equipoSeleccionado} onQuitar={quitarEquipo} />

          {/* Estado del equipo */}
          {equipoSeleccionado && (
            <SelectorPills
              label={TEXTOS_MODAL_AGREGAR.labelEstadoEquipo}
              value={estadoEquipo}
              onChange={(v) => setEstadoEquipo(v)}
              opciones={MantService.ESTADOS_EQUIPO}
            />
          )}
        </Card>

        {/* Sección: TAREAS ASIGNADAS */}
        <Card style={[styles.card, { padding: 16 }]}>
          <SectionTitle icon={ICONS.clipboard} title="TAREAS ASIGNADAS" />

          {/* Tareas (Selector Combobox) */}
          <MantenimientoTareaSelect
            tareasSeleccionadas={tareasSeleccionadas}
            onAgregarTarea={(taskObj) => {
              setTareasSeleccionadas(prev => [...prev, { value: taskObj.id, label: taskObj.nombre, realizada: false }]);
              if (errores.tareas) setErrores(e => { const copy = { ...e }; delete copy.tareas; return copy; });
            }}
            error={submitted && errores.tareas}
          />

          <TareasSeleccionadasList
            tareasSeleccionadas={tareasSeleccionadas}
            setTareasSeleccionadas={setTareasSeleccionadas}
          />
        </Card>

        {/* Sección: COSTOS Y ESTADO DEL TICKET */}
        <Card style={[styles.card, { padding: 16 }]}>
          <SectionTitle icon={ICONS.money} title="COSTOS Y PERSONAL" />

          {/* Tipo de Personal */}
          <SelectorPills
            label="Tipo de Personal *"
            value={tipoPersonal}
            onChange={(v) => {
              setTipoPersonal(v);
              if (v === "interno") setCostoManoObra("0");
            }}
            opciones={[
              { label: "Trabajador Interno", value: "interno" },
              { label: "Trabajador Externo", value: "externo" }
            ]}
          />

          {/* Selector de Producto / Insumo */}
          <Select
            label="Productos utilizados"
            value=""
            options={[
              ...productosList
                .filter(p => !productosSeleccionados.some(x => x.id === p.id))
                .map(p => ({
                  label: `${p.nombre} (Precio: ₡${p.precioUnidad})`,
                  value: String(p.id)
                }))
            ]}
            onChange={seleccionarProducto}
            placeholder="Seleccione productos..."
            containerStyle={{ marginBottom: 12 }}
            selectStyle={[styles.comboInput, { minHeight: 45 }]}
            labelStyle={styles.comboLabel}
            showsVerticalScrollIndicator={false}
          />

          <ProductosSeleccionadosList
            productosSeleccionados={productosSeleccionados}
            onQuitar={quitarProducto}
          />

          {/* Costo de Mano de Obra */}
          <View style={styles.comboContainer}>
            <CustomText style={styles.comboLabel}>Costo de Mano de Obra *</CustomText>
            <Input
              value={costoManoObra}
              onChangeText={(v) => {
                setCostoManoObra(v);
                if (errores.costoManoObra) setErrores((prev) => { const s = { ...prev }; delete s.costoManoObra; return s; });
              }}
              placeholder="Ej: 3000"
              keyboardType="numeric"
              containerStyle={{ marginBottom: 0 }}
              style={[styles.comboInput, submitted && errores.costoManoObra && { borderColor: COLORS.error }]}
            />
          </View>

          {/* Preview del Precio Global */}
          <View style={{
            backgroundColor: COLORS.primaryLight,
            borderColor: COLORS.primary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginVertical: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <CustomText style={{ fontSize: 13, fontWeight: "700", color: COLORS.textSecondary }}>Costo Total Estimado:</CustomText>
            <CustomText style={{ fontSize: 16, fontWeight: "700", color: COLORS.primary }}>₡{costoTotal.toLocaleString("es-CR")}</CustomText>
          </View>

          {/* Estado del ticket */}
          <SelectorPills
            label={TEXTOS_MODAL_AGREGAR.labelEstado}
            value={estadoTicket}
            onChange={(v) => setEstadoTicket(v)}
            opciones={[
              { label: "En espera", value: "en_espera" },
              { label: "En mantenimiento", value: "en_mantenimiento" },
              { label: "Terminado", value: "Terminado" }
            ]}
          />
        </Card>

        {/* Alerta de Error de Validación */}
        {submitted && Object.keys(errores).length > 0 && (
          <Alert
            variant="danger"
            message={errores.tareasPendientes ? "No se puede terminar el ticket si existen tareas pendientes." : "Revisa los campos obligatorios marcados con * antes de guardar."}
            containerStyle={{ marginVertical: 12, alignItems: "center", justifyContent: "center", width: "100%" }}
            textStyle={{ color: "#000000", fontWeight: "600", fontSize: 13, textAlign: "center", width: "100%" }}
          />
        )}

        {/* Botones de acción del Formulario */}
        <View style={styles.modalFooter}>
          <Button
            variant="outline"
            onPress={() => router.replace("/equipos/mantEquipo")}
            style={styles.btnCancel}
          >
            <Icon icon={ICONS.exit} size={15} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
              {TEXTOS_MODAL_AGREGAR.btnCancelar}
            </CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={handleCrear}
            style={styles.btnAccept}
          >
            <Icon icon={ICONS.check} size={15} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
              {TEXTOS_MODAL_AGREGAR.btnAceptar}
            </CustomText>
          </Button>
        </View>

      </View>
    </ScrollView>
  );
}
