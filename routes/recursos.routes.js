const express = require('express');

const router = express.Router();

// GET /api/recursos
router.get('/', (req, res) => {
  res.json([{ _id: '000000000000000000000001', nombre: 'recurso mock' }]);
});

// GET /api/recursos/:id
router.get('/:id', (req, res) => {
  res.json({ _id: req.params.id, nombre: 'recurso mock' });
});

// POST /api/recursos
router.post('/', (req, res) => {
  res.status(201).json({ _id: '000000000000000000000002', nombre: 'recurso mock creado' });
});

// PUT /api/recursos/:id
router.put('/:id', (req, res) => {
  res.json({ _id: req.params.id, nombre: 'recurso mock actualizado' });
});

// DELETE /api/recursos/:id
router.delete('/:id', (req, res) => {
  res.status(204).send();
});

module.exports = router;
