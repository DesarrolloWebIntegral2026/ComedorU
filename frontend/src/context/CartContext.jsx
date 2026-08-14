import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser utilizado dentro de un CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        try {
            const stored = localStorage.getItem('comedor_carrito');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('comedor_carrito', JSON.stringify(carrito));
        } catch (error) {
            console.error('Error al guardar carrito en localStorage:', error);
        }
    }, [carrito]);

    // Agregar platillo al carrito
    const agregarAlCarrito = (platillo) => {
        setCarrito((prev) => {
            const index = prev.findIndex((item) => item.id === platillo.id);
            if (index !== -1) {
                // Si ya existe, incrementamos cantidad
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    cantidad: updated[index].cantidad + 1
                };
                return updated;
            }
            // Si es nuevo, lo agregamos con cantidad 1
            return [...prev, { ...platillo, cantidad: 1 }];
        });
    };

    // Incrementar o decrementar cantidad
    const cambiarCantidad = (id, delta) => {
        setCarrito((prev) => {
            return prev
                .map((item) => {
                    if (item.id === id) {
                        const nuevaCantidad = item.cantidad + delta;
                        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
                    }
                    return item;
                })
                .filter(Boolean);
        });
    };

    // Eliminar producto específico del carrito
    const eliminarDelCarrito = (id) => {
        setCarrito((prev) => prev.filter((item) => item.id !== id));
    };

    // Vaciar todo el carrito
    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // Total de productos (conteo de unidades)
    const cantidadTotalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    // Total en pesos
    const totalPrecio = carrito.reduce((sum, item) => sum + parseFloat(item.precio) * item.cantidad, 0);

    return (
        <CartContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                cambiarCantidad,
                eliminarDelCarrito,
                vaciarCarrito,
                cantidadTotalItems,
                totalPrecio,
                isCartOpen,
                setIsCartOpen
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
