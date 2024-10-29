// logger.js
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const StatsD = require('statsd-client');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: '/var/log/webapp.log' }),
    new WinstonCloudWatch({
      logGroupName: '/csye6225/webapp',
      logStreamName: 'application',
      awsRegion: process.env.AWS_REGION || 'us-east-1'
    })
  ]
});

const sdc = new StatsD({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.APP_PORT || 3000,
  prefix: 'webapp.'
});

module.exports = { logger, sdc };