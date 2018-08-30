const winston = require('winston');

module.exports = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
  ),
});
