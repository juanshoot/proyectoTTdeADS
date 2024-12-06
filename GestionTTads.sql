-- Crear base de datos
CREATE DATABASE GestionTT;
USE GestionTT;

DROP DATABASE IF EXISTS GestionTT;

-- Tabla de usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(250) NULL,
    id_equipo INT ,
    id_protocolo INT ,
    id_TT INT,
    nombre VARCHAR(250) UNIQUE NULL,
    correo VARCHAR(250) UNIQUE NOT NULL,
    boleta VARCHAR(50),
    contrasena VARCHAR(150),
    nombre_equipo VARCHAR(150),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Roles (
    rol VARCHAR(250) PRIMARY KEY,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE Equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
	id_protocolo INT, -- Protocolo asociado al equipo
    id_TT INT,
    lider VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el líder del equipo
    nombre_equipo VARCHAR(150) NOT NULL,
    titulo VARCHAR(255),
    director VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    director_2 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    sinodal_1 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_2 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_3 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    area VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de protocolos
CREATE TABLE Protocolos (
    id_protocolo INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT, -- Protocolo asociado al equipo
     id_TT INT,
    lider VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el líder del protocolo
    titulo VARCHAR(255) NOT NULL,
    etapa VARCHAR(100) NOT NULL DEFAULT 'Registro',
    rama VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
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

CREATE TABLE TrabajoTerminal (
	id_TT INT AUTO_INCREMENT PRIMARY KEY,
    id_protocolo INT,
    id_equipo INT, -- Protocolo asociado al equipo
    lider VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el líder del protocolo
    titulo VARCHAR(255) NOT NULL,
    etapa VARCHAR(100) NOT NULL DEFAULT 'Registro',
	rama VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
	director VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el director
    director_2 VARCHAR(100) NOT NULL DEFAULT '-', -- Referencia a Usuarios (id_usuario) que es el director
    sinodal_1 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_2 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_3 VARCHAR(100) NOT NULL, -- Referencia a Usuarios (id_usuario) que es el sinodal
    calificacion VARCHAR(100) NOT NULL  DEFAULT 'Pendiente',
    comentarios VARCHAR(255),
    estado_TT1 VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
    estado_TT2 VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de permisos
CREATE TABLE Permisos (
    rol VARCHAR(100),
    permisos VARCHAR(10) NOT NULL, -- Descripción de los permisos asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PermisosESPECIALES (
    nombre VARCHAR(100),
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

CREATE TABLE Ramas (
    id_rama VARCHAR(100),
    ramas VARCHAR(150) NOT NULL, -- Descripción de los estados asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------- CAMBIOS ------------------------------------------------------------

-- Tabla Usuarios
ALTER TABLE Usuarios

ADD CONSTRAINT fk_usuario_rol
FOREIGN KEY (rol) REFERENCES Roles(rol)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
ADD CONSTRAINT fk_usuario_equipo
FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
ADD CONSTRAINT fk_usuario_protocolo
FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
    ADD CONSTRAINT fk_usuario_TT
FOREIGN KEY (id_TT) REFERENCES TrabajoTerminal(id_TT)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Tabla Equipos
ALTER TABLE Equipos
ADD CONSTRAINT fk_equipo_protocolo
FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
    ADD CONSTRAINT fk_equipo_TT
FOREIGN KEY (id_TT) REFERENCES TrabajoTerminal(id_TT)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Tabla Protocolos
ALTER TABLE Protocolos
ADD CONSTRAINT fk_protocolo_equipo
FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    ADD CONSTRAINT fk_protocolo_TT
FOREIGN KEY (id_TT) REFERENCES TrabajoTerminal(id_TT)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
    
    -- Tabla TrabajoTerminal
    ALTER TABLE TrabajoTerminal
ADD CONSTRAINT fk_trabajoTerminal_equipo
FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    ADD CONSTRAINT fk_trabajoTerminal_protocolo
FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
    


-- Tabla Permisos
ALTER TABLE Permisos
ADD CONSTRAINT fk_permisos_usuario
FOREIGN KEY (rol) REFERENCES Roles(rol)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
    

    
-- ----------------------------------------- CAMBIOS ------------------------------------------------------------


SELECT * FROM Usuarios;
SELECT * FROM Roles;
SELECT * FROM Equipos;
SELECT * FROM Protocolos;
SELECT * FROM TrabajoTerminal;

SELECT * FROM Permisos;
SELECT * FROM PermisosESPECIALES;

SELECT * FROM Etapas;
SELECT * FROM EstadoRevision;
SELECT * FROM Ramas;



DELETE FROM Equipos WHERE id_equipo = 7;





-- ------------------------------------- INSERTS PRUEBA ------------------------------------------------------------


-- Insertar roles en la tabla Roles
INSERT INTO Roles (rol)
VALUES 
('ESTUDIANTE'),
('SINODAL'),
('PROFESOR'),
('DIRECTOR'),
('CATT');

-- ------------------------------------- INSERTS PRUEBA ------------------------------------------------------------
