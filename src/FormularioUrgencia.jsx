import { useState, useEffect } from 'react';
import './Formulario.css'; 

function FormularioUrgencia() {
  
  // --- Estado para la lista de pacientes ---
  const [listaPacientes, setListaPacientes] = useState([]);

  // --- Estados del formulario ---
  const [idPaciente, setIdPaciente] = useState(''); // Nuevo
  const [nivelUrgencia, setNivelUrgencia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempoMax, setTiempoMax] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Cargar la lista de pacientes al iniciar ---
  useEffect(() => {
    fetch('http://localhost:4000/api/pacientes')
        .then(res => res.json())
        .then(data => setListaPacientes(data))
        .catch(err => console.error("Error cargando pacientes:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const datosUrgencia = {
      idPaciente, // Enviamos el ID del paciente seleccionado
      nivelUrgencia,
      descripcion,
      tiempoMax: parseInt(tiempoMax)
    };
    
    try {
        const respuesta = await fetch('http://localhost:4000/api/urgencias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUrgencia)
        });

        if (!respuesta.ok) throw new Error('Error al guardar');
        
        setIsSubmitted(true); 

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
  };

  if (isSubmitted) {
    return (
      <div className="confirmacion-exitosa">
        <h1>✓ Caso Registrado</h1>
        <p>El paciente ha sido ingresado a la lista de espera de Urgencias.</p>
        <button className="btn btn-secondary w-100" onClick={() => window.location.reload()}>Nuevo Caso</button>
      </div>
    );
  }

  return (
    <> 
      <h1>Registro de Urgencia (Triage)</h1>

      <form onSubmit={handleSubmit}>
        
        {/* --- CAMPO NUEVO: SELECCIONAR PACIENTE --- */}
        <div className="mb-3">
          <label className="form-label">Paciente:</label>
          <select 
            className="form-control"
            value={idPaciente}
            onChange={(e) => setIdPaciente(e.target.value)}
            required
          >
            <option value="">-- Seleccione Paciente --</option>
            {listaPacientes.map(p => (
                <option key={p.id} value={p.id}>
          {p.nombre_paciente}  
      </option>
            ))}
          </select>
        </div>

        {/* Campo Nivel Urgencia */}
        <div className="mb-3">
          <label className="form-label">Nivel de Urgencia:</label>
          <select 
            className="form-control"
            value={nivelUrgencia}
            onChange={(e) => setNivelUrgencia(e.target.value)}
            required
          >
            <option value="">Seleccione Nivel...</option>
            <option value="Rojo">🔴 Rojo (Reanimación)</option>
            <option value="Naranja">🟠 Naranja (Emergencia)</option>
            <option value="Amarillo">🟡 Amarillo (Urgencia)</option>
            <option value="Verde">🟢 Verde (Menor)</option>
            <option value="Azul">🔵 Azul (Sin Urgencia)</option>
          </select>
        </div>

        {/* Campo Tiempo */}
        <div className="mb-3">
          <label className="form-label">Tiempo Máximo (Minutos):</label>
          <input 
            type="number"
            placeholder="Ej: 0, 15, 60"
            className="form-control"
            value={tiempoMax}
            onChange={(e) => setTiempoMax(e.target.value)}
            required
          />
        </div>
    
        {/* Campo Descripción */}
        <div className="mb-3">
          <label className="form-label">Descripción / Motivo:</label>
          <textarea 
            placeholder="Síntomas principales..." 
            className="form-control"
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">Registrar Caso</button>
      </form>
    </>
  );
}

export default FormularioUrgencia;