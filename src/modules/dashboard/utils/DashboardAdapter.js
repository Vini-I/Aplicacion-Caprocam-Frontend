/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardAdapter.js
Autor: Gerald Andres Alfaro Solorzano
Fecha: 01/08/2026
Modulo: Dashboard
Descripcion:
Adapta y normaliza los datos utilizados por el Dashboard.
Relaciona cada estanque con su siembra mas reciente para
obtener los dias de cultivo.
//////////////////////////////////////////////////////////
*/

function obtenerValor(objeto, campos) {
  if (!objeto || !Array.isArray(campos)) return null;

  for (let i = 0; i < campos.length; i++) {
    const valor = objeto[campos[i]];

    if (valor !== undefined && valor !== null && String(valor).trim() !== "") return valor;
  }

  return null;
}

function obtenerNumero(valor) {
  if (valor === undefined || valor === null || String(valor).trim() === "") return 0;

  const numero = Number(String(valor).replace(",", "."));
  return Number.isNaN(numero) ? 0 : numero;
}

function obtenerTexto(valor, respaldo = "") {
  return valor !== undefined && valor !== null && String(valor).trim() !== "" ? String(valor).trim() : respaldo;
}

function obtenerArreglo(valor) {
  if (Array.isArray(valor)) return valor;
  if (typeof valor !== "string" || valor.trim() === "") return [];

  try {
    const arreglo = JSON.parse(valor);
    return Array.isArray(arreglo) ? arreglo : [];
  } catch (error) {
    return [];
  }
}

function capitalizar(valor) {
  const texto = obtenerTexto(valor);
  return texto === "" ? "" : texto.charAt(0).toUpperCase() + texto.slice(1);
}

function obtenerId(objeto) {
  return obtenerNumero(obtenerValor(objeto, ["id", "uuid"]));
}

function obtenerFincaId(objeto) {
  return obtenerNumero(obtenerValor(objeto, ["fincaId", "idFinca", "finca_id", "id_finca"]));
}

function obtenerEstanqueId(objeto) {
  return obtenerNumero(obtenerValor(objeto, ["estanqueId", "idEstanque", "estanque_id", "id_estanque"]));
}

function buscarPorId(lista, id) {
  return Array.isArray(lista)
    ? lista.find(function (item) {
        return obtenerId(item) === Number(id);
      }) ?? null
    : null;
}

function obtenerNombreFinca(finca, estanque) {
  const nombreFinca = obtenerValor(finca, ["nombreFinca", "nombre_finca", "nombre"]);

  if (nombreFinca !== null) return String(nombreFinca);

  return obtenerTexto(obtenerValor(estanque, ["fincaNombre", "nombreFinca", "finca"]), "Sin finca");
}

function obtenerCodigoEstanque(estanque) {
  return obtenerTexto(obtenerValor(estanque, ["codigo", "estanqueCodigo", "nombre"]), "Sin estanque");
}

function convertirFecha(fechaTexto) {
  if (!fechaTexto) return null;

  if (fechaTexto instanceof Date) {
    return Number.isNaN(fechaTexto.getTime()) ? null : new Date(fechaTexto);
  }

  const texto = String(fechaTexto).slice(0, 10);
  const partes = texto.includes("-") ? texto.split("-") : texto.includes("/") ? texto.split("/") : [];

  if (partes.length !== 3) return null;

  const fecha = texto.includes("-")
    ? new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
    : new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));

  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function calcularDiasCultivo(fechaTexto) {
  const fechaInicio = convertirFecha(fechaTexto);

  if (!fechaInicio) return 0;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaInicio.setHours(0, 0, 0, 0);

  const diferencia = hoy.getTime() - fechaInicio.getTime();
  return diferencia > 0 ? Math.floor(diferencia / 86400000) : 0;
}

function obtenerSiembraReciente(siembras, estanqueId) {
  if (!Array.isArray(siembras)) return null;

  const relacionadas = siembras.filter(function (siembra) {
    return Number(siembra.estanqueId) === Number(estanqueId) && convertirFecha(siembra.fechaSiembra) !== null;
  });

  relacionadas.sort(function (a, b) {
    return convertirFecha(b.fechaSiembra).getTime() - convertirFecha(a.fechaSiembra).getTime();
  });

  return relacionadas[0] ?? null;
}

function calcularPromedio(mediciones) {
  const valores = obtenerArreglo(mediciones)
    .map(function (medicion) {
      return Number(String(medicion?.valor ?? "").replace(",", "."));
    })
    .filter(function (valor) {
      return Number.isFinite(valor);
    });

  if (valores.length === 0) return 0;

  const suma = valores.reduce(function (total, valor) {
    return total + valor;
  }, 0);

  return Number((suma / valores.length).toFixed(2));
}

function contarEstanquesFinca(estanques, fincaId) {
  return Array.isArray(estanques)
    ? estanques.filter(function (estanque) {
        return obtenerFincaId(estanque) === Number(fincaId);
      }).length
    : 0;
}

export function adaptarFincasDashboard(fincas, estanques) {
  if (!Array.isArray(fincas)) return [];

  return fincas.map(function (finca) {
    const id = obtenerId(finca);
    const canton = obtenerTexto(finca.canton);
    const provincia = obtenerTexto(finca.provincia);
    const ubicacion = [canton, provincia].filter(Boolean).join(", ");

    return {
      ...finca,
      id,
      codigoInterno: obtenerTexto(obtenerValor(finca, ["codigoCBO", "codigoCbo", "codigo_cbo", "codigoInterno"]), String(id)),
      nombre: obtenerTexto(obtenerValor(finca, ["nombreFinca", "nombre_finca", "nombre"]), "Finca sin nombre"),
      ubicacion,
      areaTotal: obtenerNumero(obtenerValor(finca, ["areaTotal", "area_total", "area"])),
      estanques: contarEstanquesFinca(estanques, id),
    };
  });
}

export function adaptarEstanquesDashboard(estanques, fincas) {
  if (!Array.isArray(estanques)) return [];

  return estanques.map(function (estanque) {
    const fincaId = obtenerFincaId(estanque);
    const finca = buscarPorId(fincas, fincaId);
    const largo = obtenerNumero(estanque.largo);
    const ancho = obtenerNumero(estanque.ancho);
    const area = largo > 0 && ancho > 0 ? Number(((largo * ancho) / 10000).toFixed(2)) : 0;
    const fincaNombre = obtenerNombreFinca(finca, estanque);

    return {
      ...estanque,
      id: obtenerId(estanque),
      fincaId,
      idFinca: fincaId,
      finca: fincaNombre,
      fincaNombre,
      codigo: obtenerCodigoEstanque(estanque),
      area,
    };
  });
}

export function adaptarAlimentacionesDashboard(alimentaciones, fincas, estanques) {
  if (!Array.isArray(alimentaciones)) return [];

  return alimentaciones.map(function (alimentacion) {
    const fincaId = obtenerFincaId(alimentacion);
    const estanqueId = obtenerEstanqueId(alimentacion);
    const finca = buscarPorId(fincas, fincaId);
    const estanque = buscarPorId(estanques, estanqueId);
    const fincaNombre = obtenerNombreFinca(finca, estanque);
    const estanqueCodigo = obtenerCodigoEstanque(estanque);
    const fecha = obtenerValor(alimentacion, ["fecha", "fechaRegistro", "fecha_registro"]);

    return {
      ...alimentacion,
      id: obtenerId(alimentacion),
      fincaId,
      estanqueId,
      finca: fincaNombre,
      fincaNombre,
      estanque: estanqueCodigo,
      estanqueCodigo,
      cantidadKg: obtenerNumero(obtenerValor(alimentacion, ["cantidadKg", "cantidad_kg", "cantidad"])),
      fecha,
      timestamp: obtenerTexto(obtenerValor(alimentacion, ["fechaCreacion", "createdAt", "fecha"]), fecha),
    };
  });
}

export function adaptarSiembrasDashboard(siembras, fincas, estanques) {
  if (!Array.isArray(siembras)) return [];

  return siembras.map(function (siembra) {
    const id = obtenerId(siembra);
    const fincaId = obtenerFincaId(siembra);
    const estanqueId = obtenerEstanqueId(siembra);
    const finca = buscarPorId(fincas, fincaId);
    const estanque = buscarPorId(estanques, estanqueId);
    const fincaNombre = obtenerNombreFinca(finca, estanque);
    const estanqueCodigo = obtenerCodigoEstanque(estanque);
    const fechaSiembra = obtenerValor(siembra, ["fechaSiembra", "fecha_siembra", "fecha"]);
    const duracionCiclo = obtenerNumero(obtenerValor(siembra, ["duracionCiclo", "duracion_ciclo", "diasMaduracion", "duracionDias"]));
    const diasCultivo = calcularDiasCultivo(fechaSiembra);
    const diasRestantes = duracionCiclo > 0 ? duracionCiclo - diasCultivo : 0;

    return {
      ...siembra,
      id,
      siembraId: id,
      fincaId,
      estanqueId,
      finca: fincaNombre,
      fincaNombre,
      estanque: estanqueCodigo,
      estanqueCodigo,
      fechaSiembra,
      duracionCiclo,
      diasMaduracion: duracionCiclo,
      diasCultivo,
      diasRestantes,
      cantidadSembrada: obtenerNumero(obtenerValor(siembra, ["cantidadSembrada", "cantidad_sembrada"])),
      densidadPoblacional: obtenerNumero(obtenerValor(siembra, ["densidadPoblacional", "densidad_poblacional"])),
      estado: obtenerTexto(siembra.estado),
    };
  });
}

export function adaptarInventarioDashboard(inventario) {
  if (!Array.isArray(inventario)) return [];

  return inventario.map(function (registro) {
    const producto = registro.producto ?? registro;

    return {
      ...registro,
      id: obtenerId(registro),
      productoId: obtenerNumero(obtenerValor(registro, ["productoId", "producto_id"])),
      proveedorId: obtenerNumero(obtenerValor(registro, ["proveedorId", "proveedor_id"])),
      nombre: obtenerTexto(obtenerValor(registro, ["nombre", "nombreProducto"]) ?? producto.nombre, "Producto sin nombre"),
      categoria: obtenerTexto(obtenerValor(registro, ["categoria"]) ?? producto.categoria, "Sin categoria"),
      unidad: obtenerTexto(obtenerValor(registro, ["unidad"]) ?? producto.unidad, "unidades"),
      cantidad: obtenerNumero(registro.cantidad),
      stockMinimo: obtenerNumero(obtenerValor(registro, ["stockMinimo", "stock_minimo"])),
      precioUnidad: obtenerNumero(obtenerValor(registro, ["precioUnidad", "precio_unidad"])),
    };
  });
}

export function adaptarEquiposDashboard(equipos, fincas, estanques) {
  if (!Array.isArray(equipos)) return [];

  return equipos.map(function (equipo) {
    const estanqueId = obtenerEstanqueId(equipo);
    const estanque = buscarPorId(estanques, estanqueId);
    const fincaId = obtenerFincaId(estanque);
    const finca = buscarPorId(fincas, fincaId);
    const fincaNombre = obtenerNombreFinca(finca, estanque);
    const estanqueCodigo = obtenerCodigoEstanque(estanque);
    const horasMantenimiento = obtenerNumero(obtenerValor(equipo, ["horasMantenimiento", "horas_mantenimiento"]));
    const horasActuales = obtenerNumero(obtenerValor(equipo, ["horasActuales", "horas_actuales"]));
    const horasRestantes = Math.max(horasMantenimiento - horasActuales, 0);
    const nombre = obtenerTexto(obtenerValor(equipo, ["nombreEquipo", "nombre_equipo", "nombre"]), "Equipo");
    const identificador = obtenerTexto(obtenerValor(equipo, ["identificador", "serie"]));
    const tipo = obtenerTexto(obtenerValor(equipo, ["tipoEquipo", "tipo_equipo", "tipo"]), "Otro");

    return {
      ...equipo,
      id: obtenerId(equipo),
      fincaId,
      estanqueId,
      finca: fincaNombre,
      fincaNombre,
      estanque: estanqueCodigo,
      estanqueCodigo,
      ubicacion: estanqueCodigo,
      nombre,
      nombreEquipo: nombre,
      identificador,
      serie: identificador,
      tipo,
      tipoEquipo: tipo,
      horasMantenimiento,
      horasActuales,
      horasRestantes,
    };
  });
}

export function adaptarEnfermedadesDashboard(registros, fincas, estanques) {
  if (!Array.isArray(registros)) return [];

  return registros.map(function (registro) {
    const fincaId = obtenerFincaId(registro);
    const estanqueId = obtenerEstanqueId(registro);
    const finca = buscarPorId(fincas, fincaId);
    const estanque = buscarPorId(estanques, estanqueId);
    const fincaNombre = obtenerNombreFinca(finca, estanque);
    const estanqueCodigo = obtenerCodigoEstanque(estanque);
    const enfermedad = obtenerTexto(registro.enfermedad, "Enfermedad registrada");
    const severidad = obtenerTexto(registro.severidad);
    const mortalidad = obtenerNumero(obtenerValor(registro, ["mortalidadRegistrada", "mortalidad_registrada", "mortalidad"]));

    return {
      ...registro,
      id: obtenerId(registro),
      fincaId,
      estanqueId,
      finca: fincaNombre,
      fincaNombre,
      estanque: estanqueCodigo,
      estanqueCodigo,
      enfermedad,
      enfermedadNombre: obtenerTexto(registro.enfermedadNombre, capitalizar(enfermedad)),
      enfermedades: [enfermedad],
      severidad,
      severidadNombre: obtenerTexto(registro.severidadNombre, capitalizar(severidad)),
      mortalidad,
      mortalidadRegistrada: mortalidad,
      timestamp: obtenerTexto(obtenerValor(registro, ["fechaCreacion", "createdAt", "fechaReporte"]), registro.fechaReporte),
    };
  });
}

export function adaptarResumenEnfermedadesDashboard(resumen) {
  const datos = resumen && typeof resumen === "object" && !Array.isArray(resumen) ? resumen : {};
  const totalCasos = obtenerNumero(obtenerValor(datos, ["totalCasos", "totalRegistros"]));
  const totalMortalidad = obtenerNumero(obtenerValor(datos, ["totalMortalidad", "totalMortalidadRegistrada"]));

  const enfermedadesFrecuentes = obtenerArreglo(datos.enfermedadesFrecuentes).map(function (item, index) {
    const valor = obtenerTexto(obtenerValor(item, ["valor", "enfermedad"]), "enfermedad-" + index);
    const cantidad = obtenerNumero(obtenerValor(item, ["cantidad", "casos", "total"]));

    return {
      ...item,
      id: "enfermedad-frecuente-" + valor + "-" + index,
      valor,
      enfermedad: valor,
      nombre: obtenerTexto(obtenerValor(item, ["nombre", "enfermedadNombre"]), capitalizar(valor)),
      cantidad,
      casos: cantidad,
    };
  });

  const severidadesFrecuentes = obtenerArreglo(datos.severidadesFrecuentes).map(function (item, index) {
    const valor = obtenerTexto(obtenerValor(item, ["valor", "severidad"]), "severidad-" + index);
    const cantidad = obtenerNumero(obtenerValor(item, ["cantidad", "casos", "total"]));

    return {
      ...item,
      id: "severidad-frecuente-" + valor + "-" + index,
      valor,
      severidad: valor,
      nombre: obtenerTexto(item.nombre, capitalizar(valor)),
      cantidad,
      casos: cantidad,
    };
  });

  return {
    ...datos,
    totalCasos,
    totalRegistros: totalCasos,
    totalMortalidad,
    totalMortalidadRegistrada: totalMortalidad,
    enfermedadesFrecuentes,
    severidadesFrecuentes,
  };
}

export function adaptarParasitologiasDashboard(registros, fincas, estanques) {
  if (!Array.isArray(registros)) return [];

  return registros.map(function (registro) {
    const fincaId = obtenerFincaId(registro);
    const estanqueId = obtenerEstanqueId(registro);
    const finca = buscarPorId(fincas, fincaId);
    const estanque = buscarPorId(estanques, estanqueId);
    const fincaNombre = obtenerNombreFinca(finca, estanque);
    const estanqueCodigo = obtenerCodigoEstanque(estanque);
    const parasito = obtenerTexto(registro.parasito, "otro");
    const grado = obtenerTexto(registro.gradoInfeccion);

    return {
      ...registro,
      id: obtenerId(registro),
      fincaId,
      estanqueId,
      finca: fincaNombre,
      fincaNombre,
      estanque: estanqueCodigo,
      estanqueCodigo,
      parasito,
      parasitoNombre: obtenerTexto(registro.parasitoNombre, capitalizar(parasito)),
      camaronesMuestreados: obtenerNumero(registro.camaronesMuestreados),
      camaronesInfectados: obtenerNumero(registro.camaronesInfectados),
      porcentajeInfeccion: obtenerNumero(registro.porcentajeInfeccion),
      gradoInfeccion: grado,
      nombreGrado: obtenerTexto(registro.nombreGrado, capitalizar(grado)),
      timestamp: obtenerTexto(obtenerValor(registro, ["fechaCreacion", "createdAt", "fechaReporte"]), registro.fechaReporte),
    };
  });
}

export function adaptarResumenParasitologiasDashboard(resumen) {
  const datos = resumen && typeof resumen === "object" && !Array.isArray(resumen) ? resumen : {};
  const totalMuestreados = obtenerNumero(obtenerValor(datos, ["totalMuestreados", "totalCamaronesMuestreados"]));
  const totalInfectados = obtenerNumero(obtenerValor(datos, ["totalInfectados", "totalCamaronesInfectados"]));
  const promedioInfeccion = obtenerNumero(obtenerValor(datos, ["promedioInfeccion", "porcentajePromedio"]));

  return {
    ...datos,
    totalRegistros: obtenerNumero(datos.totalRegistros),
    totalMuestreados,
    totalCamaronesMuestreados: totalMuestreados,
    totalInfectados,
    totalCamaronesInfectados: totalInfectados,
    porcentajePromedio: promedioInfeccion,
    promedioInfeccion,
    parasitosFrecuentes: obtenerArreglo(datos.parasitosFrecuentes),
    gradosFrecuentes: obtenerArreglo(datos.gradosFrecuentes),
  };
}

export function adaptarFisicoQuimicosDashboard(registros, fincas, estanques) {
  if (!Array.isArray(registros)) return [];

  return registros.map(function (registro) {
    const fincaId = obtenerFincaId(registro);
    const estanqueId = obtenerEstanqueId(registro);
    const finca = buscarPorId(fincas, fincaId);
    const estanque = buscarPorId(estanques, estanqueId);
    const fincaNombre = obtenerNombreFinca(finca, estanque);
    const estanqueCodigo = obtenerCodigoEstanque(estanque);
    const ph = obtenerArreglo(registro.ph);
    const salinidad = obtenerArreglo(registro.salinidad);
    const temperatura = obtenerArreglo(registro.temperatura);
    const oxigenoDisuelto = obtenerArreglo(registro.oxigenoDisuelto);

    return {
      ...registro,
      id: obtenerId(registro),
      fincaId,
      estanqueId,
      finca: fincaNombre,
      fincaNombre,
      estanque: estanqueCodigo,
      estanqueCodigo,
      ph,
      salinidad,
      temperatura,
      oxigenoDisuelto,
      promedioPh: calcularPromedio(ph),
      promedioSalinidad: calcularPromedio(salinidad),
      promedioTemperatura: calcularPromedio(temperatura),
      promedioOxigeno: calcularPromedio(oxigenoDisuelto),
      timestamp: obtenerTexto(obtenerValor(registro, ["fechaCreacion", "createdAt", "fecha"]), registro.fecha),
    };
  });
}

export function adaptarDatosDashboard(datos = {}) {
  const fincasRaw = Array.isArray(datos.fincas) ? datos.fincas : [];
  const estanquesRaw = Array.isArray(datos.estanques) ? datos.estanques : [];

  const fincas = adaptarFincasDashboard(fincasRaw, estanquesRaw);
  const estanquesBase = adaptarEstanquesDashboard(estanquesRaw, fincas);
  const siembras = adaptarSiembrasDashboard(datos.siembras, fincas, estanquesBase);

  const estanques = estanquesBase.map(function (estanque) {
    const siembra = obtenerSiembraReciente(siembras, estanque.id);

    return {
      ...estanque,
      siembraId: siembra?.siembraId ?? null,
      fechaSiembra: siembra?.fechaSiembra ?? null,
      diasCultivo: siembra?.diasCultivo ?? null,
      tieneSiembra: siembra !== null,
    };
  });

  return {
    fincas,
    estanques,
    siembras,
    alimentaciones: adaptarAlimentacionesDashboard(datos.alimentaciones, fincas, estanques),
    inventario: adaptarInventarioDashboard(datos.inventario),
    equipos: adaptarEquiposDashboard(datos.equipos, fincas, estanques),
    enfermedades: adaptarEnfermedadesDashboard(datos.enfermedades, fincas, estanques),
    resumenEnfermedades: adaptarResumenEnfermedadesDashboard(datos.resumenEnfermedades),
    parasitologias: adaptarParasitologiasDashboard(datos.parasitologias, fincas, estanques),
    resumenParasitologias: adaptarResumenParasitologiasDashboard(datos.resumenParasitologias),
    fisicoQuimicos: adaptarFisicoQuimicosDashboard(datos.fisicoQuimicos, fincas, estanques),
  };
}