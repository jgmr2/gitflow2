require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const auditLogger = require('./middlewares/auditLogger');
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
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log('Conexión a MongoDB establecida correctamente');
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
