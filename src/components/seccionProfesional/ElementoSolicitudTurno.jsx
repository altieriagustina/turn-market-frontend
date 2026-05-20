import React from 'react';

const ElementoSolicitudTurno = ({ solicitud, onAceptar, onRechazar, onCancelar }) => {
  return (
    <div className="item-solicitud">
      <div className="info-cliente">
        <div className="avatar">{solicitud.avatar}</div>
        <div className="detalles-cliente">
          <div className="nombre-cliente">{solicitud.cliente.nombre} {solicitud.cliente.apellido}</div>
          <div className="detalles-cita">
            <span className="chip-tiempo">{solicitud.fecha_hora}</span>
            <span className="chip-tiempo">Motivo: {solicitud.motivo}</span>
            
          </div>
        </div>
      </div>
      
      <div className="estado-acciones">
        <span className={`etiqueta-estado ${solicitud.estado}`}>
          {solicitud.estado === "pendiente" ? "Pendiente" : "Confirmado"}
        </span>
        <div className="botones-accion">
          {solicitud.estado === "pendiente" ? (
            <>
              <button 
                className="boton boton-secundario"
                onClick={() => onRechazar(solicitud.id)}
              >
                Rechazar
              </button>
              <button 
                className="boton boton-primario"
                onClick={() => onAceptar(solicitud.id)}
              >
                Aceptar
              </button>
            </>
          ) : (
            <button 
              className="boton boton-secundario"
              onClick={() => onCancelar(solicitud.id)}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementoSolicitudTurno;

// const ElementoSolicitudTurno = ({ solicitud, onAceptar, onRechazar, onCancelar }) => {
//   return (
//     <div className="item-solicitud">
//       <div className="info-cliente">
//         <div className="avatar">{solicitud.avatar}</div>
//         <div className="detalles-cliente">
//           <div className="nombre-cliente">{solicitud.nombreCliente}</div>
//           <div className="detalles-cita">
//             <span className="chip-tiempo">{solicitud.fecha}</span>
//             <span>{solicitud.servicio}</span>
//           </div>
//         </div>
//       </div>
      
//       <div className="estado-acciones">
//         <span className={`etiqueta-estado ${solicitud.estado}`}>
//           {solicitud.estado === "pendiente" ? "Pendiente" : "Confirmado"}
//         </span>
//         <div className="botones-accion">
//           {solicitud.estado === "pendiente" ? (
//             <>
//               <button 
//                 className="boton boton-secundario"
//                 onClick={() => onRechazar(solicitud.id)}
//               >
//                 Rechazar
//               </button>
//               <button 
//                 className="boton boton-primario"
//                 onClick={() => onAceptar(solicitud.id)}
//               >
//                 Aceptar
//               </button>
//             </>
//           ) : (
//             <button 
//               className="boton boton-secundario"
//               onClick={() => onCancelar(solicitud.id)}
//             >
//               Cancelar
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ElementoSolicitudTurno;