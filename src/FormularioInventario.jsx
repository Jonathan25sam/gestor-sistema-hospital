import { useState } from 'react';
import './Formulario.css'; 
function FormularioInventario() {
  
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [cantidadStock, setCantidadStock] = useState(''); // <-- 1. NUEVO ESTADO
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    
   
    const datosItem = { 
        nombre, 
        descripcion, 
        tipo, 
        unidadMedida, 
        cantidadStock: parseInt(cantidadStock) // Lo convertimos a número
    };
    console.log("Formulario de Inventario enviado:", datosItem);

   
    try {
        const respuesta = await fetch('http://localhost:4000/api/inventario', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosItem) // Enviamos los datos como JSON
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error || 'Error del servidor');
        }

        const resultado = await respuesta.json();
        console.log("Respuesta de la API:", resultado);
        
        setIsSubmitted(true); 

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert(`Error al conectar con la API: ${error.message}`);
    }
  };

 
  if (isSubmitted) {
    return (
      <div className="confirmacion-exitosa">
        <h1>✓ Ítem Registrado!</h1>
        <p style={{textAlign: 'center', fontSize: '1.1rem', marginBottom: '1.5rem'}}>
          Los siguientes datos se guardaron exitosamente:
        </p>
        
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Descripción:</strong> {descripcion}</p>
        <p><strong>Tipo:</strong> {tipo}</p>
        <p><strong>Unidad de Medida:</strong> {unidadMedida}</p>
        <p><strong>Cantidad en Stock:</strong> {cantidadStock}</p> {/* <-- 3. NUEVO CAMPO */}
        
        <hr />
        
        <button 
          type="button"
          className="btn btn-secondary btn-lg w-100"
          onClick={() => {
            setIsSubmitted(false);
            setNombre('');
            setDescripcion('');
            setTipo('');
            setUnidadMedida('');
            setCantidadStock(''); // <-- 4. LIMPIAR EL NUEVO CAMPO
          }}
        >
          Registrar Otro Ítem
        </button>
      </div>
    );
  }

 
  return (
    <> 
      <h1>Registro de Inventario</h1>

      <form onSubmit={handleSubmit}>
    
        <div>
          <label className="form-label">Nombre del Ítem:</label>
          <input 
            type="text" 
            placeholder="Ej: Jeringa 10ml, Paracetamol 500mg"
            className="form-control"
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
    
        <div className="mt-3">
          <label className="form-label">Tipo de Ítem:</label>
          <select 
            className="form-control"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="">Seleccione un tipo...</option>
            <option value="Medicamento">Medicamento</option>
            <option value="Insumo Médico">Insumo Médico (Ej: gasas, guantes)</option>
            <option value="Equipo Médico">Equipo Médico (Ej: termómetro)</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* --- 5. NUEVO CAMPO AÑADIDO --- */}
        <div className="row mt-3">
            <div className="col-md-6 mb-3">
                <label className="form-label">Unidad de Medida:</label>
                <input 
                    type="text"
                    placeholder="Ej: Unidad, Caja, Frasco"
                    className="form-control"
                    value={unidadMedida}
                    onChange={(e) => setUnidadMedida(e.target.value)}
                    required
                />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Cantidad en Stock:</label>
                <input 
                    type="number"
                    placeholder="Ej: 100"
                    className="form-control"
                    value={cantidadStock}
                    onChange={(e) => setCantidadStock(e.target.value)}
                    required
                />
            </div>
        </div>
        {/* --- FIN DEL NUEVO CAMPO --- */}

        <div className="mt-3">
          <label className="form-label">Descripción:</label>
          <textarea 
            placeholder="Descripción detallada del ítem..." 
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit"
          className="btn btn-primary btn-lg w-100 mt-4" 
        >
          Registrar Ítem
        </button>
      </form>
    </>
  );
}

export default FormularioInventario;