import React from 'react';

const ElementoCancelacion = ({ cancelacion, onReprogramar }) => {
  return (
    console.log(cancelacion),
    <div className="item-cancelacion">
      <div className="info-cliente">
        <div className="avatar">{cancelacion.avatar}</div>
        <div className="detalles-cliente">
          <div className="nombre-cliente">{cancelacion.nombre} {cancelacion.apellido}</div>
          <div className="detalles-cita">
            {cancelacion.fecha_hora}
          </div>
        </div>
      </div>
      <div className="estado-acciones">
        <span className="etiqueta-estado cancelado">Cancelado</span>
        <div className="botones-accion">
          <button 
            className="boton boton-secundario"
            onClick={() => onReprogramar(cancelacion.id)}
          >
            <span className="icono">↻</span> Reprogramar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementoCancelacion;
