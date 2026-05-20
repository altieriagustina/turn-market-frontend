import React, { useState, useEffect } from 'react'
import { Card } from "./Card/Card.jsx"
import profesiones from "./Card/profesiones.json"
import "../seccionClientes/pantallaPrincipal.css"
import Logout from '../Logout.jsx'
import { Link } from 'react-router-dom'
import { Sidebar } from '../sidebar/Sidebar.jsx'

export const PantallaCliente = () => {

    //estados para guardar los estados de los turnos
    // const [solicitudesTurnos, setSolicitudesTurnos] = useState([]);
    // const [turnoAceptado, setTurnoAceptado] = useState([]);
    // const [turnosRechazados, setTurnosRechazados] = useState([]);

    //guardo el id del cliente logueado ||| MSA ADELANTE IMPLEMENTARLO CON TOKEN 
    const cliente = JSON.parse(localStorage.getItem("usuario"));
    const idCliente = cliente?.id



    //traigo los turnos pedidos por el cliente logueado de la base de datos y los guardo en los estados dependiendo del estado del turno
    // useEffect(() => {
    //     const traerTurnos = async () => {
    //         const res = await fetch(`http://localhost:3000/turn/user/${idCliente}`);
    //         console.log(res)
    //         const misTurnos = await res.json()
    //         console.log(misTurnos)

    //         //lleno los useState dependiendo el estado del turno
    //         setSolicitudesTurnos(misTurnos.filter(t => t.estado === "pendiente"))
    //         setTurnoAceptado(misTurnos.filter(t => t.estado === "confirmado"))
    //         setTurnosRechazados(misTurnos.filter(t => t.estado === "rechazado"))
    //     };

    //     traerTurnos();
    // }, [idCliente]);


    //estado para guardar lo que ingresa el usuario
    const [busqueda, setBusqueda] = useState("")

    //obtengo el valor
    const handleChange = (e) => {
        setBusqueda(e.target.value)
    }

    //Filtro las profesiones del json que coincidan con lo que busca el usuario (uso toLowerCase para que coincidan minusculas)
    const profesionesFiltradas = profesiones.filter((prof) => prof.profesion.toLowerCase().includes(busqueda.toLowerCase()))


    return (
        <>
            

            <Sidebar/>

            <div className='contenedor-pantalla'>
                <div className="btn-logout" >
                    {/* <Logout /> */}
                    <Link to={`/`}><img className='botones' src='https://cdn.pixabay.com/photo/2016/03/31/14/48/off-1292831_640.png' alt="Cerrar sesion" /></Link>
                    <Link to={`/miPerfil/${idCliente}`}><img className='botones' src='https://cdn-icons-png.flaticon.com/512/9187/9187604.png' alt="Mi Perfil" /></Link>
                </div>

                <div className="btn-logout-responsive" >
                    <Logout />
                </div>
                <div className='contenedor-buscador'>

                    <input className='buscador-profesiones' onChange={handleChange} placeholder='Buscar una profesion...' type='text'></input>
                    <button>Buscar</button>
                </div>

                <div className='contenedor-cards'>
                    {profesionesFiltradas.map((p) => (
                        <Card imagen={p.imagen} profesion={p.profesion}></Card>
                    ))}
                </div>


                {/* <div className='contenedor-turnos'>
                    <h2 className='texto-turnos'>Mis turnos</h2>



                    {solicitudesTurnos.map(s => (
                        <ul>
                            <li>⚠️Turno pedido a {s.profesional?.nombre} {s.profesional?.apellido} para el dia {s.fecha_hora} se encuentra {s.estado}</li>
                        </ul>
                    ))}

                    {turnoAceptado.map(s => (
                        <ul>
                            <li>✅Turno pedido a {s.profesional?.nombre} {s.profesional?.apellido} para el dia {s.fecha_hora} fue {s.estado}. Ya te podes comunicar con el al {s.profesional?.telefono}</li>
                        </ul>
                    ))}

                    {turnosRechazados.map(s => (
                        <ul>
                            <li>❌Turno pedido a {s.profesional?.nombre} {s.profesional?.apellido} para el dia {s.fecha_hora} fue rechazado {s.estado}</li>
                        </ul>
                    ))}
                </div> */}
            </div>
        </>
    )
}
