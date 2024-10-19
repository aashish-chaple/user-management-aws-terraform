#!/bin/bash

sudo cp /home/csye6225/myApp/webapp/app.service /etc/systemd/system/app.service

sudo chown -R csye6225:csye6225 /etc/systemd/system/app.service
sudo chmod 750 /home/csye6225/myApp

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable app.service

# Start the service
sudo systemctl start app.service

sudo systemctl status app.service