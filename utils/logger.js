const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ''
            }`
        )
      ),
    }),
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: 'app_logs',
      tryReconnect: true,
      capped: true,
      cappedSize: 10000000,
    }),
  ],
});

module.exports = logger;
