require('dotenv').config();
const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(o => o.trim())
  : true;

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ─── Turso Client ─────────────────────────────────────────────────────────────
let dbClient;

function getDb() {
  if (!dbClient) {
    const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('Falta la variable de entorno TURSO_DATABASE_URL (o TURSO_URL). Configúrala en Vercel o en server/.env');
    }

    dbClient = createClient({
      url,
      authToken
    });
  }
  return dbClient;
}

// Inicializar tabla si no existe
let tableInitialized = false;
async function ensureTable() {
  if (tableInitialized) return;
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      country TEXT NOT NULL,
      workPosition TEXT NOT NULL,
      yearsWork INTEGER NOT NULL
    );
  `);
  tableInitialized = true;
}

// ─── Helper: validate required fields ─────────────────────────────────────────
function validate(body) {
  const { name, age, country, workPosition, yearsWork } = body;
  if (!name || String(name).trim() === '') return 'El nombre es obligatorio';
  if (!workPosition || String(workPosition).trim() === '') return 'El cargo es obligatorio';
  if (age === undefined || isNaN(Number(age))) return 'La edad debe ser un número';
  if (yearsWork === undefined || isNaN(Number(yearsWork))) return 'Los años de experiencia deben ser un número';
  return null;
}

// ─── Root — health check ───────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'StaffMatrix API (Turso libSQL)',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
    endpoints: ['GET /employees', 'POST /create', 'PUT /update', 'DELETE /delete/:id', 'GET /health']
  });
});

// ─── GET /health ───────────────────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    const db = getDb();
    await ensureTable();
    await db.execute('SELECT 1');
    res.json({ status: 'ok', db: 'turso connected', timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

// ─── GET /employees ────────────────────────────────────────────────────────────
app.get('/employees', async (_req, res) => {
  try {
    const db = getDb();
    await ensureTable();
    const result = await db.execute('SELECT * FROM employees ORDER BY id DESC');
    
    // Normalizar filas para asegurar tipos numéricos y JSON seguro (evita BigInt serialize errors)
    const rows = result.rows.map(row => ({
      id: Number(row.id),
      name: String(row.name || ''),
      age: Number(row.age),
      country: String(row.country || ''),
      workPosition: String(row.workPosition || ''),
      yearsWork: Number(row.yearsWork)
    }));

    res.json(rows);
  } catch (e) {
    console.error('GET /employees error:', e.message);
    res.status(500).json({ error: 'Error al obtener empleados', details: e.message });
  }
});

// ─── POST /create ──────────────────────────────────────────────────────────────
app.post('/create', async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });

  const { name, age, country, workPosition, yearsWork } = req.body;
  try {
    const db = getDb();
    await ensureTable();

    const result = await db.execute({
      sql: 'INSERT INTO employees (name, age, country, workPosition, yearsWork) VALUES (?, ?, ?, ?, ?)',
      args: [String(name).trim(), Number(age), String(country || '').trim(), String(workPosition).trim(), Number(yearsWork)]
    });

    const insertId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null;
    res.status(201).json({ insertId, affectedRows: result.rowsAffected });
  } catch (e) {
    console.error('POST /create error:', e.message);
    res.status(500).json({ error: 'Error al registrar empleado', details: e.message });
  }
});

// ─── PUT /update ───────────────────────────────────────────────────────────────
app.put('/update', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'El id es obligatorio' });

  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });

  const { name, age, country, workPosition, yearsWork } = req.body;
  try {
    const db = getDb();
    await ensureTable();

    const result = await db.execute({
      sql: 'UPDATE employees SET name=?, age=?, country=?, workPosition=?, yearsWork=? WHERE id=?',
      args: [String(name).trim(), Number(age), String(country || '').trim(), String(workPosition).trim(), Number(yearsWork), Number(id)]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ affectedRows: result.rowsAffected });
  } catch (e) {
    console.error('PUT /update error:', e.message);
    res.status(500).json({ error: 'Error al actualizar empleado', details: e.message });
  }
});

// ─── DELETE /delete/:id ────────────────────────────────────────────────────────
app.delete('/delete/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });

  try {
    const db = getDb();
    await ensureTable();

    const result = await db.execute({
      sql: 'DELETE FROM employees WHERE id=?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ affectedRows: result.rowsAffected });
  } catch (e) {
    console.error('DELETE /delete error:', e.message);
    res.status(500).json({ error: 'Error al eliminar empleado', details: e.message });
  }
});

// ─── Start (solo en local) ─────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
}

// Exporta app para Vercel Serverless
module.exports = app;