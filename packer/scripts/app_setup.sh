#!/bin/bash

set -e

# Unzip the app into the directory
sudo -u csye6225 sh -c  "unzip /tmp/app.zip -d /opt/myApp"

#debug
echo "Files in /opt/my-app/webapp:"
sudo -u csye6225 sh -c "ls -l /opt/my-app/webapp"

sudo -u csye6225 sh -c  "cp /opt/myApp/webapp/app.service /etc/systemd/system/app.service"

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable app.service

# Start the service
sudo systemctl start app.service