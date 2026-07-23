import { useEffect, useState } from "react";

import {
  obtenerDetalleRegistro,
  obtenerOpcionesEstanquesReporteria,
  obtenerOpcionesFincasReporteria,
} from "../services/Reporteria.service";

export function useReporteria() {
  const [registroTipo, setRegistroTipo] = useState(null);
  const [finca, setFincaBase] = useState("");
  const [estanque, setEstanque] = useState("");
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  const filtrosCompletos = !!registroTipo;
  const opcionesFincas = obtenerOpcionesFincasReporteria();
  const opcionesEstanques = obtenerOpcionesEstanquesReporteria(finca);

  function setFinca(valor) {
    setFincaBase(valor);
    setEstanque("");
  }

  useEffect(
    function () {
      let activo = true;

      async function cargarRegistros() {
        if (!filtrosCompletos) {
          setRegistros([]);
          return;
        }

        try {
          setLoading(true);

          const data = await obtenerDetalleRegistro({
            tipoRegistro: registroTipo,
            fincaId: finca,
            estanqueId: estanque,
          });

          if (activo === true) {
            setRegistros(data);
          }
        } catch (error) {
          console.error("Error cargando registros:", error);

          if (activo === true) {
            setRegistros([]);
          }
        } finally {
          if (activo === true) {
            setLoading(false);
          }
        }
      }

      cargarRegistros();

      return function () {
        activo = false;
      };
    },
    [registroTipo, finca, estanque],
  );

  return {
    registroTipo,
    finca,
    estanque,
    registros,
    loading,
    filtrosCompletos,
    opcionesFincas,
    opcionesEstanques,
    setRegistroTipo,
    setFinca,
    setEstanque,
  };
}
