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

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import ModalEliminar from "../../../shared/components/ModalEliminar";

import useDetalleEstanque from "../hooks/useDetalleEstanque";

import { styles } from "../styles/EstanqueStyle";
import { obtenerTextoSiNo } from "../services/AireadoresEstanqueService";
import {
  construirEstanqueDetalle,
  eliminarEstanqueLocal,
  obtenerValorInfo,
} from "../services/EstanqueScreenService";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function DetalleEstanqueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { estanque: estanqueEncontrado, primeraMayuscula } = useDetalleEstanque();
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

  const estanque = construirEstanqueDetalle(estanqueEncontrado, params);

  console.log("ESTANQUE:", estanque);

  const { fincaNombre } = params;

  function volver() {
    router.back();
  }
  
  if (estanque.codigo === "") {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Alert
            variant="warning"
            message="No se encontro la informacion del estanque."
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

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
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
            <SectionTitle title="Siembra y fechas" icon={ICONS.calendar} />

            <Info label="Especie" value={primeraMayuscula(estanque.especie)} />
            <Info label="Fecha de siembra" value={estanque.fechaSiembra} />
            <Info
              label="Fecha inicio de engorde"
              value={estanque.fechaInicioEngorde}
            />
            <Info
              label="Fecha de mantenimiento"
              value={estanque.fechaMantenimiento}
            />
            <Info
              label="Densidad de siembra"
              value={`${estanque.densidadSiembra} ind/m2`}
            />
            <Info label="Precria" value={estanque.precria ? "Sí":"No"} />
          </Card>

          <Card>
            <SectionTitle title="Alimentacion y Equipos" icon={ICONS.food} />

            <Info label="Metodo De Alimentacion" value={primeraMayuscula(estanque.metodoAlimentacion)} />
            <Info label="Proveedor De Alimento" value={estanque.proveedorAlimento} />
            <Info
              label="Numero De Aireadores"
              value={estanque.numeroAireadores}
            />
            <Info
              label="Tiene Alimentador Automatico"
              value={estanque.tieneAlimentadorAutomatico === true || estanque.tieneAlimentadorAutomatico === "true" ? "Sí":"No"}
            />
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

function SectionTitle({ title, icon }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} />

      <Title
        level={5}
        color={COLORS.textSecondary}
        fuente={TYPOGRAPHY.fontFamily.bold}
        style={styles.sectionTitle}
      >
        {title}
      </Title>
    </View>
  );
}

function Info({ label, value }) {
  const valorFinal = obtenerValorInfo(value);

  return (
    <View style={styles.infoRow}>
      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.infoLabel}
      >
        {label}
      </CustomText>

      <CustomText
        size={15}
        color={COLORS.textSecondary}
        style={styles.infoValue}
      >
        {valorFinal}
      </CustomText>
    </View>
  );
}