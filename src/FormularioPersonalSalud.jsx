import React, { useState } from 'react';
import './Formulario.css'; 

function FormularioPersonalSalud() {
  
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedula, setCedula] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [turno, setTurno] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const datosPersonal = {
      nombreCompleto,
      cedula,
      especialidad,
      turno,
      fechaNacimiento,
      sexo,
      telefono,
      email
    };
    
    try {
        const respuesta = await fetch('http://localhost:4000/api/personal-salud', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPersonal)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error || 'Error del servidor');
        }
        
        setIsSubmitted(true);

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
  };

  if (isSubmitted) {
    return (
      <div className="confirmacion-exitosa">
        <h1>✓ Personal Registrado</h1>
        <p>El especialista ha sido dado de alta en el sistema.</p>
        <p><strong>Nombre:</strong> {nombreCompleto}</p>
        <p><strong>Cédula:</strong> {cedula}</p>
        <hr />
        <button className="btn btn-secondary w-100" onClick={() => window.location.reload()}>Registrar Otro</button>
      </div>
    );
  }

  return (
    <> 
      <h1>Registro de Personal de Salud</h1>
      <form onSubmit={handleSubmit}>
        
        {/* --- Identificación --- */}
        <div className="mb-3">
            <label className="form-label">Nombre Completo:</label>
            <input type="text" className="form-control" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} required />
        </div>
        
        <div className="row">
            <div className="col-md-6 mb-3">
                <label className="form-label">Cédula Profesional:</label>
                <input type="text" className="form-control" value={cedula} onChange={e => setCedula(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Especialidad:</label>
                <input type="text" className="form-control" placeholder="Ej: Cardiología" value={especialidad} onChange={e => setEspecialidad(e.target.value)} required />
            </div>
        </div>

        {/* --- Datos Personales y Turno --- */}
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Turno:</label>
                <select className="form-control" value={turno} onChange={e => setTurno(e.target.value)} required>
                    <option value="">Seleccione...</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Nocturno">Nocturno</option>
                    <option value="Guardia">Guardia</option>
                </select>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Fecha Nacimiento:</label>
                <input type="date" className="form-control" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Sexo:</label>
                <select className="form-control" value={sexo} onChange={e => setSexo(e.target.value)} required>
                    <option value="">Seleccione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
        </div>

        {/* --- Contacto --- */}
        <div className="row">
            <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono:</label>
                <input type="tel" className="form-control" value={telefono} onChange={e => setTelefono(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Email:</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">Registrar Personal</button>
      </form>
    </>
  );
}

export default FormularioPersonalSalud;