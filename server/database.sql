-- ─── Database setup ────────────────────────────────────────────────────────────
-- Run this script in your MySQL/MariaDB instance before starting the server.

CREATE DATABASE IF NOT EXISTS employees_crud
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE employees_crud;

CREATE TABLE IF NOT EXISTS employees (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  age           TINYINT UNSIGNED NOT NULL,
  country       VARCHAR(100)  NOT NULL DEFAULT '',
  workPosition  VARCHAR(150)  NOT NULL,
  yearsWork     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Optional: seed sample data ────────────────────────────────────────────────
INSERT IGNORE INTO employees (id, name, age, country, workPosition, yearsWork) VALUES
  (1, 'Luis Coste',     28, 'República Dominicana', 'Senior Full Stack Engineer',  6),
  (2, 'Elena Rostova',  32, 'España',                'Lead Product Designer',       8),
  (3, 'Carlos Mendoza', 35, 'México',                'Cloud & DevOps Architect',    11),
  (4, 'Aisha Diallo',   26, 'Francia',               'Data Science Analyst',        3),
  (5, 'Mateo Silva',    30, 'Colombia',              'Frontend React Specialist',   5),
  (6, 'Sophie Zhang',   29, 'Canadá',               'QA Automation Engineer',      4);
