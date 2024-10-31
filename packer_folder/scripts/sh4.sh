#!/bin/bash
# # Step 7: Install Node.js and npm
# echo "-------Installing Node.js and npm-------"
# # curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -/
# sudo apt-get install -y nodejs
# sudo apt-get install -y npm

# sudo cp -r /tmp/webapp_t01/* /usr/bin/webapp_t01

# # Step 8: Install necessary Node.js packages for the project
# echo "-------Installing Node.js project dependencies-------"
# cd /usr/bin/webapp_t01 || exit 1
# # npm install bcrypt sequelize pg pg-hstore
# # npm install sequelize-cli --save-dev
# # npm install 
# # In your build script
# sudo npm install 
# echo "-------COMPLETE-------"
# # node app.js

# Step 7: Install Node.js and npm
echo "-------Installing Node.js and npm-------"
# curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -/
sudo apt-get install -y nodejs
sudo apt-get install -y npm

# Step 8: Install necessary Node.js packages for the project
echo "-------Installing Node.js project dependencies-------"
sudo chown -R ubuntu:ubuntu /opt/csye6225
cd /opt/csye6225 || exit 1
# npm install bcrypt sequelize pg pg-hstore
# npm install sequelize-cli --save-dev
# npm install 
# In your build script
sudo npm install 

echo "------- installing dotenv-------"
sudo npm install dotenv

echo "------- installing aws-sdk, multer, winston, and statsd-client -------"
sudo npm install aws-sdk multer winston statsd-client

echo "------- installing SendGrid -------"
sudo npm install @sendgrid/mail

echo "------- installing aws-sdk client-s3 -------"
# sudo npm install @aws-sdk/client-s3

echo "-------COMPLETE-------"
