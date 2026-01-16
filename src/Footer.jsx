import React from 'react';

// Convertimos el HTML a JSX (cambiando 'class' por 'className')
function Footer() {
  return (
    <footer className="footer">
      <div className="container text-center">
        <p>&copy; Registro Nacional de Trabajadores de la Salud en México. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;