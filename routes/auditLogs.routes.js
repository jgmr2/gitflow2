const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const { getAuditLogs, getAuditLogById } = require('../controllers/auditLogs.controller');

const router = express.Router();

/**
 * @openapi
 * /api/logs:
 *   get:
 *     summary: Lista los registros de la bitácora de auditoría
 *     description: Soporta filtros y paginación para análisis forense.
 *     tags: [Auditoría]
 *     parameters:
 *       - name: userId
 *         in: query
 *         schema: { type: string }
 *         description: Filtra por ID del usuario ejecutor
 *       - name: action
 *         in: query
 *         schema: { type: string }
 *         description: Filtra por acción exacta (ej. "POST /api/recursos")
 *       - name: statusCode
 *         in: query
 *         schema: { type: integer }
 *         description: Filtra por código de estado HTTP
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 50 }
 *         description: Máximo de registros a devolver
 *       - name: skip
 *         in: query
 *         schema: { type: integer, default: 0 }
 *         description: Registros a saltar (paginación)
 *     responses:
 *       200:
 *         description: Listado de bitácoras, más reciente primero
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 */
router.get('/', asyncHandler(getAuditLogs));

/**
 * @openapi
 * /api/logs/{id}:
 *   get:
 *     summary: Obtiene un registro de auditoría por id
 *     tags: [Auditoría]
 *     parameters:
 *       - $ref: '#/components/parameters/LogId'
 *     responses:
 *       200:
 *         description: Registro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLog'
 *       400:
 *         description: Id con formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Registro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', asyncHandler(getAuditLogById));

module.exports = router;
