/**
 * ============================================================
 * PANTALLA DASHBOARD GENERAL
 * ============================================================
 *
 * Dashboard principal de Caprocam.
 *
 * Este archivo trabaja con la informacion existente en los modulos
 * del proyecto:
 *
 * - Fincas
 * - Estanques
 * - Siembras
 * - Alimentacion
 * - Fisico-Quimica
 *
 * Tambien corrige el grafico de fincas para que las barras y
 * nombres no se salgan del cuadro.
 */

import React, { useEffect, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import { fincas as fincasModulo } from "../../finca/screens/FincaData";
import { estanques as estanquesModulo } from "../../mantCrecimiento/screens/EstanqueData";
import { obtenerSiembras } from "../../siembra/services/SiembraService";
import { obtenerLecturas } from "../../mantAgua/services/FisicoQuimicaServices";
import useAlimentacion from "../../alimentacion/hooks/useAlimentacion";

import { styles } from "../styles/DashboardStyle";

function obtenerTextoSeguro(valor, respaldo) {
  let texto = respaldo;

  if (valor !== undefined && valor !== null && valor !== "") {
    texto = String(valor);
  }

  return texto;
}

function obtenerNumeroSeguro(valor) {
  let numero = 0;

  if (valor !== undefined && valor !== null && valor !== "") {
    const texto = String(valor).replace(",", ".");
    const numeroConvertido = Number(texto);

    if (Number.isNaN(numeroConvertido) === false) {
      numero = numeroConvertido;
    }
  }

  return numero;
}

function convertirFecha(fechaTexto) {
  let fecha = null;

  if (fechaTexto instanceof Date) {
    fecha = fechaTexto;
  }

  if (fecha === null && typeof fechaTexto === "string") {
    if (fechaTexto.includes("/")) {
      const partes = fechaTexto.split("/");

      if (partes.length === 3) {
        const dia = Number(partes[0]);
        const mes = Number(partes[1]) - 1;
        const anio = Number(partes[2]);

        fecha = new Date(anio, mes, dia);
      }
    }

    if (fechaTexto.includes("-")) {
      fecha = new Date(fechaTexto);
    }
  }

  if (fecha === null) {
    fecha = new Date();
  }

  return fecha;
}

function formatearFechaCorta(fechaTexto) {
  const fecha = convertirFecha(fechaTexto);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function obtenerDiaSemana(fechaTexto) {
  const fecha = convertirFecha(fechaTexto);

  const dias = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  return dias[fecha.getDay()];
}

function obtenerFincasDashboard() {
  const fincas = [];

  fincasModulo.forEach(function (finca) {
    fincas.push({
      id: finca.codigoInterno,
      nombre: finca.nombre,
      ubicacion: `${finca.canton}, ${finca.provincia}`,
      area: finca.areaTotal,
      estanques: finca.estanques,
    });
  });

  estanquesModulo.forEach(function (estanque) {
    let existe = false;

    fincas.forEach(function (finca) {
      if (finca.nombre === estanque.fincaNombre) {
        existe = true;
      }
    });

    if (existe === false) {
      fincas.push({
        id: `finca-estanque-${estanque.fincaId}`,
        nombre: estanque.fincaNombre,
        ubicacion: "Registrada en crecimiento",
        area: 0,
        estanques: 0,
      });
    }
  });

  return fincas;
}

function contarEstanquesPorFinca(nombreFinca) {
  let total = 0;

  estanquesModulo.forEach(function (estanque) {
    if (estanque.fincaNombre === nombreFinca) {
      total = total + 1;
    }
  });

  return total;
}

function obtenerCantidadEstanques() {
  return estanquesModulo.length;
}

function obtenerCantidadFincas() {
  return obtenerFincasDashboard().length;
}

function obtenerEstanquesActivos() {
  let total = 0;

  estanquesModulo.forEach(function (estanque) {
    if (estanque.estado === "activo") {
      total = total + 1;
    }
  });

  return total;
}

function obtenerEstanquesCosechados() {
  let total = 0;

  estanquesModulo.forEach(function (estanque) {
    if (estanque.estado === "cosechado") {
      total = total + 1;
    }
  });

  return total;
}

function obtenerTotalSembrado(siembras) {
  let total = 0;

  siembras.forEach(function (siembra) {
    total = total + obtenerNumeroSeguro(siembra.cantidadSembrada);
  });

  return total;
}

function obtenerKgAlimentacion(alimentaciones) {
  let total = 0;

  alimentaciones.forEach(function (registro) {
    total = total + obtenerNumeroSeguro(registro.cantidadKg);
  });

  return total;
}

function obtenerAlimentacionSemanal(alimentaciones) {
  const dias = [
    {
      id: 1,
      dia: "Lun",
      kg: 0,
    },
    {
      id: 2,
      dia: "Mar",
      kg: 0,
    },
    {
      id: 3,
      dia: "Mie",
      kg: 0,
    },
    {
      id: 4,
      dia: "Jue",
      kg: 0,
    },
    {
      id: 5,
      dia: "Vie",
      kg: 0,
    },
    {
      id: 6,
      dia: "Sab",
      kg: 0,
    },
    {
      id: 7,
      dia: "Dom",
      kg: 0,
    },
  ];

  alimentaciones.forEach(function (registro) {
    const diaRegistro = obtenerDiaSemana(registro.fecha);

    dias.forEach(function (dia) {
      if (dia.dia === diaRegistro) {
        dia.kg = dia.kg + obtenerNumeroSeguro(registro.cantidadKg);
      }
    });
  });

  return dias;
}

function obtenerMayorKgSemanal(alimentacionSemanal) {
  let mayor = 1;

  alimentacionSemanal.forEach(function (item) {
    if (obtenerNumeroSeguro(item.kg) > mayor) {
      mayor = obtenerNumeroSeguro(item.kg);
    }
  });

  return mayor;
}

function obtenerPorcentajeAlimentacion(kg, mayorKg) {
  let porcentaje = 0;

  if (mayorKg > 0) {
    porcentaje = (obtenerNumeroSeguro(kg) / obtenerNumeroSeguro(mayorKg)) * 100;
  }

  if (porcentaje > 100) {
    porcentaje = 100;
  }

  return porcentaje;
}

function obtenerMayorEstanquesFinca(fincas) {
  let mayor = 1;

  fincas.forEach(function (finca) {
    let totalEstanques = contarEstanquesPorFinca(finca.nombre);

    if (totalEstanques === 0) {
      totalEstanques = finca.estanques;
    }

    if (obtenerNumeroSeguro(totalEstanques) > mayor) {
      mayor = obtenerNumeroSeguro(totalEstanques);
    }
  });

  return mayor;
}

function obtenerPorcentajeEstanques(totalEstanques, mayorEstanques) {
  let porcentaje = 0;

  if (mayorEstanques > 0) {
    porcentaje =
      (obtenerNumeroSeguro(totalEstanques) /
        obtenerNumeroSeguro(mayorEstanques)) *
      100;
  }

  if (porcentaje > 100) {
    porcentaje = 100;
  }

  return porcentaje;
}

function obtenerUltimosRegistros(
  alimentaciones,
  siembras,
  lecturasFisicoQuimica,
) {
  const registros = [];

  alimentaciones.forEach(function (registro) {
    registros.push({
      id: `alimentacion-${registro.id}`,
      modulo: "Alimentacion",
      detalle: `${obtenerTextoSeguro(
        registro.estanque,
        "Sin estanque",
      )} · ${obtenerTextoSeguro(registro.finca, "Sin finca")}`,
      fechaVisible: obtenerTextoSeguro(
        registro.hora,
        formatearFechaCorta(registro.fecha),
      ),
      fechaOrden: convertirFecha(registro.timestamp).getTime(),
    });
  });

  siembras.forEach(function (siembra) {
    registros.push({
      id: `siembra-${siembra.siembraId}`,
      modulo: "Siembra",
      detalle: `${siembra.estanque} · ${siembra.finca}`,
      fechaVisible: siembra.fechaSiembra,
      fechaOrden: convertirFecha(siembra.fechaSiembra).getTime(),
    });
  });

  lecturasFisicoQuimica.forEach(function (lectura, index) {
    registros.push({
      id: `fisicoquimica-${index}`,
      modulo: "Fisico-Quimica",
      detalle: obtenerTextoSeguro(lectura.estanque, "Lectura registrada"),
      fechaVisible: formatearFechaCorta(lectura.fecha),
      fechaOrden: convertirFecha(lectura.fecha).getTime(),
    });
  });

  registros.sort(function (a, b) {
    return b.fechaOrden - a.fechaOrden;
  });

  return registros.slice(0, 5);
}

function obtenerColorEstado(estado) {
  let color = COLORS.textTertiary;
  const textoEstado = obtenerTextoSeguro(estado, "").toLowerCase();

  if (textoEstado === "activo") {
    color = COLORS.primary;
  }

  if (textoEstado === "cosechado") {
    color = COLORS.textTertiary;
  }

  if (textoEstado.includes("prepar") === true) {
    color = COLORS.warning;
  }

  return color;
}

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

function StatCard({
  id,
  selectedId,
  onPress,
  icon,
  value,
  label,
  cardStyle,
  iconStyle,
  iconColor,
  danger,
  isTablet,
}) {
  const cardStyles = [styles.statCard, cardStyle];

  if (isTablet === true) {
    cardStyles.push(styles.statCardTablet);
  }

  if (selectedId === id) {
    cardStyles.push(styles.statCardActive);
  }

  const iconBoxStyles = [styles.statIconBox, iconStyle];
  const valueStyles = [styles.statValue];

  if (danger === true) {
    valueStyles.push(styles.statValueDanger);
  }

  let chevronIcon = ICONS.chevronDown;

  if (selectedId === id) {
    chevronIcon = ICONS.chevronUp;
  }

  return (
    <Button style={cardStyles} onPress={onPress}>
      <View style={styles.statTopRow}>
        <View style={iconBoxStyles}>
          <Icon icon={icon} size={22} color={iconColor} />
        </View>

        <Icon icon={chevronIcon} size={20} color={COLORS.textQuaternary} />
      </View>

      <View>
        <CustomText style={valueStyles}>{value}</CustomText>

        <CustomText
          size={13}
          color={COLORS.textTertiary}
          style={styles.statLabel}
          numberOfLines={1}
        >
          {label}
        </CustomText>
      </View>
    </Button>
  );
}

function FincasPanel({ fincas }) {
  const mayorEstanques = obtenerMayorEstanquesFinca(fincas);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.home}
        title="Fincas registradas"
        color={COLORS.primary}
      />

      <View style={styles.divider} />

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        ESTANQUES POR FINCA
      </CustomText>

      <View style={styles.barChart}>
        <View style={styles.chartGridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>

        <View style={styles.barChartContent}>
          {fincas.map(function (finca) {
            let totalEstanques = contarEstanquesPorFinca(finca.nombre);

            if (totalEstanques === 0) {
              totalEstanques = finca.estanques;
            }

            const porcentaje = obtenerPorcentajeEstanques(
              totalEstanques,
              mayorEstanques,
            );

            return (
              <View key={finca.id} style={styles.barItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${porcentaje}%`,
                      },
                    ]}
                  />
                </View>

                <CustomText
                  size={10}
                  color={COLORS.textTertiary}
                  align="center"
                  numberOfLines={1}
                  style={styles.barLabel}
                >
                  {finca.nombre}
                </CustomText>
              </View>
            );
          })}
        </View>
      </View>

      {fincas.map(function (finca) {
        let totalEstanques = contarEstanquesPorFinca(finca.nombre);

        if (totalEstanques === 0) {
          totalEstanques = finca.estanques;
        }

        return (
          <View key={finca.id} style={styles.infoRowBlue}>
            <View style={styles.rowIconBoxBlue}>
              <Icon icon={ICONS.home} size={20} color={COLORS.primary} />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {finca.nombre}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                numberOfLines={1}
                style={styles.rowDescription}
              >
                {finca.ubicacion} · {finca.area} ha
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <CustomText size={18} weight="800" color={COLORS.primary}>
                {totalEstanques}
              </CustomText>

              <CustomText size={11} color={COLORS.textTertiary}>
                estanques
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function EstanquesPanel({ alimentacionSemanal }) {
  const activos = obtenerEstanquesActivos();
  const cosechados = obtenerEstanquesCosechados();
  const mayorKg = obtenerMayorKgSemanal(alimentacionSemanal);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.waterFlow}
        title="Estanques registrados"
        color="#2563EB"
      />

      <View style={styles.divider} />

      <View style={styles.twoColumns}>
        <View style={styles.chartColumn}>
          <CustomText
            size={13}
            color={COLORS.textTertiary}
            align="center"
            style={styles.panelSubtitle}
          >
            ESTADO
          </CustomText>

          <View style={styles.donut}>
            <View style={styles.donutInner} />
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendBlue} />

              <CustomText size={11} color={COLORS.textTertiary}>
                Activo: {activos}
              </CustomText>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendGray} />

              <CustomText size={11} color={COLORS.textTertiary}>
                Cosechado: {cosechados}
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.chartColumn}>
          <CustomText
            size={13}
            color={COLORS.textTertiary}
            align="center"
            style={styles.panelSubtitle}
          >
            ALIMENTACION SEMANAL KG
          </CustomText>

          <View style={styles.lineChart}>
            <View style={styles.chartGridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            <View style={styles.lineBars}>
              {alimentacionSemanal.map(function (item) {
                return (
                  <View key={item.id} style={styles.lineItem}>
                    <View
                      style={[
                        styles.lineBar,
                        {
                          height: `${obtenerPorcentajeAlimentacion(
                            item.kg,
                            mayorKg,
                          )}%`,
                        },
                      ]}
                    />

                    <CustomText
                      size={10}
                      color={COLORS.textTertiary}
                      align="center"
                    >
                      {item.dia}
                    </CustomText>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {estanquesModulo.map(function (estanque) {
        return (
          <View key={estanque.id} style={styles.infoRowIndigo}>
            <View style={styles.rowIconBoxIndigo}>
              <Icon icon={ICONS.waterFlow} size={20} color="#2563EB" />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {estanque.codigo}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {estanque.fincaNombre} · {estanque.area} ha
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <View style={styles.estadoBadge}>
                <CustomText
                  size={11}
                  color={obtenerColorEstado(estanque.estado)}
                  weight="700"
                >
                  {estanque.estado}
                </CustomText>
              </View>

              <CustomText size={11} color={COLORS.textTertiary}>
                {estanque.diasCultivo}d
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function ProduccionPanel({ siembras }) {
  const totalSembrado = obtenerTotalSembrado(siembras);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.shrimp}
        title="Produccion y siembras"
        color={COLORS.warning}
      />

      <View style={styles.divider} />

      <View style={styles.productionTotalBox}>
        <Icon icon={ICONS.shrimp} size={34} color={COLORS.warning} />

        <View style={styles.totalBoxText}>
          <CustomText size={30} weight="900" color={COLORS.warning}>
            {totalSembrado}
          </CustomText>

          <CustomText size={13} color={COLORS.textTertiary}>
            camarones sembrados registrados
          </CustomText>
        </View>
      </View>

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        SIEMBRAS REGISTRADAS
      </CustomText>

      {siembras.map(function (siembra) {
        return (
          <View key={siembra.siembraId} style={styles.caseRow}>
            <Icon icon={ICONS.shrimp} size={20} color={COLORS.warning} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {siembra.estanque} · {siembra.finca}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {siembra.especie} · {siembra.fechaSiembra}
              </CustomText>

              <CustomText size={12} color={COLORS.textQuaternary}>
                {siembra.produccionEstimada}
              </CustomText>
            </View>

            <View style={[styles.badge, styles.badgeMedia]}>
              <CustomText size={12} weight="700" color={COLORS.warning}>
                {siembra.estado}
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function AlimentacionPanel({ alimentaciones }) {
  const totalKg = obtenerKgAlimentacion(alimentaciones);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.food}
        title="Alimentacion registrada"
        color="#FF002A"
      />

      <View style={styles.divider} />

      <View style={styles.feedTotalBox}>
        <Icon icon={ICONS.weight} size={34} color="#FF5A6D" />

        <View style={styles.totalBoxText}>
          <CustomText size={32} weight="900" color="#FF002A">
            {totalKg}
          </CustomText>

          <CustomText size={13} color="#FF5A6D">
            kg suministrados en registros guardados
          </CustomText>
        </View>
      </View>

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        ULTIMAS ALIMENTACIONES
      </CustomText>

      {alimentaciones.map(function (item) {
        return (
          <View key={item.id} style={styles.feedRow}>
            <Icon icon={ICONS.food} size={18} color="#FF5A6D" />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {obtenerTextoSeguro(item.estanque, "Sin estanque")}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {obtenerTextoSeguro(item.finca, "Sin finca")} ·{" "}
                {formatearFechaCorta(item.fecha)}
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <CustomText size={17} weight="900" color="#FF002A">
                {obtenerTextoSeguro(item.cantidadKg, 0)}
              </CustomText>

              <CustomText size={11} color={COLORS.textTertiary}>
                kg
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function UltimosRegistros({ registros }) {
  return (
    <Card style={styles.detailCard}>
      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        ULTIMOS REGISTROS
      </CustomText>

      {registros.map(function (item) {
        return (
          <View key={item.id} style={styles.recordRow}>
            <View style={styles.recordIconBox}>
              <Icon
                icon={ICONS.clipboard}
                size={20}
                color={COLORS.textTertiary}
              />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.modulo}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {item.detalle}
              </CustomText>
            </View>

            <CustomText size={12} color={COLORS.textTertiary}>
              {item.fechaVisible}
            </CustomText>
          </View>
        );
      })}
    </Card>
  );
}

export default function DashboardScreen() {
  const [selectedCard, setSelectedCard] = useState("fincas");
  const [lecturasFisicoQuimica, setLecturasFisicoQuimica] = useState([]);

  const { alimentaciones } = useAlimentacion();

  const dimensiones = useWindowDimensions();

  const fincasDashboard = obtenerFincasDashboard();
  const siembras = obtenerSiembras();
  const alimentacionSemanal = obtenerAlimentacionSemanal(alimentaciones);

  const ultimosRegistros = obtenerUltimosRegistros(
    alimentaciones,
    siembras,
    lecturasFisicoQuimica,
  );

  let isTablet = false;

  if (dimensiones.width >= 720) {
    isTablet = true;
  }

  const gridStyles = [styles.statsGrid];

  if (isTablet === true) {
    gridStyles.push(styles.statsGridTablet);
  }

  useEffect(function () {
    let activo = true;

    async function cargarLecturas() {
      const datos = await obtenerLecturas();

      if (activo === true) {
        setLecturasFisicoQuimica(datos);
      }
    }

    cargarLecturas();

    return function () {
      activo = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <View style={styles.headerIconBox}>
            <Icon icon={ICONS.dashboard} size={24} color={COLORS.primary} />
          </View>

          <View style={styles.headerTextBox}>
            <Title level={5} style={styles.headerTitle}>
              Dashboard general
            </Title>

            <CustomText
              size={12}
              color={COLORS.textTertiary}
              style={styles.headerSubtitle}
              numberOfLines={1}
            >
              Resumen operativo y sanitario
            </CustomText>
          </View>
        </View>

        <View style={gridStyles}>
          <StatCard
            id="fincas"
            selectedId={selectedCard}
            onPress={function () {
              setSelectedCard("fincas");
            }}
            icon={ICONS.home}
            value={obtenerCantidadFincas()}
            label="Fincas registradas"
            cardStyle={styles.cardBlue}
            iconStyle={styles.iconBlue}
            iconColor={COLORS.primary}
            isTablet={isTablet}
          />

          <StatCard
            id="estanques"
            selectedId={selectedCard}
            onPress={function () {
              setSelectedCard("estanques");
            }}
            icon={ICONS.waterFlow}
            value={obtenerCantidadEstanques()}
            label="Estanques registrados"
            cardStyle={styles.cardIndigo}
            iconStyle={styles.iconIndigo}
            iconColor="#2563EB"
            isTablet={isTablet}
          />

          <StatCard
            id="siembras"
            selectedId={selectedCard}
            onPress={function () {
              setSelectedCard("siembras");
            }}
            icon={ICONS.shrimp}
            value={siembras.length}
            label="Siembras registradas"
            cardStyle={styles.cardYellow}
            iconStyle={styles.iconYellow}
            iconColor={COLORS.warning}
            isTablet={isTablet}
          />

          <StatCard
            id="alimentacion"
            selectedId={selectedCard}
            onPress={function () {
              setSelectedCard("alimentacion");
            }}
            icon={ICONS.food}
            value={obtenerKgAlimentacion(alimentaciones)}
            label="Kg alimentacion"
            cardStyle={styles.cardRed}
            iconStyle={styles.iconRed}
            iconColor="#FF002A"
            danger={true}
            isTablet={isTablet}
          />
        </View>

        {selectedCard === "fincas" && <FincasPanel fincas={fincasDashboard} />}

        {selectedCard === "estanques" && (
          <EstanquesPanel alimentacionSemanal={alimentacionSemanal} />
        )}

        {selectedCard === "siembras" && <ProduccionPanel siembras={siembras} />}

        {selectedCard === "alimentacion" && (
          <AlimentacionPanel alimentaciones={alimentaciones} />
        )}

        <UltimosRegistros registros={ultimosRegistros} />
      </ScrollView>
    </SafeAreaView>
  );
}