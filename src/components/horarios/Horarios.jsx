import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import './Horarios.css'

const formatHour = (h) => `${h < 10 ? "0" : ""}${h}:00`;

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatLocalISO = (date, timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(hours).padStart(2, '0');
  const minute = String(minutes).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
};

const Horarios = ({ selectedDate, onTimeSelect }) => {

  const navigate = useNavigate();

  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotsOcupados, setSlotsOcupados] = useState(new Set());

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [descripcionInput, setDescripcionInput] = useState("");
  const [descripcionServicio, setDescripcionServicio] = useState("");
  const [descripcionConfirmada, setDescripcionConfirmada] = useState(false);

  const { id } = useParams();
  const profesionalId = Number(id); // Este es el profile ID

  useEffect(() => {
    if (!selectedDate) {
      navigate("/");
    }
  }, [selectedDate, navigate]);

  // Fetch turnos confirmados y calcular slots bloqueados
  useEffect(() => {
    if (!selectedDate || !profesionalId) return;

    const fetchTurnosConfirmados = async () => {
      try {
        // Primero obtenemos el perfil para conseguir el user ID del profesional
        const profileRes = await fetch(`https://turn-market-backend.onrender.com/professional-profile/${profesionalId}`);
        const profile = await profileRes.json();
        const usuarioId = profile.user?.id;
        if (!usuarioId) return;

        // Ahora sí buscamos los turnos con el user ID correcto
        const res = await fetch(`https://turn-market-backend.onrender.com/turn/professional/${usuarioId}`);
        const data = await res.json();

        const fechaSeleccionada = formatDate(selectedDate);

        const turnosDelDia = (data.confirmados || []).filter(turno => {
          return turno.fecha_hora.substring(0, 10) === fechaSeleccionada;
        });

        const bloqueados = new Set();

        turnosDelDia.forEach(turno => {
          const horaInicio = Number(turno.fecha_hora.substring(11, 13));

          if (!turno.horaFin) {
            bloqueados.add(horaInicio);
            return;
          }

          const [finH, finM] = turno.horaFin.split(':').map(Number);
          const finDecimal = finH + finM / 60;

          for (let h = 8; h <= 20; h++) {
            if (h >= horaInicio && h < finDecimal) {
              bloqueados.add(h);
            }
          }
        });

        setSlotsOcupados(bloqueados);
      } catch (error) {
        console.error('Error al cargar turnos confirmados:', error);
      }
    };

    fetchTurnosConfirmados();
  }, [selectedDate, profesionalId]);

  const handleChange = (e) => {
    setDescripcionInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descripcionInput.trim()) return;
    setDescripcionServicio(descripcionInput);
    setDescripcionConfirmada(true);
    setDescripcionInput("");
  };

  const addDb = async (timeStr) => {
    const turno = {
      profesionalId: Number(profesionalId),
      clienteId: Number(usuario.id),
      fecha_hora: formatLocalISO(selectedDate, timeStr),
      descripcionServicio: descripcionServicio,
      duracionEstimada: null,
      bufferDescanso: 0,
      horaFin: null,
      motivo: descripcionServicio,
    };

    const res = await fetch("https://turn-market-backend.onrender.com/turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turno)
    });

    const data = await res.json();
    console.log(data);
    
    // Si la respuesta no es exitosa, lanzar un error
    if (!res.ok) {
      const error = new Error(data.message || 'Error al crear el turno');
      error.status = res.status;
      error.data = data;
      throw error;
    }
    
    return data;
  };

  const arrHoras = [];
  for (let h = 8; h <= 20; h++) {
    arrHoras.push(h);
  }

  const handleTime = async (hour) => {
    if (loading) return;

    if (!descripcionConfirmada) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta la descripción y dirección',
        text: 'Por favor escribí y confirmá la descripción del servicio y tu dirección antes de elegir un horario.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setLoading(true);

    try {
      const timeStr = formatHour(hour);
      setSelectedTime(timeStr);
      onTimeSelect(timeStr);
      await addDb(timeStr);
      navigate("/confirmacion");
    } catch (error) {
      console.log(error);
      
      // Mostrar mensaje de error al usuario
      let titulo = 'Error al crear el turno';
      let mensaje = error.message || 'Hubo un error al procesar tu solicitud';
      
      // Si es un error de solapamiento
      if (error.status === 409 || error.data?.tipo === 'SOLAPAMIENTO_TURNO') {
        titulo = 'Horario no disponible';
        mensaje = error.message || 'Este horario se solapa con otro turno confirmado';
      }
      
      Swal.fire({
        icon: 'error',
        title: titulo,
        text: mensaje,
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='contenedor-horarios'>

      <div className="time-selector-container">

        <button onClick={() => navigate(-1)} className='btn-volver'>
          ← Volver
        </button>

        <h3 className='header-mensaje'>
          Estás pidiendo un turno para el {selectedDate.toLocaleDateString()}
        </h3>

        <h3>
          Describí brevemente el motivo del turno y direccion de tu domicilio para que el profesional pueda prepararse para tu visita.
        </h3>

        <div className='contenedor-input'>
          <form onSubmit={handleSubmit}>
            <input
              className="input-motivo"
              type="text"
              onChange={handleChange}
              placeholder='Descripción del servicio que necesitás y direccion...'
              value={descripcionInput}
            />
            <button className='btn-enviar' type='submit'>
              Confirmar
            </button>
          </form>

          <div className='descripcion-confirmada'>
            {descripcionConfirmada && (
              <p style={{ color: 'green', marginTop: '8px', fontWeight: 500 }}>
                ✓ Descripción guardada: "{descripcionServicio}"
              </p>
            )}
          </div>
        </div>

        <h3 className='mensaje-seleccionar'>Seleccioná un horario</h3>

        <div className="time-grid">
          {arrHoras.map((h) => {
            const ocupado = slotsOcupados.has(h);
            return (
              <button
                key={h}
                className={`time-button ${ocupado ? 'ocupado' : ''}`}
                onClick={() => handleTime(h)}
                disabled={loading || ocupado}
                title={ocupado ? 'Horario no disponible' : formatHour(h)}
              >
                {formatHour(h)}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Horarios;
