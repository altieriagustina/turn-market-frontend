import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './perfil.css'
import Swal from "sweetalert2"
import { Link } from 'react-router-dom'

export const MiPerfil = () => {
  const navigate = useNavigate()
  const { id } = useParams(); //obtengo el id del usuario por parametro
  const idNum = Number(id)
  const [usuario, setUsuario] = useState(null) // estado para guardar la info del usuario que traigo del backend
  const [perfilProfesional, setPerfilProfesional] = useState(null) // perfil profesional asociado al usuario
  const [editar, setEditar] = useState(false) // estado para controlar si los campos del perfil estan habilitados para editar o no
  const [eliminado, setEliminado] = useState(false) // estado para controlar si el perfil fue eliminado o no, para redirigir al usuario a la pantalla de registro/login

  //obtengo la info del usuario y, si es profesional, también su perfil profesional con dirección
  const traerDatosUsuario = async () => {
    try {
      const res = await fetch(`http://localhost:3000/user/${idNum}`)
      if (!res.ok) {
        setEliminado(true)
        return
      }
      const data = await res.json()
      if (!data || !data.id) {
        setEliminado(true)
        return
      }
      setUsuario(data)

      if (data.rol === 'profesional') {
        const perfilRes = await fetch(`http://localhost:3000/professional-profile/user/${idNum}`)
        if (perfilRes.ok) {
          const perfilData = await perfilRes.json()
          setPerfilProfesional(perfilData)
          setUsuario(prev => ({ ...prev, direccion: perfilData?.direccion ?? '' }))
        }
      }
    } catch (error) {
      console.log(error)
      setEliminado(true)
    }
  }


  const actualizarPerfil = async () => {
    if (!editar) {
      setEditar(true)
      return
    }

    try {
      const result = await Swal.fire({
        title: '¿Deseas guardar los cambios?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
        cancelButtonText: 'No, cancelar cambios'
      })

      if (!result.isConfirmed) {
        setEditar(false)
        traerDatosUsuario() //si el usuario cancela la confirmacion, vuelvo a traer los datos del usuario para descartar los cambios realizados en los campos
        return
      }

      await fetch(`http://localhost:3000/user/${idNum}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
        })
      })

      if (usuario.rol === 'profesional' && perfilProfesional?.id) {
        await fetch(`http://localhost:3000/professional-profile/${perfilProfesional.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            direccion: usuario.direccion,
          })
        })
      }

      setEditar(false)
    } catch (error) {
      console.log(error)
    }
  }

  const eliminarPerfil = async () => {

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/user/${idNum}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        Swal.fire(
          '¡Eliminado!',
          'Tu perfil ha sido eliminado.',
          'success',
        )
        setEliminado(true) //marco el perfil como eliminado
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    traerDatosUsuario()
  }, [])

  if (eliminado) {
    return (
      <div className='contenedor-perfil'>
        <div className='contenedor-caja-perfil'>
          <p className='perfil-eliminado'>El perfil fue eliminado</p>
          <Link className='link' to="/"> <button className='btn-volver-historial'>← Volver a inicio</button></Link>
        </div>
      </div>
    )
  }

  if (!usuario) {

    return (
      <div className='contenedor-perfil'>
        <h1>Mi Perfil</h1>

        <div className='contenedor-caja-perfil'>
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    )
  }

  return (

    <div className='contenedor-perfil'>

      <Link className='link'><button onClick={() => navigate(-1)} className='btn-volver'>← Volver</button></Link>

      <div className='contenedor-caja-perfil'>

        <h1>Mi perfil</h1>

        <p>Gestiona tu información personal y datos de contacto</p>

        <div className='contenedor-datos-txt'>

          <p className='p-titulo-datos'>Nombre</p>

          <input
            type="text"
            value={usuario.nombre}
            disabled={!editar}
            onChange={(e) =>
              setUsuario({
                ...usuario,
                nombre: e.target.value
              })
            }
          />

        </div>

        <div className='contenedor-datos-txt'>

          <p className='p-titulo-datos'>Apellido</p>

          <input
            type="text"
            value={usuario.apellido}
            disabled={!editar}
            onChange={(e) =>
              setUsuario({
                ...usuario,
                apellido: e.target.value
              })
            }
          />

        </div>

        <div className='contenedor-datos-txt'>

          <p className='p-titulo-datos'>Email</p>

          <input
            type="email"
            value={usuario.email}
            disabled={!editar}
            onChange={(e) =>
              setUsuario({
                ...usuario,
                email: e.target.value
              })
            }
          />

        </div>

        <div className='contenedor-datos-txt'>

          <p className='p-titulo-datos'>Telefono</p>

          <input
            type="text"
            value={usuario.telefono}
            disabled={!editar}
            onChange={(e) =>
              setUsuario({
                ...usuario,
                telefono: e.target.value
              })
            }
          />
        </div>

        <div className='contenedor-datos-txt'>
          {usuario?.rol === 'profesional' && (
            <>
              <p className='p-titulo-datos'>Dirección</p>
              <input
                type="text"
                value={usuario.direccion || ''}
                disabled={!editar}
                onChange={(e) =>
                  setUsuario({
                    ...usuario,
                    direccion: e.target.value
                  })
                }
              />
            </>
          )}
        </div>

        <div className="contenedor-btn">

          <button
            className='btn-actualizar'
            onClick={actualizarPerfil}
          >{editar ? 'Guardar cambios' : 'Actualizar perfil'}
          </button>

          <button
            className='btn-eliminar'
            onClick={eliminarPerfil}
          >
            Eliminar perfil
          </button>

        </div>

      </div>

    </div>
  )
}