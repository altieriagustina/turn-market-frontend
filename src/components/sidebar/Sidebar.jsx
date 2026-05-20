import React, { useState } from 'react'
import "./sidebar.css"
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

export const Sidebar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const cliente = JSON.parse(localStorage.getItem("usuario"));
    const idCliente = cliente?.id


    return (
        <>

        <button className={`toggle-button ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
        </button>


            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>

                <div className='contenedor-logo'>
                    <img
                        src="./src/assets/repeat.svg"
                        alt="Logo Turn Market"
                        className="logo-icon-principal"
                    />
                    <h4>Turn Market</h4>
                </div>

                <nav className='nav-sidebar'>
                    <h5>Menu</h5>
                    <ul className='contenedor-ul-nav'>
                        <li className='nav-item'><Link className='nav-item-link' to={`/clientes`}>Inicio</Link></li>
                        <li className='nav-item'><Link className='nav-item-link' to={`/historial/${idCliente}`}>Mis turnos</Link></li>
                        <li className='nav-item'><Link className='nav-item-link' to={`/miPerfil/${idCliente}`}>Mi perfil</Link></li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}
