import React, { useState } from "react";
import Boton from "./botonRoles/Boton";
import { PantallaCliente } from "./seccionClientes/PantallaCliente";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


const Login = () => {
    const navegar = useNavigate();

    // Estado donde se guardanlos datos del formulario y que inicia vacío(email, password)
    const [datos, setDatos] = useState({
        email: "",
        password: ""
    });

    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Estado que controla si es Cliente o Profesional, inicia en Cliente
    const [role, setRole] = useState("cliente");

    // Mensaje de error
    const [error, setError] = useState("");

    // Función que se le pasa al onChamge de los inputs para actualizar datos
    const handleChange = (e) => {
        setDatos({
            ...datos, [e.target.name]: e.target.value
        })
    }

    // Validación de la contraseña para que revise los 8 caracteres, letras y números
    const validarPassword = (pass) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(pass);
    };

    // Función que se ejecuta cuando se envía el form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la pagina se recargue


        setError(""); // OK

        // Función para consultar el si el usuario existe en el backend
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: datos.email,
                password: datos.password,
            }),
        });
        const data = await response.json();

        console.log("Registro exitoso:", {
            email: datos.email,
        });
        //si no coinciden los datos de email y password, no sigue.
        // if (data.length === 0) {

        //     // ALERTA DE USUARIO NO ENCONTRADO HECHA SWEETALERT2
        //     const result = await Swal.fire({
        //         title: 'Datos inválidos',
        //         text: 'El email o la contraseña son incorrectos.',
        //         icon: 'error',
        //         showDenyButton: true,
        //         confirmButtonText: 'Registrarse',
        //         denyButtonText: 'Intentar de nuevo',
        //         // Muestra footer que dirige a olvidaste tu contraseña. Se usa etiqueta html <a> por que SweetAlert no funciona con Link de react-router
        //         footer: '<a href="/forgotpassword" style="color: black; text-decoration: underline;">¿Olvidaste tu contraseña?</a>',
        //         // evita que se cierre al hacer click fuera del cartel
        //         allowOutsideClick: false,

        //         // Colores personalizados de la alerta
        //         confirmButtonColor: 'rgba(0, 89, 255, 1)',
        //         denyButtonColor: '#b0b0b0',
        //         background: '#ffffff',
        //         color: '#333',
        //     });

        //     // Si el usuario elige la opción de registrarse navega a signup
        //     if (result.isConfirmed) {
        //         navegar('/signup'); // QUEDÓ MAL ESTA RUTA EN EL TP ENVIADO REDIRIGE A LOGIN EN VEZ DE SIGNUP
        //         return;
        //     }
        // }

        // //significa el primer y unico usuario que coincidio en la busqueda
        // const usuarioLogueado = data[0];


        if (!response.ok) {
            await Swal.fire({
                title: 'Datos inválidos',
                text: 'El email o la contraseña son incorrectos.',
                icon: 'error',
                showDenyButton: true,
                confirmButtonText: 'Registrarse',
                denyButtonText: 'Intentar de nuevo',
                // Muestra footer que dirige a olvidaste tu contraseña. Se usa etiqueta html <a> por que SweetAlert no funciona con Link de react-router
                footer: '<a href="/forgotpassword" style="color: black; text-decoration: underline;">¿Olvidaste tu contraseña?</a>',
                // evita que se cierre al hacer click fuera del cartel
                allowOutsideClick: false,

                // Colores personalizados de la alerta
                confirmButtonColor: 'rgba(0, 89, 255, 1)',
                denyButtonColor: '#b0b0b0',
                background: '#ffffff',
                color: '#333',
            });
            return;
        }

        const usuarioLogueado = data;

        // GUardo JWT
        localStorage.setItem(
            "token",
            usuarioLogueado.access_token
        );

        // Guardo usuario
        localStorage.setItem(
            "usuario",
            JSON.stringify(usuarioLogueado.user)
        );

        // Asegura que la selección del boton coincida con el rol del usuario que se está logueando
        if (usuarioLogueado.user.rol !== role) {
            // Si el rol no coincide lanza una alerta de SweetAlert2
            await Swal.fire({
                title: 'Rol incorrecto',
                text: 'El rol seleccionado no coincide con tu tipo de cuenta.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                allowOutsideClick: false,
                confirmButtonColor: 'rgba(0, 89, 255, 1)',
                background: '#ffffff',
                color: '#333'
            });
            return;
        }

        // Navegación según el rol del usuario sea profesional o cliente
        if (usuarioLogueado.user.rol === "profesional") {
            navegar("/panelprofesional"); // Ruta de ejemplo para profesional. HAY QUE CAMBIARLAS LUEGO
        } else if (usuarioLogueado.user.rol === "cliente") {
            navegar("/clientes"); // Ruta de ejemplo para cliente. HAY QUE CAMBIARLAS LUEGO
        }
    };

    return (
        <div className="login-page">

            {/*  HEADER */}
            <header className="login-header">
                <div className="logo-circle">
                    {/* Logo de la app */}
                    <img src="./src/assets/repeat.svg" alt="Logo Turn Market" className="logo-icon" />
                </div>

                {/* Título de la app */}
                <h1 className="site-title">Turn Market</h1>
            </header>

            {/* Card ppal (contenedor blanco) */}
            <main className="login-card">

                {/* Seccion roles */}
                <div className="role-section">
                    <p className="role-label">Iniciar sesión como</p>

                    {/* Contenedor de los dos botones: Cliente y Profesional */}
                    <div className="role-toggle">

                        {/* Botón Cliente */}
                        <Boton

                            active={role === "cliente"}
                            onClick={() => setRole("cliente")}
                            icono={<img src="./src/assets/person.svg" alt="Icono cliente" className="btn-icon" />}
                            nombreBtn="Cliente"
                        />

                        {/* Botón Profesional */}
                        <Boton
                            active={role === "profesional"}
                            onClick={() => setRole("profesional")}
                            icono={<img src="./src/assets/briefcase.svg" alt="Icono profesional" className="btn-icon" />}
                            nombreBtn="Profesional"
                        />
                    </div>
                    <div className="role-note">Accede a tus proyectos, mensajes y facturas según tu rol</div>
                </div>

                {/* Línea divisoria */}
                <hr className="divider" />

                {/* Formulario de Login */}
                <form className="login-form" onSubmit={handleSubmit}>

                    {/* Campo email */}
                    <label className="field-label">Correo electrónico</label>
                    <div className="input-wrap">
                        {/* Icono enail */}
                        <img src="./src/assets/envelope.svg" alt="email" className="input-icon" />
                        <input
                            className="input-field"
                            type="email"
                            placeholder="nombre@correo.com"
                            name="email"
                            value={datos.email || ""}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Campo contraseña */}
                    <label className="field-label">Contraseña</label>
                    <div className="input-wrap password-wrap">

                        {/*Icono candado*/}
                        <img
                            src="./src/assets/lock.svg"
                            alt="password"
                            className="input-icon"
                        />

                        <input
                            className="input-field"
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            name="password"
                            value={datos.password || ""}
                            onChange={handleChange}
                        />

                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img
                                src={
                                    showPassword
                                        ? "./src/assets/eye-slash.svg"
                                        : "./src/assets/eye.svg"
                                }
                                alt="toggle password"
                                className="toggle-password-icon"
                            />
                        </button>
                    </div>

                    {/* Mostrar error si existe (renderizado condicional) */}
                    {error && <p className="error-text" style={{ color: "red", marginTop: "5px" }}>{error}</p>}

                    {/* Texto de guia ESTO AL FINAL NO VA
                    <p className="helper-text">La contraseña debe contener al menos 8 caracteres y combinar  letras y números.</p>*/}

                    {/* Boton principal de inicio de sesion */}
                    <button type="submit" className="primary-btn">
                        <img src="./src/assets/login.svg" alt="login" className="btn-left-icon" />
                        Iniciar sesión
                    </button>

                    {/* Footer del form con los links que dirigen a las otras screens*/}
                    <div className="form-footer">
                        <Link to="/forgotpassword" className="muted-link">¿Olvidaste tu contraseña?</Link>
                        <Link to="/signup" className="muted-link">Registrarse</Link>
                    </div>
                </form>
            </main>

            {/* Footer fuera de la card */}
            <footer className="login-footer">
                Copyright Turn Market
            </footer>
        </div>
    );
};

export default Login;