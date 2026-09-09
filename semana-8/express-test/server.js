require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:4200', // tu app Angular
  credentials: true // necesario para que acepte cookies cross-origin
}));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 3000;

// "Base de datos" en memoria, solo para pruebas.
// password real: 123456
const USUARIOS = [
  {
    id: 1,
    username: 'demo',
    email: 'demo@test.com',
    passwordHash: bcrypt.hashSync('123456', 10),
  },
];

async function validarCredenciales(email, password) {
  const usuario = USUARIOS.find((u) => u.email === email);
  if (!usuario) return null;

  const passwordOk = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordOk) return null;

  return usuario;
}

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  const usuario = await validarCredenciales(email, password);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { sub: usuario.id, username: usuario.username, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  });

  // el body NO lleva el token, solo los datos que el frontend necesita mostrar
  res.json({ username: usuario.username, email: usuario.email });
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(204).send();
});

// GET /api/me
app.get('/api/me', (req, res) => {
  const token = req.cookies.token; // el navegador la mandó sola

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ username: payload.username, email: payload.email });
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
