import React from 'react';
import ElementoSolicitudTurno from './ElementoSolicitudTurno';

const TarjetaSolicitudesTurnos = ({ solicitudes, onAceptar, onRechazar, onCancelar }) => {
  return (
    <div className="tarjeta tarjeta-solicitudes">
      <div className="encabezado-tarjeta">
        <h2>Solicitudes de turnos</h2>
        <span className="contador">{solicitudes.length}</span>
      </div>
      <div className="contenido-tarjeta">
        {solicitudes.length === 0 ? (
          <p className="sin-elementos">No hay solicitudes pendientes</p>
        ) : (
          solicitudes.map(solicitud => (
            <ElementoSolicitudTurno 
              key={solicitud.id}
              solicitud={solicitud}
              onAceptar={onAceptar}
              onRechazar={onRechazar}
              onCancelar={onCancelar}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TarjetaSolicitudesTurnos;