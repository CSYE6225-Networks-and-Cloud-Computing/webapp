#!/bin/bash


sudo mv /opt/csye6225/webapp.service /etc/systemd/system/webapp.service
# Enable and start the webapp service
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service


# new changes
sudo systemctl status webapp.service 