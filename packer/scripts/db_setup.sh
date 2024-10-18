#!/bin/bash

DB_NAME=$1
DB_USER=$2
DB_PASS=$3

sudo apt-get install -y postgresql postgresql-contrib
sudo service postgresql start
# Create the database
sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\";"

# Create the user
sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASS';"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$DB_USER\";"