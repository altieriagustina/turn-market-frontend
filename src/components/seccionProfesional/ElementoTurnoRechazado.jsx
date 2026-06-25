import React from 'react';

const formatearTiempo = (cita) => {
  const fechaHora = cita.fecha_hora;

  const fechaStr = `${fechaHora.substring(8, 10)}/${fechaHora.substring(5, 7)}/${fechaHora.substring(0, 4)}`;

  const horaInicio = fechaHora.substring(11, 16);

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