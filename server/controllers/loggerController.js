const { createLogger, format, transports } = require('winston');
const path = require('path');

const logFilePath = path.resolve(`${__dirname}/../logs/datadog.log`);

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [new transports.File({ filename: logFilePath })],
});

module.exports = { logger };
