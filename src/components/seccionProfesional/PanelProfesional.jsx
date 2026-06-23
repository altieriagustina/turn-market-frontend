
import React, { useState, useEffect } from "react";
import Header from "./Header";
import TarjetaSolicitudesTurnos from "./TarjetaSolicitudesTurnos";
import AgendaDiaria from "./AgendaDiaria";
import TarjetaCancelaciones from "./TarjetaCancelaciones";
import TarjetaTurnosRechazados from "./TarjetaTurnosRechazados";
import "./PanelProfesional.css"
import Logout from "../Logout";
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'


const PanelProfesional = () => {
  // Obtengo el profesional del localstorage
  //Obtengo su id (el signo de pregunta evita errores de null o undefined)
  const profesional = JSON.parse(localStorage.getItem("usuario"));
  const idProfesional = profesional?.id;

  // estados para las 3 secciones de la pagina
  const [solicitudesTurnos, setSolicitudesTurnos] = useState([]);
  const [citasDiarias, setCitasDiarias] = useState([]);
  const [turnosRechazados, setTurnosRechazados] = useState([]);

  // traigo los turnos de la base de datos de Turn
  useEffect(() => {
    const traerTurnos = async () => {
      const res = await fetch(`https://turn-market-backend.onrender.com/turn/professional/${idProfesional}`);
      const data = await res.json();
      console.log(data)

      // separo los turnos segun el estado del turno
      setSolicitudesTurnos(data.pendientes);
      setCitasDiarias(data.confirmados);
      setTurnosRechazados(data.rechazados);
    };

    traerTurnos();
  }, [idProfesional]);

  console.log("solicitud turno:", solicitudesTurnos);

  // Función para actualizar estado en DB
  //modifica solamente la clave "estado" al valor que tenga nuevoEstado y en la url filtro el turno por id para cambiar solo el turno que corresponda
  //devuelve { ok, status, data } para que quien la llama pueda reaccionar si la actualización falló (ej: conflicto de horario)
  const actualizarTurno = async (id, nuevoEstado, estimacion = {}) => {
    const res = await fetch(`https://turn-market-backend.onrender.com/turn/turnos/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado, ...estimacion })
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      data = null;
    }

    if (!res.ok) {
      return { ok: false, status: res.status, data };
    }

    //elimina de la lista el turno al que quiero actualizarle el estado. (crea un nuevo array sin el id que sacamos)
    const actualizarEstados = (turnos) => turnos.filter(t => t.id !== id);
    //guardo el turno que estoy moviendo
    const turno = solicitudesTurnos.find(t => t.id === id) || turnosRechazados.find(t => t.id === id);

    //uso el parametro del actualizarTurno y segun el estado seteo el turno que guarde anteriormente con find()
    //con prev dejo los turnos que hay, y aparte agrego el nuevo turno cambiando su estado
    if (nuevoEstado === "confirmado") {
      setCitasDiarias(prev => [...prev, { ...turno, ...estimacion, estado: "confirmado" }]);
      setSolicitudesTurnos(prev => actualizarEstados(prev));
    }
    if (nuevoEstado === "rechazado") {
      setTurnosRechazados(prev => [...prev, { ...turno, estado: "rechazado" }]);
      setSolicitudesTurnos(prev => actualizarEstados(prev));
    }

    if (nuevoEstado === "pendiente") {
      setSolicitudesTurnos(prev => [...prev, { ...turno, estado: "pendiente" }]);
      setTurnosRechazados(prev => prev.filter(t => t.id !== id));
    }

    return { ok: true, status: res.status, data };
  };

  // Funciones para pasar a los componentes
  const manejarAceptar = async (id, estimacion) => {
    const resultado = await actualizarTurno(id, "confirmado", estimacion);

    if (resultado.ok) return;

    // Conflicto de horario: el backend detectó que se superpone con otro turno ya confirmado
    if (resultado.status === 409) {
      const mensaje = resultado.data?.message || "El horario elegido se superpone con otro turno ya confirmado.";

      const eleccion = await Swal.fire({
        icon: 'warning',
        title: 'Horario no disponible',
        text: mensaje,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Rechazar este turno',
        denyButtonText: 'Proponer otro horario',
        cancelButtonText: 'Volver',
        confirmButtonColor: '#dc2626',
        denyButtonColor: '#6366f1',
      });

      if (eleccion.isConfirmed) {
        const rechazo = await actualizarTurno(id, "rechazado", {
          motivoRechazo: `Turno no disponible: ${mensaje}`,
        });
        if (rechazo.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Turno rechazado',
            text: 'Se rechazó el turno indicando que el horario no estaba disponible.',
            timer: 2200,
            showConfirmButton: false,
          });
        }
      } else if (eleccion.isDenied) {
        Swal.fire({
          icon: 'info',
          title: 'Próximamente',
          text: 'Proponer un nuevo horario todavía no está disponible. Por ahora podés rechazar el turno o coordinar el cambio manualmente con el cliente.',
        });
      }
      return;
    }

    // Cualquier otro error inesperado
    Swal.fire({
      icon: 'error',
      title: 'No se pudo confirmar el turno',
      text: resultado.data?.message || 'Ocurrió un error al confirmar el turno. Intentá nuevamente.',
    });
  };

  const manejarRechazar = id => actualizarTurno(id, "rechazado");

   const manejarRestaurarRechazado = async (id) => {
    // busco solo en rechazados
    const turno = turnosRechazados.find(t => t.id === id);
    if (!turno) return;

    //actualizo el estado a pendiente nuevamente
    await fetch(`https://turn-market-backend.onrender.com/turn/turnos/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "pendiente" })
    });

    //seteo turnos rechazados y soliitudes turnos para que vaya a donde corresponde
    //van 2 spread operator: los que ya estaban  y el turno
    setTurnosRechazados(prev => prev.filter(t => t.id !== id));
    setSolicitudesTurnos(prev => [...prev, { ...turno, estado: "pendiente" }]);
  };

  return (    
<>
    <div className="panel-profesional">

      <div className="contenedor-cerrar-sesion">
        {/* <Logout></Logout> */}
        <div className="btn-logout" >
                            {/* <Logout /> */}
                            <Link to={`/`}><img className='botones' src='https://cdn.pixabay.com/photo/2016/03/31/14/48/off-1292831_640.png' alt="Cerrar sesion" /></Link>
                            <Link to={`/miPerfil/${idProfesional}`}><img className='botones' src='https://cdn-icons-png.flaticon.com/512/9187/9187604.png' alt="Mi Perfil" /></Link>
                        </div>
      </div>
     
      
      <div className="contenido-panel">
        
        <TarjetaSolicitudesTurnos 
          solicitudes={solicitudesTurnos}
          onAceptar={manejarAceptar}
          onRechazar={manejarRechazar}
        />

        <AgendaDiaria citasDiarias={citasDiarias} />

        {/* <TarjetaCancelaciones 
          cancelaciones={cancelaciones}
          onReprogramar={(id) => alert(`Reprogramar turno ${id}`)}
        /> */}

        <TarjetaTurnosRechazados 
          turnosRechazados={turnosRechazados}
          onRestaurar={manejarRestaurarRechazado}
        />
      </div>
    </div>
    </>
  );

};

export default PanelProfesional;



















// import React, { useState } from 'react';
// import Header from './Header';
// import TarjetaSolicitudesTurnos from './TarjetaSolicitudesTurnos';
// import AgendaDiaria from './AgendaDiaria';
// import TarjetaCancelaciones from './TarjetaCancelaciones';
// import TarjetaTurnosRechazados from './TarjetaTurnosRechazados';
// import './PanelProfesional.css';

// const PanelProfesional = () => {
//   const [solicitudesTurnos, setSolicitudesTurnos] = useState([
//     {
//       id: 1,
//       nombreCliente: "María García",
//       fecha: "Jue 14:30",
//       servicio: "Corte y peinado",
//       estado: "pendiente",
//       avatar: "MG"
//     },
//     {
//       id: 2,
//       nombreCliente: "Carlos López",
//       fecha: "Vie 10:00",
//       servicio: "Corte masculino",
//       estado: "pendiente",
//       avatar: "CL"
//     },
//     {
//       id: 3,
//       nombreCliente: "Ana Rodríguez",
//       fecha: "Vie 16:45",
//       servicio: "Coloración",
//       estado: "confirmado",
//       avatar: "AR"
//     }
//   ]);

//   const [cancelaciones, setCancelaciones] = useState([
//     {
//       id: 1,
//       nombreCliente: "Pedro Lima",
//       fecha: "Ayer 09:15",
//       servicio: "Coloración",
//       estado: "cancelado",
//       motivo: "imprevisto de último momento",
//       avatar: "PL"
//     }
//   ]);

//   //estado para los rechazados
//   const [turnosRechazados, setTurnosRechazados] = useState([]);

//   //Estado para la agenda del día
//   const [citasDiarias, setCitasDiarias] = useState([
//     {
//       id: 101,
//       nombreCliente: "Juan Pérez",
//       hora: "9:30",
//       servicio: "Corte masculino",
//       estado: "confirmado",
//       avatar: "JP"
//     },
//     {
//       id: 102,
//       nombreCliente: "María García",
//       hora: "11:00",
//       servicio: "Corte y peinado",
//       estado: "confirmado",
//       avatar: "MG"
//     },
//     {
//       id: 103,
//       nombreCliente: "Carlos López",
//       hora: "14:30",
//       servicio: "Coloración",
//       estado: "pendiente",
//       avatar: "CL"
//     },
//     {
//       id: 104,
//       nombreCliente: "Ana Rodríguez",
//       hora: "16:45",
//       servicio: "Tratamiento capilar",
//       estado: "confirmado",
//       avatar: "AR"
//     }
//   ]);

//   // Función para manejar la aceptación de una solicitud
//   const manejarAceptar = (id) => {
//     const solicitudAceptada = solicitudesTurnos.find(solicitud => solicitud.id === id);
    
//     setSolicitudesTurnos(prev => 
//       prev.map(solicitud => 
//         solicitud.id === id ? {...solicitud, estado: "confirmado"} : solicitud
//       )
//     );

//     //Si se acepta una solicitud, agregarla a la agenda del día
//     if (solicitudAceptada) {
//       // Convertir la fecha de "Vie 16:45" a formato de hora "16:45"
//       const hora = solicitudAceptada.fecha.split(' ')[1];
      
//       setCitasDiarias(prev => [
//         ...prev,
//         {
//           ...solicitudAceptada,
//           hora: hora,
//           estado: "confirmado"
//         }
//       ]);
//     }
//   };

//   // Función para manejar el rechazo de una solicitud
//   const manejarRechazar = (id) => {
//     const solicitudRechazada = solicitudesTurnos.find(solicitud => solicitud.id === id);
//     if (solicitudRechazada) {
//       // Agregar a la lista de rechazados
//       setTurnosRechazados(prev => [
//         ...prev,
//         {
//           ...solicitudRechazada,
//           estado: "rechazado",
//           fechaRechazo: new Date().toLocaleDateString('es-ES', { 
//             weekday: 'short', 
//             hour: '2-digit', 
//             minute: '2-digit' 
//           })
//         }
//       ]);
//       // Remover de las solicitudes
//       setSolicitudesTurnos(prev => 
//         prev.filter(solicitud => solicitud.id !== id)
//       );
//     }
//   };

//   // Función para manejar la cancelación de un turno confirmado
//   const manejarCancelar = (id) => {
//     const solicitudCancelada = solicitudesTurnos.find(solicitud => solicitud.id === id);
//     if (solicitudCancelada) {
//       // Agregar a la lista de cancelaciones
//       setCancelaciones(prev => [
//         ...prev,
//         {
//           ...solicitudCancelada,
//           estado: "cancelado",
//           motivo: "Cancelado por el profesional",
//           fecha: new Date().toLocaleDateString('es-ES', { 
//             weekday: 'short', 
//             hour: '2-digit', 
//             minute: '2-digit' 
//           })
//         }
//       ]);
//       // Remover de las solicitudes
//       setSolicitudesTurnos(prev => 
//         prev.filter(solicitud => solicitud.id !== id)
//       );
      
//       //También remover de la agenda si estaba allí
//       setCitasDiarias(prev => 
//         prev.filter(cita => cita.id !== id)
//       );
//     }
//   };

//   // Función para manejar la reprogramación de una cancelación
//   const manejarReprogramar = (id) => {
//     alert(`Reprogramar cita ${id}`);
//   };

//   // Función para restaurar un turno rechazado
//   const manejarRestaurarRechazado = (id) => {
//     const solicitudRestaurada = turnosRechazados.find(solicitud => solicitud.id === id);
//     if (solicitudRestaurada) {
//       // Agregar de nuevo a las solicitudes pendientes
//       setSolicitudesTurnos(prev => [
//         ...prev,
//         {
//           ...solicitudRestaurada,
//           estado: "pendiente",
//           fechaRechazo: undefined
//         }
//       ]);
      
//       setTurnosRechazados(prev => 
//         prev.filter(solicitud => solicitud.id !== id)
//       );
//     }
//   };

//   return (
//     <div className="panel-profesional">
//       <Header />
//       <div className="contenido-panel">
//         <TarjetaSolicitudesTurnos 
//           solicitudes={solicitudesTurnos}
//           onAceptar={manejarAceptar}
//           onRechazar={manejarRechazar}
//           onCancelar={manejarCancelar}
//         />
        
//         <AgendaDiaria citasDiarias={citasDiarias} />
        
//         <TarjetaCancelaciones 
//           cancelaciones={cancelaciones}
//           onReprogramar={manejarReprogramar}
//         />
//         <TarjetaTurnosRechazados 
//           turnosRechazados={turnosRechazados}
//           onRestaurar={manejarRestaurarRechazado}
//         />
//       </div>
//     </div>
//   );
// };

// export default PanelProfesional;