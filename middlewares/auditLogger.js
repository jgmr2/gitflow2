const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const AUDITED_METHODS = ['POST', 'PUT', 'DELETE'];

// Evita log injection: un atacante no debe poder insertar saltos de línea
// u otros caracteres de control para falsificar entradas de la bitácora.
function stripControlChars(value) {
  return String(value).replace(/[\r\n\x00-\x1F\x7F]+/g, ' ').trim();
}

// Defensa en profundidad: aunque hoy no se registran body ni headers,
// se redacta cualquier JWT, número de tarjeta o par clave=valor sensible
// que pudiera colarse en la ruta (path/params) registrada como "action".
function redactSecrets(value) {
  return String(value)
    .replace(/[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, '[REDACTED_JWT]')
    .replace(/\b\d{13,19}\b/g, '[REDACTED_CARD]')
    .replace(
      /((?:password|pwd|token|secret|api[_-]?key|auth|card|cvv|ssn)\s*[:=]\s*)([^\s&]+)/gi,
      '$1[REDACTED]'
    );
}

function sanitizeForLog(value) {
  return redactSecrets(stripControlChars(value));
}

function auditLogger(req, res, next) {
  if (!AUDITED_METHODS.includes(req.method)) {
    return next();
  }

  // method/path/ip se capturan aquí, no dentro de 'finish': Express muta
  // req.url al atravesar routers anidados y solo lo restaura si el handler
  // final llama a next(), cosa que nuestros controladores no hacen.
  const method = req.method;
  const path = req.path;
  const ip = req.ip;

  res.on('finish', () => {
    // userId sí se lee aquí a propósito: este middleware corre antes que
    // verifyToken (montado dentro del router de /api/recursos), así que
    // req.user todavía no existe en este punto. Para 'finish' ya se ejecutó
    // toda la cadena sobre el mismo objeto req, incluyendo verifyToken.
    const userId = req.user?.id || req.headers['x-user-id'] || 'anonymous';

    const entry = {
      ip: sanitizeForLog(ip),
      userId: sanitizeForLog(userId),
      action: sanitizeForLog(`${method} ${path}`),
      statusCode: res.statusCode,
    };

    logger.info('audit', entry);

    AuditLog.create(entry).catch((err) => {
      logger.error('No se pudo guardar el registro de auditoría', { error: err.message });
    });
  });

  next();
}

module.exports = auditLogger;
