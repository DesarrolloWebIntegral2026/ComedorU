import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Importamos los estilos separados

const Dashboard = () => {
    const navigate = useNavigate();
    
    // Obtenemos los datos del usuario guardados en el Login
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || null;

    // Estados
    const [menus, setMenus] = useState([]);
    const [nuevoMenu, setNuevoMenu] = useState({
        titulo: '',
        descripcion: '',
        precio: ''
    });

    // Proteger la ruta: Si no hay usuario, redirigir al login
    useEffect(() => {
        if (!usuarioLogueado) {
            navigate('/');
        } else {
            cargarMenus();
        }
    }, []);

    // Función para conectar con la API REST Backend
    const cargarMenus = async () => {
        try {
            let url = 'http://localhost:3000/api/menus';
            
            // Si es vendedor, cargamos solo sus menús mediante su ID
            if (usuarioLogueado.rol_id === 3) {
                url = `http://localhost:3000/api/menus/vendedor/${usuarioLogueado.id}`;
            }

            const respuesta = await axios.get(url);
            setMenus(respuesta.data);
        } catch (error) {
            console.error("Error al cargar menús desde la API:", error);
        }
    };

    // Manejar el envío del formulario (Solo Vendedor)
    const handleSubirMenu = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/menus', {
                vendedor_id: usuarioLogueado.id,
                titulo: nuevoMenu.titulo,
                descripcion: nuevoMenu.descripcion,
                precio: parseFloat(nuevoMenu.precio)
            });

            alert("¡Menú publicado con éxito en la plataforma!");
            setNuevoMenu({ titulo: '', descripcion: '', precio: '' }); // Limpiar campos
            cargarMenus(); // Recargar la lista
        } catch (error) {
            alert("Error al subir el menú.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    if (!usuarioLogueado) return null;

    return (
        <div className="dashboard-container">
            {/* Barra de Navegación superior */}
            <nav className="dashboard-navbar">
                <div>
                    <h2>ComedorU - Panel de Control</h2>
                    <span>Bienvenido(a), <strong>{usuarioLogueado.nombre}</strong> ({usuarioLogueado.rol_id === 1 ? 'Estudiante' : 'Vendedor'})</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
            </nav>

            {/* VISTA EXCLUSIVA DEL VENDEDOR: Formulario para crear menú */}
            {usuarioLogueado.rol_id === 3 && (
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
                <h3>{usuarioLogueado.rol_id === 3 ? '📋 Tus Menús Publicados' : '🍽️ Menús Disponibles Hoy'}</h3>
                
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
                                    {usuarioLogueado.rol_id === 1 && (
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