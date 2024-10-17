#!/bin/bash

set -e

DIR="/opt/my-app"

sudo mkdir -p $DIR

# Create a group and user csye6225 with no login shell
sudo groupadd csye6225
sudo useradd -r -g csye6225 -s /usr/sbin/nologin csye6225

# Change ownership of the directory to csye6225 user and group
sudo chown -R csye6225:csye6225 /opt/my-app