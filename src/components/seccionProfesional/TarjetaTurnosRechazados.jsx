import React from 'react';
import ElementoTurnoRechazado from './ElementoTurnoRechazado';

const TarjetaTurnosRechazados = ({ turnosRechazados, onRestaurar }) => {
  return (
    <div className="tarjeta tarjeta-rechazados">
      <div className="encabezado-tarjeta">
        <h2>Turnos Rechazados</h2>
        <span className="contador">{turnosRechazados.length}</span>
      </div>
      <div className="contenido-tarjeta">
        {turnosRechazados.length === 0 ? (
          <p className="sin-elementos">No hay turnos rechazados</p>
        ) : (
          turnosRechazados.map(turno => (
            <ElementoTurnoRechazado 
              key={turno.id}
              turno={turno}
              onRestaurar={onRestaurar}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TarjetaTurnosRechazados;