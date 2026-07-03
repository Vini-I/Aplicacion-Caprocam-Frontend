/**
 * ============================================================
 * PANTALLA MAREAS
 * ============================================================
 *
 * Modulo visual para consultar mareas del Pacifico de Costa Rica.
 *
 * Funcionalidad:
 * - Muestra estado actual de la marea.
 * - Muestra coeficiente, amanecer y atardecer.
 * - Muestra fase lunar.
 * - Muestra grafica diaria de pleamares y bajamares.
 * - Muestra tabla semanal/mensual de mareas.
 * - Muestra ventanas recomendadas para llenado, recambio,
 *   cosecha y drenaje.
 *
 * Fuente:
 * - Tablademareas.com.
 */

import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import {
  ZONAS_MAREAS_PACIFICO_CR,
  obtenerDatosMareas,
} from "../services/MareasService";

import { styles } from "../styles/MareasStyle";

function convertirAltura(metros, unidad) {
  let valor = metros;

  if (unidad === "ft") {
    valor = metros * 3.28084;
  }

  return valor;
}

function obtenerTextoUnidad(unidad) {
  let texto = "m";

  if (unidad === "ft") {
    texto = "ft";
  }

  return texto;
}

function formatearAltura(metros, unidad) {
  const valor = convertirAltura(metros, unidad);
  const unidadTexto = obtenerTextoUnidad(unidad);

  return `${valor.toFixed(1)} ${unidadTexto}`;
}

function obtenerAlturaMaxima(puntos) {
  let maximo = 1;

  puntos.forEach(function (punto) {
    if (punto.alturaM > maximo) {
      maximo = punto.alturaM;
    }
  });

  return maximo;
}

function obtenerAlturaMinima(puntos) {
  let minimo = 0;

  puntos.forEach(function (punto) {
    if (punto.alturaM < minimo) {
      minimo = punto.alturaM;
    }
  });

  return minimo;
}

function obtenerTopPunto(altura, maximo, minimo) {
  let top = 50;
  const rango = maximo - minimo;

  if (rango > 0) {
    top = 100 - ((altura - minimo) / rango) * 100;
  }

  if (top < 8) {
    top = 8;
  }

  if (top > 82) {
    top = 82;
  }

  return top;
}

function obtenerLeftPunto(index, total) {
  let left = 0;

  if (total > 1) {
    left = (index / (total - 1)) * 92;
  }

  return left;
}

function obtenerEstiloPill(tipo) {
  const estilos = [styles.tidePill];

  if (tipo === "P") {
    estilos.push(styles.tidePillHigh);
  }

  if (tipo === "B") {
    estilos.push(styles.tidePillLow);
  }

  return estilos;
}

function obtenerTextoTipo(tipo) {
  let texto = "B";

  if (tipo === "P") {
    texto = "P";
  }

  return texto;
}

function obtenerColorCoeficiente(coeficiente) {
  let color = styles.coefficientLow;

  if (coeficiente >= 60) {
    color = styles.coefficientMedium;
  }

  if (coeficiente >= 80) {
    color = styles.coefficientHigh;
  }

  return color;
}

function obtenerMareaPorIndice(dia, indice) {
  let marea = null;

  if (dia.mareas[indice] !== undefined) {
    marea = dia.mareas[indice];
  }

  return marea;
}

function ZonaSelector({ zonaSeleccionada, onSeleccionarZona }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.zoneSelector}
    >
      {ZONAS_MAREAS_PACIFICO_CR.map(function (zona) {
        const estilos = [styles.zoneButton];

        if (zonaSeleccionada === zona.id) {
          estilos.push(styles.zoneButtonActive);
        }

        return (
          <Button
            key={zona.id}
            style={estilos}
            onPress={function () {
              onSeleccionarZona(zona.id);
            }}
          >
            <CustomText
              size={12}
              weight="700"
              color={
                zonaSeleccionada === zona.id ? COLORS.white : COLORS.primary
              }
            >
              {zona.nombre}
            </CustomText>
          </Button>
        );
      })}
    </ScrollView>
  );
}

function UnidadSelector({ unidad, onCambiarUnidad }) {
  const estilosMetros = [styles.unitButton];
  const estilosPies = [styles.unitButton];

  if (unidad === "m") {
    estilosMetros.push(styles.unitButtonActive);
  }

  if (unidad === "ft") {
    estilosPies.push(styles.unitButtonActive);
  }

  return (
    <View style={styles.unitSelector}>
      <Button
        style={estilosMetros}
        onPress={function () {
          onCambiarUnidad("m");
        }}
      >
        <CustomText
          size={12}
          weight="700"
          color={unidad === "m" ? COLORS.white : COLORS.textTertiary}
        >
          Metros
        </CustomText>
      </Button>

      <Button
        style={estilosPies}
        onPress={function () {
          onCambiarUnidad("ft");
        }}
      >
        <CustomText
          size={12}
          weight="700"
          color={unidad === "ft" ? COLORS.white : COLORS.textTertiary}
        >
          Pies
        </CustomText>
      </Button>
    </View>
  );
}

function EstadoActualCard({ datos, unidad }) {
  const estado = datos.estadoActual;

  let tendenciaColor = styles.trendDown;

  if (estado.tendencia === "subiendo") {
    tendenciaColor = styles.trendUp;
  }

  return (
    <Card style={styles.statusCard}>
      <View style={styles.cardHeaderRow}>
        <Title level={6} style={styles.darkCardTitle}>
          ESTADO ACTUAL
        </Title>

        <View style={styles.liveBadge}>
          <CustomText size={10} weight="800" color="#FF8A7A">
            EN VIVO
          </CustomText>
        </View>
      </View>

      <View style={styles.portPill}>
        <CustomText size={12} weight="700" color="#60A5FA">
          {datos.zona.nombre} ({datos.zona.subtitulo})
        </CustomText>
      </View>

      <View style={styles.levelRow}>
        <CustomText size={42} weight="900" color={COLORS.white}>
          {formatearAltura(estado.nivelM, unidad)}
        </CustomText>

        <View style={[styles.trendBadge, tendenciaColor]}>
          <CustomText size={13} weight="800" color={COLORS.white}>
            {estado.etiquetaTendencia}
          </CustomText>
        </View>
      </View>

      <View style={styles.darkDivider} />

      <View style={styles.infoLine}>
        <CustomText size={13} color="#A8B3CF">
          Siguiente Marea:
        </CustomText>

        <CustomText size={13} weight="800" color={COLORS.white}>
          {estado.siguienteTipo} {estado.siguienteHora} (
          {formatearAltura(estado.siguienteAlturaM, unidad)})
        </CustomText>
      </View>

      <View style={styles.infoLine}>
        <CustomText size={13} color="#A8B3CF">
          Tiempo restante:
        </CustomText>

        <CustomText size={13} weight="800" color="#22D3EE">
          {estado.tiempoRestante}
        </CustomText>
      </View>
    </Card>
  );
}

function IndicadoresCard({ datos }) {
  const indicador = datos.indicadores;

  return (
    <Card style={styles.statusCard}>
      <Title level={6} style={styles.darkCardTitle}>
        INDICADORES AMBIENTALES
      </Title>

      <View style={styles.indicatorBody}>
        <View style={styles.coefficientCircle}>
          <CustomText size={24} weight="900" color={COLORS.white}>
            {indicador.coeficiente}
          </CustomText>

          <CustomText size={10} color="#A8B3CF">
            COEF.
          </CustomText>
        </View>

        <View style={styles.indicatorTextBox}>
          <CustomText size={16} weight="800" color="#60A5FA">
            {indicador.categoria}
          </CustomText>

          <CustomText size={13} color="#A8B3CF" style={styles.indicatorDesc}>
            {indicador.descripcion}
          </CustomText>
        </View>
      </View>

      <View style={styles.darkDivider} />

      <View style={styles.sunRow}>
        <View style={styles.sunItem}>
          <Icon icon={ICONS.morningSun} size={24} color="#FBBF24" />

          <View style={styles.sunText}>
            <CustomText size={11} color="#A8B3CF">
              AMANECER
            </CustomText>

            <CustomText size={14} weight="800" color={COLORS.white}>
              {indicador.amanecer}
            </CustomText>
          </View>
        </View>

        <View style={styles.sunItem}>
          <Icon icon={ICONS.afternoonSun} size={24} color="#F97316" />

          <View style={styles.sunText}>
            <CustomText size={11} color="#A8B3CF">
              ATARDECER
            </CustomText>

            <CustomText size={14} weight="800" color={COLORS.white}>
              {indicador.atardecer}
            </CustomText>
          </View>
        </View>
      </View>
    </Card>
  );
}

function FaseLunarCard({ datos }) {
  const fase = datos.faseLunar;

  return (
    <Card style={styles.statusCard}>
      <View style={styles.cardHeaderRow}>
        <Title level={6} style={styles.darkCardTitle}>
          FASE LUNAR
        </Title>

        <View style={styles.moonPercentBadge}>
          <CustomText size={11} weight="800" color={COLORS.white}>
            {fase.porcentaje}%
          </CustomText>
        </View>
      </View>

      <View style={styles.moonMainRow}>
        <View style={styles.moonCircle}>
          <CustomText size={34}>🌕</CustomText>
        </View>

        <View style={styles.moonTextBox}>
          <CustomText size={18} weight="900" color={COLORS.white}>
            {fase.nombre}
          </CustomText>

          <CustomText size={12} color="#A8B3CF">
            {fase.fecha}
          </CustomText>
        </View>
      </View>

      <View style={styles.darkDivider} />

      <View style={styles.moonPhasesRow}>
        {fase.proximas.map(function (item) {
          return (
            <View key={item.fecha} style={styles.moonPhaseItem}>
              <CustomText size={20}>🌘</CustomText>

              <CustomText
                size={9}
                color="#A8B3CF"
                align="center"
                numberOfLines={1}
              >
                {item.nombre}
              </CustomText>

              <CustomText size={9} weight="800" color={COLORS.white}>
                {item.fecha}
              </CustomText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function GraficaMareaCard({ datos, unidad }) {
  const puntos = datos.curvaDiaria;
  const maximo = obtenerAlturaMaxima(puntos);
  const minimo = obtenerAlturaMinima(puntos);

  return (
    <Card style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Title level={6} style={styles.darkCardTitle}>
            OLA DE MAREA DIARIA
          </Title>

          <CustomText size={12} color="#A8B3CF">
            Visualización del nivel del agua durante el día.
          </CustomText>
        </View>

        <View style={styles.legendInline}>
          <View style={styles.legendItem}>
            <View style={styles.legendDotCyan} />

            <CustomText size={11} color="#A8B3CF">
              Pleamar
            </CustomText>
          </View>

          <View style={styles.legendItem}>
            <View style={styles.legendDotRed} />

            <CustomText size={11} color="#A8B3CF">
              Bajamar
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.waveChart}>
        <View style={styles.chartGridLineTop} />
        <View style={styles.chartGridLineMiddle} />
        <View style={styles.chartGridLineBottom} />

        {puntos.map(function (punto, index) {
          const left = obtenerLeftPunto(index, puntos.length);
          const top = obtenerTopPunto(punto.alturaM, maximo, minimo);

          const pointStyles = [styles.wavePoint];

          if (punto.tipo === "B") {
            pointStyles.push(styles.wavePointLow);
          }

          if (punto.tipo === "P") {
            pointStyles.push(styles.wavePointHigh);
          }

          return (
            <View
              key={`${punto.hora}-${index}`}
              style={[
                styles.wavePointBox,
                {
                  left: `${left}%`,
                  top: `${top}%`,
                },
              ]}
            >
              <CustomText
                size={10}
                weight="800"
                color={COLORS.white}
                align="center"
                style={styles.waveLabel}
              >
                {punto.hora} ({formatearAltura(punto.alturaM, unidad)})
              </CustomText>

              <View style={pointStyles} />
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function MareaCell({ marea, unidad }) {
  if (marea === null) {
    return (
      <View style={styles.tableTideCell}>
        <CustomText size={12} color="#A8B3CF">
          -
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.tableTideCell}>
      <View style={obtenerEstiloPill(marea.tipo)}>
        <CustomText size={10} weight="900" color={COLORS.white}>
          {obtenerTextoTipo(marea.tipo)}
        </CustomText>
      </View>

      <CustomText size={12} weight="800" color={COLORS.white}>
        {marea.hora}
      </CustomText>

      <CustomText size={11} color="#A8B3CF">
        ({formatearAltura(marea.alturaM, unidad)})
      </CustomText>
    </View>
  );
}

function TablaMareasCard({ datos, unidad }) {
  return (
    <Card style={styles.tableCard}>
      <View style={styles.tableHeaderTop}>
        <View>
          <Title level={6} style={styles.darkCardTitle}>
            TABLA DE MAREAS
          </Title>

          <CustomText size={12} color="#A8B3CF">
            Pronóstico de mareas y coeficientes.
          </CustomText>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <CustomText
              size={11}
              weight="800"
              color="#A8B3CF"
              style={styles.dayCell}
            >
              DÍA
            </CustomText>

            <CustomText
              size={11}
              weight="800"
              color="#A8B3CF"
              style={styles.tideColumn}
            >
              1° MAREA
            </CustomText>

            <CustomText
              size={11}
              weight="800"
              color="#A8B3CF"
              style={styles.tideColumn}
            >
              2° MAREA
            </CustomText>

            <CustomText
              size={11}
              weight="800"
              color="#A8B3CF"
              style={styles.tideColumn}
            >
              3° MAREA
            </CustomText>

            <CustomText
              size={11}
              weight="800"
              color="#A8B3CF"
              style={styles.tideColumn}
            >
              4° MAREA
            </CustomText>

            <CustomText
              size={11}
              weight="800"
              color="#A8B3CF"
              style={styles.coefCell}
            >
              COEF.
            </CustomText>

            <CustomText
              size={11}
              weight="800"
              color="#A8B3CF"
              style={styles.sunCell}
            >
              AMANECER / OCASO
            </CustomText>
          </View>

          {datos.tablaMensual.map(function (dia) {
            const mareaUno = obtenerMareaPorIndice(dia, 0);
            const mareaDos = obtenerMareaPorIndice(dia, 1);
            const mareaTres = obtenerMareaPorIndice(dia, 2);
            const mareaCuatro = obtenerMareaPorIndice(dia, 3);
            const coefStyles = [
              styles.coefficientBadge,
              obtenerColorCoeficiente(dia.coeficiente),
            ];

            return (
              <View key={`${dia.dia}-${dia.mes}`} style={styles.tableRow}>
                <View style={styles.dayCell}>
                  <CustomText size={13} weight="900" color={COLORS.white}>
                    {dia.dia}
                  </CustomText>

                  <CustomText size={11} color="#A8B3CF">
                    {dia.diaSemana}
                  </CustomText>
                </View>

                <MareaCell marea={mareaUno} unidad={unidad} />

                <MareaCell marea={mareaDos} unidad={unidad} />

                <MareaCell marea={mareaTres} unidad={unidad} />

                <MareaCell marea={mareaCuatro} unidad={unidad} />

                <View style={styles.coefCell}>
                  <View style={coefStyles}>
                    <CustomText size={11} weight="900" color={COLORS.white}>
                      {dia.coeficiente}
                    </CustomText>
                  </View>
                </View>

                <View style={styles.sunCell}>
                  <CustomText size={11} color="#A8B3CF">
                    🌅 {dia.amanecer} / 🌆 {dia.atardecer}
                  </CustomText>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
}

function VentanaItem({ item, tipo, unidad }) {
  const containerStyles = [styles.windowItem];

  if (tipo === "llenado") {
    containerStyles.push(styles.windowFill);
  }

  if (tipo === "cosecha") {
    containerStyles.push(styles.windowDrain);
  }

  return (
    <View style={containerStyles}>
      <View>
        <CustomText size={15} weight="900" color={COLORS.white}>
          {item.inicio} - {item.fin}
        </CustomText>
      </View>

      <View style={styles.windowRightText}>
        <CustomText size={12} color="#A8B3CF" align="right">
          {item.detalle}
        </CustomText>

        <CustomText size={13} weight="900" color={COLORS.white} align="right">
          Nivel: {formatearAltura(item.nivel, unidad)}
        </CustomText>
      </View>
    </View>
  );
}

function VentanasOperativasCard({ datos, unidad }) {
  return (
    <View>
      <View style={styles.windowsGrid}>
        <Card style={styles.windowCard}>
          <Title level={6} style={styles.darkCardTitle}>
            Ventana de Llenado / Recambio
          </Title>

          <CustomText size={12} color="#A8B3CF" style={styles.windowSubtitle}>
            Operación óptima por gravedad.
          </CustomText>

          <View style={styles.darkDivider} />

          {datos.ventanas.llenado.map(function (item) {
            return (
              <VentanaItem
                key={item.id}
                item={item}
                tipo="llenado"
                unidad={unidad}
              />
            );
          })}
        </Card>

        <Card style={styles.windowCard}>
          <Title level={6} style={styles.darkCardTitle}>
            Ventana de Cosecha / Drenaje
          </Title>

          <CustomText size={12} color="#A8B3CF" style={styles.windowSubtitle}>
            Vaciado óptimo de estanques.
          </CustomText>

          <View style={styles.darkDivider} />

          {datos.ventanas.cosecha.map(function (item) {
            return (
              <VentanaItem
                key={item.id}
                item={item}
                tipo="cosecha"
                unidad={unidad}
              />
            );
          })}
        </Card>
      </View>

      <Card style={styles.navigationCard}>
        <View style={styles.navigationAccent} />

        <View style={styles.navigationContent}>
          <CustomText size={24}>🛶</CustomText>

          <View style={styles.navigationTextBox}>
            <CustomText size={15} weight="900" color={COLORS.white}>
              Navegación en canales y esteros
            </CustomText>

            <CustomText size={13} color="#A8B3CF">
              {datos.ventanas.navegacion.estado}.{" "}
              {datos.ventanas.navegacion.descripcion}
            </CustomText>
          </View>
        </View>
      </Card>
    </View>
  );
}

export default function MareasScreen() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState("puntarenas");
  const [unidad, setUnidad] = useState("ft");
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargarDatos() {
    setCargando(true);

    const respuesta = await obtenerDatosMareas(zonaSeleccionada);

    setDatos(respuesta);
    setCargando(false);
  }

  useEffect(
    function () {
      cargarDatos();
    },
    [zonaSeleccionada],
  );

  let fuenteTexto = "";

  if (datos !== null) {
    fuenteTexto = `Fuente: ${datos.fuente}`;

    if (datos.modoRespaldo === true) {
      fuenteTexto = "Fuente: Tablademareas.com · modo respaldo local";
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <CustomText size={24}>🌊</CustomText>
            </View>

            <View>
              <CustomText size={24} weight="900" color={COLORS.white}>
                MareasNicoya
              </CustomText>

              <CustomText
                size={10}
                color="#A8B3CF"
                style={styles.brandSubtitle}
              >
                CAMARONICULTURA INTELIGENTE
              </CustomText>
            </View>
          </View>

          <UnidadSelector unidad={unidad} onCambiarUnidad={setUnidad} />
        </View>

        <ZonaSelector
          zonaSeleccionada={zonaSeleccionada}
          onSeleccionarZona={setZonaSeleccionada}
        />

        {cargando === true && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#22D3EE" />

            <CustomText size={13} color="#A8B3CF" style={styles.loadingText}>
              Cargando mareas...
            </CustomText>
          </View>
        )}

        {datos !== null && cargando === false && (
          <View>
            <View style={styles.sourceRow}>
              <CustomText size={11} color="#A8B3CF">
                {fuenteTexto}
              </CustomText>

              <Button style={styles.refreshButton} onPress={cargarDatos}>
                <Icon icon={ICONS.update} size={16} color={COLORS.white} />
              </Button>
            </View>

            <View style={styles.summaryGrid}>
              <EstadoActualCard datos={datos} unidad={unidad} />

              <IndicadoresCard datos={datos} />

              <FaseLunarCard datos={datos} />
            </View>

            <GraficaMareaCard datos={datos} unidad={unidad} />

            <TablaMareasCard datos={datos} unidad={unidad} />

            <VentanasOperativasCard datos={datos} unidad={unidad} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
