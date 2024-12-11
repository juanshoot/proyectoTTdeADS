-- Crear base de datos
CREATE DATABASE GestionTT;
USE GestionTT;

DROP DATABASE IF EXISTS GestionTT;


CREATE TABLE Alumnos (
    id_alumno INT AUTO_INCREMENT PRIMARY KEY,        -- ID único del alumno
    rol VARCHAR(250) NULL,                           -- Rol asignado al alumno
    id_equipo INT,                                   -- Relación con la tabla de Equipos
    id_protocolo INT,                                -- Relación con la tabla de Protocolos
    nombre VARCHAR(250) UNIQUE NULL,                -- Nombre único del alumno
    correo VARCHAR(250) UNIQUE NOT NULL,            -- Correo único del alumno
    boleta VARCHAR(50),                             -- Boleta del alumno
    estado VARCHAR(2) DEFAULT 'A',                  -- Estado de alta ('A') o baja ('B')
    contrasena VARCHAR(150),                        -- Contraseña hasheada
    nombre_equipo VARCHAR(150),                    -- Nombre del equipo asociado
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de cambio del registro
);

-- Tabla de Docentes
CREATE TABLE Docentes (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,      -- ID único del docente
    rol VARCHAR(250) NULL,                          -- Rol asignado al docente
    id_equipo INT,                                  -- Relación con la tabla de Equipos
    id_protocolo INT,                               -- Relación con la tabla de Protocolos
    academia VARCHAR(150),
    nombre VARCHAR(250) UNIQUE NULL,               -- Nombre único del docente
    correo VARCHAR(250) UNIQUE NOT NULL,           -- Correo único del docente
    clave_empleado VARCHAR(50),                     -- Clave de usuario (en lugar de boleta)
    estado VARCHAR(2) DEFAULT 'A',                 -- Estado de alta ('A') o baja ('B')
    contrasena VARCHAR(150),                       -- Contraseña hasheada
    nombre_equipo VARCHAR(150),                   -- Nombre del equipo asociado
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de cambio del registro
);

CREATE TABLE Roles (
    rol VARCHAR(250) PRIMARY KEY,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE Equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
	id_protocolo INT, -- Protocolo asociado al equipo
    lider VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el líder del equipo
    nombre_equipo VARCHAR(150) NOT NULL,
    titulo VARCHAR(255),
    director VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    director_2 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    sinodal_1 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_2 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_3 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    academia VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de protocolos
CREATE TABLE Protocolos (
    id_protocolo INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT, -- Protocolo asociado al equipo
    lider VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el líder del protocolo
    titulo VARCHAR(255) NOT NULL,
    etapa VARCHAR(100) NOT NULL DEFAULT 'Registro',
    academia VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
	director VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    director_2 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    sinodal_1 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_2 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_3 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    calificacion VARCHAR(100) NOT NULL  DEFAULT 'Pendiente',
    comentarios VARCHAR(255),
    estado VARCHAR(100) NOT NULL DEFAULT 'Registrado',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla de permisos
CREATE TABLE Permisos (
    rol VARCHAR(100),
    permisos VARCHAR(10) NOT NULL, -- Descripción de los permisos asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Etapas (
    id_etapa VARCHAR(100),
    etapas VARCHAR(150) NOT NULL, -- Descripción de los etapas asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EstadoRevision (
    id_estado VARCHAR(100),
    estados VARCHAR(150) NOT NULL, -- Descripción de los estados asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Academia (
    id_academia VARCHAR(100),
    academia VARCHAR(150) NOT NULL, -- Descripción de los estados asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para registrar cambios
CREATE TABLE ABC (
    id_cambio INT AUTO_INCREMENT PRIMARY KEY,      -- ID del cambio
    tabla_afectada VARCHAR(100) NOT NULL,           -- Tabla donde se hizo el cambio (Ej: Usuarios, Equipos, Protocolos)
    id_registro INT NOT NULL,                       -- ID del registro afectado
    cambio_realizado TEXT NOT NULL,                 -- Descripción del cambio realizado
    usuario VARCHAR(100) NOT NULL,                  -- Nombre del usuario que hizo el cambio
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha y hora del cambio
);



CREATE TABLE Evaluacion (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY, -- ID único para la evaluación
    id_protocolo INT NOT NULL,                    -- Relación con la tabla Protocolos
    id_equipo INT NOT NULL,                       -- Relación con la tabla Equipos
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de la evaluación
    sinodal VARCHAR(100) NOT NULL,             -- Nombre del primer sinodal
    titulo_corresponde_producto ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 1
    observaciones_1 TEXT,                        -- Observaciones de la pregunta 1
    resumen_claro ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 2
    observaciones_2 TEXT,                        -- Observaciones de la pregunta 2
    palabras_clave_adecuadas ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 3
    observaciones_3 TEXT,                        -- Observaciones de la pregunta 3
    problema_comprensible ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 4
    observaciones_4 TEXT,                        -- Observaciones de la pregunta 4
    objetivo_preciso_relevante ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 5
    observaciones_5 TEXT,                        -- Observaciones de la pregunta 5
    planteamiento_claro ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 6
    observaciones_6 TEXT,                        -- Observaciones de la pregunta 6
    contribuciones_justificadas ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 7
    observaciones_7 TEXT,                        -- Observaciones de la pregunta 7
    viabilidad_adecuada ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 8
    observaciones_8 TEXT,                        -- Observaciones de la pregunta 8
    propuesta_metodologica_pertinente ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 9
    observaciones_9 TEXT,                        -- Observaciones de la pregunta 9
    calendario_adecuado ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 10
    observaciones_10 TEXT,                      -- Observaciones de la pregunta 10
    aprobado ENUM('SI', 'NO') DEFAULT 'NO',    -- Si fue aprobado el protocolo
    recomendaciones_adicionales TEXT,          -- Recomendaciones generales de la evaluación
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE Dictamen (
    id_dictamen INT AUTO_INCREMENT PRIMARY KEY,  -- ID único para el dictamen
    id_protocolo INT NOT NULL,                   -- Relación con la tabla Protocolos
    id_equipo INT NOT NULL,                      -- Relación con la tabla Equipos
    resultado ENUM('APROBADO', 'NO APROBADO', 'EN REVISIÓN') DEFAULT 'EN REVISIÓN', -- Resultado general
    fecha_dictamen TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del dictamen
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE
);


-- ----------------------------------------- CAMBIOS ------------------------------------------------------------

-- Tabla Alumnos
ALTER TABLE Alumnos

ADD CONSTRAINT fk_alumno_rol
FOREIGN KEY (rol) REFERENCES Roles(rol)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
ADD CONSTRAINT fk_alumno_equipo
FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
ADD CONSTRAINT fk_alumno_protocolo
FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
    ON DELETE SET NULL
    ON UPDATE CASCADE;


-- Tabla Docentes
ALTER TABLE Docentes

ADD CONSTRAINT fk_docentes_rol
FOREIGN KEY (rol) REFERENCES Roles(rol)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
ADD CONSTRAINT fk_docentes_equipo
FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
ADD CONSTRAINT fk_docentes_protocolo
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
    
   
-- Tabla Permisos
ALTER TABLE Permisos
ADD CONSTRAINT fk_permisos_usuario
FOREIGN KEY (rol) REFERENCES Roles(rol)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
    

    
-- ----------------------------------------- CAMBIOS ------------------------------------------------------------


SELECT * FROM Alumnos;
SELECT * FROM Docentes;
SELECT * FROM Roles;
SELECT * FROM Equipos;
SELECT * FROM Protocolos;


SELECT * FROM Permisos;


SELECT * FROM Etapas;
SELECT * FROM EstadoRevision;
SELECT * FROM Academia;
SELECT * FROM ABC;



DELETE FROM Equipos WHERE id_equipo = 7;





-- ------------------------------------- INSERTS PRUEBA ------------------------------------------------------------


-- Insertar roles en la tabla Roles
INSERT INTO Roles (rol)
VALUES 
('PRESIDENTE ACADEMIA'),
('TECNICO'),
('ADMIN'),
('SECRETARIO'),
('PROFESOR'),
('DIRECTOR'),
('CATT'),
('ESTUDIANTE'),
('SINODAL');


INSERT INTO Permisos (rol, permisos)
VALUES ('ADMIN', '0123456789ABC');

ALTER TABLE Permisos 
MODIFY permisos VARCHAR(20) NOT NULL;

UPDATE Permisos 
SET permisos = '0123456789ABCDEFG' 
WHERE rol = 'ADMIN';

UPDATE Permisos 
SET permisos = '0123456789ABCDFG' 
WHERE rol = 'CATT';

UPDATE Permisos 
SET permisos = '0123456789ABCDFG' 
WHERE rol = 'SECRETARIO';

UPDATE Permisos 
SET permisos = '13457CF' 
WHERE rol = 'PROFESOR';

UPDATE Permisos 
SET permisos = '13457CF' 
WHERE rol = 'DIRECTOR';

UPDATE Permisos 
SET permisos = '13457BCEF' 
WHERE rol = 'SINODAL';

UPDATE Permisos 
SET permisos = '02456789ABC' 
WHERE rol = 'ESTUDIANTE';

UPDATE Permisos 
SET permisos = '1357CF' 
WHERE rol = 'PRESIDENTE ACADEMIA';

UPDATE Permisos 
SET permisos = '0123456789ABCDFG' 
WHERE rol = 'TECNICO';


SELECT 'DOCENTE' AS tipo, id_docente, nombre, correo, clave_empleado 
FROM Docentes 
WHERE nombre = ? OR correo = ? OR clave_empleado = ?

UNION 

SELECT 'ALUMNO' AS tipo, id_alumno, nombre, correo, boleta 
FROM Alumnos 
WHERE nombre = ? OR correo = ?

DELETE FROM Docentes 
WHERE 
    (nombre = 'VANESSA CAMACHO ELISA' AND correo = 'vaneCam78@gmail.com' AND clave_empleado = '2022630557') OR
    (nombre = 'VANESSA CAMACHO ORTEGA' AND correo = 'vaneCam7@gmail.com' AND clave_empleado = '2022630500') OR
    (nombre = 'VANESSA CAMACHO ORTEGAZ' AND correo = 'vaneCam71@gmail.com' AND clave_empleado = '2022630501') OR
    (nombre = 'VANESSA CAMACHO ORTEGAM' AND correo = 'vaneCam75@gmail.com' AND clave_empleado = '2022630502') OR
    (nombre = 'VANESSA CAMACHO ORTEGAY' AND correo = 'vaneCam77@gmail.com' AND clave_empleado = '2022630503') OR
    (nombre = 'VANESSA CAMACHO ORTEGAYMER' AND correo = 'vaneCam79@gmail.com' AND clave_empleado = '2022630508') OR
    (nombre = 'VANESSA CAMACHO ORTEHYUIAD' AND correo = 'vaneCam89@gmail.com' AND clave_empleado = '2022630509') OR
    (nombre = 'VANESSA CAMACHO ORTEHYUIADOGY' AND correo = 'vaneCam99@gmail.com' AND clave_empleado = '2022630510') OR
    (nombre = 'VANESSA CAMACHO ORTEHYUIADOGYOP' AND correo = 'vaneCam87@gmail.com' AND clave_empleado = '2022630513') OR
    (nombre = 'VANESSA ORTEGA' AND correo = 'vaneCam28@gmail.com' AND clave_empleado = '2022630566') OR
    (nombre = 'MARTIN CORTES' AND correo = 'marcort00@gmail.com' AND clave_empleado = '2024999999');
    
    DELETE FROM Alumnos 
WHERE 
    (nombre = 'VANESSA CAMACHO ELISAM' AND correo = 'vaneCam28@gmail.com' AND boleta = '2022630504') OR
    (nombre = 'VANESSA CAMACHO ELISAMO' AND correo = 'vaneCam29@gmail.com' AND boleta = '2022630505') OR
    (nombre = 'VANESSA CAMACHO ALITA' AND correo = 'vaneCam99@gmail.com' AND boleta = '2022630545');
-- ------------------------------------- INSERTS PRUEBA ------------------------------------------------------------
