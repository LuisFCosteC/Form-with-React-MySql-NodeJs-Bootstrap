-- ─── Turso / SQLite Database Schema ─────────────────────────────────────────────
-- Nota: La tabla se crea automáticamente en el servidor si no existe.
-- Si deseas ejecutarla o sembrar datos manualmente desde Turso CLI o el Dashboard:

CREATE TABLE IF NOT EXISTS employees (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  age           INTEGER NOT NULL,
  country       TEXT NOT NULL DEFAULT '',
  workPosition  TEXT NOT NULL,
  yearsWork     INTEGER NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Datos iniciales de prueba (opcional) ──────────────────────────────────────
INSERT INTO employees (name, age, country, workPosition, yearsWork) VALUES
  ('Luis Coste',     28, 'República Dominicana', 'Senior Full Stack Engineer',  6),
  ('Elena Rostova',  32, 'España',                'Lead Product Designer',       8),
  ('Carlos Mendoza', 35, 'México',                'Cloud & DevOps Architect',    11),
  ('Aisha Diallo',   26, 'Francia',               'Data Science Analyst',        3),
  ('Mateo Silva',    30, 'Colombia',              'Frontend React Specialist',   5),
  ('Sophie Zhang',   29, 'Canadá',                'QA Automation Engineer',      4);
