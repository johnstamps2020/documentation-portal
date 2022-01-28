const winston = require('winston');
const path = require('path');

const loggerOptions = {
  file: {
    level: 'warn',
    filename: path.resolve(`${__dirname}/../logs/datadog.log`),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'warn',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const winstonLogger = winston.createLogger({
  exitOnError: false,
  transports: [
    new winston.transports.File(loggerOptions.file),
    new winston.transports.Console(loggerOptions.console),
  ],
});

winstonLogger.stream = {
  write: function(message, encoding) {
    winstonLogger.info(message);
  },
};

module.exports = winstonLogger;
