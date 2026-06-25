import React from 'react';

const AgendaDiaria = ({ citasDiarias }) => {
  return (
    <div className="tarjeta tarjeta-agenda">
      <div className="encabezado-tarjeta">
        <h2>Agenda del Día</h2>
        <span className="contador">{citasDiarias.length}</span>
      </div>
      <div className="contenido-tarjeta">
        {citasDiarias.length === 0 ? (
          <p className="sin-elementos">No hay turnos programados para hoy</p>
        ) : (
          <div className="lista-agenda">
            {citasDiarias.map(cita => (
              <ElementoAgenda
                key={cita.id}
                cita={cita}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const formatearTiempo = (cita) => {
  const fechaHora = cita.fecha_hora;

  const fechaStr = `${fechaHora.substring(8, 10)}/${fechaHora.substring(5, 7)}/${fechaHora.substring(0, 4)}`;

  const horaInicio = fechaHora.substring(11, 16);

  return cita.horaFin
    ? `${fechaStr} • ${horaInicio} - ${cita.horaFin}`
    : `${fechaStr} • ${horaInicio}`;
};
const ElementoAgenda = ({ cita }) => {
  return (
    <div className="item-agenda">
      <div className="tiempo-agenda">
        {formatearTiempo(cita)}
      </div>
      <div className="detalles-agenda">
        <div className="cliente-agenda">
         <p> Cliente: {cita.cliente.nombre} {cita.cliente.apellido}</p>
          <p>Descripcion: {cita.motivo}</p>
        </div>
      </div>
      <div className="estado-agenda">
        <span className={`etiqueta-estado ${cita.estado}`}>
          {cita.estado === 'confirmado' ? 'Confirmado' : 'Pendiente'}
        </span>
      </div>
    </div>
  );
};

export default AgendaDiaria;