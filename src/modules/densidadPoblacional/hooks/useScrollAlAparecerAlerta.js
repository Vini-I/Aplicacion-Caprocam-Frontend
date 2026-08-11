/**
 * ============================================================
 * HOOK USESCROLLALAPARECERALERTA
 * ============================================================
 *
 * Hace scroll automatico hasta el final del formulario cuando
 * aparece una alerta (exito, error o validacion), para que el
 * usuario vea el mensaje sin tener que desplazarse a mano.
 *
 * Por que existe:
 * DensidadPoblacionalScreen.jsx y EditarDensidadScreen.jsx tenian
 * cada una su propio `useRef` + `useEffect` con exactamente esta
 * misma logica escritos directo en la screen. Las screens de este
 * modulo no deben usar hooks de React sueltos (useState, useEffect,
 * useRef, etc.): toda esa logica va en hooks/, y la screen solo
 * consume el hook y arma el JSX. Este hook reemplaza esas dos
 * copias identicas por una sola.
 *
 * Parametros:
 * - activar: boolean. Cuando pasa a `true` (por ejemplo, cuando se
 *   muestra la alerta de exito/error/validacion), dispara el scroll.
 *
 * Retorna:
 * - scrollRef: ref para pasarle directo a la prop `ref` del
 *   ScrollView del formulario.
 *
 * Ejemplo:
 * const scrollRef = useScrollAlAparecerAlerta(mostrarAlertaLocal);
 * <ScrollView ref={scrollRef}>...</ScrollView>
 */

import { useEffect, useRef } from "react";

export default function useScrollAlAparecerAlerta(activar) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (activar) {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }
  }, [activar]);

  return scrollRef;
}