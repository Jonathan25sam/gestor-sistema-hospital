-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: hospital_db
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `camas`
--

DROP TABLE IF EXISTS `camas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cuarto` varchar(50) NOT NULL,
  `numero_cama` varchar(50) NOT NULL,
  `nombre_completo_cama` varchar(100) GENERATED ALWAYS AS (concat(`cuarto`,_utf8mb4'-',`numero_cama`)) VIRTUAL,
  `piso` varchar(20) DEFAULT NULL,
  `ocupada` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camas`
--

LOCK TABLES `camas` WRITE;
/*!40000 ALTER TABLE `camas` DISABLE KEYS */;
INSERT INTO `camas` (`id`, `cuarto`, `numero_cama`, `piso`, `ocupada`) VALUES (1,'101','A','1',1),(2,'101','B','1',1),(3,'102','A','1',1),(4,'201','Unica','2',1),(5,'UCI','1','3',1),(6,'UCI','2','3',1),(7,'201','A','Piso 2',1),(8,'201','B','Piso 2',1),(9,'202','A','Piso 2',0),(10,'202','B','Piso 2',0),(11,'205','Suite','Piso 2',0);
/*!40000 ALTER TABLE `camas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_cursos`
--

DROP TABLE IF EXISTS `catalogo_cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_curso` varchar(150) NOT NULL,
  `descripcion` text,
  `duracion_horas` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_cursos`
--

LOCK TABLES `catalogo_cursos` WRITE;
/*!40000 ALTER TABLE `catalogo_cursos` DISABLE KEYS */;
INSERT INTO `catalogo_cursos` VALUES (1,'Soporte Vital Básico (BLS)','Técnicas fundamentales para salvar vidas en paro cardíaco.',8),(2,'Soporte Vital Cardiovascular Avanzado (ACLS)','Manejo avanzado de emergencias cardiovasculares.',16),(3,'Manejo de Residuos Biológico-Infecciosos (RPBI)','Normativa oficial para la clasificación y desecho de residuos peligrosos.',4),(4,'Lavado de Manos y Asepsia','Protocolos universales para prevención de infecciones nosocomiales.',2),(5,'Atención Humanizada al Paciente','Taller de empatía, comunicación asertiva y trato digno.',5),(6,'Uso de Expediente Clínico Electrónico','Capacitación técnica sobre el software del hospital.',3),(7,'Protocolo Código Infarto','Actuación rápida ante pacientes con síntomas de infarto agudo.',6),(8,'Farmacovigilancia Básica','Detección y reporte de reacciones adversas a medicamentos.',4),(9,'Protección Radiológica','Seguridad para personal expuesto a rayos X e imagenología.',10),(10,'Cidados Paliativos','Atención integral para pacientes en fase terminal.',12);
/*!40000 ALTER TABLE `catalogo_cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_inventario`
--

DROP TABLE IF EXISTS `catalogo_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_item` varchar(255) NOT NULL,
  `descripcion` text,
  `tipo` varchar(100) DEFAULT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  `stock_actual` int DEFAULT '0',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_inventario`
--

LOCK TABLES `catalogo_inventario` WRITE;
/*!40000 ALTER TABLE `catalogo_inventario` DISABLE KEYS */;
INSERT INTO `catalogo_inventario` VALUES (1,'paracetamol 800 mg','malestar general del cuerpo','Medicamento','frasco',959,'2025-12-05 22:17:56'),(2,'Clonazepan 500mg','Sirve para que el paciente consiga el sueño ','Medicamento','frasco',900,'2026-01-05 18:39:27');
/*!40000 ALTER TABLE `catalogo_inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluaciones_desempeno`
--

DROP TABLE IF EXISTS `evaluaciones_desempeno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluaciones_desempeno` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_medico` int NOT NULL,
  `id_paciente` int NOT NULL,
  `nivel_atencion` enum('Excelente','Bueno','Regular','Malo','Pésimo') NOT NULL,
  `puntuacion` int DEFAULT NULL,
  `comentarios` text,
  `fecha_evaluacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_medico` (`id_medico`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `evaluaciones_desempeno_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `personal_salud` (`id`),
  CONSTRAINT `evaluaciones_desempeno_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `visitas_medicas` (`id`),
  CONSTRAINT `evaluaciones_desempeno_chk_1` CHECK ((`puntuacion` between 1 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluaciones_desempeno`
--

LOCK TABLES `evaluaciones_desempeno` WRITE;
/*!40000 ALTER TABLE `evaluaciones_desempeno` DISABLE KEYS */;
INSERT INTO `evaluaciones_desempeno` VALUES (1,4,2,'Bueno',8,'debería ser mas claro con la medicacion. ','2025-12-22 22:03:22'),(2,2,1,'Bueno',9,'buen doctor. ','2026-01-05 18:52:20');
/*!40000 ALTER TABLE `evaluaciones_desempeno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_capacitaciones`
--

DROP TABLE IF EXISTS `historial_capacitaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_capacitaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_personal` int NOT NULL,
  `id_curso` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `estado` enum('Programado','En Curso','Completado','Certificado') DEFAULT 'Programado',
  `observaciones` text,
  PRIMARY KEY (`id`),
  KEY `id_personal` (`id_personal`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `historial_capacitaciones_ibfk_1` FOREIGN KEY (`id_personal`) REFERENCES `personal_salud` (`id`),
  CONSTRAINT `historial_capacitaciones_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `catalogo_cursos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_capacitaciones`
--

LOCK TABLES `historial_capacitaciones` WRITE;
/*!40000 ALTER TABLE `historial_capacitaciones` DISABLE KEYS */;
INSERT INTO `historial_capacitaciones` VALUES (1,2,4,'2026-01-08','Programado','SOLO PARA ESPECIALISTAS DE ALTA CATEGORÍA.'),(2,4,5,'2026-01-05','Programado','certificación urgente para sindicalizarme. '),(3,14,7,'2026-01-06','Programado','necesita el certificado lo mas pronto posible para su registro ante el gobierno. ');
/*!40000 ALTER TABLE `historial_capacitaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internamientos`
--

DROP TABLE IF EXISTS `internamientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internamientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  `id_cama` int NOT NULL,
  `id_medicamento` int DEFAULT NULL,
  `dosis_inicial` int DEFAULT '0',
  `diagnostico` text,
  `fecha_ingreso` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(20) DEFAULT 'Hospitalizado',
  PRIMARY KEY (`id`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_medico` (`id_medico`),
  KEY `id_cama` (`id_cama`),
  KEY `id_medicamento` (`id_medicamento`),
  CONSTRAINT `internamientos_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `visitas_medicas` (`id`),
  CONSTRAINT `internamientos_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `personal_salud` (`id`),
  CONSTRAINT `internamientos_ibfk_3` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id`),
  CONSTRAINT `internamientos_ibfk_4` FOREIGN KEY (`id_medicamento`) REFERENCES `catalogo_inventario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internamientos`
--

LOCK TABLES `internamientos` WRITE;
/*!40000 ALTER TABLE `internamientos` DISABLE KEYS */;
INSERT INTO `internamientos` VALUES (1,1,2,1,1,2,'Ingreso por Cardiologia','2025-12-06 00:45:16','Hospitalizado'),(2,1,2,2,1,2,'Ingreso por Cardiologia','2025-12-06 00:50:21','Hospitalizado'),(3,1,2,3,1,2,'Ingreso por Cardiologia','2025-12-06 00:51:38','Hospitalizado'),(4,1,3,4,1,10,'Ingreso por Cardiologia','2025-12-06 00:59:28','Hospitalizado'),(5,1,6,5,1,10,'Ingreso por Pediatria','2025-12-06 00:59:43','Hospitalizado'),(6,1,5,6,1,10,'Ingreso por Pediatria','2025-12-06 00:59:53','Hospitalizado'),(7,2,4,7,1,2,'Ingreso por Cardiologia','2025-12-10 18:44:39','Hospitalizado'),(8,4,3,8,1,3,'Ingreso por Cardiologia','2026-01-05 18:44:07','Hospitalizado');
/*!40000 ALTER TABLE `internamientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_salud`
--

DROP TABLE IF EXISTS `personal_salud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_salud` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) NOT NULL,
  `cedula_profesional` varchar(20) NOT NULL,
  `especialidad` varchar(50) NOT NULL,
  `turno` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('M','F','Otro') DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula_profesional` (`cedula_profesional`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_salud`
--

LOCK TABLES `personal_salud` WRITE;
/*!40000 ALTER TABLE `personal_salud` DISABLE KEYS */;
INSERT INTO `personal_salud` VALUES (1,'rebeca diaz torres ','34560978','cirujana plástica','Guardia','2006-12-09','F','5567907890','rebeca@gmail.com',1,'2025-12-05 22:28:35'),(2,'Dr. Roberto Méndez','CED-1001','Cardiologia','Matutino','1975-03-12','M','555-123-4567','roberto.mendez@hospital.com',1,'2025-12-06 00:37:00'),(3,'Dra. Laura Guzmán','CED-1002','Cardiologia','Vespertino','1982-07-24','F','555-987-6543','laura.guzman@hospital.com',1,'2025-12-06 00:37:00'),(4,'Dr. Carlos Vidal','CED-1003','Cardiologia','Nocturno','1980-11-05','M','555-456-7890','carlos.vidal@hospital.com',1,'2025-12-06 00:37:00'),(5,'Dra. Ana Torres','CED-2001','Pediatria','Matutino','1985-05-15','F','555-222-3333','ana.torres@hospital.com',1,'2025-12-06 00:37:00'),(6,'Dr. Miguel Ángel Soto','CED-2002','Pediatria','Vespertino','1979-09-30','M','555-444-5555','miguel.soto@hospital.com',1,'2025-12-06 00:37:00'),(7,'Dra. Sofía Ramírez','CED-2003','Pediatria','Fin de Semana','1990-02-14','F','555-666-7777','sofia.ramirez@hospital.com',1,'2025-12-06 00:37:00'),(8,'Dr. Jorge Campos','CED-3001','Urgencias','Matutino','1983-12-01','M','555-888-9999','jorge.campos@hospital.com',1,'2025-12-06 00:37:00'),(9,'Dra. Valeria Montes','CED-3002','Urgencias','Nocturno','1988-06-20','F','555-000-1111','valeria.montes@hospital.com',1,'2025-12-06 00:37:00'),(10,'Dr. Esteban Quito','CED-3003','Urgencias','Mixto','1976-08-10','M','555-321-6549','esteban.quito@hospital.com',1,'2025-12-06 00:37:00'),(11,'Dra. Patricia Silva','CED-4001','Neurologia','Matutino','1972-04-18','F','555-741-8520','patricia.silva@hospital.com',0,'2025-12-06 00:37:00'),(12,'Dr. Humberto Eco','CED-4002','Neurologia','Vespertino','1969-01-25','M','555-963-8521','humberto.eco@hospital.com',1,'2025-12-06 00:37:00'),(13,'Dr. Lisa Cuddy','CED-4003','Neurologia','Nocturno','1981-10-31','F','555-159-7530','lisa.cuddy@hospital.com',0,'2025-12-06 00:37:00'),(14,'Dr. Luis Fernando Hernandez Perez ','CED-5001','Cardiología','Vespertino','2004-04-12','M','5535798090','luis@gmail.com',1,'2026-01-05 18:34:48');
/*!40000 ALTER TABLE `personal_salud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_asignados`
--

DROP TABLE IF EXISTS `roles_asignados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_asignados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_personal` int NOT NULL,
  `nombre_rol` varchar(100) NOT NULL,
  `descripcion` text,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_personal` (`id_personal`),
  CONSTRAINT `roles_asignados_ibfk_1` FOREIGN KEY (`id_personal`) REFERENCES `personal_salud` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_asignados`
--

LOCK TABLES `roles_asignados` WRITE;
/*!40000 ALTER TABLE `roles_asignados` DISABLE KEYS */;
INSERT INTO `roles_asignados` VALUES (1,14,'jefe de área medica de la especialidad de cardiología ','asignar turnos a cada especialista de esta área.','2026-01-05 18:41:07');
/*!40000 ALTER TABLE `roles_asignados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urgencias`
--

DROP TABLE IF EXISTS `urgencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urgencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `nivel_urgencia` varchar(50) DEFAULT NULL,
  `tiempo_max` int DEFAULT NULL,
  `descripcion` text,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urgencias`
--

LOCK TABLES `urgencias` WRITE;
/*!40000 ALTER TABLE `urgencias` DISABLE KEYS */;
INSERT INTO `urgencias` VALUES (1,1,'Amarillo',50,'dolor de pecho fuerte ','Pendiente','2025-12-05 23:42:08'),(2,4,'Verde',15,'taquicardia. ','Pendiente','2026-01-05 18:37:51');
/*!40000 ALTER TABLE `urgencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitas_medicas`
--

DROP TABLE IF EXISTS `visitas_medicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitas_medicas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_paciente` varchar(255) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `presion_arterial` varchar(50) DEFAULT NULL,
  `temperatura` varchar(50) DEFAULT NULL,
  `frecuencia_cardiaca` varchar(50) DEFAULT NULL,
  `saturacion_oxigeno` varchar(50) DEFAULT NULL,
  `peso` varchar(50) DEFAULT NULL,
  `altura` varchar(50) DEFAULT NULL,
  `observaciones` text,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas_medicas`
--

LOCK TABLES `visitas_medicas` WRITE;
/*!40000 ALTER TABLE `visitas_medicas` DISABLE KEYS */;
INSERT INTO `visitas_medicas` VALUES (1,'luis perez','2025-12-04','115/110','37.6','100','94','66','1.70','dolor en el pecho ','2025-12-04 20:29:32'),(2,'oscar antonio torres','2025-12-12','115/90','','','','','','','2025-12-10 18:23:14'),(3,'erik fernendez','2025-12-10','115/95','37.8','88','92','79','1.80','tiene dolor de cabeza ','2025-12-10 18:27:11'),(4,'Ricardo Carmona Matinez','2026-01-01','135/95','38','100','92','79','1.81','el paciente entro con taquicardia debido al consumo de cafeína. ','2026-01-05 18:31:12');
/*!40000 ALTER TABLE `visitas_medicas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-16 15:09:11
