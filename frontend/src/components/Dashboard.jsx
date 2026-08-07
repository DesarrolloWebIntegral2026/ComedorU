import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Importamos los estilos separados

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [usuario, setUsuario] = useState(null);
    const [menus, setMenus] = useState([]);
    const [nuevoMenu, setNuevoMenu] = useState({
        titulo: '',
        descripcion: '',
        precio: ''
    });

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            cargarPerfilYMenus();
        }
    }, [token, navigate]);

    const cargarPerfilYMenus = async () => {
        try {
            const respuesta = await axios.get('http://localhost:3000/api/auth/profile', {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                },
                withCredentials: true
            });

            setUsuario(respuesta.data.user);
            cargarMenus(respuesta.data.user);
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    const cargarMenus = async (usuarioActual) => {
        try {
            let url = 'http://localhost:3000/api/menus';

            if (usuarioActual && usuarioActual.rol_id === 3) {
                url = `http://localhost:3000/api/menus/vendedor/${usuarioActual.id}`;
            }

            const respuesta = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                },
                withCredentials: true
            });
            setMenus(respuesta.data);
        } catch (error) {
            console.error("Error al cargar menús desde la API:", error);
        }
    };

    const handleSubirMenu = async (e) => {
        e.preventDefault();

        if (!nuevoMenu.titulo.trim() || !nuevoMenu.descripcion.trim() || !nuevoMenu.precio) {
            alert('Por favor completa todos los campos antes de publicar el menú.');
            return;
        }

        if (isNaN(Number(nuevoMenu.precio)) || Number(nuevoMenu.precio) <= 0) {
            alert('El precio debe ser un número mayor a 0.');
            return;
        }

        try {
            if (!usuario) {
                alert('No se pudo identificar al usuario. Por favor inicia sesión de nuevo.');
                navigate('/');
                return;
            }

            await axios.post('http://localhost:3000/api/menus', {
                vendedor_id: usuario.id,
                titulo: nuevoMenu.titulo,
                descripcion: nuevoMenu.descripcion,
                precio: parseFloat(nuevoMenu.precio)
            }, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                },
                withCredentials: true
            });

            alert("¡Menú publicado con éxito en la plataforma!");
            setNuevoMenu({ titulo: '', descripcion: '', precio: '' }); // Limpiar campos
            cargarMenus(usuario); // Recargar la lista con el usuario actual
        } catch (error) {
            alert("Error al subir el menú.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!usuario) return null;

    return (
        <div className="dashboard-container">
            {/* Barra de Navegación superior */}
            <nav className="dashboard-navbar">
                <div>
                    <h2>ComedorU - Panel de Control</h2>
                    <span>Bienvenido(a), <strong>{usuario.nombre}</strong> ({usuario.rol_id === 1 ? 'Estudiante' : 'Vendedor'})</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
            </nav>

            {/* VISTA EXCLUSIVA DEL VENDEDOR: Formulario para crear menú */}
            {usuario.rol_id === 3 && (
                <div className="form-vendedor">
                    <h3>📢 Publicar Menú Diario del Comedor</h3>
                    <form onSubmit={handleSubirMenu}>
                        <div className="form-group">
                            <label>Título del Platillo *</label>
                            <input type="text" className="form-input" placeholder="Ej. Chilaquiles con pollo" value={nuevoMenu.titulo} onChange={(e) => setNuevoMenu({...nuevoMenu, titulo: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Descripción / Ingredientes *</label>
                            <textarea className="form-input" rows="3" placeholder="Ej. Con crema, queso y frijoles refritos" value={nuevoMenu.descripcion} onChange={(e) => setNuevoMenu({...nuevoMenu, descripcion: e.target.value})} required></textarea>
                        </div>
                        <div className="form-group">
                            <label>Precio ($ MXN) *</label>
                            <input type="number" className="form-input" placeholder="Ej. 45.00" value={nuevoMenu.precio} onChange={(e) => setNuevoMenu({...nuevoMenu, precio: e.target.value})} required />
                        </div>
                        <button type="submit" className="btn-submit">Subir al Sistema</button>
                    </form>
                </div>
            )}

            {/* VISTA COMPARTIDA: Listado de Tarjetas de Menús */}
            <div className="content-section">
                <h3>{usuario.rol_id === 3 ? '📋 Tus Menús Publicados' : '🍽️ Menús Disponibles Hoy'}</h3>
                
                {menus.length === 0 ? (
                    <p>No hay menús registrados en este momento.</p>
                ) : (
                    <div className="menus-grid">
                        {menus.map((menu) => (
                            <div key={menu.id} className="menu-card">
                                <div>
                                    <h3>{menu.titulo}</h3>
                                    <p>{menu.descripcion}</p>
                                </div>
                                <div>
                                    <p className="menu-precio">${menu.precio}</p>
                                    {usuario.rol_id === 1 && (
                                        <small style={{color: '#6c757d'}}>Publicado por: {menu.vendedor_nombre || 'Vendedor del comedor'}</small>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;