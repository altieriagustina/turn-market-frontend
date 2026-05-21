import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './Horarios.css'

const formatHour = (h) => `${h < 10 ? "0" : ""}${h}:00`;

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const Horarios = ({ selectedDate, onTimeSelect }) => {

  const navigate = useNavigate();

  const [selectedTime, setSelectedTime] = useState(null);

  // evita doble envío
  const [loading, setLoading] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [chat, setChat] = useState("");
  const [mensaje, setMensaje] = useState("");

  const { id } = useParams();
  const profesionalId = Number(id);

  useEffect(() => {

    if (!selectedDate) {
      navigate("/");
    }

  }, [selectedDate, navigate]);



  const handleChange = (e) => {
    setChat(e.target.value);
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    setMensaje(chat);
    setChat("");
  };



  const addDb = async (timeStr) => {

    const turno = {
      profesionalId: Number(profesionalId),
      clienteId: Number(usuario.id),
      fecha_hora: `${formatDate(selectedDate)}T${timeStr}:00`,
      motivo: mensaje
    };

    const res = await fetch("http://localhost:3000/turn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(turno)
    });

    const data = await res.json();

    console.log(data);

    return data;
  };



  const arrHoras = [];

  for (let h = 8; h <= 20; h++) {
    arrHoras.push(h);
  }



  const handleTime = async (hour) => {

    // evita doble click
    if (loading) return;

    setLoading(true);

    try {

      const timeStr = formatHour(hour);

      setSelectedTime(timeStr);

      onTimeSelect(timeStr);

      // espera que se guarde
      await addDb(timeStr);

      navigate("/confirmacion");

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };



  return (
    <div className='contenedor-horarios'>

      <div className="time-selector-container">

        <button
          onClick={() => navigate(-1)}
          className='btn-volver'
        >
          ← Volver
        </button>

        <h3 className='header-mensaje'>
          Estas pidiendo un turno para el {selectedDate.toLocaleDateString()}
        </h3>

        <h3>
          Envia un motivo de tu turno y luego selecciona un horario
        </h3>

        <div className='contenedor-input'>

          <form onSubmit={handleSubmit}>

            <input
              className="input-motivo"
              type="text"
              onChange={handleChange}
              placeholder='Descripcion sobre el motivo del turno...'
              value={chat}
            />

            <button
              className='btn-enviar'
              type='submit'
            >
              Enviar motivo
            </button>

          </form>

        </div>

        <h3 className='mensaje-seleccionar'>
          Selecciona un horario
        </h3>

        <div className="time-grid">

          {arrHoras.map((h) => (

            <button
              key={h}
              className="time-button"
              onClick={() => handleTime(h)}
              disabled={loading}
            >
              {formatHour(h)}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Horarios;