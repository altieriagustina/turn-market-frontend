import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import './Horarios.css'
import Swal from 'sweetalert2';
import Calendario from '../calendario/Calendario';

const formatHour = (h) => `${h < 10 ? "0" : ""}${h}:00`;

//modifica el formato de horario para poder filtrar el json
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};


const Horarios = ({ selectedDate, onTimeSelect }) => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(null);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  //prueba chat
  //un estado para lo que escribe el usuario y otro para vaciar el input
  const [chat, setChat] = useState("")
  const [mensaje, setMensaje] = useState("")

  const handleChange = (e) => {
    setChat(e.target.value)
  }

  //el mensaje esta en "chat", lo seteo a "mensaje"para luego el chat dejarlo vacio y que se limpie el input
  const handleSubmit = (e) => {
    e.preventDefault()
    setMensaje(chat)
    setChat("")
  }

  const { id } = useParams();
  const profesionalId = Number(id);

  if (!selectedDate) navigate("/"); // Seguridad simple

  const addDb = async (timeStr) => {

    const turno = {
      profesionalId: Number(profesionalId),
      clienteId: Number(usuario.id),
      fecha_hora: `${formatDate(selectedDate)}T${timeStr}:00`,
      motivo: mensaje

    }
    const res = await fetch("http://localhost:3000/turn", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(turno)
    })}


    const arrHoras = [];
  for (let h = 8; h <= 20; h++) arrHoras.push(h);


  const handleTime = async (hour) => {
    const timeStr = formatHour(hour);
    const fechaStr = formatDate(selectedDate) //guardo en una constante el horario modificado

    setSelectedTime(timeStr);
    onTimeSelect(timeStr);
    addDb(timeStr)
    navigate("/confirmacion")

  };



  return (
    <div className='contenedor-horarios'>

      <div className="time-selector-container">
        <button onClick={() => navigate(-1)} className='btn-volver'>← Volver</button>

        <h3 className='header-mensaje'>Estas pidiendo un turno para el {selectedDate.toLocaleDateString()}</h3>

        <h3>Envia un motivo de tu turno y luego selecciona un horario</h3>
        <div className='contenedor-input'>
          <form onSubmit={handleSubmit}>
            <input className="input-motivo" type="text"
              onChange={handleChange}
              placeholder='Descripcion sobre el motivo del turno...'
              value={chat}
            />
            <button className='btn-enviar' type='submit'>Enviar motivo</button>
          </form>

        </div>

        <h3 className='mensaje-seleccionar'>Selecciona un horario</h3>

        <div className="time-grid">
          {arrHoras.map((h) => (
            <button
              key={h}
              className="time-button"
              onClick={() => handleTime(h)}
            >
              {formatHour(h)}
            </button>

          ))}

        </div>

      </div>


    </div>
  );
}

export default Horarios;
