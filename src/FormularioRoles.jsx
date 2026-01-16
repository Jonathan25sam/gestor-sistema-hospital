import { useState, useEffect } from 'react';
import './Formulario.css'; 

function FormularioRoles() {
  
  // Lista para llenar el Select
  const [listaPersonal, setListaPersonal] = useState([]);

  // Estados del formulario
  const [idPersonal, setIdPersonal] = useState(''); // El ID del doctor seleccionado
  const [nombreRol, setNombreRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- 1. Cargar la lista de personal al iniciar ---
  useEffect(() => {
    fetch('http://localhost:4000/api/lista-personal')
        .then(res => res.json())
        .then(data => setListaPersonal(data))
        .catch(err => console.error("Error cargando personal:", err));
  }, []);

  // --- Validación para bloquear botón ---
  const formularioValido = 
      idPersonal !== '' && 
      nombreRol !== '' && 
      descripcion !== '';

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    
    // Buscamos el nombre del doctor solo para mostrarlo en el console.log o alerta
    const personalSeleccionado = listaPersonal.find(p => p.id == idPersonal);
    const nombreDoctor = personalSeleccionado ? personalSeleccionado.nombre_completo : 'Desconocido';

    const datosRol = {
      idPersonal, // Enviamos el ID, no el nombre
      nombreRol,
      descripcion
    };
    
    console.log(`Asignando rol a ${nombreDoctor}:`, datosRol);

    try {
        const respuesta = await fetch('http://localhost:4000/api/roles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosRol)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error || 'Error del servidor');
        }

        const resultado = await respuesta.json();
        console.log("Respuesta API:", resultado);
        
        setIsSubmitted(true); 

    } catch (error) {
        console.error('Error:', error);
        alert(`Error al conectar con la API: ${error.message}`);
    }
  };

  if (isSubmitted) {
    return (
      <div className="confirmacion-exitosa">
        <h1>✓ Rol Asignado</h1>
        <p style={{textAlign: 'center'}}>Se ha asignado el rol correctamente.</p>
        <button 
          className="btn btn-secondary w-100"
          onClick={() => window.location.reload()}
        >
          Asignar Otro Rol
        </button>
      </div>
    );
  }

  return (
    <> 
      <h1>Asignación de Roles y Cargos</h1>

      <form onSubmit={handleSubmit}>
    
        {/* --- NUEVO CAMPO: SELECTOR DE PERSONAL --- */}
        <div>
            <label className="form-label">Seleccionar Personal:</label>
            <select 
                className="form-control"
                value={idPersonal}
                onChange={(e) => setIdPersonal(e.target.value)}
                required
            >
                <option value="">-- Busca al Doctor/Enfermero --</option>
                {listaPersonal.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                        {persona.nombre_completo} - {persona.especialidad}
                    </option>
                ))}
            </select>
        </div>

        {/* -- Campo nombre_rol -- */}
        <div>
          <label className="form-label">Nombre del Rol / Cargo:</label>
          <input 
            type="text" 
            placeholder="Ej: Jefe de Guardia, Supervisor de Área"
            className="form-control"
            value={nombreRol} 
            onChange={(e) => setNombreRol(e.target.value)}
            required 
          />
        </div>
    
        {/* -- Campo descripcion -- */}
        <div>
          <label className="form-label">Descripción de Responsabilidades:</label>
          <textarea 
            placeholder="Describe qué hará esta persona en este rol..." 
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required 
          />
        </div>
        
        <button 
          type="submit"
          className="btn btn-primary btn-lg w-100 mt-3" 
          disabled={!formularioValido}
        >
          Guardar Asignación
        </button>
      </form>
    </>
  );
}

export default FormularioRoles;