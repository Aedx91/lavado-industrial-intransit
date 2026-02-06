const winston = require('winston');

const isAlphaDebug = String(process.env.ALPHA_DEBUG).toLowerCase() === 'true';

const logger = winston.createLogger({
  level: isAlphaDebug ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} ${level}: ${message}${metaString}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

module.exports = { logger };
