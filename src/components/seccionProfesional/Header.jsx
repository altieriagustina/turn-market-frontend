import React from 'react';
import Logout from '../Logout';

const Header = () => {
  return (
    <header className="encabezado-panel">
      <div className="izquierda-encabezado">
        <span className="logo-app">Turn Market - Perfil profesional</span>
      </div>
      <div className="derecha-encabezado" >
        <Logout />
      </div>
    </header>
  );
};

export default Header;