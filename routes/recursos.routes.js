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

/**
 * @openapi
 * /api/recursos:
 *   get:
 *     summary: Lista todos los recursos
 *     tags: [Recursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de recursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recurso'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', asyncHandler(getRecursos));

/**
 * @openapi
 * /api/recursos/{id}:
 *   get:
 *     summary: Obtiene un recurso por id
 *     tags: [Recursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecursoId'
 *     responses:
 *       200:
 *         description: Recurso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recurso'
 *       400:
 *         description: Id con formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', asyncHandler(getRecursoById));

/**
 * @openapi
 * /api/recursos:
 *   post:
 *     summary: Crea un recurso (queda auditado)
 *     tags: [Recursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecursoInput'
 *     responses:
 *       201:
 *         description: Recurso creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recurso'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', asyncHandler(createRecurso));

/**
 * @openapi
 * /api/recursos/{id}:
 *   put:
 *     summary: Actualiza un recurso (queda auditado)
 *     tags: [Recursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecursoId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecursoInput'
 *     responses:
 *       200:
 *         description: Recurso actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recurso'
 *       400:
 *         description: Id con formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', asyncHandler(updateRecurso));

/**
 * @openapi
 * /api/recursos/{id}:
 *   delete:
 *     summary: Elimina un recurso (queda auditado)
 *     tags: [Recursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecursoId'
 *     responses:
 *       204:
 *         description: Recurso eliminado
 *       400:
 *         description: Id con formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', asyncHandler(deleteRecurso));

module.exports = router;
