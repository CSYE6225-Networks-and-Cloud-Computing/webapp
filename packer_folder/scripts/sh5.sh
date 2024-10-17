#!/bin/bash
# Create the systemd service file for the Node.js app
sudo sh -c  'cat<<EOL | sudo tee /etc/systemd/system/webapp.service
[Unit]
Description=Node.js WebApp
After=network.target 

[Service]
ExecStart=/usr/bin/node /opt/csye6225/app.js
Restart=always
User=csye6225
Group=csye6225
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
Environment=DB_NAME=${DB_NAME}
Environment=DB_USERNAME=${DB_USERNAME}
Environment=DB_PASSWORD=${DB_PASSWORD}
Environment=DB_HOST=${DB_HOST}
Environment=DB_PORT=${DB_PORT}
Environment=APP_PORT=${APP_PORT}  # Add the PORT variable here
WorkingDirectory=/opt/csye6225

[Install]
WantedBy=multi-user.target
EOL'

# Enable and start the webapp service
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service