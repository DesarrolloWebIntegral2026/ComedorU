// Control de versiones - Issue #10
import { Link } from "react-router-dom";
import { useState } from "react";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaAviso, setAceptaAviso] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!aceptaAviso) {
      alert("Debes aceptar el Aviso de Privacidad.");
      return;
    }

    alert("Usuario registrado");
  };

  return (
    <div className="page-shell">
      <div className="auth-layout">
        <section className="auth-hero">
          <div>
            <div className="brand-badge">C</div>
            <h2 className="hero-title">Crea tu cuenta en ComedorU</h2>
            <p className="hero-text">
              Únete para acceder a menús, reservar pedidos y disfrutar de una experiencia más rápida.
            </p>
          </div>

          <ul className="hero-points">
            <li>✓ Registro sencillo en pocos pasos</li>
            <li>✓ Perfil personalizado</li>
            <li>✓ Historial de pedidos y reseñas</li>
          </ul>
        </section>

        <section className="auth-card">
          <h1>Registro</h1>
          <p>Completa tus datos para comenzar.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="checkbox-row">
              <input
                id="aviso"
                type="checkbox"
                checked={aceptaAviso}
                onChange={(e) => setAceptaAviso(e.target.checked)}
              />
              <label htmlFor="aviso">Acepto el aviso de privacidad.</label>
            </div>

            <button className="primary-btn" type="submit">
              Registrarse
            </button>
          </form>

          <div className="auth-links">
            <Link to="/aviso-privacidad">Ver aviso de privacidad</Link>
            <Link to="/">Ya tengo una cuenta</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Registro;