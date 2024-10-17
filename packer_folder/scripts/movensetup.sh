#!/bin/bash
# Move the unzipped web application to the target directory
echo "-------Moving the webapp binary to the target directory-------"
sudo mv /tmp/webapp_t01/* /usr/bin/webapp_t01

# Set permissions for /tmp/webapp_t01
sudo chmod -R 755 /tmp/webapp_t01  # Ensure the directory and contents are accessible

# Change the ownership of the webapp binary to the desired group (replace with your group if needed)
echo "-------Changing the ownership of the webapp binary-------"
sudo chown -R csye6225:csye6225 /usr/bin/webapp_t01

# Make the webapp binary executable
echo "-------Making the webapp binary executable-------"
sudo chmod +x /usr/bin/webapp_t01

