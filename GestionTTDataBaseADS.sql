-- Crear base de datos
CREATE DATABASE GestionTT;
USE GestionTT;

-- Tabla de usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('Estudiante', 'Sinodal', 'CATT') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de protocolos
CREATE TABLE Protocolos (
    id_protocolo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    id_estudiante INT,
    fecha_envio DATE NOT NULL,
    estado ENUM('Registrado', 'Revisión', 'Aprobado', 'No Aprobado') DEFAULT 'Registrado',
    FOREIGN KEY (id_estudiante) REFERENCES Usuarios(id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Tabla de asignaciones de sinodales
CREATE TABLE Asignaciones (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_protocolo INT NOT NULL,
    id_sinodal INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_sinodal) REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabla de evaluaciones de protocolos
CREATE TABLE Evaluaciones (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_protocolo INT NOT NULL,
    id_sinodal INT NOT NULL,
    comentarios TEXT,
    dictamen ENUM('Aprobado', 'No Aprobado', 'Pendiente') NOT NULL,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_sinodal) REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabla de etapas del protocolo
CREATE TABLE Etapas (
    id_etapa INT AUTO_INCREMENT PRIMARY KEY,
    id_protocolo INT NOT NULL,
    etapa_actual ENUM('Registro', 'Revisión', 'Evaluación', 'Retroalimentación', 'Finalizado') NOT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Insertar usuarios
INSERT INTO Usuarios (nombre, correo, contrasena, rol)
VALUES 
('Martín Cortés', 'martin.cortes@example.com', 'hashed_password_1', 'Estudiante'),
('Valeria Alarcón', 'valeria.alarcon@example.com', 'hashed_password_2', 'Estudiante'),
('Alexis López', 'alexis.lopez@example.com', 'hashed_password_3', 'Estudiante'),
('Juan Ochoa', 'juan.ochoa@example.com', 'hashed_password_4', 'Sinodal'),
('José Olguín', 'jose.olguin@example.com', 'hashed_password_5', 'CATT');

-- Insertar protocolos
INSERT INTO Protocolos (titulo, descripcion, id_estudiante, fecha_envio, estado)
VALUES
('Sistema de Gestión de Protocolos', 'Proyecto para optimizar el proceso de evaluación de TT.', 1, '2024-11-01', 'Registrado'),
('Automatización de Tareas Académicas', 'Propuesta para reducir tareas administrativas.', 2, '2024-11-02', 'Revisión'),
('Análisis de Algoritmos', 'Estudio comparativo de algoritmos de optimización.', 3, '2024-11-03', 'Aprobado'),
('Seguridad en Redes', 'Implementación de herramientas para proteger redes.', 1, '2024-11-04', 'No Aprobado'),
('Inteligencia Artificial en Educación', 'Uso de IA para personalizar la enseñanza.', 2, '2024-11-05', 'Revisión');

-- Insertar asignaciones
INSERT INTO Asignaciones (id_protocolo, id_sinodal)
VALUES
(1, 4),
(2, 4),
(3, 4),
(4, 4),
(5, 4);

-- Insertar evaluaciones
INSERT INTO Evaluaciones (id_protocolo, id_sinodal, comentarios, dictamen)
VALUES
(1, 4, 'Buen avance, pero faltan detalles en la descripción.', 'Pendiente'),
(2, 4, 'Se requiere mayor claridad en los objetivos.', 'Pendiente'),
(3, 4, 'Excelente trabajo, cumple con todos los criterios.', 'Aprobado'),
(4, 4, 'No cumple con los requisitos básicos.', 'No Aprobado'),
(5, 4, 'Faltan referencias bibliográficas.', 'Pendiente');

-- Insertar etapas
INSERT INTO Etapas (id_protocolo, etapa_actual)
VALUES
(1, 'Registro'),
(2, 'Revisión'),
(3, 'Evaluación'),
(4, 'Retroalimentación'),
(5, 'Revisión');