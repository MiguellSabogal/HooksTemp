import { useState, useEffect } from 'react';

/**
 * Custom Hook: useTemporizador
 * Maneja la lógica de una cuenta regresiva (estilo Pomodoro).
 * El componente que lo use solo se encarga de mostrar la información.
 *
 * @param {number} minutosIniciales - Duración inicial del temporizador en minutos.
 */
export const useTemporizador = (minutosIniciales = 25) => {
  // Estado: duración total elegida (en segundos)
  const [duracion, setDuracion] = useState(minutosIniciales * 60);
  // Estado: segundos que faltan para terminar
  const [segundosRestantes, setSegundosRestantes] = useState(minutosIniciales * 60);
  // Estado: ¿el usuario presionó "Iniciar"?
  const [enMarcha, setEnMarcha] = useState(false);

  // Valores derivados (se calculan en cada render, no necesitan estado propio)
  const terminado = segundosRestantes === 0;
  const activo = enMarcha && !terminado; // al llegar a 0 se detiene solo
  const progreso = 1 - segundosRestantes / duracion; // de 0 a 1

  // Formato mm:ss (mismo truco que en el cronómetro)
  const formatoTiempo = new Date(segundosRestantes * 1000).toISOString().substring(14, 19);

  // Efecto 1: mientras esté activo, descontamos un segundo cada 1000 ms
  useEffect(() => {
    let intervalo = null;

    if (activo) {
      intervalo = setInterval(() => {
        setSegundosRestantes((s) => s - 1);
      }, 1000);
    }

    // Limpieza: se ejecuta al pausar, al llegar a 0 o al desmontar el componente
    return () => {
      clearInterval(intervalo);
    };
  }, [activo]);

  // Efecto 2: mostramos el tiempo restante en el título de la pestaña
  useEffect(() => {
    document.title = activo ? `⏳ ${formatoTiempo} · Pomodoro` : 'Temporizador Pomodoro';
  }, [activo, formatoTiempo]);

  // Acciones que el componente puede usar
  const alternar = () => {
    if (!terminado) setEnMarcha(!activo);
  };

  const reiniciar = () => {
    setEnMarcha(false);
    setSegundosRestantes(duracion);
  };

  const cambiarDuracion = (minutos) => {
    setEnMarcha(false);
    setDuracion(minutos * 60);
    setSegundosRestantes(minutos * 60);
  };

  return {
    segundosRestantes,
    duracion,
    activo,
    terminado,
    progreso,
    formatoTiempo,
    alternar,
    reiniciar,
    cambiarDuracion,
  };
};
