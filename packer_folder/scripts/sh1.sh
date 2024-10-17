#!/bin/bash
# echo "-------Updating the system-------"
# sudo apt-get update -y
# sudo apt-get upgrade -y
# sudo apt-get install nginx -y
# sudo apt-get clean

# # Create a group and user for the web application (if not already created)
# echo "-------Creating the csye6225 group and user-------"
# sudo groupadd csye6225 || echo "Group csye6225 already exists"
# sudo useradd -s /sbin/nologin -M -g csye6225 csye6225 || echo "User csye6225 already exists"


echo "-------Updating the system-------"
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y unzip

sudo apt-get clean

echo "-------Creating the csye6225 group and user-------"
sudo groupadd csye6225 || echo "Group csye6225 already exists"
sudo useradd -s /sbin/nologin -M -g csye6225 csye6225 || echo "User csye6225 already exists"