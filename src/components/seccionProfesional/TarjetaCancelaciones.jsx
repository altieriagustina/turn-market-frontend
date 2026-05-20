import React from 'react';
import ElementoCancelacion from './ElementoCancelacion';

const TarjetaCancelaciones = ({ cancelaciones, onReprogramar }) => {
  return (
    <div className="tarjeta tarjeta-cancelaciones">
      <div className="encabezado-tarjeta">
        <h2>Cancelaciones</h2>
        <span className="contador">{cancelaciones.length}</span>
      </div>
      <div className="contenido-tarjeta">
        {cancelaciones.length === 0 ? (
          <p className="sin-elementos">No hay cancelaciones recientes</p>
        ) : (
          cancelaciones.map(cancelacion => (
            <ElementoCancelacion 
              key={cancelacion.id}
              cancelacion={cancelacion}
              onReprogramar={onReprogramar}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TarjetaCancelaciones;