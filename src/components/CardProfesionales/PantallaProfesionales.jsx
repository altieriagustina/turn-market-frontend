import React, { useEffect, useState } from 'react'
import { CardProfesional } from './CardProfesional/CardProfesional'
import "./pantallaProfesional.css"
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'

export const PantallaProfesionales = () => {

  //hooks que permite leer el valor de la url dinamica
  const { profesion } = useParams();

  //estado para guardar todas las personas registradas en la db
  const [personas, setPersonas] = useState([])

  //traigo las personas de la db y la seteo al estado
  let traerUsuarios = async () => {
    const response = await fetch(
      `https://turn-market-backend.onrender.com/professional-profile?profesion=${profesion}`); 
    const personas = await response.json();
    setPersonas(personas)
  }

  useEffect(() => {
    traerUsuarios()
  }, [])


  //creo una constante en donde:
  //filtro la db donde estan las personas su profesion
  //y comparo con los que coincidan con la profesion, que es el valor que obtiene de la url dinamica
  //por lo tanto, guarda la profesiones que coincida en filtrados.
  //por ultimo mapeo filtrados para mostrar las cads
  const filtrados = personas.filter((p) => p.profesion?.toLowerCase() === profesion.toLowerCase());

  return (
    <div className='contenedor-pantalla-profesionales'>
      <div className='contenedor-volver-atras'>
        <Link className='link' to="/clientes"> <button className='btn-volver'>← Volver</button></Link>
        <p>Profesionales • {profesion} </p>
      </div>

      {/*cree el componente cardProfesional con props: nombre,precio,id y estas las obtengo de la db(filtrados), 
      imagen esta predefinida en el componente cardProfesional*/}

      <div className='contenedor-card-personas'>
      
        {/* Renderizado condicional se muestra cartel si no hay profesionales de un rubro */}
        {filtrados.length === 0 ? (
          <p className="mensaje-vacio">
            No se han encontrado profesionales en este rubro
          </p>
        ) : (
          filtrados.map((p) => (
            <CardProfesional
              key={p.id}
              id={p.id}
              nombre={`${p.user?.nombre} ${p.user?.apellido}`}
              precio={`${p.precio_min} - $${p.precio_max}`}
              direccion={p.direccion || "No especificada"}
            />
          ))
        )}
      </div>
      <div>
      </div>
    </div>
  )
}
