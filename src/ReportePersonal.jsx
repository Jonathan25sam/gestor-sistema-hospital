import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Formulario.css';

function ReportePersonal() {
    const [cargando, setCargando] = useState(false);

    // Función auxiliar para calcular edad basada en fecha de nacimiento
    const calcularEdad = (fechaNac) => {
        if (!fechaNac) return "N/A";
        const hoy = new Date();
        const nacimiento = new Date(fechaNac);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad + " años";
    };

    const generarReporteMaestro = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch('http://localhost:4000/api/reporte-maestro');
            if (!respuesta.ok) throw new Error("Error conectando con el servidor");
            
            const dataMedicos = await respuesta.json();

            // Configuración inicial del PDF
            const doc = new jsPDF();
            let y = 20; // Cursor vertical

            // --- 1. ENCABEZADO DEL DOCUMENTO ---
            doc.setFillColor(41, 128, 185); // Azul Profesional
            doc.rect(0, 0, 210, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("EXPEDIENTES DE TODO EL PERSONAL MÉDICO", 105, 12, { align: "center" });
            doc.setFontSize(10);
            doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()} | Total: ${dataMedicos.length} Registros`, 105, 19, { align: "center" });
            
            y += 15;

            // --- 2. BUCLE POR CADA MÉDICO ---
            dataMedicos.forEach((medico, index) => {
                
                // Si falta espacio, nueva página
                if (y > 240) { doc.addPage(); y = 20; }

                // Determinar estado (Activo/Baja) para colores
                const esActivo = medico.activo === 1; // Asumiendo que viene como 1 o true
                const colorBorde = esActivo ? [41, 128, 185] : [192, 57, 43]; // Azul o Rojo
                const etiquetaBaja = esActivo ? "" : " (INACTIVO / BAJA)";

                // DIBUJAR MARCO DE LA FICHA
                doc.setDrawColor(...colorBorde);
                doc.setLineWidth(0.5);
                doc.setFillColor(250, 250, 252); // Gris muy pálido de fondo
                doc.roundedRect(10, y, 190, 60, 3, 3, 'FD');

                // --- COLUMNA 1: DATOS PROFESIONALES (Principal) ---
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text(`${index + 1}. ${medico.nombre_completo}${etiquetaBaja}`, 15, y + 8);

                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(50);
                
                // Línea 1
                doc.text(`Cédula: ${medico.cedula_profesional || 'S/N'}`, 15, y + 15);
                doc.text(`Especialidad: ${medico.especialidad}`, 75, y + 15);
                
                // Línea 2
                doc.text(`Turno: ${medico.turno || 'No asignado'}`, 15, y + 20);
                doc.text(`Registro: ${new Date(medico.fecha_registro).toLocaleDateString()}`, 75, y + 20);

                // --- COLUMNA 2: DATOS PERSONALES Y CONTACTO ---
                // Línea divisoria vertical pequeña
                doc.setDrawColor(200);
                doc.line(130, y + 5, 130, y + 35); 

                doc.setFont("helvetica", "bold");
                doc.text("Datos Personales:", 135, y + 10);
                doc.setFont("helvetica", "normal");
                
                doc.text(`• Sexo: ${medico.sexo || 'N/A'}`, 135, y + 15);
                doc.text(`• Edad: ${calcularEdad(medico.fecha_nacimiento)}`, 135, y + 20);
                doc.text(`• Tel: ${medico.telefono || '---'}`, 135, y + 25);
                
                // Email (ajustar tamaño si es largo)
                doc.setFontSize(8);
                doc.text(`• Email: ${medico.email || '---'}`, 135, y + 30);


                
                // Fondo gris oscuro para métricas
                doc.setFillColor(230, 230, 230);
                doc.rect(11, y + 40, 188, 18, 'F'); 

                // Métricas
                doc.setFontSize(10);
                doc.setTextColor(0);
                doc.setFont("helvetica", "bold");
                
                // Pacientes
                doc.text("Pacientes Atendidos:", 20, y + 52);
                doc.setTextColor(41, 128, 185); // Azul
                doc.text(`${medico.pacientes_atendidos || 0}`, 60, y + 52);

                // Calificación
                doc.setTextColor(0);
                doc.text("Calidad Promedio:", 85, y + 52);
                const promedio = medico.stats.promedio ? parseFloat(medico.stats.promedio).toFixed(1) : "N/A";
                
                // Color semáforo
                if (promedio >= 9) doc.setTextColor(39, 174, 96); // Verde
                else if (promedio >= 7) doc.setTextColor(230, 126, 34); // Naranja
                else doc.setTextColor(192, 57, 43); // Rojo
                
                doc.text(`${promedio}/10`, 120, y + 52);
                
                // Cursos Totales
                doc.setTextColor(0);
                doc.text("Cursos:", 145, y + 52);
                doc.text(`${medico.capacitaciones.length}`, 160, y + 52);

                y += 65; // Mover cursor abajo de la tarjeta

               
                if (medico.capacitaciones && medico.capacitaciones.length > 0) {
                    autoTable(doc, {
                        startY: y,
                        head: [['Curso / Capacitación', 'Estado', 'Fecha']],
                        body: medico.capacitaciones.map(c => [
                            c.nombre_curso, 
                            c.estado, 
                            new Date(c.fecha_inicio).toLocaleDateString()
                        ]),
                        theme: 'grid',
                        margin: { left: 15 },
                        tableWidth: 180,
                        styles: { fontSize: 8, cellPadding: 1 },
                        headStyles: { fillColor: [52, 73, 94] } // Gris azulado
                    });
                    y = doc.lastAutoTable.finalY + 10;
                } else {
                    y += 5; // Espacio si no hay tabla
                }
            });

            doc.save("Reporte_Personal_Completo.pdf");

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
        setCargando(false);
    };

    return (
        <div className="container mt-5 text-center">
            <div className="card shadow-lg p-5">
                <h1 className="mb-4" style={{color: '#2980b9'}}>🗂️ Ficha Técnica de Personal</h1>
                <p className="lead text-muted">
                    Generación de expediente completo con datos de contacto, perfil profesional, <br/>
                    estadísticas de atención y formación continua.
                </p>
                <hr className="my-4"/>

                {cargando ? (
                    <button className="btn btn-secondary btn-lg disabled">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Recopilando Información...
                    </button>
                ) : (
                    <button 
                        onClick={generarReporteMaestro} 
                        className="btn btn-primary btn-lg px-5 py-3 shadow"
                        style={{fontSize: '1.2rem', fontWeight: 'bold'}}
                    >
                        <i className="fas fa-file-pdf me-2"></i> Descargar Fichas PDF
                    </button>
                )}
            </div>
        </div>
    );
}

export default ReportePersonal;