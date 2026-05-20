import Calendario from "./components/calendario/Calendario";
import Horarios from "./components/horarios/Horarios";
import Confirmacion from "./components/confirmacion/Confirmacion";
import { PantallaCliente } from './components/seccionClientes/PantallaCliente'
import { PantallaProfesionales } from './components/CardProfesionales/PantallaProfesionales'
import Login from "./components/Login.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import SignUp from "./components/SignUp.jsx";
import { Route, Routes } from 'react-router-dom'
import { Turnos } from './components/Turnos'
import AuthLayout from '../src/layouts/AuthLayout.jsx';
import "../src/Style.css";
import { useState } from "react";
import PanelProfesional from "./components/seccionProfesional/PanelProfesional.jsx";
import { MiPerfil } from "./components/seccionMiPerfil/MiPerfil.jsx";
import { SeccionHistorial } from "./components/seccionHistorial/SeccionHistorial.jsx";


function App() {

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  //cree una url dinamica, :nombre va a cambiar segun la card que elije
  return (
    <>
      <Routes>
        <Route path="/calendario/:id" element={<Calendario onDateSelect={(date) => setSelectedDate(date)} />} />
        <Route path="/horarios/:id" element={<Horarios selectedDate={selectedDate} onTimeSelect={(time) => setSelectedTime(time)} />} />
        <Route path="/confirmacion" element={<Confirmacion finalSelection={{ date: selectedDate, time: selectedTime }} />} />
        <Route path="/turnos" element={<Turnos></Turnos>}></Route>
        <Route path="/clientes" element={<PantallaCliente></PantallaCliente>}></Route>
        <Route path="/profesion/:profesion" element={<PantallaProfesionales />}></Route>
        <Route path="/panelprofesional" element={<PanelProfesional></PanelProfesional>}></Route>
        <Route path="/miPerfil/:id" element={<MiPerfil></MiPerfil>}></Route>
        <Route path="/historial/:id" element={<SeccionHistorial/>}></Route>

        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
