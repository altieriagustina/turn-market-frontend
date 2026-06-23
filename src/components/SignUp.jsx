import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Boton from "./botonRoles/Boton";

const SignUp = () => {

  // Hook para redirigir al usuario después del registro
  const navigate = useNavigate();

  // estado para los campos
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    profesion: "",
    direccion: "",
    precio_min: "",
    precio_max: "",
  });

  // rol: "cliente" o "profesional"
  const [role, setRole] = useState("cliente");

  // mensajes de error y registro exitoso
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);


  // validación contraseña 8 caracteres, letras y números
  const validarPassword = (pass) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(pass);
  };

  // validación de teléfono solo dígitos y entre 6 y 15 cifras
  const validarTelefono = (tel) => {
    const regex = /^\d{10}$/;
    return regex.test(tel);
  };

  // Función que se le pasa al onChamge de los inputs para actualizar datos
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Función que se ejecuta cuando se envía el form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // comprobaciones que verifican que no queden campos vacios (.trim verifica que no haya espacios vacios antes y despues del texto)
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return;
    }

    if (!validarTelefono(form.telefono.trim())) {
      setError("El teléfono debe tener 10 dígitos.");
      return;
    }

    if (role === "profesional" && !form.profesion.trim()) {
      setError("Debes indicar tu profesión u oficio.");
      return;
    }

    if (role === "profesional" && (!form.precio_min || !form.precio_max)) {
      setError("Seleccioná el rango de precio en el que trabajás.");
      return;
    }

    if (!form.email.trim()) {
      setError("El email es obligatorio.");
      return;
    }

    if (!validarPassword(form.password)) {
      setError("La contraseña debe tener mínimo 8 caracteres y combinar letras y números.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        email: form.email,
        password: form.password,
        rol: role,
        profesion: role === "profesional" ? form.profesion : undefined,
        precio_min: role === "profesional" ? form.precio_min : undefined,
        precio_max: role === "profesional" ? form.precio_max : undefined,
        direccion: role === "profesional" ? form.direccion : undefined,
      }; // acá camnbio solo role por rol: role para que coicida con el BE


      // Si el rol es profesional, agrego profesión
      // if (role === "profesional") {
      //   payload.profesion = form.profesion;
      //   payload.precioMin = form.precioMin;
      //   payload.precioMax = form.precioMax;
      // }

      const res = await fetch('https://turn-market-backend.onrender.com/user', { // Debería ser la URL de tu backend para crear usuarios
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();

        const mensaje = Array.isArray(errorData.message)
          ? errorData.message[0]
          : errorData.message;

        throw new Error(mensaje || "Error al registrar usuario");
      }

      const saved = await res.json();
      console.log("Registro guardado:", saved);

      setSuccess(true);
      setError("");
      
      // Redirigir al usuario a la página de login después de un registro exitoso
      setTimeout(() => {
        navigate("/");
      }, 1500); // Redirige después de 1.5 segundos para que el usuario vea el mensaje de éxito
      
      setForm({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        password: "",
        confirmPassword: "",
        profesion: "",
        direccion: "",
        precioMin: "",
        precioMax: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

  };

  return (
    <div>
      <header className="login-header">
        <div className="logo-circle">
          <img
            src="./src/assets/repeat.svg"
            alt="Logo Turn Market"
            className="logo-icon"
          />
        </div>
        <h1 className="site-title">Crear cuenta</h1>
      </header>

      <main className="login-card">
        <section className="role-section">
          <p className="role-label">Registrarse como</p>
          <div className="role-toggle">
            <Boton
              active={role === "cliente"}
              onClick={() => setRole("cliente")}
              icono={<img src="/src/assets/person.svg" alt="Icono cliente" className="btn-icon" />}
              nombreBtn="Cliente"
            />
            <Boton
              active={role === "profesional"}
              onClick={() => setRole("profesional")}
              icono={<img src="/src/assets/briefcase.svg" alt="Icono profesional" className="btn-icon" />}
              nombreBtn="Profesional"
            />
          </div>
        </section>

        <hr className="divider" />

        <form className="login-form" onSubmit={handleSubmit}>

          {/* Nombre */}
          <label className="field-label">Nombre</label>
          <div className="input-wrap">
            <img src="/src/assets/person.svg" alt="nombre" className="input-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Tu nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Apellido */}
          <label className="field-label">Apellido</label>
          <div className="input-wrap">
            <img src="/src/assets/person.svg" alt="apellido" className="input-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Tu apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
          </div>

          {/* Teléfono */}
          <label className="field-label">Teléfono</label>
          <div className="input-wrap">
            <img src="/src/assets/telephone.svg" alt="tel" className="input-icon" />
            <input
              className="input-field"
              type="tel"
              placeholder="Ej: 542983467812"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </div>

          {/* Profesión u Oficio y Rango de precios (sólo en singUp progesionales) */}
          {role === "profesional" && (
            <>
              <label className="field-label field-label--spaced">Profesión u Oficio</label>
              <div className="input-wrap select-wrap">
                <img src="./src/assets/briefcase.svg" alt="profesion" className="input-icon" />
                <select
                  className="input-field select-field"
                  name="profesion"
                  value={form.profesion}
                  onChange={handleChange}
                  required={role === "profesional"}
                  aria-label="profesion"
                >
                  <option value="">Seleccioná tu profesión</option>
                  <option value="psicologos">Psicologos</option>
                  <option value="kinesiologos">Kinesiologos</option>
                  <option value="nutricionistas">Nutricionistas</option>
                  <option value="dentistas">Dentistas</option>
                  <option value="peluqueros">Peluqueros</option>
                  <option value="tatuadores">Tatuadores</option>
                  <option value="plomeros">Plomeros</option>
                  <option value="albañiles">Albañiles</option>
                </select>
              </div>

              {/*Rango de precios */}
              <label className="field-label field-label--spaced">Rango de precio</label>
              <div className="input-wrap select-wrap">
                <img src="./src/assets/wallet.svg" alt="rango precio" className="input-icon" />
                <input
                  className="input-field"
                  type="number"
                  placeholder="precio minimo"
                  name="precio_min"
                  value={form.precio_min}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-wrap select-wrap">
                <img src="./src/assets/wallet.svg" alt="rango precio" className="input-icon" />
                <input
                  className="input-field"
                  type="number"
                  placeholder="precio maximo"
                  name="precio_max"
                  value={form.precio_max}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className="field-label">Dirección</label>
              <div className="input-wrap">
                <img src="./src/assets/direccion.svg" alt="direccion" className="input-icon" id="direccion-icon" />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Dirección (calle, número)"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  required />
              </div>

            </>
          )}


          {/* Email */}
          <label className="field-label">Correo electrónico</label>
          <div className="input-wrap">
            <img src="/src/assets/envelope.svg" alt="email" className="input-icon" />
            <input
              className="input-field"
              type="email"
              placeholder="nombre@correo.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <label className="field-label">Contraseña</label>
          <div className="input-wrap password-wrap">
            <img src="/src/assets/lock.svg" alt="password" className="input-icon" />
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={
                  showPassword
                    ? "./src/assets/eye.svg"
                    : "./src/assets/eye-slash.svg"
                }
                alt="toggle password"
                className="toggle-password-icon"
              />
            </button>
          </div>

          {/* Confirmar password */}
          <label className="field-label">Repetir contraseña</label>
          <div className="input-wrap">
            <img src="/src/assets/lock.svg" alt="confirm" className="input-icon" />
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <p className="helper-text">La contraseña debe tener mínimo 8 caracteres y combinar letras y números.</p>

          {/* Mensajes de estado: si hay un error muestra el mensaje correspondiente, sino muestra registro exitoso*/}
          {error && <p className="helper-text" style={{ color: "red", marginBottom: 8 }}>{error}</p>}
          {success && <p className="helper-text" style={{ color: "green", marginBottom: 8 }}>Registro exitoso.</p>}

          <button type="submit" className="primary-btn">
            <img src="/src/assets/login.svg" alt="signup" className="btn-left-icon" />
            Crear cuenta
          </button>

          <div className="form-footer">
            <Link to="/" className="muted-link">Volver al inicio</Link>
            <Link to="/forgotpassword" className="muted-link">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      </main>

      <footer className="login-footer">Copyright Turn Market</footer>
    </div>
  );
};

export default SignUp;