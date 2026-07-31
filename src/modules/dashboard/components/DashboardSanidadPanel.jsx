/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardSanidadPanel.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 31/07/2026
Modulo: Dashboard
Descripcion:
Renderiza el detalle de casos sanitarios y mortalidad
registrada dentro del Dashboard.
//////////////////////////////////////////////////////////
*/

import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import {
  formatearFechaCorta,
  formatearNumero,
  obtenerCasosSanitarios,
  obtenerMortalidadTotal,
  obtenerRegistrosMortalidad,
  obtenerTextoSeguro,
} from "../utils/DashboardUtils";

import { styles } from "../styles/DashboardStyle";

const VIOLET = COLORS.violet ? COLORS.violet : "#7C3AED";

function SectionHeader({ icon, title, color }) {
  return (
    <View style={styles.sectionHeader}>
      <Icon icon={icon} size={18} color={color} />

      <Title level={6} style={styles.sectionTitle}>
        {title}
      </Title>
    </View>
  );
}

function EmptyMessage({ text }) {
  return (
    <View style={styles.emptyBox}>
      <CustomText size={12} color={COLORS.textTertiary} align="center">
        {text}
      </CustomText>
    </View>
  );
}

function obtenerColorSeveridad(severidad) {
  const texto = obtenerTextoSeguro(severidad).toLowerCase();

  return texto === "alta" || texto === "alto" || texto === "critica"
    ? COLORS.error
    : texto === "media" || texto === "medio"
      ? COLORS.warning
      : texto === "baja" || texto === "bajo"
        ? COLORS.success
        : COLORS.textTertiary;
}

function obtenerEstiloSeveridad(severidad) {
  const texto = obtenerTextoSeguro(severidad).toLowerCase();

  const estilo =
    texto === "alta" || texto === "alto" || texto === "critica"
      ? styles.badgeAlta
      : texto === "media" || texto === "medio"
        ? styles.badgeMedia
        : texto === "baja" || texto === "bajo"
          ? styles.badgeBaja
          : null;

  return [styles.badge, estilo];
}

function obtenerNombreTipo(tipo) {
  return tipo === "parasitologia" ? "Parasitologia" : "Enfermedad";
}

function obtenerColorTipo(tipo) {
  return tipo === "parasitologia" ? VIOLET : COLORS.error;
}

function obtenerEstiloTipo(tipo) {
  return [
    styles.badgeTipo,
    tipo === "parasitologia"
      ? styles.badgeTipoParasitologia
      : styles.badgeTipoEnfermedad,
  ];
}

function obtenerNombreFrecuente(item, tipo) {
  const valor =
    tipo === "enfermedad"
      ? item.enfermedad ?? item.valor
      : item.parasito ?? item.valor;

  return obtenerTextoSeguro(
    item.nombre,
    obtenerTextoSeguro(
      valor,
      tipo === "enfermedad"
        ? "Enfermedad registrada"
        : "Parasito registrado"
    )
  );
}

function obtenerCantidadFrecuente(item) {
  const cantidad = Number(item.casos ?? item.cantidad ?? item.total ?? 0);
  return Number.isFinite(cantidad) ? cantidad : 0;
}

function CasosSanitariosPanel({
  resumenEnfermedades,
  resumenParasitologia,
  registrosEnfermedades,
  registrosParasitologia,
}) {
  const enfermedadesFrecuentes = Array.isArray(
    resumenEnfermedades?.enfermedadesFrecuentes
  )
    ? resumenEnfermedades.enfermedadesFrecuentes
    : [];

  const parasitosFrecuentes = Array.isArray(
    resumenParasitologia?.parasitosFrecuentes
  )
    ? resumenParasitologia.parasitosFrecuentes
    : [];

  const casos = obtenerCasosSanitarios(
    registrosEnfermedades,
    registrosParasitologia
  );

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.shieldAlert}
        title="Casos sanitarios"
        color={COLORS.warning}
      />

      <View style={styles.divider} />

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        CASOS FRECUENTES
      </CustomText>

      {enfermedadesFrecuentes.length === 0 &&
      parasitosFrecuentes.length === 0 ? (
        <EmptyMessage text="No hay casos sanitarios registrados." />
      ) : (
        <>
          {enfermedadesFrecuentes.map(function (item, index) {
            const nombre = obtenerNombreFrecuente(item, "enfermedad");
            const cantidad = obtenerCantidadFrecuente(item);

            return (
              <View
                key={
                  item.id ??
                  `enfermedad-${item.enfermedad ?? item.valor ?? index}`
                }
                style={styles.diseaseRow}
              >
                <View style={styles.diseaseDotRed} />

                <View style={styles.rowContent}>
                  <CustomText
                    size={15}
                    weight="700"
                    color={COLORS.textSecondary}
                    numberOfLines={1}
                  >
                    {nombre}
                  </CustomText>
                </View>

                <CustomText
                  size={15}
                  weight="800"
                  color={COLORS.textSecondary}
                >
                  {cantidad}
                </CustomText>

                <CustomText
                  size={12}
                  color={COLORS.textTertiary}
                  style={styles.caseText}
                >
                  {cantidad === 1 ? "caso" : "casos"}
                </CustomText>
              </View>
            );
          })}

          {parasitosFrecuentes.map(function (item, index) {
            const nombre = obtenerNombreFrecuente(item, "parasito");
            const cantidad = obtenerCantidadFrecuente(item);

            return (
              <View
                key={
                  item.id ??
                  `parasito-${item.parasito ?? item.valor ?? index}`
                }
                style={styles.diseaseRow}
              >
                <View style={styles.diseaseDotViolet} />

                <View style={styles.rowContent}>
                  <CustomText
                    size={15}
                    weight="700"
                    color={COLORS.textSecondary}
                    numberOfLines={1}
                  >
                    {nombre}
                  </CustomText>
                </View>

                <CustomText
                  size={15}
                  weight="800"
                  color={COLORS.textSecondary}
                >
                  {cantidad}
                </CustomText>

                <CustomText
                  size={12}
                  color={COLORS.textTertiary}
                  style={styles.caseText}
                >
                  {cantidad === 1 ? "caso" : "casos"}
                </CustomText>
              </View>
            );
          })}
        </>
      )}

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        ULTIMOS CASOS
      </CustomText>

      {casos.length === 0 ? (
        <EmptyMessage text="Aun no hay registros de enfermedades o parasitologia." />
      ) : (
        casos.map(function (caso, index) {
          const nombre = obtenerTextoSeguro(caso.nombre, "Caso sanitario");
          const finca = obtenerTextoSeguro(caso.finca, "Sin finca");
          const estanque = obtenerTextoSeguro(caso.estanque, "Sin estanque");
          const severidad = obtenerTextoSeguro(caso.severidad);
          const severidadNombre = obtenerTextoSeguro(
            caso.severidadNombre,
            severidad
          );
          const tipo = obtenerTextoSeguro(caso.tipo, "enfermedad");

          return (
            <View
              key={caso.id ?? `caso-sanitario-${index}`}
              style={styles.caseRow}
            >
              <Icon
                icon={ICONS.alertTriangle}
                size={20}
                color={COLORS.warning}
              />

              <View style={styles.rowContent}>
                <CustomText
                  size={15}
                  weight="700"
                  color={COLORS.textSecondary}
                  numberOfLines={1}
                >
                  {nombre}
                </CustomText>

                <CustomText
                  size={12}
                  color={COLORS.textTertiary}
                  style={styles.rowDescription}
                  numberOfLines={1}
                >
                  {estanque} · {finca}
                </CustomText>

                <CustomText size={12} color={COLORS.textQuaternary}>
                  {formatearFechaCorta(caso.fecha)}
                </CustomText>
              </View>

              <View style={styles.caseBadges}>
                <View style={obtenerEstiloTipo(tipo)}>
                  <CustomText
                    size={12}
                    weight="700"
                    color={obtenerColorTipo(tipo)}
                  >
                    {obtenerNombreTipo(tipo)}
                  </CustomText>
                </View>

                <View style={obtenerEstiloSeveridad(severidad)}>
                  <CustomText
                    size={12}
                    weight="700"
                    color={obtenerColorSeveridad(severidad)}
                  >
                    {severidadNombre}
                  </CustomText>
                </View>
              </View>
            </View>
          );
        })
      )}
    </Card>
  );
}

function MortalidadPanel({ resumenEnfermedades, registrosEnfermedades }) {
  const registrosMortalidad =
    obtenerRegistrosMortalidad(registrosEnfermedades);

  const totalMortalidad = obtenerMortalidadTotal(resumenEnfermedades);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.mortality}
        title="Mortalidad registrada"
        color={COLORS.error}
      />

      <View style={styles.divider} />

      <View style={styles.mortalityTotalBox}>
        <Icon icon={ICONS.report} size={34} color={COLORS.error} />

        <View style={styles.totalBoxText}>
          <CustomText size={32} weight="900" color={COLORS.error}>
            {formatearNumero(totalMortalidad)}
          </CustomText>

          <CustomText size={13} color={COLORS.error}>
            individuos totales registrados
          </CustomText>
        </View>
      </View>

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        POR ESTANQUE
      </CustomText>

      {registrosMortalidad.length === 0 ? (
        <EmptyMessage text="No hay mortalidad registrada en enfermedades." />
      ) : (
        registrosMortalidad.map(function (item, index) {
          const estanque = obtenerTextoSeguro(
            item.estanque,
            "Sin estanque"
          );
          const finca = obtenerTextoSeguro(item.finca, "Sin finca");
          const nombre = obtenerTextoSeguro(
            item.nombre,
            "Enfermedad registrada"
          );

          return (
            <View
              key={item.id ?? `mortalidad-${index}`}
              style={styles.mortalityRow}
            >
              <Icon icon={ICONS.shrimp} size={18} color={COLORS.error} />

              <View style={styles.rowContent}>
                <CustomText
                  size={15}
                  weight="700"
                  color={COLORS.textSecondary}
                  numberOfLines={1}
                >
                  {estanque} · {finca}
                </CustomText>

                <CustomText
                  size={12}
                  color={COLORS.textTertiary}
                  style={styles.rowDescription}
                  numberOfLines={1}
                >
                  {nombre} · {formatearFechaCorta(item.fecha)}
                </CustomText>
              </View>

              <View style={styles.rowRight}>
                <CustomText size={17} weight="900" color={COLORS.error}>
                  {formatearNumero(item.mortalidad)}
                </CustomText>

                <CustomText size={11} color={COLORS.textTertiary}>
                  ind.
                </CustomText>
              </View>
            </View>
          );
        })
      )}
    </Card>
  );
}

export default function DashboardSanidadPanel({
  tipo,
  resumenEnfermedades,
  resumenParasitologia,
  registrosEnfermedades,
  registrosParasitologia,
}) {
  return tipo === "mortalidad" ? (
    <MortalidadPanel
      resumenEnfermedades={resumenEnfermedades}
      registrosEnfermedades={registrosEnfermedades}
    />
  ) : (
    <CasosSanitariosPanel
      resumenEnfermedades={resumenEnfermedades}
      resumenParasitologia={resumenParasitologia}
      registrosEnfermedades={registrosEnfermedades}
      registrosParasitologia={registrosParasitologia}
    />
  );
}