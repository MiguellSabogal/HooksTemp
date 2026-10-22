import { useState } from 'react';
import { useTemporizador } from '../hooks/useTemporizador';
import './Temporizador.css';

// Modos disponibles del Pomodoro
const MODOS = [
  { id: 'enfoque', nombre: 'Enfoque', minutos: 25, color: '#ff5a4e', mensaje: 'Concéntrate en una sola tarea' },
  { id: 'corta', nombre: 'Pausa corta', minutos: 5, color: '#16b89a', mensaje: 'Estira, respira, toma agua' },
  { id: 'larga', nombre: 'Pausa larga', minutos: 15, color: '#6c63ff', mensaje: 'Aléjate de la pantalla un rato' },
];

// Medidas del anillo de progreso (SVG)
const RADIO = 120;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

export default function Temporizador() {
  const [modo, setModo] = useState(MODOS[0]);
  const { segundosRestantes, duracion, activo, terminado, progreso, formatoTiempo, alternar, reiniciar, cambiarDuracion } =
    useTemporizador(modo.minutos);

  const elegirModo = (nuevoModo) => {
    setModo(nuevoModo);
    cambiarDuracion(nuevoModo.minutos);
  };

  const sinCambios = segundosRestantes === duracion;

  return (
    <main className="pantalla" style={{ '--color': modo.color }}>
      <section className="tarjeta">
        <header className="encabezado">
          <span className="etiqueta">React Hooks · Custom Hook</span>
          <h1>Temporizador Pomodoro</h1>
        </header>

        {/* Selector de modo */}
        <nav className="modos">
          {MODOS.map((m) => (
            <button
              key={m.id}
              className={`modo ${m.id === modo.id ? 'modo--activo' : ''}`}
              onClick={() => elegirModo(m)}
            >
              {m.nombre}
            </button>
          ))}
        </nav>

        {/* Anillo de progreso + tiempo */}
        <div className={`reloj ${activo ? 'reloj--activo' : ''}`}>
          <svg viewBox="0 0 280 280" className="anillo">
            <circle className="anillo__fondo" cx="140" cy="140" r={RADIO} />
            <circle
              className="anillo__progreso"
              cx="140"
              cy="140"
              r={RADIO}
              strokeDasharray={CIRCUNFERENCIA}
              strokeDashoffset={CIRCUNFERENCIA * (1 - progreso)}
            />
          </svg>

          <div className="reloj__centro">
            <span className="tiempo">{formatoTiempo}</span>
            <span className="estado">{terminado ? '¡Tiempo cumplido! 🎉' : activo ? 'En curso' : 'En pausa'}</span>
          </div>
        </div>

        <p className="mensaje">{modo.mensaje}</p>

        {/* Controles */}
        <div className="controles">
          <button className="boton boton--principal" onClick={alternar} disabled={terminado}>
            {activo ? 'Pausar' : 'Iniciar'}
          </button>

          <button className="boton boton--secundario" onClick={reiniciar} disabled={sinCambios}>
            Reiniciar
          </button>
        </div>
      </section>

      <footer className="pie">
        Hecho con <code>useState</code> + <code>useEffect</code> dentro de <code>useTemporizador()</code>
      </footer>
    </main>
  );
}
