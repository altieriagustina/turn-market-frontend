import React from 'react'
import "./card.css"
import { Link } from 'react-router-dom'


//componente card que se renderiza en pantalla cliente con una imagen y profesion especifica 
export const Card = ({imagen, profesion}) => {
  return (
    //url dinamica - segun lo que elija el usuario redirecciona ahi
    <Link className='link' to={`/profesion/${profesion}`}>
    <div className='contenedor-card'>

        <img className='imagen-card' src={imagen} alt="" />
        <h3 className='texto-profesion-card'>{profesion}</h3>

    </div>
    </Link>
  )
}
