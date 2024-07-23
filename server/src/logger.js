const winston = require('winston');
const config = require('./config/config');
const moment = require('moment')

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${moment().toISOString()} ${level}: ${message}`)
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: './logger/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logger/combined.log' }),
  ],
});

module.exports = logger