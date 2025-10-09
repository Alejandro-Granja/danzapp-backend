const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const key_jwt = process.env.JWT_SECRET || '93!SFSCDDSodsfk923*ada';
const DB_PATH = path.resolve(__dirname, '../data/users.json');

const readUsers = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeUsers = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// POST /register
const register = async (req, res) => {
  try {
    const { email, name, country, city, birthdate, password } = req.body;
    if (!email || !name || !country || !city || !birthdate || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const users = readUsers();
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(), // o uuid
      email,
      name,
      country,
      city,
      birthdate,
      password: hashedPassword,
      role: 'critic'
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign(
      { userId: newUser.id, email, name, role: newUser.role },
      key_jwt,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Credenciales requeridas' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      key_jwt,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /users/:id/password (usuario cambia su password)
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];  // Formato: Bearer <token>
  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const { userId } = jwt.verify(token, key_jwt);
    if (userId != id) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  try {
    const users = readUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = users[idx];
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[idx].password = hashedPassword;
    writeUsers(users);

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error en cambio de password:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /users/:id/force-password (admin fuerza cambio)
const forceChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const users = readUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[idx].password = hashedPassword;
    writeUsers(users);

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error en cambio de password forzado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { register, login, changePassword, forceChangePassword };
