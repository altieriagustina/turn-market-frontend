import React from "react";

const Boton = ({ nombreBtn, icono, onClick, active = false }) => {
  return (
    <button
      type="button"
      className={`role-btn ${active ? "role-btn--active" : ""}`}
      onClick={onClick}
    >
      <span className="role-icon">{icono}</span>
      <span className="role-text">{nombreBtn}</span>
    </button>
  );
};

export default Boton;