import React from 'react'
import './seccionHistorial.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'



export const SeccionHistorial = () => {

    const { id } = useParams()
    const idNum = Number(id)
    const navigate = useNavigate()

    const [solicitudesTurnos, setSolicitudesTurnos] = useState([]);
    const [turnoAceptado, setTurnoAceptado] = useState([]);
    const [turnosRechazados, setTurnosRechazados] = useState([]);

    useEffect(() => {
        const traerTurnos = async () => {
            const res = await fetch(`http://localhost:3000/turn/user/${idNum}`);
            console.log(res)
            const misTurnos = await res.json()
            console.log(misTurnos)

            //lleno los useState dependiendo el estado del turno
            setSolicitudesTurnos(misTurnos.filter(t => t.estado === "pendiente"))
            setTurnoAceptado(misTurnos.filter(t => t.estado === "confirmado"))
            setTurnosRechazados(misTurnos.filter(t => t.estado === "rechazado"))
        };

        traerTurnos();
    }, []);



    return (
        <div className='contenedor-historial'>

            <Link className='link'><button onClick={() => navigate(-1)} id='btn-volver-historial' className='btn-volver'>← Volver</button></Link>

            <h1>Mi historial de turnos</h1>

            <div className='contenedor-estadisticas'>
                <div className='contenedor-card-estadistica'>
                    <p>{solicitudesTurnos.length + turnoAceptado.length + turnosRechazados.length}</p>
                    Turnos totales
                </div>

                <div className='contenedor-card-estadistica'>
                    <p>{turnoAceptado.length}</p>
                    Confirmados
                </div>

                <div className='contenedor-card-estadistica'>
                    <p>{turnosRechazados.length}</p>
                    Rechazados
                </div>
            </div>



            {solicitudesTurnos.length === 0 ? (
                <p>No tenés turnos pendientes</p>
            ) :
                (solicitudesTurnos.map((turno) => (
                    <div className='contenedor-turnos'>
                        <div className='contenedor-card-turno'>
                            <p>{turno.profesional.nombre} {turno.profesional.apellido}</p>
                            <p>{turno.fecha_hora}</p>
                            <p>{turno.estado}</p>
                        </div>
                    </div>
                )))}





        </div>
    )
}
