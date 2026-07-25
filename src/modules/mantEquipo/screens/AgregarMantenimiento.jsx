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

import React from "react";
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

import { TEXTOS_MODAL_AGREGAR, USUARIO_SESION, LISTA_ESTADOS_TICKET, LISTA_TIPOS_PERSONAL }
  from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";
import MantenimientoEquipoSelect from "../components/MantenimientoEquipoSelect.jsx";
import MantenimientoTareaSelect from "../components/MantenimientoTareaSelect.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";
import SelectorPills from "../components/SelectorPills.jsx";
import TareasSeleccionadasList from "../components/TareasSeleccionadasList.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import MantenimientoProductoSelect from "../components/MantenimientoProductoSelect.jsx";
import ProductosSeleccionadosList from "../components/ProductosSeleccionadosList.jsx";

import { useAgregarMantenimiento } from "../hooks/useAgregarMantenimiento.js";
export default function AgregarMantenimientoScreen({ onNavigateToMain = () => { } }) {

  const {
    titulo, setTitulo,
    descripcion, setDescripcion,
    equipoId,
    estadoEquipo, setEstadoEquipo,
    equipoSeleccionado,
    tareasSeleccionadas, setTareasSeleccionadas,
    fecha, setFecha,
    tipoPersonal, setTipoPersonal,
    costoManoObra, setCostoManoObra,
    estadoTicket, setEstadoTicket,
    productosList,
    productosSeleccionados,
    alertaStock, setAlertaStock,
    costoTotal,
    errores, setErrores,
    submitted,
    seleccionarEquipoById,
    quitarEquipo,
    agregarProducto,
    quitarProducto,
    cambiarCantidadProducto,
    handleCrear,
  } = useAgregarMantenimiento({ onNavigateToMain });

  const SectionTitle = ({ icon, title }) => (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionTitleIcon} />
      <CustomText style={styles.sectionTitleText}>{title}</CustomText>
    </View>
  );

  return (
    <ScrollView style={STYLE.container} keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={[STYLE.contentWrapper, styles.screenFormContent]}>

        {/* Sección: IDENTIFICACIÓN Y GENERAL */}
        <Card style={[styles.card, styles.cardSection]}>
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
                <View style={[styles.comboInput, styles.readOnlyField]}>
                  <CustomText style={styles.readOnlyText}>{USUARIO_SESION}</CustomText>
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
              style={[styles.comboInput, styles.inputMultiline, submitted && errores.descripcion &&
                { borderColor: COLORS.error }]}
            />
          </View>
        </Card>

        {/* Sección: DETALLES DEL EQUIPO */}
        <Card style={[styles.card, styles.cardSection]}>
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
        <Card style={[styles.card, styles.cardSection]}>
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
        <Card style={[styles.card, styles.cardSection]}>
          <SectionTitle icon={ICONS.money} title="COSTOS Y PERSONAL" />

          {/* Tipo de Personal */}
          <SelectorPills
            label="Tipo de Personal *"
            value={tipoPersonal}
            onChange={(v) => {
              setTipoPersonal(v);
              if (v === "interno") setCostoManoObra("0");
            }}
            opciones={LISTA_TIPOS_PERSONAL}
          />

          {/* Selector de Producto / Insumo con cantidad */}
          <MantenimientoProductoSelect
            productosList={productosList}
            productosSeleccionados={productosSeleccionados}
            onAgregarProducto={agregarProducto}
            alertaStock={alertaStock}
            setAlertaStock={setAlertaStock}
          />

          {/* Lista de productos seleccionados */}
          <ProductosSeleccionadosList
            productosSeleccionados={productosSeleccionados}
            onQuitar={quitarProducto}
            onCambiarCantidad={cambiarCantidadProducto}
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
          <View style={styles.costoTotalBox}>
            <CustomText style={styles.costoTotalLabel}>Costo Total Estimado:</CustomText>
            <CustomText style={styles.costoTotalValor}>₡{costoTotal.toLocaleString("es-CR")}</CustomText>
          </View>

          {/* Estado del ticket */}
          <SelectorPills
            label={TEXTOS_MODAL_AGREGAR.labelEstado}
            value={estadoTicket}
            onChange={(v) => setEstadoTicket(v)}
            opciones={LISTA_ESTADOS_TICKET}
          />
        </Card>

        {/* Alerta de Error de Validación */}
        {submitted && Object.keys(errores).length > 0 && (
          <Alert
            variant="danger"
            message={errores.tareasPendientes ? "No se puede terminar el ticket si existen tareas pendientes." : "Revisa los campos obligatorios marcados con * antes de guardar."}
            containerStyle={styles.alertValidacion}
            textStyle={styles.alertValidacionTexto}
          />
        )}

        {/* Botones de acción del Formulario */}
        <View style={styles.formFooter}>
          <Button
            variant="outline"
            onPress={handleCrear}
            style={[styles.btnAccept, { flex: 1 }]}
          >
            <Icon icon={ICONS.add} size={15} color={COLORS.primary} />
            <CustomText style={styles.btnTextPrimary}>
              {TEXTOS_MODAL_AGREGAR.btnAceptar}
            </CustomText>
          </Button>
        </View>

      </View>
    </ScrollView>
  );
}
