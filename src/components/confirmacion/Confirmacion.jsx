import React from 'react';
import { useNavigate } from "react-router-dom";
import './Confirmacion.css'

const Confirmacion = ({ finalSelection }) => {
  const navigate = useNavigate();

  if (!finalSelection.date) navigate("/");

  return (
    <div className="confirm-container">
      <h2>Turno pendiente</h2>
      <p>Fecha: {finalSelection.date.toLocaleDateString()}</p>
      <p>Hora: {finalSelection.time}</p>

      <button onClick={() => navigate("/clientes")}>
        Volver
      </button>
    </div>
  );
};

export default Confirmacion;
