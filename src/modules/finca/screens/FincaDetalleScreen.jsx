/**
 * ============================================================
 * PANTALLA DE DETALLE DE FINCA
 * ============================================================
 *
 * Muestra la informacion completa de una finca seleccionada
 * junto con los estanques asociados.
 *
 * Cambios:
 * - Usa el modal global ModalEliminar para eliminar estanques.
 * - El flujo de eliminacion pregunta Si o No antes de eliminar.
 * - La logica auxiliar se movio a FincaDetalleService.
 */

import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../styles/FincaDetalleStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

import useFincaDetalle from "../hooks/useFincaDetalle";
import {
  detenerEvento,
  obtenerDatoFinca,
} from "../services/FincaDetalleService.js";

import Alert from "../../../shared/components/Alert";
import Card from "../../../shared/components/Card";
import CardPress from "../../../shared/components/CardPress";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";
import Badge from "../../../shared/components/Badge";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import ModalEliminar from "../../../shared/components/ModalEliminar";

export default function FincaDetalleScreen({ onEstanque, onEstanqueDetalle }) {
  const router = useRouter();

  const {
    finca,
    estanquesFinca,
    eliminarEstanque,
    haldleGenerar,
    loadingFincas,
    loadingPdf,
  } = useFincaDetalle();

  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState(null);
  const [mensajeEliminado, setMensajeEliminado] = useState("");

  function irANuevoEstanque() {
    if (onEstanque) {
      onEstanque();
      return;
    }

    router.push("/finca/estanque");
  }

  function irADetalleEstanque(codigo) {
    if (onEstanqueDetalle) {
      onEstanqueDetalle(codigo);
      return;
    }

    router.push({
      pathname: "/finca/detalleEstanque",
      params: {
        id: codigo,
      },
    });
  }

  function irAEditarEstanque(event, estanque) {
    detenerEvento(event);

    router.push({
      pathname: "/finca/editarEstanque",
      params: estanque,
    });
  }

  function abrirModalEliminar(event, estanque) {
    detenerEvento(event);
    setEstanqueSeleccionado(estanque);
    setModalEliminarVisible(true);
  }

  function cerrarModalEliminar() {
    setModalEliminarVisible(false);
    setEstanqueSeleccionado(null);
  }

  function confirmarEliminarEstanque() {
    if (estanqueSeleccionado === null) {
      cerrarModalEliminar();
      return;
    }

    eliminarEstanque(estanqueSeleccionado.codigo);

    setMensajeEliminado(
      `El estanque ${estanqueSeleccionado.codigo} fue eliminado correctamente.`,
    );

    setModalEliminarVisible(false);
    setEstanqueSeleccionado(null);
  }

  if (loadingFincas) {
    return <Text>Cargando...</Text>;
  }

  if (!finca) {
    return (
      <>
        <NavbarRegistro
          Titulo="Detalle de Finca"
          Subtitulo="No encontrada"
          Icono="document"
        />

        <ScrollView style={STYLE.container}>
          <View style={STYLE.contentWrapper}>
            <Alert
              variant="danger"
              message="No se encontro la finca seleccionada."
            />
          </View>
        </ScrollView>
      </>
    );
  }

  const nombreFinca = obtenerDatoFinca(finca, "nombreFinca", "nombre", "");
  const codigoFinca = obtenerDatoFinca(
    finca,
    "codigoCBO",
    "codigoInterno",
    "No registrado",
  );
  const responsable = obtenerDatoFinca(
    finca,
    "propietarioResponsable",
    "responsable",
    "No registrado",
  );
  const areaTotal = obtenerDatoFinca(finca, "areaTotal", "areaTotal", "0");
  const espejoAgua = obtenerDatoFinca(finca, "espejosAgua", "espejoAgua", "0");

  let telefonos = [];

  if (Array.isArray(finca.telefonoParse) === true) {
    telefonos = finca.telefonoParse;
  }

  if (telefonos.length === 0 && Array.isArray(finca.telefonos) === true) {
    telefonos = finca.telefonos;
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Detalle de Finca"
        Subtitulo={nombreFinca}
        Icono="document"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          {mensajeEliminado !== "" && (
            <Alert
              variant="success"
              message={mensajeEliminado}
              style={styles.alertMensaje}
            />
          )}

          <Card>
            <View>
              <Text color={COLORS.textTertiary} style={styles.titleText}>
                DATOS DE LA FINCA
              </Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Nombre:</Text>
              <Text style={styles.valor}>{nombreFinca}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>CBO:</Text>
              <Text style={styles.valor}>{codigoFinca}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Provincia:</Text>
              <Text style={styles.valor}>{finca.provincia}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Canton:</Text>
              <Text style={styles.valor}>{finca.canton}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Distrito:</Text>
              <Text style={styles.valor}>{finca.distrito}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Responsable:</Text>
              <Text style={styles.valor}>{responsable}</Text>
            </View>

            {telefonos.map(function (telefono, index) {
              return (
                <View key={String(index)} style={styles.filaDetalle}>
                  <Text style={styles.etiqueta}>Telefono {index + 1}: </Text>
                  <Text style={styles.valor}>{telefono}</Text>
                </View>
              );
            })}

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Area:</Text>
              <Text style={styles.valor}>{areaTotal}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Espejo Agua:</Text>
              <Text style={styles.valor}>{espejoAgua}</Text>
            </View>

            <Button
              style={styles.buttonExport}
              onPress={haldleGenerar}
              disabled={loadingPdf}
            >
              <Icon
                icon={ICONS.document}
                style={styles.iconDocument}
                size={18}
              />

              <Text size={15}>
                {loadingPdf ? "GENERANDO..." : "GENERAR REPORTE FINCA"}
              </Text>
            </Button>
          </Card>

          <Button style={styles.addButton} onPress={irANuevoEstanque}>
            <Icon style={styles.addButtonText} icon={ICONS.add} size={15} />
            <Text style={styles.addButtonText} size={15}>
              REGISTRAR NUEVO ESTANQUE
            </Text>
          </Button>

          {estanquesFinca.length === 0 && (
            <Card>
              <Text color={COLORS.textTertiary} align="center">
                No hay estanques registrados para esta finca.
              </Text>
            </Card>
          )}

          {estanquesFinca.map(function (estanque, index) {
            return (
              <View key={`${estanque.codigo}-${index}`}>
                <CardPress
                  onPress={function () {
                    irADetalleEstanque(estanque.codigo);
                  }}
                >
                  <View style={styles.header}>
                    <View style={styles.icon}>
                      <Icon icon={ICONS.waterFlow} color={COLORS.primary} />
                    </View>

                    <View>
                      <Text style={styles.finca}>{estanque.finca}</Text>
                      <Text style={styles.codigo}>{estanque.codigo}</Text>
                    </View>

                    <Badge style={styles.estado} label={estanque.estado} />
                  </View>

                  <View style={styles.dimensiones}>
                    <View style={styles.item}>
                      <Text style={styles.label}>Largo</Text>
                      <Text style={styles.valorE}>{estanque.largo} m</Text>
                    </View>

                    <View style={styles.item}>
                      <Text style={styles.label}>Ancho</Text>
                      <Text style={styles.valorE}>{estanque.ancho} m</Text>
                    </View>

                    <View style={styles.item}>
                      <Text style={styles.label}>Profundidad</Text>
                      <Text style={styles.valorE}>
                        {estanque.profundidad} m
                      </Text>
                    </View>
                  </View>

                  <View style={styles.Buttons}>
                    <Button
                      style={styles.Eliminar}
                      onPress={function (event) {
                        abrirModalEliminar(event, estanque);
                      }}
                    >
                      <Icon
                        icon={ICONS.delete}
                        style={styles.iconEliminar}
                        size={20}
                      />
                      <Text size={12} style={styles.textEliminar}>
                        Eliminar
                      </Text>
                    </Button>

                    <Button
                      style={styles.Editar}
                      onPress={function (event) {
                        irAEditarEstanque(event, estanque);
                      }}
                    >
                      <Icon
                        icon={ICONS.edit}
                        style={styles.iconEditar}
                        size={20}
                      />
                      <Text size={12} style={styles.textEditar}>
                        Editar
                      </Text>
                    </Button>
                  </View>
                </CardPress>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <ModalEliminar
        visible={modalEliminarVisible}
        title="estanque"
        message={estanqueSeleccionado?.codigo}
        confirmText="Si, eliminar"
        cancelText="No"
        onCancel={cerrarModalEliminar}
        onConfirm={confirmarEliminarEstanque}
      />
    </>
  );
}
