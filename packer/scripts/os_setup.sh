#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Set environment variables
export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

# Update package list and install necessary packages
sudo apt-get update

# Upgrade all installed packages
sudo apt-get upgrade -y

sudo apt install unzip curl

# Clean up unused package files
sudo apt-get clean