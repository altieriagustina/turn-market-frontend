import React from "react";
import { useNavigate } from "react-router-dom";
import "./seccionClientes/pantallaPrincipal.css"

const Logout = () => {
    const navegar = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("usuario"); 
        navegar("/");               
    };

    return (
        <button className="contenedor-btn-cerrarSesion" onClick={handleLogout}>
            <img className="btn-cerrarSesion" src="https://cdn.pixabay.com/photo/2016/03/31/14/48/off-1292831_640.png"/>
        </button>
    );
};

export default Logout;