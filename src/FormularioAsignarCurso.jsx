import { useState, useEffect } from 'react';
import './Formulario.css'; 

function FormularioAsignarCurso() {
  
  const [listaPersonal, setListaPersonal] = useState([]);
  const [listaCursos, setListaCursos] = useState([]);

  const [idPersonal, setIdPersonal] = useState('');
  const [idCurso, setIdCurso] = useState('');
  
  const [descripcionCurso, setDescripcionCurso] = useState(''); 
  
  const [fechaInicio, setFechaInicio] = useState('');
 
  const [observaciones, setObservaciones] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/lista-personal')
        .then(res => res.json())
        .then(data => setListaPersonal(data));

    fetch('http://localhost:4000/api/catalogo-cursos')
        .then(res => res.json())
        .then(data => setListaCursos(data));
  }, []);

  const handleCursoChange = (e) => {
      const cursoSeleccionadoId = e.target.value;
      setIdCurso(cursoSeleccionadoId);

      const cursoEncontrado = listaCursos.find(c => c.id == cursoSeleccionadoId);
      
      if (cursoEncontrado) {
          setDescripcionCurso(cursoEncontrado.descripcion);
      } else {
          setDescripcionCurso('');
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = { idPersonal, idCurso, fechaInicio, observaciones };

    try {
        const respuesta = await fetch('http://localhost:4000/api/asignar-capacitacion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            setIsSubmitted(true);
        } else {
            alert("Error al asignar el curso");
        }
    } catch (error) {
       
        console.error("Detalle del error:", error); 
        alert("Error de conexión");
    }
  };

  if (isSubmitted) {
    return (
      <div className="confirmacion-exitosa">
        <h1>✓ Curso Asignado</h1>
        <p>El personal ha sido inscrito en el curso correctamente.</p>
        <button className="btn btn-secondary w-100" onClick={() => window.location.reload()}>Asignar Otro</button>
      </div>
    );
  }

  return (
    <>
      <h1>Asignación de Capacitación</h1>
      <form onSubmit={handleSubmit}>

        {/* 1. SELECCIONAR PERSONAL */}
        <div>
            <label className="form-label">Personal a Capacitar:</label>
            <select className="form-control" value={idPersonal} onChange={e => setIdPersonal(e.target.value)} required>
                <option value="">-- Seleccione Doctor/Enfermero --</option>
                {listaPersonal.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre_completo} ({p.especialidad})</option>
                ))}
            </select>
        </div>

        {/* 2. SELECCIONAR CURSO */}
        <div>
            <label className="form-label">Curso o Taller:</label>
            <select className="form-control" value={idCurso} onChange={handleCursoChange} required>
                <option value="">-- Seleccione un Curso del Catálogo --</option>
                {listaCursos.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre_curso} ({c.duracion_horas} hrs)</option>
                ))}
            </select>
        </div>

        {/* 3. DESCRIPCIÓN AUTOMÁTICA */}
        <div>
            <label className="form-label">Detalles del Curso:</label>
            <textarea 
                className="form-control" 
                rows="2" 
                value={descripcionCurso} 
                readOnly 
                style={{ backgroundColor: '#e9ecef', color: '#495057' }} 
            />
        </div>

        {/* 4. FECHA DE INICIO */}
        <div>
            <label className="form-label">Fecha de Inicio Programada:</label>
            <input 
                type="date" 
                className="form-control" 
                value={fechaInicio} 
                onChange={e => setFechaInicio(e.target.value)} 
                required 
            />
        </div>

       
        <div>
            <label className="form-label">Observaciones / Notas:</label>
            <textarea 
                className="form-control" 
                rows="2" 
                placeholder="Ej: Requiere certificación urgente..."
                value={observaciones} 
                onChange={e => setObservaciones(e.target.value)} 
            />
        </div>
      

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">Confirmar Inscripción</button>
      </form>
    </>
  );
}

export default FormularioAsignarCurso;