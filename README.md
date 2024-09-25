# Cloud-Native Web Application

This repository contains a cloud-native web application that includes a `/healthz` endpoint for monitoring the health of the application and its connection to a PostgreSQL (or MySQL) database.

## Prerequisites

Before you begin, ensure you have the following software installed on your local machine:

- **Node.js** (v14.x or higher)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** or **MySQL** database
- **Git** (for cloning the repository)
- **Curl** or **Postman** (for testing API endpoints)
- **Environment Variables**: You need to create a `.env` file in the root of your project. This file should include the following environment variables:
  
  ```bash
  APP_PORT=4000
  DB_USERNAME=your_db_username
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name
  DB_HOST=your_db_host
  DB_PORT=your_db_port
