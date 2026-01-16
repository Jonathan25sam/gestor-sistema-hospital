import React, { useState } from 'react';
import './Formulario.css'; 

function FormularioIngresoClinico() {
  
  // Estados para los datos del formulario
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  
  // Signos Vitales
  const [presion, setPresion] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [saturacion, setSaturacion] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');

  // Extras
  const [observaciones, setObservaciones] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  //Verificar si todos los campos tienen datos
  const formularioValido = 
    nombrePaciente !== '' &&
    fechaIngreso !== '' &&
    presion !== '' &&
    temperatura !== '' &&
    frecuencia !== '' &&
    saturacion !== '' &&
    peso !== '' &&
    altura !== '' &&
    observaciones !== '';

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const datosIngreso = {
      nombrePaciente,
      fechaIngreso,
      presion,
      temperatura,
      frecuencia,
      saturacion,
      peso,
      altura,
      observaciones
    };
    
    try {
        const respuesta = await fetch('http://localhost:4000/api/ingreso-clinico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosIngreso)
        });

        if (!respuesta.ok) throw new Error('Error del servidor');
        
        setIsSubmitted(true);

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
  };

  if (isSubmitted) {
    return (
      <div className="confirmacion-exitosa">
        <h1>✓ Ingreso Registrado</h1>
        <p>Los datos del paciente y sus signos vitales han sido guardados.</p>
        <hr />
        <button className="btn btn-secondary w-100" onClick={() => window.location.reload()}>Nuevo Registro</button>
      </div>
    );
  }

  return (
    <> 
      <h1>Ingreso Clínico y Signos Vitales</h1>
      <form onSubmit={handleSubmit}>
        
        <fieldset>
            <legend>Datos del Paciente</legend>
            <div className="mb-3">
                <label className="form-label">Nombre del Paciente:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Escribe el nombre completo..." 
                    value={nombrePaciente} 
                    onChange={e => setNombrePaciente(e.target.value)} 
                    required 
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Fecha de Ingreso:</label>
                <input 
                    type="date" 
                    className="form-control" 
                    value={fechaIngreso} 
                    onChange={e => setFechaIngreso(e.target.value)} 
                    required 
                />
            </div>
        </fieldset>

        <fieldset>
            <legend>Signos Vitales</legend>
            <div className="row">
                <div className="col-md-3 mb-3">
                    <label className="form-label">Presión (mmHg):</label>
                    {/* Agregado required */}
                    <input type="text" className="form-control" placeholder="Ej: 120/80" value={presion} onChange={e => setPresion(e.target.value)} required />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label">Temperatura (°C):</label>
                    {/* Agregado required */}
                    <input type="text" className="form-control" placeholder="Ej: 36.5" value={temperatura} onChange={e => setTemperatura(e.target.value)} required />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label">Frec. Card. (lpm):</label>
                    {/* Agregado required */}
                    <input type="text" className="form-control" placeholder="Ej: 80" value={frecuencia} onChange={e => setFrecuencia(e.target.value)} required />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label">Sat. O2 (%):</label>
                    {/* Agregado required */}
                    <input type="text" className="form-control" placeholder="Ej: 98" value={saturacion} onChange={e => setSaturacion(e.target.value)} required />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Peso (kg):</label>
                    {/* Agregado required */}
                    <input type="text" className="form-control" placeholder="Ej: 70.5" value={peso} onChange={e => setPeso(e.target.value)} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Altura (m):</label>
                    {/* Agregado required */}
                    <input type="text" className="form-control" placeholder="Ej: 1.75" value={altura} onChange={e => setAltura(e.target.value)} required />
                </div>
            </div>
        </fieldset>

        <fieldset>
            <legend>Observaciones Adicionales</legend>
            <div className="mb-3">
                <label className="form-label">Notas / Estado:</label>
                {/* Agregado required */}
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Detalles adicionales del paciente..." 
                    value={observaciones} 
                    onChange={e => setObservaciones(e.target.value)} 
                    required
                />
            </div>
        </fieldset>

       
        <button 
            type="submit" 
            className="btn btn-primary btn-lg w-100 mt-3" 
            disabled={!formularioValido}
        >
            Guardar Ingreso
        </button>
      </form>
    </>
  );
}

export default FormularioIngresoClinico;