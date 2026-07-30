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

import { TEXTOS_MODAL_AGREGAR, LISTA_ESTADOS_TICKET, LISTA_TIPOS_PERSONAL } from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";
import MantenimientoEquipoSelect from "../components/MantenimientoEquipoSelect.jsx";
import MantenimientoTareaSelect from "../components/MantenimientoTareaSelect.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";
import SelectorPills from "../components/SelectorPills.jsx";
import TareasSeleccionadasList from "../components/TareasSeleccionadasList.jsx";
import Select from "../../../shared/components/Select.jsx";
import ProductosSeleccionadosList from "../components/ProductosSeleccionadosList.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";

import { useEditarMantenimiento } from "../hooks/useEditarMantenimiento.js";


export default function EditarMantenimientoScreen({ id, onNavigateToDetail = () => { }, onNavigateToMain = () => { } }) {

  const {
    ticketOriginal,
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
    costoTotal,
    errores, setErrores,
    submitted,
    seleccionarEquipoById,
    quitarEquipo,
    seleccionarProducto,
    quitarProducto,
    handleGuardar,
  } = useEditarMantenimiento({ id, onNavigateToDetail, onNavigateToMain });

  if (!ticketOriginal) {
    return (
      <View style={[STYLE.container, styles.spinnerContainer]}>
        <CustomText style={styles.errorText}>Ticket no encontrado.</CustomText>
        <Button variant="outline" onPress={onNavigateToMain} style={styles.btnMarginTop}>
          Regresar a lista
        </Button>
      </View>
    );
  }

  const SectionTitle = ({ icon, title }) => (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionTitleIcon} />
      <CustomText style={styles.sectionTitleText}>{title}</CustomText>
    </View>
  );

  return (
    <ScrollView style={STYLE.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={[STYLE.contentWrapper, styles.screenFormContent]}>

        {/* Sección: IDENTIFICACIÓN Y GENERAL */}
        <Card style={[styles.card, styles.cardSection]}>
          <SectionTitle icon={ICONS.document} title="IDENTIFICACIÓN Y DATOS GENERALES" />

          {/* Ticket ID y Creado por */}
          <View style={styles.comboRow}>
            <View style={styles.halfCol}>
              <View style={styles.comboContainer}>
                <CustomText style={styles.comboLabel}>Ticket ID</CustomText>
                <View style={[styles.comboInput, styles.readOnlyField]}>
                  <CustomText style={styles.readOnlyText}>{ticketOriginal.id}</CustomText>
                </View>
              </View>
            </View>
            <View style={styles.halfCol}>
              <View style={styles.comboContainer}>
                <CustomText style={styles.comboLabel}>{TEXTOS_MODAL_AGREGAR.labelCreadoPor}</CustomText>
                <View style={[styles.comboInput, styles.readOnlyField]}>
                  <CustomText style={styles.readOnlyText}>{ticketOriginal.creadoPor || USUARIO_SESION}</CustomText>
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
              style={[styles.comboInput, styles.inputMultiline, submitted && errores.descripcion && { borderColor: COLORS.error }]}
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
            selectStyle={[styles.comboInput, styles.selectMinHeight]}
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

        {/* Alerta: campos obligatorios sin llenar */}
        {submitted && (errores.titulo || errores.equipoId || errores.descripcion || errores.tareas || errores.costoManoObra) && (
          <Alert
            variant="danger"
            message="Revisa los campos obligatorios marcados con * antes de guardar."
            containerStyle={styles.alertTopMargin}
            textStyle={styles.alertValidacionTexto}
          />
        )}

        {/* Alerta: tareas pendientes al querer terminar el ticket */}
        {submitted && errores.tareasPendientes && (
          <Alert
            variant="danger"
            message="No se puede terminar el ticket si existen tareas pendientes."
            containerStyle={styles.alertSecondMargin}
            textStyle={styles.alertValidacionTexto}
          />
        )}

        {/* Botones del Formulario */}
        <View style={styles.formFooter}>
          <Button
            variant="outline"
            onPress={handleGuardar}
            style={[styles.btnAccept, { flex: 1 }]}
          >
            <Icon icon={ICONS.check} size={15} color={COLORS.primary} />
            <CustomText style={styles.btnTextPrimary}>
              {TEXTOS_MODAL_AGREGAR.btnActualizar}
            </CustomText>
          </Button>
        </View>

      </View>
    </ScrollView>
  );
}
