/**
 * ============================================================
 * PANTALLA DETALLE ESTANQUE
 * ============================================================
 *
 * Muestra la informacion registrada de un estanque.
 *
 * Cambios aplicados:
 * - El boton eliminar abre confirmacion.
 * - La confirmacion tiene boton Si y boton No.
 * - Si confirma, elimina el estanque del mock en la sesion local.
 * - Mantiene botones outline.
 */

import React from "react";
import { ScrollView, View } from "react-native";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import CustomText from "../../../shared/components/Text";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

import useDetalleEstanque from "../hooks/useDetalleEstanque";
import { SectionTitle, Info } from "../components/componentsEstanque";

import { STYLE } from "../../../theme/style";
import { styles } from "../styles/EstanqueStyle";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

export default function DetalleEstanqueScreen() {

  const {
    estanque,
    loading,
    fincaNombre,

    equiposAireacion,
    equiposAlimentacion,
    equiposBombeo,
    equiposMantenimiento,
    equiposMonitoreo,
    equiposOtros,

    primeraMayuscula,
  } = useDetalleEstanque();
  
  if (loading) {
    return (
      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          <CustomText style={{ padding: 20, textAlign: "center" }}>
            Cargando información del estanque...
          </CustomText>
        </View>
      </ScrollView>
    );
  }
  
  if (!estanque || !estanque.codigo) {
    return (
      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          <Alert
            variant="warning"
            message="No se encontró la información del estanque."
            style={styles.alert}
            textStyle={styles.alertText}
          />
          <Button variant="outline" onPress={volver} style={styles.outlinePrimaryButton}>
            <CustomText size={15} color={COLORS.primary}>
              Volver
            </CustomText>
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Detalle de Estanque"
        Subtitulo={`${estanque.codigo}`}
        Icono="document"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          <Card>
            <SectionTitle title="Informacion general" icon={ICONS.document} />

            <Info label="Codigo" value={estanque.codigo} />
            <Info label="Finca" value={fincaNombre} />
            <Info label="Estado" value={estanque.estado} />
            <Info label="Tipo de estanque" value={primeraMayuscula(estanque.tipoEstanque)} />
            <Info label="Fuente de agua" value={primeraMayuscula(estanque.fuenteAgua)} />
          </Card>

          <Card>
            <SectionTitle title="Dimensiones" icon={ICONS.ruler} />

            <Info label="Largo" value={`${estanque.largo} m`} />
            <Info label="Ancho" value={`${estanque.ancho} m`} />
            <Info label="Profundidad" value={`${estanque.profundidad} m`} />
          </Card>

          <Card>
            <SectionTitle title="Mantenimiento y precría" icon={ICONS.tools} />

            <Info
              label="Fecha de último mantenimiento"
              value={estanque.fechaMantenimiento}
            />

            <Info label="Se usa precría" value={estanque.precria === true || estanque.precria === "true" ? "Sí, se usa Precría":"No se usa Precría"} />
          </Card>

          <Card>
            <SectionTitle title="Equipos asociados" icon={ICONS.engine} />
            <Info
              label="Total de equipos"
              value={String(estanque.cantidadEquipos ?? 0)}
            />
            <Info label="Aireación" value={equiposAireacion} />
            <Info label="Alimentación" value={equiposAlimentacion} />
            <Info label="Bombeo" value={equiposBombeo} />
            <Info label="Mantenimiento" value={equiposMantenimiento} />
            <Info label="Monitoreo" value={equiposMonitoreo} />
            <Info label="Otros" value={equiposOtros} />
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
