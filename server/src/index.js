const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { initSocket } = require('./socket/socket');

let server;

console.log(process.env.NODE_ENV,'NOIDE ENV',process.env.HTTPS)
if(process.env.NODE_ENV === 'production' || Boolean(process.env.HTTPS)){
  console.log("HHHHHHHH")
  const fs = require('fs')
  const https = require('https')
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CRT_FILE),
  }
  
  mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB at ' + config.mongoose.url);
    server = https.createServer(options,app).listen(config.port, () => {
      logger.info(`Listening on https://localhost:${config.port}`);
    });
    initSocket(server)
  });
}
else{
  mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB at ' + config.mongoose.url);
    server = app.listen(config.port, () => {
      console.log('local http')
      logger.info(`Listening on http://localhost:${config.port}`);
    });
    initSocket(server)
    
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
