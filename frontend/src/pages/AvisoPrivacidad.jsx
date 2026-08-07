function AvisoPrivacidad() {
  return (
    <div className="privacy-shell">
      <div className="privacy-card">
        <h1>Aviso de Privacidad</h1>
        <p className="lead">
          Este documento informa de manera clara y transparente cómo ComedorU maneja la información personal de sus usuarios.
        </p>

        <div className="privacy-section">
          <h3>1. Responsable del tratamiento</h3>
          <p>
            Los integrantes del equipo de desarrollo del proyecto <strong>ComedorU</strong>, de la carrera de Ingeniería en Gestión y Desarrollo de Software de la Universidad Tecnológica del Norte de Guanajuato (UTNG), con domicilio institucional en Av. Tecnológico No. 1, Dolores Hidalgo, C.P. 37800, Guanajuato, México, son responsables del uso, tratamiento y protección de sus datos personales.
          </p>
        </div>

        <div className="privacy-section">
          <h3>2. Datos que podemos recabar</h3>
          <ul>
            <li><strong>Datos de contacto:</strong> nombre, correo electrónico y teléfono.</li>
            <li><strong>Datos de ubicación:</strong> coordenadas o información geográfica para ubicar servicios cercanos.</li>
            <li><strong>Datos de pago:</strong> información necesaria para transacciones seguras.</li>
            <li><strong>Datos de autenticación:</strong> contraseña cifrada y tokens JWT.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h3>3. Finalidades del tratamiento</h3>
          <ol>
            <li>Gestionar el registro y acceso de usuarios.</li>
            <li>Permitir la publicación y consulta de menús.</li>
            <li>Procesar pedidos en línea y pagos.</li>
            <li>Mostrar opciones cercanas y notificaciones relevantes.</li>
            <li>Mejorar la experiencia y prevenir actividades fraudulentas.</li>
          </ol>
        </div>

        <div className="privacy-section">
          <h3>4. Transferencias y terceros</h3>
          <p>
            Sus datos no serán vendidos ni compartidos con fines comerciales sin consentimiento expreso. Solo podrán compartirse con procesadores de pago o autoridades competentes, cuando sea necesario y conforme a la ley.
          </p>
        </div>

        <div className="privacy-section">
          <h3>5. Medidas de seguridad</h3>
          <ul>
            <li>Cifrado de comunicaciones en tránsito (HTTPS/TLS) y cookies seguras para autenticación.</li>
            <li>Protección en el navegador con políticas de seguridad de cabeceras y control de CORS.</li>
            <li>Uso de token JWT con expiración y almacenamiento mínimo en el cliente.</li>
            <li>Contraseñas protegidas con hashing seguro (bcrypt) y validación de datos en el backend.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h3>6. Principios de minimización y ciclo de vida de datos</h3>
          <p>
            Recabamos únicamente los datos mínimos necesarios para operar la plataforma. Los datos se conservan mientras el usuario mantiene una cuenta activa y se eliminan cuando el usuario solicita la cancelación.
          </p>
        </div>

        <div className="privacy-section">
          <h3>7. Derechos ARCO</h3>
          <p>
            Usted podrá acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, puede escribir a <strong>privacidad.comedoru@utng.edu.mx</strong>.
          </p>
          <p>
            También contamos con rutas en el backend para consultar y actualizar su perfil, cancelar su cuenta y registrar solicitudes de oposición.
          </p>
        </div>

        <div className="privacy-section">
          <h3>8. Trazabilidad y auditoría</h3>
          <p>
            Las acciones clave del sistema se registran en bitácoras de auditoría para garantizar trazabilidad. Esto incluye inicios de sesión, publicaciones de menús, cambios en datos de perfil y solicitudes ARCO.
          </p>
        </div>

        <div className="privacy-section">
          <h3>9. Transferencias de datos</h3>
          <p>
            Sus datos no serán vendidos. Solo se comparten con proveedores de servicios o autoridades competentes cuando sea necesario y conforme a la ley.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AvisoPrivacidad;