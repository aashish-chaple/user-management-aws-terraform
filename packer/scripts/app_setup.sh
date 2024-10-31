#!/bin/bash

set -ex

curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
echo 'Node Installed'
node -v
npm -v

# Install CloudWatch Agent
sudo apt-get update 
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# # Install Node.js and npm
# curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
# sudo apt-get install -y nodejs