require('dotenv').config({path: `${process.cwd()}/.env` });
const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();

// establishing connection to Postgres
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, 
  retry: { max: 5 }
});

app.use(express.json({ limit: '1kb' }));

// Health check route
app.get('/healthz', async (req, res) => {

    // checking if there is any body or query being passed
    if (Object.keys(req.body).length|| Object.keys(req.query).length != 0) {
    // if there is, we will return 400 Bad Request
    return res.status(400).send();
  }

    try {
      await sequelize.authenticate();
  
      // setting headers
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
  
      // if the connection is successful, we return 200
      return res.status(200).send();
    } catch (error) {
      // setting headers 
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
  
      // if the connection is unsuccessful, we return 503
      return res.status(503).send();
    }
  });
  
  // no other methods should be allowed other than GET
  app.all('/healthz', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  
    // so we return 405
    return res.status(405).send();
  });

  // no other routes are to be run and accepted
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  
    // we return 404 for undefined routes
    return res.status(404).send();
  });
  
  const PORT = process.env.APP_PORT;
  app.listen(PORT, () => {
    console.log('Server up and running on port', PORT);
  });