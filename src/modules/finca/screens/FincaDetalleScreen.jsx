/**
 * ============================================================
 * PANTALLA DE DETALLE DE FINCA
 * ============================================================
 *
 * Muestra la informacion completa de una finca seleccionada
 * junto con los estanques asociados.
 *
 * Funcionalidad:
 * - Presenta informacion general de la finca.
 * - Muestra telefonos, ubicacion y caracteristicas principales.
 * - Permite generar reportes PDF de la finca.
 * - Lista los estanques asociados.
 * - Permite navegar al registro y detalle de estanques.
 * - Permite eliminar estanques con confirmacion Si / No.
 * - Utiliza componentes reutilizables para mantener el diseno.
 */

import { useEffect, useState } from "react";
import { Modal, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../styles/FincaDetalleStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

import useFincaDetalle from "../hooks/useFincaDetalle";
import { estanques } from "./EstanqueData";

import Alert from "../../../shared/components/Alert";
import Card from "../../../shared/components/Card";
import CardPress from "../../../shared/components/CardPress";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button";
import Badge from "../../../shared/components/Badge";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

function detenerEvento(event) {
  if (event && typeof event.stopPropagation === "function") {
    event.stopPropagation();
  }
}

function eliminarEstanqueDeData(codigo) {
  const posicion = estanques.findIndex(function (item) {
    return item.codigo === codigo;
  });

  if (posicion >= 0) {
    estanques.splice(posicion, 1);
    return true;
  }

  return false;
}

export default function FincaDetalleScreen({
  onEstanque,
  onEstanqueDetalle,
  onEstanqueEditar,
}) {
  const router = useRouter();

  const { finca, estanquesFinca, haldleGenerar, loading } = useFincaDetalle();

  const [estanquesMostrados, setEstanquesMostrados] = useState([]);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState(null);
  const [mensajeEliminado, setMensajeEliminado] = useState("");

  useEffect(
    function () {
      setEstanquesMostrados(estanquesFinca || []);
    },
    [finca?.codigoInterno],
  );

  function irANuevoEstanque() {
    if (onEstanque) {
      onEstanque();
    }
  }

  function irADetalleEstanque(codigo) {
    if (onEstanqueDetalle) {
      onEstanqueDetalle(codigo);
    }
  }

  function irAEditarEstanque(event, estanque) {
    detenerEvento(event);

    if (onEstanqueEditar) {
      onEstanqueEditar(estanque.codigo);
      return;
    }

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
    if (!estanqueSeleccionado) {
      cerrarModalEliminar();
      return;
    }

    eliminarEstanqueDeData(estanqueSeleccionado.codigo);

    setEstanquesMostrados(function (listaActual) {
      return listaActual.filter(function (item) {
        return item.codigo !== estanqueSeleccionado.codigo;
      });
    });

    setMensajeEliminado(
      `El estanque ${estanqueSeleccionado.codigo} fue eliminado correctamente.`,
    );

    setModalEliminarVisible(false);
    setEstanqueSeleccionado(null);
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
              variant="warning"
              message="No se encontro la finca seleccionada."
            />
          </View>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Detalle de Finca"
        Subtitulo={finca.nombre}
        Icono="document"
      />

      <ScrollView style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          {mensajeEliminado !== "" ? (
            <Alert
              variant="success"
              message={mensajeEliminado}
              style={styles.alertMensaje}
            />
          ) : null}

          <Card>
            <View>
              <Text color={COLORS.textTertiary} style={styles.titleText}>
                DATOS DE LA FINCA
              </Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Nombre:</Text>
              <Text style={styles.valor}>{finca.nombre}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>CBO:</Text>
              <Text style={styles.valor}>{finca.codigoInterno}</Text>
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
              <Text style={styles.valor}>{finca.responsable}</Text>
            </View>

            {finca.telefonos?.map(function (telefono, index) {
              return (
                <View key={String(index)} style={styles.filaDetalle}>
                  <Text style={styles.etiqueta}>Telefono {index + 1}: </Text>
                  <Text style={styles.valor}>{telefono}</Text>
                </View>
              );
            })}

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Area:</Text>
              <Text style={styles.valor}>{finca.areaTotal}</Text>
            </View>

            <View style={styles.filaDetalle}>
              <Text style={styles.etiqueta}>Espejo Agua:</Text>
              <Text style={styles.valor}>{finca.espejoAgua}</Text>
            </View>

            <Button
              style={styles.buttonExport}
              onPress={haldleGenerar}
              disabled={loading}
            >
              <Icon
                icon={ICONS.document}
                style={styles.iconDocument}
                size={18}
              />
              <Text size={15}>
                {loading ? "GENERANDO..." : "GENERAR REPORTE FINCA"}
              </Text>
            </Button>
          </Card>

          <Button style={styles.addButton} onPress={irANuevoEstanque}>
            <Icon icon={ICONS.add} size={15} />
            <Text size={15}>REGISTRAR NUEVO ESTANQUE</Text>
          </Button>

          {estanquesMostrados.length === 0 ? (
            <Card>
              <Text color={COLORS.textTertiary} align="center">
                No hay estanques registrados para esta finca.
              </Text>
            </Card>
          ) : null}

          {estanquesMostrados.map(function (estanque, index) {
            return (
              <View key={`${estanque.codigo}-${index}`}>
                <CardPress onPress={() => irADetalleEstanque(estanque.codigo)}>
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
                      onPress={(event) => abrirModalEliminar(event, estanque)}
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
                      onPress={(event) => irAEditarEstanque(event, estanque)}
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

      <Modal
        visible={modalEliminarVisible}
        transparent
        animationType="fade"
        onRequestClose={cerrarModalEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <Icon icon={ICONS.delete} size={30} color={COLORS.error} />
            </View>

            <Text size={20} style={styles.modalTitle}>
              Eliminar estanque
            </Text>

            <Text size={15} style={styles.modalMessage}>
              ¿Esta seguro que desea eliminar el estanque{" "}
              {estanqueSeleccionado?.codigo}?
            </Text>

            <View style={styles.modalActions}>
              <Button
                variant="outline"
                style={styles.modalNoButton}
                onPress={cerrarModalEliminar}
              >
                <Text size={14} style={styles.modalNoText}>
                  No
                </Text>
              </Button>

              <Button
                variant="outline"
                style={styles.modalYesButton}
                onPress={confirmarEliminarEstanque}
              >
                <Text size={14} style={styles.modalYesText}>
                  Si
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
