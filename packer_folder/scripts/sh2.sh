#!/bin/bash
# # Install PostgreSQL
# echo "-------Installing PostgreSQL-------"
# sudo apt-get install -y postgresql postgresql-contrib

# # Start PostgreSQL service
# echo "-------Starting PostgreSQL service-------"
# sudo systemctl start postgresql
# sudo systemctl enable postgresql

# # Create the database and user
# DB_NAME="dbcreatetrial"
# DB_USER="postgres"
# DB_PASSWORD="postgres"

# # Create the database
# sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

# # Create the user (if needed)
# sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$DB_PASSWORD';"

# # Grant all privileges on the database to the user
# sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Install PostgreSQL
echo "-------Installing PostgreSQL-------"
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
echo "-------Starting PostgreSQL service-------"
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create the database and user
DB_NAME_1="user"
DB_USER_1="postgres"
DB_PASSWORD_1="postgres"

# Create the database
sudo -u postgres psql -c "CREATE DATABASE 'users';"
# echo "HIRRRR CHECK WHAT IS THE DATABASE NAME?: ${DB_NAME_1}"
# Create the user (if needed)
# echo "HIRRRR CHECK WHAT IS THE PASSWORD: ${DB_PASSWORD_1}"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Grant all privileges on the database to the user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE user TO postgres;"
