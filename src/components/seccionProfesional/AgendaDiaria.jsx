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

const formatFechaHoraLocal = (fechaHora) => {
  const fecha = new Date(fechaHora);
  const dia = fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia} ${hh}:${mm}`;
};

const ElementoAgenda = ({ cita }) => {
  console.log('Cita:', cita);
  return (
    <div className="item-agenda">
      <div className="tiempo-agenda">
        {formatFechaHoraLocal(cita.fecha_hora)}
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