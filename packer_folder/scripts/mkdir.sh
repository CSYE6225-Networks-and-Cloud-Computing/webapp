#!/bin/bash
# Create the directory for the webapp binary
echo "-------Creating the webapp binary directory-------"
sudo mkdir -p /usr/bin/webapp_t01
sudo mkdir -p /tmp/webapp_t01

echo "-------Setting read write permissions-------"
sudo chmod 777 /tmp/webapp_t01

#move zip file to /tmp/webapp

