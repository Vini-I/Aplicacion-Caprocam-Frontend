/**
 * ============================================================
 * HOOK USEDATOSCONTEO
 * ============================================================
 *
 * Maneja el estado de los datos de conteo con atarraya y de los
 * datos base del estanque usados para calcular la densidad
 * poblacional. No muestra ni renderiza nada en pantalla: la
 * interfaz decide cuando mostrar los errores devueltos por
 * validar().
 *
 * CAMBIO (documento de requerimientos):
 *
 * El conteo dejo de ser un unico campo "total de camarones" y paso
 * a registrarse TIRO POR TIRO, que es como se hace en campo: se
 * lanza la atarraya, se cuentan los camarones de ese tiro y se
 * anota. El documento lo describe asi ("Primer tiro: 20 camarones,
 * segundo tiro: 15, tercer tiro: 30... al finalizar se suman todos
 * los camarones obtenidos").
 *
 * `tiros` es un arreglo donde cada posicion es la cantidad de
 * camarones de ese tiro, y es la UNICA fuente de verdad: la
 * cantidad de tiros es `tiros.length`. Antes `tirosAtarraya` y
 * `numeroCamarones` eran dos campos sueltos que el usuario digitaba
 * por separado y podian contradecirse entre si (por ejemplo 20
 * tiros con un total que no correspondia a ningun conteo real).
 *
 * Campos que dejaron de digitarse y ahora se calculan:
 * - numeroCamarones: suma de todos los tiros.
 * - tirosAtarraya: cantidad de tiros registrados.
 * - promedioPorTiro: numeroCamarones / tirosAtarraya. El documento
 *   lo define como un valor derivado, no ingresado.
 *
 * Valores derivados que se exponen para mostrar en pantalla (no se
 * digitan y no se envian al backend, que los recalcula al guardar):
 * - areaMuestreada  = tirosAtarraya x areaAtarraya
 * - densidadPorM2   = numeroCamarones / areaMuestreada
 * - poblacionTotal  = densidadPorM2 x (areaEstanque x 10 000)
 *
 * Verificacion con el ejemplo del documento (350 camarones en 20
 * tiros, atarraya de 2,5 m2, estanque de 2 ha):
 *   area muestreada = 20 x 2,5      = 50 m2
 *   promedio        = 350 / 20      = 17,5
 *   densidad        = 350 / 50      = 7 camarones/m2
 *   poblacion total = 7 x 20 000    = 140 000 camarones
 *
 * OJO con la unidad de `areaEstanque`: la formula del documento
 * multiplica por 10 000, o sea espera HECTAREAS. La UI ahora lo
 * dice explicitamente en la etiqueta, porque antes el campo no
 * declaraba unidad y un valor en m2 daba un resultado 10 000 veces
 * mas grande.
 *
 * CAMBIO: `supervivencia` dejo de ser un campo digitado. Ahora el
 * backend la calcula (poblacion estimada del conteo actual contra
 * la poblacion que se sembro originalmente) y es un dato OCULTO:
 * no se pide en el formulario, no se valida aqui y no se envia en
 * el DTO que arma useDensidadPoblacional.js/useEditarDensidad.js.
 *
 * CAMBIO: `agregarTiro` ahora exige que el ULTIMO tiro ya tenga una
 * cantidad cargada antes de dejar abrir uno nuevo. Antes se podian
 * abrir varias filas vacias de una sola vez apretando "Agregar
 * tiro" repetidas veces, lo que hacia mas facil dejar tiros en
 * blanco sin darse cuenta hasta el envio del formulario.
 *
 * Ejemplo:
 * const { tiros, agregarTiro, numeroCamarones } = useDatosConteo();
 */

import { useState } from "react";

const MAX_TIROS = 30;

const VALORES_INICIALES = {
  tiros: [""],
  areaAtarraya: "",
  notasConteo: "",
  siembraPorM2: "",
  areaEstanque: "",
};

function aNumero(valor) {
  /*
  Descripcion:
  Convierte a numero un campo de texto del formulario, tratando el
  vacio como 0 para poder ir sumando mientras el usuario todavia no
  termina de llenar todos los tiros.

  Parametros:
  - valor: Texto del campo.

  Retorna:
  - Numero, o 0 si esta vacio o no es numerico.
  */
  const numero = Number(valor);

  if (valor === "" || valor === null || valor === undefined || Number.isNaN(numero)) {
    return 0;
  }

  return numero;
}

function formatear(valor, decimales = 2) {
  /*
  Descripcion:
  Deja un numero listo para mostrarse en un campo de solo lectura,
  o "" si todavia no hay dato suficiente para calcularlo.

  Parametros:
  - valor: Numero calculado.
  - decimales: Cantidad de decimales.

  Retorna:
  - Texto formateado, o "" si el valor no es utilizable.
  */
  if (!Number.isFinite(valor) || valor <= 0) {
    return "";
  }

  return valor.toFixed(decimales);
}

export const useDatosConteo = () => {
  const [tiros, setTiros] = useState(VALORES_INICIALES.tiros);
  const [areaAtarraya, setAreaAtarraya] = useState(VALORES_INICIALES.areaAtarraya);
  const [notasConteo, setNotasConteo] = useState(VALORES_INICIALES.notasConteo);
  const [siembraPorM2, setSiembraPorM2] = useState(VALORES_INICIALES.siembraPorM2);
  const [areaEstanque, setAreaEstanque] = useState(VALORES_INICIALES.areaEstanque);

  /*
  ----------------------------------------------------------------
  Manejo de los tiros
  ----------------------------------------------------------------
  */

  const setTiro = (indice, valor) => {
    /*
    Descripcion:
    Actualiza la cantidad de camarones de un tiro puntual.

    Parametros:
    - indice: Posicion del tiro en el arreglo.
    - valor: Texto ya limpio (solo digitos).
    */
    setTiros((prev) => prev.map((actual, i) => (i === indice ? valor : actual)));
  };

  const agregarTiro = () => {
    /*
    Descripcion:
    Agrega un tiro vacio al final, pero solo si el ultimo tiro ya
    tiene una cantidad cargada. Si el ultimo tiro esta en blanco,
    no agrega nada: primero hay que llenar ese antes de abrir uno
    nuevo, para no terminar con varias filas vacias a la vez.

    Tambien respeta el tope MAX_TIROS, igual que antes.
    */
    setTiros((prev) => {
      if (prev.length >= MAX_TIROS) {
        return prev;
      }

      const ultimoTiro = prev[prev.length - 1];

      if (String(ultimoTiro ?? "").trim() === "") {
        return prev;
      }

      return [...prev, ""];
    });
  };

  const eliminarTiro = (indice) => {
    /*
    Siempre debe quedar al menos un tiro: un conteo sin ningun tiro
    no tiene sentido y dejaria el formulario sin nada que sumar.
    */
    setTiros((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== indice)));
  };

  const setCantidadTiros = (cantidad) => {
    /*
    Descripcion:
    Ajusta el arreglo para que tenga exactamente `cantidad` tiros.
    Permite que el usuario diga de entrada cuantos tiros va a hacer
    (10 por hectarea, segun el documento) sin tener que apretar
    "Agregar tiro" uno por uno. Al recortar, conserva los conteos
    que ya estaban escritos en las primeras posiciones.

    Parametros:
    - cantidad: Numero de tiros deseado.
    */
    const total = Math.min(Math.max(Number(cantidad) || 1, 1), MAX_TIROS);

    setTiros((prev) => {
      if (total === prev.length) {
        return prev;
      }

      if (total < prev.length) {
        return prev.slice(0, total);
      }

      return [...prev, ...Array(total - prev.length).fill("")];
    });
  };

  const cargarTiros = (lista) => {
    /*
    Descripcion:
    Reemplaza la lista completa de tiros con la que viene de un
    registro guardado (pantalla de edicion). Se usa en vez de llamar
    a setCantidadTiros + setTiro en un ciclo, que dejaba el estado
    pasando por pasos intermedios donde el total mostrado no
    correspondia a ningun conteo real.

    La lista se acepta tanto como arreglo de numeros ([20, 15, 30])
    como en el formato que devuelve el backend
    ([{ numeroTiro, cantidadCamarones }]).

    Parametros:
    - lista: Tiros del registro guardado.
    */
    if (!Array.isArray(lista) || lista.length === 0) {
      setTiros(VALORES_INICIALES.tiros);
      return;
    }

    const normalizados = lista
      .slice(0, MAX_TIROS)
      .map((tiro) => {
        const cantidad =
          tiro !== null && typeof tiro === "object" ? tiro.cantidadCamarones : tiro;

        return cantidad === null || cantidad === undefined ? "" : String(cantidad);
      });

    setTiros(normalizados);
  };

  const rellenarDesdeEstanque = (datos) => {
    /*
    Aplica los datos base del estanque seleccionado. Los valores
    vienen del backend y son de solo lectura en la pantalla.

    Si no existe una siembra real, cantidadSiembra llega como null
    y se deja vacio para impedir que se calcule o guarde una
    supervivencia con un valor de referencia inventado.
    */
    if (!datos) return;

    setAreaEstanque(
      datos.areaEstanque === null || datos.areaEstanque === undefined
        ? ""
        : String(datos.areaEstanque)
    );

    setSiembraPorM2(
      datos.cantidadSiembra === null || datos.cantidadSiembra === undefined
        ? ""
        : String(datos.cantidadSiembra)
    );

    if (
      datos.areaAtarrayaSugerida !== null &&
      datos.areaAtarrayaSugerida !== undefined
    ) {
      setAreaAtarraya(String(datos.areaAtarrayaSugerida));
    } else {
      setAreaAtarraya("");
    }

    /*
    El backend puede devolver `tirosRecomendados` según el tamaño
    del estanque, pero ese valor NO debe crear automáticamente
    varios tiros en el formulario.

    Al seleccionar un estanque, el conteo siempre debe comenzar
    con un solo tiro vacío. El usuario puede aumentar la cantidad
    manualmente con "Cantidad de tiros" o con "Agregar tiro".

    `tirosRecomendados` se conserva en la respuesta del backend para
    otros usos, pero no controla el estado inicial del formulario.
    */
    setTiros(VALORES_INICIALES.tiros);
  };

  /*
  ----------------------------------------------------------------
  Valores derivados
  ----------------------------------------------------------------
  */

  const tirosAtarraya = tiros.length;
  const numeroCamarones = tiros.reduce((suma, tiro) => suma + aNumero(tiro), 0);

  const areaMuestreada = tirosAtarraya * aNumero(areaAtarraya);
  const promedioPorTiro = tirosAtarraya > 0 ? Math.round( numeroCamarones / tirosAtarraya) : 0;
  const densidadPorM2 = areaMuestreada > 0 ? Math.round( numeroCamarones / areaMuestreada ) : 0;
  const poblacionTotal = densidadPorM2 * (aNumero(areaEstanque) * 10000);

  /*
  Supervivencia de previsualizacion: usa exactamente la misma
  formula del backend para que el usuario vea el resultado mientras
  completa el formulario. El backend vuelve a calcularla al guardar.

  Si no existe una siembra real, se deja vacia. Nunca se usa un valor
  de referencia para calcular supervivencia.
  */
  const poblacionSembrada =
    aNumero(siembraPorM2) > 0 && aNumero(areaEstanque) > 0
      ? aNumero(siembraPorM2) * aNumero(areaEstanque) * 10000
      : 0;

  const supervivencia =
  poblacionSembrada > 0 && poblacionTotal > 0
    ? Math.round(
        Math.min(
          (poblacionTotal / poblacionSembrada) * 100,
          100
        )
      )
    : 0;

  const resetear = () => {
    setTiros(VALORES_INICIALES.tiros);
    setAreaAtarraya(VALORES_INICIALES.areaAtarraya);
    setNotasConteo(VALORES_INICIALES.notasConteo);
    setSiembraPorM2(VALORES_INICIALES.siembraPorM2);
    setAreaEstanque(VALORES_INICIALES.areaEstanque);
  };

  const validar = () => {
    const errores = {};

    /*
    Cada tiro tiene que estar lleno: si alguno queda en blanco, la
    suma y el promedio saldrian con un tiro contando como 0 y el
    resultado seria menor al real sin que el usuario se entere.
    */
    const tirosVacios = tiros
      .map((tiro, i) => (String(tiro).trim() === "" ? i + 1 : null))
      .filter((n) => n !== null);

    if (tirosVacios.length > 0) {
      errores.tiros =
        tirosVacios.length === 1
          ? `Falta la cantidad de camarones del tiro ${tirosVacios[0]}`
          : `Faltan las cantidades de los tiros ${tirosVacios.join(", ")}`;
      errores.tirosVacios = tirosVacios;
    }

    if (!areaAtarraya) {
      errores.areaAtarraya = "El area de la atarraya es obligatoria";
    }
    if (!siembraPorM2 || Number.isNaN(Number(siembraPorM2)) || Number(siembraPorM2) <= 0) {
      errores.siembraPorM2 =
        "El estanque debe tener una siembra real registrada antes de guardar.";
    }
    if (!areaEstanque || Number.isNaN(Number(areaEstanque)) || Number(areaEstanque) <= 0) {
      errores.areaEstanque =
        "El area del estanque es obligatoria y debe ser numerica.";
    }
    // notasConteo es opcional: no se valida aqui.
    // useDensidadPoblacional.js completa "No hay notas" si queda vacio.

    return { valido: Object.keys(errores).length === 0, errores };
  };

  return {
    // Tiros
    tiros,
    setTiro,
    agregarTiro,
    eliminarTiro,
    setCantidadTiros,
    cargarTiros,
    rellenarDesdeEstanque,
    maxTiros: MAX_TIROS,

    /*
    Lista lista para enviar al backend: solo las cantidades, ya
    convertidas a numero. El backend le asigna el numero de tiro por
    posicion y guarda una fila por tiro en densidad_detalle_tiros.
    */
    tirosParaEnviar: tiros.map((tiro) => aNumero(tiro)),

    // Digitados
    areaAtarraya,
    setAreaAtarraya,
    notasConteo,
    setNotasConteo,
    siembraPorM2,
    setSiembraPorM2,
    areaEstanque,
    setAreaEstanque,

    // Calculados (numeros, para enviar al backend)
    numeroCamarones,
    tirosAtarraya,
    promedioPorTiro,

    // Calculados (texto, para mostrar de solo lectura)
    areaMuestreadaTexto: formatear(areaMuestreada),
    promedioPorTiroTexto: formatear(promedioPorTiro),
    densidadPorM2Texto: formatear(densidadPorM2),
    poblacionTotalTexto: formatear(poblacionTotal, 0),
    supervivencia: formatear(supervivencia),

    resetear,
    validar,
  };
};