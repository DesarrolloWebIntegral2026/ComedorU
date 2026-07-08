import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css'; // Importamos tus nuevos estilos limpios y profesionales

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        correo: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const respuesta = await axios.post('http://localhost:3000/api/auth/login', {
                correo: formData.correo,
                password: formData.password
            });

            const { user } = respuesta.data; 
            localStorage.setItem('usuario', JSON.stringify(user));
            alert(respuesta.data.message);
            navigate('/dashboard');

        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("Error al conectar con el servidor.");
            }
        }
    };

    return (
        <div className="login-container">
            {/* Panel Izquierdo Informativo */}
            <div className="login-panel-left">
                <h2>Bienvenido a ComedorU</h2>
                <p>Ingresa para consultar los menús del día, gestionar tus platillos o realizar pedidos de manera rápida y centralizada.</p>
            </div>

            {/* Panel Derecho del Formulario */}
            <div className="login-panel-right">
                <div className="login-form-wrapper">
                    <h1>Iniciar Sesión</h1>
                    <p className="login-subtitle">Ingresa tus credenciales para acceder al panel.</p>

                    {error && <div className="login-error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
                            <label>Correo electrónico *</label>
                            <input 
                                type="email" 
                                name="correo" 
                                className="login-input"
                                placeholder="tu@correo.com" 
                                value={formData.correo} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="login-field">
                            <label>Contraseña *</label>
                            <input 
                                type="password" 
                                name="password" 
                                className="login-input"
                                placeholder="Tu contraseña" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <button type="submit" className="login-btn-submit">
                            Ingresar al Sistema
                        </button>
                    </form>

                    <div className="login-footer-links">
                        <span>¿No tienes una cuenta? </span>
                        <Link to="/registro" className="login-link">Regístrate aquí</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;