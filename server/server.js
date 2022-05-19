const app = require('./app');
const { winstonLogger } = require('./controllers/loggerController');

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

const port = normalizePort(process.env.PORT || '8081');
app.set('port', port);

app.listen(port, () => {
  winstonLogger.notice('Running on PORT: ' + port);
});
