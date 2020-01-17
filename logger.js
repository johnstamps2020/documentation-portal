const ns = require('express-http-context').ns;
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${new Date().toISOString()} [${ns.get('x-b3-traceid')},${ns.get('x-b3-parentspanid')},${ns.get('x-b3-spanid')}, ${ns.get('x-b3-sampled')}] ${level}: ${message}`;
});
const options = {
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    levels: winston.config.syslog.levels,


    transports: [
        new (winston.transports.Console)({ json: true, timestamp: true, format: logFormat}),
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: true, timestamp: true }),
    ],
    exitOnError: false,
};

const logger = winston.createLogger(options);

module.exports = logger;
