#!/bin/bash

set -ex

#debug
sudo pwd
sudo ls -l

sudo mkdir -p /home/csye6225/myApp

sudo ls -l /home/csye6225

sudo ls -l /tmp

# Unzip the app into the directory
sudo unzip -o /tmp/app.zip -d /home/csye6225/myApp

sudo chown -R csye6225:csye6225 /home/csye6225/myApp
sudo chmod -R 755 /home/csye6225/myApp

cd /home/csye6225/myApp 

ls -l /home/csye6225/myApp

#debug
node -v
npm -v

sudo npm install