# Cloud-Native Web Application

This repository contains a cloud-native web application that includes a `/healthz` endpoint for monitoring the health of the application and its connection to a PostgreSQL (or MySQL) database.

## Prerequisites

Before you begin, ensure you have the following software installed on your local machine:
 
- **Node.js** (v19.x or higher)
- **npm** (comes with Node.js) 
- **PostgreSQL** database
- **Git** (for cloning the repository)
- **Curl** or **Postman** (for testing API endpoints)
- **Environment Variables**: You need to create a `.env` file in the root of your project. This file should include the following environment variables:
  
  ```bash
  APP_PORT=3000
  DB_USERNAME=your_db_username
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name
  DB_HOST=your_db_host
  DB_PORT=your_db_port
  ```

## Getting Started

### 1. Clone the Repository

To get a copy of the project locally, use Git:

```bash
git clone https://github.com/CSYE6225-Networks-and-Cloud-Computing/webapp.git
```

Navigate to the project directory:

```bash
cd your-repository-name
```

### 2. Install Dependencies

Use npm (or yarn) to install the dependencies required for the project:

```bash
npm install
```

### 3. Set Up the Database

Ensure that PostgreSQL or MySQL is installed and running on your local machine. Update the `.env` file with your database credentials.

You may need to create the database manually. For PostgreSQL:

```bash
psql -U your_db_username -c 'CREATE DATABASE your_db_name;'
```

For MySQL:

```bash
mysql -u your_db_username -p -e "CREATE DATABASE your_db_name;"
```

### 4. Run Migrations

If you're using Sequelize for database management, apply any migrations to your database:

```bash
npx sequelize db:migrate
```

### 5. Running the Application Locally

Once everything is set up, start the application:

```bash
npm start
```

Alternatively, if you're using `nodemon` for development:

```bash
npx nodemon app.js
```

The application should now be running on `http://localhost:4000` (or the port specified in the `.env` file).

### 6. Testing the `/healthz` Endpoint

To check the health of the application:

```bash
curl http://localhost:3000/healthz
```

This will return `200 OK` if the application is connected to the database or `503 Service Unavailable` if the database is not reachable.

## Build and Deploy Instructions

### Building the Application

No additional build steps are required for this Node.js application. The project is set up to run directly using `npm`. However, ensure that all dependencies are installed by running:

```bash
npm install
```

### Deploying the Application

1. **Prepare the Environment**: Ensure the target environment (server or container) has:
   - Node.js installed
   - PostgreSQL or MySQL running

2. **Deploy**:
   - Transfer the project files to the server or container.
   - Set up environment variables in a `.env` file on the server.

3. **Start the Application**:
   - Use a process manager like **PM2** for production:
     ```bash
     pm2 start app.js
     ```

   - Alternatively, run the application directly:
     ```bash
     node app.js
     ```

4. **Test the Application**:
   - Ensure that the application is running and accessible at the deployed URL by testing the `/healthz` endpoint.

## Additional Notes

- Ensure that your environment variables are secure, especially in production environments.
- This application does not include any UI, and all interactions happen through API calls.

---

### Authors

- Hir Sanat Desai (desai.hir@northeastern.edu)

