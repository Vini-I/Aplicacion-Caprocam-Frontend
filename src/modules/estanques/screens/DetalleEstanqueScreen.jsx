import React from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

import useDetalleEstanque from "../hooks/useDetalleEstanque";

import { styles } from "../styles/EstanqueStyle";
import {
  obtenerTextoSiNo,
  obtenerTieneAireadoresInicial,
} from "../services/AireadoresEstanqueService";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function DetalleEstanqueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { estanque } = useDetalleEstanque();

  const tieneAireadores = obtenerTieneAireadoresInicial(
    params.tieneAireadores,
    params.numeroAireadores,
  );

  function volver() {
    router.back();
  }

  function editarEstanque() {
    router.push({
      pathname: "/registros/EditarEstanque",
      params: {
        id: estanque.id,
        finca: estanque.finca,
        codigo: estanque.codigo,
        estado: estanque.estado,
        tipoEstanque: estanque.tipoEstanque,
        largo: estanque.largo,
        ancho: estanque.ancho,
        profundidad: estanque.profundidad,
        fuenteAgua: estanque.fuenteAgua,
        especie: estanque.especie,
        fechaSiembra: estanque.fechaSiembra,
        fechaInicioEngorde: estanque.fechaInicioEngorde,
        fechaMantenimiento: estanque.fechaMantenimiento,
        densidadSiembra: estanque.densidadSiembra,
        precria: estanque.precria,
        metodoAlimentacion: estanque.metodoAlimentacion,
        proveedorAlimento: estanque.proveedorAlimento,
        numeroAireadores: estanque.numeroAireadores,
        tieneAireadores: estanque.tieneAireadores,
        codigoAireador: estanque.codigoAireador,
        estanqueAireador: estanque.estanqueAireador,
        tieneAlimentadorAutomatico: estanque.tieneAlimentadorAutomatico,
      },
    });
  }

  if (!estanque.codigo) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Alert
            variant="warning"
            message="No se encontro la informacion del estanque."
            style={styles.alert}
            textStyle={styles.alertText}
          />

          <Button onPress={volver} style={styles.saveButton}>
            Volver
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
    <NavbarRegistro
        Titulo="Detalle de Estanque"
        Subtitulo={`${estanque.finca} ${estanque.codigo}`}
        Icono="document"
      />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View style={styles.content}>
        <Card>
          <SectionTitle title="Informacion general" icon={ICONS.document} />

          <Info label="Codigo" value={estanque.codigo} />
          <Info label="Finca" value={estanque.finca} />
          <Info label="Estado" value={estanque.estado} />
          <Info label="Tipo de estanque" value={estanque.tipoEstanque} />
          <Info label="Fuente de agua" value={estanque.fuenteAgua} />
        </Card>

        <Card>
          <SectionTitle title="Dimensiones" icon={ICONS.ruler} />

          <Info label="Largo" value={`${estanque.largo} m`} />
          <Info label="Ancho" value={`${estanque.ancho} m`} />
          <Info label="Profundidad" value={`${estanque.profundidad} m`} />
        </Card>

        <Card>
          <SectionTitle title="Siembra y fechas" icon={ICONS.calendar} />

          <Info label="Especie" value={estanque.especie} />
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
            value={`${estanque.densidadSiembra} ind/m²`}
          />
          <Info label="Precria" value={estanque.precria} />
        </Card>

        <Card>
          <SectionTitle title="Alimentacion y equipos" icon={ICONS.food} />

          <Info
            label="Metodo de alimentacion"
            value={estanque.metodoAlimentacion}
          />
          <Info
            label="Proveedor de alimento"
            value={estanque.proveedorAlimento}
          />
          <Info
            label="Tiene aireadores"
            value={obtenerTextoSiNo(estanque.tieneAireadores)}
          />

          {estanque.tieneAireadores === "si" && (
            <View>
              <Info
                label="Codigo del aireador"
                value={estanque.codigoAireador}
              />

              <Info
                label="Estanque seleccionado"
                value={estanque.estanqueAireador}
              />

              <Info
                label="Numero de aireadores"
                value={estanque.numeroAireadores}
              />
            </View>
          )}

          <Info
            label="Alimentador automatico"
            value={estanque.tieneAlimentadorAutomatico}
          />
        </Card>

        <Button onPress={editarEstanque} style={styles.saveButton}>
          <View style={styles.inlineButtonContentCentered}>
            <Icon icon={ICONS.edit} size={18} color={COLORS.white} />

            <CustomText size={16} color={COLORS.white} style={styles.saveText}>
              Editar estanque
            </CustomText>
          </View>
        </Button>
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
  let valorFinal = value;

  if (value === "" || value === undefined || value === null) {
    valorFinal = "No registrado";
  }

  return (
    <View style={{ marginBottom: 10 }}>
      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
      >
        {label}
      </CustomText>

      <CustomText
        size={15}
        color={COLORS.textSecondary}
        style={{ fontFamily: TYPOGRAPHY.fontFamily.regular }}
      >
        {valorFinal}
      </CustomText>
    </View>
  );
}
