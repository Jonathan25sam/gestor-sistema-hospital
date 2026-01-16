import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

function FormularioAdmision() {
    const [pacientes, setPacientes] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [idPaciente, setIdPaciente] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [idMedicamento, setIdMedicamento] = useState('');
    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        fetch('http://localhost:4000/api/pacientes')
            .then(res => res.json())
            .then(data => setPacientes(data));
        
        fetch('http://localhost:4000/api/medicamentos')
            .then(res => res.json())
            .then(data => setMedicamentos(data));
    }, []);

    const generarPDF = (datosPDF, nombrePaciente) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(40, 116, 166);
        doc.text("Hospital General - Comprobante de Ingreso", 20, 20);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Fecha de Emisión: ${datosPDF.fecha}`, 20, 30);
        doc.text(`Folio de Admisión: #${datosPDF.folio}`, 150, 30);

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

       
        autoTable(doc, {
            startY: 45,
            head: [['Concepto', 'Detalle Asignado']],
            body: [
                ['Paciente', nombrePaciente],
                ['Especialidad Requerida', datosPDF.especialidad],
                ['Doctor Asignado', datosPDF.doctor],
                ['Cama / Cuarto', datosPDF.cama],
            ],
            theme: 'grid',
            headStyles: { fillColor: [40, 116, 166] },
        });
        

        doc.setFontSize(10);
        doc.text("Este documento es un comprobante oficial de ingreso.", 20, 150);
        doc.save(`Admision_Folio_${datosPDF.folio}.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pacienteSeleccionado = pacientes.find(p => p.id == idPaciente);
        const nombrePac = pacienteSeleccionado ? pacienteSeleccionado.nombre_paciente : "Desconocido";

        const datos = {
            idPaciente,
            especialidad,
            idMedicamento: idMedicamento || null,
            cantidad: parseInt(cantidad)
        };

        try {
            const respuesta = await fetch('http://localhost:4000/api/admision-inteligente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) throw new Error(resultado.error || "Error en el servidor");

            alert(`✅ ¡Ingreso Exitoso! \nDoctor: ${resultado.datosPDF.doctor} \nCama: ${resultado.datosPDF.cama}`);
            
            generarPDF(resultado.datosPDF, nombrePac);

            // window.location.reload(); // Comentado para que veas si descarga el PDF primero
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h2>🏥 Nueva Admisión Hospitalaria</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Paciente:</label>
                            <select className="form-control" onChange={e => setIdPaciente(e.target.value)} required>
                                <option value="">-- Buscar Paciente --</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre_paciente}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Especialidad Requerida:</label>
                            <select className="form-control" onChange={e => setEspecialidad(e.target.value)} required>
                                <option value="">-- Seleccione Especialidad --</option>
                                <option value="Cardiologia">Cardiología</option>
                                <option value="Pediatria">Pediatría</option>
                                <option value="Urgencias">Urgencias</option>
                                <option value="Neurologia">Neurología</option>
                            </select>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Medicamento Inicial:</label>
                                <select className="form-control" onChange={e => setIdMedicamento(e.target.value)}>
                                    <option value="">-- Ninguno --</option>
                                    {medicamentos.map(m => (
                                        <option key={m.id} value={m.id}>{m.nombre_item} (Stock: {m.stock_actual})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Cantidad:</label>
                                <input type="number" className="form-control" min="0" defaultValue="0" onChange={e => setCantidad(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success w-100 btn-lg">💾 Registrar Ingreso y Generar PDF</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormularioAdmision;