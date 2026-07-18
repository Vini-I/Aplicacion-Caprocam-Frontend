/**
 * ============================================================
 * PANTALLA: EditarMantenimiento
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Provee un formulario interactivo para la modificación de un ticket de mantenimiento 
 *   existente en el sistema, permitiendo actualizar datos, tareas y estado.
 * 
 * FUNCIONALIDAD:
 * - Recupera el ID del ticket por parámetros y precarga sus datos en el formulario.
 * - Presentación detallada del equipo seleccionado.
 * - Edición de horas de ingreso, tipo de personal, costos y tareas.
 * - Guardado persistente de las modificaciones.
 * 
 * DATOS / VARIABLES:
 * - id: Identificador único del ticket a editar obtenido por useLocalSearchParams.
 * - Estados locales vinculados a los campos del formulario (titulo, descripcion, costoManoObra).
 * - errores: Objeto para registrar fallas de validación.
 * 
 * VALIDACIONES / REGLAS:
 * - Campos requeridos (Título, Descripción, Tarea, Equipo y Costo) marcados con asterisco.
 * - El borde en rojo de validación aparece únicamente después de presionar "Actualizar" si el campo está vacío.
 * - Si el estado es "Terminado", el costo de mano de obra es obligatorio. De lo contrario, es opcional.
 * 
 * NAVEGACIÓN:
 * - Al actualizar con éxito, redirige a /equipos/DetalleMantenimiento?id={id} con banner.
 * - Al cancelar, regresa a /equipos/DetalleMantenimiento?id={id}.
 * 
 * DEPENDENCIAS:
 * - Input, Select, Button, Icon, CustomText, Card, Alert
 * - mantEquipoService, colors, style, icons, typography
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";

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
import * as MantService from "../services/mantEquipoService.js";

import MantenimientoEquipoSelect from "../components/MantenimientoEquipoSelect.jsx";
import MantenimientoTareaSelect from "../components/MantenimientoTareaSelect.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";

import SelectorPills from "../components/SelectorPills.jsx";
import TareasSeleccionadasList from "../components/TareasSeleccionadasList.jsx";
import Select from "../../../shared/components/Select.jsx";
import { getProductosInventario } from "../../inventarios/services/InventarioService.js";
import ProductosSeleccionadosList from "../components/ProductosSeleccionadosList.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import { parseDate, formatDate } from "../../../shared/utils/dateUtils.js";

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

export default function EditarMantenimientoScreen({ id, onNavigateToDetail = () => {}, onNavigateToMain = () => {} }) {

  // Buscar el ticket correspondiente
  const ticketOriginal = MantService.TICKETS_MOCK.find(t => t.id === id);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [estadoEquipo, setEstadoEquipo] = useState("");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [fecha, setFecha] = useState("");

  const [horasUso, setHorasUso] = useState("");
  const [tipoPersonal, setTipoPersonal] = useState("interno");
  const [costoManoObra, setCostoManoObra] = useState("");
  const [estadoTicket, setEstadoTicket] = useState("en_espera");

  // Insumos del inventario
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productosList, setProductosList] = useState([]);

  useEffect(() => {
    const list = getProductosInventario() || [];
    setProductosList(list);
  }, []);

  // Precargar los datos en el render inicial
  useEffect(() => {
    if (ticketOriginal) {
      setTitulo(ticketOriginal.titulo || "");
      setDescripcion(ticketOriginal.descripcion || "");
      setEquipoId(ticketOriginal.equipoId || "");
      setEstadoTicket(ticketOriginal.estado || "en_espera");
      setTareasSeleccionadas(ticketOriginal.tareas || []);
      setFecha(ticketOriginal.fechaCreacion ? formatDate(new Date(ticketOriginal.fechaCreacion)) : "");

      const eq = MantService.EQUIPOS_MOCK.find(e => e.id === ticketOriginal.equipoId);
      if (eq) {
        setEquipoSeleccionado(eq);
        setEstadoEquipo(eq.estado || "");
      }

      setHorasUso(ticketOriginal.horasUsoIngreso !== undefined ? String(ticketOriginal.horasUsoIngreso) : "");
      setTipoPersonal(ticketOriginal.tipoPersonal || "interno");
      setCostoManoObra(ticketOriginal.costoManoObra !== undefined ? String(ticketOriginal.costoManoObra) : "0");
      if (ticketOriginal.productos) {
        const prodList = getProductosInventario() || [];
        const mapped = ticketOriginal.productos.map(tp => prodList.find(p => String(p.id) === String(tp.id))).filter(Boolean);
        setProductosSeleccionados(mapped);
      } else if (ticketOriginal.productoId) {
        const prodList = getProductosInventario() || [];
        const prod = prodList.find(p => String(p.id) === String(ticketOriginal.productoId));
        if (prod) setProductosSeleccionados([prod]);
      }
    }
  }, [id]);

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
      setHorasUso(String(eq.horasUso || ""));
      if (errores.equipoId) setErrores((prev) => { const s = { ...prev }; delete s.equipoId; return s; });
    }
  };

  const quitarEquipo = () => {
    setEquipoSeleccionado(null);
    setEquipoId("");
    setEstadoEquipo("");
    setHorasUso("");
  };



  // Calcular costo total sumando mano de obra y el precio de todos los insumos seleccionados
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

  const handleGuardar = () => {
    setSubmitted(true);
    if (!validar()) return;

    const ticketActualizado = {
      ...ticketOriginal,
      equipoId,
      herramienta: `${equipoSeleccionado.nombre} ${equipoSeleccionado.serie}`,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tareas: tareasSeleccionadas,
      estado: estadoTicket,

      fechaCreacion: parseDate(fecha) || ticketOriginal.fechaCreacion,
      horasUsoIngreso: equipoSeleccionado ? equipoSeleccionado.horasUso : ticketOriginal.horasUsoIngreso,
      tipoPersonal,
      costoMiscelaneo: 0,
      costoManoObra: parseFloat(costoManoObra) || 0,
      costoTotal: costoTotal,
      productos: productosSeleccionados.map(p => ({ id: p.id, precio: p.precioUnidad })),
    };

    MantService.actualizarTicket(ticketActualizado);

    if (estadoEquipo) {
      MantService.actualizarEstadoEquipo(equipoId, estadoEquipo);
    }

    // Reiniciar las horas de uso del equipo a 0 solo si se completa el ticket ("Terminado")
    if (estadoTicket === "Terminado") {
      MantService.reiniciarHorasEquipo(equipoId);
    }

    // Redireccionar al detalle del ticket con una alerta de éxito
    onNavigateToDetail(ticketOriginal.id, {
      alertaTipo: "success",
      alertaMensaje: `Ticket ${ticketOriginal.id} modificado correctamente.`,
    });
  };

  if (!ticketOriginal) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <CustomText style={{ color: COLORS.error }}>Ticket no encontrado.</CustomText>
        <Button variant="outline" onPress={onNavigateToMain} style={{ marginTop: 12 }}>
          Regresar a lista
        </Button>
      </View>
    );
  }

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

          {/* Ticket ID y Creado por */}
          <View style={styles.comboRow}>
            <View style={styles.halfCol}>
              <View style={styles.comboContainer}>
                <CustomText style={styles.comboLabel}>Ticket ID</CustomText>
                <View style={[styles.comboInput, { backgroundColor: COLORS.surface }]}>
                  <CustomText style={{ fontSize: 14, color: COLORS.textSecondary }}>{ticketOriginal.id}</CustomText>
                </View>
              </View>
            </View>
            <View style={styles.halfCol}>
              <View style={styles.comboContainer}>
                <CustomText style={styles.comboLabel}>{TEXTOS_MODAL_AGREGAR.labelCreadoPor}</CustomText>
                <View style={[styles.comboInput, { backgroundColor: COLORS.surface }]}>
                  <CustomText style={{ fontSize: 14, color: COLORS.textSecondary }}>{ticketOriginal.creadoPor || USUARIO_SESION}</CustomText>
                </View>
              </View>
            </View>
          </View>

          {/* Fecha de registro */}
          <DateInput
            label={TEXTOS_MODAL_AGREGAR.labelFechaHora}
            value={fecha}
            onChangeText={setFecha}
            containerStyle={{ marginBottom: 12 }}
            inputStyle={styles.comboInput}
            labelStyle={styles.comboLabel}
          />

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

          {/* Tareas  */}
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

        {/* Alerta: campos obligatorios sin llenar */}
        {submitted && (errores.titulo || errores.equipoId || errores.descripcion || errores.tareas || errores.costoManoObra) && (
          <Alert
            variant="danger"
            message="Revisa los campos obligatorios marcados con * antes de guardar."
            containerStyle={{ marginTop: 12, alignItems: "center", justifyContent: "center", width: "100%" }}
            textStyle={{ color: "#000000", fontWeight: "600", fontSize: 13, textAlign: "center", width: "100%" }}
          />
        )}

        {/* Alerta: tareas pendientes al querer terminar el ticket */}
        {submitted && errores.tareasPendientes && (
          <Alert
            variant="danger"
            message="No se puede terminar el ticket si existen tareas pendientes."
            containerStyle={{ marginTop: 8, alignItems: "center", justifyContent: "center", width: "100%" }}
            textStyle={{ color: "#000000", fontWeight: "600", fontSize: 13, textAlign: "center", width: "100%" }}
          />
        )}

        {/* Botones del Formulario */}
        <View style={styles.modalFooter}>
          <Button
            variant="outline"
            onPress={() => onNavigateToDetail(ticketOriginal.id)}
            style={styles.btnCancel}
          >
            <Icon icon={ICONS.exit} size={15} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
              {TEXTOS_MODAL_AGREGAR.btnCancelar}
            </CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={handleGuardar}
            style={styles.btnAccept}
          >
            <Icon icon={ICONS.check} size={15} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
              {TEXTOS_MODAL_AGREGAR.btnActualizar}
            </CustomText>
          </Button>
        </View>

      </View>
    </ScrollView>
  );
}
