const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true,
  },
  ip: {
    type: String,
    required: true,
    immutable: true,
  },
  userId: {
    type: String,
    required: true,
    immutable: true,
  },
  action: {
    type: String,
    required: true,
    immutable: true,
  },
  statusCode: {
    type: Number,
    required: true,
    immutable: true,
  },
});

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
