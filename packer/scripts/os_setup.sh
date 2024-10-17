#!/bin/bash

set -e

export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

sudo apt-get update
sudo apt-get update
sudo apt-get install -y unzip
sudo apt-get install -y curl
sudo apt-get upgrade -y

sudo apt-get clean
