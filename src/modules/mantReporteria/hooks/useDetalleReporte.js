import { useEffect, useState } from "react";

import  {obtenerDetalleReporte}  from "../services/detalleReporte.service";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

export function useDetalleReporte() {

  const [registroTipo, setRegistroTipo] = useState(null);

  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  
  const [fincas, setFincas] = useState([]); 
  const [estanques, setEstanques] = useState([]);  
  const [estanquesFiltrados, setEstanquesFiltrados] = useState([]);

  const [registros, setRegistros] = useState([]);

  const [loading, setLoading] = useState(false);


  const filtrosCompletos =
    !!registroTipo &&
    !!finca &&
    !!estanque;


  useEffect(() => {
    let activo = true;

    async function cargarCatalogos() {
      try {

        const [fincasData, estanquesData] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
        ]);

        const fincasOptions = fincasData.map((finca) => ({
          label: finca.nombreFinca,
          value: finca.id
        }));

        const estanquesOptions = estanquesData.map((estanque) => ({
          label: estanque.codigo, 
          value: estanque.id,
          fincaId: estanque.idFinca,
        }));

        if (activo) {
          setFincas(fincasOptions);
          setEstanques(estanquesOptions);
        }

      } catch (error) {

        console.error(
          "Error cargando registros:",
          error
        )
      }
    }
   
    cargarCatalogos();


    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {

    if (!finca) {
      setEstanquesFiltrados([]);
      setEstanque(null);
      return;
    }


    const filtrados = estanques.filter(
      (item) => item.fincaId == finca
    );


    setEstanquesFiltrados(filtrados);

    setEstanque(null);


  }, [finca, estanques]);

  useEffect(() => {
    let activo = true;

    async function cargarRegistros() {
      if (!filtrosCompletos) {
        setRegistros([]);
        return;
      }

      try {
        setLoading(true);

        const registrosData = await obtenerDetalleReporte({
          tipoRegistro: registroTipo,
          fincaId: finca,
          estanqueId: estanque,
        });

        if (activo) {
          setRegistros(registrosData);
        }
      } catch (error) {
        console.error("Error cargando registros:", error);

        if (activo) {
          setRegistros([]);
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarRegistros();

    return () => {
      activo = false;
    };
  }, [registroTipo, finca, estanque]);


  return {

    registroTipo,

    finca,
    estanque,

    fincas, 
    estanques,
    estanquesFiltrados,

    registros,
    loading,

    filtrosCompletos,

    setRegistroTipo,
    setFinca,
    setEstanque,

  };
}