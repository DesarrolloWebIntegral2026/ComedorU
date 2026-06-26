import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="page-shell">
      <div className="auth-layout">
        <section className="auth-hero">
          <div>
            <div className="brand-badge">U</div>
            <h2 className="hero-title">Bienvenido a ComedorU</h2>
            <p className="hero-text">
              Gestiona pedidos, descubre opciones cercanas y accede a una experiencia de comida rápida y segura.
            </p>
          </div>

          <ul className="hero-points">
            <li>✓ Menús y ofertas del día</li>
            <li>✓ Seguimiento de pedidos en tiempo real</li>
            <li>✓ Pagos ágiles y seguros</li>
          </ul>
        </section>

        <section className="auth-card">
          <h1>Iniciar sesión</h1>
          <p>Accede a tu cuenta para continuar.</p>

          <form>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" placeholder="tu@correo.com" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" placeholder="••••••••" />
            </div>

            <button className="primary-btn" type="submit">
              Iniciar sesión
            </button>
          </form>

          <div className="auth-links">
            <Link to="/registro">Crear una cuenta</Link>
            <Link to="/aviso-privacidad">Aviso de privacidad</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;