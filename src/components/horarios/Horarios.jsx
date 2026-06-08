import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import './Horarios.css'

const formatHour = (h) => `${h < 10 ? "0" : ""}${h}:00`;

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
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
        const profileRes = await fetch(`http://localhost:3000/professional-profile/${profesionalId}`);
        const profile = await profileRes.json();
        const usuarioId = profile.user?.id;
        if (!usuarioId) return;

        // Ahora sí buscamos los turnos con el user ID correcto
        const res = await fetch(`http://localhost:3000/turn/professional/${usuarioId}`);
        const data = await res.json();

        const fechaSeleccionada = formatDate(selectedDate);

        const turnosDelDia = (data.confirmados || []).filter(turno => {
          const fechaTurno = turno.fecha_hora.split('T')[0];
          return fechaTurno === fechaSeleccionada;
        });

        const bloqueados = new Set();

        turnosDelDia.forEach(turno => {
          const inicio = new Date(turno.fecha_hora);
          const horaInicio = inicio.getHours();

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
      fecha_hora: `${formatDate(selectedDate)}T${timeStr}:00`,
      descripcionServicio: descripcionServicio,
      duracionEstimada: null,
      bufferDescanso: 0,
      horaFin: null,
      motivo: descripcionServicio,
    };

    const res = await fetch("http://localhost:3000/turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    if (loading) return;

    if (!descripcionConfirmada) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta la descripción',
        text: 'Por favor escribí y confirmá la descripción del servicio antes de elegir un horario.',
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
          Describí el servicio que necesitás y luego seleccioná un horario
        </h3>

        <div className='contenedor-input'>
          <form onSubmit={handleSubmit}>
            <input
              className="input-motivo"
              type="text"
              onChange={handleChange}
              placeholder='Descripción del servicio que necesitás...'
              value={descripcionInput}
            />
            <button className='btn-enviar' type='submit'>
              Confirmar descripción
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
