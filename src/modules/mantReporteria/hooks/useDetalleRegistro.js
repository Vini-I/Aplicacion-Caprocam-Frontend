import { useEffect, useState } from "react";

import { obtenerDetalleRegistro } from "../services/detalleRegistro.service";

export function useDetalleRegistro() {

    const [registroTipo, setRegistroTipo] = useState(null);
    const [finca, setFinca] = useState(null);
    const [estanque, setEstanque] = useState(null);

    const [registros, setRegistros] = useState([]);

    const [loading, setLoading] = useState(false);


    const filtrosCompletos =
        !!registroTipo &&
        !!finca &&
        !!estanque;


    useEffect(() => {

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

                setRegistros(data);

            } catch (error) {

                console.error(
                    "Error cargando registros:",
                    error
                );

                setRegistros([]);

            } finally {

                setLoading(false);

            }
        }

        cargarRegistros();

    }, [registroTipo, finca, estanque]);


    return {

        registroTipo,
        finca,
        estanque,

        registros,
        loading,

        filtrosCompletos,

        setRegistroTipo,
        setFinca,
        setEstanque,

    };
}