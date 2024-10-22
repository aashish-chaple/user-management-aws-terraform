#!/bin/bash

# Read environment variables
# DB_NAME="${DB_NAME}"
# DB_USER="${DB_USER}"
# DB_PASS="${DB_PASS}"

# Install PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Start the PostgreSQL service
sudo service postgresql start

# Create the database
sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\";"

# Create the user
sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASS';"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$DB_USER\";"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO \"$DB_USER\";"