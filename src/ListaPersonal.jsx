// es el formulario que desactiva a un medico ya que por etica no se puede eliminar su informacion
//de las base de datos del hospital como en la vida real

import { useState, useEffect } from 'react';

function ListaPersonal() {
    const [personal, setPersonal] = useState([]);

    // Función para cargar la lista
    const cargarPersonal = () => {
        fetch('http://localhost:4000/api/lista-personal')
            .then(res => res.json())
            .then(data => setPersonal(data));
    };

    useEffect(() => {
        cargarPersonal();
    }, []);

    // --- FUNCIÓN PARA ELIMINAR (DAR DE BAJA) ---
    const darDeBaja = async (id, nombre) => {
        // 1. Preguntar confirmación
        if (!window.confirm(`¿Estás seguro de que deseas dar de baja a: ${nombre}?`)) {
            return;
        }

        try {
            // 2. Enviar petición al servidor
            const respuesta = await fetch(`http://localhost:4000/api/personal-salud/${id}`, {
                method: 'DELETE' // Llamamos a la ruta DELETE que creamos
            });

            if (respuesta.ok) {
                alert("✅ Personal desactivado correctamente");
                cargarPersonal(); // Recargamos la lista para que desaparezca
            } else {
                alert("❌ Error al dar de baja");
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Personal</h2>
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {personal.map(p => (
                        <tr key={p.id}>
                            <td>{p.nombre_completo}</td>
                            <td>{p.especialidad}</td>
                            <td>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => darDeBaja(p.id, p.nombre_completo)}
                                >
                                    <i className="fas fa-user-times"></i> Dar de Baja
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaPersonal;