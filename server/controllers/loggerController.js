const { createLogger, format, config, transports, level } = require('winston');
const { combine, timestamp, json } = format;
const path = require('path');
const morgan = require('morgan');

const winstonLoggerOptions = {
  file: {
    level: 'info',
    filename: path.resolve(`${__dirname}/../logs/datadog.log`),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const winstonLogger = createLogger({
  levels: config.syslog.levels,
  format: combine(timestamp(), json()),
  exitOnError: false,
  transports: [
    new transports.File(winstonLoggerOptions.file),
    new transports.Console(winstonLoggerOptions.console),
  ],
});

winstonLogger.stream = {
  write: function(message, encoding) {
    winstonLogger.log({
      level: level,
      message: message,
    });
  },
};

const morganMiddleware = morgan(':method :url :status', {
  stream: winstonLogger.stream,
});

module.exports = { morganMiddleware };
