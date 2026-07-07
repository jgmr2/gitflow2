const jwt = require('jsonwebtoken');

const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
}

async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  const user = await User.create({ email, password });
  const token = signToken(user);

  res.status(201).json({ token });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  const user = await User.findOne({ email }).select('+password');
  const passwordMatches = user ? await user.comparePassword(password) : false;

  if (!passwordMatches) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = signToken(user);

  res.json({ token });
}

module.exports = { register, login };
