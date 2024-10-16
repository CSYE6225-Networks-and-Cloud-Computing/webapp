#!/bin/bash

# Step 1: Update the system
echo "-------Updating the system-------"
# sudo apt-get update -y
# sudo apt-get upgrade -y

# Step 2: Install necessary tools like wget and unzip
echo "-------Installing necessary tools-------"
sudo apt-get install 

# # Step 3: Create a group and user for the web application (if not already created)
# echo "-------Creating the csye6225 group and user-------"
# sudo groupadd csye6225 || echo "Group csye6225 already exists"
# sudo useradd -s /sbin/nologin -M -g csye6225 csye6225 || echo "User csye6225 already exists"

# Step 4: Create log directories and assign ownership to the csye6225 group
# echo "-------Setting up log directories-------"
# sudo mkdir -p /var/log/webapp/
# sudo chown -R csye6225:csye6225 /var/log/webapp/

# Step 5: Install PostgreSQL
echo "-------Installing PostgreSQL-------"
sudo apt-get install -y postgresql postgresql-contrib

# Step 6: Start PostgreSQL service
echo "-------Starting PostgreSQL service-------"
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Step 7: Install Node.js and npm
echo "-------Installing Node.js and npm-------"
# curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -/
sudo apt-get install -y nodejs
sudo apt-get install -y npm

# Step 8: Install necessary Node.js packages for the project
echo "-------Installing Node.js project dependencies-------"
cd /usr/bin/webapp_t01 || exit 1
# npm install bcrypt sequelize pg pg-hstore
# npm install sequelize-cli --save-dev
# npm install 
# In your build script
npm install --unsafe-perm

# Set permissions for sequelize-cli and nodemon
sudo chmod +x ./node_modules/.bin/sequelize-cli
# sudo chmod +x ./node_modules/.bin/nodemon


# Step 9: Configure PostgreSQL and set the password for the 'postgres' user
echo "-------Configuring PostgreSQL user-------"

sudo -i -u postgres psql <<EOF
ALTER USER postgres WITH PASSWORD '${POSTGRES_PASSWORD}';
\q
EOF

# Step 10: Create the database using Sequelize
echo "-------Creating the PostgreSQL database-------"

npx sequelize-cli db:create

echo "Setup complete. The webapp is now ready to run."

echo "-------Running the Webapp-------"
# npm install --save-dev nodemon
node app.js