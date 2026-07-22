/**
 * ============================================================
 * COMPONENTE: DATOS DE LARVA
 * ============================================================
 *
 * Muestra proveedor, laboratorio, procedencia, lote, PL y
 * certificado de la larva. Edición según el modo recibido,
 * validaciones visuales del formulario (todo esto ya existía).
 *
 * AGREGADO: debajo de cada Select de proveedor/laboratorio/
 * procedencia hay 2 links ("+ Agregar nuevo" / "Ver todos", solo
 * si no está en modo vista) que abren un modal para gestionar ese
 * catálogo (crear/editar/eliminar) sin salir de esta pantalla.
 *
 * Toda la lógica del modal (qué vista mostrar, el formulario, la
 * confirmación de borrado) vive en el hook useCatalogoModal - este
 * componente solo la consume y dibuja.
 *
 * Recibe onAgregarX/onEditarX/onEliminarX (X = Proveedor,
 * Laboratorio, Procedencia) por props; si no vienen, los links de
 * ese campo no se muestran.
 *
 * DEPENDENCIAS:
 * - Card, Input, Select, Button, Alert, Modal, ModalEliminar (shared/components).
 * - SectionTitle, useCatalogoModal.
 */
import { View, ScrollView } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import ModalEliminar from "../../../shared/components/ModalEliminar";
import Alert from "../../../shared/components/Alert";
import Text from "../../../shared/components/Text";

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import Icon from "../../../shared/components/Icons";
import { styles } from "../styles/SiembraSectionStyles";
import SectionTitle from "./SectionTitle";
import { useCatalogoModal } from "../hooks/useCatalogoModal";

const camposCatalogo = {
  proveedorLarva: {
    titulo: "proveedor de larva",
    tituloPlural: "Proveedores de larva",
  },
  laboratorioLarva: { titulo: "laboratorio", tituloPlural: "Laboratorios" },
  procedenciaLarva: {
    titulo: "procedencia de larva",
    tituloPlural: "Procedencias de larva",
  },
};

export default function DatosLarvaSection({
  formData,
  onChange,
  proveedoresLarva,
  laboratoriosLarva,
  procedenciasLarva,
  plLarva,
  mode = "edit",
  fieldHelpers,
  onAgregarProveedor,
  onAgregarLaboratorio,
  onAgregarProcedencia,
  onEditarProveedor,
  onEditarLaboratorio,
  onEditarProcedencia,
  onEliminarProveedor,
  onEliminarLaboratorio,
  onEliminarProcedencia,
}) {
  const isViewMode = mode === "view";
  const { hasError, requiredLabel } = fieldHelpers;
  const esPreCria = formData.tipoRegistro === "precria";

  const {
    campoActivo,
    vistaModal,
    itemEnEdicionValue,
    nombreForm,
    setNombreForm,
    nombreConError,
    mensaje,
    mensajeVariant,
    itemAEliminar,
    opcionesPorCampo,
    handlersAgregar,
    cerrarTodo,
    abrirAgregar,
    abrirLista,
    abrirEditar,
    volverALista,
    guardarFormulario,
    pedirConfirmacionEliminar,
    confirmarEliminar,
  } = useCatalogoModal({
    proveedoresLarva,
    laboratoriosLarva,
    procedenciasLarva,
    onAgregarProveedor,
    onAgregarLaboratorio,
    onAgregarProcedencia,
    onEditarProveedor,
    onEditarLaboratorio,
    onEditarProcedencia,
    onEliminarProveedor,
    onEliminarLaboratorio,
    onEliminarProcedencia,
  });

  function renderLinks(campo) {
    const puedeAgregar = Boolean(handlersAgregar[campo]);
    const opciones = opcionesPorCampo[campo] || [];

    if (isViewMode || !puedeAgregar) {
      return null;
    }

    return (
      <View style={styles.linksCatalogoContainer}>
        <Button
          variant="ghost"
          style={styles.btnLinkCatalogo}
          onPress={() => abrirAgregar(campo)}
        >
          <Icon icon={ICONS.add} color={COLORS.primary} />
          <Text style={styles.textoLinkCatalogo}>Agregar nuevo</Text>
        </Button>

        {opciones.length > 0 && (
          <>
            <Text style={styles.separadorLinks}>·</Text>
            <Button
              variant="ghost"
              style={styles.btnLinkCatalogo}
              onPress={() => abrirLista(campo)}
            >
              <Text style={styles.textoLinkCatalogo}>Ver todos</Text>
            </Button>
          </>
        )}
      </View>
    );
  }
  const info = campoActivo ? camposCatalogo[campoActivo] : null;
  const opcionesCampoActivo = campoActivo
    ? opcionesPorCampo[campoActivo] || []
    : [];

  return (
    <Card>
      <SectionTitle icon={ICONS.shrimp} title="Datos de larva" />

      <Select
        label={requiredLabel("Proveedor de larva")}
        placeholder="Seleccionar proveedor"
        options={proveedoresLarva}
        value={formData.proveedorLarva}
        onChange={(value) => onChange("proveedorLarva", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("proveedorLarva") ? styles.inputError : null}
        disabled={isViewMode}
      />
      {renderLinks("proveedorLarva")}

      <Select
        label={requiredLabel("Laboratorio")}
        placeholder="Seleccionar laboratorio"
        options={laboratoriosLarva}
        value={formData.laboratorioLarva}
        onChange={(value) => onChange("laboratorioLarva", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("laboratorioLarva") ? styles.inputError : null}
        disabled={isViewMode}
      />
      {renderLinks("laboratorioLarva")}

      <Select
        label={requiredLabel("Procedencia de larva")}
        placeholder="Seleccionar procedencia"
        options={procedenciasLarva}
        value={formData.procedenciaLarva}
        onChange={(value) => onChange("procedenciaLarva", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("procedenciaLarva") ? styles.inputError : null}
        disabled={isViewMode}
      />
      {renderLinks("procedenciaLarva")}

      <Input
        label={requiredLabel("Código de lote")}
        placeholder="Ej: LARV-2026-001"
        value={formData.codigoLoteLarva}
        onChangeText={(value) => onChange("codigoLoteLarva", value)}
        labelStyle={styles.requiredLabel}
        style={hasError("codigoLoteLarva") ? styles.inputError : null}
        editable={!isViewMode}
      />

      {!esPreCria && (
        <Select
          label={requiredLabel("PL larva")}
          placeholder="Seleccionar PL"
          options={plLarva}
          value={formData.plSiembra}
          onChange={(value) => onChange("plSiembra", value)}
          labelStyle={styles.requiredLabel}
          selectStyle={hasError("plSiembra") ? styles.inputError : null}
          disabled={isViewMode}
        />
      )}

      <Input
        label={requiredLabel("Certificado de larva")}
        placeholder="Ej: CERT-2026-001"
        value={formData.certificadoLarva}
        onChangeText={(value) => onChange("certificadoLarva", value)}
        labelStyle={styles.requiredLabel}
        style={hasError("certificadoLarva") ? styles.inputError : null}
        editable={!isViewMode}
      />

      {/* Modal: lista o formulario */}
      <Modal
        visible={vistaModal === "lista" || vistaModal === "formulario"}
        onClose={cerrarTodo}
        showCloseButton={false}
        containerStyle={styles.modalContainer}
      >
        {vistaModal === "lista" && info && (
          <>
            <Text style={styles.modalTitulo}>{info.tituloPlural}</Text>

            {mensaje !== "" && (
              <Alert
                message={mensaje}
                variant={mensajeVariant}
                style={styles.alert}
                textStyle={{ textAlign: "center" }}
              />
            )}

            {opcionesCampoActivo.length === 0 && (
              <Text style={styles.itemListaVacio}>
                Todavía no hay ítems en este catálogo.
              </Text>
            )}

            <ScrollView style={styles.listaScroll} showsVerticalScrollIndicator={false}>
              {opcionesCampoActivo.map((item) => (
                <View key={item.value} style={styles.itemListaFila}>
                  <Text style={styles.itemListaNombre}>{item.label}</Text>

                  <View style={styles.itemListaAcciones}>
                    <Button
                      variant="outline"
                      style={styles.btnItemLista}
                      onPress={() => abrirEditar(item)}
                    >
                      <Icon icon={ICONS.edit} color={COLORS.primary} />
                      <Text style={styles.textoLinkCatalogo}>Editar</Text>
                    </Button>

                    <Button
                      variant="outline"
                      style={[styles.btnItemLista, styles.btnItemListaEliminar]}
                      onPress={() => pedirConfirmacionEliminar(item)}
                    >
                      <Icon icon={ICONS.delete} color={COLORS.error} />
                      <Text style={styles.textoBtnEliminarCatalogo}>
                        Eliminar
                      </Text>
                    </Button>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.actions}>
              <Button
                variant="outline"
                style={styles.button}
                onPress={() => abrirAgregar(campoActivo)}
              >
                <Icon icon={ICONS.add} color={COLORS.primary} />
                <Text style={styles.textoBoton}>Agregar nuevo</Text>
              </Button>

              <Button
                variant="outline"
                style={styles.button}
                onPress={cerrarTodo}
              >
                <Icon icon={ICONS.close} color={COLORS.primary} />
                <Text style={styles.textoBoton}>Cerrar</Text>
              </Button>
            </View>
          </>
        )}

        {vistaModal === "formulario" && info && (
          <>
            <Text style={styles.modalTitulo}>
              {itemEnEdicionValue
                ? `Editar ${info.titulo}`
                : `Agregar ${info.titulo}`}
            </Text>

            <Input
              label={requiredLabel("Nombre")}
              placeholder={`Nombre del ${info.titulo}`}
              value={nombreForm}
              onChangeText={setNombreForm}
              labelStyle={styles.requiredLabel}
              style={nombreConError ? styles.inputError : null}
            />

            {mensaje !== "" && (
              <Alert
                message={mensaje}
                variant={mensajeVariant}
                style={styles.alert}
                textStyle={{ textAlign: "center" }}
              />
            )}

            <View style={styles.actions}>
              <Button
                variant="outline"
                style={styles.button}
                onPress={guardarFormulario}
              >
                <Icon icon={ICONS.save} color={COLORS.primary} />
                <Text style={styles.textoBoton}>Guardar</Text>
              </Button>

              <Button
                variant="outline"
                style={styles.button}
                onPress={itemEnEdicionValue ? volverALista : cerrarTodo}
              >
                <Icon icon={ICONS.close} color={COLORS.primary} />
                <Text style={styles.textoBoton}>Cancelar</Text>
              </Button>
            </View>
          </>
        )}
      </Modal>

      {/* Modal de confirmación de borrado */}
      <ModalEliminar
        visible={vistaModal === "eliminar"}
        title={info ? info.titulo : "ítem"}
        message={itemAEliminar?.label ?? ""}
        onConfirm={confirmarEliminar}
        onCancel={volverALista}
      />
    </Card>
  );
}
