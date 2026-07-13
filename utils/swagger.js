const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Auditoría de Eventos Críticos',
      version: '1.0.0',
      description:
        'Microservicio de trazabilidad, logs y monitoreo seguro. Registra de forma inalterable las operaciones críticas (POST/PUT/DELETE) realizadas en la aplicación, con no-repudio orientado a análisis forense.',
    },
    servers: [
      { url: 'https://gitflow-n617.onrender.com', description: 'Producción (Render)' },
      { url: 'http://localhost:5100', description: 'Local (Docker)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: {
        RecursoId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId de MongoDB del recurso',
        },
        LogId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId de MongoDB del registro de auditoría',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@example.com' },
            password: { type: 'string', format: 'password', minLength: 8, example: 'claveSegura123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@example.com' },
            password: { type: 'string', format: 'password', example: 'claveSegura123' },
          },
        },
        AuthToken: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        RecursoInput: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'recurso de ejemplo' },
          },
        },
        Recurso: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6a505643ae5d629cfbe04164' },
            nombre: { type: 'string', example: 'recurso de ejemplo' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6a505643ae5d629cfbe04165' },
            timestamp: { type: 'string', format: 'date-time' },
            ip: { type: 'string', example: '203.0.113.10' },
            userId: { type: 'string', example: 'anonymous' },
            action: { type: 'string', example: 'POST /api/recursos' },
            statusCode: { type: 'integer', example: 201 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensaje de error' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
