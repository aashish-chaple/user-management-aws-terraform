#!/bin/bash

set -e

# Unzip the app into the directory
sudo unzip /tmp/my-app.zip -d /opt/my-app

sudo cp /opt/my-app/webapp/app.service /etc/systemd/system/app.service

# Ensure proper ownership of all app files
sudo chown -R csye6225:csye6225 /opt/my-app

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable app.service

# Start the service
sudo systemctl start app.service