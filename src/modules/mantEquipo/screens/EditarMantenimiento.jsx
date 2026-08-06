/**
 * ============================================================
 * PANTALLA: EditarMantenimiento
 * ============================================================
 *
 * Formulario interactivo para modificar un ticket de mantenimiento
 * existente. Precarga todos sus datos desde el backend y permite
 * actualizar estado, tareas, costos y tipo de personal.
 *
 * @dependencies - useEditarMantenimiento (hooks)
 *               - Input, Select, Button, Icon, CustomText, Card, Alert (shared)
 *               - MantenimientoEquipoSelect, SelectorPills, ProductosSeleccionadosList
 *               - mantEquipoService, mantEquipoStyles, colors, style, icons
 * @validations  - Campos requeridos marcados con asterisco (*).
 *               - Borde rojo visible solo tras presionar "Actualizar" con campo vacío.
 *               - Si el estado es "Terminado", el costo de mano de obra es obligatorio.
 * @navigation   - Actualizar con éxito → /equipos/DetalleMantenimiento?id={id} con banner.
 *               - Cancelar → /equipos/DetalleMantenimiento?id={id}.
 */

import React from "react";
import { View, ScrollView } from "react-native";

import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Input from "../../../shared/components/Input.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Card from "../../../shared/components/Card.jsx";
import Alert from "../../../shared/components/Alert.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";

import { TEXTOS_MODAL_AGREGAR, LISTA_ESTADOS_TICKET, LISTA_TIPOS_PERSONAL } from "../constants/mantEquipoMensajes.js";
import { useUsuarioSesion } from "../hooks/useUsuarioSesion.js";
import * as MantService from "../services/mantEquipoService.js";
import MantenimientoEquipoSelect from "../components/MantenimientoEquipoSelect.jsx";
import MantenimientoTareaSelect from "../components/MantenimientoTareaSelect.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";
import SelectorPills from "../components/SelectorPills.jsx";
import TareasSeleccionadasList from "../components/TareasSeleccionadasList.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import MantenimientoProductoSelect from "../components/MantenimientoProductoSelect.jsx";
import ProductosSeleccionadosList from "../components/ProductosSeleccionadosList.jsx";

import { useEditarMantenimiento } from "../hooks/useEditarMantenimiento.js";
import { getFieldErrorStyle } from "../styles/mantEquipoStyles.js";
import SectionTitle from "../components/SectionTitle.jsx";
export default function EditarMantenimientoScreen({ id, onNavigateToDetail = () => { }, onNavigateToMain = () => { } }) {
  const usuarioSesion = useUsuarioSesion();

  const {
    ticketOriginal,
    cargando,
    errorCarga,
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
    alertaServidor,
    costoTotal,
    errores, setErrores,
    submitted,
    seleccionarEquipoById,
    quitarEquipo,
    agregarProducto,
    cambiarCantidadProducto,
    quitarProducto,
    handleGuardar,
  } = useEditarMantenimiento({ id, onNavigateToDetail, onNavigateToMain });

  if (cargando) {
    return (
      <View style={[STYLE.container, styles.spinnerContainer]}>
        <Spinner />
      </View>
    );
  }

  if (!ticketOriginal) {
    return <View style={STYLE.container} />;
  }

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
                  <CustomText style={styles.readOnlyText}>{ticketOriginal.creadoPor || usuarioSesion}</CustomText>
                </View>
              </View>
            </View>
          </View>

          {/* Fecha de registro */}
          <DateInput
            label={TEXTOS_MODAL_AGREGAR.labelFechaHora}
            value={fecha}
            onChangeText={setFecha}
            disabled
            containerStyle={styles.marginBottom12}
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
              containerStyle={styles.noMarginBottom}
              style={[styles.comboInput, getFieldErrorStyle(submitted && errores.titulo)]}
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
              containerStyle={styles.noMarginBottom}
              style={[styles.comboInput, styles.inputMultiline, getFieldErrorStyle(submitted && errores.descripcion)]}
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
              // Guardar el objeto completo: tareaId es necesario para vincularTareas al guardar
              setTareasSeleccionadas(prev => [
                ...prev,
                {
                  ...taskObj,
                  tareaId:  taskObj.tareaId || taskObj.id,
                  value:    String(taskObj.tareaId || taskObj.id),
                  label:    taskObj.nombre || taskObj.label,
                  nombre:   taskObj.nombre || taskObj.label,
                  realizada: false,
                }
              ]);
              if (errores.tareas) setErrores(e => { const copy = { ...e }; delete copy.tareas; return copy; });
            }}
            error={submitted && errores.tareas}
          />

          <TareasSeleccionadasList
            tareasSeleccionadas={tareasSeleccionadas}
            setTareasSeleccionadas={setTareasSeleccionadas}
            mostrarToggleEstado={false}
          />
        </Card>

        {/* Sección: COSTOS Y ESTADO DEL TICKET */}
        <Card style={[styles.card, styles.cardSection]}>
          <SectionTitle icon={ICONS.money} title="COSTOS Y PERSONAL" />

          {/* Tipo de Personal */}
          <SelectorPills
            label={TEXTOS_MODAL_AGREGAR.labelTipoPersonal}
            value={tipoPersonal}
            onChange={(v) => {
              setTipoPersonal(v);
              if (v === "interno") setCostoManoObra("");
            }}
            opciones={LISTA_TIPOS_PERSONAL}
          />

          {/* Selector de Producto / Insumo con cantidad */}
          <MantenimientoProductoSelect
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
                const soloNumeros = v.replace(/[^0-9]/g, '').slice(0, 7);
                setCostoManoObra(soloNumeros);
                if (errores.costoManoObra) setErrores((prev) => { const s = { ...prev }; delete s.costoManoObra; return s; });
              }}
              placeholder="Ej: 4000"
              keyboardType="numeric"
              containerStyle={styles.noMarginBottom}
              style={[styles.comboInput, getFieldErrorStyle(submitted && errores.costoManoObra)]}
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

        {/* Alerta de Error de Validación — un solo mensaje a la vez, en
            orden de prioridad: campos vacíos primero, luego la regla
            específica que falle según el orden del formulario. */}
        {submitted && errores.mensaje && Object.keys(errores).some((k) => k !== 'mensaje' && errores[k]) && (
          <Alert
            variant="danger"
            message={errores.mensaje}
            containerStyle={styles.alertTopMargin}
            textStyle={styles.alertValidacionTexto}
          />
        )}

        {/* Alerta de error de servidor/conexión al intentar guardar los cambios.
            Solo aparece cuando la validación de campos ya pasó y el fallo
            ocurrió al hablar con el backend (ej. servidor caído). */}
        {alertaServidor ? (
          <Alert
            variant="danger"
            message={alertaServidor}
            containerStyle={styles.alertServidor}
            textStyle={styles.alertServidorTexto}
          />
        ) : null}

        {/* Botones del Formulario */}
        <View style={styles.formFooter}>
          <Button
            variant="outline"
            onPress={handleGuardar}
            style={[styles.btnAccept, styles.btnFooterFlex]}
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