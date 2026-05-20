import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

export const Turnos = () => {

    const [solicitudesTurnos, setSolicitudesTurnos] = useState([]);
    const [turnoAceptado, setTurnoAceptado] = useState([]);
    const [turnosRechazados, setTurnosRechazados] = useState([]);

    const cliente = JSON.parse(localStorage.getItem("usuario"));
    const idCliente = ciente?.id // OJO QUEDÓ MAL ESCRITO CLIENTE

    const [turnos, setTurnos] = useState([])

    useEffect(() => {
        const traerTurnos = async () => {
            const res = await fetch("http://localhost:4000/turnos");
            const data = await res.json();

            // comparo el id del profesional con el id del turno para que coincida y se le muestre a la persona que corresponde
            const misTurnos = data.filter(turno => turno.clienteId === idCliente);

            setSolicitudesTurnos(misTurnos.filter(t => t.estado === "pendiente"))
            setTurnoAceptado(misTurnos.filter(t => t.estado === "aceptado"))
            setTurnosRechazados(misTurnos.filter(t => t.estado === "rechazado"))            
        };

        traerTurnos();
    }, [idCliente]);



    return (
        <div>
            <h2>Mis turnos</h2>

            {solicitudesTurnos.map(s => (
                <ul>
                    <li>{s}</li>
                </ul>
            ))}
        </div>
    )
}
