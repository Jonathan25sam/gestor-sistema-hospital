import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'; 
import './Formulario.css';
import './Menu.css'; 

import Header from './Header'; 
import Footer from './Footer'; 
import Menu from './Menu'; 


import FormularioIngresoClinico from './FormularioIngresoClinico';
import FormularioPersonalSalud from './FormularioPersonalSalud';
import FormularioInventario from './FormularioInventario';
import FormularioUrgencia from './FormularioUrgencia'; 
import FormularioAdmision from './FormularioAdmision';
import FormularioRoles from './FormularioRoles';
import FormularioEvaluaciones from './FormularioEvaluaciones';
import FormularioAsignarCurso from './FormularioAsignarCurso';
import ListaPersonal from './ListaPersonal';
import ReportePersonal from './ReportePersonal';



function App() {
  return (
    <> 
      <Header />
      
      <main className="layout-container">
        
        <Menu /> 

        <div className="content-card">
          <Routes>
           
            <Route path="/ingreso-clinico" element={<FormularioIngresoClinico />} />
            <Route path="/inventario" element={<FormularioInventario />} />
            <Route path="/personal-salud" element={<FormularioPersonalSalud />} />
            <Route path="/triage" element={<FormularioUrgencia />} />
            <Route path="/admision" element={<FormularioAdmision />} />
            <Route path="/roles" element={<FormularioRoles />} />
            <Route path="/evaluaciones" element={<FormularioEvaluaciones />} />
            <Route path="/asignar-curso" element={<FormularioAsignarCurso />} />
            <Route path='/Eliminar medico' element={<ListaPersonal />} />
            <Route path="/reporte-personal" element={<ReportePersonal />} />



            {/* Ruta por defecto: Redirige o muestra bienvenida */}
            <Route path="*" element={
              <div style={{textAlign: 'center', padding: '3rem'}}>
                <h1>Bienvenido</h1>
                <p>Selecciona "Ingreso Clínico" en el menú.</p>
              </div>
            } />
          </Routes>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

export default App;