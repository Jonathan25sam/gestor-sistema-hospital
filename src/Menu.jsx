import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css'; 

function Menu() {
  return (
    <nav className="menu-navegacion">
      <h2>Menú Principal</h2>
      <ul className="nav flex-column">
        
        <li className="nav-item">
          <NavLink className="nav-link" to="/ingreso-clinico">
            ★ Ingreso Clínico
          </NavLink>
        </li>


        <li className="nav-item">
          <NavLink className="nav-link" to="/personal-salud">
            <i className="fas fa-user-md" style={{marginRight:'8px'}}></i>
             Registro RRHH (Personal)
          </NavLink>
        </li>

       
        <li className="nav-item">
          <NavLink className="nav-link" to="/triage">
            <i className="fas fa-ambulance" style={{marginRight:'8px'}}></i>
             Urgencias / Triage
          </NavLink>
        </li>
      

        <li className="nav-item">
          <NavLink className="nav-link" to="/inventario">
            <i className="fas fa-boxes" style={{marginRight:'8px'}}></i>
             Farmacia / Inventario
          </NavLink>
        </li>


      
        <li className="nav-item">
          <NavLink className="nav-link" to="/roles">
            <i className="fas fa-id-card-clip" style={{marginRight:'8px'}}></i>
             Asignar Roles
          </NavLink>
        </li>
         

        <li className="nav-item">
          <NavLink className="nav-link" to="/asignar-curso">
         <i className="fas fa-chalkboard-teacher" style={{marginRight:'8px'}}></i>
             Asignar Capacitación
             </NavLink>
         </li>


        <li className="nav-item">
          <NavLink className="nav-link" to="/evaluaciones">
            <i className="fas fa-star-half-alt" style={{marginRight:'8px'}}></i>
             Calidad y Evaluaciones
          </NavLink>
        </li>

          <li className="nav-item">
          <NavLink className="nav-link" to="/Eliminar medico">
            <i className="fas fa-star-half-alt" style={{marginRight:'8px'}}></i>
             Deshabilitar medicos
          </NavLink>
        </li>
        
          <li className="nav-item">
  <NavLink 
    className="nav-link" 
    to="/admision"
    style={{ 
      backgroundColor: '#27ae60', // Verde
      color: 'white'              // Texto Blanco
    }}
  >
    <i className="fas fa-procedures" style={{marginRight:'8px'}}></i>
     Hospitalización
  </NavLink>
</li>


<li className="nav-item">
  <NavLink 
    className="nav-link" 
    to="/reporte-personal"
    style={{ 
      backgroundColor: '#2c3e50', // Azul Oscuro
      color: 'white'
    }}
  >
    <i className="fas fa-file-contract" style={{marginRight:'8px'}}></i>
     Reporte Maestro RRHH
  </NavLink>
</li>
   
        
        

      </ul>
    </nav>
  );
}

export default Menu;