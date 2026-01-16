const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// --- CONFIGURACIÓN ---
app.use(cors());
app.use(express.json());

// --- CONEXIÓN A BASE DE DATOS ---
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ovnitrixviolent777', 
    database: 'hospital_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificación de conexión
dbPool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a la Base de Datos');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err);
    });

// =========================================================
//           RUTA PARA TU FORMULARIO DE INGRESO
// =========================================================

app.post('/api/ingreso-clinico', async (req, res) => {
    try {
        const { 
            nombrePaciente, fechaIngreso, presion, temperatura, 
            frecuencia, saturacion, peso, altura, observaciones 
        } = req.body;

        const sql = `
            INSERT INTO visitas_medicas 
            (nombre_paciente, fecha_ingreso, presion_arterial, temperatura, frecuencia_cardiaca, saturacion_oxigeno, peso, altura, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            nombrePaciente, fechaIngreso, presion, temperatura, 
            frecuencia, saturacion, peso, altura, observaciones
        ];

        const [result] = await dbPool.query(sql, values);
        
        console.log("✅ Nuevo ingreso registrado con ID:", result.insertId);
        res.status(201).json({ mensaje: 'Guardado correctamente', id: result.insertId });

    } catch (err) {
        console.error("❌ Error al guardar:", err);
        res.status(500).json({ error: 'Error al guardar en base de datos' });
    }
});


//RUTA: Registro Personal de Salud (RRHH)
app.post('/api/personal-salud', async (req, res) => {
    try {
        const { 
            nombreCompleto, cedula, especialidad, turno, 
            fechaNacimiento, sexo, telefono, email 
        } = req.body;

        const sql = `
            INSERT INTO personal_salud 
            (nombre_completo, cedula_profesional, especialidad, turno, fecha_nacimiento, sexo, telefono, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const datos = [nombreCompleto, cedula, especialidad, turno, fechaNacimiento, sexo, telefono, email];
        
        const [result] = await dbPool.query(sql, datos);
        res.status(201).json({ mensaje: 'Personal registrado con éxito', id: result.insertId });

    } catch (err) {
        console.error('Error en /api/personal-salud:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Esa cédula profesional ya está registrada.' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Inventario
app.post('/api/inventario', async (req, res) => {
    try {
        const { nombre, descripcion, tipo, unidadMedida, cantidadStock } = req.body;

        const sql = `
            INSERT INTO catalogo_inventario 
            (nombre_item, descripcion, tipo, unidad_medida, stock_actual) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const datos = [nombre, descripcion, tipo, unidadMedida, cantidadStock];

        const [result] = await dbPool.query(sql, datos);
        res.status(201).json({ mensaje: 'Ítem registrado correctamente', id: result.insertId });

    } catch (err) {
        console.error('Error en /api/inventario:', err);
        res.status(500).json({ error: 'Error al guardar en inventario' });
    }
});


// =========================================================
//           AQUÍ ESTÁ LA CORRECCIÓN DE TUS URGENCIAS
// =========================================================

// RUTA GET: Obtener Pacientes 
app.get('/api/pacientes', async (req, res) => {
    try {
        const sql = "SELECT id, nombre_paciente FROM visitas_medicas";
        
       
        const [results] = await dbPool.query(sql); 
        
        res.json(results);
    } catch (err) {
        console.error("Error obteniendo pacientes:", err);
        res.status(500).send("Error del servidor");
    }
});

// POST: Guardar Urgencia
app.post('/api/urgencias', async (req, res) => {
    try {
        const { idPaciente, nivelUrgencia, tiempoMax, descripcion } = req.body;

        const sql = `
            INSERT INTO urgencias (id_paciente, nivel_urgencia, tiempo_max, descripcion) 
            VALUES (?, ?, ?, ?)
        `;


        const [result] = await dbPool.query(sql, [idPaciente, nivelUrgencia, tiempoMax, descripcion]);
        
        res.status(201).send("Urgencia registrada correctamente");

    } catch (err) {
        console.error("Error al registrar urgencia:", err);
        res.status(500).send("Error en el servidor");
    }
});


app.post('/api/admision-inteligente', async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction(); // Iniciamos transacción

        const { idPaciente, especialidad, idMedicamento, cantidad } = req.body;

        // BUSCAR CAMA DISPONIBLE
        const [camas] = await connection.query(
            "SELECT id, nombre_completo_cama FROM camas WHERE ocupada = 0 LIMIT 1 FOR UPDATE"
        );
        
        if (camas.length === 0) {
            throw new Error("¡No hay camas disponibles en el hospital!");
        }
        const camaAsignada = camas[0];

        //  BUSCAR DOCTOR (ALEATORIO)
        const [doctores] = await connection.query(
            `SELECT id, nombre_completo 
             FROM personal_salud 
             WHERE especialidad = ? AND activo = 1 
             ORDER BY RAND() 
             LIMIT 1`,
            [especialidad]
        );

        if (doctores.length === 0) {
            throw new Error(`No hay doctores disponibles para la especialidad: ${especialidad}`);
        }

       
        const doctorAsignado = doctores[0]; 
        

        // DESCONTAR MEDICAMENTO (Opcional)
        if (idMedicamento && cantidad > 0) {
            await connection.query(
                "UPDATE catalogo_inventario SET stock_actual = stock_actual - ? WHERE id = ?",
                [cantidad, idMedicamento]
            );
        }

        // REGISTRAR EL INTERNAMIENTO
        const [result] = await connection.query(
            `INSERT INTO internamientos 
            (id_paciente, id_medico, id_cama, id_medicamento, dosis_inicial, diagnostico) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [idPaciente, doctorAsignado.id, camaAsignada.id, idMedicamento, cantidad, `Ingreso por ${especialidad}`]
        );

        // MARCAR CAMA COMO OCUPADA
        await connection.query("UPDATE camas SET ocupada = 1 WHERE id = ?", [camaAsignada.id]);

        await connection.commit(); // Confirmar cambios

        // RESPONDER
        res.status(200).json({
            mensaje: "Admisión exitosa",
            datosPDF: {
                folio: result.insertId,
                doctor: doctorAsignado.nombre_completo,
                cama: camaAsignada.nombre_completo_cama,
                especialidad: especialidad,
                fecha: new Date().toLocaleString()
            }
        });

    } catch (error) {
        await connection.rollback(); // Cancelar si hay error
        console.error("Error en admisión:", error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});






// RUTA AUXILIAR Obtener Medicamentos para el Select
app.get('/api/medicamentos', async (req, res) => {
    const [rows] = await dbPool.query("SELECT id, nombre_item, stock_actual FROM catalogo_inventario WHERE stock_actual > 0");
    res.json(rows);
});


//  Obtener lista simple de personal para el Select
app.get('/api/lista-personal', async (req, res) => {
    try {
        // Traemos ID, Nombre y Cargo/Especialidad para mostrarlo
        const [rows] = await dbPool.query("SELECT id, nombre_completo, especialidad FROM personal_salud WHERE activo = 1");
        res.json(rows);
    } catch (err) {
        console.error("Error obteniendo personal:", err);
        res.status(500).send("Error del servidor");
    }
});

// Guardar el Rol Asignado
app.post('/api/roles', async (req, res) => {
    try {
        const { idPersonal, nombreRol, descripcion } = req.body;

        const sql = `
            INSERT INTO roles_asignados (id_personal, nombre_rol, descripcion)
            VALUES (?, ?, ?)
        `;
        
        const [result] = await dbPool.query(sql, [idPersonal, nombreRol, descripcion]);
        
        res.status(201).json({ mensaje: "Rol asignado correctamente", id: result.insertId });

    } catch (err) {
        console.error("Error guardando rol:", err);
        res.status(500).json({ error: "Error al guardar el rol" });
    }
});


// Obtener Doctores
app.get('/api/lista-medicos', async (req, res) => {
    const [rows] = await dbPool.query("SELECT id, nombre_completo FROM personal_salud WHERE activo = 1");
    res.json(rows);
});

// Obtener Pacientes ATENDIDOS por un Doctor específico
app.get('/api/pacientes-de-doctor/:idMedico', async (req, res) => {
    try {
        const { idMedico } = req.params;
        // Esta consulta es CLAVE: Une internamientos con visitas_medicas
        // para traer solo los nombres de los pacientes que ese doctor atendió.
        const sql = `
            SELECT DISTINCT p.id, p.nombre_paciente 
            FROM visitas_medicas p
            INNER JOIN internamientos i ON p.id = i.id_paciente
            WHERE i.id_medico = ?
        `;
        const [rows] = await dbPool.query(sql, [idMedico]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error buscando pacientes");
    }
});

// Guardar la Evaluación
app.post('/api/evaluaciones', async (req, res) => {
    try {
        const { idMedico, idPaciente, nivelAtencion, puntuacion, comentarios } = req.body;
        
        const sql = `INSERT INTO evaluaciones_desempeno 
                     (id_medico, id_paciente, nivel_atencion, puntuacion, comentarios) 
                     VALUES (?, ?, ?, ?, ?)`;
        
        await dbPool.query(sql, [idMedico, idPaciente, nivelAtencion, puntuacion, comentarios]);
        res.json({ mensaje: "Evaluación guardada con éxito" });

    } catch (error) {
        console.error("Error al guardar evaluación:", error);
        res.status(500).json({ error: "Error al guardar" });
    }
});


//Obtener el Catálogo de Cursos (Para el Select)
app.get('/api/catalogo-cursos', async (req, res) => {
    try {
        const [rows] = await dbPool.query("SELECT * FROM catalogo_cursos");
        res.json(rows);
    } catch (err) {
        res.status(500).send("Error al cargar cursos");
    }
});

//Asignar Capacitación al Doctor
app.post('/api/asignar-capacitacion', async (req, res) => {
    try {
        const { idPersonal, idCurso, fechaInicio, observaciones } = req.body;
        
        const sql = `
            INSERT INTO historial_capacitaciones 
            (id_personal, id_curso, fecha_inicio, observaciones) 
            VALUES (?, ?, ?, ?)
        `;
        
        await dbPool.query(sql, [idPersonal, idCurso, fechaInicio, observaciones]);
        
        res.status(201).json({ mensaje: "Capacitación asignada correctamente" });
    } catch (err) {
        console.error("Error asignando curso:", err);
        res.status(500).json({ error: "Error al guardar en base de datos" });
    }
});



//DAR DE BAJA A UN MÉDICO (SOFT DELETE)
app.delete('/api/personal-salud/:id', async (req, res) => {
    try {
        const { id } = req.params;

        
        const sql = "UPDATE personal_salud SET activo = 0 WHERE id = ?";
        
        await dbPool.query(sql, [id]);

        res.json({ mensaje: "Personal dado de baja correctamente (Historial conservado)" });

    } catch (error) {
        console.error("Error al dar de baja:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


//REPORTE MAESTRO (DATOS PERSONALES + MÉTRICAS)
app.get('/api/reporte-maestro', async (req, res) => {
    try {
        // Traer TODOS los campos de la tabla personal_salud
        // Ordenamos: Primero los Activos (1), luego los Inactivos (0)
        const [medicos] = await dbPool.query("SELECT * FROM personal_salud ORDER BY activo DESC, nombre_completo ASC");

        // Enriquecer cada perfil con los conteos y listas
        const reporteCompleto = await Promise.all(medicos.map(async (medico) => {
            
            // A. Roles Asignados
            const [roles] = await dbPool.query(
                "SELECT nombre_rol, descripcion FROM roles_asignados WHERE id_personal = ?", 
                [medico.id]
            );

            // B. Historial de Cursos (Para tabla detallada)
            const [cursos] = await dbPool.query(`
                SELECT c.nombre_curso, h.estado, h.fecha_inicio 
                FROM historial_capacitaciones h
                JOIN catalogo_cursos c ON h.id_curso = c.id 
                WHERE h.id_personal = ? 
                ORDER BY h.fecha_inicio DESC`, 
                [medico.id]
            );

            // C. Calidad (Promedio de estrellas y total evaluaciones)
            const [evals] = await dbPool.query(
                "SELECT AVG(puntuacion) as promedio, COUNT(*) as total FROM evaluaciones_desempeno WHERE id_medico = ?", 
                [medico.id]
            );

            // D. Último Comentario (Feedback cualitativo)
            const [lastComment] = await dbPool.query(
                "SELECT comentarios FROM evaluaciones_desempeno WHERE id_medico = ? ORDER BY fecha_evaluacion DESC LIMIT 1", 
                [medico.id]
            );

            // E. Productividad (Conteo de pacientes en internamientos)
            const [prod] = await dbPool.query(
                "SELECT COUNT(*) as total FROM internamientos WHERE id_medico = ?", 
                [medico.id]
            );

            // Retornamos el objeto mezclado
            return {
                ...medico, // Aquí van: telefono, email, sexo, fecha_nacimiento, etc.
                roles: roles,
                capacitaciones: cursos,
                stats: evals[0], // { promedio: 9.5, total: 10 }
                ultimo_comentario: lastComment.length > 0 ? lastComment[0].comentarios : "Sin comentarios recientes.",
                pacientes_atendidos: prod[0].total
            };
        }));

        res.json(reporteCompleto);

    } catch (error) {
        console.error("Error en reporte maestro:", error);
        res.status(500).send("Error generando reporte");
    }
});


//INICIAR SERVIDOR
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});