import React from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { styles } from "../styles/EstanqueStyles";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function DetalleEstanqueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const estanque = {
    id: params.id,
    finca: params.finca,
    codigo: params.codigo,
    estado: params.estado,
    tipoEstanque: params.tipoEstanque,
    largo: params.largo,
    ancho: params.ancho,
    profundidad: params.profundidad,
    fuenteAgua: params.fuenteAgua,
    especie: params.especie,
    fechaSiembra: params.fechaSiembra,
    fechaInicioEngorde: params.fechaInicioEngorde,
    fechaMantenimiento: params.fechaMantenimiento,
    densidadSiembra: params.densidadSiembra,
    precria: params.precria,
    metodoAlimentacion: params.metodoAlimentacion,
    proveedorAlimento: params.proveedorAlimento,
    numeroAireadores: params.numeroAireadores,
    tieneAlimentadorAutomatico: params.tieneAlimentadorAutomatico,
  };

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
        tieneAlimentadorAutomatico: estanque.tieneAlimentadorAutomatico,
      },
    });
  }

  if (!estanque.codigo) {
    return (
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
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
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="outline" onPress={volver} style={styles.cancelButton}>
          <View style={styles.inlineButtonContent}>
            <Icon icon={ICONS.exit} size={18} color={COLORS.white} />

            <CustomText
              size={16}
              color={COLORS.white}
              style={styles.cancelText}
            >
              Volver
            </CustomText>
          </View>
        </Button>

        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Icon icon={ICONS.water} size={28} color={COLORS.white} />
          </View>

          <View style={styles.headerTextBox}>
            <Title
              level={3}
              color={COLORS.white}
              fuente={TYPOGRAPHY.fontFamily.bold}
            >
              Detalle Estanque
            </Title>

            <CustomText
              size={14}
              color={COLORS.white}
              style={styles.headerSubtitle}
            >
              {estanque.codigo} - {estanque.finca}
            </CustomText>
          </View>
        </View>
      </View>

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
            label="Numero de aireadores"
            value={estanque.numeroAireadores}
          />
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
