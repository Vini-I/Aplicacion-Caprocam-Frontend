/**
 * ============================================================
 * SCREEN: ALERTAS
 * ============================================================
 *
 * Modulo independiente para ver todas las alertas por prioridad,
 * tipo y categoria.
 */

import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { STYLE } from "../../../theme/style.js";

import { obtenerSiembras } from "../../siembra/services/SiembraService.js";
import useAlimentacion from "../../alimentacion/hooks/useAlimentacion.js";
import { getProductosInventario } from "../../inventarios/services/InventarioService.js";
import { EQUIPOS_MOCK } from "../../mantEquipo/services/mantEquipoService.js";
import { getLecturas } from "../../mantAgua/services/FisicoQuimicaServices.js";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService.js";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService.js";

import {
  agruparAlertasPorTipo,
  construirAlertasOperativas,
  descartarAlerta,
  filtrarAlertasDescartadas,
  obtenerAlertasDescartadas,
} from "../services/AlertasServices.js";

import {
  agruparPorCategoria,
  obtenerColorTipo,
  obtenerEstadoInicialDropdowns,
  obtenerEstiloAlerta,
  obtenerIconoTipo,
  obtenerTituloTipo,
} from "../services/AlertasScreenService.js";

import { styles } from "../styles/AlertasStyle.js";

function ResumenAlertas({ grupos }) {
  return (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Icon icon={ICONS.notification} size={20} color={COLORS.primary} />

        <CustomText size={16} weight="800" color={COLORS.textPrimary}>
          Resumen de alertas
        </CustomText>
      </View>

      <View style={styles.summaryGrid}>
        <ResumenItem
          label="Criticas"
          value={grupos.critica.length}
          color={COLORS.error}
        />

        <ResumenItem
          label="Advertencias"
          value={grupos.advertencia.length}
          color={COLORS.warning}
        />

        <ResumenItem
          label="Informativas"
          value={grupos.info.length}
          color={COLORS.primary}
        />
      </View>
    </Card>
  );
}

function ResumenItem({ label, value, color }) {
  return (
    <View style={styles.summaryItem}>
      <CustomText size={22} weight="900" color={color}>
        {value}
      </CustomText>

      <CustomText
        size={12}
        color={COLORS.textTertiary}
        style={styles.summaryLabel}
      >
        {label}
      </CustomText>
    </View>
  );
}

function DropdownAlertas({
  tipo,
  alertas,
  abierto,
  onToggle,
  onDismiss,
  onPressAlerta,
}) {
  const color = obtenerColorTipo(tipo);
  const categorias = agruparPorCategoria(alertas);
  const nombresCategorias = Object.keys(categorias);
  const chevron = abierto === true ? ICONS.chevronUp : ICONS.chevronDown;

  return (
    <Card style={styles.dropdownCard}>
      <Button
        variant="ghost"
        style={[
          styles.dropdownHeader,
          {
            marginTop: 0,
          },
        ]}
        onPress={onToggle}
      >
        <View style={styles.dropdownIconBox}>
          <Icon icon={obtenerIconoTipo(tipo)} size={20} color={color} />
        </View>

        <View style={styles.dropdownHeaderText}>
          <CustomText
            size={16}
            color={COLORS.textPrimary}
            style={styles.dropdownTitle}
          >
            {obtenerTituloTipo(tipo)}
          </CustomText>

          <CustomText
            size={12}
            color={COLORS.textTertiary}
            style={styles.dropdownSubtitle}
          >
            Separadas por categoria y ordenadas por prioridad
          </CustomText>
        </View>

        <View style={styles.counterBadge}>
          <CustomText size={13} color={color} weight="800">
            {alertas.length}
          </CustomText>
        </View>

        <Icon icon={chevron} size={22} color={COLORS.textTertiary} />
      </Button>

      {abierto === true && (
        <View style={styles.alertList}>
          {alertas.length === 0 && (
            <View style={styles.emptyBox}>
              <CustomText size={13} color={COLORS.textTertiary} align="center">
                No hay alertas en esta categoria.
              </CustomText>
            </View>
          )}

          {nombresCategorias.map(function (categoria) {
            return (
              <View key={categoria}>
                <CustomText
                  size={12}
                  color={COLORS.textTertiary}
                  style={styles.categoryTitle}
                >
                  {categoria}
                </CustomText>

                {categorias[categoria].map(function (alerta) {
                  return (
                    <AlertaItem
                      key={alerta.id}
                      alerta={alerta}
                      onDismiss={onDismiss}
                      onPressAlerta={onPressAlerta}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

function AlertaItem({ alerta, onDismiss, onPressAlerta }) {
  return (
    <View style={obtenerEstiloAlerta(alerta.tipo)}>
      <Button
        variant="ghost"
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginTop: 0,
          paddingHorizontal: 0,
          paddingVertical: 0,
          borderWidth: 0,
        }}
        onPress={() => onPressAlerta(alerta)}
      >
        <View style={styles.alertIconBox}>
          <Icon icon={alerta.icono} size={20} color={alerta.color} />
        </View>

        <View style={styles.alertContent}>
          <CustomText
            size={14}
            color={COLORS.textSecondary}
            style={styles.alertTitle}
          >
            {alerta.titulo}
          </CustomText>

          <CustomText
            size={12}
            color={COLORS.textTertiary}
            style={styles.alertMessage}
          >
            {alerta.mensaje}
          </CustomText>

          {alerta.detalle !== "" && (
            <CustomText
              size={12}
              color={COLORS.textSecondary}
              style={styles.alertDetail}
            >
              {alerta.detalle}
            </CustomText>
          )}
        </View>
      </Button>

      <Button
        variant="ghost"
        style={[
          styles.dismissButton,
          {
            marginTop: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
          },
        ]}
        onPress={() => onDismiss(alerta.id)}
      >
        <Icon icon={ICONS.close} size={16} color={COLORS.textTertiary} />
      </Button>
    </View>
  );
}

export default function AlertasScreen() {
  const router = useRouter();
  const { alimentaciones, recargar } = useAlimentacion();

  const [abiertos, setAbiertos] = useState(obtenerEstadoInicialDropdowns());
  const [descartadas, setDescartadas] = useState([]);
  const [productosInventario, setProductosInventario] = useState([]);
  const [registrosEnfermedades, setRegistrosEnfermedades] = useState([]);
  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);
  const [registrosFisicoQuimicos, setRegistrosFisicoQuimicos] = useState([]);

  useEffect(function () {
    let activo = true;

    async function cargarDatos() {
      let ids = [];
      let productos = [];
      let enfermedades = [];
      let parasitos = [];
      let fisicoQuimicos = [];

      try {
        ids = await obtenerAlertasDescartadas();
      } catch (error) {
        ids = [];
      }

      try {
        productos = await getProductosInventario();
      } catch (error) {
        productos = [];
      }

      try {
        enfermedades = await enfermedadesService.getAll();
      } catch (error) {
        enfermedades = [];
      }

      try {
        parasitos = await parasitologiaService.getAll();
      } catch (error) {
        parasitos = [];
      }

      try {
        fisicoQuimicos = await getLecturas();
      } catch (error) {
        fisicoQuimicos = [];
      }

      if (activo === true) {
        setDescartadas(Array.isArray(ids) ? ids : []);
        setProductosInventario(Array.isArray(productos) ? productos : []);
        setRegistrosEnfermedades(Array.isArray(enfermedades) ? enfermedades : []);
        setRegistrosParasitologia(Array.isArray(parasitos) ? parasitos : []);
        setRegistrosFisicoQuimicos(Array.isArray(fisicoQuimicos) ? fisicoQuimicos : []);
      }
    }

    recargar();
    cargarDatos();

    return function () {
      activo = false;
    };
  }, [recargar]);

  const alertasBase = construirAlertasOperativas({
    productosInventario,
    siembras: obtenerSiembras(),
    alimentaciones,
    equipos: EQUIPOS_MOCK,
    registrosEnfermedades,
    registrosParasitologia,
    registrosFisicoQuimicos,
  });

  const alertas = filtrarAlertasDescartadas(alertasBase, descartadas);
  const grupos = agruparAlertasPorTipo(alertas);

  function cambiarDropdown(tipo) {
    setAbiertos(function (actual) {
      return {
        ...actual,
        [tipo]: !actual[tipo],
      };
    });
  }

  async function descartar(id) {
    const ids = await descartarAlerta(id);
    setDescartadas(Array.isArray(ids) ? ids : []);
  }

  function irAAlerta(alerta) {
    if (!alerta?.modulo) return;

    if (alerta.modulo === "enfermedades") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/registros/EditarEnfermedad",
              params: { id: alerta.registroId },
            }
          : "/registros/Enfermedades",
      );
      return;
    }

    if (alerta.modulo === "parasitologia") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/registros/EditarParasitologia",
              params: { id: alerta.registroId },
            }
          : "/registros/Parasitologia",
      );
      return;
    }

    if (alerta.modulo === "fisicoQuimica") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/registros/EditarFisicoQuimica",
              params: { id: alerta.registroId },
            }
          : "/registros/FisicoQuimica",
      );
      return;
    }

    if (alerta.modulo === "estanques") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/finca/detalleEstanque",
              params: { id: alerta.registroId },
            }
          : "/finca",
      );
      return;
    }

    if (alerta.modulo === "siembra") {
      router.push("/siembra");
      return;
    }

    if (alerta.modulo === "alimentacion") {
      router.push("/registros/Alimentacion");
      return;
    }

    if (alerta.modulo === "inventario") {
      router.push("/inventarios");
      return;
    }

    if (alerta.modulo === "equipos") {
      router.push("/equipos");
    }
  }

  return (
    <>
      <NavbarRegistro
        Titulo="Alertas"
        Subtitulo="Alertas operativas"
        Icono="notification"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          <ResumenAlertas grupos={grupos} />

          <DropdownAlertas
            tipo="critica"
            alertas={grupos.critica}
            abierto={abiertos.critica}
            onToggle={() => cambiarDropdown("critica")}
            onDismiss={descartar}
            onPressAlerta={irAAlerta}
          />

          <DropdownAlertas
            tipo="advertencia"
            alertas={grupos.advertencia}
            abierto={abiertos.advertencia}
            onToggle={() => cambiarDropdown("advertencia")}
            onDismiss={descartar}
            onPressAlerta={irAAlerta}
          />

          <DropdownAlertas
            tipo="info"
            alertas={grupos.info}
            abierto={abiertos.info}
            onToggle={() => cambiarDropdown("info")}
            onDismiss={descartar}
            onPressAlerta={irAAlerta}
          />
        </View>
      </ScrollView>
    </>
  );
}