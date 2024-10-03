const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres'
});

// checking the database connection
const checkDatabaseConnection = async (req, res, next) => {
    try {
        
        await sequelize.authenticate();
        
        // once the database connection is successful, we proceed to the next routes
        next();
    } catch (error) {
        console.error("Database connection error:", error);

        // else we return 503 error if the database server is off
        return res.status(503).json({
            status: 'fail',
            message: 'Service unavailable: Database connection issue',
        });
    }
};

// Middleware specifically for /healthz route to return 200 or 503
const healthCheck = async (req, res) => {
    try {
        // Try to authenticate with the database
        await sequelize.authenticate();
        
        // Return 200 OK if the database is available
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.status(200).send();
    } catch (error) {
        console.error("Database health check failed:", error);

        // Return 503 Service Unavailable if the database is down
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.status(503).send();
    }
};

module.exports = { checkDatabaseConnection, healthCheck };
