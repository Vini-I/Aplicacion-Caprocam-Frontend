import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import  {obtenerDetalleReporte}  from "../services/detalleReporte.service";
import { TIPOS_AUTOGESTIONADOS } from "../constants/tipoReporte.js";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { colaboradorService } from "../../colaboradores/services/colaborador.service.js";

export function useDetalleReporte() {
  const router = useRouter();                    
  const { alert: alertParam } = useLocalSearchParams();

  const [registroTipo, setRegistroTipo] = useState(null);

  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  
  const [fincas, setFincas] = useState([]); 
  const [estanques, setEstanques] = useState([]);  
  const [colaboradores, setColaboradores] = useState([]);
  const [estanquesFiltrados, setEstanquesFiltrados] = useState([]);

  const [alert, setAlert] = useState(null);

  const [registros, setRegistros] = useState([]);

  const [loading, setLoading] = useState(false);


  const filtrosCompletos =
    !!registroTipo &&
    !!finca &&
    !!estanque;

  useEffect(() => {
    if (alertParam === "edited") {
      setAlert("edited");
      router.setParams({ alert: undefined });
    }
  }, [alertParam, setAlert, router])

  useEffect(() => {
    let activo = true;

    async function cargarCatalogos() {
      try {

        const [fincasData, estanquesData, colaboradoresData] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          colaboradorService.getColaboradores(),
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

        const colaboradoresOptions = colaboradoresData.map((colaborador) => ({
          value: colaborador.id,
          label: colaborador.nombre,
        }));

        if (activo) {
          setFincas(fincasOptions);
          setEstanques(estanquesOptions);
          setColaboradores(colaboradoresOptions);
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

      if (TIPOS_AUTOGESTIONADOS.includes(registroTipo)) {
        setRegistros([]);
        setLoading(false);
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
          const registrosConNombres = registrosData.map((registro) => {
          const fincaEncontrada = fincas.find(
            f => Number(f.value) === Number(registro.finca_id || registro.fincaId || registro.idFinca)
          );

          const estanqueEncontrado = estanques.find(
            e => Number(e.value) === Number(registro.estanque_id || registro.estanqueId || registro.idEstanque)
          );

          const colaboradorEncontrado = colaboradores.find(
            c => Number(c.value) === Number(registro.colaborador_id || registro.colaboradorId || registro.idColaborador)
          );
          
            return {
              ...registro,
              nombreFinca: fincaEncontrada?.label ?? "No encontrada",
              codigoEstanque: estanqueEncontrado?.label ?? "No encontrado",
              nombreColaborador: colaboradorEncontrado?.label ?? "No encontrado",
            };
          });

          setRegistros(registrosConNombres);
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
  }, [registroTipo, finca, estanque, fincas, estanques, colaboradores, filtrosCompletos]);


  return {

    registroTipo,

    finca,
    estanque,

    fincas, 
    estanques,
    colaboradores,
    estanquesFiltrados,

    registros,
    loading,

    filtrosCompletos,

    setRegistroTipo,
    setFinca,
    setEstanque,

    alert,
    setAlert,

  };
}