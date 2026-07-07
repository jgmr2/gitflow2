const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const verifyToken = require('../middlewares/verifyToken');
const {
  getRecursos,
  getRecursoById,
  createRecurso,
  updateRecurso,
  deleteRecurso,
} = require('../controllers/recursos.controller');

const router = express.Router();

router.use(verifyToken);

router.get('/', asyncHandler(getRecursos));
router.get('/:id', asyncHandler(getRecursoById));
router.post('/', asyncHandler(createRecurso));
router.put('/:id', asyncHandler(updateRecurso));
router.delete('/:id', asyncHandler(deleteRecurso));

module.exports = router;
