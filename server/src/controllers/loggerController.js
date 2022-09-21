import { createLogger, format, config, transports } from 'winston';
import { resolve } from 'path';
import { logger, errorLogger } from 'express-winston';
const { combine, timestamp, json } = format;
import path from 'path';

const commonWinstonOptions = {
  handleExceptions: true,
  handleRejections: true,
};

const winstonLoggerOptions = {
  file: {
    ...commonWinstonOptions,
    filename: resolve(`${__dirname}/../logs/server.log`),
    maxsize: 5242880, //5MB
    maxFiles: 5,
  },
  console: {
    ...commonWinstonOptions,
  },
};

export const winstonLogger = createLogger({
  levels: config.syslog.levels,
  level: 'notice',
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

export const expressWinstonLogger = logger({
  winstonInstance: winstonLogger,
  msg: 'HTTP {{req.method}} {{req.url}}',
});

export const expressWinstonErrorLogger = errorLogger({
  winstonInstance: winstonLogger,
  msg: 'HTTP {{req.method}} {{res.statusCode}} {{err.message}}',
});
