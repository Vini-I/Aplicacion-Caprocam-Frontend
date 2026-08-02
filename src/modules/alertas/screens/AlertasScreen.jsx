/**
 * ============================================================
 * SCREEN: ALERTAS
 * ============================================================
 *
 * Modulo independiente para ver todas las alertas por prioridad,
 * tipo y categoria.
 */

import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import Card from "../../../shared/components/Card";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

import { fincas as fincasModulo } from "../../finca/screens/FincaData";
import { estanques as estanquesModulo } from "../../mantCrecimiento/services/EstanqueData";
import { obtenerSiembras } from "../../siembra/services/SiembraService";
import useAlimentacion from "../../alimentacion/hooks/useAlimentacion";
import { getProductosInventario } from "../../inventarios/services/InventarioService";
import { EQUIPOS_MOCK } from "../../mantEquipo/services/mantEquipoService";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService";

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

import { styles } from "../styles/AlertasStyle";

function ResumenAlertas({ grupos }) {
  return (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryRow}>
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
          label="Info"
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
      <CustomText size={22} color={color} style={styles.summaryValue}>
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

function DropdownAlertas({ tipo, alertas, abierto, onToggle, onDismiss }) {
  const color = obtenerColorTipo(tipo);
  const categorias = agruparPorCategoria(alertas);
  const nombresCategorias = Object.keys(categorias);
  let chevron = ICONS.chevronDown;

  if (abierto === true) {
    chevron = ICONS.chevronUp;
  }

  return (
    <Card style={styles.dropdownCard}>
      <Pressable style={styles.dropdownHeader} onPress={onToggle}>
        <View
          style={[styles.dropdownIconBox, { backgroundColor: COLORS.surface }]}
        >
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
      </Pressable>

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

function AlertaItem({ alerta, onDismiss }) {
  return (
    <View style={obtenerEstiloAlerta(alerta.tipo)}>
      <View style={styles.alertIconBox}>
        <Icon icon={alerta.icono} size={18} color={alerta.color} />
      </View>

      <View style={styles.alertContent}>
        <View style={styles.alertTitleRow}>
          <CustomText
            size={14}
            color={COLORS.textSecondary}
            style={styles.alertTitle}
          >
            {alerta.titulo}
          </CustomText>

          <Pressable
            style={styles.dismissButton}
            onPress={function () {
              onDismiss(alerta.id);
            }}
          >
            <Icon icon={ICONS.close} size={16} color={COLORS.textTertiary} />
          </Pressable>
        </View>

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
    </View>
  );
}

export default function AlertasScreen() {
  const { alimentaciones, recargar } = useAlimentacion();

  const [abiertos, setAbiertos] = useState(obtenerEstadoInicialDropdowns());
  const [descartadas, setDescartadas] = useState([]);
  const [productosInventario, setProductosInventario] = useState([]);
  const [registrosEnfermedades, setRegistrosEnfermedades] = useState([]);
  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);

  useEffect(function () {
    let activo = true;

    async function cargarDatos() {
      let ids = [];
      let productos = [];
      let enfermedades = [];
      let parasitos = [];

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

      if (activo === true) {
        setDescartadas(Array.isArray(ids) ? ids : []);
        setProductosInventario(Array.isArray(productos) ? productos : []);
        setRegistrosEnfermedades(
          Array.isArray(enfermedades) ? enfermedades : [],
        );
        setRegistrosParasitologia(Array.isArray(parasitos) ? parasitos : []);
      }
    }

    recargar();
    cargarDatos();

    return function () {
      activo = false;
    };
  }, []);

  const alertasBase = construirAlertasOperativas({
    fincas: fincasModulo,
    productosInventario: productosInventario,
    siembras: obtenerSiembras(),
    alimentaciones: alimentaciones,
    estanques: estanquesModulo,
    equipos: EQUIPOS_MOCK,
    registrosEnfermedades: registrosEnfermedades,
    registrosParasitologia: registrosParasitologia,
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

  return (
    <>
      <NavbarRegistro
        Titulo="Alertas"
        Subtitulo="Prioridad operativa por categoria"
        Icono="notification"
      />

      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>
          <ResumenAlertas grupos={grupos} />

          <DropdownAlertas
            tipo="critica"
            alertas={grupos.critica}
            abierto={abiertos.critica}
            onToggle={function () {
              cambiarDropdown("critica");
            }}
            onDismiss={descartar}
          />

          <DropdownAlertas
            tipo="advertencia"
            alertas={grupos.advertencia}
            abierto={abiertos.advertencia}
            onToggle={function () {
              cambiarDropdown("advertencia");
            }}
            onDismiss={descartar}
          />

          <DropdownAlertas
            tipo="info"
            alertas={grupos.info}
            abierto={abiertos.info}
            onToggle={function () {
              cambiarDropdown("info");
            }}
            onDismiss={descartar}
          />
        </View>
      </ScrollView>
    </>
  );
}
