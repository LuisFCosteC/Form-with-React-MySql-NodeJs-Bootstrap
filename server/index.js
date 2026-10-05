require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Permite cualquier origen en Vercel (ajusta CLIENT_URL en producción si quieres restringirlo)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(o => o.trim())
  : true; // true = cualquier origen (útil en desarrollo/serverless)

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ─── DB Pool ───────────────────────────────────────────────────────────────────
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'employees_crud',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: 5,  // Bajo para serverless (cada función tiene su propio pool)
      queueLimit: 0
    });
  }
  return pool;
}

// ─── Helper: validate required fields ─────────────────────────────────────────
function validate(body) {
  const { name, age, country, workPosition, yearsWork } = body;
  if (!name || String(name).trim() === '')       return 'El nombre es obligatorio';
  if (!workPosition || String(workPosition).trim() === '') return 'El cargo es obligatorio';
  if (age === undefined || isNaN(Number(age)))   return 'La edad debe ser un número';
  if (yearsWork === undefined || isNaN(Number(yearsWork))) return 'Los años de experiencia deben ser un número';
  return null;
}

// ─── Root — health check ───────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'StaffMatrix API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: ['GET /employees', 'POST /create', 'PUT /update', 'DELETE /delete/:id', 'GET /health']
  });
});

// ─── GET /health ───────────────────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await getPool().query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

// ─── GET /employees ────────────────────────────────────────────────────────────
app.get('/employees', async (_req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM employees ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    console.error('GET /employees:', e.message);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// ─── POST /create ──────────────────────────────────────────────────────────────
app.post('/create', async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });

  const { name, age, country, workPosition, yearsWork } = req.body;
  try {
    const [result] = await getPool().query(
      'INSERT INTO employees (name, age, country, workPosition, yearsWork) VALUES (?, ?, ?, ?, ?)',
      [String(name).trim(), Number(age), String(country || '').trim(), String(workPosition).trim(), Number(yearsWork)]
    );
    res.status(201).json({ insertId: result.insertId, affectedRows: result.affectedRows });
  } catch (e) {
    console.error('POST /create:', e.message);
    res.status(500).json({ error: 'Error al registrar empleado' });
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
    const [result] = await getPool().query(
      'UPDATE employees SET name=?, age=?, country=?, workPosition=?, yearsWork=? WHERE id=?',
      [String(name).trim(), Number(age), String(country || '').trim(), String(workPosition).trim(), Number(yearsWork), Number(id)]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ affectedRows: result.affectedRows });
  } catch (e) {
    console.error('PUT /update:', e.message);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

// ─── DELETE /delete/:id ────────────────────────────────────────────────────────
app.delete('/delete/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result] = await getPool().query('DELETE FROM employees WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ affectedRows: result.affectedRows });
  } catch (e) {
    console.error('DELETE /delete:', e.message);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

// ─── Start (solo en local; Vercel exporta el app directamente) ─────────────────
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
}

// Exporta app para Vercel Serverless
module.exports = app;