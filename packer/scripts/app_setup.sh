#!/bin/bash

set -ex

sudo mkdir -p /opt/myApp

# Unzip the app into the directory
sudo unzip -o /tmp/app.zip -d /opt/myApp

sudo chown -R csye6225:csye6225 /opt/myApp
sudo chmod -R 775 /opt/myApp

cd /opt/myApp 
sudo npm install