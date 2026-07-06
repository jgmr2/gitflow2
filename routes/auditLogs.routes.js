const express = require('express');

const router = express.Router();

// GET /api/logs
router.get('/', (req, res) => {
  res.json([
    {
      _id: '000000000000000000000001',
      timestamp: '2026-07-06T12:00:00.000Z',
      ip: '127.0.0.1',
      userId: 'mock-user-1',
      action: 'POST /api/recursos',
      statusCode: 201,
    },
  ]);
});

// GET /api/logs/:id
router.get('/:id', (req, res) => {
  res.json({
    _id: req.params.id,
    timestamp: '2026-07-06T12:00:00.000Z',
    ip: '127.0.0.1',
    userId: 'mock-user-1',
    action: 'POST /api/recursos',
    statusCode: 201,
  });
});

module.exports = router;
