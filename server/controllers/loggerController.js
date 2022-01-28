const { createLogger, format, config, transports } = require('winston');
const { combine, timestamp, label, printf, json, transform } = format;
const path = require('path');

const loggerOptions = {
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

const myFormatter = format(info => {
  info.contextMap = {
    'X-B3-ParentSpanId': 'TBD',
    'X-B3-SpanId': 'TBD',
    'X-B3-TraceId': 'TBD',
    'X-B3-Sampled': 'false',
  };
  return info;
});

const winstonLogger = createLogger({
  levels: config.syslog.levels,
  format: combine(timestamp(), myFormatter(), json()),
  exitOnError: false,
  transports: [
    new transports.File(loggerOptions.file),
    new transports.Console(loggerOptions.console),
  ],
});

winstonLogger.stream = {
  write: function(message, encoding) {
    winstonLogger.info(message);
  },
};

module.exports = winstonLogger;
