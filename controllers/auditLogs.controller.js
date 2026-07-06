const AuditLog = require('../models/AuditLog');

async function getAuditLogs(req, res) {
  const { userId, action, statusCode, limit = 50, skip = 0 } = req.query;

  const filter = {};
  if (userId) filter.userId = userId;
  if (action) filter.action = action;
  if (statusCode) filter.statusCode = Number(statusCode);

  const logs = await AuditLog.find(filter)
    .sort({ timestamp: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.json(logs);
}

async function getAuditLogById(req, res) {
  const log = await AuditLog.findById(req.params.id);

  if (!log) {
    return res.status(404).json({ error: 'Registro de auditoría no encontrado' });
  }

  res.json(log);
}

module.exports = { getAuditLogs, getAuditLogById };
