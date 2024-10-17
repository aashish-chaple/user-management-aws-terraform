#!/bin/bash

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo -u csye6225 sh -c 'cd /opt/my-app && npm install'