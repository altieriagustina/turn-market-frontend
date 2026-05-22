import React, { useState } from "react";
import Boton from "./botonRoles/Boton";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const navegar = useNavigate();

  // Estado para email y nueva contraseña
  const [datos, setDatos] = useState({
    email: "",
    code: "",
    password: ""
  });;

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

  const handleSendCode = async () => {

    if (!datos.email) {
      setError("Ingresá un email");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:3000/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: datos.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al enviar código");
        return;
      }

      await Swal.fire({
        title: "Código enviado",
        text: "Revisá tu correo electrónico.",
        icon: "success",
        confirmButtonColor: "rgba(0, 89, 255, 1)"
      });

    } catch (err) {
      console.error(err);

      setError(
        "No se pudo enviar el código."
      );
    }
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

      const response = await fetch(
        "http://localhost:3000/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: datos.email,
            code: datos.code,
            password: datos.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al actualizar contraseña");
        return;
      }

      await Swal.fire({
        title: "Contraseña actualizada",
        text: "Tu contraseña fue cambiada correctamente.",
        icon: "success",
        confirmButtonColor: "rgba(0, 89, 255, 1)"
      });

      navegar("/");

    } catch (err) {
      console.error(err);

      setError(
        "Ocurrió un error. Intenta nuevamente."
      );
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

          <button
            type="button"
            className="primary-btn"
            onClick={handleSendCode}
            style={{ marginBottom: "15px" }}
          >
            Enviar código
          </button>

          {/* Código de recuperación */}
          <label className="field-label">Código de recuperación</label>

          <div className="input-wrap">
            <img
              src="./src/assets/forgot.svg"
              alt="codigo"
              className="input-icon"
            />

            <input
              className="input-field"
              type="text"
              placeholder="Ingresá el código recibido"
              name="code"
              value={datos.code}
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