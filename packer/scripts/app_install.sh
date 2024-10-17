#!/bin/bash
cd /opt/my-app || exit

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Set environment variables
export DB_HOST="localhost" > /opt/my-app/.env
export DB_USER="myuser" > /opt/my-app/.env
export DB_PASSWORD="password" > /opt/my-app/.env
export DB_NAME="cloud_db" > /opt/my-app/.env