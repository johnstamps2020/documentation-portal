const app = require('./app');
const { winstonLogger } = require('./controllers/loggerController');
const http = require('http');

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function getFormattedError(error) {
  const intro = 'Error in application runner (server.js):';
  return `${intro}
    CODE: ${error.code}
    MESSAGE: ${error.message}
    ERROR: ${JSON.stringify(error)}`;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    winstonLogger.error(getFormattedError(error));
  }

  var bind =
    typeof httpServerPort === 'string'
      ? 'Pipe ' + httpServerPort
      : 'Port ' + httpServerPort;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      winstonLogger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      winstonLogger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      winstonLogger.error(getFormattedError(error));
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  winstonLogger.notice('Listening on ' + bind);
}

const httpServerPort = normalizePort(process.env.PORT || '8081');

// RUN APP IN SERVER
const server = http.createServer(app);
server.listen(httpServerPort);

server.on('error', onError);
server.on('listening', onListening);
