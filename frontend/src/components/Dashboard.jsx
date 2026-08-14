import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CarritoModal from './CarritoModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { agregarAlCarrito, setIsCartOpen } = useCart();

    const [usuario, setUsuario] = useState(null);
    const [menus, setMenus] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [tabActiva, setTabActiva] = useState('menus'); // 'menus' | 'pedidos'
    const [cargandoPedidos, setCargandoPedidos] = useState(false);

    const [nuevoMenu, setNuevoMenu] = useState({
        titulo: '',
        descripcion: '',
        precio: ''
    });

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            cargarPerfilYDatos();
        }
    }, [token, navigate]);

    const cargarPerfilYDatos = async () => {
        try {
            const respuesta = await axios.get('/auth/profile', {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                },
                withCredentials: true
            });

            const user = respuesta.data.user;
            setUsuario(user);
            cargarMenus(user);
            cargarPedidos(user);
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    const cargarMenus = async (usuarioActual) => {
        try {
            let url = '/menus';

            if (usuarioActual && usuarioActual.rol_id === 3) {
                url = `/menus/vendedor/${usuarioActual.id}`;
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

    const cargarPedidos = async (usuarioActual) => {
        if (!usuarioActual) return;
        setCargandoPedidos(true);
        try {
            const endpoint = usuarioActual.rol_id === 3
                ? '/pedidos/vendedor'
                : '/pedidos/mis-pedidos';

            const respuesta = await axios.get(endpoint, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                },
                withCredentials: true
            });

            setPedidos(respuesta.data.pedidos || []);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
        } finally {
            setCargandoPedidos(false);
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

            await axios.post('/menus', {
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
            setNuevoMenu({ titulo: '', descripcion: '', precio: '' });
            cargarMenus(usuario);
        } catch (error) {
            alert("Error al subir el menú.");
        }
    };

    const handleActualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            await axios.put(
                `/pedidos/${pedidoId}/estado`,
                { estado: nuevoEstado },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : ''
                    },
                    withCredentials: true
                }
            );
            alert(`Estado del pedido #${pedidoId} actualizado a "${nuevoEstado}"`);
            cargarPedidos(usuario);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert('No se pudo actualizar el estado del pedido.');
        }
    };

    const handleAgregarAlCarrito = (menu) => {
        agregarAlCarrito(menu);
        setIsCartOpen(true); // Abrir drawer para dar feedback instantáneo
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'pendiente': return 'badge-pendiente';
            case 'en_preparacion': return 'badge-en_preparacion';
            case 'listo': return 'badge-listo';
            case 'entregado': return 'badge-entregado';
            case 'cancelado': return 'badge-cancelado';
            default: return 'badge-pendiente';
        }
    };

    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'pendiente': return '⏳ Pendiente';
            case 'en_preparacion': return '👨‍🍳 En Preparación';
            case 'listo': return '✅ Listo para recoger';
            case 'entregado': return '📦 Entregado';
            case 'cancelado': return '❌ Cancelado';
            default: return estado;
        }
    };

    if (!usuario) return null;

    const esEstudiante = usuario.rol_id === 1;
    const esVendedor = usuario.rol_id === 3;

    return (
        <div className="dashboard-container">
            {/* Barra de Navegación superior */}
            <nav className="dashboard-navbar">
                <div>
                    <h2>ComedorU - Panel Principal</h2>
                    <span>
                        Bienvenido(a), <strong>{usuario.nombre} {usuario.apellidos || ''}</strong> 
                        &nbsp;({esEstudiante ? '🎓 Estudiante' : '👨‍🍳 Vendedor'})
                    </span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
            </nav>

            {/* Pestañas de Navegación */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${tabActiva === 'menus' ? 'active' : ''}`}
                    onClick={() => setTabActiva('menus')}
                >
                    {esVendedor ? '🍽️ Menús Publicados' : '🍽️ Menú del Día'}
                </button>
                <button
                    className={`tab-btn ${tabActiva === 'pedidos' ? 'active' : ''}`}
                    onClick={() => {
                        setTabActiva('pedidos');
                        cargarPedidos(usuario);
                    }}
                >
                    {esVendedor ? '📦 Pedidos Recibidos' : '📋 Mis Pedidos'}
                    {pedidos.length > 0 && (
                        <span style={{
                            backgroundColor: '#2563EB',
                            color: '#fff',
                            borderRadius: '10px',
                            padding: '2px 8px',
                            fontSize: '12px'
                        }}>
                            {pedidos.length}
                        </span>
                    )}
                </button>
            </div>

            {/* PESTAÑA 1: MENÚS */}
            {tabActiva === 'menus' && (
                <>
                    {/* VISTA EXCLUSIVA DEL VENDEDOR: Formulario para crear menú */}
                    {esVendedor && (
                        <div className="form-vendedor">
                            <h3>📢 Publicar Nuevo Platillo</h3>
                            <form onSubmit={handleSubirMenu}>
                                <div className="form-group">
                                    <label>Título del Platillo *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej. Chilaquiles con pollo"
                                        value={nuevoMenu.titulo}
                                        onChange={(e) => setNuevoMenu({ ...nuevoMenu, titulo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Descripción / Ingredientes *</label>
                                    <textarea
                                        className="form-input"
                                        rows="3"
                                        placeholder="Ej. Con crema, queso y frijoles refritos"
                                        value={nuevoMenu.descripcion}
                                        onChange={(e) => setNuevoMenu({ ...nuevoMenu, descripcion: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Precio ($ MXN) *</label>
                                    <input
                                        type="number"
                                        step="0.50"
                                        className="form-input"
                                        placeholder="Ej. 45.00"
                                        value={nuevoMenu.precio}
                                        onChange={(e) => setNuevoMenu({ ...nuevoMenu, precio: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-submit">Subir Menú al Sistema</button>
                            </form>
                        </div>
                    )}

                    {/* VISTA COMPARTIDA: Listado de Tarjetas de Menús */}
                    <div className="content-section">
                        <h3>{esVendedor ? '📋 Tus Platillos Activos' : '🍽️ Platillos Disponibles para Ordenar'}</h3>
                        
                        {menus.length === 0 ? (
                            <p style={{ color: '#64748B' }}>No hay menús registrados en este momento.</p>
                        ) : (
                            <div className="menus-grid">
                                {menus.map((menu) => (
                                    <div key={menu.id} className="menu-card">
                                        <div>
                                            <h3>{menu.titulo}</h3>
                                            <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.5' }}>
                                                {menu.descripcion}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="menu-precio">${parseFloat(menu.precio).toFixed(2)} MXN</p>
                                            {esEstudiante && (
                                                <>
                                                    <small style={{ color: '#6c757d', display: 'block', marginBottom: '8px' }}>
                                                        Vendedor: {menu.vendedor_nombre || 'Comedor Universitario'}
                                                    </small>
                                                    <button
                                                        className="btn-add-cart"
                                                        onClick={() => handleAgregarAlCarrito(menu)}
                                                    >
                                                        🛒 Agregar al carrito
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* PESTAÑA 2: PEDIDOS */}
            {tabActiva === 'pedidos' && (
                <div className="content-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>{esVendedor ? '📦 Pedidos Recibidos en Cocina' : '📋 Historial y Estado de Mis Pedidos'}</h3>
                        <button
                            onClick={() => cargarPedidos(usuario)}
                            style={{
                                background: '#E2E8F0',
                                border: 'none',
                                padding: '8px 14px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '13px'
                            }}
                        >
                            🔄 Actualizar Pedidos
                        </button>
                    </div>

                    {cargandoPedidos ? (
                        <p>Cargando información de pedidos...</p>
                    ) : pedidos.length === 0 ? (
                        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', color: '#64748B' }}>
                            <p style={{ fontSize: '16px', margin: 0 }}>
                                {esVendedor
                                    ? 'Aún no has recibido pedidos de clientes.'
                                    : 'Aún no has realizado pedidos. ¡Agrega platillos a tu carrito para ordenar!'}
                            </p>
                        </div>
                    ) : (
                        <div className="pedidos-list">
                            {pedidos.map((pedido) => (
                                <div key={pedido.id} className="pedido-card">
                                    <div className="pedido-header">
                                        <div>
                                            <span className="pedido-id">Pedido #{pedido.id}</span>
                                            {esVendedor && pedido.cliente_nombre && (
                                                <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>
                                                    Cliente: <strong>{pedido.cliente_nombre} {pedido.cliente_apellidos || ''}</strong>
                                                    {pedido.cliente_telefono && ` (Tel: ${pedido.cliente_telefono})`}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span className="pedido-fecha">
                                                {pedido.creado_en ? new Date(pedido.creado_en).toLocaleString('es-MX') : ''}
                                            </span>
                                            <span className={`status-badge ${getBadgeClass(pedido.estado)}`}>
                                                {getEstadoTexto(pedido.estado)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tabla de Productos del pedido */}
                                    <table className="pedido-items-table">
                                        <thead>
                                            <tr>
                                                <th>Platillo</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.items && pedido.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.titulo}</td>
                                                    <td>{item.cantidad}</td>
                                                    <td>${parseFloat(item.precio_unitario).toFixed(2)}</td>
                                                    <td>${parseFloat(item.subtotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {pedido.notas && (
                                        <div className="pedido-notas">
                                            <strong>Nota del cliente:</strong> {pedido.notas}
                                        </div>
                                    )}

                                    <div className="pedido-footer">
                                        <div className="pedido-total">
                                            Total: ${parseFloat(pedido.total).toFixed(2)} MXN
                                        </div>

                                        {/* Acciones exclusivas del Vendedor */}
                                        {esVendedor && (
                                            <div className="vendedor-acciones">
                                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Cambiar Estado:</label>
                                                <select
                                                    className="select-estado"
                                                    value={pedido.estado}
                                                    onChange={(e) => handleActualizarEstadoPedido(pedido.id, e.target.value)}
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="en_preparacion">En Preparación</option>
                                                    <option value="listo">Listo para Recoger</option>
                                                    <option value="entregado">Entregado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal / Carrito Flotante disponible para Estudiantes */}
            {esEstudiante && (
                <CarritoModal onPedidoExitoso={() => {
                    cargarPedidos(usuario);
                    setTabActiva('pedidos');
                }} />
            )}
        </div>
    );
};

export default Dashboard;