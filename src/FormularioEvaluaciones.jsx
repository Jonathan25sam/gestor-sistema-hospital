import { useState, useEffect } from 'react';
import './Formulario.css'; 

function FormularioEvaluaciones() {
  
  // Listas para los Selects
  const [listaMedicos, setListaMedicos] = useState([]);
  const [listaPacientes, setListaPacientes] = useState([]); // Esta se llena sola

  // Datos del Formulario
  const [idMedico, setIdMedico] = useState('');
  const [idPaciente, setIdPaciente] = useState('');
  const [nivelAtencion, setNivelAtencion] = useState('Excelente');
  const [puntuacion, setPuntuacion] = useState(10);
  const [comentarios, setComentarios] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Cargar Médicos al iniciar
  useEffect(() => {
    fetch('http://localhost:4000/api/lista-medicos')
      .then(res => res.json())
      .then(data => setListaMedicos(data));
  }, []);

 
  useEffect(() => {
    if (idMedico) {
        // Limpiamos el paciente anterior para evitar errores
        setIdPaciente(''); 
        setListaPacientes([]);

        fetch(`http://localhost:4000/api/pacientes-de-doctor/${idMedico}`)
            .then(res => res.json())
            .then(data => setListaPacientes(data))
            .catch(err => console.error(err));
    }
  }, [idMedico]); // <--- Se ejecuta cada vez que cambia 'idMedico'

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = { idMedico, idPaciente, nivelAtencion, puntuacion, comentarios };

    try {
        const res = await fetch('http://localhost:4000/api/evaluaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (res.ok) setIsSubmitted(true);
    } catch (error) {
        alert("Error al guardar");
    }
  };

  if (isSubmitted) {
    return (
        <div className="confirmacion-exitosa">
            <h1>✓ Evaluación Enviada</h1>
            <p>Gracias por ayudarnos a mejorar la calidad del servicio.</p>
            <button className="btn btn-secondary w-100" onClick={() => window.location.reload()}>Nueva Evaluación</button>
        </div>
    );
  }

  return (
    <>
      <h1>Evaluación de Desempeño Médico</h1>
      <form onSubmit={handleSubmit}>
        
        {/* SELECCIONAR MÉDICO */}
        <div>
            <label className="form-label">Seleccione al Médico:</label>
            <select className="form-control" value={idMedico} onChange={e => setIdMedico(e.target.value)} required>
                <option value="">-- Buscar Médico --</option>
                {listaMedicos.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre_completo}</option>
                ))}
            </select>
        </div>

        {/* SELECCIONAR PACIENTE (Dependiente) */}
        <div>
            <label className="form-label">Paciente Atendido:</label>
            <select 
                className="form-control" 
                value={idPaciente} 
                onChange={e => setIdPaciente(e.target.value)} 
                required
                disabled={!idMedico} // Bloqueado si no hay médico
            >
                <option value="">
                    {idMedico ? (listaPacientes.length > 0 ? "-- Seleccione Paciente --" : "Este médico no tiene pacientes registrados") : "-- Primero elija un médico --"}
                </option>
                {listaPacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre_paciente}</option>
                ))}
            </select>
        </div>

        <hr />

        {/* NIVEL DE ATENCIÓN */}
        <div className="row">
            <div className="col-md-6">
                <label className="form-label">Nivel de Atención:</label>
                <select className="form-control" value={nivelAtencion} onChange={e => setNivelAtencion(e.target.value)}>
                    <option value="Excelente">⭐⭐⭐⭐⭐ Excelente</option>
                    <option value="Bueno">⭐⭐⭐⭐ Bueno</option>
                    <option value="Regular">⭐⭐⭐ Regular</option>
                    <option value="Malo">⭐⭐ Malo</option>
                    <option value="Pésimo">⭐ Pésimo</option>
                </select>
            </div>
            <div className="col-md-6">
                <label className="form-label">Puntuación (1-10):</label>
                <input type="number" className="form-control" min="1" max="10" value={puntuacion} onChange={e => setPuntuacion(e.target.value)} required />
            </div>
        </div>

        <div className="mt-3">
            <label className="form-label">Comentarios / Quejas / Felicitaciones:</label>
            <textarea className="form-control" rows="3" value={comentarios} onChange={e => setComentarios(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">Enviar Evaluación</button>
      </form>
    </>
  );
}

export default FormularioEvaluaciones;