require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const authRouter = require('./route/authRoute');
const { sequelize } = require('./db/models/index');
const { checkDatabaseConnection, healthCheck } = require('./middleware/databaseCheck');  // Import middleware
const setHeaders = require('./middleware/setHeaders');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// checking database connection and then onto next routes
app.use('/v2/user', checkDatabaseConnection, authRouter); 

// --- Health check route ---

// HEAD requests
app.head('/healthz', setHeaders, (req, res) => {
  // Return 405 Method Not Allowed for HEAD
  return res.status(405).send();
  // return res.status(200).send();
});

// setting response headers
app.get('/healthz', setHeaders, (req, res) => {

  if (Object.keys(req.query).length > 0 || req._body || Object.keys(req.body).length > 0 || req.headers['authorization'] || req.get('Content-Length') !== undefined) {
    return res.status(400).send(); // Return 400 Bad Request
  }
  
  return healthCheck(req, res);
});

// unsupported methods on /healthz to return 405
app.all('/healthz', setHeaders, (req, res) => {
  return res.status(405).send();
});

// no other routes are to be run and accepted
app.get('*', setHeaders, (req, res) => {
  // 404 Not Found
  return res.status(404).send();
});
  // ---  end of /healthz  ---


  // starting the server after syncing the database
sequelize.sync({ alter: true }) // bootsrapping database - this updates the table schema if made without dropping the table
.then(() => {
  console.log("Database & tables synced!");

  const PORT = process.env.APP_PORT;
  app.listen(PORT, () => {
    console.log('Server up and running on port', PORT);
  });
})
.catch((error) => {
  console.error("Error syncing database or starting server: ", error);
});

  module.exports = { sequelize, app };