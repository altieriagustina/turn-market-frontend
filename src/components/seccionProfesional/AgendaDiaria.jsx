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
  const fecha = new Date(cita.fecha_hora);

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const anio = fecha.getFullYear();
  const fechaStr = `${dia}/${mes}/${anio}`;

  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const horaInicio = `${horas}:${minutos}`;

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