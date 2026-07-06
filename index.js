require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5100;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

async function start() {
  await mongoose.connect(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
