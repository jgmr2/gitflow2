const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const { getAuditLogs, getAuditLogById } = require('../controllers/auditLogs.controller');

const router = express.Router();

router.get('/', asyncHandler(getAuditLogs));
router.get('/:id', asyncHandler(getAuditLogById));

module.exports = router;
