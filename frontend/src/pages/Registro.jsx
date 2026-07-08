// Control de versiones - Issue #10
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        password: '',
        telefono: '',
        rol: '',
        aceptaAviso: false
    });

    const [errores, setErrores] = useState({});
    const [mensajeServidor, setMensajeServidor] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
        if (!formData.apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios.";
        if (!formData.correo.trim()) nuevosErrores.correo = "El correo electrónico es obligatorio.";
        if (formData.password.length < 8) nuevosErrores.password = "La contraseña debe tener un mínimo de 8 caracteres.";
        if (!formData.rol) nuevosErrores.rol = "Debes seleccionar si usarás la app como Estudiante o Vendedor.";
        if (!formData.aceptaAviso) nuevosErrores.aceptaAviso = "Debes aceptar el Aviso de Privacidad para registrarte.";

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeServidor('');

        if (!validarFormulario()) return;

        try {
            // Petición al backend corriendo en el puerto 3000
            const respuesta = await axios.post('http://localhost:3000/api/auth/register', {
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                correo: formData.correo,
                password: formData.password,
                telefono: formData.telefono,
                rol: formData.rol
            });

            alert(respuesta.data.message);
            navigate('/'); // Redirige al Login tras el registro exitoso

        } catch (error) {
            if (error.response && error.response.data) {
                setMensajeServidor(error.response.data.message);
            } else {
                setMensajeServidor("Error al conectar con el servidor.");
            }
        }
    };

    return (
        <div className="registro-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Panel Izquierdo Informativo */}
            <div className="panel-izquierdo" style={{ backgroundColor: '#0B3C95', color: '#fff', width: '40%', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2>Crea tu cuenta en ComedorU</h2>
                <p>Únete para acceder a menús, reservar pedidos y disfrutar de una experiencia más rápida.</p>
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '30px' }}>
                    <li style={{ marginBottom: '15px' }}>✓ Registro sencillo en pocos pasos</li>
                    <li style={{ marginBottom: '15px' }}>✓ Perfil personalizado</li>
                    <li style={{ marginBottom: '15px' }}>✓ Historial de pedidos y reseñas</li>
                </ul>
            </div>

            {/* Panel Derecho del Formulario */}
            <div className="panel-derecho" style={{ width: '60%', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <h1 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Registro</h1>
                <p style={{ color: '#6c757d', marginBottom: '25px' }}>Completa tus datos para comenzar.</p>

                {mensajeServidor && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '15px' }}>{mensajeServidor}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
                    
                    {/* Nombre */}
                    <div>
                        <label style={{ display: 'block', fontWeight: '500' }}>Nombre *</label>
                        <input type="text" name="nombre" className="form-control" placeholder="Tu nombre" value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
                        {errores.nombre && <span style={{ color: 'red', fontSize: '12px' }}>{errores.nombre}</span>}
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label style={{ display: 'block', fontWeight: '500' }}>Apellidos *</label>
                        <input type="text" name="apellidos" className="form-control" placeholder="Tus apellidos" value={formData.apellidos} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
                        {errores.apellidos && <span style={{ color: 'red', fontSize: '12px' }}>{errores.apellidos}</span>}
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                        <label style={{ display: 'block', fontWeight: '500' }}>Correo electrónico *</label>
                        <input type="email" name="correo" className="form-control" placeholder="tu@correo.com" value={formData.correo} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
                        {errores.correo && <span style={{ color: 'red', fontSize: '12px' }}>{errores.correo}</span>}
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label style={{ display: 'block', fontWeight: '500' }}>Contraseña *</label>
                        <input type="password" name="password" className="form-control" placeholder="Min. 8 caracteres" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
                        {errores.password && <span style={{ color: 'red', fontSize: '12px' }}>{errores.password}</span>}
                    </div>

                    {/* Teléfono Celular (Opcional) */}
                    <div>
                        <label style={{ display: 'block', fontWeight: '500' }}>Teléfono celular (Opcional)</label>
                        <input type="text" name="telefono" className="form-control" placeholder="Ej. 4181234567" value={formData.telefono} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
                        <small style={{ color: '#6c757d', display: 'block', marginTop: '4px' }}>* Únicamente requerido para activar verificación en dos pasos (2FA) o alertas de entrega.</small>
                    </div>

                    {/* Selección de Rol Restringido */}
                    <div>
                        <label style={{ display: 'block', fontWeight: '500' }}>¿Cómo usarás la plataforma? *</label>
                        <select name="rol" className="form-control" value={formData.rol} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da', backgroundColor: 'white' }}>
                            <option value="">-- Selecciona tu rol --</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Vendedor">Vendedor</option>
                        </select>
                        {errores.rol && <span style={{ color: 'red', fontSize: '12px' }}>{errores.rol}</span>}
                    </div>

                    {/* Aviso de Privacidad */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
                        <input type="checkbox" name="aceptaAviso" id="aceptaAviso" checked={formData.aceptaAviso} onChange={handleChange} />
                        <label htmlFor="aceptaAviso">Acepto el aviso de privacidad. *</label>
                    </div>
                    {errores.aceptaAviso && <span style={{ color: 'red', fontSize: '12px' }}>{errores.aceptaAviso}</span>}

                    {/* Botón de Registro */}
                    <button type="submit" style={{ backgroundColor: '#2563EB', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        Registrarse
                    </button>
                </form>

                {/* Enlaces de Navegación Inferiores */}
                <div style={{ marginTop: '20px', fontSize: '14px' }}>
                    <Link to="/aviso-privacidad" style={{ display: 'block', color: '#2563EB', textDecoration: 'none', marginBottom: '5px' }}>Ver aviso de privacidad</Link>
                    <Link to="/" style={{ color: '#2563EB', textDecoration: 'none' }}>Ya tengo una cuenta</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;