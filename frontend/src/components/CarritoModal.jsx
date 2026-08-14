import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/Carrito.css';

const CarritoModal = ({ onPedidoExitoso }) => {
    const {
        carrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        cantidadTotalItems,
        totalPrecio,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    const [notas, setNotas] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const token = localStorage.getItem('token');

    const handleConfirmarPedido = async () => {
        if (carrito.length === 0) return;

        setCargando(true);
        setMensaje(null);

        try {
            const respuesta = await axios.post(
                '/pedidos',
                {
                    items: carrito,
                    notas: notas.trim()
                },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : ''
                    },
                    withCredentials: true
                }
            );

            setMensaje({
                tipo: 'success',
                texto: `¡Pedido #${respuesta.data.pedido.id} creado exitosamente! Pronto estará listo en el comedor.`
            });

            vaciarCarrito();
            setNotas('');

            if (onPedidoExitoso) {
                onPedidoExitoso();
            }

            // Cerrar automáticamente el carrito después de 2.5 segundos
            setTimeout(() => {
                setIsCartOpen(false);
                setMensaje(null);
            }, 2500);

        } catch (error) {
            console.error('Error al realizar pedido:', error);
            const errTexto = error.response?.data?.message || 'Error al conectar con el servidor para procesar el pedido.';
            setMensaje({
                tipo: 'error',
                texto: errTexto
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            {/* Botón Flotante con contador de ítems */}
            <button
                className="cart-floating-btn"
                onClick={() => setIsCartOpen(true)}
                title="Ver carrito de compras"
            >
                <span>🛒 Mi Carrito</span>
                {cantidadTotalItems > 0 && (
                    <span className="cart-badge">{cantidadTotalItems}</span>
                )}
            </button>

            {/* Overlay de fondo */}
            <div
                className={`cart-overlay ${isCartOpen ? 'active' : ''}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Panel Deslizante (Drawer) */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                {/* Cabecera */}
                <div className="cart-header">
                    <h3>🛒 Tu Carrito ComedorU</h3>
                    <button
                        className="cart-close-btn"
                        onClick={() => setIsCartOpen(false)}
                        title="Cerrar carrito"
                    >
                        ✕
                    </button>
                </div>

                {/* Contenido / Lista */}
                <div className="cart-body">
                    {mensaje && (
                        <div
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                backgroundColor: mensaje.tipo === 'success' ? '#D1FAE5' : '#FEE2E2',
                                color: mensaje.tipo === 'success' ? '#065F46' : '#991B1B',
                                border: `1px solid ${mensaje.tipo === 'success' ? '#A7F3D0' : '#FECACA'}`
                            }}
                        >
                            {mensaje.texto}
                        </div>
                    )}

                    {carrito.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🍽️</div>
                            <h4>Tu carrito está vacío</h4>
                            <p>Explora el menú del día y agrega tus platillos favoritos con un solo clic.</p>
                        </div>
                    ) : (
                        <>
                            {carrito.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-info">
                                        <div className="cart-item-title">{item.titulo}</div>
                                        <div className="cart-item-price">
                                            ${parseFloat(item.precio).toFixed(2)} MXN
                                        </div>
                                    </div>

                                    {/* Controles de cantidad */}
                                    <div className="cart-item-controls">
                                        <button
                                            className="cart-qty-btn"
                                            onClick={() => cambiarCantidad(item.id, -1)}
                                            title="Disminuir"
                                        >
                                            -
                                        </button>
                                        <span className="cart-qty-val">{item.cantidad}</span>
                                        <button
                                            className="cart-qty-btn"
                                            onClick={() => cambiarCantidad(item.id, 1)}
                                            title="Aumentar"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Botón eliminar */}
                                    <button
                                        className="cart-remove-btn"
                                        onClick={() => eliminarDelCarrito(item.id)}
                                        title="Eliminar del carrito"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}

                            {/* Campo de notas especiales */}
                            <div className="cart-notes-section">
                                <label htmlFor="notas-pedido">📝 Instrucciones o notas especiales:</label>
                                <textarea
                                    id="notas-pedido"
                                    className="cart-notes-input"
                                    rows="2"
                                    placeholder="Ej. Sin cebolla, salsa aparte, recoger a la 1:30 PM..."
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Pie del Carrito */}
                {carrito.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total-row">
                            <span>Total a pagar:</span>
                            <span className="cart-total-amount">
                                ${totalPrecio.toFixed(2)} MXN
                            </span>
                        </div>

                        <button
                            className="cart-order-btn"
                            disabled={cargando}
                            onClick={handleConfirmarPedido}
                        >
                            {cargando ? 'Procesando Pedido...' : '✅ Confirmar y Pedir Ahora'}
                        </button>

                        <button
                            className="cart-clear-btn"
                            onClick={vaciarCarrito}
                        >
                            Vaciar Carrito
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CarritoModal;
