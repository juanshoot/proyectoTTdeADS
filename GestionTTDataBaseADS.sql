-- Crear base de datos
CREATE DATABASE GestionTT;
USE GestionTT;

DROP TABLE IF EXISTS Usuarios;
DROP DATABASE IF EXISTS GestionTT;

-- Tabla de usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    rol ENUM('Estudiante', 'Sinodal', 'CATT','Director') NOT NULL,
    id_equipo INT ,
    id_protocolo INT ,
    nombre VARCHAR(250) NOT NULL,
    correo VARCHAR(250) UNIQUE NOT NULL,
    boleta VARCHAR(50),
    contrasena VARCHAR(150),
    nombre_equipo VARCHAR(150),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE Equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    lider VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el líder del equipo
    nombre_equipo VARCHAR(150) NOT NULL,
    titulo VARCHAR(255),
    id_protocolo INT, -- Protocolo asociado al equipo
    sinodal VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    director VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    area VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de protocolos
CREATE TABLE Protocolos (
    id_protocolo INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT, -- Protocolo asociado al equipo
    lider VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el líder del protocolo
    titulo VARCHAR(255) NOT NULL,
    etapa ENUM('Registro', 'Revisión', 'Evaluación', 'Retroalimentación', 'Finalizado'),
    director VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director del protocolo
    sinodal VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal del protocolo
    catt VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el CATT
    calificacion VARCHAR(100) NOT NULL  DEFAULT 'Pendiente',
    comentarios VARCHAR(255) NOT NULL,
    estado ENUM('Registrado', 'Revisión', 'Aprobado', 'No Aprobado') DEFAULT 'Registrado',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de permisos
CREATE TABLE Permisos (
    id_usuario INT,
    permisos VARCHAR(10) NOT NULL, -- Descripción de los permisos asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------- CAMBIOS ------------------------------------------------------------

-- Tabla Usuarios
ALTER TABLE Usuarios
ADD CONSTRAINT fk_usuario_equipo
FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
ADD CONSTRAINT fk_usuario_protocolo
FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Tabla Equipos
ALTER TABLE Equipos
ADD CONSTRAINT fk_equipo_protocolo
FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Tabla Protocolos
ALTER TABLE Protocolos
ADD CONSTRAINT fk_protocolo_equipo
FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
    
    -- Agregar la columna "area" a la tabla Protocolos
ALTER TABLE Protocolos
ADD COLUMN area VARCHAR(150);


-- Tabla Permisos
ALTER TABLE Permisos
ADD CONSTRAINT fk_permisos_usuario
FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
    
-- ----------------------------------------- CAMBIOS ------------------------------------------------------------


SELECT * FROM Usuarios;
SELECT * FROM Equipos;
SELECT * FROM Protocolos;
SELECT * FROM Permisos;

DELETE FROM Equipos WHERE id_equipo = 7;





-- ------------------------------------- INSERTS PRUEBA ------------------------------------------------------------


-- Insertar equipos
INSERT INTO Equipos (lider, nombre_equipo, titulo, id_protocolo, sinodal, director, area)
VALUES
(1, 'Equipo A', 'Investigación en IA', NULL, 4, 5, 'Tecnología'),
(2, 'Equipo B', 'Automatización de Procesos', NULL, 4, 5, 'Ingeniería'),
(3, 'Equipo C', 'Redes de Comunicación', NULL, 4, 5, 'Telecomunicaciones');

-- Insertar protocolos
INSERT INTO Protocolos (id_equipo, lider, titulo, etapa, director, sinodal, catt, calificacion, comentarios, estado)
VALUES
(1, 1, 'Sistema de Gestión de Protocolos', 'Registro', 5, 4, 3, 'Pendiente', 'En desarrollo', 'Registrado'),
(2, 2, 'Automatización de Tareas Académicas', 'Revisión', 5, 4, 3, 'Pendiente', 'Faltan detalles', 'Revisión'),
(3, 3, 'Análisis de Algoritmos', 'Evaluación', 5, 4, 3, 'Aprobado', 'Cumple con los requisitos', 'Aprobado');

-- Insertar permisos
INSERT INTO Permisos (id_usuario, permisos)
VALUES
(1, 'Ver protocolos, Crear protocolos'),
(2, 'Ver protocolos'),
(3, 'Ver protocolos, Evaluar protocolos'),
(4, 'Ver protocolos, Evaluar protocolos, Asignar protocolos'),
(5, 'Administrar protocolos');

-- ------------------------------------- INSERTS PRUEBA ------------------------------------------------------------
