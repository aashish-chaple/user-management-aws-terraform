#!/bin/bash

set -e

# Unzip the app into the directory
sudo -u csye6225 sh -c  "unzip /tmp/app.zip -d /opt/my-app"

sudo -u csye6225 sh -c  "cp /opt/my-app/webapp/app.service /etc/systemd/system/app.service"

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable app.service

# Start the service
sudo systemctl start app.service