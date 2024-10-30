// logger.js
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
// const StatsD = require('statsd-client');
const StatsD = require('hot-shots');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: '/var/log/webapp.log' }),
    new WinstonCloudWatch({
      logGroupName: '/csye6225/webapp',
      logStreamName: 'webappLogStream',
      awsRegion: process.env.AWS_REGION || 'us-east-1'
    })
  ]
});

const sdc = new StatsD({
  port: 8125,
  prefix: 'webapp.',
  errorHandler: (error) => {
    logger.error('StatsD Error:', error);
  }
});

module.exports = { logger, sdc };