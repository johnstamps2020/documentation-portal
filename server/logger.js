const ns = require('express-http-context').ns;
const { createLogger, format, transports } = require('winston');
const applicationName = require(__dirname + '/package.json').name;

const { combine, errors, splat, json } = format;

const context = format(info => ({
  ...info,
  level: `${info.level}`.toUpperCase(),
  application: applicationName,
  contextMap: {
    'X-B3-ParentSpanId': ns.get('x-b3-parentspanid'),
    'X-B3-SpanId': ns.get('x-b3-spanid'),
    'X-B3-TraceId': ns.get('x-b3-traceid'),
    'X-B3-Sampled': `${ns.get('x-b3-sampled') ? ns.get('x-b3-sampled').value : undefined}`,
  },
}));

const logger = createLogger({
  format: combine(
    format.timestamp({
      format: "YYYY-MM-dd'T'hh:mm:ss.s±hh:mm",
    }),
    errors({ stack: true }),
    context(),
    splat(),
    json()
  ),
  transports: [new transports.Console({ json: true, timestamp: true })],
  exceptionHandlers: [new transports.Console({ json: true, timestamp: true })],
  exitOnError: false,
});

module.exports = logger;
