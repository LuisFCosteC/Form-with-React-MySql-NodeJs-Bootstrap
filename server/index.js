require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ─── DB Pool ───────────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'employees_crud',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
    console.warn('⚠️  Server running without DB — configure .env variables');
  });

// ─── Helper: validate required fields ─────────────────────────────────────────
function validate(body) {
  const { name, age, country, workPosition, yearsWork } = body;
  if (!name || String(name).trim() === '')       return 'El nombre es obligatorio';
  if (!workPosition || String(workPosition).trim() === '') return 'El cargo es obligatorio';
  if (age === undefined || isNaN(Number(age)))   return 'La edad debe ser un número';
  if (yearsWork === undefined || isNaN(Number(yearsWork))) return 'Los años de experiencia deben ser un número';
  return null;
}

// ─── POST /create ──────────────────────────────────────────────────────────────
app.post('/create', async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });

  const { name, age, country, workPosition, yearsWork } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO employees (name, age, country, workPosition, yearsWork) VALUES (?, ?, ?, ?, ?)',
      [String(name).trim(), Number(age), String(country || '').trim(), String(workPosition).trim(), Number(yearsWork)]
    );
    res.status(201).json({ insertId: result.insertId, affectedRows: result.affectedRows });
  } catch (e) {
    console.error('POST /create:', e.message);
    res.status(500).json({ error: 'Error al registrar empleado' });
  }
});

// ─── GET /employees ────────────────────────────────────────────────────────────
app.get('/employees', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    console.error('GET /employees:', e.message);
    res.status(500).json({ error: 'Error al obtener empleados' });
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
    const [result] = await pool.query(
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
    const [result] = await pool.query('DELETE FROM employees WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ affectedRows: result.affectedRows });
  } catch (e) {
    console.error('DELETE /delete:', e.message);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});