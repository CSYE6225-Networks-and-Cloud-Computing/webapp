#!/bin/bash
echo "-------Updating the system-------"
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install nginx -y
sudo apt-get clean