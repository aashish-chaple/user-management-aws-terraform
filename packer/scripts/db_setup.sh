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

# Create the PostgreSQL user and database using the environment variables

# Create the user
sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASS';"

# Grant the user permission to create databases
sudo -u postgres psql -c "ALTER USER \"$DB_USER\" CREATEDB;"

# Create the database and assign the user as the owner
sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";"

# Grant all privileges on the database to the user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$DB_USER\";"