import React, { useState } from 'react';

const calcularHoraFin = (fechaHora, duracion, buffer) => {
  const fecha = new Date(fechaHora);
  const totalMinutos = duracion + buffer;
  fecha.setMinutes(fecha.getMinutes() + totalMinutos);
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const formatearFechaHora = (fechaHora) => {
  const fecha = new Date(fechaHora);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${hh}:${mm}`;
};

const formatearHoraInicio = (fechaHora) => {
  const fecha = new Date(fechaHora);
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const ElementoSolicitudTurno = ({ solicitud, onAceptar, onRechazar, onCancelar }) => {

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [duracionEstimada, setDuracionEstimada] = useState(30);
  const [bufferDescanso, setBufferDescanso] = useState(0);

  const horaInicio = formatearHoraInicio(solicitud.fecha_hora);
  const horaFin = calcularHoraFin(solicitud.fecha_hora, duracionEstimada, bufferDescanso);

  const handleAceptar = () => {
    onAceptar(solicitud.id, {
      duracionEstimada,
      bufferDescanso,
      horaFin,
    });
  };

  return (
    <div className="item-solicitud">
      {console.log('Solicitud:', solicitud) }

      <div className="info-cliente">
        <div className="avatar">{solicitud.avatar}</div>
        <div className="detalles-cliente">
          <div className="nombre-cliente">
            {solicitud.cliente.nombre} {solicitud.cliente.apellido}
          </div>
          <div className="detalles-cita">
            <span className="chip-tiempo">{formatearFechaHora(solicitud.fecha_hora)}</span>
            <span className="chip-tiempo">Descripcion: {solicitud.motivo}</span>
            {solicitud.descripcionServicio && (
              <span className="chip-tiempo" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', borderRadius: '6px', padding: '2px 8px' }}>
                📋 {solicitud.descripcionServicio}
              </span>
            )}
          </div>
        </div>
      </div>

      {solicitud.estado === "pendiente" && (
        <div style={{ marginTop: '10px' }}>
          <button
            style={{ background: 'none', border: '1px solid #6366f1', color: '#6366f1', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '13px' }}
            onClick={() => setPanelAbierto(!panelAbierto)}
          >
            ⏱ {panelAbierto ? 'Cerrar estimación' : 'Estimar duración'}
          </button>

          {panelAbierto && (
            <div style={{ marginTop: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>Duración del servicio:</label>
                <select
                  value={duracionEstimada}
                  onChange={(e) => setDuracionEstimada(Number(e.target.value))}
                  style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value={30}>30 min</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1 h 30 min</option>
                  <option value={120}>2 horas</option>
                  <option value={150}>2 h 30 min</option>
                  <option value={180}>3 horas</option>
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>Buffer de descanso:</label>
                <select
                  value={bufferDescanso}
                  onChange={(e) => setBufferDescanso(Number(e.target.value))}
                  style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value={0}>Sin descanso</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                </select>
              </div>

              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                📅 El turno de las <strong>{horaInicio}</strong> finalizaría a las <strong>{horaFin}</strong>
              </p>

            </div>
          )}
        </div>
      )}

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
                onClick={handleAceptar}
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
