require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const authRouter = require('./route/authRoute');
const { sequelize } = require('./db/models/index');
const { checkDatabaseConnection, healthCheck } = require('./middleware/databaseCheck');
const setHeaders = require('./middleware/setHeaders');
const { logger, sdc } = require('./logger');
const AWS = require('aws-sdk');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Middleware for logging and metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    sdc.increment(`api.${req.method}.${req.path}`);
    sdc.timing(`api.${req.method}.${req.path}.time`, duration);
    logger.info(`${req.method} ${req.path} completed in ${duration}ms`);
  });
  next();
});

// Existing routes and middleware
app.use('/v1/user', checkDatabaseConnection, authRouter);

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

module.exports = { sequelize, app, logger, sdc };

// require('dotenv').config({ path: `${process.cwd()}/.env` });
// const express = require('express');
// const authRouter = require('./route/authRoute');
// const { sequelize } = require('./db/models/index');
// const { checkDatabaseConnection, healthCheck } = require('./middleware/databaseCheck');  // Import middleware
// const setHeaders = require('./middleware/setHeaders');

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); 


// // checking database connection and then onto next routes
// app.use('/v2/user', checkDatabaseConnection, authRouter); 

// // --- Health check route ---

// // HEAD requests
// app.head('/healthz', setHeaders, (req, res) => {
//   // Return 405 Method Not Allowed for HEAD
//   return res.status(405).send();
//   // return res.status(200).send();
// });

// // setting response headers
// app.get('/healthz', setHeaders, (req, res) => {

//   if (Object.keys(req.query).length > 0 || req._body || Object.keys(req.body).length > 0 || req.headers['authorization'] || req.get('Content-Length') !== undefined) {
//     return res.status(400).send(); // Return 400 Bad Request
//   }
  
//   return healthCheck(req, res);
// });

// // unsupported methods on /healthz to return 405
// app.all('/healthz', setHeaders, (req, res) => {
//   return res.status(405).send();
// });

// // no other routes are to be run and accepted
// app.get('*', setHeaders, (req, res) => {
//   // 404 Not Found
//   return res.status(404).send();
// });
//   // ---  end of /healthz  ---


//   // starting the server after syncing the database
// sequelize.sync({ alter: true }) // bootsrapping database - this updates the table schema if made without dropping the table
// .then(() => {
//   console.log("Database & tables synced!");

//   const PORT = process.env.APP_PORT || 3000;
//   app.listen(PORT, () => {
//     console.log('Server up and running on port', PORT);
//   });
// })
// .catch((error) => {
//   console.error("Error syncing database or starting server: ", error);
// });

//   module.exports = { sequelize, app };