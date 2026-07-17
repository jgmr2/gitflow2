require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const logger = require('./utils/logger');
const swaggerSpec = require('./utils/swagger');
const auditLogger = require('./middlewares/auditLogger');
const appTokenAuth = require('./middlewares/appTokenAuth');
const authRoutes = require('./routes/auth.routes');
const auditLogsRoutes = require('./routes/auditLogs.routes');
const recursosRoutes = require('./routes/recursos.routes');

const app = express();
const PORT = process.env.PORT || 5100;
const MONGO_URI = process.env.MONGO_URI;

// Render sirve detrás de Cloudflare + su propio balanceador (más de un
// salto, y no controlamos cuántos). "true" confía en toda la cadena de
// X-Forwarded-For y toma la IP pública original del cliente; con un número
// fijo de saltos (ej. 1) req.ip terminaba devolviendo una IP privada interna
// de la infraestructura de Render en vez de la IP real, invalidando el
// campo "IP de origen" del log.
app.set('trust proxy', true);

app.use(express.json());
app.use(auditLogger);

// app.use('/', ...) trata '/' como PREFIJO, no como ruta exacta: interceptaría
// también /health, /api/logs, etc. Los assets estáticos de Swagger sí pueden ir
// con app.use (solo responden si el archivo existe, si no llaman a next()),
// pero la página en sí necesita app.get('/') para matchear únicamente la raíz.
app.use(swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerSpec));

// Protege todos los endpoints de negocio con un application token (JWT
// firmado con JWT_SECRET), enviado en el header app-token. Va antes de
// las rutas de negocio pero no sobre '/' ni '/health': un navegador no
// puede mandar headers custom solo navegando, y '/health' lo usa Render
// para el healthcheck del servicio (no debe requerir credenciales).
app.use('/api', appTokenAuth);

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

// El servidor HTTP arranca independientemente de Mongo: si la conexión a la
// base de datos falla o tarda, Render igual detecta el puerto abierto en vez
// de marcar el deploy como caído. El estado real de Mongo se expone en /health.
mongoose.connection.on('error', (err) => {
  logger.error('Error en la conexión a MongoDB', { error: err.message });
});

mongoose
  .connect(MONGO_URI)
  .then(() => logger.info('Conexión a MongoDB establecida correctamente'))
  .catch((err) => logger.error('No se pudo conectar a MongoDB', { error: err.message }));

app.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});
