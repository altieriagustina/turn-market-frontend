import React from 'react';

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
const ElementoTurnoRechazado = ({ turno, onRestaurar }) => {
  return (
    <div className="item-rechazado">
      <div className="info-cliente">
        <div className="avatar">{turno.avatar}</div>
        <div className="detalles-cliente">
          <div className="nombre-cliente">{turno.cliente.nombre} {turno.cliente.apellido}</div>
          <div className="detalles-cita">
            {formatearTiempo(turno)}
          </div>
          <div className="fecha-rechazo">
            {turno.fechaRechazo}
          </div>
        </div>
      </div>
      <div className="estado-acciones">
        <span className="etiqueta-estado rechazado">Rechazado</span>
        <div className="botones-accion">
          <button 
            className="boton boton-secundario"
            onClick={() => onRestaurar(turno.id)}
          >
            <span className="icono">↶</span> Restaurar
          </button>
        </div>
      </div>
    </div>
  );
};

// const ElementoTurnoRechazado = ({ turno, onRestaurar }) => {
//   return (
//     <div className="item-rechazado">
//       <div className="info-cliente">
//         <div className="avatar">{turno.avatar}</div>
//         <div className="detalles-cliente">
//           <div className="nombre-cliente">{turno.nombreCliente}</div>
//           <div className="detalles-cita">
//             {turno.fecha} • {turno.servicio}
//           </div>
//           <div className="fecha-rechazo">
//             Rechazado: {turno.fechaRechazo}
//           </div>
//         </div>
//       </div>
//       <div className="estado-acciones">
//         <span className="etiqueta-estado rechazado">Rechazado</span>
//         <div className="botones-accion">
//           <button 
//             className="boton boton-secundario"
//             onClick={() => onRestaurar(turno.id)}
//           >
//             <span className="icono">↶</span> Restaurar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

export default ElementoTurnoRechazado;