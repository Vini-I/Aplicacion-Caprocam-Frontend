/**
 * ============================================================
 * SERVICE: DASHBOARD API
 * ============================================================
 *
 * Descripcion:
 * Consulta y adapta los datos reales utilizados por el
 * Dashboard general.
 *
 * Modulos integrados:
 * - Fincas
 * - Estanques
 * - Alimentaciones
 * - Siembras
 * - Inventario
 * - Equipos
 * - Enfermedades
 * - Parasitologias
 */

import api from "../../../api/api";

/*
============================================================
FUNCIONES GENERALES
============================================================
*/

function obtenerListaRespuesta(response) {
    if (response === undefined || response === null) {
        return [];
    }

    if (response.data === undefined || response.data === null) {
        return [];
    }

    if (Array.isArray(response.data) === true) {
        return response.data;
    }

    if (Array.isArray(response.data.data) === true) {
        return response.data.data;
    }

    return [];
}

function obtenerObjetoRespuesta(response) {
    if (response === undefined || response === null) {
        return {};
    }

    if (response.data === undefined || response.data === null) {
        return {};
    }

    if (
        response.data.data !== undefined &&
        response.data.data !== null &&
        Array.isArray(response.data.data) === false
    ) {
        return response.data.data;
    }

    if (
        typeof response.data === "object" &&
        Array.isArray(response.data) === false
    ) {
        return response.data;
    }

    return {};
}

function obtenerNumeroSeguro(valor) {
    if (
        valor === undefined ||
        valor === null ||
        String(valor).trim() === ""
    ) {
        return 0;
    }

    const numero = Number(
        String(valor).replace(",", "."),
    );

    if (Number.isNaN(numero) === true) {
        return 0;
    }

    return numero;
}

function obtenerTextoSeguro(valor, respaldo) {
    if (
        valor === undefined ||
        valor === null ||
        String(valor).trim() === ""
    ) {
        return respaldo;
    }

    return String(valor).trim();
}

function obtenerValorDisponible(objeto, campos) {
    if (objeto === undefined || objeto === null) {
        return null;
    }

    for (let i = 0; i < campos.length; i++) {
        const campo = campos[i];
        const valor = objeto[campo];

        if (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        ) {
            return valor;
        }
    }

    return null;
}

function buscarPorId(lista, idBuscado) {
    if (Array.isArray(lista) === false) {
        return null;
    }

    for (let i = 0; i < lista.length; i++) {
        if (Number(lista[i].id) === Number(idBuscado)) {
            return lista[i];
        }
    }

    return null;
}

function convertirFecha(fechaTexto) {
    if (
        fechaTexto === undefined ||
        fechaTexto === null ||
        String(fechaTexto).trim() === ""
    ) {
        return null;
    }

    if (fechaTexto instanceof Date) {
        if (Number.isNaN(fechaTexto.getTime()) === true) {
            return null;
        }

        return new Date(
            fechaTexto.getFullYear(),
            fechaTexto.getMonth(),
            fechaTexto.getDate(),
        );
    }

    const texto = String(fechaTexto).slice(0, 10);

    if (texto.includes("-") === true) {
        const partes = texto.split("-");

        if (partes.length === 3) {
            const fecha = new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2]),
            );

            if (Number.isNaN(fecha.getTime()) === false) {
                return fecha;
            }
        }
    }

    if (texto.includes("/") === true) {
        const partes = texto.split("/");

        if (partes.length === 3) {
            const fecha = new Date(
                Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0]),
            );

            if (Number.isNaN(fecha.getTime()) === false) {
                return fecha;
            }
        }
    }

    return null;
}

function calcularDiasCultivo(fechaSiembra) {
    const fechaInicio = convertirFecha(fechaSiembra);

    if (fechaInicio === null) {
        return 0;
    }

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);
    fechaInicio.setHours(0, 0, 0, 0);

    const diferencia = hoy.getTime() - fechaInicio.getTime();

    if (diferencia <= 0) {
        return 0;
    }

    return Math.floor(
        diferencia / 86400000,
    );
}

function obtenerIdFinca(objeto) {
    const valor = obtenerValorDisponible(
        objeto,
        [
            "idFinca",
            "fincaId",
            "finca_id",
            "id_finca",
        ],
    );

    return obtenerNumeroSeguro(valor);
}

function obtenerIdEstanque(objeto) {
    const valor = obtenerValorDisponible(
        objeto,
        [
            "idEstanque",
            "estanqueId",
            "estanque_id",
            "id_estanque",
        ],
    );

    return obtenerNumeroSeguro(valor);
}

function obtenerNombreFinca(finca, estanque) {
    let nombre = "Sin finca";

    if (finca !== null) {
        const valor = obtenerValorDisponible(
            finca,
            [
                "nombre",
                "nombreFinca",
                "nombre_finca",
            ],
        );

        if (valor !== null) {
            nombre = String(valor);
        }
    }

    if (nombre === "Sin finca" && estanque !== null) {
        const valor = obtenerValorDisponible(
            estanque,
            [
                "fincaNombre",
                "finca",
            ],
        );

        if (valor !== null) {
            nombre = String(valor);
        }
    }

    return nombre;
}

function obtenerCodigoEstanque(estanque) {
    if (estanque === null) {
        return "Sin estanque";
    }

    const codigo = obtenerValorDisponible(
        estanque,
        [
            "codigo",
            "estanqueCodigo",
        ],
    );

    if (codigo === null) {
        return "Sin estanque";
    }

    return String(codigo);
}

function obtenerTextoCapitalizado(valor) {
    const texto = obtenerTextoSeguro(valor, "");

    if (texto === "") {
        return "";
    }

    return (
        texto.charAt(0).toUpperCase() +
        texto.slice(1)
    );
}

/*
============================================================
FINCAS
============================================================
*/

function contarEstanquesFinca(estanques, fincaId) {
    let total = 0;

    if (Array.isArray(estanques) === false) {
        return total;
    }

    for (let i = 0; i < estanques.length; i++) {
        const idFinca = obtenerIdFinca(
            estanques[i],
        );

        if (Number(idFinca) === Number(fincaId)) {
            total = total + 1;
        }
    }

    return total;
}

function adaptarFinca(finca, estanquesBackend) {
    const codigoBackend = obtenerValorDisponible(
        finca,
        [
            "codigoCBO",
            "codigoCbo",
            "codigo_cbo",
            "codigoInterno",
        ],
    );

    const nombreBackend = obtenerValorDisponible(
        finca,
        [
            "nombreFinca",
            "nombre_finca",
            "nombre",
        ],
    );

    const areaBackend = obtenerValorDisponible(
        finca,
        [
            "areaTotal",
            "area_total",
        ],
    );

    let codigo = String(finca.id);
    let nombre = "Finca sin nombre";

    if (codigoBackend !== null) {
        codigo = String(codigoBackend);
    }

    if (nombreBackend !== null) {
        nombre = String(nombreBackend);
    }

    return {
        ...finca,
        id: finca.id,
        codigoInterno: codigo,
        nombre: nombre,
        ubicacion:
            obtenerTextoSeguro(finca.canton, "") +
            ", " +
            obtenerTextoSeguro(finca.provincia, ""),
        areaTotal: obtenerNumeroSeguro(areaBackend),
        estanques: contarEstanquesFinca(
            estanquesBackend,
            finca.id,
        ),
    };
}

/*
============================================================
ESTANQUES
============================================================
*/

function calcularAreaEstanque(estanque) {
    const largo = obtenerNumeroSeguro(
        estanque.largo,
    );

    const ancho = obtenerNumeroSeguro(
        estanque.ancho,
    );

    if (largo <= 0 || ancho <= 0) {
        return 0;
    }

    const metrosCuadrados = largo * ancho;
    const hectareas = metrosCuadrados / 10000;

    return Number(
        hectareas.toFixed(2),
    );
}

function adaptarEstanque(estanque, fincasBackend) {
    const fincaId = obtenerIdFinca(estanque);

    const finca = buscarPorId(
        fincasBackend,
        fincaId,
    );

    const fincaNombre = obtenerNombreFinca(
        finca,
        null,
    );

    const fechaSiembra = obtenerValorDisponible(
        estanque,
        [
            "fechaSiembra",
            "fecha_siembra",
        ],
    );

    return {
        ...estanque,
        fincaId: fincaId,
        idFinca: fincaId,
        fincaNombre: fincaNombre,
        finca: fincaNombre,
        area: calcularAreaEstanque(estanque),
        diasCultivo: calcularDiasCultivo(
            fechaSiembra,
        ),
    };
}

/*
============================================================
ALIMENTACIONES
============================================================
*/

export function adaptarAlimentacionesDashboard(
    alimentaciones,
    fincas,
    estanques,
) {
    const resultado = [];

    if (Array.isArray(alimentaciones) === false) {
        return resultado;
    }

    for (let i = 0; i < alimentaciones.length; i++) {
        const alimentacion = alimentaciones[i];

        const fincaId = obtenerIdFinca(
            alimentacion,
        );

        const estanqueId = obtenerIdEstanque(
            alimentacion,
        );

        const finca = buscarPorId(
            fincas,
            fincaId,
        );

        const estanque = buscarPorId(
            estanques,
            estanqueId,
        );

        const cantidad = obtenerValorDisponible(
            alimentacion,
            [
                "cantidadKg",
                "cantidad_kg",
                "cantidad",
            ],
        );

        resultado.push({
            ...alimentacion,
            idFinca: fincaId,
            fincaId: fincaId,
            idEstanque: estanqueId,
            estanqueId: estanqueId,
            cantidadKg: obtenerNumeroSeguro(cantidad),
            finca: obtenerNombreFinca(
                finca,
                estanque,
            ),
            fincaNombre: obtenerNombreFinca(
                finca,
                estanque,
            ),
            estanque: obtenerCodigoEstanque(
                estanque,
            ),
            estanqueCodigo: obtenerCodigoEstanque(
                estanque,
            ),
        });
    }

    return resultado;
}

/*
============================================================
SIEMBRAS
============================================================
*/

export function adaptarSiembrasDashboard(
    siembras,
    fincas,
    estanques,
) {
    const resultado = [];

    if (Array.isArray(siembras) === false) {
        return resultado;
    }

    for (let i = 0; i < siembras.length; i++) {
        const siembra = siembras[i];

        const fincaId = obtenerIdFinca(
            siembra,
        );

        const estanqueId = obtenerIdEstanque(
            siembra,
        );

        const finca = buscarPorId(
            fincas,
            fincaId,
        );

        const estanque = buscarPorId(
            estanques,
            estanqueId,
        );

        const fechaSiembra = obtenerValorDisponible(
            siembra,
            [
                "fechaSiembra",
                "fecha_siembra",
            ],
        );

        const duracionCiclo = obtenerNumeroSeguro(
            obtenerValorDisponible(
                siembra,
                [
                    "duracionCiclo",
                    "duracion_ciclo",
                    "diasMaduracion",
                    "duracionDias",
                ],
            ),
        );

        const diasCultivo = calcularDiasCultivo(
            fechaSiembra,
        );

        let diasRestantes = 0;

        if (duracionCiclo > 0) {
            diasRestantes =
                duracionCiclo -
                diasCultivo;
        }

        resultado.push({
            ...siembra,
            id: siembra.id,
            siembraId: siembra.id,
            fincaId: fincaId,
            estanqueId: estanqueId,
            fechaSiembra: fechaSiembra,
            duracionCiclo: duracionCiclo,
            diasMaduracion: duracionCiclo,
            diasCultivo: diasCultivo,
            diasRestantes: diasRestantes,
            cantidadSembrada: obtenerNumeroSeguro(
                obtenerValorDisponible(
                    siembra,
                    [
                        "cantidadSembrada",
                        "cantidad_sembrada",
                    ],
                ),
            ),
            densidadPoblacional: obtenerNumeroSeguro(
                obtenerValorDisponible(
                    siembra,
                    [
                        "densidadPoblacional",
                        "densidad_poblacional",
                    ],
                ),
            ),
            tecnicaCultivo: obtenerValorDisponible(
                siembra,
                [
                    "tecnicaCultivo",
                    "tecnica_cultivo",
                ],
            ),
            finca: obtenerNombreFinca(
                finca,
                estanque,
            ),
            fincaNombre: obtenerNombreFinca(
                finca,
                estanque,
            ),
            estanque: obtenerCodigoEstanque(
                estanque,
            ),
            estanqueCodigo: obtenerCodigoEstanque(
                estanque,
            ),
            estado: obtenerTextoSeguro(
                siembra.estado,
                "",
            ),
        });
    }

    return resultado;
}

/*
============================================================
INVENTARIO
============================================================
*/

export function adaptarInventarioDashboard(
    inventario,
) {
    const resultado = [];

    if (Array.isArray(inventario) === false) {
        return resultado;
    }

    for (let i = 0; i < inventario.length; i++) {
        const producto = inventario[i];

        resultado.push({
            ...producto,
            id: producto.id,
            productoId: obtenerNumeroSeguro(
                obtenerValorDisponible(
                    producto,
                    [
                        "productoId",
                        "producto_id",
                    ],
                ),
            ),
            proveedorId: obtenerNumeroSeguro(
                obtenerValorDisponible(
                    producto,
                    [
                        "proveedorId",
                        "proveedor_id",
                    ],
                ),
            ),
            nombre: obtenerTextoSeguro(
                producto.nombre,
                "Producto sin nombre",
            ),
            categoria: obtenerTextoSeguro(
                producto.categoria,
                "Sin categoria",
            ),
            unidad: obtenerTextoSeguro(
                producto.unidad,
                "unidades",
            ),
            cantidad: obtenerNumeroSeguro(
                producto.cantidad,
            ),
            stockMinimo: obtenerNumeroSeguro(
                obtenerValorDisponible(
                    producto,
                    [
                        "stockMinimo",
                        "stock_minimo",
                    ],
                ),
            ),
            precioUnidad: obtenerNumeroSeguro(
                obtenerValorDisponible(
                    producto,
                    [
                        "precioUnidad",
                        "precio_unidad",
                    ],
                ),
            ),
        });
    }

    return resultado;
}

/*
============================================================
EQUIPOS
============================================================
*/

export function adaptarEquiposDashboard(
    equipos,
    fincas,
    estanques,
) {
    const resultado = [];

    if (Array.isArray(equipos) === false) {
        return resultado;
    }

    for (let i = 0; i < equipos.length; i++) {
        const equipo = equipos[i];

        const estanqueId = obtenerIdEstanque(
            equipo,
        );

        const estanque = buscarPorId(
            estanques,
            estanqueId,
        );

        let fincaId = 0;

        if (estanque !== null) {
            fincaId = obtenerIdFinca(
                estanque,
            );
        }

        const finca = buscarPorId(
            fincas,
            fincaId,
        );

        const horasMantenimiento =
            obtenerNumeroSeguro(
                obtenerValorDisponible(
                    equipo,
                    [
                        "horasMantenimiento",
                        "horas_mantenimiento",
                    ],
                ),
            );

        const horasActuales =
            obtenerNumeroSeguro(
                obtenerValorDisponible(
                    equipo,
                    [
                        "horasActuales",
                        "horas_actuales",
                    ],
                ),
            );

        let horasRestantes =
            horasMantenimiento -
            horasActuales;

        if (horasRestantes < 0) {
            horasRestantes = 0;
        }

        const nombreEquipo = obtenerTextoSeguro(
            obtenerValorDisponible(
                equipo,
                [
                    "nombreEquipo",
                    "nombre_equipo",
                    "nombre",
                ],
            ),
            "Equipo",
        );

        const identificador = obtenerTextoSeguro(
            obtenerValorDisponible(
                equipo,
                [
                    "identificador",
                    "serie",
                ],
            ),
            "",
        );

        const tipoEquipo = obtenerTextoSeguro(
            obtenerValorDisponible(
                equipo,
                [
                    "tipoEquipo",
                    "tipo_equipo",
                    "tipo",
                ],
            ),
            "Otro",
        );

        resultado.push({
            ...equipo,
            id: equipo.id,
            estanqueId: estanqueId,
            fincaId: fincaId,
            nombreEquipo: nombreEquipo,
            nombre: nombreEquipo,
            identificador: identificador,
            serie: identificador,
            tipoEquipo: tipoEquipo,
            tipo: tipoEquipo,
            horasMantenimiento: horasMantenimiento,
            horasActuales: horasActuales,
            horasRestantes: horasRestantes,
            estadoOperativo: obtenerTextoSeguro(
                obtenerValorDisponible(
                    equipo,
                    [
                        "estadoOperativo",
                        "estado_operativo",
                    ],
                ),
                "",
            ),
            estado: obtenerTextoSeguro(
                equipo.estado,
                "",
            ),
            fechaInstalacion: obtenerValorDisponible(
                equipo,
                [
                    "fechaInstalacion",
                    "fecha_instalacion",
                ],
            ),
            finca: obtenerNombreFinca(
                finca,
                estanque,
            ),
            fincaNombre: obtenerNombreFinca(
                finca,
                estanque,
            ),
            estanque: obtenerCodigoEstanque(
                estanque,
            ),
            estanqueCodigo: obtenerCodigoEstanque(
                estanque,
            ),
            ubicacion: obtenerCodigoEstanque(
                estanque,
            ),
        });
    }

    return resultado;
}

/*
============================================================
ENFERMEDADES
============================================================
*/

export function adaptarEnfermedadesDashboard(
    registros,
    fincas,
    estanques,
) {
    const resultado = [];

    if (Array.isArray(registros) === false) {
        return resultado;
    }

    for (let i = 0; i < registros.length; i++) {
        const registro = registros[i];

        const fincaId = obtenerIdFinca(
            registro,
        );

        const estanqueId = obtenerIdEstanque(
            registro,
        );

        const finca = buscarPorId(
            fincas,
            fincaId,
        );

        const estanque = buscarPorId(
            estanques,
            estanqueId,
        );

        const enfermedad = obtenerTextoSeguro(
            registro.enfermedad,
            "Enfermedad registrada",
        );

        const enfermedadNombre = obtenerTextoSeguro(
            registro.enfermedadNombre,
            enfermedad,
        );

        const mortalidadRegistrada =
            obtenerNumeroSeguro(
                obtenerValorDisponible(
                    registro,
                    [
                        "mortalidadRegistrada",
                        "mortalidad_registrada",
                        "mortalidad",
                    ],
                ),
            );

        const fincaNombre = obtenerNombreFinca(
            finca,
            estanque,
        );

        const estanqueCodigo = obtenerCodigoEstanque(
            estanque,
        );

        resultado.push({
            ...registro,
            fincaId: fincaId,
            estanqueId: estanqueId,
            finca: fincaNombre,
            fincaNombre: fincaNombre,
            estanque: estanqueCodigo,
            estanqueCodigo: estanqueCodigo,
            enfermedad: enfermedad,
            enfermedadNombre: enfermedadNombre,
            enfermedades: [
                enfermedad,
            ],
            severidad: obtenerTextoSeguro(
                registro.severidad,
                "",
            ),
            severidadNombre: obtenerTextoSeguro(
                registro.severidadNombre,
                obtenerTextoCapitalizado(
                    registro.severidad,
                ),
            ),
            mortalidad: mortalidadRegistrada,
            mortalidadRegistrada:
                mortalidadRegistrada,
            timestamp: obtenerTextoSeguro(
                registro.fechaCreacion,
                registro.fechaReporte,
            ),
        });
    }

    return resultado;
}

export function adaptarResumenEnfermedadesDashboard(
    resumen,
) {
    const totalRegistros =
        obtenerNumeroSeguro(
            obtenerValorDisponible(
                resumen,
                [
                    "totalRegistros",
                    "totalCasos",
                ],
            ),
        );

    const totalMortalidad =
        obtenerNumeroSeguro(
            obtenerValorDisponible(
                resumen,
                [
                    "totalMortalidadRegistrada",
                    "totalMortalidad",
                ],
            ),
        );

    const enfermedadesFrecuentes = [];
    const severidadesFrecuentes = [];

    if (
        resumen !== undefined &&
        resumen !== null
    ) {
        if (
            Array.isArray(
                resumen.enfermedadesFrecuentes,
            ) === true
        ) {
            for (
                let i = 0;
                i <
                resumen.enfermedadesFrecuentes.length;
                i++
            ) {
                const item =
                    resumen.enfermedadesFrecuentes[i];

                const valor =
                    obtenerTextoSeguro(
                        obtenerValorDisponible(
                            item,
                            [
                                "valor",
                                "enfermedad",
                            ],
                        ),
                        "enfermedad-" + i,
                    );

                const nombre =
                    obtenerTextoSeguro(
                        obtenerValorDisponible(
                            item,
                            [
                                "nombre",
                                "enfermedadNombre",
                                "valor",
                            ],
                        ),
                        obtenerTextoCapitalizado(
                            valor,
                        ),
                    );

                const cantidad =
                    obtenerNumeroSeguro(
                        obtenerValorDisponible(
                            item,
                            [
                                "cantidad",
                                "casos",
                                "total",
                            ],
                        ),
                    );

                enfermedadesFrecuentes.push({
                    id:
                        "enfermedad-frecuente-" +
                        valor +
                        "-" +
                        i,

                    enfermedad: valor,
                    valor: valor,
                    nombre: nombre,
                    casos: cantidad,
                    cantidad: cantidad,
                });
            }
        }

        if (
            Array.isArray(
                resumen.severidadesFrecuentes,
            ) === true
        ) {
            for (
                let i = 0;
                i <
                resumen.severidadesFrecuentes.length;
                i++
            ) {
                const item =
                    resumen.severidadesFrecuentes[i];

                const valor =
                    obtenerTextoSeguro(
                        obtenerValorDisponible(
                            item,
                            [
                                "valor",
                                "severidad",
                            ],
                        ),
                        "severidad-" + i,
                    );

                const cantidad =
                    obtenerNumeroSeguro(
                        obtenerValorDisponible(
                            item,
                            [
                                "cantidad",
                                "casos",
                                "total",
                            ],
                        ),
                    );

                severidadesFrecuentes.push({
                    id:
                        "severidad-frecuente-" +
                        valor +
                        "-" +
                        i,

                    severidad: valor,
                    valor: valor,

                    nombre:
                        obtenerTextoSeguro(
                            item.nombre,
                            obtenerTextoCapitalizado(
                                valor,
                            ),
                        ),

                    casos: cantidad,
                    cantidad: cantidad,
                });
            }
        }
    }

    return {
        ...resumen,

        totalCasos:
            totalRegistros,

        totalRegistros:
            totalRegistros,

        totalMortalidad:
            totalMortalidad,

        totalMortalidadRegistrada:
            totalMortalidad,

        enfermedadesFrecuentes:
            enfermedadesFrecuentes,

        severidadesFrecuentes:
            severidadesFrecuentes,
    };
}

/*
============================================================
PARASITOLOGIAS
============================================================
*/

export function adaptarParasitologiasDashboard(
    registros,
    fincas,
    estanques,
) {
    const resultado = [];

    if (Array.isArray(registros) === false) {
        return resultado;
    }

    for (let i = 0; i < registros.length; i++) {
        const registro = registros[i];

        const fincaId = obtenerIdFinca(
            registro,
        );

        const estanqueId = obtenerIdEstanque(
            registro,
        );

        const finca = buscarPorId(
            fincas,
            fincaId,
        );

        const estanque = buscarPorId(
            estanques,
            estanqueId,
        );

        const fincaNombre = obtenerNombreFinca(
            finca,
            estanque,
        );

        const estanqueCodigo = obtenerCodigoEstanque(
            estanque,
        );

        const gradoInfeccion = obtenerTextoSeguro(
            registro.gradoInfeccion,
            "",
        );

        resultado.push({
            ...registro,
            fincaId: fincaId,
            estanqueId: estanqueId,
            finca: fincaNombre,
            fincaNombre: fincaNombre,
            estanque: estanqueCodigo,
            estanqueCodigo: estanqueCodigo,
            parasito: obtenerTextoSeguro(
                registro.parasito,
                "otro",
            ),
            parasitoNombre: obtenerTextoSeguro(
                registro.parasitoNombre,
                obtenerTextoCapitalizado(
                    registro.parasito,
                ),
            ),
            camaronesMuestreados:
                obtenerNumeroSeguro(
                    registro.camaronesMuestreados,
                ),
            camaronesInfectados:
                obtenerNumeroSeguro(
                    registro.camaronesInfectados,
                ),
            porcentajeInfeccion:
                obtenerNumeroSeguro(
                    registro.porcentajeInfeccion,
                ),
            gradoInfeccion: gradoInfeccion,
            nombreGrado: obtenerTextoSeguro(
                registro.nombreGrado,
                obtenerTextoCapitalizado(
                    gradoInfeccion,
                ),
            ),
            timestamp: obtenerTextoSeguro(
                registro.fechaCreacion,
                registro.fechaReporte,
            ),
        });
    }

    return resultado;
}

export function adaptarResumenParasitologiasDashboard(
    resumen,
) {
    const totalMuestreados =
        obtenerNumeroSeguro(
            obtenerValorDisponible(
                resumen,
                [
                    "totalCamaronesMuestreados",
                    "totalMuestreados",
                ],
            ),
        );

    const totalInfectados =
        obtenerNumeroSeguro(
            obtenerValorDisponible(
                resumen,
                [
                    "totalCamaronesInfectados",
                    "totalInfectados",
                ],
            ),
        );

    const promedioInfeccion =
        obtenerNumeroSeguro(
            obtenerValorDisponible(
                resumen,
                [
                    "promedioInfeccion",
                    "porcentajePromedio",
                ],
            ),
        );

    let parasitosFrecuentes = [];
    let gradosFrecuentes = [];

    if (
        Array.isArray(
            resumen.parasitosFrecuentes,
        ) === true
    ) {
        parasitosFrecuentes =
            resumen.parasitosFrecuentes;
    }

    if (
        Array.isArray(
            resumen.gradosFrecuentes,
        ) === true
    ) {
        gradosFrecuentes =
            resumen.gradosFrecuentes;
    }

    return {
        ...resumen,
        totalRegistros: obtenerNumeroSeguro(
            resumen.totalRegistros,
        ),
        totalMuestreados: totalMuestreados,
        totalCamaronesMuestreados:
            totalMuestreados,
        totalInfectados: totalInfectados,
        totalCamaronesInfectados:
            totalInfectados,
        porcentajePromedio:
            promedioInfeccion,
        promedioInfeccion:
            promedioInfeccion,
        parasitosFrecuentes:
            parasitosFrecuentes,
        gradosFrecuentes:
            gradosFrecuentes,
    };
}

/*
============================================================
CONSULTAS API
============================================================
*/

export async function cargarFincasYEstanquesDashboard() {
    const respuestas = await Promise.all([
        api.get("/fincas"),
        api.get("/estanques"),
    ]);

    const fincasBackend = obtenerListaRespuesta(
        respuestas[0],
    );

    const estanquesBackend = obtenerListaRespuesta(
        respuestas[1],
    );

    const fincas = [];
    const estanques = [];

    for (let i = 0; i < fincasBackend.length; i++) {
        fincas.push(
            adaptarFinca(
                fincasBackend[i],
                estanquesBackend,
            ),
        );
    }

    for (let i = 0; i < estanquesBackend.length; i++) {
        estanques.push(
            adaptarEstanque(
                estanquesBackend[i],
                fincasBackend,
            ),
        );
    }

    return {
        fincas: fincas,
        estanques: estanques,
    };
}

export async function cargarAlimentacionesDashboard() {
    const response = await api.get(
        "/alimentaciones",
    );

    return obtenerListaRespuesta(response);
}

export async function cargarSiembrasDashboard() {
    const response = await api.get(
        "/siembras",
    );

    return obtenerListaRespuesta(response);
}

export async function cargarInventarioDashboard() {
    const response = await api.get(
        "/inventario",
    );

    return obtenerListaRespuesta(response);
}

export async function cargarEquiposDashboard() {
    const response = await api.get(
        "/equipos",
    );

    return obtenerListaRespuesta(response);
}

export async function cargarEnfermedadesDashboard() {
    const response = await api.get(
        "/enfermedades",
    );

    return obtenerListaRespuesta(response);
}

export async function cargarResumenEnfermedadesDashboard() {
    const response = await api.get(
        "/enfermedades/resumen",
    );

    const resumen = obtenerObjetoRespuesta(
        response,
    );

    return adaptarResumenEnfermedadesDashboard(
        resumen,
    );
}

export async function cargarParasitologiasDashboard() {
    const response = await api.get(
        "/parasitologias",
    );

    return obtenerListaRespuesta(response);
}

export async function cargarResumenParasitologiasDashboard() {
    const response = await api.get(
        "/parasitologias/resumen",
    );

    const resumen = obtenerObjetoRespuesta(
        response,
    );

    return adaptarResumenParasitologiasDashboard(
        resumen,
    );
}