#!/bin/bash
# # Create the directory for the webapp binary
# echo "-------Creating the webapp binary directory-------"
# sudo mkdir -p /usr/bin/webapp_t01
# sudo mkdir -p /tmp/webapp_t01

# echo "-------Setting read write permissions-------"
# sudo chmod 755 /tmp/webapp_t01

# #move zip file to /tmp/webapp

# Create the directory for the webapp binary
echo "-------Creating the webapp binary directory-------"
sudo mkdir -p /opt/csye6225
sudo chown csye6225:csye6225 /opt/csye6225
sudo mv /tmp/webapp.zip /opt/csye6225/

echo "-------Setting read write permissions-------"
sudo chown -R csye6225:csye6225 /opt/csye6225/
pwd 
sudo chmod 755 /opt/csye6225
cd /opt/csye6225
pwd
sudo unzip -v webapp.zip
ls
pwd
echo "Current Directory owner: $(ls -ld . | awk '{print $3}')"
echo "=============Setting Read and Excetute permissions for the directory============="
sudo chmod 755 /opt/csye6225

#move zip file to /tmp/webapp-fork