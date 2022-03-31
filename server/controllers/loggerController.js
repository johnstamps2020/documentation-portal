const { createLogger, format, config, transports } = require('winston');
const expressWinston = require('express-winston');
const { combine, timestamp, json } = format;
const path = require('path');

const winstonLoggerOptions = {
  file: {
    level: 'warning',
    filename: path.resolve(`${__dirname}/../logs/server.log`),
    handleExceptions: true,
    handleRejections: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'warning',
    handleExceptions: true,
    handleRejections: true,
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

const expressWinstonLogger = expressWinston.logger({
  winstonInstance: winstonLogger,
  msg: 'HTTP {{req.method}} {{req.url}}',
});

const expressWinstonErrorLogger = expressWinston.errorLogger({
  winstonInstance: winstonLogger,
  msg: '{{err.message}} {{res.statusCode}} {{req.method}}',
});

module.exports = {
  winstonLogger,
  expressWinstonLogger,
  expressWinstonErrorLogger,
};
