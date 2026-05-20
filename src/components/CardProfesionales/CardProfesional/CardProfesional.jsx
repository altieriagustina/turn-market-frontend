import React from 'react'
import "./cardProfesional.css"
import { Link } from 'react-router-dom'

export const CardProfesional = ({ nombre, precio, id}) => {
    return (
        <div>
            <div className='contenedor-card-profesional'>

                <div className='contenedor-foto-nombre'>
                    <img className='imagen-card-persona' src="https://cdn-icons-png.flaticon.com/512/456/456212.png" alt="foto-persona" />

                    <h3 className='nombre-persona'>{nombre}</h3>
                </div>

                <p className='rango-precio'>Rango del presupuesto: ${precio}</p>
                {/*state lleva los datos a la url de to y se recibe con location */}
                <Link className='link' to={`/calendario/${id}`}><button className='btn-turno'>Pedir turno</button></Link>
            </div>
        </div>
    )
}
