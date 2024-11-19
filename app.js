require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const authRouter = require('./route/authRoute');
const { sequelize } = require('./db/models/index');
const { checkDatabaseConnection, healthCheck } = require('./middleware/databaseCheck');
const setHeaders = require('./middleware/setHeaders');
const { logger, sdc } = require('./logger');
// const AWS = require('aws-sdk');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route ? req.route.path : req.path;
    sdc.increment(`api.${req.method}.${path}.calls`);
    sdc.timing(`api.${req.method}.${path}.time`, duration);
    logger.info(`${req.method} ${path} completed in ${duration}ms`);
  });
  next();
});

// Existing routes and middleware
const apiVersion = 'v1';
// app.use(`/${apiVersion}/user`, checkDatabaseConnection, authRouter);
app.use(`/${apiVersion}/user`, checkDatabaseConnection, (req, res, next) => {
  req.apiVersion = apiVersion;
  next();
}, authRouter);

app.head('/healthz', setHeaders, (req, res) => {
  logger.info('HEAD request to /healthz');
  sdc.increment('api.HEAD.healthz');
  return res.status(405).send();
});

// app.get('/healthz', setHeaders, (req, res) => {
//   if (Object.keys(req.query).length > 0 || req._body || Object.keys(req.body).length > 0 || req.headers['authorization'] || req.get('Content-Length') !== undefined) {
//     return res.status(400).send();
//   }
//   return healthCheck(req, res);
// });

// app.get('/healthz', setHeaders, (req, res) => {
//   const startTime = Date.now();
//   logger.info('GET request to /healthz');
//   sdc.increment('api.GET.healthz');

//   if (Object.keys(req.query).length > 0 || req._body || Object.keys(req.body).length > 0 || req.headers['authorization'] || req.get('Content-Length') !== undefined) {
//     logger.warn('Invalid request to /healthz');
//     sdc.increment('api.GET.healthz.badRequest');
//     return res.status(400).send();
//   }

//   healthCheck(req, res)
//     .then(() => {
//       const duration = Date.now() - startTime;
//       sdc.timing('api.GET.healthz.time', duration);
//       logger.info(`Healthcheck completed in ${duration}ms`);
//     })
//     .catch((error) => {
//       const duration = Date.now() - startTime;
//       sdc.timing('api.GET.healthz.time', duration);
//       logger.error(`Healthcheck failed in ${duration}ms: ${error.message}`);
//     });
// });

app.get('/healthz', setHeaders, async (req, res) => {
  console.log ("---------------apiVersion: ",apiVersion);
  
  const startTime = Date.now();
  logger.info('GET request to /healthz');
  sdc.increment('api.GET.healthz');

  if (Object.keys(req.query).length > 0 || req._body || Object.keys(req.body).length > 0 || req.headers['authorization'] || req.get('Content-Length') !== undefined) {
    logger.warn('Invalid request to /healthz');
    sdc.increment('api.GET.healthz.badRequest');
    return res.status(400).send();
  }

  try {
    await healthCheck(req, res);
    const duration = Date.now() - startTime;
    sdc.timing('api.GET.healthz.time', duration);
    logger.info(`Healthcheck completed in ${duration}ms`);
  } catch (error) {
    const duration = Date.now() - startTime;
    sdc.timing('api.GET.healthz.time', duration);
    logger.error(`Healthcheck failed in ${duration}ms: ${error.message}`);
  }
});

app.all('/healthz', setHeaders, (req, res) => {
  console.log ("---------------apiVersion: ",apiVersion);
  logger.info(`${req.method} request to /healthz`);
  sdc.increment(`api.${req.method}.healthz.methodNotAllowed`);
  return res.status(405).send();
});

app.get('*', setHeaders, (req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`);
  sdc.increment('api.notFound');
  return res.status(404).send();
});

// Database connection and server start
sequelize.sync({ alter: true })
  .then(() => {
    logger.info("Database & tables synced!");
    const PORT = process.env.APP_PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server up and running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error syncing database or starting server: ", error);
  });
  console.log("In app.js, apiVersion is:", apiVersion);
module.exports = { sequelize, app, logger, sdc};
