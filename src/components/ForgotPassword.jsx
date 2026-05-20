import React, { useState } from "react";
import Boton from "./botonRoles/Boton";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const navegar = useNavigate();

  // Estado para email y nueva contraseña
  const [datos, setDatos] = useState({
    email: "",
    password: ""
  });

  // Rol seleccionado
  const [role, setRole] = useState("cliente");

  // Error visual
  const [error, setError] = useState("");

  // Actualizar inputs
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  // validación contraseña 8 caracteres, letras y números
  const validarPassword = (pass) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(pass);
  };

  // SUBMIT – actualiza la contraseña en db.json
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validarPassword(datos.password)) {
      setError("La contraseña debe tener mínimo 8 caracteres y combinar letras y números.");
      return;
    }

    try {
      // Buscar usuario por email
      const resp = await fetch(
        `http://localhost:4000/usuarios?email=${encodeURIComponent(datos.email)}`
      );
      const data = await resp.json();

      if (data.length === 0) {
        setError("No existe un usuario con ese correo.");
        return;
      }

      const usuario = data[0];

      // Verificar si coincide el rol seleccionado
      if (usuario.role !== role) {
        await Swal.fire({
          title: "Rol incorrecto",
          text: "El rol seleccionado no coincide con tu tipo de cuenta.",
          icon: "error",
          confirmButtonColor: "rgba(0, 89, 255, 1)"
        });
        return;
      }

      // PATCH —> actualiza solo la contraseña
      await fetch(`http://localhost:4000/usuarios/${usuario.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: datos.password })
      });

      // Alerta de sweetalert2 que muestra cambio exitoso
      await Swal.fire({
        title: "Contraseña actualizada",
        text: "Tu contraseña fue cambiada correctamente.",
        icon: "success",
        confirmButtonColor: "rgba(0, 89, 255, 1)"
      });

      // Una vez termina el proceso redirige a login
      navegar("/");

    } catch (err) {
      console.error(err);
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <div className="login-page">

      {/* Header */}
      <header className="login-header">
        <div className="logo-circle">
          {/* Logo de la app */}
          <img src="./src/assets/repeat.svg" alt="Logo Turn Market" className="logo-icon" />
        </div>
        <h1 className="site-title">Actualizá tu contraseña</h1>
      </header>

      {/* Card */}
      <main className="login-card">

        {/* Roles */}
        <div className="role-section">
          <p className="role-label">Selecciona tu rol</p>

          <div className="role-toggle">

            <Boton
              active={role === "cliente"}
              onClick={() => setRole("cliente")}
              icono={<img src="./src/assets/person.svg" alt="cliente" className="btn-icon" />}
              nombreBtn="Cliente"
            />

            <Boton
              active={role === "profesional"}
              onClick={() => setRole("profesional")}
              icono={<img src="./src/assets/briefcase.svg" alt="profesional" className="btn-icon" />}
              nombreBtn="Profesional"
            />
          </div>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>

          {/* Email */}
          <label className="field-label">Correo electrónico</label>
          <div className="input-wrap">
            <img src="./src/assets/envelope.svg" alt="email" className="input-icon" />
            <input
              className="input-field"
              type="email"
              placeholder="nombre@correo.com"
              name="email"
              value={datos.email}
              onChange={handleChange}
            />
          </div>

          {/* Nueva contraseña */}
          <label className="field-label">Nueva contraseña</label>
          <div className="input-wrap">
            <img src="./src/assets/lock.svg" alt="password" className="input-icon" />
            <input
              className="input-field"
              type="password"
              placeholder="Ingresá tu nueva contraseña"
              name="password"
              value={datos.password}
              onChange={handleChange}
            />
          </div>

          {/* Si se detecta algún error muestra el mensaje de error correspondiente */}
          {error && <p className="error-text" style={{ color: "red", marginTop: "5px" }}>{error}</p>}

          {/* Boton de actualizar */}
          <button type="submit" className="primary-btn">
            <img src="./src/assets/forgot.svg" alt="guardar" className="btn-left-icon" />
            Actualizar contraseña
          </button>

          {/* Footer */}
          <div className="form-footer">
            <Link to="/" className="muted-link">Volver al inicio</Link>
          </div>
        </form>
      </main>

      <footer className="login-footer">
        Copyright Turn Market
      </footer>
    </div>
  );
};

export default ForgotPassword;