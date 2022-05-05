const { createLogger, format, config, transports } = require('winston');
const expressWinston = require('express-winston');
const { combine, timestamp, json, prettyPrint } = format;
const path = require('path');

const commonWinstonOptions = {
  handleExceptions: true,
  handleRejections: true,
};

const winstonLoggerOptions = {
  file: {
    ...commonWinstonOptions,
    filename: path.resolve(`${__dirname}/../logs/server.log`),
    maxsize: 5242880, //5MB
    maxFiles: 5,
  },
  console: {
    ...commonWinstonOptions,
  },
};

const reformatUncaughtException = format((info, opts) => {
  const infoDate = info.date;
  if (info.exception === true && infoDate) {
    delete info.date;
    info.timestamp = new Date(infoDate).toISOString();
  }
  return info;
});

const winstonLogger = createLogger({
  levels: config.syslog.levels,
  level: 'warning',
  // If no format is provided in timestamp(), "new Date().toISOString()" is used.
  // Empty format causes an issue with the timezone - winston logs in the UTC timezone.
  // If you pass a custom format without creating a new datetime object, winston logs using the local timezone.
  // Issue described here: https://github.com/winstonjs/winston/issues/421
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), json()),
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
  expressWinstonLogger,
  expressWinstonErrorLogger,
};
