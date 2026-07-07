require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const logger = require('./utils/logger');
const auditLogger = require('./middlewares/auditLogger');
const authRoutes = require('./routes/auth.routes');
const auditLogsRoutes = require('./routes/auditLogs.routes');
const recursosRoutes = require('./routes/recursos.routes');

const app = express();
const PORT = process.env.PORT || 5100;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(auditLogger);

app.get('/', (req, res) => {
  res.send('Conexión a MongoDB establecida correctamente');
});

app.use('/api/auth', authRoutes);
app.use('/api/logs', auditLogsRoutes);
app.use('/api/recursos', recursosRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Identificador inválido' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }
  logger.error('Error no controlado en la petición', { error: err.message });
  res.status(500).json({ error: 'Error interno del servidor' });
});

async function start() {
  await mongoose.connect(MONGO_URI);
  logger.info('Conexión a MongoDB establecida correctamente');
  app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`);
  });
}

start().catch((err) => {
  logger.error('Error al iniciar la aplicación', { error: err.message });
  process.exit(1);
});
