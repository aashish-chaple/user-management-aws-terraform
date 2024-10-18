#!/bin/bash

set -ex

curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
echo 'Node Installed'
node -v
npm -v

# # Install Node.js and npm
# curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
# sudo apt-get install -y nodejs